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
```

## API

### Crawler

#### constructor(userAgent, options)

Creates a new Crawler instance with the specified user agent and options.

Options:
- `extractMetadata`: Extract metadata from pages (default: false)
- `followLinks`: Follow and crawl links on pages (default: false)
- `maxDepth`: Maximum depth for link following (default: 1)
- `concurrentLimit`: Maximum concurrent requests (default: 5)
- `takeScreenshots`: Enable screenshot capture (default: false)

#### crawl(url)

Crawls the specified URL and returns a response object:
```javascript
{
  success: boolean,      // true if status code is 2xx
  statusCode: number,    // HTTP status code
  url: string,          // crawled URL
  error: string | null, // error message if failed
  content: string       // page content if successful
}
```

#### obeyRobotsTxt(url)

Parses the robots.txt file and checks if crawling is allowed for the specified URL.

#### takeScreenshot(url)

Takes a screenshot of the specified URL.

### Task

#### constructor(url)

Creates a new Task instance with the specified URL.

#### execute(crawler)

Executes the crawling task using the provided Crawler instance. Returns a response object:
```javascript
{
  success: boolean,         // true if status code is 2xx
  statusCode: number,       // HTTP status code
  url: string,             // crawled URL
  error: string | null,    // error message if failed
  screenshotPath: string | null  // path to screenshot if captured
}
```

#### crawl(crawler)

Internal method that handles the crawling operation.

#### captureScreenshot(crawler, response)

Internal method that handles the screenshot capture operation.

## Example

Here's an example showing how to use the updated API:

```javascript
import { Crawler, Task } from 'tarantula-web-crawler';

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
```

## License

This project is licensed under the MIT License. See the LICENSE file for more details.