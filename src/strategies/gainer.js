const binance = require('../services/binance');
const trading = require('../services/trading');
const config = require('../../config');
const logger = require('../utils/logger');

class GainerStrategy {
  async findAndExecuteTrades() {
    try {
      // Get top gainers
      const gainers = await binance.get24hrGainers();
      const topGainers = gainers.slice(0, 3); // Get top 3 gainers
      
      // Execute trades for top gainers
      for (const gainer of topGainers) {
        if (trading.activeTrades.size >= config.trading.maxActiveTrades) break;
        if (!trading.activeTrades.has(gainer.symbol)) {
          await trading.executeTrade(gainer.symbol);
        }
      }
    } catch (error) {
      logger.error(`Error in gainer strategy: ${error.message}`);
    }
  }
}

module.exports = new GainerStrategy();