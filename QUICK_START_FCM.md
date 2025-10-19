# Quick Start Guide - Firebase Cloud Messaging

## Prerequisites
- Firebase account: https://console.firebase.google.com
- Node.js and npm installed

## 🚀 Quick Setup (5 minutes)

### Step 1: Firebase Console (2 minutes)

1. **Create/Select Project** at https://console.firebase.google.com
2. **Get Service Account Key** (Backend)
   - Project Settings > Service Accounts > Generate New Private Key
   - Save the JSON file
3. **Get Web Config** (Frontend)
   - Project Settings > General > Your apps > Web app
   - Copy the config object
4. **Get VAPID Key** (Frontend)
   - Project Settings > Cloud Messaging > Web Push certificates
   - Click "Generate key pair"

### Step 2: Backend Setup (1 minute)

```bash
cd storefront360-api

# 1. Install dependencies (already done)
npm install

# 2. Add to .env
echo 'FIREBASE_SERVICE_ACCOUNT_JSON={"type":"service_account",...}' >> .env

# 3. Run migration
npm run migrate

# 4. Start server
npm start
```

### Step 3: Frontend Setup (2 minutes)

```bash
cd storefront360-mobile

# 1. Add to .env
cat >> .env << EOF
REACT_APP_FIREBASE_API_KEY=your-api-key
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
REACT_APP_FIREBASE_APP_ID=your-app-id
REACT_APP_FIREBASE_VAPID_KEY=your-vapid-key
EOF

# 2. Update public/firebase-messaging-sw.js with your config

# 3. Start app
npm start
```

## 🧪 Quick Test

### Test 1: Login and Check Token
```bash
# 1. Open browser (must be HTTPS or localhost)
# 2. Login to app
# 3. Check console for: "[Firebase] FCM token obtained: ..."
# 4. Grant notification permission when prompted
```

### Test 2: Send Test Notification
```bash
curl -X POST http://localhost:5000/api/user/test-notification \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","message":"It works!"}'
```

You should see a notification appear!

## 📋 Common Issues

### "No FCM token"
- Check notification permission in browser
- Ensure HTTPS or localhost
- Check browser console for errors

### "Firebase not initialized"
- Verify FIREBASE_SERVICE_ACCOUNT_JSON in backend .env
- Check Firebase config in frontend .env
- Restart both servers

### "Service Worker not registering"
- Must use HTTPS (or localhost)
- Check files are in /public directory
- Clear browser cache

## 🔑 Key Files

### Backend
- `/src/services/notification.service.js` - Notification logic
- `/src/controllers/users.controller.js` - FCM token endpoints
- `/src/controllers/notifications.controller.js` - Push notification endpoints

### Frontend
- `/public/firebase-messaging-sw.js` - Background notifications
- `/public/service-worker.js` - Offline caching
- `/src/config/firebase.ts` - Firebase initialization
- `/src/services/notifications.ts` - Notification management
- `/App.tsx` - Service worker registration

## 📡 Quick API Reference

### Store FCM Token
```bash
POST /api/user/fcm-token
Body: { "fcmToken": "..." }
```

### Send Test Notification
```bash
POST /api/user/test-notification
Body: { "title": "Hello", "message": "World" }
```

### Send to Multiple Users (Admin)
```bash
POST /api/notifications/push/users
Body: {
  "userIds": ["uuid1", "uuid2"],
  "title": "New Sale!",
  "message": "Check out our latest deals"
}
```

### Subscribe to Topic
```bash
POST /api/notifications/subscribe
Body: { "topic": "sales-alerts" }
```

## 🎯 Topics Available

- `all-users` - Broadcast to everyone
- `admin-alerts` - Admin notifications
- `sales-notifications` - Sales updates
- `inventory-alerts` - Stock alerts
- `promotional-offers` - Marketing

## 📚 Full Documentation

- **Setup Guide:** `/storefront360-api/FIREBASE_SETUP.md`
- **Implementation Summary:** `/FIREBASE_FCM_IMPLEMENTATION_SUMMARY.md`

## 🆘 Need Help?

1. Check browser console for errors
2. Check server logs
3. Verify Firebase Console delivery status
4. Review full documentation files above

## ✅ Success Checklist

- [ ] Firebase project created
- [ ] Service account JSON added to backend .env
- [ ] Firebase config added to frontend .env
- [ ] Database migration run
- [ ] Service workers registered (check DevTools > Application)
- [ ] FCM token generated (check console)
- [ ] Test notification sent successfully
- [ ] Notification appears on screen

---

**That's it! 🎉 You're now ready to send push notifications!**

For advanced features like batch notifications, topics, and offline sync, see the full documentation.
