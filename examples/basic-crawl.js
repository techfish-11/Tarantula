import { Crawler, RobotsConfig } from './src/index.js';

/**
 * このファイルは、一般的なウェブサイトの巡回シナリオを示しています。
 * User-agent: Tarantula としてrobots.txtを完全に遵守します。
 */

// 厳格な設定のrobots.txtパーサー
const robotsConfig = new RobotsConfig({
  userAgent: 'Tarantula',
  strictCheck: true,
  onlyAllowIfAllowed: true,
  maxRetries: 3,
  retryDelay: 2000,
  allowOnNeutral: false,
  logLevel: 'debug'
});

// クローラーの初期化
const crawler = new Crawler('Tarantula/1.0', {
  robotsConfig,
  takeScreenshots: true,
  extractMetadata: true,
  followLinks: false,
  maxDepth: 1,
  concurrentLimit: 2  // 同時リクエスト数を制限
});

// クロール対象のURLリスト
const urls = [
  'https://example.com',
  'https://example.org',
  'https://example.net'
];

// クロールの実行
(async () => {
  console.log('Starting crawl with Tarantula user-agent...');
  
  for (const url of urls) {
    try {
      console.log(`\nProcessing: ${url}`);
      const result = await crawler.crawl(url);
      
      if (result.success) {
        console.log(`✓ Successfully crawled ${url}`);
        console.log(`Status code: ${result.statusCode}`);
      } else {
        console.log(`✗ Failed to crawl ${url}`);
        console.log(`Error: ${result.error}`);
        if (result.error.includes('robots.txt')) {
          console.log('Skipping due to robots.txt restrictions');
        }
      }
    } catch (error) {
      console.error(`Error processing ${url}:`, error.message);
    }
    
    // サイト間の待機時間を設定
    await new Promise(resolve => setTimeout(resolve, 5000));
  }
  
  console.log('\nCrawl completed.');
})();