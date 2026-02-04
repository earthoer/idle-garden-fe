# Using GitHub for Images 🖼️

Frontend ตอนนี้ใช้รูปจาก GitHub แทน backend!

---

## 📍 GitHub Repo:

```
https://github.com/earthoer/image-deposit
```

**Current Structure:**
```
image-deposit/
└── seeds/
    ├── bean_sprout/
    ├── carrot/
    ├── lettuce/
    ├── radish/
    └── spinach/
```

---

## 🔗 URL Format:

```
https://raw.githubusercontent.com/earthoer/image-deposit/main/{path}
```

**Examples:**
```
Seed Bean Sprout:
https://raw.githubusercontent.com/earthoer/image-deposit/main/seeds/bean_sprout/bean_sprout_04.png

Seed Radish:
https://raw.githubusercontent.com/earthoer/image-deposit/main/seeds/radish/radish_04.png
```

---

## 🎯 Path Conversion:

### Database Path → GitHub URL:

```typescript
// Database: "/seeds/bean_sprout/bean_sprout_04.png"
// GitHub:   "https://raw.githubusercontent.com/.../seeds/bean_sprout/bean_sprout_04.png"

// Function handles:
1. Remove /assets/ prefix (if exists)
2. Remove leading /
3. Prepend GitHub base URL
```

**Examples:**
```
"/seeds/radish/radish_04.png"
→ "seeds/radish/radish_04.png"
→ "https://raw.githubusercontent.com/earthoer/image-deposit/main/seeds/radish/radish_04.png"

"/assets/seeds/carrot/carrot_04.png"
→ "seeds/carrot/carrot_04.png"
→ "https://raw.githubusercontent.com/earthoer/image-deposit/main/seeds/carrot/carrot_04.png"
```

---

## 📁 Required GitHub Structure:

### Seeds (Already exists ✅):
```
seeds/
├── bean_sprout/
│   └── bean_sprout_04.png
├── carrot/
│   └── carrot_04.png
├── lettuce/
│   └── lettuce_04.png
├── radish/
│   └── radish_04.png
└── spinach/
    └── spinach_04.png
```

### Locations (Need to add ⚠️):
```
locations/
├── waste_land/
│   ├── map.png
│   └── pot.png
├── front_yard/
│   ├── map.png
│   └── pot.png
├── back_yard/
│   ├── map.png
│   └── pot.png
└── garden/
    ├── map.png
    └── pot.png
```

---

## ✅ Test URLs:

### Seeds (Should work now):
```bash
# Bean Sprout
curl -I https://raw.githubusercontent.com/earthoer/image-deposit/main/seeds/bean_sprout/bean_sprout_04.png

# Radish
curl -I https://raw.githubusercontent.com/earthoer/image-deposit/main/seeds/radish/radish_04.png

# Carrot
curl -I https://raw.githubusercontent.com/earthoer/image-deposit/main/seeds/carrot/carrot_04.png
```

### Locations (Need to add):
```bash
# Waste Land Map
curl -I https://raw.githubusercontent.com/earthoer/image-deposit/main/locations/waste_land/map.png

# Waste Land Pot
curl -I https://raw.githubusercontent.com/earthoer/image-deposit/main/locations/waste_land/pot.png
```

---

## 🚀 Next Steps:

### 1. เพิ่มรูป Locations ใน GitHub:

```bash
cd image-deposit

# สร้าง folders
mkdir -p locations/waste_land
mkdir -p locations/front_yard
mkdir -p locations/back_yard
mkdir -p locations/garden

# วางรูป
# locations/waste_land/map.png
# locations/waste_land/pot.png
# ... (ทำครบ 4 locations)

# Commit & Push
git add locations/
git commit -m "Add location images"
git push
```

### 2. อัพเดท Database (ถ้าจำเป็น):

ถ้า database มี path แบบ:
```
"/assets/seeds/..."
```

ต้องแก้เป็น:
```
"/seeds/..."
```

หรือ:
```
"seeds/..."
```

Function จะ handle ให้ทั้ง 2 แบบ!

---

## 🎨 Database Paths ที่ควรมี:

### Seeds:
```json
{
  "icon": "/seeds/bean_sprout/bean_sprout_04.png"
}
```

### Locations:
```json
{
  "locationImageUrl": "/locations/waste_land/map.png",
  "potImageUrl": "/locations/waste_land/pot.png"
}
```

---

## 💡 Advantages of GitHub:

```
✅ ฟรี (public repo)
✅ ไม่ต้องแก้ backend
✅ CDN ของ GitHub (fast)
✅ Version control สำหรับรูป
✅ ง่ายต่อการอัพเดท (แค่ push)
```

---

## 🐛 Troubleshooting:

### รูปไม่โหลด?

**1. เช็ค URL:**
```javascript
console.log(getImageUrl('/seeds/radish/radish_04.png'));
// Should output: https://raw.githubusercontent.com/earthoer/image-deposit/main/seeds/radish/radish_04.png
```

**2. Test ใน Browser:**
```
Paste URL ใน browser
→ ถ้าโหลดได้ = GitHub OK
→ ถ้า 404 = ไฟล์ไม่มีใน GitHub
```

**3. เช็ค GitHub:**
```
https://github.com/earthoer/image-deposit/tree/main/seeds/radish
→ ดูว่ามีไฟล์ radish_04.png หรือไม่
```

**4. เช็ค Case-Sensitive:**
```
❌ Bean_Sprout (ผิด)
✅ bean_sprout (ถูก)

❌ radish_04.PNG (ผิด)
✅ radish_04.png (ถูก)
```

---

## 🔄 Update Images:

```bash
# 1. Clone repo
git clone https://github.com/earthoer/image-deposit.git
cd image-deposit

# 2. แทนที่รูป
cp new_radish.png seeds/radish/radish_04.png

# 3. Commit & Push
git add .
git commit -m "Update radish image"
git push

# 4. รอสักครู่ (GitHub cache ~5 min)
# 5. รูปใหม่จะปรากฏใน app
```

---

## 📊 Current Status:

```
✅ Seeds (5/5) - มีใน GitHub แล้ว
⚠️ Locations (0/4) - ยังไม่มี ต้องเพิ่ม
```

**Seeds Working:**
- Bean Sprout ✅
- Radish ✅
- Lettuce ✅
- Spinach ✅
- Carrot ✅

**Locations To Add:**
- Waste Land (map.png + pot.png)
- Front Yard (map.png + pot.png)
- Back Yard (map.png + pot.png)
- Garden (map.png + pot.png)

---

## 🎯 Summary:

1. **Frontend ใช้ GitHub แล้ว** ✅
2. **Seeds รูปพร้อม** ✅
3. **ต้องเพิ่ม Locations** ⚠️

**ขั้นตอนต่อไป:**
```bash
cd image-deposit
mkdir -p locations/waste_land locations/front_yard locations/back_yard locations/garden
# วางรูป 8 ไฟล์
git push
```

**แล้วจะพร้อมใช้งาน!** 🎉
