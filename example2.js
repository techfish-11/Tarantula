import { Crawler, Task } from './src/index.js';
import { RobotsConfig } from './src/config/robotsConfig.js';

const robotsConfig = new RobotsConfig({
  userAgent: 'Tarantula',
  strictCheck: true,
  onlyAllowIfAllowed: true,
  maxRetries: 5,
  retryDelay: 2000,
  allowOnNeutral: false,
  logLevel: 'debug'
});

const crawler = new Crawler('Tarantula/1.0', { 
  takeScreenshots: true,
  robotsConfig: robotsConfig
});

const task = new Task('https://sakana11.org/');

(async () => {
  try {
    const result = await task.execute(crawler);
    
    if (result.success) {
      console.log('Crawling completed successfully!');
      console.log(`Status code: ${result.statusCode}`);
      if (result.screenshotPath) {
        console.log(`Screenshot saved to: ${result.screenshotPath}`);
      }
    } else {
      console.log('Crawling failed:', result.error);
      if (result.statusCode) {
        console.log(`Status code: ${result.statusCode}`);
      }
    }
  } catch (error) {
    console.error('Error during execution:', error);
  }
})();
