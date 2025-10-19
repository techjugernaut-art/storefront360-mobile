const { sequelize } = require('../config/database');

// Import all models
const User = require('./User');
const InvestmentProduct = require('./InvestmentProduct');
const UserInvestment = require('./UserInvestment');
const Transaction = require('./Transaction');
const Achievement = require('./Achievement');
const UserAchievement = require('./UserAchievement');
const PointsTransaction = require('./PointsTransaction');
const Referral = require('./Referral');

// Define associations

// User <-> UserInvestment (One-to-Many)
User.hasMany(UserInvestment, { foreignKey: 'userId', as: 'investments' });
UserInvestment.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// InvestmentProduct <-> UserInvestment (One-to-Many)
InvestmentProduct.hasMany(UserInvestment, { foreignKey: 'productId', as: 'investments' });
UserInvestment.belongsTo(InvestmentProduct, { foreignKey: 'productId', as: 'product' });

// User <-> Transaction (One-to-Many)
User.hasMany(Transaction, { foreignKey: 'userId', as: 'transactions' });
Transaction.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// UserInvestment <-> Transaction (One-to-Many)
UserInvestment.hasMany(Transaction, { foreignKey: 'investmentId', as: 'transactions' });
Transaction.belongsTo(UserInvestment, { foreignKey: 'investmentId', as: 'investment' });

// User <-> PointsTransaction (One-to-Many)
User.hasMany(PointsTransaction, { foreignKey: 'userId', as: 'pointsTransactions' });
PointsTransaction.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// User <-> Achievement (Many-to-Many through UserAchievement)
User.belongsToMany(Achievement, { through: UserAchievement, foreignKey: 'userId', as: 'achievements' });
Achievement.belongsToMany(User, { through: UserAchievement, foreignKey: 'achievementId', as: 'users' });

// User <-> UserAchievement (One-to-Many)
User.hasMany(UserAchievement, { foreignKey: 'userId', as: 'userAchievements' });
UserAchievement.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Achievement.hasMany(UserAchievement, { foreignKey: 'achievementId', as: 'userAchievements' });
UserAchievement.belongsTo(Achievement, { foreignKey: 'achievementId', as: 'achievement' });

// User <-> Referral (Referrer - One-to-Many)
User.hasMany(Referral, { foreignKey: 'referrerId', as: 'referrals' });
Referral.belongsTo(User, { foreignKey: 'referrerId', as: 'referrer' });

// User <-> Referral (Referred - One-to-One)
User.hasOne(Referral, { foreignKey: 'referredId', as: 'referredBy' });
Referral.belongsTo(User, { foreignKey: 'referredId', as: 'referred' });

// Export all models and sequelize
module.exports = {
  sequelize,
  User,
  InvestmentProduct,
  UserInvestment,
  Transaction,
  Achievement,
  UserAchievement,
  PointsTransaction,
  Referral
};
