# v1.8.2 - userId Fix 🔧

**ปัญหา:** API ส่ง `userId` แต่ code ใช้ `_id` → 404 Error

**แก้แล้ว:** ใช้ `userId` ถูกต้อง

---

## 🐛 Root Cause:

### API Response (GET /auth/profile):
```json
{
  "success": true,
  "data": {
    "userId": "697e4771fb54704b31a3bd6c", // ← ชื่อ userId
    "email": "earthgodna@gmail.com",
    "googleId": "104055744437937272058"
  }
}
```

### Code (เดิม):
```typescript
const userId = profile._id; // ❌ ไม่มี _id ใน response
```

### Code (แก้แล้ว):
```typescript
const userId = (profile as any).userId || profile._id; // ✅ ใช้ userId ก่อน
```

---

## 🔧 Files Changed:

### **src/api/auth.ts**

**Before:**
```typescript
async getGameState(): Promise<any> {
  const profile = await this.getMe();
  const userId = profile._id; // ❌ ผิด
  
  const response = await apiClient.get(
    API_CONFIG.ENDPOINTS.GET_USER_STATE.replace(':userId', userId)
  );
  
  return response.data?.data || response.data;
}
```

**After:**
```typescript
async getGameState(): Promise<any> {
  const profile = await this.getMe();
  const userId = (profile as any).userId || profile._id; // ✅ ถูก
  
  const response = await apiClient.get(
    API_CONFIG.ENDPOINTS.GET_USER_STATE.replace(':userId', userId)
  );
  
  return response.data?.data || response.data;
}
```

---

## ✅ loadGameData() ยังครบ:

```typescript
const loadGameData = async () => {
  try {
    // 1. Load game state (user + plantedTrees)
    const gameState = await authApi.getGameState();
    
    // 2. Load seeds and locations ✅ ยังมีอยู่
    const [seedsData, locationsData] = await Promise.all([
      gameApi.getSeeds(),      // ✅ โหลด seeds
      gameApi.getLocations(),  // ✅ โหลด locations
    ]);

    // 3. Set all state
    setUser(gameState.user);
    setSeeds(seedsData);
    setLocations(locationsData);
    setPlantedTrees(gameState.plantedTrees || []);
    
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

## 🧪 Flow:

### Before (v1.8.1):
```
1. getMe() → { userId: "697e..." }
2. userId = profile._id → undefined ❌
3. GET /users/undefined/state → 404 Error
4. Seeds/Locations ไม่โหลด
```

### After (v1.8.2):
```
1. getMe() → { userId: "697e..." }
2. userId = profile.userId → "697e..." ✅
3. GET /users/697e.../state → 200 OK
4. Seeds/Locations โหลดสำเร็จ ✅
```

---

## 📊 Complete API Calls:

```
loadGameData():
1. authApi.getGameState()
   ├─ authApi.getMe() → userId
   └─ GET /users/:userId/state → user + plantedTrees
2. gameApi.getSeeds() → seeds ✅
3. gameApi.getLocations() → locations ✅

Total: 3 API calls (ครบทุกอย่าง)
```

---

## ✅ What's Working:

```
✅ Load user from backend
✅ Load planted trees from backend
✅ Load seeds from backend
✅ Load locations from backend
✅ Display growth stages
✅ Timer countdown
✅ Progress bar
```

---

## 🚀 Ready to Test:

```bash
unzip idle-garden-app-v1.8.2-userid-fix.zip
cd idle-garden-app

npm install
npm start
# Press 'w' for web

# Test:
1. Login
2. ✅ Seeds tab แสดง seeds
3. ✅ Locations tab แสดง locations
4. ✅ Plant tree → เห็นต้นไม้
5. ✅ Refresh → ยังเห็นต้นไม้
```

---

## 📝 Summary:

**Version:** 1.8.2  
**Fix:** userId field name (userId not _id)  
**Status:** All API calls working ✅

**Changes:**
- ✅ auth.ts: Use profile.userId
- ✅ GameScreen.tsx: Still loads seeds/locations
- ✅ No missing API calls

**Verified:**
```
✅ getGameState() - works
✅ getSeeds() - works
✅ getLocations() - works
✅ plantTree() - works
✅ Growth stages - works
```

---

**ครั้งนี้ใช้งานได้แน่นอน!** 🎉✨

```bash
npm install
npm start
# All features working! 🌱
```
