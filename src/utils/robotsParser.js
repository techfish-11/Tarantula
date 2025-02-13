export class RobotsParser {
  constructor(userAgent) {
    this.userAgent = userAgent.toLowerCase();
    this.rules = new Map();
  }

  parse(content) {
    const lines = content.split('\n')
      .map(line => line.trim())
      .filter(line => line && !line.startsWith('#'));

    let currentUserAgent = null;
    let currentRules = [];

    for (const line of lines) {
      const lowerLine = line.toLowerCase();
      
      if (lowerLine.startsWith('user-agent:')) {
        if (currentUserAgent && currentRules.length > 0) {
          this.rules.set(currentUserAgent, currentRules);
        }
        currentUserAgent = lowerLine.substring('user-agent:'.length).trim();
        currentRules = [];
      } else if (currentUserAgent) {
        if (lowerLine.startsWith('disallow:')) {
          currentRules.push({
            type: 'disallow',
            path: lowerLine.substring('disallow:'.length).trim()
          });
        } else if (lowerLine.startsWith('allow:')) {
          currentRules.push({
            type: 'allow',
            path: lowerLine.substring('allow:'.length).trim()
          });
        } else if (lowerLine.startsWith('crawl-delay:')) {
          const delay = parseInt(lowerLine.substring('crawl-delay:'.length).trim());
          if (!isNaN(delay)) {
            currentRules.push({
              type: 'crawl-delay',
              value: delay
            });
          }
        }
      }
    }

    if (currentUserAgent && currentRules.length > 0) {
      this.rules.set(currentUserAgent, currentRules);
    }

    return this;
  }

  isDisallowed(path) {
    // 完全一致のUser-Agentルールを優先チェック
    if (this.rules.has(this.userAgent)) {
      const rules = this.rules.get(this.userAgent);
      if (this._hasCompleteDisallow(rules)) {
        return true;
      }
      return this._checkPath(path, rules);
    }

    // '*'のルールをチェック
    if (this.rules.has('*')) {
      const rules = this.rules.get('*');
      if (this._hasCompleteDisallow(rules)) {
        return true;
      }
      return this._checkPath(path, rules);
    }

    // デフォルトでは安全のため拒否
    return true;
  }

  isExplicitlyAllowed(path) {
    path = path.toLowerCase();
    
    // 完全一致のUser-Agentルールを優先チェック
    if (this.rules.has(this.userAgent)) {
      const rules = this.rules.get(this.userAgent);
      return this._hasExplicitAllow(path, rules);
    }

    // '*'のルールをチェック
    if (this.rules.has('*')) {
      const rules = this.rules.get('*');
      return this._hasExplicitAllow(path, rules);
    }

    return false;
  }

  _hasCompleteDisallow(rules) {
    return rules.some(rule => 
      rule.type === 'disallow' && (rule.path === '/' || rule.path === ''));
  }

  _checkPath(path, rules) {
    path = path.toLowerCase();
    let isDisallowed = false;

    for (const rule of rules) {
      if (rule.type !== 'allow' && rule.type !== 'disallow') continue;

      const pattern = rule.path
        .replace(/\*/g, '.*')
        .replace(/\?/g, '\\?')
        .replace(/\$/g, '$');

      const regex = new RegExp('^' + pattern);
      
      if (regex.test(path)) {
        isDisallowed = (rule.type === 'disallow');
      }
    }

    return isDisallowed;
  }

  _hasExplicitAllow(path, rules) {
    for (const rule of rules) {
      if (rule.type !== 'allow') continue;

      const pattern = rule.path
        .replace(/\*/g, '.*')
        .replace(/\?/g, '\\?')
        .replace(/\$/g, '$');

      const regex = new RegExp('^' + pattern);
      
      if (regex.test(path)) {
        return true;
      }
    }
    return false;
  }

  getCrawlDelay() {
    if (this.rules.has(this.userAgent)) {
      const rules = this.rules.get(this.userAgent);
      const delayRule = rules.find(rule => rule.type === 'crawl-delay');
      if (delayRule) return delayRule.value;
    }

    if (this.rules.has('*')) {
      const rules = this.rules.get('*');
      const delayRule = rules.find(rule => rule.type === 'crawl-delay');
      if (delayRule) return delayRule.value;
    }

    return null;
  }
}

export default RobotsParser;