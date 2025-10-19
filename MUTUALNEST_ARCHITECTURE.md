# MutualNest - Complete Investment Platform Architecture

**Version:** 2.0 - Complete Rebuild
**Date:** October 17, 2025
**Purpose:** GHLink-integrated investment platform with gamification

---

## Executive Summary

MutualNest is a comprehensive investment platform that integrates with GHLink to provide seamless investment opportunities for customers. The system includes:

1. **Backend API** - Complete REST API with authentication, investments, transactions
2. **Admin Portal** - Full management dashboard for administrators
3. **Customer Portal** - Gamified, mobile-responsive investment interface
4. **GHLink Integration** - Seamless fund transfers and point conversions
5. **OTP Security** - SMS/Email-based authentication for all sensitive operations

---

## System Components

### 1. Backend API (Node.js + Express + PostgreSQL)

#### Core Features:
- User authentication with OTP
- Investment product management
- Portfolio tracking
- Transaction processing
- GHLink integration
- Points & rewards system
- Notification system
- Analytics & reporting

#### Technology Stack:
- **Runtime:** Node.js 18+
- **Framework:** Express.js
- **Database:** PostgreSQL (Heroku Postgres)
- **Authentication:** JWT + OTP (Twilio/SendGrid)
- **Cache:** Redis (for OTP storage)
- **Payment:** GHLink API integration
- **Real-time:** Socket.io

---

### 2. Admin Portal

#### Features:
- **Dashboard**
  - Total investments overview
  - Active users count
  - Transaction volume
  - Revenue analytics
  - Growth charts

- **User Management**
  - View all users
  - User details & verification status
  - Block/unblock users
  - User activity logs
  - KYC document review

- **Investment Products**
  - Create/edit investment products
  - Set interest rates
  - Define lock-in periods
  - Manage minimum investments
  - Product performance tracking

- **Transactions**
  - View all transactions
  - Approve/reject withdrawals
  - Transaction history
  - Export reports

- **GHLink Integration**
  - Monitor GHLink connections
  - View point conversion history
  - Manage conversion rates
  - Integration health status

- **Settings**
  - Platform configuration
  - Fee management
  - Email/SMS templates
  - API keys management
  - Security settings

---

### 3. Customer Portal (Gamified & Mobile-Responsive)

#### Features:

**🎮 Gamification Elements:**
- **Level System** - Bronze → Silver → Gold → Platinum
- **Achievement Badges** - First investment, streak bonuses, referral rewards
- **Progress Bars** - Investment goals, savings targets
- **Leaderboard** - Top investors ranking
- **Daily Streaks** - Login bonuses
- **Reward Points** - Earn on every investment
- **Challenges** - Weekly/monthly investment challenges

**📱 Core Features:**

1. **Onboarding**
   - Phone number registration
   - OTP verification
   - GHLink connection
   - KYC upload
   - Profile setup

2. **Dashboard**
   - Total portfolio value (animated)
   - Today's earnings (real-time)
   - Investment breakdown (interactive pie chart)
   - Quick actions (Invest, Withdraw, Transfer)
   - Achievement showcase
   - Level progress bar

3. **Investment Products**
   - Product cards with:
     - Interest rate badges
     - Minimum investment
     - Lock-in period
     - Risk level indicator
     - Expected returns calculator
   - Interactive slider for amount
   - "Invest Now" with OTP confirmation

4. **My Investments**
   - Active investments list
   - Maturity countdown timers
   - ROI visualization
   - Profit/loss indicators
   - Withdrawal options

5. **Wallet**
   - GHLink balance
   - Points balance
   - Transaction history
   - Fund transfer (GHLink → MutualNest)
   - Points conversion
   - Withdrawal requests

6. **Rewards & Achievements**
   - Badge collection
   - Points history
   - Referral tracking
   - Redeem rewards
   - Leaderboard position

7. **Profile**
   - Personal information
   - Verification status
   - Connected GHLink account
   - Security settings
   - Change PIN/Password

---

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone_number VARCHAR(20) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE,
  full_name VARCHAR(255) NOT NULL,
  pin_hash VARCHAR(255),
  ghlink_account_id VARCHAR(100) UNIQUE,
  ghlink_connected BOOLEAN DEFAULT false,
  kyc_status VARCHAR(50) DEFAULT 'pending', -- pending, verified, rejected
  kyc_document_url TEXT,
  profile_image_url TEXT,
  date_of_birth DATE,
  address TEXT,

  -- Gamification
  level VARCHAR(50) DEFAULT 'bronze', -- bronze, silver, gold, platinum
  total_points INTEGER DEFAULT 0,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_login DATE,

  is_active BOOLEAN DEFAULT true,
  is_admin BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Investment Products Table
