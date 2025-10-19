const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Referral = sequelize.define('Referral', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  referrerId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'referrer_id',
    references: {
      model: 'users',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  referredId: {
    type: DataTypes.UUID,
    allowNull: true,
    field: 'referred_id',
    references: {
      model: 'users',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  referralCode: {
    type: DataTypes.STRING(20),
    allowNull: false,
    field: 'referral_code'
  },
  status: {
    type: DataTypes.STRING(50),
    defaultValue: 'pending',
    validate: {
      isIn: [['pending', 'completed', 'expired']]
    }
  },
  rewardPoints: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'reward_points'
  },
  rewardGranted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'reward_granted'
  },
  completedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'completed_at'
  }
}, {
  timestamps: true,
  tableName: 'referrals',
  underscored: true,
  indexes: [
    { fields: ['referrer_id'] },
    { fields: ['referred_id'] },
    { fields: ['referral_code'] }
  ]
});

module.exports = Referral;
