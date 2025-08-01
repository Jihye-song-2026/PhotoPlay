# Firebase Setup Guide

## 🔧 **To Fix the "Failed to load audio file" Error**

The error occurs because Firebase is not properly configured. Follow these steps:

### 1. **Get Your Firebase Credentials**

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `qr-ar-voice`
3. Click the gear icon ⚙️ next to "Project Overview"
4. Select "Project settings"
5. Scroll down to "Your apps" section
6. Click on the web app (or create one if none exists)
7. Copy the configuration object

### 2. **Update Firebase Configuration**

Replace the placeholder values in `src/firebase.js`:

```javascript
const firebaseConfig = {
  apiKey: "your-actual-api-key-here",
  authDomain: "qr-ar-voice.firebaseapp.com",
  projectId: "qr-ar-voice",
  storageBucket: "qr-ar-voice.appspot.com",
  messagingSenderId: "your-actual-sender-id",
  appId: "your-actual-app-id"
};
```

### 3. **Enable Firebase Storage**

1. In Firebase Console, go to "Storage" in the left sidebar
2. Click "Get started" if not already set up
3. Choose a location (e.g., `us-central1`)
4. Start in test mode (for development)

### 4. **Deploy the Updated App**

```bash
npm run build
npx firebase-tools deploy
```

### 5. **Test Again**

1. Go to https://qr-ar-voice.web.app
2. Upload a photo and record voice
3. Generate QR code
4. Scan the QR code
5. Voice should now play properly!

## 🚨 **If You Don't Have Firebase Credentials**

For testing purposes, the app will use local blob URLs, but these won't work when shared. You need Firebase for the full functionality.

## 📱 **Alternative: Use Links Instead**

If you want to test without Firebase, try the "Add Your Link" feature instead of voice recording. Links work without Firebase configuration.

---

**Need Help?** Check the Firebase Console for your exact credentials or create a new Firebase project. 