```sql
CREATE TABLE investment_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  interest_rate DECIMAL(5, 2) NOT NULL, -- Annual rate
  minimum_amount DECIMAL(12, 2) NOT NULL,
  maximum_amount DECIMAL(12, 2),
  lock_in_period_days INTEGER NOT NULL,
  risk_level VARCHAR(50) NOT NULL, -- low, medium, high
  category VARCHAR(100), -- savings, bonds, stocks, mutual_funds
  is_active BOOLEAN DEFAULT true,
  total_invested DECIMAL(15, 2) DEFAULT 0,
  total_investors INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### User Investments Table
```sql
CREATE TABLE user_investments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  product_id UUID REFERENCES investment_products(id),
  amount DECIMAL(12, 2) NOT NULL,
  interest_rate DECIMAL(5, 2) NOT NULL, -- Locked at time of investment
  start_date DATE NOT NULL DEFAULT CURRENT_DATE,
  maturity_date DATE NOT NULL,
  status VARCHAR(50) DEFAULT 'active', -- active, matured, withdrawn, cancelled
  current_value DECIMAL(12, 2), -- Calculated with interest
  profit DECIMAL(12, 2) DEFAULT 0,
  auto_reinvest BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Transactions Table
```sql
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  investment_id UUID REFERENCES user_investments(id),
  type VARCHAR(50) NOT NULL, -- deposit, withdrawal, transfer, interest, points_conversion
  amount DECIMAL(12, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending', -- pending, completed, failed, cancelled
  payment_method VARCHAR(50), -- ghlink, bank_transfer, points
  ghlink_transaction_id VARCHAR(100),
  reference VARCHAR(100) UNIQUE,
  description TEXT,
  fee DECIMAL(10, 2) DEFAULT 0,
  net_amount DECIMAL(12, 2),
  processed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Points & Rewards Table
```sql
CREATE TABLE points_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  points INTEGER NOT NULL,
  type VARCHAR(50) NOT NULL, -- earned, redeemed, bonus, conversion
  description TEXT,
  reference_type VARCHAR(50), -- investment, login_streak, referral, achievement
  reference_id UUID,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Achievements Table
```sql
CREATE TABLE achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  icon_url TEXT,
  points_reward INTEGER DEFAULT 0,
  criteria JSONB, -- Flexible criteria definition
  badge_color VARCHAR(50),
  is_active BOOLEAN DEFAULT true
);
```

### User Achievements Table
```sql
CREATE TABLE user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  achievement_id UUID REFERENCES achievements(id),
  unlocked_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);
```

### OTP Verifications Table
```sql
CREATE TABLE otp_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  phone_number VARCHAR(20),
  email VARCHAR(255),
  otp_code VARCHAR(6) NOT NULL,
  purpose VARCHAR(50) NOT NULL, -- login, register, withdraw, transfer, change_pin
  expires_at TIMESTAMP NOT NULL,
  verified BOOLEAN DEFAULT false,
  attempts INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Referrals Table
```sql
CREATE TABLE referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID REFERENCES users(id) ON DELETE CASCADE,
  referred_id UUID REFERENCES users(id) ON DELETE CASCADE,
  referral_code VARCHAR(20) UNIQUE,
  status VARCHAR(50) DEFAULT 'pending', -- pending, completed
  reward_points INTEGER DEFAULT 0,
  reward_granted BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## API Endpoints

### Authentication
```
POST   /api/auth/register              - Register with phone number
POST   /api/auth/send-otp              - Send OTP code
POST   /api/auth/verify-otp            - Verify OTP and login
POST   /api/auth/refresh-token         - Refresh JWT token
POST   /api/auth/change-pin            - Change PIN with OTP
POST   /api/auth/logout                - Logout user
GET    /api/auth/me                    - Get current user
```

### GHLink Integration
```
POST   /api/ghlink/connect             - Connect GHLink account
GET    /api/ghlink/balance             - Get GHLink balance
POST   /api/ghlink/transfer            - Transfer funds from GHLink
POST   /api/ghlink/convert-points      - Convert GHLink points to funds
GET    /api/ghlink/transactions        - Get GHLink transaction history
POST   /api/ghlink/disconnect          - Disconnect GHLink
```

