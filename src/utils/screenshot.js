import puppeteer from 'puppeteer';

export default class Capture {
  constructor(userAgent) {
    this.userAgent = userAgent || 'Tarantula/1.0';
  }

  async capture(url) {
    const browser = await puppeteer.launch({ 
      headless: true,
      // Set user agent at browser level
      args: [`--user-agent=${this.userAgent}`]
    });
    
    const page = await browser.newPage();
    
    // Set user agent at page level
    await page.setUserAgent(this.userAgent);
    
    // Intercept all requests to ensure consistent user agent
    await page.setRequestInterception(true);
    page.on('request', request => {
      const headers = request.headers();
      headers['User-Agent'] = this.userAgent;
      // Keep other headers but override user agent
      request.continue({
        headers: {
          ...headers,
          'User-Agent': this.userAgent
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