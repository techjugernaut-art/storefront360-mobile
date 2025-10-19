const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const { sequelize } = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  phoneNumber: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true,
    field: 'phone_number'
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: true,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  fullName: {
    type: DataTypes.STRING(255),
    allowNull: false,
    field: 'full_name'
  },
  pinHash: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'pin_hash'
  },
  ghlinkAccountId: {
    type: DataTypes.STRING(100),
    allowNull: true,
    unique: true,
    field: 'ghlink_account_id'
  },
  ghlinkConnected: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'ghlink_connected'
  },
  kycStatus: {
    type: DataTypes.STRING(50),
    defaultValue: 'pending',
    field: 'kyc_status',
    validate: {
      isIn: [['pending', 'verified', 'rejected']]
    }
  },
  kycDocumentUrl: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'kyc_document_url'
  },
  profileImageUrl: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'profile_image_url'
  },
  dateOfBirth: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'date_of_birth'
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  // Gamification fields
  level: {
    type: DataTypes.STRING(50),
    defaultValue: 'bronze',
    validate: {
      isIn: [['bronze', 'silver', 'gold', 'platinum']]
    }
  },
  totalPoints: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'total_points'
  },
  currentStreak: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'current_streak'
  },
  longestStreak: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'longest_streak'
  },
  lastLogin: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'last_login'
  },
  role: {
    type: DataTypes.STRING(50),
    defaultValue: 'customer',
    validate: {
      isIn: [['customer', 'admin', 'super_admin']]
    }
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'is_active'
  },
  referralCode: {
    type: DataTypes.STRING(20),
    unique: true,
    field: 'referral_code'
  }
}, {
  timestamps: true,
  tableName: 'users',
  underscored: true,
  indexes: [
    { fields: ['phone_number'] },
    { fields: ['email'] },
    { fields: ['ghlink_account_id'] },
    { fields: ['referral_code'] }
  ]
});

// Hash PIN before saving
User.beforeCreate(async (user) => {
  if (user.pinHash) {
    user.pinHash = await bcrypt.hash(user.pinHash, 12);
  }

  // Generate referral code
  if (!user.referralCode) {
    user.referralCode = `MN${Date.now().toString(36).toUpperCase()}`;
  }
});

User.beforeUpdate(async (user) => {
  if (user.changed('pinHash')) {
    user.pinHash = await bcrypt.hash(user.pinHash, 12);
  }
});

// Instance method to validate PIN
User.prototype.validatePin = async function(pin) {
  if (!this.pinHash) return false;
  return await bcrypt.compare(pin, this.pinHash);
};

// Method to calculate user level based on total invested
User.prototype.calculateLevel = async function() {
  const { UserInvestment } = require('./index');
  const { Op } = require('sequelize');

  const totalInvested = await UserInvestment.sum('amount', {
    where: {
      userId: this.id,
      status: { [Op.in]: ['active', 'matured'] }
    }
  }) || 0;

  let newLevel = 'bronze';
  if (totalInvested >= parseFloat(process.env.LEVEL_PLATINUM_MIN || 20000)) {
    newLevel = 'platinum';
  } else if (totalInvested >= parseFloat(process.env.LEVEL_GOLD_MIN || 5000)) {
    newLevel = 'gold';
  } else if (totalInvested >= parseFloat(process.env.LEVEL_SILVER_MIN || 1000)) {
    newLevel = 'silver';
  }

  if (this.level !== newLevel) {
    await this.update({ level: newLevel });
  }

  return newLevel;
};

module.exports = User;
