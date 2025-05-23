const binance = require('./binance');
const config = require('../../config');
const logger = require('../utils/logger');

class TradingService {
  constructor() {
    this.activeTrades = new Map();
  }

  async executeTrade(symbol) {
    try {
      const price = await binance.getCurrentPrice(symbol);
      const quantity = config.trading.investmentAmount / price;
      
      const order = await binance.placeBuyOrder(symbol, quantity);
      logger.info(`Bought ${symbol}: ${quantity} @ ${price}`);
      
      this.activeTrades.set(symbol, {
        buyPrice: price,
        quantity: quantity,
        highestPrice: price,
        stopLossTriggered: false
      });
      
      return order;
    } catch (error) {
      logger.error(`Error executing trade for ${symbol}: ${error.message}`);
      throw error;
    }
  }

  async monitorTrades() {
    for (const [symbol, trade] of this.activeTrades) {
      try {
        const currentPrice = await binance.getCurrentPrice(symbol);
        
        // Update highest price
        if (currentPrice > trade.highestPrice) {
          trade.highestPrice = currentPrice;
        }
        
        // Check stop loss
        const stopLossPrice = trade.buyPrice * (1 - config.trading.stopLossPercent / 100);
        if (currentPrice <= stopLossPrice && !trade.stopLossTriggered) {
          await this.sellTrade(symbol, 'STOP_LOSS');
          continue;
        }
        
        // Here you could add trailing stop or take profit logic
        
      } catch (error) {
        logger.error(`Error monitoring trade ${symbol}: ${error.message}`);
      }
    }
  }

  async sellTrade(symbol, reason) {
    try {
      const trade = this.activeTrades.get(symbol);
      if (!trade) return;
      
      const order = await binance.placeSellOrder(symbol, trade.quantity);
      logger.info(`Sold ${symbol}: ${trade.quantity} @ ${currentPrice} (Reason: ${reason})`);
      
      this.activeTrades.delete(symbol);
      return order;
    } catch (error) {
      logger.error(`Error selling ${symbol}: ${error.message}`);
      throw error;
    }
  }
}

module.exports = new TradingService();