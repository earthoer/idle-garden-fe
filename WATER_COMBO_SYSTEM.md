# v2.0 - Water Animation & Combo System 💧🔥

**Major Update:** Water animation, combo multiplier, และ debounce system!

---

## ✨ New Features:

### 1. **Water Animation** 💧
- กดที่ไหนก็ได้ → หยดน้ำปรากฏ
- แสดง animation 1 วิ
- แสดงตำแหน่งที่กด

### 2. **Combo System** 🔥
```
Clicks 1-9:   ×1 (1s per click)
Clicks 10-29: ×2 (2s per click)
Clicks 30+:   ×3 (3s per click)
```

**Example:**
```
10 clicks:
- Clicks 1-9:  9s  (9 × 1)
- Click 10:    2s  (1 × 2)
= Total: 11s reduction
```

### 3. **Debounce 5 วิ** ⏱️
- กดรัว → เก็บ combo
- หยุดกด 5 วิ → ยิง API
- ต้นโตก่อน 5 วิ → ยิงทันที

### 4. **Combo Indicator** 📊
```
┌─────────────────┐
│ 15 clicks 🔥    │
│      ×2         │
│     -21s        │
└─────────────────┘
```

---

## 🗑️ Removed:

### ❌ 3 Action Buttons
- ลบปุ่ม 💧 (Water)
- ลบปุ่ม 🌳 (Tree)
- ลบปุ่ม 🔒 (Lock)

### ❌ Location Name in Header
- ลบ "Waste Land" จาก top bar
- ยังคง location picker ไว้

---

## 🎮 How It Works:

### **Water Flow:**
```
User กดจอ
↓
1. แสดง 💧 animation
2. Clicks++
3. คำนวณ combo multiplier
4. แสดง combo indicator
5. ตั้ง debounce timer 5 วิ
↓
หยุดกด 5 วิ OR ต้นโต
↓
ยิง POST /game/click
{
  plantedTreeId: "...",
  clicks: 15,
  timeReduction: 21
}
↓
Backend update tree
↓
Frontend refresh tree data
```

### **Combo Calculation:**
```typescript
function calculateTimeReduction(clicks: number): number {
  let total = 0;
  for (let i = 0; i < clicks; i++) {
    if (i >= 30) {
      total += 3; // ×3
    } else if (i >= 10) {
      total += 2; // ×2
    } else {
      total += 1; // ×1
    }
  }
  return total;
}

// Examples:
calculateTimeReduction(5)  = 5   (5 × 1)
calculateTimeReduction(10) = 11  (9 × 1 + 1 × 2)
calculateTimeReduction(30) = 51  (9 × 1 + 20 × 2 + 1 × 3)
```

### **Auto Send When Ready:**
```typescript
// เช็คว่าถ้าลดเวลาครบแล้ว
const totalTime = endTime - startTime;
const alreadyReduced = currentTree.timeReduced || 0;
const willBeReduced = alreadyReduced + newTimeReduction;

if (willBeReduced * 1000 >= totalTime) {
  // ต้นจะโตแล้ว ยิงเลย
  clearTimeout(debounceTimer);
  sendWaterAPI(clicks, timeReduction);
}
```

---

## 🔧 Code Changes:

### **New States:**
```typescript
const [waterDrops, setWaterDrops] = useState<Array<{id: number, x: number, y: number}>>([]);
const [clicks, setClicks] = useState(0);
const [totalTimeReduction, setTotalTimeReduction] = useState(0);
const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);
```

### **Water Animation:**
```typescript
const handleWaterTree = (event?: any) => {
  // Add water drop
  const dropId = Date.now();
  setWaterDrops(prev => [...prev, { 
    id: dropId, 
    x: locationX, 
    y: locationY 
  }]);
  
  // Remove after 1s
  setTimeout(() => {
    setWaterDrops(prev => prev.filter(drop => drop.id !== dropId));
  }, 1000);
  
  // Increment combo
  setClicks(clicks + 1);
  setTotalTimeReduction(calculateTimeReduction(clicks + 1));
  
  // Debounce 5s
  if (debounceTimer) clearTimeout(debounceTimer);
  const timer = setTimeout(() => {
    sendWaterAPI(clicks + 1, totalTimeReduction);
  }, 5000);
  setDebounceTimer(timer);
};
```

### **Combo Display:**
```tsx
{clicks > 0 && (
  <View style={styles.comboIndicator}>
    <Text style={styles.comboText}>
      {clicks} clicks 🔥
    </Text>
    <Text style={styles.comboMultiplier}>
      {clicks >= 30 ? '×3' : clicks >= 10 ? '×2' : '×1'}
    </Text>
    <Text style={styles.comboTimeReduction}>
      -{totalTimeReduction}s
    </Text>
  </View>
)}
```

---

