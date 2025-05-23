const Binance = require('binance-api-node').default;
const { binance } = require('../../config/keys');

const client = Binance({
  apiKey: binance.apiKey,
  apiSecret: binance.apiSecret
});

module.exports = {
  getMarketData: async () => {
    return client.prices();
  },
  
  get24hrGainers: async () => {
    const tickers = await client.dailyStats();
    return tickers
      .filter(t => parseFloat(t.priceChangePercent) > 0)
      .sort((a, b) => parseFloat(b.priceChangePercent) - parseFloat(a.priceChangePercent));
  },
  
  placeBuyOrder: async (symbol, quantity) => {
    return client.order({
      symbol: symbol,
      side: 'BUY',
      type: 'MARKET',
      quantity: quantity
    });
  },
  
  placeSellOrder: async (symbol, quantity) => {
    return client.order({
      symbol: symbol,
      side: 'SELL',
      type: 'MARKET',
      quantity: quantity
    });
  },
  
  getAccountInfo: async () => {
    return client.accountInfo();
  }
};