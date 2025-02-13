const axios = require('axios');
const { parse } = require('node-html-parser');
const { capture } = require('./utils/screenshot');
const { DEFAULT_USER_AGENT } = require('./config/userAgent');
const RobotsParserFactory = require('robots-txt-parser');

class Crawler {
  constructor(userAgent = DEFAULT_USER_AGENT, options = {}) {
    this.userAgent = `${userAgent} (Powered by Tarantula)`;
    this.robotsAgent = 'Tarantula';
    this.robotsParser = RobotsParserFactory({
      userAgent: this.robotsAgent,
      allowOnNeutral: false
    });
    this.takeScreenshot = options.takeScreenshot || false;
    this.extractMetadata = options.extractMetadata || false;
    this.followLinks = options.followLinks || false;
    this.maxDepth = options.maxDepth || 1;
    this.concurrentLimit = options.concurrentLimit || 5;
    this.activeRequests = 0;
    this.queue = [];
  }

  async crawl(url, depth = 0) {
    if (depth > this.maxDepth) return;

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
        console.log(`Crawled ${url}:`, root.querySelector('title').text);

        if (this.extractMetadata) {
          this.extractPageMetadata(root);
        }

        if (this.takeScreenshot) {
          await this.takeScreenshot(url);
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
      } else {
        console.log(`Crawling disallowed for ${url} by robots.txt`);
      }
    } catch (error) {
      console.error(`Error during crawling ${url}:`, error.message);
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
      await capture(url);
      console.log(`Screenshot taken for ${url}`);
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

module.exports = Crawler;