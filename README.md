# Tarantula

A strict robots.txt compliant web crawler written in JavaScript.

## Features

- Full robots.txt compliance with strict enforcement
- Customizable robots.txt handling policies
- Configurable crawl delays
- Screenshot capability with automatic file saving
- Concurrent request management with queue system
- Metadata extraction from meta tags
- Link following with depth control
- Detailed response information including status codes
- Robust error handling and retry mechanisms
- Built-in rate limiting

## Installation

```bash
npm install tarantula-crawler
```

## Basic Usage

```javascript
import { Crawler, Task } from 'tarantula-crawler';

// Basic crawling
const crawler = new Crawler('Tarantula/1.0');
const task = new Task('https://example.com');
const result = await task.execute(crawler);
console.log(result);
// Result includes: success, statusCode, url, error, screenshotPath

// Crawling with screenshots
const crawlerWithScreenshots = new Crawler('Tarantula/1.0', { 
  takeScreenshots: true 
});
const screenshotTask = new Task('https://example.com');
const screenshotResult = await screenshotTask.execute(crawlerWithScreenshots);
// Screenshot will be saved as screenshot-example.com.png
```

## Advanced Configuration

### Robots.txt Configuration

The crawler provides extensive configuration options for robots.txt handling through the `RobotsConfig` class:

```javascript
import { Crawler, RobotsConfig } from 'tarantula-crawler';

const robotsConfig = new RobotsConfig({
  userAgent: 'Tarantula',              // User-agent for robots.txt rules
  strictCheck: true,                   // Enable strict rule checking
  onlyAllowIfAllowed: true,           // Require explicit Allow rules
  maxRetries: 3,                       // Maximum retries for fetching robots.txt
  retryDelay: 1000,                    // Delay between retries (ms)
  allowOnNeutral: false,               // Behavior when robots.txt is unavailable
  logLevel: 'debug',                   // Logging verbosity
  maxCacheTime: 3600000,               // Cache duration (ms)
  ignoreInvalidRules: false            // Invalid rules handling
});

const crawler = new Crawler('Tarantula/1.0', { 
  robotsConfig,
  takeScreenshots: true
});
```

### Robots.txt Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| userAgent | string | 'Tarantula' | User-agent string for robots.txt rules |
| strictCheck | boolean | true | Enable strict rule checking |
| onlyAllowIfAllowed | boolean | true | Require explicit Allow rules |
| maxRetries | number | 3 | Maximum retries for fetching robots.txt |
| retryDelay | number | 1000 | Delay between retries in milliseconds |
| allowOnNeutral | boolean | false | Allow crawling when robots.txt is unavailable |
| logLevel | string | 'debug' | Logging verbosity level |
| maxCacheTime | number | 3600000 | robots.txt cache duration in milliseconds |
| ignoreInvalidRules | boolean | false | Whether to ignore invalid robots.txt rules |

### Crawler Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| extractMetadata | boolean | false | Extract meta tags from pages |
| followLinks | boolean | false | Follow links on crawled pages |
| maxDepth | number | 1 | Maximum depth for link following |
| concurrentLimit | number | 5 | Maximum concurrent requests |
| takeScreenshots | boolean | false | Take screenshots of pages |

### Response Format

The crawler returns detailed information about each crawl:

```javascript
{
  success: boolean,       // Whether the crawl was successful
  statusCode: number,     // HTTP status code (if available)
  url: string,           // Crawled URL
  error: string | null,  // Error message if failed
  screenshotPath: string // Path to saved screenshot (if enabled)
}
```

## Robots.txt Processing

### How It Works

The crawler strictly follows these steps when processing robots.txt:

1. Fetches robots.txt from the target domain
2. Parses the rules specific to the "Tarantula" user-agent
3. Checks for complete site blocks (`Disallow: /`)
4. Validates path-specific rules
5. Enforces any specified crawl delays

### Example robots.txt Rules

```
# Complete block for Tarantula
User-agent: Tarantula
Disallow: /

# Selective permissions
User-agent: Tarantula
Allow: /public/
Disallow: /private/
Crawl-delay: 5

# Wildcard rules
User-agent: *
Disallow: /*.pdf$
```

### Error Handling

The crawler handles various robots.txt scenarios:

- Missing robots.txt: Defaults to disallowing crawling (configurable via `allowOnNeutral`)
- Network errors: Retries with exponential backoff
- Invalid rules: Strict parsing with configurable tolerance
- Timeout issues: Configurable retry attempts

