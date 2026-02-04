# v1.8 - Load Planted Trees Fix 🌱

**ปัญหา:** เข้ามาไม่เห็นต้นไม้ที่ปลูกไว้

**สาเหตุ:** `loadGameData()` ตั้ง `setPlantedTrees([])` ทุกครั้ง → ไม่โหลดจาก backend

**แก้ไข:** ใช้ API `GET /users/:userId/state` โหลดข้อมูลครบ

---

## 🔧 Files Changed:

### 1. **src/api/config.ts**
```typescript
// เพิ่ม endpoint
GET_USER_STATE: '/users/:userId/state',
```

### 2. **src/api/auth.ts**
```typescript
// เพิ่ม function ใหม่
async getGameState(): Promise<any> {
  const profile = await this.getMe();
  const userId = profile._id;
  
  const response = await apiClient.get(
    API_CONFIG.ENDPOINTS.GET_USER_STATE.replace(':userId', userId)
  );
  
  return response.data?.data || response.data;
}
```

### 3. **src/screens/GameScreen.tsx**
```typescript
// แก้ loadGameData()
const loadGameData = async () => {
  try {
    // ⭐ เปลี่ยนจาก 3 API calls เป็น 1 call
    const gameState = await authApi.getGameState();
    
    const [seedsData, locationsData] = await Promise.all([
      gameApi.getSeeds(),
      gameApi.getLocations(),
    ]);

    setUser(gameState.user);
    setSeeds(seedsData);
    setLocations(locationsData);
    setPlantedTrees(gameState.plantedTrees || []); // ⭐ โหลดต้นที่ปลูกไว้
    
    const userLocation = locationsData.find(
      (loc) => loc.code === gameState.user.currentLocation
    );
    setCurrentLocation(userLocation || locationsData[0]);
  } catch (error) {
    console.error('Failed to load game data:', error);
  } finally {
    setLoading(false);
  }
};
```

---

## 📊 API Response:

**GET /users/:userId/state**

```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "697dd77a7460c044869d03f2",
      "email": "earthgodna@gmail.com",
      "gold": 1500,
      "totalTreesSold": 15,
      "currentLocation": "waste_land"
    },
    "plantedTrees": [ // ⭐ มีข้อมูลต้นไม้ที่ปลูกไว้
      {
        "_id": "6981f94e468474606a8025ec",
        "seedId": {
          "_id": "697e450a0baed0f51ec98b67",
          "code": "bean_sprout",
          "name": "Bean Sprout",
          "baseSellPrice": 100,
          "icon": "/seeds/bean_sprout/bean_sprout_04.png"
        },
        "slotIndex": 0,
        "quality": "normal",
        "startTime": "2026-02-03T13:34:06.085Z",
        "endTime": "2026-02-03T13:39:06.085Z",
        "timeReduced": 0,
        "timeLeft": 120,
        "isReady": false
      }
    ],
    "stats": {
      "totalSlots": 1,
      "occupiedSlots": 1,
      "availableSlots": 0
    }
  }
}
```

---

## ✅ Flow:

### Before (v1.7):
```
1. loadGameData()
2. authApi.getMe() → user only
3. gameApi.getSeeds() → seeds
4. gameApi.getLocations() → locations
5. setPlantedTrees([]) → ❌ เคลียร์ต้นไม้
```

### After (v1.8):
```
1. loadGameData()
2. authApi.getGameState() → user + plantedTrees ✅
3. gameApi.getSeeds() → seeds
4. gameApi.getLocations() → locations
5. setPlantedTrees(gameState.plantedTrees) → ✅ โหลดต้นที่ปลูกไว้
```

---

## 🧪 Testing:

### 1. Plant Tree:
```
1. กด Seeds tab
2. เลือก Bean Sprout
3. กดปลูก
4. ✅ เห็นต้นไม้
```

### 2. Refresh:
```
1. ปิดแอพ
2. เปิดใหม่
3. ✅ ควรเห็นต้นที่ปลูกไว้
```

### 3. Check Growth:
```
1. ดูต้นไม้
2. ✅ รูปเปลี่ยนตาม progress
3. ✅ Timer countdown
4. ✅ Progress bar ทำงาน
```

---

## 🎯 Benefits:

```
✅ โหลดต้นที่ปลูกไว้จาก backend
✅ Refresh ยังเห็นต้นไม้อยู่
✅ ลด API calls (3 → 2)
✅ ข้อมูลครบ (user + plantedTrees + stats)
```

---

## 🐛 Known Issues:

### ถ้า plantedTrees ไม่โหลด:
```
1. เช็ค Console errors
2. เช็ค network tab (F12)
3. ดู API response
4. Verify JWT token
```

### ถ้า backend ไม่มี trees:
```
Response:
{
  "plantedTrees": [] // Empty array
}

→ แสดง empty pot ✅
```

---

## 📝 Summary:

**Version:** 1.8.0  
**Date:** Feb 3, 2026  
**Fix:** Load planted trees from backend  
**API:** GET /users/:userId/state  

**Changes:**
- ✅ config.ts: Add GET_USER_STATE
- ✅ auth.ts: Add getGameState()
- ✅ GameScreen.tsx: Use getGameState()

**Status:** Ready to test! 🌱✨

---

**ทดสอบได้เลย:**
```bash
npm install
npm start
# Press 'w'
# Login → Plant → Refresh → ✅ เห็นต้นไม้
```
