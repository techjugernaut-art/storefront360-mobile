const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Achievement = sequelize.define('Achievement', {
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
  iconUrl: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'icon_url'
  },
  pointsReward: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'points_reward'
  },
  criteria: {
    type: DataTypes.JSONB,
    allowNull: true,
    comment: 'Flexible criteria definition for achievement unlock'
  },
  badgeColor: {
    type: DataTypes.STRING(50),
    allowNull: true,
    field: 'badge_color'
  },
  category: {
    type: DataTypes.STRING(50),
    allowNull: true,
    validate: {
      isIn: [['investment', 'streak', 'referral', 'level', 'special']]
    }
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'is_active'
  }
}, {
  timestamps: true,
  tableName: 'achievements',
  underscored: true
});

module.exports = Achievement;
