# Tarantula Web Crawler

Tarantula Web Crawler is a simple and flexible web crawling library that allows users to customize their bot's user agent, select URLs to crawl, fully comply with robots.txt, and take screenshots of web pages.

## Features

- Customizable user agent
- Selectable URLs for crawling
- Full compliance with robots.txt
- Screenshot functionality for web pages

## Installation

To install the Tarantula Web Crawler, use npm:

```bash
npm i tarantula-web-crawler
```

## Usage

Here is a basic example of how to use the Tarantula Web Crawler:

```javascript
const { Crawler, Task } = require('tarantula-web-crawler');
const Capture = require('tarantula-web-crawler/src/utils/screenshot');

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
```

## API

### Crawler

#### constructor(userAgent)

Creates a new Crawler instance with the specified user agent.

#### crawl(url)

Crawls the specified URL.

#### obeyRobotsTxt(url)

Parses the robots.txt file and checks if crawling is allowed for the specified URL.

#### takeScreenshot(url)

Takes a screenshot of the specified URL.

### Task

#### constructor(url)

Creates a new Task instance with the specified URL.

#### execute()

Executes the crawling task using the provided Crawler instance.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.