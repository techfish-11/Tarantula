const axios = require('axios');
const { parse } = require('node-html-parser');
const { capture } = require('./utils/screenshot');
const { DEFAULT_USER_AGENT } = require('./config/userAgent');
const robotsParser = require('robots-parser');

class Crawler {
  constructor(userAgent = DEFAULT_USER_AGENT) {
    this.userAgent = `${userAgent} (Powered by Tarantula)`;
    this.robotsParser = robotsParser;
  }

  async crawl(url) {
    if (await this.obeyRobotsTxt(url)) {
      try {
        const response = await axios.get(url, {
          headers: {
            'User-Agent': this.userAgent,
          },
        });
        const root = parse(response.data);
        console.log(`Crawled ${url}:`, root.querySelector('title').text);
        await this.takeScreenshot(url);
      } catch (error) {
        console.error(`Error crawling ${url}:`, error.message);
      }
    } else {
      console.log(`Crawling disallowed for ${url} by robots.txt`);
    }
  }

  async obeyRobotsTxt(url) {
    const robotsUrl = new URL('/robots.txt', url).href;
    const robotsTxt = await axios.get(robotsUrl);
    const robots = this.robotsParser(robotsUrl, robotsTxt.data);
    return robots.isAllowed(url, this.userAgent);
  }

  async takeScreenshot(url) {
    await capture(url);
  }
}

module.exports = Crawler;