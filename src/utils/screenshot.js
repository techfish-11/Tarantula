import puppeteer from 'puppeteer';

export default class Screenshot {
  static async capture(url, userAgent = 'Tarantula/1.0') {
    const browser = await puppeteer.launch({ 
      headless: true,
      args: [`--user-agent=${userAgent}`]
    });
    
    const page = await browser.newPage();
    await page.setUserAgent(userAgent);
    
    await page.setRequestInterception(true);
    page.on('request', request => {
      const headers = request.headers();
      request.continue({
        headers: {
          ...headers,
          'User-Agent': userAgent
        }
      });
    });

    try {
      await page.goto(url, { 
        waitUntil: 'networkidle2',
        timeout: 30000
      });
      const screenshot = await page.screenshot();
      return screenshot;
    } finally {
      await browser.close();
    }
  }
}