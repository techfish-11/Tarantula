const { Crawler, Task } = require('./src/index');
const Capture = require('./src/utils/screenshot');

const crawler = new Crawler('Tarantula/1.0', { takeScreenshot: true });
const capture = new Capture();

const task = new Task('https://sakana11.org/');

task.execute(crawler)
  .then(async () => {
    console.log('Crawling completed!');
    const screenshot = await capture.capture('https://sakana11.org/');
    require('fs').writeFileSync('screenshot.png', screenshot);
    console.log('Screenshot captured and saved as screenshot.png');
  })
  .catch((error) => {
    console.error('Error during crawling:', error);
  });