### Validation Examples

```javascript
// Strict validation requiring explicit allows
const strictConfig = new RobotsConfig({
  strictCheck: true,
  onlyAllowIfAllowed: true,
  allowOnNeutral: false
});

// More permissive configuration
const permissiveConfig = new RobotsConfig({
  strictCheck: false,
  onlyAllowIfAllowed: false,
  allowOnNeutral: true
});

// With custom retry logic
const resilientConfig = new RobotsConfig({
  maxRetries: 5,
  retryDelay: 2000,
  maxCacheTime: 7200000 // 2 hours
});
```

## Metadata Extraction

When enabled, the crawler can automatically extract meta tags from pages:

```javascript
const crawler = new Crawler('Tarantula/1.0', {
  extractMetadata: true
});
// Meta tags will be automatically extracted and logged
```

## Link Following

The crawler can automatically follow links found on pages:

```javascript
const crawler = new Crawler('Tarantula/1.0', {
  followLinks: true,
  maxDepth: 2  // Follow links up to 2 levels deep
});
```

## Concurrent Request Management

The crawler automatically manages concurrent requests:

```javascript
const crawler = new Crawler('Tarantula/1.0', {
  concurrentLimit: 3  // Maximum 3 concurrent requests
});
// Requests exceeding the limit are automatically queued
```

## Screenshot Capture

The crawler can automatically capture and save screenshots:

```javascript
const crawler = new Crawler('Tarantula/1.0', {
  takeScreenshots: true
});
// Screenshots are saved as screenshot-[hostname].png
```

## Error Handling

The crawler provides robust error handling:

- Network errors: Automatically retried with configurable attempts
- Invalid robots.txt: Configurable strict or lenient handling
- Rate limiting: Automatic queue management
- Screenshot failures: Non-fatal, crawl continues
- Invalid URLs: Proper error reporting

### Error Response Example

```javascript
{
  success: false,
  statusCode: null,
  url: "https://example.com",
  error: "HTTP status 404",
  screenshotPath: null
}
```

## Debugging

### Logging Levels

The crawler provides detailed logging for robots.txt processing:

- debug: Full robots.txt content and parsing details
- info: Rule matching and decisions
- warn: Retry attempts and potential issues
- error: Access violations and critical failures

Enable debug logging:

```javascript
const robotsConfig = new RobotsConfig({
  logLevel: 'debug'
});
```

## Examples

### Basic Crawling with Screenshots

```javascript
const crawler = new Crawler('Tarantula/1.0', { 
  takeScreenshots: true 
});
const task = new Task('https://example.com');
const result = await task.execute(crawler);
```

### Strict Robots.txt Compliance

```javascript
const robotsConfig = new RobotsConfig({
  userAgent: 'Tarantula',
  strictCheck: true,
  onlyAllowIfAllowed: true
});

const crawler = new Crawler('Tarantula/1.0', { 
  robotsConfig,
  maxDepth: 2,
  followLinks: true
});
```

## Examples Directory

The `examples` directory contains practical usage scenarios:

### basic-crawl.js
A complete example demonstrating:
- Strict robots.txt compliance
- Error handling
- Rate limiting
- Metadata extraction
- Screenshot capture

Run the example:
```bash
node examples/basic-crawl.js
```

## Best Practices

### Robots.txt Compliance

- Always use the `Tarantula` user-agent for consistency
- Set appropriate delays between requests
- Respect `Crawl-delay` directives
- Use strict mode for complete compliance
- Implement proper error handling for missing robots.txt files

### Rate Limiting

- Set reasonable `concurrentLimit` values
- Add delays between site transitions
- Respect server response headers
- Monitor response times and adjust accordingly

### Performance Optimization

- Set appropriate `concurrentLimit` based on target server capacity
- Use `maxDepth` to control crawl scope
- Enable `extractMetadata` only when needed
- Configure appropriate `maxCacheTime` for robots.txt

### Memory Management

- Process crawled data in streams when possible
- Limit concurrent requests appropriately
- Clear screenshot data after processing

### Respectful Crawling

- Always set a descriptive User-Agent
- Respect robots.txt rules strictly
- Implement appropriate delays between requests
- Monitor and respect server response headers

## License

MIT License - see LICENSE file for details