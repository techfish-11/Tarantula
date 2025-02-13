import axios from 'axios';
import { parse } from 'node-html-parser';
import Screenshot from './utils/screenshot.js';
import { DEFAULT_USER_AGENT } from './config/userAgent.js';
import RobotsParserFactory from 'robots-txt-parser';

class Crawler {
  constructor(userAgent = DEFAULT_USER_AGENT, options = {}) {
    this.userAgent = `${userAgent}`;
    this.robotsAgent = 'Tarantula';
    this.robotsParser = RobotsParserFactory({
      userAgent: this.robotsAgent,
      allowOnNeutral: false
    });
    this.extractMetadata = options.extractMetadata || false;
    this.followLinks = options.followLinks || false;
    this.maxDepth = options.maxDepth || 1;
    this.concurrentLimit = options.concurrentLimit || 5;
    this.takeScreenshots = options.takeScreenshots || false;
    this.activeRequests = 0;
    this.queue = [];
  }

  async crawl(url, depth = 0) {
    if (depth > this.maxDepth) {
      return {
        url,
        success: false,
        statusCode: null,
        error: 'Max depth exceeded'
      };
    }

    if (this.activeRequests >= this.concurrentLimit) {
      this.queue.push(() => this.crawl(url, depth));
      return;
    }

    this.activeRequests++;

    try {
      if (await this.obeyRobotsTxt(url)) {
        const response = await axios.get(url, {
          headers: {
            'User-Agent': this.userAgent,
          },
        });
        const root = parse(response.data);
        console.log(`Crawled ${url}:`, root.querySelector('title')?.text);

        if (this.extractMetadata) {
          this.extractPageMetadata(root);
        }

        if (this.followLinks) {
          const links = root.querySelectorAll('a');
          const crawlPromises = [];
          for (const link of links) {
            const href = link.getAttribute('href');
            if (href && href.startsWith('http')) {
              crawlPromises.push(this.crawl(href, depth + 1));
            }
          }
          await Promise.all(crawlPromises);
        }

        return {
          url,
          success: true,
          statusCode: response.status,
          content: response.data,
          error: null
        };
      } else {
        return {
          url,
          success: false,
          statusCode: null,
          error: 'Blocked by robots.txt'
        };
      }
    } catch (error) {
      let statusCode = null;
      if (error.response) {
        statusCode = error.response.status;
      }
      return {
        url,
        success: false,
        statusCode,
        error: error.message
      };
    } finally {
      this.activeRequests--;
      if (this.queue.length > 0) {
        const nextCrawl = this.queue.shift();
        nextCrawl();
      }
    }
  }

  async obeyRobotsTxt(url) {
    try {
      return await this.robotsParser.canCrawl(url);
    } catch (error) {
      console.error(`Error fetching robots.txt for ${url}:`, error.message);
      return false;
    }
  }

  async takeScreenshot(url) {
    try {
      const screenshot = await Screenshot.capture(url, this.userAgent);
      console.log(`Screenshot taken for ${url}`);
      return screenshot;
    } catch (error) {
      console.error(`Error taking screenshot for ${url}:`, error.message);
    }
  }

  extractPageMetadata(root) {
    const metadata = {};
    const metaTags = root.querySelectorAll('meta');
    metaTags.forEach((tag) => {
      const name = tag.getAttribute('name') || tag.getAttribute('property');
      const content = tag.getAttribute('content');
      if (name && content) {
        metadata[name] = content;
      }
    });
    console.log('Extracted metadata:', metadata);
  }
}

export default Crawler;