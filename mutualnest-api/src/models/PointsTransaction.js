const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const PointsTransaction = sequelize.define('PointsTransaction', {
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
  points: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  type: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      isIn: [['earned', 'redeemed', 'bonus', 'conversion', 'penalty']]
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  referenceType: {
    type: DataTypes.STRING(50),
    allowNull: true,
    field: 'reference_type',
    validate: {
      isIn: [['investment', 'login_streak', 'referral', 'achievement', 'daily_login', 'other']]
    }
  },
  referenceId: {
    type: DataTypes.UUID,
    allowNull: true,
    field: 'reference_id'
  }
}, {
  timestamps: true,
  tableName: 'points_transactions',
  underscored: true,
  createdAt: 'created_at',
  updatedAt: false,
  indexes: [
    { fields: ['user_id'] },
    { fields: ['type'] },
    { fields: ['reference_type'] }
  ]
});

module.exports = PointsTransaction;
