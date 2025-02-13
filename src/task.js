import { writeFileSync } from 'fs';

export default class Task {
  constructor(url) {
    this.url = url;
  }

  async execute(crawler) {
    try {
      const response = await this.crawl(crawler);
      
      if (crawler.takeScreenshots && response.success) {
        await this.captureScreenshot(crawler, response);
      }

      return response;
    } catch (error) {
      return {
        success: false,
        statusCode: null,
        url: this.url,
        error: error.message,
        screenshotPath: null
      };
    }
  }

  async crawl(crawler) {
    const crawlResult = await crawler.crawl(this.url);
    return {
      success: crawlResult.statusCode >= 200 && crawlResult.statusCode < 300,
      statusCode: crawlResult.statusCode,
      url: this.url,
      error: crawlResult.statusCode >= 200 && crawlResult.statusCode < 300 ? null : `HTTP status ${crawlResult.statusCode}`,
      screenshotPath: null
    };
  }

  async captureScreenshot(crawler, response) {
    try {
      const screenshot = await crawler.takeScreenshot(this.url);
      if (screenshot) {
        const filename = `screenshot-${new URL(this.url).hostname}.png`;
        writeFileSync(filename, screenshot);
        response.screenshotPath = filename;
      }
    } catch (screenshotError) {
      // スクリーンショットの失敗は全体の失敗とはみなさない
      console.warn('Screenshot failed:', screenshotError.message);
    }
    return response;
  }
}