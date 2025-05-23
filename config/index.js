module.exports = {
  trading: {
    stopLossPercent: 10,       // 10% stop loss
    takeProfitPercent: null,   // Let profits run
    investmentAmount: 100,     // USD amount per trade
    maxActiveTrades: 5,        // Maximum concurrent trades
    checkInterval: '1h'        // Check market every hour
  }
};