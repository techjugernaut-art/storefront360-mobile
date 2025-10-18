# Storefront 360 - Technical Architecture Document
**Version:** 2.0
**Powered By:** KudiGo
**Target Platforms:** iOS, Android, Progressive Web App (PWA)
**Deployment:** Heroku (Frontend + Backend)

---

## Executive Summary

This document outlines the complete technical architecture for rebuilding **Storefront 360**, a comprehensive Point of Sale (POS) and retail management system, as a cross-platform mobile application and Progressive Web App. The system will be deployable on iOS, Android, and as a PWA to bypass app stores, with both frontend and backend hosted on Heroku.

---

## 1. System Overview

### 1.1 Application Purpose
Storefront 360 is a complete retail management solution featuring:
- **Point of Sale (POS)** - Fast checkout with category-based product selection
- **Inventory Management** - Products, suppliers, categories, stock tracking
- **Sales Management** - Orders, invoices, gift vouchers, payments
- **Purchase Management** - Purchase orders, import, stock requests
- **Customer Management** - Customer profiles, groups, campaigns, loyalty programs
- **Financial Management** - Expenses, expense categories
- **Reporting & Analytics** - Sales, purchase, inventory, customer, payment reports
- **User Management** - Multi-user access, roles, permissions, audit trails

### 1.2 Key Features Identified from UI Analysis

#### Authentication & Authorization
- Phone number-based login (with country code selector)
- 6-digit PIN authentication
- Password recovery flow
- Multi-user support with role-based access (Super Admin, Admin, Staff)
- User audit trails

#### Dashboard Features
- Real-time sales statistics (Total Sales, Cash Sales, Mobile Money, Other Payments)
- Customer metrics (Customers Served, Discounts Given)
- Inventory alerts (Items Sold, Low Stock Alerts)
- Payment reports with charts
- Top-selling products visualization
- Quick Loan Score tracking

#### Product Management
- Product catalog with images
- Categories: Fruits, Headphones, Accessories, Shoes, Computers, Snacks, Watches, Cycles, Health Care
- Bulk operations: Add Product, Import Product, Bulk Price Update, Bulk Inventory Update
- Product attributes: Name, Category, Brand, Price, Unit, Quantity, Created By
- Product actions: View Details, Edit, Delete
- Search and filter functionality
- Export to PDF/Excel, Print capabilities

#### POS Interface
- Category carousel navigation
- Product grid with images and quick info
- Shopping cart/order list
- Customer selection
- Barcode scanning capability
- Quantity adjustment controls
- Order summary (Subtotal, Tax, Total)
- Payment method selection: Cash, Debit Card, Scan (QR/NFC), Mobile Money
- Transaction actions: Hold, Quotation, Void, Payment, Complete Transaction
- Calculator modal
- Recent transactions view
- Create customer on-the-fly

#### Sales Management
- Sales list with filters (Date, Customer Name, Reference, Status, Payment)
- Sales statuses: Completed, Pending
- Payment statuses: Paid, Due, Partial
- Sales actions: View Details, Edit, Show Payments, Create Payment, Download PDF, Delete
- Sales reference tracking (SL0101, SL0102, etc.)
- Payment tracking (Total, Paid, Due amounts)
- Invoice generation

#### Customer Management
- Customer profiles with images/avatars
- Customer code system
- Customer information: Name, Phone, Email, Country
- Customer actions: Edit, Delete
- Search/filter by code, name, phone, email
- Export customer lists

#### Settings & Configuration
- General Settings
- Ecommerce Settings
- Payment Settings
- User Settings
- Group Permissions
- Tax Rates
- Multi-language support (English, French)

#### UI/UX Features
- Responsive design (mobile-first)
- Dark/Light mode toggle capability
- Global search
- Notifications system with badge counts
- Fullscreen mode
- Language selector
- User profile dropdown
- Sidebar navigation with collapsible menus
- Data tables with sorting, pagination
- Modal dialogs for quick actions
- Filter panels for advanced search
- Loading states (whirly loader)

---

## 2. Technology Stack Recommendation

### 2.1 Frontend Stack

**Framework:** **React Native with Expo**

