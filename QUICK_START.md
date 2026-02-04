# Quick Start Guide 🚀

Frontend พร้อมใช้งานเต็มที่! รูปทั้งหมดโหลดจาก GitHub

---

## ⚙️ Image Configuration

**ตำแหน่ง:** `src/utils/images.ts`

```typescript
export const IMAGE_CONFIG = {
  BASE_URL: 'https://raw.githubusercontent.com/earthoer/image-deposit/main',
};
```

**เปลี่ยน Base URL:**
```typescript
// GitHub (ปัจจุบัน)
BASE_URL: 'https://raw.githubusercontent.com/earthoer/image-deposit/main',

// Backend (ถ้าต้องการ)
BASE_URL: 'https://idle-garden-be-production.up.railway.app',

// CDN อื่นๆ
BASE_URL: 'https://your-cdn.com',
```

**แค่แก้ที่เดียว → รูปทั้งหมดเปลี่ยน!**

---

## 🖼️ Image Structure

### GitHub Repository:
```
https://github.com/earthoer/image-deposit

image-deposit/
├── seeds/
│   ├── bean_sprout/bean_sprout_04.png
│   ├── carrot/carrot_04.png
│   ├── lettuce/lettuce_04.png
│   ├── radish/radish_04.png
│   └── spinach/spinach_04.png
└── locations/
    ├── waste_land/map.png + pot.png
    ├── front_yard/map.png + pot.png
    ├── back_yard/map.png + pot.png
    └── garden/map.png + pot.png
```

**Total: 13 images** ✅

---

## 🔄 Update Images

### 1. แทนที่รูปเดิม (ง่ายสุด):
```bash
cd image-deposit

# แทนที่ไฟล์ (ชื่อเดิม)
cp new_image.png seeds/radish/radish_04.png

# Push
git add .
git commit -m "Update radish image"
git push

# รอ 1-2 นาที (cache)
# App จะโหลดรูปใหม่
```

### 2. เพิ่มรูปใหม่:
```bash
# เพิ่มไฟล์ใหม่
cp new_seed.png seeds/tomato/tomato_04.png

# แก้ backend database (เพิ่ม seed ใหม่)
# icon: "/seeds/tomato/tomato_04.png"

# Push
git push
```

---

## 🚀 Run Frontend

```bash
cd idle-garden-app

# Install
npm install

# Start
npm start

# Choose platform:
# Press 'w' for web
# Press 'a' for Android  
# Press 'i' for iOS
# Or scan QR with Expo Go
```

---

## 🎯 API Endpoints Used

```
✅ GET /auth/profile         - User data
✅ GET /seeds                - All seeds
✅ GET /locations            - All locations
✅ POST /game/plant          - Plant tree
✅ POST /game/click          - Water tree
✅ POST /game/sell           - Sell tree
```

---

## 🎨 Features

### Header:
```
🌱 Idle Garden
🔥 Location picker
💰 Gold display
⚙️ Settings
👤 Profile/Logout
```

### Main Game:
```
🖼️ Background (location map)
🪴 Pot (location pot)
🌱 Tree (seed image)
📊 Progress bar
⏱️ Timer
🔥 Combo
💰 Sell value
```

### Action Buttons:
```
💧 Water (reduce time)
🌳 Sell (when ready)
🔒 Locked (coming soon)
```

### Bottom Tabs:
```
🌱 Seeds (5 cards)
🗺️ Locations (4 items)
🛒 Shop (coming soon)
👤 Profile (stats)
```

---

## 🐛 Troubleshooting

### รูปไม่โหลด?

**1. เช็ค URL:**
```typescript
import { getImageUrl } from './src/utils/images';
console.log(getImageUrl('/seeds/radish/radish_04.png'));
```

**2. Test ใน Browser:**
```
https://raw.githubusercontent.com/earthoer/image-deposit/main/seeds/radish/radish_04.png
```

**3. เช็ค GitHub:**
```
https://github.com/earthoer/image-deposit/tree/main/seeds
```

**4. Cache:**
```
GitHub cache: 1-2 minutes
Browser cache: Clear (Ctrl+Shift+R)
App cache: Restart app
```

---

## 📁 Project Structure

```
idle-garden-app/
├── src/
│   ├── api/
│   │   ├── auth.ts        - Authentication
│   │   ├── game.ts        - Game actions
│   │   ├── client.ts      - Axios instance
│   │   └── config.ts      - API URLs
│   ├── screens/
│   │   ├── LoginScreen.tsx
│   │   └── GameScreen.tsx
│   ├── types/
│   │   └── index.ts       - TypeScript types
│   └── utils/
│       ├── game.ts        - Game helpers
│       ├── images.ts      - ⭐ Image config
│       └── storage.ts     - AsyncStorage
├── App.tsx                - Main app
└── package.json
```

---

## ⚡ Performance Tips

### Image Loading:
```typescript
// Preload images
import { Image } from 'react-native';

const preloadImages = async () => {
  const images = [
    'https://raw.githubusercontent.com/.../bean_sprout_04.png',
    'https://raw.githubusercontent.com/.../radish_04.png',
    // ...
  ];
  
  await Promise.all(
    images.map(url => Image.prefetch(url))
  );
};
```

### Cache:
```
React Native automatically caches images
First load: Slow (from network)
Next loads: Fast (from cache)
```

---

## 🔧 Configuration Files

### API Config: `src/api/config.ts`
```typescript
BASE_URL: 'https://idle-garden-be-production.up.railway.app/api'
```

### Image Config: `src/utils/images.ts`
```typescript
BASE_URL: 'https://raw.githubusercontent.com/earthoer/image-deposit/main'
```

### App Config: `app.json`
```json
{
  "name": "Idle Garden",
  "scheme": "idlegarden"
}
```

---

## 📦 Dependencies

```json
{
  "@react-native-async-storage/async-storage": "^2.2.0",
  "axios": "^1.7.7",
  "expo": "~54.0.33",
  "react": "19.1.0",
  "react-dom": "19.1.0",
  "react-native": "0.81.5",
  "react-native-safe-area-context": "^5.6.2",
  "react-native-web": "^0.21.2"
}
```

**Total: 9 packages** (minimal!)

---

## ✅ Checklist

```
✅ Frontend uses GitHub images
✅ Config in utils/images.ts
✅ All images (13/13) in GitHub
✅ OAuth working (web + mobile)
✅ Game mechanics working
✅ UI matches mockup
✅ TypeScript no errors
✅ Ready to deploy!
```

---

## 🚢 Deploy

### Frontend (Vercel/Netlify):
```bash
# Build web version
npx expo export:web

# Deploy dist/ folder
```

### Mobile (Expo):
```bash
# Build APK/IPA
eas build --platform android
eas build --platform ios

# Submit to stores
eas submit
```

---

## 🎉 You're Ready!

```bash
npm install
npm start
# Press 'w' for web
```

**Everything works out of the box!**

---

**Documentation:**
- `IMAGE_SETUP.md` - Backend static files
- `GITHUB_IMAGES.md` - GitHub hosting
- `QUICK_START.md` - This file

**Support:** มีปัญหาถามได้! 🌱✨
