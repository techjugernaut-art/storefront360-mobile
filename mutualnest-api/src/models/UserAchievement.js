const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const UserAchievement = sequelize.define('UserAchievement', {
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
  achievementId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'achievement_id',
    references: {
      model: 'achievements',
      key: 'id'
    }
  },
  unlockedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'unlocked_at'
  }
}, {
  timestamps: false,
  tableName: 'user_achievements',
  underscored: true,
  indexes: [
    {
      unique: true,
      fields: ['user_id', 'achievement_id']
    }
  ]
});

module.exports = UserAchievement;