**Rationale:**
- ✅ Single codebase for iOS, Android, and Web (via Expo Web)
- ✅ Built-in PWA generation capabilities
- ✅ Large ecosystem and community support
- ✅ Easy deployment to Heroku using static hosting
- ✅ Excellent performance with native components
- ✅ Hot reload for faster development
- ✅ Over-the-air (OTA) updates without app store approval
- ✅ Good offline-first capabilities

**Core Libraries:**
```json
{
  "expo": "~49.0.0",
  "react": "18.2.0",
  "react-native": "0.72.6",
  "react-navigation": "^6.x",
  "expo-router": "^2.0.0",
  "@tanstack/react-query": "^5.0.0",
  "zustand": "^4.4.0",
  "react-hook-form": "^7.47.0",
  "zod": "^3.22.0",
  "@expo/vector-icons": "^13.0.0",
  "react-native-paper": "^5.10.0",
  "react-native-reanimated": "~3.3.0",
  "expo-camera": "~13.4.0",
  "expo-barcode-scanner": "~12.5.0",
  "expo-print": "~12.4.0",
  "expo-file-system": "~15.4.0",
  "react-native-chart-kit": "^6.12.0",
  "victory-native": "^36.6.11"
}
```

**PWA Configuration:**
- Service Workers for offline functionality
- Web App Manifest with installable app metadata
- IndexedDB for local data persistence
- Background sync for offline transactions

### 2.2 Backend Stack

**Framework:** **Node.js with Express.js**

**Rationale:**
- ✅ JavaScript everywhere (same language as frontend)
- ✅ Fast development with extensive npm ecosystem
- ✅ Easy deployment to Heroku with Procfile
- ✅ Excellent async/await support for database operations
- ✅ Strong community and middleware ecosystem
- ✅ Good performance for real-time features

**Core Libraries:**
```json
{
  "express": "^4.18.2",
  "cors": "^2.8.5",
  "helmet": "^7.0.0",
  "express-rate-limit": "^7.0.0",
  "jsonwebtoken": "^9.0.2",
  "bcryptjs": "^2.4.3",
  "dotenv": "^16.3.1",
  "pg": "^8.11.3",
  "pg-hstore": "^2.3.4",
  "sequelize": "^6.35.0",
  "joi": "^17.11.0",
  "morgan": "^1.10.0",
  "compression": "^1.7.4",
  "multer": "^1.4.5-lts.1",
  "node-cron": "^3.0.3",
  "socket.io": "^4.7.2"
}
```

### 2.3 Database

**Database:** **PostgreSQL** (Heroku Postgres)

**Rationale:**
- ✅ Native Heroku support with easy provisioning
- ✅ ACID compliance for financial transactions
- ✅ Strong relational data modeling for complex business logic
- ✅ JSON support for flexible schema portions
- ✅ Excellent performance and scalability
- ✅ Built-in full-text search capabilities

**ORM:** Sequelize (for Node.js)

### 2.4 Authentication & Security

- JWT (JSON Web Tokens) for stateless authentication
- Bcrypt for password/PIN hashing
- HTTPS enforcement on Heroku
- Rate limiting to prevent abuse
- Helmet.js for security headers
- Input validation with Joi/Zod
- CORS configuration

### 2.5 File Storage

**Primary:** Cloudinary (for product images, receipts, documents)
**Alternative:** AWS S3 (if preferred)

**Rationale:**
- Free tier available
- CDN for fast image delivery
- Image optimization and transformations
- Easy integration with Node.js

---

## 3. Database Schema Design

### 3.1 Core Tables

#### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone_number VARCHAR(20) UNIQUE NOT NULL,
  country_code VARCHAR(5) NOT NULL,
  pin_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE,
  role VARCHAR(50) NOT NULL, -- 'super_admin', 'admin', 'cashier', 'manager'
  avatar_url TEXT,
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  created_by UUID REFERENCES users(id)
);

CREATE INDEX idx_users_phone ON users(phone_number);
CREATE INDEX idx_users_role ON users(role);
```

#### Categories Table
```sql
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  icon_url TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  created_by UUID REFERENCES users(id)
);
```

#### Products Table
```sql
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  sku VARCHAR(100) UNIQUE,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  brand VARCHAR(100),
  description TEXT,
  image_url TEXT,
  unit VARCHAR(50) NOT NULL, -- 'pc', 'kg', 'liter', etc.
  price DECIMAL(10, 2) NOT NULL,
  cost_price DECIMAL(10, 2),
  quantity_in_stock INTEGER DEFAULT 0,
  minimum_stock_level INTEGER DEFAULT 5,
  barcode VARCHAR(100) UNIQUE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  created_by UUID REFERENCES users(id)
);

CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_barcode ON products(barcode);
CREATE INDEX idx_products_sku ON products(sku);
```

#### Customers Table
```sql
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_code VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  email VARCHAR(255),
  country VARCHAR(100),
  address TEXT,
  avatar_url TEXT,
  loyalty_points INTEGER DEFAULT 0,
  total_purchases DECIMAL(12, 2) DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  created_by UUID REFERENCES users(id)
);

CREATE INDEX idx_customers_code ON customers(customer_code);
CREATE INDEX idx_customers_phone ON customers(phone);
```

#### Sales Table
```sql
CREATE TABLE sales (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reference VARCHAR(50) UNIQUE NOT NULL, -- SL0101, SL0102, etc.
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  transaction_date TIMESTAMP NOT NULL DEFAULT NOW(),
  subtotal DECIMAL(12, 2) NOT NULL,
  tax_amount DECIMAL(10, 2) DEFAULT 0,
  discount_amount DECIMAL(10, 2) DEFAULT 0,
  total_amount DECIMAL(12, 2) NOT NULL,
  amount_paid DECIMAL(12, 2) DEFAULT 0,
  amount_due DECIMAL(12, 2) DEFAULT 0,
  payment_status VARCHAR(50) NOT NULL, -- 'paid', 'partial', 'due'
  sale_status VARCHAR(50) NOT NULL, -- 'completed', 'pending', 'void', 'hold'
  payment_method VARCHAR(50), -- 'cash', 'card', 'mobile_money', 'scan'
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  created_by UUID REFERENCES users(id) NOT NULL -- Biller
);

CREATE INDEX idx_sales_reference ON sales(reference);
CREATE INDEX idx_sales_customer ON sales(customer_id);
CREATE INDEX idx_sales_date ON sales(transaction_date);
CREATE INDEX idx_sales_status ON sales(sale_status, payment_status);
```

#### Sale Items Table
```sql
CREATE TABLE sale_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sale_id UUID REFERENCES sales(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE RESTRICT,
  product_name VARCHAR(255) NOT NULL, -- Snapshot for historical accuracy
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10, 2) NOT NULL,
  subtotal DECIMAL(12, 2) NOT NULL,
  discount DECIMAL(10, 2) DEFAULT 0,
  total DECIMAL(12, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_sale_items_sale ON sale_items(sale_id);
CREATE INDEX idx_sale_items_product ON sale_items(product_id);
```

#### Payments Table
```sql
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sale_id UUID REFERENCES sales(id) ON DELETE CASCADE,
  payment_date TIMESTAMP NOT NULL DEFAULT NOW(),
  amount DECIMAL(12, 2) NOT NULL,
  payment_method VARCHAR(50) NOT NULL, -- 'cash', 'card', 'mobile_money', 'scan'
  reference VARCHAR(100),
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  created_by UUID REFERENCES users(id)
);

