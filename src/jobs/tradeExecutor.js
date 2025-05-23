const trading = require('../services/trading');
const logger = require('../utils/logger');

class TradeExecutor {
  constructor() {
    this.interval = null;
  }

  start() {
    this.interval = setInterval(() => {
      trading.monitorTrades();
    }, 5 * 60 * 1000); // Check every 5 minutes
    
    logger.info('Trade executor started. Monitoring trades every 5 minutes');
  }

  stop() {
    if (this.interval) {
      clearInterval(this.interval);
      logger.info('Trade executor stopped');
    }
  }
}

module.exports = new TradeExecutor();