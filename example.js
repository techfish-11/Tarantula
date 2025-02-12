const { Crawler, Task } = require('./src/index');

const crawler = new Crawler('Tarantula/1.0');

const task = new Task('https://sakana11.org');

task.execute(crawler)
  .then(() => {
    console.log('Crawling completed!');
  })
  .catch((error) => {
    console.error('Error during crawling:', error);
  });