CREATE INDEX idx_payments_sale ON payments(sale_id);
```

#### Suppliers Table
```sql
CREATE TABLE suppliers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  contact_person VARCHAR(255),
  phone VARCHAR(20),
  email VARCHAR(255),
  address TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  created_by UUID REFERENCES users(id)
);
```

#### Purchases Table
```sql
CREATE TABLE purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reference VARCHAR(50) UNIQUE NOT NULL,
  supplier_id UUID REFERENCES suppliers(id) ON DELETE SET NULL,
  purchase_date TIMESTAMP NOT NULL DEFAULT NOW(),
  total_amount DECIMAL(12, 2) NOT NULL,
  amount_paid DECIMAL(12, 2) DEFAULT 0,
  payment_status VARCHAR(50) NOT NULL, -- 'paid', 'partial', 'due'
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  created_by UUID REFERENCES users(id)
);
```

#### Purchase Items Table
```sql
CREATE TABLE purchase_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  purchase_id UUID REFERENCES purchases(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE RESTRICT,
  quantity INTEGER NOT NULL,
  unit_cost DECIMAL(10, 2) NOT NULL,
  total DECIMAL(12, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### Expenses Table
```sql
CREATE TABLE expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  expense_date TIMESTAMP NOT NULL,
  receipt_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  created_by UUID REFERENCES users(id)
);
```

#### Settings Table
```sql
CREATE TABLE settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key VARCHAR(100) UNIQUE NOT NULL,
  value JSONB NOT NULL,
  category VARCHAR(50) NOT NULL, -- 'general', 'payment', 'ecommerce', 'tax'
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### Audit Log Table
```sql
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  action VARCHAR(100) NOT NULL, -- 'create', 'update', 'delete', 'login'
  entity_type VARCHAR(100) NOT NULL, -- 'product', 'sale', 'customer', etc.
  entity_id UUID,
  changes JSONB,
  ip_address VARCHAR(45),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_logs_created ON audit_logs(created_at);
```

---

## 4. API Architecture

### 4.1 RESTful API Endpoints

#### Authentication
```
POST   /api/auth/login              - Login with phone + PIN
POST   /api/auth/logout             - Logout
POST   /api/auth/refresh-token      - Refresh JWT token
POST   /api/auth/forgot-pin         - Initiate PIN recovery
POST   /api/auth/reset-pin          - Reset PIN with token
GET    /api/auth/me                 - Get current user info
```

#### Users
```
GET    /api/users                   - List all users (admin)
POST   /api/users                   - Create new user (admin)
GET    /api/users/:id               - Get user by ID
PUT    /api/users/:id               - Update user
DELETE /api/users/:id               - Deactivate user
GET    /api/users/audit             - User audit trail
```

#### Products
```
GET    /api/products                - List products (paginated, filterable)
POST   /api/products                - Create product
GET    /api/products/:id            - Get product details
PUT    /api/products/:id            - Update product
DELETE /api/products/:id            - Delete product
POST   /api/products/import         - Bulk import products (CSV/Excel)
PUT    /api/products/bulk-price     - Bulk price update
PUT    /api/products/bulk-inventory - Bulk inventory update
GET    /api/products/low-stock      - Get low stock products
GET    /api/products/search         - Search products by name/barcode
```

#### Categories
```
GET    /api/categories              - List all categories
POST   /api/categories              - Create category
PUT    /api/categories/:id          - Update category
DELETE /api/categories/:id          - Delete category
```

#### Customers
```
GET    /api/customers               - List customers (paginated, filterable)
POST   /api/customers               - Create customer
GET    /api/customers/:id           - Get customer details
PUT    /api/customers/:id           - Update customer
DELETE /api/customers/:id           - Delete customer
GET    /api/customers/:id/sales     - Get customer purchase history
```

#### Sales (POS)
```
GET    /api/sales                   - List sales (paginated, filterable)
POST   /api/sales                   - Create new sale
GET    /api/sales/:id               - Get sale details
PUT    /api/sales/:id               - Update sale
DELETE /api/sales/:id               - Void sale
POST   /api/sales/:id/hold          - Hold sale for later
GET    /api/sales/held              - Get held sales
POST   /api/sales/:id/complete      - Complete held sale
POST   /api/sales/:id/payment       - Add payment to sale
GET    /api/sales/:id/payments      - Get sale payments
GET    /api/sales/:id/invoice       - Generate invoice PDF
```

#### Purchases
```
GET    /api/purchases               - List purchases
POST   /api/purchases               - Create purchase
GET    /api/purchases/:id           - Get purchase details
PUT    /api/purchases/:id           - Update purchase
DELETE /api/purchases/:id           - Delete purchase
POST   /api/purchases/import        - Import purchases
```

#### Suppliers
```
GET    /api/suppliers               - List suppliers
POST   /api/suppliers               - Create supplier
GET    /api/suppliers/:id           - Get supplier details
PUT    /api/suppliers/:id           - Update supplier
DELETE /api/suppliers/:id           - Delete supplier
```

#### Expenses
```
GET    /api/expenses                - List expenses
POST   /api/expenses                - Create expense
GET    /api/expenses/:id            - Get expense details
PUT    /api/expenses/:id            - Update expense
DELETE /api/expenses/:id            - Delete expense
```

#### Reports
```
GET    /api/reports/sales           - Sales report (date range, filters)
GET    /api/reports/purchase        - Purchase report
GET    /api/reports/inventory       - Inventory report
GET    /api/reports/customer        - Customer report
GET    /api/reports/payment         - Payment report
GET    /api/reports/expense         - Expense report
GET    /api/reports/dashboard       - Dashboard statistics
GET    /api/reports/top-products    - Top selling products
```

#### Settings
```
GET    /api/settings                - Get all settings
GET    /api/settings/:category      - Get settings by category
PUT    /api/settings                - Update settings
```

### 4.2 Real-time Features (Socket.io)

```javascript
// Real-time events for multi-user synchronization
socket.on('product:updated', (product) => {})
socket.on('sale:created', (sale) => {})
socket.on('inventory:low-stock', (products) => {})
socket.on('user:login', (user) => {})
```

---

## 5. Frontend Architecture

### 5.1 Folder Structure

```
storefront360-mobile/
├── app/                          # Expo Router app directory
│   ├── (auth)/                   # Auth screens
│   │   ├── login.tsx
│   │   └── forgot-pin.tsx
│   ├── (tabs)/                   # Main tab navigation
│   │   ├── dashboard.tsx
│   │   ├── pos.tsx
│   │   ├── products.tsx
│   │   ├── sales.tsx
│   │   └── more.tsx
│   ├── products/
│   │   ├── [id].tsx             # Product details
│   │   ├── add.tsx
│   │   └── edit/[id].tsx
│   ├── customers/
│   │   ├── index.tsx
│   │   ├── [id].tsx
│   │   └── add.tsx
│   └── _layout.tsx
├── src/
│   ├── components/               # Reusable UI components
│   │   ├── common/
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Card.tsx
│   │   │   └── DataTable.tsx
│   │   ├── pos/
│   │   │   ├── CategoryCarousel.tsx
│   │   │   ├── ProductGrid.tsx
│   │   │   ├── ShoppingCart.tsx
│   │   │   └── PaymentModal.tsx
│   │   ├── charts/
│   │   │   ├── SalesChart.tsx
│   │   │   └── InventoryChart.tsx
│   │   └── layout/
│   │       ├── Header.tsx
│   │       ├── Sidebar.tsx
│   │       └── Layout.tsx
│   ├── hooks/                    # Custom React hooks
│   │   ├── useAuth.ts
│   │   ├── useProducts.ts
│   │   ├── useSales.ts
│   │   └── useOffline.ts
│   ├── services/                 # API service layer
│   │   ├── api.ts               # Axios instance
│   │   ├── auth.service.ts
│   │   ├── products.service.ts
│   │   ├── sales.service.ts
│   │   └── offline.service.ts
│   ├── store/                    # Zustand state management
│   │   ├── authStore.ts
│   │   ├── cartStore.ts
│   │   ├── productsStore.ts
│   │   └── settingsStore.ts
│   ├── utils/                    # Utility functions
│   │   ├── formatters.ts
│   │   ├── validators.ts
│   │   └── constants.ts
│   ├── types/                    # TypeScript types
│   │   ├── models.ts
│   │   └── api.ts
│   └── theme/                    # Theme configuration
│       ├── colors.ts
│       └── fonts.ts
├── assets/
│   ├── images/
│   └── fonts/
├── app.json                      # Expo configuration
├── package.json
└── tsconfig.json
```

### 5.2 State Management Strategy

**Global State (Zustand):**
- Authentication state
- Shopping cart
- User preferences
- Offline queue

**Server State (React Query):**
- Products
- Sales
- Customers
- Reports
- Automatic caching and refetching

### 5.3 Offline-First Strategy

```typescript
// Offline queue for transactions
const offlineQueue = {
  sales: [],      // Pending sales
  products: [],   // Product updates
  payments: []    // Payment records
};

// Sync when online
useEffect(() => {
  if (isOnline) {
    syncOfflineQueue();
  }
}, [isOnline]);
```

**Features:**
- IndexedDB for local data storage
- Background sync for pending transactions
- Optimistic UI updates
- Conflict resolution strategy

---

## 6. Backend Architecture

### 6.1 Folder Structure

```
storefront360-api/
├── src/
│   ├── config/
│   │   ├── database.js          # Sequelize config
│   │   ├── auth.js              # JWT config
│   │   └── cloudinary.js        # File upload config
│   ├── models/                  # Sequelize models
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Sale.js
│   │   ├── Customer.js
│   │   └── index.js
│   ├── controllers/             # Route controllers
│   │   ├── auth.controller.js
│   │   ├── products.controller.js
│   │   ├── sales.controller.js
│   │   └── reports.controller.js
│   ├── services/                # Business logic
│   │   ├── auth.service.js
│   │   ├── products.service.js
│   │   ├── sales.service.js
│   │   └── inventory.service.js
│   ├── middleware/
│   │   ├── auth.middleware.js   # JWT verification
│   │   ├── validate.middleware.js
│   │   └── errorHandler.js
│   ├── routes/
│   │   ├── index.js
│   │   ├── auth.routes.js
│   │   ├── products.routes.js
│   │   └── sales.routes.js
│   ├── validators/              # Joi schemas
│   │   ├── auth.validator.js
│   │   └── product.validator.js
│   ├── utils/
│   │   ├── logger.js
│   │   ├── helpers.js
│   │   └── constants.js
│   └── app.js                   # Express app
├── migrations/                  # Database migrations
├── seeders/                     # Database seeders
├── .env.example
├── Procfile                     # Heroku config
├── package.json
└── server.js                    # Entry point
```

### 6.2 Middleware Stack

```javascript
app.use(helmet());                    // Security headers
app.use(cors());                      // CORS
app.use(compression());               // Response compression
app.use(express.json());              // JSON parsing
app.use(morgan('combined'));          // Logging
app.use(rateLimit({ ... }));         // Rate limiting
```

### 6.3 Error Handling

```javascript
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;
  }
}

