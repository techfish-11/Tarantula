export default class Task {
  constructor(url) {
    this.url = url;
  }

  async execute(crawler) {
    return crawler.crawl(this.url);
  }
}