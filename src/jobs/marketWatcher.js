const gainerStrategy = require('../strategies/gainer');
const logger = require('../utils/logger');
const config = require('../../config');

class MarketWatcher {
  constructor() {
    this.interval = null;
  }

  start() {
    const intervalMs = this.getIntervalMs();
    this.interval = setInterval(() => {
      gainerStrategy.findAndExecuteTrades();
    }, intervalMs);
    
    logger.info(`Market watcher started. Checking every ${config.trading.checkInterval}`);
  }

  stop() {
    if (this.interval) {
      clearInterval(this.interval);
      logger.info('Market watcher stopped');
    }
  }

  getIntervalMs() {
    const { checkInterval } = config.trading;
    if (checkInterval.endsWith('m')) return parseInt(checkInterval) * 60 * 1000;
    if (checkInterval.endsWith('h')) return parseInt(checkInterval) * 60 * 60 * 1000;
    if (checkInterval.endsWith('d')) return parseInt(checkInterval) * 24 * 60 * 60 * 1000;
    return 60 * 60 * 1000; // Default to 1 hour
  }
}

module.exports = new MarketWatcher();