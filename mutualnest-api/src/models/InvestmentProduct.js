const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const InvestmentProduct = sequelize.define('InvestmentProduct', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  interestRate: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
    field: 'interest_rate',
    comment: 'Annual interest rate percentage'
  },
  minimumAmount: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
    field: 'minimum_amount'
  },
  maximumAmount: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: true,
    field: 'maximum_amount'
  },
  lockInPeriodDays: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'lock_in_period_days',
    comment: 'Lock-in period in days'
  },
  riskLevel: {
    type: DataTypes.STRING(50),
    allowNull: false,
    field: 'risk_level',
    validate: {
      isIn: [['low', 'medium', 'high']]
    }
  },
  category: {
    type: DataTypes.STRING(100),
    allowNull: true,
    validate: {
      isIn: [['savings', 'bonds', 'stocks', 'mutual_funds', 'fixed_deposit', 'other']]
    }
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'is_active'
  },
  totalInvested: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0,
    field: 'total_invested'
  },
  totalInvestors: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'total_investors'
  },
  imageUrl: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'image_url'
  },
  features: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: [],
    comment: 'Array of product features'
  },
  terms: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Terms and conditions'
  }
}, {
  timestamps: true,
  tableName: 'investment_products',
  underscored: true,
  indexes: [
    { fields: ['category'] },
    { fields: ['risk_level'] },
    { fields: ['is_active'] }
  ]
});

module.exports = InvestmentProduct;
