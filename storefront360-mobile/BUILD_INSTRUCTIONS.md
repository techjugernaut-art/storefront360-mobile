# Storefront 360 Mobile - Build Instructions

## 📱 Native Mobile App Builds

### Option 1: Install from Expo Go (Development/Testing)

**Easiest option for testing on your phone:**

1. **Install Expo Go** on your phone:
   - iOS: https://apps.apple.com/app/expo-go/id982107779
   - Android: https://play.google.com/store/apps/details?id=host.exp.exponent

2. **Run the development server**:
   ```bash
   cd /Users/kingsleyabrokwah/new-topia/storefront360-mobile
   npm start
   ```

3. **Scan the QR code**:
   - iOS: Open Camera app and scan the QR code
   - Android: Open Expo Go app and scan the QR code

4. **Login credentials**:
   ```
   Phone: 244123456
   Country Code: +233
   PIN: 123456
   ```

---

### Option 2: Build Standalone APK (Android)

**For distributing to Android users without Expo Go:**

1. **Install EAS CLI**:
   ```bash
   npm install -g eas-cli
   ```

2. **Login to Expo**:
   ```bash
   eas login
   ```

3. **Configure the project**:
   ```bash
   cd /Users/kingsleyabrokwah/new-topia/storefront360-mobile
   eas build:configure
   ```

4. **Build Android APK**:
   ```bash
   eas build --platform android --profile preview
   ```

   This will:
   - Build a standalone APK file
   - Provide a download link when complete (usually 10-15 minutes)
   - APK can be installed directly on Android devices

5. **Download and install**:
   - Download the APK from the EAS build link
   - Transfer to Android device
   - Enable "Install from Unknown Sources" in Android settings
   - Install the APK

---

### Option 3: Build for iOS (Requires Apple Developer Account)

**For distributing to iOS users:**

1. **Prerequisites**:
   - Apple Developer Account ($99/year)
   - Enrolled in Apple Developer Program

2. **Build iOS app**:
   ```bash
   eas build --platform ios --profile production
   ```

3. **Submit to App Store** (optional):
   ```bash
   eas submit --platform ios
   ```

---

### Option 4: Progressive Web App (Already Deployed)

**Current web deployment:**

🌐 **Web App URL**: https://storefront360-web-d38762135ee3.herokuapp.com/

**Features**:
- Works in any web browser
- Mobile-sized container on desktop
- Installable as PWA on mobile browsers
- No app store required

**To install as PWA on mobile**:

**Android (Chrome)**:
1. Open https://storefront360-web-d38762135ee3.herokuapp.com/
2. Tap the menu (⋮) → "Add to Home screen"
3. Confirm installation

**iOS (Safari)**:
1. Open https://storefront360-web-d38762135ee3.herokuapp.com/
2. Tap the Share button (⬆️)
3. Scroll down and tap "Add to Home Screen"
4. Confirm installation

---

## 🚀 Quick Build Commands

### Build Android APK (No Account Required)
```bash
cd /Users/kingsleyabrokwah/new-topia/storefront360-mobile
eas build --platform android --profile preview --non-interactive
```

### Build iOS IPA (Requires Apple Account)
```bash
eas build --platform ios --profile production --non-interactive
```

### Build Both Platforms
```bash
eas build --platform all --profile production
```

---

## 📦 Distribution Options

### 1. **Internal Testing** (Recommended for now)
- Build APK with `eas build --platform android --profile preview`
- Share APK link directly with testers
- No Google Play or App Store approval needed

### 2. **Google Play Store** (For public release)
- Build AAB: `eas build --platform android --profile production`
- Submit: `eas submit --platform android`
- Requires Google Play Developer account ($25 one-time)

### 3. **Apple App Store** (For public release)
- Build IPA: `eas build --platform ios --profile production`
- Submit: `eas submit --platform ios`
- Requires Apple Developer account ($99/year)

### 4. **PWA** (Already live)
- Already deployed: https://storefront360-web-d38762135ee3.herokuapp.com/
- Can be installed on any mobile device
- No app store approval needed
- Updates instantly

---

## 🔧 Current Status

✅ **Web PWA**: Deployed and live at https://storefront360-web-d38762135ee3.herokuapp.com/

🔜 **Android APK**: Ready to build (run `eas build --platform android`)

🔜 **iOS IPA**: Ready to build (requires Apple Developer account)

---

## 📱 Testing the App

**Web (Desktop)**:
1. Visit https://storefront360-web-d38762135ee3.herokuapp.com/
2. App appears in mobile-sized container with shadow
3. Login with: Phone `244123456`, Code `+233`, PIN `123456`

**Mobile Browser**:
1. Visit https://storefront360-web-d38762135ee3.herokuapp.com/
2. Full-screen mobile experience
3. Can install as PWA for app-like experience

**Expo Go** (Development):
1. Run `npm start` in project directory
2. Scan QR code with Expo Go app
3. Test live reloading during development

---

## 💡 Recommended Approach

For immediate distribution to users, I recommend:

1. **Use the PWA** (already deployed)
   - No build process needed
   - Works on all devices
   - Instant updates
   - Can be installed to home screen

2. **Build Android APK** for users who prefer native apps
   - One command: `eas build --platform android --profile preview`
   - Share download link directly
   - No Google Play approval needed (initially)

3. **iOS** can wait until you have Apple Developer account
   - Or users can use the PWA on iOS
   - PWA works perfectly on Safari

---

## 🎯 Next Steps

To build Android APK right now:

```bash
cd /Users/kingsleyabrokwah/new-topia/storefront360-mobile
npm install -g eas-cli
eas login
eas build --platform android --profile preview
```

Build will take ~15 minutes and provide a download link.

---

**Questions?** Check https://docs.expo.dev/build/introduction/
