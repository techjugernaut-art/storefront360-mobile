# Storefront 360 - PWA Installation Guide

## What is a PWA?

A Progressive Web App (PWA) is a web application that can be installed on your device and used like a native app. Storefront 360 PWA works on both iOS and Android devices, offering:

- **Offline functionality** - Access your app even without internet
- **Home screen icon** - Quick access from your device home screen
- **Native app experience** - Full-screen mode without browser UI
- **Push notifications** - Stay updated with sales and alerts (coming soon)
- **Auto-updates** - Always get the latest version automatically

## Live Application URL

**Web App:** https://storefront360-web-d38762135ee3.herokuapp.com/

**API:** https://storefront360-api-7c0fba1e7336.herokuapp.com/

---

## Installation Instructions

### For iOS (iPhone/iPad)

#### Step 1: Open Safari Browser
- **IMPORTANT:** You must use Safari browser on iOS. Other browsers (Chrome, Firefox) don't support PWA installation on iOS.
- Open Safari and navigate to: https://storefront360-web-d38762135ee3.herokuapp.com/

#### Step 2: Open Share Menu
- Tap the **Share** button at the bottom of the screen (square with arrow pointing up)
- If you don't see the Share button, make sure you're not in Private Browsing mode

#### Step 3: Add to Home Screen
- Scroll down in the Share menu
- Tap **"Add to Home Screen"**
- You may need to scroll down to find this option

#### Step 4: Customize Name
- Edit the app name if desired (default: "Storefront 360")
- Tap **"Add"** in the top right corner

#### Step 5: Launch the App
- Find the Storefront 360 icon on your home screen
- Tap to launch the app
- The app will open in full-screen mode without browser controls

#### Troubleshooting iOS:
- **Can't find "Add to Home Screen"?** - Make sure you're using Safari, not another browser
- **Option is grayed out?** - Check that you're not in Private Browsing mode
- **App won't install?** - Try clearing Safari cache: Settings > Safari > Clear History and Website Data

---

### For Android (Samsung, Google Pixel, etc.)

#### Method 1: Chrome Browser (Recommended)

##### Step 1: Open Chrome
- Open Chrome browser on your Android device
- Navigate to: https://storefront360-web-d38762135ee3.herokuapp.com/

##### Step 2: Install Prompt
- Chrome will automatically show an "Install" banner at the bottom
- Tap **"Install"** or **"Add to Home Screen"**

##### Step 3: Alternative - Menu Method
If you don't see the install banner:
- Tap the three dots (⋮) in the top right corner
- Select **"Install app"** or **"Add to Home screen"**

##### Step 4: Confirm Installation
- A dialog will appear asking to confirm
- Tap **"Install"**

##### Step 5: Launch the App
- Find the Storefront 360 icon in your app drawer or home screen
- Tap to launch
- The app runs in standalone mode without browser UI

#### Method 2: Samsung Internet Browser

##### Step 1: Open Samsung Internet
- Open Samsung Internet browser
- Navigate to: https://storefront360-web-d38762135ee3.herokuapp.com/

##### Step 2: Open Menu
- Tap the menu button (three lines) at the bottom right

##### Step 3: Add to Home Screen
- Select **"Add page to"**
- Choose **"Home screen"**

##### Step 4: Confirm
- Edit the shortcut name if desired
- Tap **"Add"**

#### Troubleshooting Android:
- **No "Install" option?** - Make sure you're using Chrome or Samsung Internet
- **Can't find the installed app?** - Check your app drawer or search for "Storefront 360"
- **App won't open?** - Try uninstalling and reinstalling, or clear browser cache

---

## Test Login Credentials

Use these credentials to test the application:

**Phone Number:** 0240000000
**PIN:** 123456

---

## Features Available in the App

### Home Dashboard
- Store profile with verification badge
- Real-time sales, profit, and expense metrics
- Quick action cards for navigation
- Today's summary view

### Make a Sale (POS)
- Search products by name, SKU, or barcode
- Add items to cart with quantity controls
- View real-time cart total
- Process sales with payment methods

