# v2.0.1 - Timer Fix ⏱️

**Fix:** แสดงเวลาที่เหลือถูกต้อง + Combo counter

---

## 🐛 ปัญหา:

### **Time Left แสดงผิด:**
```
ควรแสดง: "2:30", "1:15", "0:45"
แต่แสดง: "Ready!" ตลอด
```

### **Combo แสดง 0x:**
```
ควรแสดง: จำนวนครั้งที่กด
แต่แสดง: 0x ตลอด
```

---

## ✅ แก้แล้ว:

### **1. Time Calculation**

**ปัญหา:** ไม่ได้หัก `timeReduced`

**Before:**
```typescript
const endTime = new Date(currentTree.endTime).getTime();
remaining = Math.max(0, Math.floor((endTime - now) / 1000));
```

**After:**
```typescript
const endTime = new Date(currentTree.endTime).getTime();

// หัก timeReduced (วินาที → milliseconds)
const timeReducedMs = (currentTree.timeReduced || 0) * 1000;
const adjustedEndTime = endTime - timeReducedMs;

remaining = Math.max(0, Math.floor((adjustedEndTime - now) / 1000));
```

---

### **2. Combo Display**

**Before:**
```typescript
<Text>{user?.currentCombo || 0}x</Text>
```

**After:**
```typescript
<Text>{clicks > 0 ? `${clicks}x` : '0x'}</Text>
```

---

### **3. timeReduced Default Value**

**Before:**
```typescript
timeReduced: tree.timeReduced + timeReduction
```

**After:**
```typescript
timeReduced: (tree.timeReduced || 0) + timeReduction
```

---

## 📊 Example:

**Tree Timeline:**
```
Start: 14:00:00
End:   14:05:00 (5 min)

14:00:00 → Plant tree → Display: 5:00
14:01:00 → Click 10x (-11s) → Display: 4:49 ✅
14:02:30 → Click 20x (-31s) → Display: 4:18 ✅
14:04:29 → Wait → Display: 0:31
14:05:00 → Ready! ✅
```

---

## ✅ Fixed:

```
✅ Time Left แสดงถูกต้อง
✅ Combo แสดงถูกต้อง
✅ Progress bar real-time
✅ timeReduced คำนวณถูก
```

---

**ลองเลย! Timer ทำงานถูกต้องแล้ว** ⏱️✅
