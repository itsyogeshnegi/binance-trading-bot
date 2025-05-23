require('dotenv').config();
const express = require('express');
const marketWatcher = require('./jobs/marketWatcher');
const tradeExecutor = require('./jobs/tradeExecutor');
const logger = require('./utils/logger');

const app = express();
const PORT = process.env.PORT || 3000;

// Start jobs
marketWatcher.start();
tradeExecutor.start();

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'running' });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received. Shutting down gracefully...');
  marketWatcher.stop();
  tradeExecutor.stop();
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT received. Shutting down gracefully...');
  marketWatcher.stop();
  tradeExecutor.stop();
  process.exit(0);
});

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});