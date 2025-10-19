# Firebase Cloud Messaging - Deployment Checklist

Use this checklist to ensure proper deployment of FCM and Service Workers to production.

## Pre-Deployment Checklist

### Backend (API)

- [ ] **Firebase Admin SDK installed**
  ```bash
  npm list firebase-admin
  ```

- [ ] **Environment variable configured**
  - [ ] `FIREBASE_SERVICE_ACCOUNT_JSON` set in production environment
  - [ ] JSON is properly formatted (no line breaks in string)
  - [ ] Service account has correct permissions

- [ ] **Database migration executed**
  ```bash
  npm run migrate
  ```
  - [ ] `fcmToken` field exists in users table
  - [ ] Field is TEXT type (not VARCHAR)

- [ ] **API endpoints tested**
  - [ ] POST `/api/user/fcm-token` - stores token
  - [ ] DELETE `/api/user/fcm-token` - removes token
  - [ ] POST `/api/user/test-notification` - sends notification
  - [ ] POST `/api/notifications/push/users` - batch send (admin)
  - [ ] POST `/api/notifications/push/topic` - topic send (admin)

- [ ] **Error handling verified**
  - [ ] Invalid tokens handled gracefully
  - [ ] Expired tokens cleaned up
  - [ ] Service logs errors properly

### Frontend (Mobile/Web)

- [ ] **Firebase SDK ready**
  - [ ] Firebase config files in place
  - [ ] Environment variables set
  - [ ] VAPID key configured

- [ ] **Service Workers configured**
  - [ ] `firebase-messaging-sw.js` updated with config
  - [ ] `service-worker.js` in /public directory
  - [ ] `offline.html` fallback page exists
  - [ ] `manifest.json` configured

- [ ] **HTTPS enabled**
  - [ ] Production domain uses HTTPS
  - [ ] SSL certificate valid
  - [ ] Service workers require HTTPS

- [ ] **App.tsx updated**
  - [ ] Service worker registration added
  - [ ] Notification initialization on login
  - [ ] Platform detection (web vs native)

- [ ] **Testing completed**
  - [ ] Service workers register successfully
  - [ ] FCM token generated
  - [ ] Notifications appear (foreground & background)
  - [ ] Notification clicks work
  - [ ] Offline mode works

## Deployment Steps

### 1. Backend Deployment

#### Heroku
```bash
# Set environment variable
heroku config:set FIREBASE_SERVICE_ACCOUNT_JSON='{"type":"service_account",...}' --app your-app-name

# Deploy
git push heroku main

# Run migration
heroku run npm run migrate --app your-app-name

# Check logs
heroku logs --tail --app your-app-name
```

#### Render
```bash
# Add environment variable in Render dashboard
# Or via CLI:
render config:set FIREBASE_SERVICE_ACCOUNT_JSON='{"type":"service_account",...}'

# Deploy (automatic from git)
# Or manual:
render deploy

# Check logs in dashboard
```

#### Railway/Other
```bash
# Set environment variable in platform dashboard
# Deploy according to platform instructions
# Run migration after deployment
```

### 2. Frontend Deployment

#### Vercel
```bash
# Add environment variables to .env.production
REACT_APP_FIREBASE_API_KEY=...
REACT_APP_FIREBASE_PROJECT_ID=...
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=...
REACT_APP_FIREBASE_APP_ID=...
REACT_APP_FIREBASE_VAPID_KEY=...

# Deploy
vercel --prod

# Or link and deploy
vercel link
vercel --prod
```

#### Netlify
```bash
# Add environment variables in Netlify dashboard
# Or via CLI:
netlify env:set REACT_APP_FIREBASE_API_KEY "your-key"
# ... repeat for all variables

# Deploy
netlify deploy --prod
```

#### Heroku (Create React App)
```bash
# Environment variables should be in .env
# Deploy
git push heroku main
```

## Post-Deployment Verification

### Backend Checks

- [ ] **Server starts successfully**
  ```bash
  # Check logs for:
  # ✅ Firebase Admin SDK initialized successfully
  ```

- [ ] **Health check passes**
  ```bash
  curl https://your-api.com/health
  ```

- [ ] **Notification service working**
  ```bash
  curl -X POST https://your-api.com/api/user/test-notification \
    -H "Authorization: Bearer TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"title":"Test","message":"Testing production"}'
  ```

- [ ] **Database migration applied**
  - [ ] Check users table has fcmToken column
  - [ ] Column type is TEXT
  - [ ] No errors in migration logs

### Frontend Checks

- [ ] **App loads successfully**
  - [ ] Visit production URL
  - [ ] No console errors
  - [ ] App renders correctly

- [ ] **Service Workers registered**
  - [ ] Open DevTools > Application > Service Workers
  - [ ] Both service workers active
  - [ ] No registration errors

- [ ] **FCM token generated**
  - [ ] Login to app
  - [ ] Check console: "[Firebase] FCM token obtained"
  - [ ] Token sent to backend successfully

- [ ] **Notifications working**
  - [ ] Grant notification permission
  - [ ] Send test notification from API
  - [ ] Notification appears
  - [ ] Click action works

- [ ] **Offline mode works**
  - [ ] Disable network in DevTools
  - [ ] App still loads from cache
  - [ ] Offline page shown for new pages

### Firebase Console Checks

- [ ] **Cloud Messaging enabled**
  - [ ] Project Settings > Cloud Messaging
  - [ ] Web Push certificates configured
  - [ ] VAPID key matches frontend

