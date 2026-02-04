# v2.0.3 - Debug Logs & Fix 🔍

**เพิ่ม Console Logs เต็มที่เพื่อ Debug!**

---

## 🐛 ปัญหาที่เจอ:

### **1. Combo ไม่ขึ้น**
- กด → ไม่เห็น combo counter เพิ่ม
- UI แสดง "0x" ตลอด

### **2. API ไม่ยิง**
- รอ 5 วิ → API ไม่ส่ง
- ไม่มี Network request

---

## ✅ แก้แล้ว:

### **1. แก้ onPress Handler**

**Before:**
```typescript
onPress={currentTree ? (isReady ? handleSellTree : handleWaterTree) : undefined}
```

**After:**
```typescript
onPress={() => {
  console.log('🎮 Click detected!', { currentTree: !!currentTree, isReady });
  if (!currentTree) return;
  if (isReady) {
    handleSellTree();
  } else {
    handleWaterTree();
  }
}}
```

**ทำไมแก้:** 
- เพิ่ม log เพื่อเช็คว่า click register ไหม
- แยก logic ชัดเจนขึ้น

---

### **2. เพิ่ม Debug Logs ทุกจุด**

#### **handleWaterTree:**
```typescript
console.log('🌊 Water clicked!', clicks + 1);
console.log('🔥 Combo:', newClicks);
console.log('⏱️ Setting timer...', { newClicks, newTimeReduction });
console.log('✅ Timer set! Will fire in 5s');
```

#### **sendWaterAPI:**
```typescript
console.log('📡 Sending API...', { clickCount, timeReduction, treeId });
console.log('✅ API Success!', result);
console.log('🔄 Combo reset');
```

#### **Timer:**
```typescript
console.log('🗑️ Clearing old timer');
console.log('⏰ Timer fired! Sending API...');
```

#### **Cleanup:**
```typescript
console.log('🧹 Cleanup: clearing debounce timer');
```

---

### **3. แก้ useEffect Cleanup**

**เพิ่ม:**
```typescript
// Cleanup debounce timer on unmount
useEffect(() => {
  return () => {
    if (debounceTimer) {
      console.log('🧹 Cleanup: clearing debounce timer');
      clearTimeout(debounceTimer);
    }
  };
}, []);
```

---

## 🧪 Testing Steps:

### **Step 1: เปิด Console**

**Web (Expo):**
```bash
npm start
กด 'w' → เปิด browser
F12 → Console tab
```

**หรือ Terminal:**
```bash
npm start
ดู logs ใน terminal
```

---

### **Step 2: Test ต้นใหม่**

**⚠️ สำคัญ!** ใน screenshot เห็น "Ready!" แสดงว่า **ต้นโตแล้ว!**

**ต้องปลูกใหม่:**
```
1. กดขายต้นเก่า
2. กด Seeds tab
3. เลือก Bean Sprout
4. กดปลูก
5. **รอให้ timer แสดง "5:00"** ← สำคัญ!
```

---

### **Step 3: Test Click**

```
1. กดจอ
   → ดู Console: "🎮 Click detected!"
   
2. ถ้าเห็น:
   ✅ "🌊 Water clicked! 1" → รดน้ำสำเร็จ
   ✅ "🔥 Combo: 1" → combo เพิ่ม
   ✅ "⏱️ Setting timer..." → timer ตั้งแล้ว
   ✅ "✅ Timer set!" → พร้อมยิง API
   
3. ถ้าเห็น:
   ❌ "🌳 Sell clicked!" → **ต้นโตแล้ว! ปลูกใหม่!**
```

---

### **Step 4: Test Combo**

```
1. กดรัว 10 ครั้ง
   → ดู Console logs:
   🌊 Water clicked! 1
   🔥 Combo: 1
   🌊 Water clicked! 2
   🔥 Combo: 2
   ...
   🌊 Water clicked! 10
   🔥 Combo: 10
   
2. ดู UI:
   ✅ Combo indicator แสดง "10x"
   ✅ Multiplier แสดง "×2"
   ✅ Time reduction แสดง "-11s"
```

---

### **Step 5: Test API**

