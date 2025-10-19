const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const { errorHandler, AppError } = require('./middleware/errorHandler');
const logger = require('./utils/logger');

// Initialize express app
const app = express();

// Trust proxy (required for Heroku)
app.set('trust proxy', 1);

// Security middleware
app.use(helmet());

// CORS configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL || '*',
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Response compression
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: 'Too many requests from this IP, please try again later',
  standardHeaders: true,
  legacyHeaders: false
});

// Apply rate limiting to all API routes
app.use('/api/', limiter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'MutualNest API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

// Welcome route
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Welcome to MutualNest Investment Platform API',
    version: '1.0.0',
    documentation: '/api/docs'
  });
});

// API routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/products', require('./routes/products.routes'));
app.use('/api/investments', require('./routes/investments.routes'));
app.use('/api/transactions', require('./routes/transactions.routes'));
app.use('/api/ghlink', require('./routes/ghlink.routes'));
app.use('/api/gamification', require('./routes/gamification.routes'));
app.use('/api/points', require('./routes/points.routes'));
app.use('/api/referrals', require('./routes/referrals.routes'));
app.use('/api/admin', require('./routes/admin.routes'));

// Handle undefined routes
app.use((req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

// Global error handler
app.use(errorHandler);

module.exports = app;