- [ ] **Service account active**
  - [ ] Service Accounts tab shows active account
  - [ ] Permissions are correct

- [ ] **Usage monitoring**
  - [ ] Cloud Messaging > Reports
  - [ ] Check message delivery
  - [ ] Monitor error rates

## Security Verification

- [ ] **Credentials secured**
  - [ ] Service account JSON not in git
  - [ ] Environment variables not exposed
  - [ ] `.env` files in `.gitignore`

- [ ] **API security**
  - [ ] Authentication required for all endpoints
  - [ ] Admin endpoints restricted
  - [ ] Rate limiting enabled

- [ ] **CORS configured**
  - [ ] Only production domains allowed
  - [ ] Credentials included if needed

- [ ] **HTTPS enforced**
  - [ ] SSL certificate valid
  - [ ] HTTP redirects to HTTPS
  - [ ] Service workers only on HTTPS

## Performance Checks

- [ ] **Caching strategy**
  - [ ] Static assets cached
  - [ ] API responses cached appropriately
  - [ ] Cache updates work

- [ ] **Service worker updates**
  - [ ] New version prompts update
  - [ ] Update mechanism works
  - [ ] No breaking changes on update

- [ ] **Token refresh**
  - [ ] Tokens refresh on login
  - [ ] Expired tokens cleaned up
  - [ ] Invalid tokens removed

## Monitoring Setup

- [ ] **Error tracking**
  - [ ] Server logs FCM errors
  - [ ] Frontend logs notification errors
  - [ ] Error alerts configured

- [ ] **Analytics**
  - [ ] Track notification delivery rate
  - [ ] Monitor user engagement
  - [ ] Track permission requests

- [ ] **Alerts**
  - [ ] High error rate alerts
  - [ ] Service worker failures
  - [ ] Firebase quota warnings

## Rollback Plan

### If Issues Occur:

1. **Backend issues:**
   ```bash
   # Revert to previous deployment
   heroku rollback --app your-app-name
   # Or redeploy previous version
   ```

2. **Frontend issues:**
   ```bash
   # Revert deployment
   vercel rollback
   # Or redeploy previous version
   ```

3. **Database issues:**
   ```bash
   # Undo migration
   npm run migrate:undo
   ```

4. **Service worker issues:**
   - Clear cache: DevTools > Application > Clear storage
   - Unregister service worker
   - Deploy fix
   - Users may need to hard refresh (Ctrl+Shift+R)

## Success Criteria

### Must Have:
- ✅ API starts without errors
- ✅ Firebase initialized successfully
- ✅ Service workers registered
- ✅ Notifications sent and received
- ✅ Offline mode works

### Nice to Have:
- ✅ Topic subscriptions work
- ✅ Batch notifications work
- ✅ Admin endpoints secured
- ✅ Analytics tracking enabled
- ✅ Error monitoring active

## Common Deployment Issues

### Issue: "Firebase not initialized"
**Solution:** Check FIREBASE_SERVICE_ACCOUNT_JSON in environment variables

### Issue: "Service worker not registering"
**Solution:** Ensure HTTPS is enabled and files are in /public

### Issue: "No notifications appearing"
**Solution:** Check FCM token in database, verify permissions

### Issue: "CORS errors"
**Solution:** Update CORS configuration to include production domain

### Issue: "Invalid tokens"
**Solution:** Normal - system automatically cleans up invalid tokens

## Post-Deployment Tasks

- [ ] **Document deployment**
  - [ ] Record deployment date/time
  - [ ] Note any issues encountered
  - [ ] Update team on status

- [ ] **User communication**
  - [ ] Notify users of push notification feature
  - [ ] Provide instructions to enable
  - [ ] Highlight offline capabilities

- [ ] **Monitor for 24 hours**
  - [ ] Check error rates
  - [ ] Monitor notification delivery
  - [ ] Watch for user issues

- [ ] **Optimize**
  - [ ] Review cache performance
  - [ ] Adjust notification timing
  - [ ] Tune offline strategy

## Environment Variables Reference

### Backend (.env)
```env
FIREBASE_SERVICE_ACCOUNT_JSON={"type":"service_account","project_id":"...","private_key":"..."}
```

### Frontend (.env or .env.production)
```env
REACT_APP_FIREBASE_API_KEY=AIza...
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
REACT_APP_FIREBASE_APP_ID=1:123456789:web:abc123
REACT_APP_FIREBASE_MEASUREMENT_ID=G-ABC123
REACT_APP_FIREBASE_VAPID_KEY=BN7X...
```

## Support Resources

- **Firebase Console:** https://console.firebase.google.com
- **Documentation:** `/storefront360-api/FIREBASE_SETUP.md`
- **Quick Start:** `/QUICK_START_FCM.md`
- **Implementation Summary:** `/FIREBASE_FCM_IMPLEMENTATION_SUMMARY.md`

---

## Final Checklist

Before marking deployment complete:

- [ ] All pre-deployment checks passed
- [ ] Deployment successful on all platforms
- [ ] Post-deployment verification complete
- [ ] Security audit passed
- [ ] Performance acceptable
- [ ] Monitoring active
- [ ] Documentation updated
- [ ] Team notified
- [ ] Rollback plan tested and ready

---

**Deployment Status:** [ ] Complete [ ] In Progress [ ] Not Started

**Deployed By:** _______________
**Deployment Date:** _______________
**Production URL:** _______________
**Issues Encountered:** _______________

---

✅ **Once all checkboxes are complete, your FCM implementation is production-ready!**