### Investment Products
```
GET    /api/products                   - List all active products
GET    /api/products/:id               - Get product details
POST   /api/products                   - Create product (Admin)
PUT    /api/products/:id               - Update product (Admin)
DELETE /api/products/:id               - Delete product (Admin)
GET    /api/products/:id/calculator    - Calculate returns
```

### User Investments
```
GET    /api/investments                - Get user's investments
POST   /api/investments                - Create new investment (with OTP)
GET    /api/investments/:id            - Get investment details
POST   /api/investments/:id/withdraw   - Withdraw investment (with OTP)
PUT    /api/investments/:id/reinvest   - Toggle auto-reinvest
GET    /api/investments/summary        - Get portfolio summary
```

### Transactions
```
GET    /api/transactions               - Get user transactions
GET    /api/transactions/:id           - Get transaction details
POST   /api/transactions/withdraw      - Initiate withdrawal (with OTP)
POST   /api/transactions/transfer      - Transfer between wallets
GET    /api/transactions/pending       - Get pending transactions
```

### Gamification
```
GET    /api/gamification/level         - Get user level info
GET    /api/gamification/achievements  - Get all achievements
GET    /api/gamification/my-achievements - Get user's achievements
GET    /api/gamification/leaderboard   - Get leaderboard
POST   /api/gamification/daily-checkin - Daily login bonus
GET    /api/gamification/streaks       - Get streak information
```

### Points & Rewards
```
GET    /api/points/balance             - Get points balance
GET    /api/points/history             - Get points history
POST   /api/points/redeem              - Redeem points
POST   /api/points/convert             - Convert points to funds
GET    /api/points/conversion-rate     - Get current conversion rate
```

### Referrals
```
GET    /api/referrals/my-code          - Get user's referral code
POST   /api/referrals/apply            - Apply referral code
GET    /api/referrals/stats            - Get referral statistics
GET    /api/referrals/earnings         - Get referral earnings
```

### Admin Endpoints
```
GET    /api/admin/dashboard            - Dashboard statistics
GET    /api/admin/users                - List all users
GET    /api/admin/users/:id            - Get user details
PUT    /api/admin/users/:id/verify     - Verify user KYC
PUT    /api/admin/users/:id/block      - Block/unblock user
GET    /api/admin/transactions         - All transactions
PUT    /api/admin/transactions/:id/approve - Approve withdrawal
GET    /api/admin/investments          - All investments
GET    /api/admin/reports/revenue      - Revenue report
GET    /api/admin/reports/users        - User growth report
GET    /api/admin/reports/products     - Product performance
```

---

## OTP Security Flow

### Registration Flow:
1. User enters phone number
2. System sends 6-digit OTP via SMS
3. User enters OTP (3 attempts max, 5 min expiry)
4. On success, create user account
5. Request PIN setup
6. Account created, JWT issued

### Login Flow:
1. User enters phone number
2. System sends OTP
3. User verifies OTP
4. System issues JWT token
5. User logged in

### Investment/Withdrawal Flow:
1. User initiates investment/withdrawal
2. System sends OTP to phone + email
3. User must verify OTP
4. Transaction processed
5. Confirmation sent

### Critical Operations:
- **Require OTP:**
  - Registration
  - Login
  - Investment creation
  - Withdrawal requests
  - GHLink fund transfers
  - PIN/Password changes
  - Profile updates

---

## Gamification System

### Level Progression:
```
Bronze:    $0 - $999 invested
Silver:    $1,000 - $4,999 invested
Gold:      $5,000 - $19,999 invested
Platinum:  $20,000+ invested
```

### Points Earning:
- New investment: 100 points + 1% of amount
- Daily login: 10 points
- Weekly streak (7 days): 50 bonus points
- Referral signup: 200 points
- First investment: 500 points
- Achievement unlocked: Variable points

### Achievements:
- **First Timer**: Make your first investment (500 pts)
- **Consistent Investor**: 5 investments in 30 days (300 pts)
- **Big Spender**: Invest $10,000+ (1000 pts)
- **Streak Master**: 30-day login streak (500 pts)
- **Social Butterfly**: Refer 5 friends (750 pts)
- **Diversified**: Invest in 3+ products (400 pts)
- **Patient Investor**: Hold investment to maturity (250 pts)

---

## Next Steps

1. ✅ Architecture defined
2. 🔄 Build backend API
3. 🔄 Create admin portal
4. 🔄 Build customer portal
5. 🔄 Integrate GHLink
6. 🔄 Implement OTP system
7. 🔄 Deploy to Heroku

---

**Prepared By:** Claude Code
**For:** MutualNest Investment Platform
**Date:** October 17, 2025
