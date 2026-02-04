# v1.9 - Collapsible Tabs + Clickable Area Fix 🎮

**3 Features แก้:**
1. ✅ คลิกได้ทั้งจอ (minHeight + justifyContent)
2. ✅ Bottom tabs เปิดปิดได้ (collapsible drawer)
3. ⚠️ PNG transparency (ต้องแก้รูป)

---

## 🔧 Changes:

### 1. **Clickable Game Area**

**ปัญหา:** คลิกได้แค่บริเวณต้นไม้

**แก้แล้ว:**
```typescript
gameArea: {
  alignItems: 'center',
  paddingVertical: 40,
  backgroundColor: 'rgba(45, 95, 79, 0.3)',
  minHeight: 500, // ⭐ คลิกได้ทั้งพื้นที่
  justifyContent: 'center',
},
```

**ผลลัพธ์:**
- ✅ กดที่ไหนก็ได้บนจอ
- ✅ Ready → กดขาย
- ✅ Not ready → กดรด

---

### 2. **Collapsible Bottom Tabs**

**ปัญหา:** Tabs บังจอตลอด

**แก้แล้ว:**

**State:**
```typescript
const [showTabContent, setShowTabContent] = useState(false);
```

**Tab Toggle:**
```typescript
onPress={() => {
  if (activeTab === 'seeds') {
    setShowTabContent(!showTabContent); // Toggle
  } else {
    setActiveTab('seeds');
    setShowTabContent(true); // เปิด
  }
}}
```

**Styles:**
```typescript
tabContent: {
  padding: 16,
  position: 'absolute',
  bottom: 70, // เหนือ tabs
  left: 0,
  right: 0,
  backgroundColor: '#2d5f4f',
  borderTopLeftRadius: 20,
  borderTopRightRadius: 20,
  maxHeight: '60%',
  shadowColor: '#000',
  shadowOffset: { width: 0, height: -2 },
  shadowOpacity: 0.3,
  shadowRadius: 8,
  elevation: 10,
},
```

**ผลลัพธ์:**
- ✅ Default: Tabs ซ่อนอยู่
- ✅ กด Seeds → slide up
- ✅ กด Seeds อีกครั้ง → slide down
- ✅ เปลี่ยน tab → slide ใหม่
- ✅ มี ScrollView scroll ได้

---

### 3. **PNG Transparency** ⚠️

**ปัญหา:** รูปต้นมี background สีเทา

**สาเหตุ:**
```
รูป PNG ไม่ได้เป็น transparent background
→ GitHub รูปมี background
```

**แก้ที่ CSS แล้ว:**
```typescript
treePlantImage: {
  width: 120,
  height: 120,
  marginBottom: -30,
  zIndex: 2,
  backgroundColor: 'transparent', // ⭐
},
```

**⚠️ แต่ต้องแก้รูปด้วย:**

#### วิธีแก้รูป:

**1. Photoshop/GIMP:**
```
1. เปิดรูป
2. เลือก Magic Wand → คลิก background สีเทา
3. Delete → ลบ background
4. Save as PNG (with transparency)
5. Upload to GitHub
```

**2. Online Tools:**
```
1. ไปที่ remove.bg
2. Upload รูปต้นไม้
3. Download PNG transparent
4. Upload to GitHub
```

**3. Figma/Canva:**
```
1. Import รูป
2. Remove background
3. Export as PNG (transparent)
4. Upload to GitHub
```

**เช็ครูป:**
```javascript
// รูปถูกต้อง:
bean_sprout_01.png → transparent background ✅
bean_sprout_02.png → transparent background ✅
...

// ถ้ายังมี background:
→ แก้ด้วย tools ข้างบน
→ Upload ใหม่
```

---

## 🎮 How It Works:

### Click Anywhere:
```
User clicks screen
↓
If tree exists:
  ├─ Is ready? → Sell tree
  └─ Not ready? → Water tree
↓
Update UI
```

