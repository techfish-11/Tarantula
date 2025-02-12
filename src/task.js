class Task {
  constructor(url) {
    this.url = url;
  }

  execute() {
    const Crawler = require('./crawler');
    const crawler = new Crawler();
    return crawler.crawl(this.url);
  }
}

module.exports = Task;