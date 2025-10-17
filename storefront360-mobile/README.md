# Storefront 360 Mobile App

Complete POS and Retail Management System - Mobile Application

## Features

- 📱 Cross-platform (iOS, Android, Web/PWA)
- 🔐 Phone number + PIN authentication
- 🎨 Beautiful Material Design UI
- 💾 Offline-first architecture with local storage
- 🔄 Real-time data synchronization
- 📊 Dashboard with sales analytics
- 🛒 Full POS functionality (coming soon)
- 📦 Product management (coming soon)
- 👥 Customer management (coming soon)

## Tech Stack

- **Framework:** React Native + Expo
- **State Management:** Zustand
- **Data Fetching:** Axios
- **UI Components:** React Native Paper
- **Navigation:** React Navigation
- **Forms:** React Hook Form + Zod
- **Storage:** AsyncStorage

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Expo CLI installed globally: `npm install -g expo-cli`
- iOS Simulator (Mac) or Android Emulator installed
- Expo Go app on your phone (optional)

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   ```bash
   # .env file is already configured
   EXPO_PUBLIC_API_URL=https://storefront360-api-7c0fba1e7336.herokuapp.com
   ```

3. Start the development server:
   ```bash
   npm start
   ```

### Running the App

**On iOS Simulator (Mac only):**
```bash
npm run ios
```

**On Android Emulator:**
```bash
npm run android
```

**On Web Browser:**
```bash
npm run web
```

**On Physical Device:**
1. Install Expo Go from App Store/Play Store
2. Scan the QR code from the terminal
3. App will load on your device

## Demo Credentials

```
Phone Number: 244123456
Country Code: +233  (Ghana)
PIN: 123456
Role: Super Admin
```

## Project Structure

```
storefront360-mobile/
├── App.tsx                    # Main app component
├── src/
│   ├── components/           # Reusable UI components
│   │   ├── common/          # Common components
│   │   ├── auth/            # Auth-related components
│   │   ├── pos/             # POS components
│   │   └── layout/          # Layout components
│   ├── screens/             # Screen components
│   │   ├── LoginScreen.tsx  # Login screen
│   │   └── DashboardScreen.tsx # Dashboard
│   ├── services/            # API service layer
│   │   ├── api.ts          # Axios instance
│   │   └── auth.service.ts  # Auth API calls
│   ├── store/               # Zustand state management
│   │   └── authStore.ts    # Auth state
│   ├── hooks/               # Custom React hooks
│   ├── utils/               # Utility functions
│   │   └── storage.ts      # AsyncStorage helpers
│   ├── constants/           # App constants
│   │   └── config.ts       # App configuration
│   └── types/               # TypeScript types
├── assets/                  # Images, fonts, etc.
└── package.json
```

## Features Implemented

### ✅ Authentication
- Phone number + PIN login
- Country code selector (Ghana, Nigeria, Kenya, USA)
- Secure PIN input with visual indicators
- JWT token management
- Auto-login with stored credentials
- Logout functionality

### ✅ Navigation
- Bottom tab navigation (Home, POS, Settings)
- Custom center button for POS (blue circular button)
- Stack navigation for sub-screens
- Back button navigation

### ✅ Home/Dashboard
- Store profile header with logo
- Today's sales overview metrics
- Total Sales, Total Profit, Total Expenses cards
- Quick action cards (Sales History, Products, Reports, Points & Rewards)
- Notification bell icon
- Role-based access indicators

### ✅ POS (Point of Sale)
- Product search with barcode scanning
- Product listing with images, prices, and stock
- Add to cart functionality with real-time updates
- Cart badge showing item count
- "Process Sale" button with cart total
- Empty cart disabled state

### ✅ Products Management
- Product listing with search
- Product cards with images and details
- Add product button (blue FAB)
- Edit/delete options (three-dot menu)
- Stock availability display
- Empty state with helpful message

