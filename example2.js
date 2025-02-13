import { Crawler, Task } from './src/index.js';

const crawler = new Crawler('Tarantula/1.0', { takeScreenshots: true });
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