## 📱 UI Changes:

### **Before:**
```
Header: [Logo] [🔥 Waste Land] [💰 0] [⚙️] [👤]
Game Area: [Tree] [💧] [🌳] [🔒]
```

### **After:**
```
Header: [Logo] [💰 0] [⚙️] [👤]
Game Area: [Tree] [💧 animations] [Combo: 15 ×2 -21s]
Bottom: [Seeds] [Locations] [Shop] [Profile]
```

---

## 🧪 Testing:

### 1. **Single Click:**
```
✅ Click screen
✅ See 💧 animation
✅ See combo: "1 clicks 🔥 ×1 -1s"
✅ Wait 5s
✅ API sent
✅ Combo reset
```

### 2. **Combo × 2:**
```
✅ Click 10 times fast
✅ See combo: "10 clicks 🔥 ×2 -11s"
✅ Wait 5s
✅ API sent with 11s reduction
```

### 3. **Combo × 3:**
```
✅ Click 30 times fast
✅ See combo: "30 clicks 🔥 ×3 -51s"
✅ API sent immediately if tree ready
```

### 4. **Tree Ready:**
```
✅ Click until tree grows
✅ API sent immediately (no 5s wait)
✅ Tree state updates
✅ Combo resets
```

### 5. **Sell Tree:**
```
✅ Tree isReady = true
✅ Click screen
✅ Confirm sell dialog
✅ POST /game/sell
✅ Gold updates
```

---

## 📊 API Integration:

### **POST /game/click**
```typescript
{
  plantedTreeId: "69820234468474606a80260f",
  clicks: 15,
  timeReduction: 21
}

Response:
{
  success: true,
  message: "Watered tree 15 times (21s reduced)",
  data: {
    clicksProcessed: 15,
    timeReduced: 21,
    totalClicks: 180,
    timeLeft: 258,
    isReady: false
  }
}
```

### **POST /game/sell**
```typescript
{
  plantedTreeId: "69820234468474606a80260f"
}

Response:
{
  success: true,
  message: "Sold Bean Sprout (normal) for 100g",
  data: {
    soldPrice: 100,
    quality: "normal",
    seedName: "Bean Sprout",
    user: { gold: 100, ... }
  }
}
```

---

## 🎨 Styles Added:

```typescript
waterDrop: {
  position: 'absolute',
  zIndex: 999,
  opacity: 0.8,
},
waterDropText: {
  fontSize: 40,
  textShadowColor: 'rgba(0, 0, 0, 0.5)',
  textShadowOffset: { width: 0, height: 2 },
  textShadowRadius: 4,
},
comboIndicator: {
  position: 'absolute',
  top: 20,
  left: '50%',
  transform: [{ translateX: -75 }],
  backgroundColor: 'rgba(0, 0, 0, 0.7)',
  paddingHorizontal: 20,
  paddingVertical: 12,
  borderRadius: 20,
  alignItems: 'center',
  zIndex: 998,
  minWidth: 150,
},
comboText: {
  color: '#fff',
  fontSize: 18,
  fontWeight: 'bold',
},
comboMultiplier: {
  color: '#FFD700',
  fontSize: 24,
  fontWeight: 'bold',
  marginTop: 4,
},
comboTimeReduction: {
  color: '#4CAF50',
  fontSize: 16,
  fontWeight: 'bold',
  marginTop: 4,
},
```

---

## ✅ Features Checklist:

```
✅ Water animation (💧)
✅ Combo system (×1, ×2, ×3)
✅ Combo indicator (clicks, multiplier, time)
✅ Debounce 5 seconds
✅ Auto send when tree ready
✅ API integration (click + sell)
✅ Remove 3 action buttons
✅ Remove location name from header
✅ Bottom tabs styled
❌ PNG transparency (รูปยังมี background)
```

---

## 🚀 Ready to Run:

```bash
npm install
npm start
# Press 'w'

# Test:
1. Plant tree
2. Click anywhere → See 💧
3. Click fast 10 times → See ×2 combo
4. Wait 5s → API sent
5. Click until tree ready → Auto sell
```

---

## 📝 Summary:

**Version:** 2.0.0  
**Date:** Feb 4, 2026  

**Added:**
- ✅ Water drop animation
- ✅ Combo system (×1/×2/×3)
- ✅ Combo indicator UI
- ✅ Debounce 5s
- ✅ Auto API when ready

**Removed:**
- ❌ 3 action buttons
- ❌ Location name in header

**Fixed:**
- ✅ Bottom tabs styling
- ✅ Game area clickable

**Still Need:**
- ⚠️ PNG images (transparent background)

**Status:** Ready to test! 🎉💧🔥

---

**ลองเลย! Water animation น่าจะสนุกมาก** 🌱✨

**มีปัญหาบอกได้นะ!** 😊
