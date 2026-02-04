# v2.0.2 - Debug & Fix Combo System 🐛

**ปัญหา:** กดแล้ว combo ไม่ขึ้น, API ไม่ยิง

---

## 🔍 Root Cause:

### **ต้นไม้โตแล้ว (Ready!)**

ใน screenshot ต้นแสดง:
```
Time Left: Ready!
```

นั่นหมายความว่า:
- `isReady = true`
- `remaining = 0`
- กดจะเรียก `handleSellTree()` (ไม่ใช่ `handleWaterTree()`)
- **ไม่มี combo เพราะไม่ได้รด!**

---

## ✅ แก้แล้ว:

### **1. แก้ Water Animation**

**ปัญหา:** `handleWaterTree(event?)` แต่ TouchableOpacity ไม่ส่ง event

**แก้:**
```typescript
// Before
const handleWaterTree = (event?: any) => {
  if (event?.nativeEvent) {
    const { locationX, locationY } = event.nativeEvent;
    // ...
  }
}

// After
const handleWaterTree = () => {
  // แสดง water drop แบบ random ตรงกลาง
  const dropId = Date.now();
  const randomX = 150 + Math.random() * 100;
  const randomY = 100 + Math.random() * 100;
  setWaterDrops(prev => [...prev, { id: dropId, x: randomX, y: randomY }]);
}
```

### **2. เพิ่ม Debug Logs**

```typescript
// ใน handleWaterTree
console.log('🌊 Water clicked!', clicks + 1);
console.log('🔥 Combo:', newClicks);

// ใน handleSellTree
console.log('🌳 Sell clicked!');

// ใน timer calculation
console.log('⏱️ Timer:', {
  remaining,
  timeReduced: currentTree.timeReduced,
  isReady,
  endTime: new Date(endTime).toISOString(),
  adjustedEndTime: new Date(adjustedEndTime).toISOString()
});
```

---

## 🧪 Testing:

### **Step 1: เปิด Console**

**Web:**
```
F12 → Console tab
```

**React Native:**
```
npm start
→ เปิด browser debugger
→ หรือดู terminal logs
```

### **Step 2: Plant New Tree**

```
1. ลบต้นเก่า (ขาย) ถ้ามี
2. กด Seeds tab
3. เลือก Bean Sprout
4. กดปลูก
```

### **Step 3: Test Water**

```
1. กดจอ → ดู Console
   ✅ ต้องเห็น: "🌊 Water clicked! 1"
   ✅ ต้องเห็น: "🔥 Combo: 1"
   
2. กดอีก 5 ครั้ง
   ✅ ต้องเห็น: "🔥 Combo: 6"
   ✅ UI แสดง: "6x"
   
3. หยุดกด 5 วิ
   ✅ ต้องเห็น API call ใน Network tab
   ✅ Combo reset: "0x"
```

### **Step 4: Check Timer**

```
1. ดู Console → "⏱️ Timer:"
   ✅ remaining > 0 → ยังไม่โต
   ✅ isReady = false → รดได้
   
2. Wait until remaining = 0
   ✅ Time Left: "Ready!"
   ✅ isReady = true
   
3. กดขาย
   ✅ เห็น: "🌳 Sell clicked!"
   ✅ Alert: "Sell Tree?"
```

---

## 📊 Expected Console Output:

### **When Plant:**
```
⏱️ Timer: {
  remaining: 300,
  timeReduced: 0,
  isReady: false,
  endTime: "2026-02-04T14:17:00.000Z",
  adjustedEndTime: "2026-02-04T14:17:00.000Z"
}
```

### **When Water (1st click):**
```
🌊 Water clicked! 1
🔥 Combo: 1
⏱️ Timer: { remaining: 300, ... }
```

### **When Water (10th click):**
```
🌊 Water clicked! 10
🔥 Combo: 10
⏱️ Timer: { remaining: 300, ... }
```

### **After 5s (API sent):**
```
API Request:
POST /game/click
{
  plantedTreeId: "...",
  clicks: 10,
  timeReduction: 11
}

⏱️ Timer: {
  remaining: 289,
  timeReduced: 11,
  isReady: false,
  ...
}
```

### **When Tree Ready:**
```
⏱️ Timer: {
  remaining: 0,
  timeReduced: 42,
  isReady: true,
  ...
}
```

### **When Click (Tree Ready):**
```
🌳 Sell clicked!
Alert: "Sell Tree?"
```

---

## 🐛 Debug Checklist:

### **ถ้า Combo ไม่ขึ้น:**

```
1. เช็ค Console → เห็น "🌊 Water clicked!" ไหม?
   ❌ ไม่เห็น → TouchableOpacity disabled หรือ onPress ไม่ทำงาน
   ✅ เห็น → ไปข้อ 2
   
2. เช็ค Console → เห็น "🔥 Combo: X" ไหม?
   ❌ ไม่เห็น → setClicks() ไม่ทำงาน
   ✅ เห็น → ไปข้อ 3
   
3. เช็ค UI → แสดง "Xx" ไหม?
   ❌ ไม่แสดง → UI render ผิด
   ✅ แสดง → ปกติ!
```

### **ถ้า API ไม่ยิง:**

```
1. กด 10 ครั้ง → หยุด 5 วิ
   
2. เช็ค Network tab
   ✅ มี POST /game/click → ปกติ
   ❌ ไม่มี → debounceTimer ไม่ทำงาน
   
3. เช็ค Console → error ไหม?
   ❌ มี error → แก้ไข
   ✅ ไม่มี error → ปกติ
```

### **ถ้าเห็น "🌳 Sell clicked!" แทน "🌊 Water clicked!":**

```
→ ต้นโตแล้ว (isReady = true)
→ ต้องปลูกต้นใหม่!

Solution:
1. กดขายต้นเก่า
2. ปลูกต้นใหม่
3. กดรดตอนยังไม่โต
```

---

## 🎯 Common Issues:

### **Issue 1: ต้นโตแล้ว**

**ปัญหา:**
```
Time Left: Ready!
กด → เห็น "🌳 Sell clicked!"
ไม่มี combo
```

**แก้:**
```
1. ขายต้นเก่า
2. ปลูกใหม่
3. กดรดทันที
```

### **Issue 2: TimeReduced ไม่อัพเดท**

**ปัญหา:**
```
กด 10 ครั้ง → wait 5s
Timer ยังเท่าเดิม
```

**แก้:**
```
เช็ค Console:
⏱️ Timer: { timeReduced: ??? }

ถ้า timeReduced = 0:
→ API ไม่ส่ง หรือ
→ Backend ไม่อัพเดท
```

### **Issue 3: Combo ไม่ Reset**

**ปัญหา:**
```
กด 10 ครั้ง → wait 5s
Combo ยังแสดง "10x"
```

**แก้:**
```
เช็ค sendWaterAPI:
- setClicks(0) ถูกเรียกไหม?
- เช็ค Console logs
```

---

## 📝 Summary:

**Fixed:**
- ✅ handleWaterTree ไม่ต้องการ event
- ✅ Water drop แสดงแบบ random
- ✅ เพิ่ม console.log debug

**How to Test:**
1. ปลูกต้นใหม่
2. กดจอ → ดู Console
3. เช็ค combo ขึ้น
4. รอ 5 วิ → เช็ค API ยิง

**Common Mistake:**
- กดตอนต้นโตแล้ว → ไม่ได้รด → ไม่มี combo!

---

**ลองใหม่แล้วบอกผลนะ!** 🐛✅

**ถ้ายังไม่ work, ส่ง screenshot Console logs มา!** 📸
