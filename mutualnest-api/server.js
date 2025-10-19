require('dotenv').config();
const app = require('./src/app');
const logger = require('./src/utils/logger');
const { testConnection } = require('./src/config/database');

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error('UNCAUGHT EXCEPTION! Shutting down...', err);
  process.exit(1);
});

const PORT = process.env.PORT || 5000;

// Initialize database connection and start server
const startServer = async () => {
  try {
    // Test database connection
    logger.info('Testing database connection...');
    const isConnected = await testConnection();

    if (!isConnected) {
      logger.error('Failed to connect to database. Exiting...');
      process.exit(1);
    }

    // Start server
    const server = app.listen(PORT, () => {
      logger.info(`
    ╔═══════════════════════════════════════════╗
    ║   MutualNest API Server Started   🚀     ║
    ╠═══════════════════════════════════════════╣
    ║  Environment: ${process.env.NODE_ENV?.padEnd(26) || 'development'.padEnd(26)}║
    ║  Port: ${PORT.toString().padEnd(34)}║
    ║  URL: http://localhost:${PORT.toString().padEnd(21)}║
    ║  Database: Connected ✓                    ║
    ╚═══════════════════════════════════════════╝
      `);
    });

    return server;
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server
let server;
startServer().then(srv => {
  server = srv;
}).catch(err => {
  logger.error('Server initialization failed:', err);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error('UNHANDLED REJECTION! Shutting down...', err);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received. Shutting down gracefully...');
  if (server) {
    server.close(() => {
      logger.info('Process terminated!');
    });
  }
});
