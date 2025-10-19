const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Transaction = sequelize.define('Transaction', {
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
  investmentId: {
    type: DataTypes.UUID,
    allowNull: true,
    field: 'investment_id',
    references: {
      model: 'user_investments',
      key: 'id'
    }
  },
  type: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      isIn: [['deposit', 'withdrawal', 'transfer', 'interest', 'points_conversion', 'investment', 'refund']]
    }
  },
  amount: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false
  },
  status: {
    type: DataTypes.STRING(50),
    defaultValue: 'pending',
    validate: {
      isIn: [['pending', 'completed', 'failed', 'cancelled']]
    }
  },
  paymentMethod: {
    type: DataTypes.STRING(50),
    allowNull: true,
    field: 'payment_method',
    validate: {
      isIn: [['ghlink', 'bank_transfer', 'points', 'wallet']]
    }
  },
  ghlinkTransactionId: {
    type: DataTypes.STRING(100),
    allowNull: true,
    field: 'ghlink_transaction_id'
  },
  reference: {
    type: DataTypes.STRING(100),
    unique: true,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  fee: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  netAmount: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: true,
    field: 'net_amount'
  },
  processedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'processed_at'
  },
  metadata: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: {}
  }
}, {
  timestamps: true,
  tableName: 'transactions',
  underscored: true,
  indexes: [
    { fields: ['user_id'] },
    { fields: ['investment_id'] },
    { fields: ['type'] },
    { fields: ['status'] },
    { fields: ['reference'], unique: true }
  ]
});

module.exports = Transaction;