### ✅ Sales History
- Order listing with search
- Order cards showing number, date, time
- Items count, payment method, and amount
- Filter button for advanced filtering
- Three-dot menu for order options

### ✅ Reports & Analytics
- Summary/Products tabs
- Payment method filter (All, Cash, Mobile Money, Card)
- Date filter (Today, Week, Month, Custom)
- Total Sales metric card
- Total Cost metric card
- Gross Profit metric card (in green)
- Explanatory descriptions for each metric

### ✅ Settings
- Current plan display (Lite Plan)
- Personal Profile option
- Shop settings
- Change PIN functionality
- Notifications settings
- Help & Support
- Logout button (red)
- User info display

### 🔜 Coming Soon
- Customer management
- Inventory tracking
- Points & Rewards system
- Expense tracking
- Offline mode
- Multi-store support
- Receipt printing
- Export reports (PDF/Excel)

## API Integration

The app connects to the production API:
- **Base URL:** https://storefront360-api-7c0fba1e7336.herokuapp.com
- **Endpoints:**
  - POST `/api/auth/login` - User login
  - POST `/api/auth/register` - User registration
  - GET `/api/auth/me` - Get current user
  - PUT `/api/auth/change-pin` - Change PIN
  - POST `/api/auth/logout` - Logout

## Building for Production

### Build for Android (APK):
```bash
expo build:android
```

### Build for iOS (IPA):
```bash
expo build:ios
```

### Build as PWA (Web):
```bash
expo build:web
```

## Deployment

### Deploy to Heroku as PWA:

1. Build web version:
   ```bash
   expo build:web
   ```

2. Create Heroku app:
   ```bash
   heroku create storefront360-web --team azamati
   ```

3. Add static buildpack:
   ```bash
   heroku buildpacks:add heroku-community/static
   ```

4. Create `static.json`:
   ```json
   {
     "root": "web-build",
     "clean_urls": false,
     "routes": {
       "/**": "index.html"
     }
   }
   ```

5. Deploy:
   ```bash
   git push heroku main
   ```

## Screenshots

### Login Screen
- Country code selector with flags
- Phone number input
- 6-digit PIN input with visual dots
- Demo credentials helper
- Beautiful gradient design

### Dashboard
- Welcome message with user name
- Account information card
- Quick stats (sales, transactions)
- Quick action buttons
- Logout functionality

## Troubleshooting

### Error: "Cannot connect to API"
- Check your internet connection
- Verify API URL in .env file
- Ensure backend is running on Heroku

### Error: "Expo Go not loading"
- Make sure Expo Go app is updated
- Check that phone and computer are on same network
- Try restarting Metro bundler

### Error: "AsyncStorage not found"
- Run: `npm install @react-native-async-storage/async-storage`
- Restart Metro bundler

## Development Scripts

```bash
# Start development server
npm start

# Start with cache cleared
npm start --clear

# Run on iOS
npm run ios

# Run on Android
npm run android

# Run on web
npm run web

# Run tests
npm test

# Format code
npm run format

# Lint code
npm run lint
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `EXPO_PUBLIC_API_URL` | Backend API URL | Production Heroku URL |
| `EXPO_PUBLIC_API_TIMEOUT` | API request timeout (ms) | 10000 |

## Contributing

This is a private project for Topia Consult / KudiGo.

## Support

For issues or questions:
- Check Expo logs: Look at Metro bundler output
- Check API status: Visit https://storefront360-api-7c0fba1e7336.herokuapp.com/health
- Review error messages in the app

## License

Proprietary - All rights reserved by KudiGo

## Version History

### v1.0.0 (Current)
- ✅ Initial release
- ✅ Authentication with phone + PIN
- ✅ Dashboard with user info
- ✅ Production API integration
- ✅ Cross-platform support

### Upcoming v1.1.0
- POS interface
- Product management
- Sales processing
- Customer management

---

**Developed By:** Claude Code
**For:** Topia Consult / KudiGo
**Status:** In Development
**Platform:** React Native + Expo
