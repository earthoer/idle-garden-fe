# Idle Garden - Mobile App

React Native mobile game built with Expo.

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm start
```

### 3. Run on Device
- Scan QR code with Expo Go app
- Or press `a` for Android, `i` for iOS

---

## 📱 Features

- ✅ Google OAuth Login
- ✅ Plant & Grow Trees
- ✅ Water (Click) System
- ✅ Sell Trees for Gold
- ✅ 5 Seeds (Bean Sprout → Carrot)
- ✅ Real-time Updates

---

## 🏗️ Project Structure

```
src/
├── api/
│   ├── config.ts       # API endpoints
│   ├── client.ts       # Axios client
│   ├── auth.ts         # Auth API
│   └── game.ts         # Game API
├── screens/
│   ├── LoginScreen.tsx # Login with Google
│   └── GameScreen.tsx  # Main game
├── types/
│   └── index.ts        # TypeScript types
└── utils/
    ├── storage.ts      # AsyncStorage
    └── game.ts         # Game helpers
```

---

## 🔧 Key Features

### OAuth Deep Link
- Scheme: `idlegarden://`
- Callback: `idlegarden://auth?token=xxx`

### API Integration
- Base URL: `https://idle-garden-be-production.up.railway.app/api`
- JWT Authentication
- Auto token injection

### Dependencies (Minimal)
```json
{
  "@react-native-async-storage/async-storage": "^2.2.0",
  "axios": "^1.7.7",
  "expo": "~54.0.33",
  "react-native-safe-area-context": "^5.6.2"
}
```

---

## 🧪 Testing

1. Open Expo Go app
2. Scan QR code
3. Tap "Sign in with Google"
4. Approve on browser
5. Auto redirect to app
6. ✅ Login success!

---

## 🐛 Troubleshooting

### Login stuck?
- Check console logs
- Verify deep link: `idlegarden://auth?token=xxx`
- Check token saved in AsyncStorage

### No data showing?
- Verify backend is running
- Check API URL in `src/api/config.ts`
- Check network connection

---

**Happy Gardening!** 🌱
