const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const UserInvestment = sequelize.define('UserInvestment', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'user_id',
    references: {
      model: 'users',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  productId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'product_id',
    references: {
      model: 'investment_products',
      key: 'id'
    }
  },
  amount: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false
  },
  interestRate: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
    field: 'interest_rate',
    comment: 'Interest rate locked at time of investment'
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    field: 'start_date'
  },
  maturityDate: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'maturity_date'
  },
  status: {
    type: DataTypes.STRING(50),
    defaultValue: 'active',
    validate: {
      isIn: [['active', 'matured', 'withdrawn', 'cancelled']]
    }
  },
  currentValue: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: true,
    field: 'current_value',
    comment: 'Current value with accumulated interest'
  },
  profit: {
    type: DataTypes.DECIMAL(12, 2),
    defaultValue: 0,
    comment: 'Total profit earned'
  },
  autoReinvest: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'auto_reinvest'
  },
  withdrawnAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'withdrawn_at'
  },
  withdrawnAmount: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: true,
    field: 'withdrawn_amount'
  }
}, {
  timestamps: true,
  tableName: 'user_investments',
  underscored: true,
  indexes: [
    { fields: ['user_id'] },
    { fields: ['product_id'] },
    { fields: ['status'] },
    { fields: ['maturity_date'] }
  ]
});

// Method to calculate current value
UserInvestment.prototype.calculateCurrentValue = function() {
  const daysSinceStart = Math.floor((Date.now() - new Date(this.startDate)) / (1000 * 60 * 60 * 24));
  const annualRate = parseFloat(this.interestRate) / 100;
  const dailyRate = annualRate / 365;
  const interest = parseFloat(this.amount) * dailyRate * daysSinceStart;
  const currentValue = parseFloat(this.amount) + interest;

  return {
    currentValue: currentValue.toFixed(2),
    profit: interest.toFixed(2),
    daysSinceStart
  };
};

module.exports = UserInvestment;