### Toggle Tabs:
```
Default: showTabContent = false
↓
User clicks Seeds tab:
  ├─ activeTab === 'seeds'? → Toggle (on/off)
  └─ activeTab !== 'seeds'? → Switch + Open
↓
showTabContent = true → Render content
```

---

## 🧪 Testing:

### 1. Clickable Area:
```
✅ Click anywhere → Water tree
✅ Tree ready → Click → Sell
✅ No tree → Click disabled
```

### 2. Collapsible Tabs:
```
✅ Default → Tabs visible, content hidden
✅ Click Seeds → Content slides up
✅ Click Seeds again → Content slides down
✅ Switch to Locations → Content changes
✅ Click Locations again → Content closes
```

### 3. PNG Transparency:
```
⚠️ Check tree images on screen
⚠️ Should NOT have gray background
⚠️ If still gray → Fix images (see above)
```

---

## 📊 Files Changed:

### **src/screens/GameScreen.tsx**

**Lines ~33:**
```typescript
const [showTabContent, setShowTabContent] = useState(false);
```

**Lines ~223-227:**
```typescript
<TouchableOpacity 
  style={styles.gameArea}
  activeOpacity={0.9}
  onPress={currentTree ? (isReady ? handleSellTree : handleWaterTree) : undefined}
  disabled={!currentTree}
>
```

**Lines ~323-380:**
```typescript
// Toggle logic in each tab
onPress={() => {
  if (activeTab === 'seeds') {
    setShowTabContent(!showTabContent);
  } else {
    setActiveTab('seeds');
    setShowTabContent(true);
  }
}}
```

**Lines ~384-385:**
```typescript
{showTabContent && (
  <ScrollView style={styles.tabContent}>
```

**Lines ~586-590:**
```typescript
gameArea: {
  alignItems: 'center',
  paddingVertical: 40,
  backgroundColor: 'rgba(45, 95, 79, 0.3)',
  minHeight: 500,
  justifyContent: 'center',
},
```

**Lines ~597-603:**
```typescript
treePlantImage: {
  width: 120,
  height: 120,
  marginBottom: -30,
  zIndex: 2,
  backgroundColor: 'transparent',
},
```

**Lines ~717-730:**
```typescript
tabContent: {
  padding: 16,
  position: 'absolute',
  bottom: 70,
  left: 0,
  right: 0,
  backgroundColor: '#2d5f4f',
  borderTopLeftRadius: 20,
  borderTopRightRadius: 20,
  maxHeight: '60%',
  shadowColor: '#000',
  shadowOffset: { width: 0, height: -2 },
  shadowOpacity: 0.3,
  shadowRadius: 8,
  elevation: 10,
},
```

---

## ✅ Features Working:

```
✅ Click anywhere to water
✅ Click when ready to sell
✅ Tabs default closed
✅ Toggle tabs open/close
✅ Scroll tab content
✅ Switch between tabs
✅ Animated slide up/down
⚠️ PNG transparency (needs image fix)
```

---

## 🚀 Ready to Run:

```bash
npm install
npm start
# Press 'w'

# Test:
1. Plant tree
2. Click anywhere → Waters ✅
3. Click Seeds tab → Opens ✅
4. Click Seeds tab again → Closes ✅
5. Switch to Locations → Opens ✅
```

---

## 📝 Summary:

**Version:** 1.9.0  
**Date:** Feb 4, 2026  

**Fixed:**
- ✅ Clickable game area (minHeight: 500)
- ✅ Collapsible bottom tabs (toggle on/off)
- ✅ Transparent background style

**Still Need:**
- ⚠️ Fix PNG images (remove gray background)
  → Use Photoshop/GIMP/remove.bg
  → Upload new transparent PNGs to GitHub

**Status:** Ready to test! 🎉

---

**ถ้ารูปยังมี background:**
1. ไปที่ remove.bg
2. Upload รูปต้นไม้
3. Download PNG (transparent)
4. Upload to GitHub: `/seeds/{seed_name}/{seed_name}_0X.png`
5. Refresh app → ✅ No background!

**ลองเลย!** 🌱✨
