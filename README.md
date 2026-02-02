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

**iOS:**
```bash
npm run ios
```

**Android:**
```bash
npm run android
```

**Web:**
```bash
npm run web
```

---

## 📱 Features

- ✅ Google OAuth Login
- ✅ Plant & Grow Trees
- ✅ Water (Click) System with Combo
- ✅ Sell Trees for Gold
- ✅ 5 Seeds (Bean Sprout → Carrot)
- ✅ 4 Locations (Waste Land → Garden)
- ✅ Real-time Progress Updates
- ✅ Offline Support (AsyncStorage)

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
│   ├── LoginScreen.tsx
│   └── GameScreen.tsx
├── types/
│   └── index.ts        # TypeScript types
└── utils/
    ├── storage.ts      # AsyncStorage
    └── game.ts         # Game utilities
```

---

## 🔧 Configuration

**API URL:**  
Edit `src/api/config.ts`:
```typescript
export const API_CONFIG = {
  BASE_URL: 'https://idle-garden-be-production.up.railway.app/api',
  // ...
};
```

---

## 🎮 How to Play

1. **Login** with Google
2. **Tap empty slot** to plant seed
3. **Tap Water** to reduce grow time
4. **Build combos** for faster progress
5. **Sell trees** when ready
6. **Upgrade** seeds & locations

---

## 🐛 Troubleshooting

### Can't login?
```
- Check API_URL in src/api/config.ts
- Check Google OAuth setup
- Clear app data & restart
```

### No data showing?
```
- Check backend is running
- Verify seeds are seeded
- Check network connection
```

---

## 📦 Build for Production

**Android:**
```bash
eas build --platform android
```

**iOS:**
```bash
eas build --platform ios
```

---

## 🎨 Design

- Dark theme
- Minimal UI
- Touch-friendly buttons
- Real-time updates

---

**Happy Gardening!** 🌱