```
1. หยุดกด → รอ 5 วิ

2. ดู Console:
   ⏰ Timer fired! Sending API...
   📡 Sending API... { clickCount: 10, timeReduction: 11, treeId: "..." }
   ✅ API Success! { ... }
   🔄 Combo reset
   
3. ดู UI:
   ✅ Combo reset → "0x"
   ✅ Timer ลด → จาก "5:00" → "4:49"
   
4. ดู Network (F12 → Network):
   ✅ POST /game/click
   ✅ Status: 200 OK
```

---

## 📊 Expected Console Output:

### **ต้นยังไม่โต (ปกติ):**
```
🎮 Click detected! { currentTree: true, isReady: false }
🌊 Water clicked! 1
🔥 Combo: 1
⏱️ Setting timer... { newClicks: 1, newTimeReduction: 1 }
✅ Timer set! Will fire in 5s

[หยุดกด 5 วิ]

⏰ Timer fired! Sending API...
📡 Sending API... { clickCount: 1, timeReduction: 1, treeId: "..." }
✅ API Success! { ... }
🔄 Combo reset
```

### **ต้นโตแล้ว (ผิด - ต้องปลูกใหม่!):**
```
🎮 Click detected! { currentTree: true, isReady: true }
🌳 Sell clicked!
Alert: "Sell Tree?"

❌ ไม่มี "🌊 Water clicked!"
❌ ไม่มี combo
❌ ต้องปลูกต้นใหม่!
```

---

## 🎯 Common Issues:

### **Issue 1: เห็น "🌳 Sell clicked!" แทน "🌊 Water clicked!"**

**สาเหตุ:** ต้นโตแล้ว (isReady = true)

**แก้:**
```
1. กดขายต้นเก่า
2. ปลูกต้นใหม่
3. รอให้เห็น "5:00" ใน timer
4. กดรดทันที
```

---

### **Issue 2: ไม่เห็น Console logs เลย**

**สาเหตุ:** Console ยังไม่เปิด

**แก้:**
```
Web: F12 → Console
Terminal: ดู terminal ที่รัน npm start
```

---

### **Issue 3: Timer ไม่ fire**

**Console logs:**
```
✅ Timer set! Will fire in 5s
[รอ 5 วิ]
❌ ไม่เห็น "⏰ Timer fired!"
```

**เช็ค:**
```
1. Component ถูก unmount ไหม?
2. Navigation ออกจากหน้าไหม?
3. App refresh ไหม?
```

---

### **Issue 4: API ไม่ส่ง**

**Console logs:**
```
⏰ Timer fired! Sending API...
📡 Sending API... { ... }
❌ ไม่มี "✅ API Success!"
```

**เช็ค:**
```
1. Network → เห็น request ไหม?
2. Console → มี error ไหม?
3. Backend ตอบ 200 OK ไหม?
```

---

## 🔧 Debug Checklist:

```
เปิด Console ✓
ปลูกต้นใหม่ ✓
เห็น "5:00" ✓
กดจอ ✓
  ├─ เห็น "🎮 Click detected!" ✓
  ├─ เห็น "🌊 Water clicked!" ✓
  ├─ เห็น "🔥 Combo: X" ✓
  └─ เห็น "✅ Timer set!" ✓
รอ 5 วิ ✓
  ├─ เห็น "⏰ Timer fired!" ✓
  ├─ เห็น "📡 Sending API..." ✓
  ├─ เห็น "✅ API Success!" ✓
  └─ เห็น "🔄 Combo reset" ✓
```

---

## 📝 Summary:

**Version:** 2.0.3  
**Date:** Feb 4, 2026  

**Added:**
- ✅ Debug logs ทุกจุด
- ✅ Console.log ใน handleWaterTree
- ✅ Console.log ใน sendWaterAPI
- ✅ Console.log ใน timer
- ✅ Console.log ใน cleanup

**Fixed:**
- ✅ onPress handler (arrow function)
- ✅ useEffect cleanup (debounce timer)

**Next:**
- 🔍 ลอง run แล้วส่ง Console logs มา
- 🔍 ถ้ายังไม่ work → ส่ง screenshot Console

---

## 🚀 Ready to Debug:

```bash
npm install
npm start
# Press 'w'
# Open Console (F12)
# ปลูกต้นใหม่!
# กดรด
# ดู Console logs
```

---

**ลองแล้วบอกผลนะ!** 🔍✨

**สำคัญ:** ต้อง **ปลูกต้นใหม่** ก่อน (เพราะต้นเก่าโตแล้ว)

**ส่ง Console logs มาด้วย!** 📸
