export class RobotsConfig {
  constructor(options = {}) {
    this.userAgent = options.userAgent || 'Tarantula';
    this.allowOnNeutral = options.allowOnNeutral ?? false;
    this.maxCacheTime = options.maxCacheTime ?? 3600000;
    this.retryDelay = options.retryDelay ?? 1000;
    this.maxRetries = options.maxRetries ?? 3;
    this.logLevel = options.logLevel || 'debug';
    this.strictCheck = options.strictCheck ?? true;
    this.ignoreInvalidRules = options.ignoreInvalidRules ?? false;
    this.onlyAllowIfAllowed = options.onlyAllowIfAllowed ?? true;
  }

  static getDefault() {
    return new RobotsConfig();
  }

  merge(options = {}) {
    return new RobotsConfig({
      ...this.toJSON(),
      ...options
    });
  }

  toJSON() {
    return {
      userAgent: this.userAgent,
      allowOnNeutral: this.allowOnNeutral,
      maxCacheTime: this.maxCacheTime,
      retryDelay: this.retryDelay,
      maxRetries: this.maxRetries,
      logLevel: this.logLevel,
      strictCheck: this.strictCheck,
      ignoreInvalidRules: this.ignoreInvalidRules,
      onlyAllowIfAllowed: this.onlyAllowIfAllowed
    };
  }
}

export const DEFAULT_ROBOTS_CONFIG = RobotsConfig.getDefault();

export default DEFAULT_ROBOTS_CONFIG;