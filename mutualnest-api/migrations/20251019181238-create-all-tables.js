'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Create users table
    await queryInterface.createTable('users', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      phone_number: {
        type: Sequelize.STRING(20),
        allowNull: false,
        unique: true
      },
      email: {
        type: Sequelize.STRING(255),
        allowNull: true,
        unique: true
      },
      full_name: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      pin_hash: {
        type: Sequelize.STRING,
        allowNull: true
      },
      ghlink_account_id: {
        type: Sequelize.STRING(100),
        allowNull: true,
        unique: true
      },
      ghlink_connected: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      kyc_status: {
        type: Sequelize.STRING(50),
        defaultValue: 'pending'
      },
      kyc_document_url: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      profile_image_url: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      date_of_birth: {
        type: Sequelize.DATE,
        allowNull: true
      },
      address: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      level: {
        type: Sequelize.STRING(50),
        defaultValue: 'bronze'
      },
      total_points: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      current_streak: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      longest_streak: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      last_login: {
        type: Sequelize.DATE,
        allowNull: true
      },
      role: {
        type: Sequelize.STRING(50),
        defaultValue: 'customer'
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      referral_code: {
        type: Sequelize.STRING(20),
        unique: true
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      }
    });

    // Create investment_products table
    await queryInterface.createTable('investment_products', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      name: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      interest_rate: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: false
      },
      minimum_amount: {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: false
      },
      maximum_amount: {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: true
      },
      lock_in_period_days: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      risk_level: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      category: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      total_invested: {
        type: Sequelize.DECIMAL(15, 2),
        defaultValue: 0
      },
      total_investors: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      image_url: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      features: {
        type: Sequelize.JSONB,
        allowNull: true
      },
      terms: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      }
    });

    // Create user_investments table
    await queryInterface.createTable('user_investments', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      product_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'investment_products',
          key: 'id'
        }
      },
      amount: {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: false
      },
      interest_rate: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: false
      },
      start_date: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      maturity_date: {
        type: Sequelize.DATE,
        allowNull: false
      },
      status: {
        type: Sequelize.STRING(50),
        defaultValue: 'active'
      },
      current_value: {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: true
      },
      profit: {
        type: Sequelize.DECIMAL(12, 2),
        defaultValue: 0
      },
      auto_reinvest: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      withdrawn_at: {
        type: Sequelize.DATE,
        allowNull: true
      },
      withdrawn_amount: {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: true
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      }
    });

    // Create transactions table
    await queryInterface.createTable('transactions', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      investment_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'user_investments',
          key: 'id'
        }
      },
      type: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      amount: {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: false
      },
      status: {
        type: Sequelize.STRING(50),
        defaultValue: 'pending'
      },
      payment_method: {
        type: Sequelize.STRING(50),
        allowNull: true
      },
      ghlink_transaction_id: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      reference: {
        type: Sequelize.STRING(100),
        unique: true,
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      fee: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0
      },
      net_amount: {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: true
      },
      processed_at: {
        type: Sequelize.DATE,
        allowNull: true
      },
      metadata: {
        type: Sequelize.JSONB,
        allowNull: true
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      }
    });

    // Create achievements table
    await queryInterface.createTable('achievements', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      name: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      icon_url: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      points_reward: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      criteria: {
        type: Sequelize.JSONB,
        allowNull: true
      },
      badge_color: {
        type: Sequelize.STRING(50),
        allowNull: true
      },
      category: {
        type: Sequelize.STRING(50),
        allowNull: true
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      }
    });

    // Create user_achievements table
    await queryInterface.createTable('user_achievements', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      achievement_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'achievements',
          key: 'id'
        }
      },
      unlocked_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });

    // Create points_transactions table
    await queryInterface.createTable('points_transactions', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      points: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      type: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      reference_type: {
        type: Sequelize.STRING(50),
        allowNull: true
      },
      reference_id: {
        type: Sequelize.UUID,
        allowNull: true
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      }
    });

    // Create referrals table
    await queryInterface.createTable('referrals', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      referrer_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      referred_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      referral_code: {
        type: Sequelize.STRING(20),
        allowNull: false
      },
      status: {
        type: Sequelize.STRING(50),
        defaultValue: 'pending'
      },
      reward_points: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      reward_granted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      completed_at: {
        type: Sequelize.DATE,
        allowNull: true
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      }
    });

    // Add indexes
    await queryInterface.addIndex('users', ['phone_number']);
    await queryInterface.addIndex('users', ['email']);
    await queryInterface.addIndex('users', ['ghlink_account_id']);
    await queryInterface.addIndex('users', ['referral_code']);

    await queryInterface.addIndex('investment_products', ['category']);
    await queryInterface.addIndex('investment_products', ['risk_level']);
    await queryInterface.addIndex('investment_products', ['is_active']);

    await queryInterface.addIndex('user_investments', ['user_id']);
    await queryInterface.addIndex('user_investments', ['product_id']);
    await queryInterface.addIndex('user_investments', ['status']);
    await queryInterface.addIndex('user_investments', ['maturity_date']);

    await queryInterface.addIndex('transactions', ['user_id']);
    await queryInterface.addIndex('transactions', ['investment_id']);
    await queryInterface.addIndex('transactions', ['type']);
    await queryInterface.addIndex('transactions', ['status']);

    await queryInterface.addIndex('points_transactions', ['user_id']);
    await queryInterface.addIndex('points_transactions', ['type']);
    await queryInterface.addIndex('points_transactions', ['reference_type']);

    await queryInterface.addIndex('referrals', ['referrer_id']);
    await queryInterface.addIndex('referrals', ['referred_id']);
    await queryInterface.addIndex('referrals', ['referral_code']);

    await queryInterface.addIndex('user_achievements', ['user_id', 'achievement_id'], { unique: true });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('referrals');
    await queryInterface.dropTable('points_transactions');
    await queryInterface.dropTable('user_achievements');
    await queryInterface.dropTable('achievements');
    await queryInterface.dropTable('transactions');
    await queryInterface.dropTable('user_investments');
    await queryInterface.dropTable('investment_products');
    await queryInterface.dropTable('users');
  }
};
