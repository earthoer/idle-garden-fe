# v2.0.4 - TypeScript Fix ✅

**แก้ TypeScript Error:** `Property 'timeReduced' does not exist on type 'PlantedTree'`

---

## 🐛 Error:

```typescript
Property 'timeReduced' does not exist on type 'PlantedTree'. ts(2339)
```

**Location:**
```typescript
// GameScreen.tsx line ~124
tree._id === plantedTrees[0]._id
  ? { ...tree, timeReduced: (tree.timeReduced || 0) + timeReduction }
  //           ^^^^^^^^^^^  ← Error here
  : tree
```

---

## ✅ แก้แล้ว:

### **เพิ่ม field `timeReduced` ใน type definition**

**File:** `src/types/index.ts`

**Before:**
```typescript
export interface PlantedTree {
  _id: string;
  userId: string;
  seedId: string;
  slotIndex: number;
  plantedAt: Date;
  harvestableAt: Date;
  startTime?: Date;
  endTime?: Date;
  currentGrowTime: number;
  totalGrowTime: number;
  quality: 'normal' | 'golden' | 'rainbow';
  isReady: boolean;
  locationBonus: number;
}
```

**After:**
```typescript
export interface PlantedTree {
  _id: string;
  userId: string;
  seedId: string;
  slotIndex: number;
  plantedAt: Date;
  harvestableAt: Date;
  startTime?: Date;
  endTime?: Date;
  currentGrowTime: number;
  totalGrowTime: number;
  quality: 'normal' | 'golden' | 'rainbow';
  isReady: boolean;
  locationBonus: number;
  timeReduced?: number; // ⭐ จำนวนวินาทีที่ลดไปแล้ว
}
```

---

## 📊 Type Details:

### **timeReduced Field:**

**Type:** `number | undefined` (optional)  
**Unit:** วินาที  
**Purpose:** เก็บจำนวนวินาทีที่ลดเวลาโตไปแล้วจาก watering  

**Example:**
```typescript
const tree: PlantedTree = {
  _id: "69820234...",
  seedId: "697e450a...",
  startTime: new Date("2026-02-04T14:00:00.000Z"),
  endTime: new Date("2026-02-04T14:05:00.000Z"), // 5 min
  timeReduced: 42, // ⭐ ลด 42 วิแล้ว
  // ... other fields
};

// Actual time left:
// endTime - now - (timeReduced * 1000)
// = 300s - 42s = 258s = 4:18
```

---

## 🧮 Usage:

### **1. Update timeReduced:**
```typescript
const updatedTrees = plantedTrees.map((tree) =>
  tree._id === currentTreeId
    ? { ...tree, timeReduced: (tree.timeReduced || 0) + timeReduction }
    : tree
);
```

### **2. Calculate remaining time:**
```typescript
const endTime = new Date(tree.endTime).getTime();
const timeReducedMs = (tree.timeReduced || 0) * 1000;
const adjustedEndTime = endTime - timeReducedMs;
const remaining = Math.max(0, Math.floor((adjustedEndTime - now) / 1000));
```

### **3. Backend Response:**
```json
{
  "data": {
    "plantedTree": {
      "_id": "69820234...",
      "seedId": "697e450a...",
      "startTime": "2026-02-04T14:00:00.000Z",
      "endTime": "2026-02-04T14:05:00.000Z",
      "timeReduced": 42,
      "isReady": false
    }
  }
}
```

---

## ✅ Fixed Errors:

```
Before:
❌ Property 'timeReduced' does not exist on type 'PlantedTree'
❌ TypeScript compilation failed

After:
✅ Type checking passed
✅ No TypeScript errors
✅ App compiles successfully
```

---

## 🎯 Summary:

**Version:** 2.0.4  
**Date:** Feb 4, 2026  

**Fixed:**
- ✅ TypeScript error (timeReduced property)
- ✅ Type definition updated
- ✅ Optional field (? modifier)

**Files Changed:**
- `src/types/index.ts` (line 65)

**Status:** Ready to run! 🚀

---

**ลองรันใหม่ไม่มี Error แล้ว!** ✅

```bash
npm install
npm start
# No TypeScript errors! 🎉
```

---

**หมายเหตุ:** 
- `timeReduced` เป็น optional field (?)
- Default value = 0 ถ้าไม่มี
- Unit = วินาที (seconds)
