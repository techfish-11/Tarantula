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
comming soon
```

## Usage

Here is a basic example of how to use the Tarantula Web Crawler:

```javascript
const { Crawler, Task } = require('tarantula-web-crawler');

// Create a new crawler instance with a custom user agent
const crawler = new Crawler('MyCustomUserAgent/1.0');

// Create a new task with the URL you want to crawl
const task = new Task('https://example.com');

// Execute the task
task.execute(crawler)
  .then(() => {
    console.log('Crawling completed!');
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