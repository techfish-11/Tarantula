const puppeteer = require('puppeteer');

class Capture {
  async capture(url) {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });
    const screenshot = await page.screenshot();
    await browser.close();
    return screenshot;
  }
}

module.exports = Capture;