// Global error handler middleware
app.use(globalErrorHandler);
```

---

## 7. Deployment Architecture

### 7.1 Heroku Deployment Plan

#### Backend Deployment
```bash
# Create Heroku app
heroku create storefront360-api --team azamati

# Add PostgreSQL
heroku addons:create heroku-postgresql:mini

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=<random-secret>
heroku config:set CLOUDINARY_URL=<cloudinary-url>

# Deploy
git push heroku main

# Run migrations
heroku run npm run migrate
```

**Procfile:**
```
web: node server.js
release: npx sequelize-cli db:migrate
```

#### Frontend Deployment (PWA)
```bash
# Build Expo web app
expo build:web

# Create Heroku app for static hosting
heroku create storefront360-web --team azamati

# Add static buildpack
heroku buildpacks:set heroku/nodejs
heroku buildpacks:add heroku-community/static

# Deploy
git push heroku main
```

**static.json:**
```json
{
  "root": "web-build",
  "clean_urls": false,
  "routes": {
    "/**": "index.html"
  }
}
```

### 7.2 Environment Variables

**Backend (.env):**
```
NODE_ENV=production
PORT=5000
DATABASE_URL=<heroku-postgres-url>
JWT_SECRET=<random-secret-key>
JWT_EXPIRE=7d
CLOUDINARY_CLOUD_NAME=<name>
CLOUDINARY_API_KEY=<key>
CLOUDINARY_API_SECRET=<secret>
FRONTEND_URL=https://storefront360-web.herokuapp.com
```

**Frontend (.env):**
```
EXPO_PUBLIC_API_URL=https://storefront360-api.herokuapp.com/api
EXPO_PUBLIC_SOCKET_URL=https://storefront360-api.herokuapp.com
```

### 7.3 CI/CD Pipeline (GitHub Actions)

```yaml
name: Deploy to Heroku

