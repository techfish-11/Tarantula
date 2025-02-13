import { Crawler, Task, Capture } from 'tarantula-web-crawler';
import { writeFileSync } from 'fs';

const crawler = new Crawler('Tarantula/1.0', { takeScreenshot: true });
const capture = new Capture();

const task = new Task('https://sakana11.org/');

task.execute(crawler)
  .then(async () => {
    console.log('Crawling completed!');
    const screenshot = await capture.capture('https://sakana11.org/');
    writeFileSync('screenshot.png', screenshot);
    console.log('Screenshot captured and saved as screenshot.png');
  })
  .catch((error) => {
    console.error('Error during crawling:', error);
  });