### Products Management
- Browse all products with images
- Search and filter products
- View stock levels
- Add, edit, and delete products (coming soon)
- View product categories

### Sales History
- View all completed sales
- Search by order number
- Filter by payment method
- View detailed sale information
- Track sale timestamps

### Reports & Analytics
- Total sales tracking
- Cost analysis
- Gross profit calculations
- Date filtering (Today, This Week, This Month)
- Payment method breakdown

### Points & Rewards
- Track reward points
- View milestones
- Earn rewards for achievements
- Loyalty program integration

### Notifications
- Sale alerts
- Low stock warnings
- Promotional offers
- System notifications

---

## Current Test Data

The app is loaded with dummy data for testing:

### Products (10 items)
- Nestle Milo Tin - GHS 45.00
- Nestle Nido Milk Powder - GHS 89.99
- Nestle Cerelac - GHS 32.50
- Cowbell Coffee - GHS 28.00
- Peak Milk - GHS 18.50
- Indomie Instant Noodles - GHS 12.00
- Golden Penny Semovita - GHS 55.00
- Dettol Hand Wash - GHS 24.99
- Sunlight Dishwashing Liquid - GHS 15.50
- Coca Cola - GHS 8.00

### Sales (15 orders)
- Various completed transactions
- Multiple payment methods (Cash, Mobile Money, Card)
- Date range: Last 30 days

### Metrics
- Total Sales: GHS 9,000.00
- Total Cost: GHS 7,500.00
- Gross Profit: GHS 1,500.00

---

## Uninstalling the PWA

### iOS
1. Long-press the Storefront 360 icon on your home screen
2. Tap **"Remove App"**
3. Select **"Delete App"**

### Android
1. Long-press the Storefront 360 icon
2. Drag to **"Uninstall"** or tap **"App info"** > **"Uninstall"**

Or go to Settings > Apps > Storefront 360 > Uninstall

---

## PWA vs Native App

### What's the Same:
- Full-screen experience
- Home screen icon
- Works offline (cached data)
- Fast performance
- Push notifications (coming soon)

### What's Different:
- PWA updates automatically (no App Store updates needed)
- Smaller download size
- No App Store approval process
- Can be installed directly from browser
- May have slightly less access to native device features

---

## System Requirements

### iOS
- iOS 11.3 or later
- Safari browser
- Internet connection for initial install

### Android
- Android 5.0 (Lollipop) or later
- Chrome 70+ or Samsung Internet 10+
- Internet connection for initial install

---

## Support & Feedback

For issues, questions, or feedback:

1. Check if you're using the correct browser (Safari for iOS, Chrome for Android)
2. Ensure you have a stable internet connection
3. Try clearing browser cache and reinstalling
4. Contact support with error details if problems persist

---

## Technical Information

### Frontend
- Built with React Native + Expo
- Responsive design (480px mobile container on desktop)
- TypeScript for type safety
- React Navigation for routing

### Backend API
- Node.js + Express
- JWT authentication
- RESTful endpoints
- Heroku hosting

### Security
- HTTPS encrypted connection
- Secure JWT token authentication
- Protected API endpoints
- Rate limiting enabled

---

## Development & Production Environments

### Production (Current)
- **Frontend:** https://storefront360-web-d38762135ee3.herokuapp.com/
- **API:** https://storefront360-api-7c0fba1e7336.herokuapp.com/
- **Status:** Live with dummy data for testing
- **Version:** v8 (Frontend), v8 (API)

### Next Steps
- Replace dummy data with real database
- Enable product CRUD operations
- Add payment processing
- Implement push notifications
- Add offline sync capabilities

---

## Quick Start Checklist

- [ ] Open correct browser (Safari for iOS, Chrome for Android)
- [ ] Navigate to https://storefront360-web-d38762135ee3.herokuapp.com/
- [ ] Install to home screen using instructions above
- [ ] Launch app from home screen icon
- [ ] Login with test credentials (0240000000 / 123456)
- [ ] Explore all features
- [ ] Test making a sale
- [ ] View reports and analytics

---

**Last Updated:** October 19, 2025
**App Version:** v8
**API Version:** v8