on:
  push:
    branches: [main]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: akhileshns/heroku-deploy@v3.12.12
        with:
          heroku_api_key: ${{secrets.HEROKU_API_KEY}}
          heroku_app_name: "storefront360-api"
          heroku_email: ${{secrets.HEROKU_EMAIL}}

  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Build Expo Web
        run: |
          npm install
          expo build:web
      - uses: akhileshns/heroku-deploy@v3.12.12
        with:
          heroku_api_key: ${{secrets.HEROKU_API_KEY}}
          heroku_app_name: "storefront360-web"
          heroku_email: ${{secrets.HEROKU_EMAIL}}
```

---

## 8. PWA Configuration

### 8.1 Web App Manifest (manifest.json)

```json
{
  "name": "Storefront 360",
  "short_name": "Storefront360",
  "description": "Complete POS and Retail Management System",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#F97316",
  "orientation": "portrait",
  "icons": [
    {
      "src": "/images/icon-192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/images/icon-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ]
}
```

### 8.2 Service Worker Strategy

```javascript
// Cache-first strategy for static assets
workbox.routing.registerRoute(
  /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
  new workbox.strategies.CacheFirst({
    cacheName: 'images-cache',
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 100,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
      }),
    ],
  })
);

// Network-first for API calls
workbox.routing.registerRoute(
  /\/api\/.*/,
  new workbox.strategies.NetworkFirst({
    cacheName: 'api-cache',
    networkTimeoutSeconds: 10,
  })
);
```

---

## 9. Phased Development Plan

### Phase 1: Authentication & Core Layout (Week 1-2)
**Deliverables:**
- Backend: User authentication API, JWT middleware, database setup
- Frontend: Login screen, phone number input with country selector, PIN authentication
- Navigation structure (tabs, sidebar)
- Basic layout components (Header, Sidebar)
- Heroku deployment setup for both frontend and backend

**Acceptance Criteria:**
- Users can register and login with phone + PIN
- JWT tokens are issued and validated
- Navigation works on mobile and web
- Apps deployed to Heroku

---

### Phase 2: POS & Product Management (Week 3-5)
**Deliverables:**
- Backend: Products API, Categories API, Sales API
- Frontend:
  - Product catalog with search and filters
  - Category management
  - POS interface with category carousel
  - Product grid and shopping cart
  - Barcode scanning
  - Checkout flow with payment methods
- Database: Products, Categories, Sales tables with relationships
- Image upload to Cloudinary

**Acceptance Criteria:**
- Can create, edit, delete products
- POS interface functional with cart operations
- Sales transactions saved to database
- Low stock alerts working
- Barcode scanner integrated

---

### Phase 3: Sales, Customer & Inventory Management (Week 6-8)
**Deliverables:**
- Backend: Customers API, Payments API, Inventory tracking
- Frontend:
  - Customer management screens
  - Sales list with filters
  - Payment tracking and invoice generation
  - Bulk import products (CSV/Excel)
  - Bulk price/inventory updates
- Database: Customers, Payments, Sale Items tables
- PDF invoice generation

**Acceptance Criteria:**
- Customer CRUD operations working
- Sales history with payment tracking
- PDF invoices generate correctly
- Bulk operations functional
- Inventory automatically updates on sales

---

### Phase 4: Purchases, Suppliers & Expenses (Week 9-10)
**Deliverables:**
- Backend: Purchases API, Suppliers API, Expenses API
- Frontend:
  - Purchase management screens
  - Supplier management
  - Expense tracking
- Database: Purchases, Suppliers, Expenses tables

**Acceptance Criteria:**
- Can record purchases and track suppliers
- Inventory updates on purchases
- Expense tracking working
- Purchase-to-payment workflow complete

---

### Phase 5: Reports & Analytics (Week 11-12)
**Deliverables:**
- Backend: Reports API with aggregations
- Frontend:
  - Dashboard with real-time statistics
  - Sales reports with charts
  - Inventory reports
  - Customer reports
  - Export to PDF/Excel functionality
- Charts and visualizations (Victory Native)

**Acceptance Criteria:**
- Dashboard shows accurate statistics
- All reports generate correctly
- Charts render properly
- Export features working

---

### Phase 6: Settings, Permissions & Advanced Features (Week 13-14)
**Deliverables:**
- Backend: Settings API, Permissions middleware, Audit logs
- Frontend:
  - User management screens
  - Role-based permissions
  - Settings panels (General, Payment, Tax)
  - Multi-language support
  - Dark mode
- Real-time notifications (Socket.io)
- User audit trail

**Acceptance Criteria:**
- Role-based access control working
- Settings persist correctly
- Audit logs track all actions
- Real-time updates functional
- Language switching works

---

### Phase 7: PWA Optimization & Offline Mode (Week 15-16)
**Deliverables:**
- Service worker implementation
- Offline queue for transactions
- IndexedDB integration
- Background sync
- Push notifications
- App install prompts
- Performance optimization

**Acceptance Criteria:**
- App works offline
- Transactions sync when online
- PWA installable on mobile devices
- Performance score >90 on Lighthouse
- Push notifications working

---

### Phase 8: Testing, Bug Fixes & Documentation (Week 17-18)
**Deliverables:**
- Unit tests for critical functions
- Integration tests for API endpoints
- E2E tests for key user flows
- Bug fixes
- User documentation
- API documentation (Swagger)
- Deployment guides

**Acceptance Criteria:**
- Test coverage >70%
- No critical bugs
- Documentation complete
- Performance optimized

---

## 10. Security Considerations

### 10.1 Authentication & Authorization
- JWT tokens with expiration
- Refresh token rotation
- PIN hashing with bcrypt (cost factor 12)
- Role-based access control (RBAC)
- Session invalidation on logout

### 10.2 Data Protection
- HTTPS enforcement
- SQL injection prevention (parameterized queries with Sequelize)
- XSS protection (input sanitization)
- CSRF protection
- Rate limiting on sensitive endpoints

### 10.3 Compliance
- PCI DSS compliance for payment data
- GDPR compliance for customer data
- Data encryption at rest (PostgreSQL encryption)
- Audit logs for all financial transactions

---

## 11. Performance Optimization

### 11.1 Frontend
- Code splitting with Expo Router
- Image optimization with Cloudinary
- Lazy loading for lists
- React Query caching
- Debounced search inputs
- Virtual lists for large datasets

### 11.2 Backend
- Database indexing on frequently queried fields
- Query optimization with Sequelize includes
- Response compression
- Redis caching for reports (future enhancement)
- Connection pooling for PostgreSQL

### 11.3 Network
- CDN for static assets (Cloudinary)
- Gzip compression
- HTTP/2 on Heroku
- Pagination for all list endpoints

---

## 12. Monitoring & Logging

### 12.1 Application Monitoring
- Heroku logs for error tracking
- Morgan for HTTP request logging
- Custom error tracking service (Sentry)
- Performance monitoring (New Relic or similar)

### 12.2 Business Metrics
- Daily sales totals
- Inventory turnover rates
- Customer acquisition metrics
- Average transaction value
- Low stock alerts

---

## 13. Future Enhancements

### 13.1 Short-term (6 months)
- SMS notifications for customers
- WhatsApp integration for receipts
- Multi-store support
- Advanced loyalty programs
- Shift management for cashiers

### 13.2 Long-term (12+ months)
- AI-powered inventory forecasting
- Integration with accounting software (QuickBooks, Xero)
- E-commerce storefront
- Employee performance analytics
- Biometric authentication

---

## 14. Cost Estimation

### 14.1 Heroku Costs (Monthly)
- **Backend Dyno (Basic):** $7/month
- **PostgreSQL (Mini):** $5/month
- **Frontend Dyno (Basic):** $7/month
- **Total Heroku:** ~$19/month

### 14.2 Third-party Services
- **Cloudinary (Free tier):** $0 (25GB storage, 25GB bandwidth)
- **Domain (optional):** $12/year
- **SSL Certificate:** Free (Heroku provides)

**Total Monthly Cost:** ~$20/month

---

## 15. Success Metrics

### 15.1 Technical KPIs
- API response time <500ms
- PWA Lighthouse score >90
- App crash rate <1%
- Offline sync success rate >95%

### 15.2 Business KPIs
- Transaction processing time <2 minutes
- User adoption rate (target: 80% of staff)
- System uptime >99.5%
- Customer satisfaction score >4.5/5

---

## Conclusion

This architecture provides a robust, scalable foundation for Storefront 360 as a modern, cross-platform POS and retail management system. The phased development approach ensures manageable increments, while the offline-first PWA strategy guarantees reliability even in low-connectivity environments.

**Next Steps:**
1. Get architecture approval
2. Set up GitHub repository
3. Initialize Heroku apps
4. Begin Phase 1 development

---

**Document Version:** 2.0
**Last Updated:** 2025-10-17
**Prepared By:** Claude Code
**For:** Topia Consult / KudiGo
