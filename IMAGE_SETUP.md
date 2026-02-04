# Image Setup Guide 🖼️

Frontend ตอนนี้ใช้รูปจริงแล้ว! แต่ต้อง setup backend ให้ serve static files

---

## 📁 โครงสร้างรูปที่ต้องมี:

```
backend/
└── public/
    └── assets/
        ├── seeds/
        │   ├── bean_sprout/
        │   │   └── bean_sprout_04.png
        │   ├── radish/
        │   │   └── radish_04.png
        │   ├── lettuce/
        │   │   └── lettuce_04.png
        │   ├── spinach/
        │   │   └── spinach_04.png
        │   └── carrot/
        │       └── carrot_04.png
        └── locations/
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

## 🔧 Setup Backend (NestJS):

### 1. Install ServeStatic Module:

```bash
cd idle-garden-backend
npm install @nestjs/serve-static
```

### 2. แก้ app.module.ts:

```typescript
// src/app.module.ts
import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    // Serve static files
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveRoot: '/',
    }),
    
    // ... other modules
  ],
})
export class AppModule {}
```

### 3. สร้าง public folder:

```bash
mkdir -p public/assets/seeds
mkdir -p public/assets/locations
```

### 4. วาง files ตามโครงสร้างด้านบน

---

## 🖼️ ขนาดรูปแนะนำ:

### Seeds (Plant):
```
- ขนาด: 512x512 px
- Format: PNG (transparent background)
- ชื่อ: {seed_code}_04.png
```

### Locations:

**Map (Background):**
```
- ขนาด: 1920x1080 px
- Format: PNG/JPG
- ชื่อ: map.png
```

**Pot:**
```
- ขนาด: 512x512 px
- Format: PNG (transparent background)
- ชื่อ: pot.png
```

---

## 🔗 URL Structure:

Frontend จะเรียกรูปแบบนี้:

```
Seeds:
https://idle-garden-be-production.up.railway.app/assets/seeds/bean_sprout/bean_sprout_04.png

Locations:
https://idle-garden-be-production.up.railway.app/assets/locations/waste_land/map.png
https://idle-garden-be-production.up.railway.app/assets/locations/waste_land/pot.png
```

---

## ✅ Test Static Files:

```bash
# Local
http://localhost:3000/assets/seeds/bean_sprout/bean_sprout_04.png

# Production
https://idle-garden-be-production.up.railway.app/assets/seeds/bean_sprout/bean_sprout_04.png
```

---

## 🎨 Alternative: External Hosting

ถ้าไม่อยากให้ backend serve รูป ใช้ external hosting แทน:

### Option 1: GitHub Raw
```typescript
const getImageUrl = (path: string): string => {
  const baseUrl = 'https://raw.githubusercontent.com/your-username/idle-garden-assets/main';
  return `${baseUrl}${path}`;
};
```

### Option 2: Cloudinary / ImgBB
```typescript
const getImageUrl = (path: string): string => {
  const baseUrl = 'https://res.cloudinary.com/your-cloud/image/upload';
  return `${baseUrl}${path}`;
};
```

### Option 3: S3 / Cloud Storage
```typescript
const getImageUrl = (path: string): string => {
  const baseUrl = 'https://your-bucket.s3.amazonaws.com';
  return `${baseUrl}${path}`;
};
```

---

## 🚀 Deploy:

### Railway:

1. **สร้าง public folder**
2. **วางรูปทั้งหมด**
3. **Commit & Push:**
```bash
git add public/
git commit -m "Add static assets"
git push
```

4. **Railway auto deploy**

---

## 🐛 Troubleshooting:

### รูปไม่โหลด?

**เช็ค URL:**
```
1. Copy image URL จาก app
2. Paste ใน browser
3. ถ้า 404 → ไฟล์ไม่มี
4. ถ้า 403 → permission ผิด
5. ถ้าโหลดได้ → frontend มีปัญหา
```

**เช็ค Backend:**
```bash
# Local
curl http://localhost:3000/assets/seeds/bean_sprout/bean_sprout_04.png

# Production
curl https://idle-garden-be-production.up.railway.app/assets/seeds/bean_sprout/bean_sprout_04.png
```

**เช็ค Paths:**
```
- ใช้ forward slash (/) ไม่ใช่ backslash (\)
- Case-sensitive (bean_sprout ≠ Bean_Sprout)
- ไม่มี space ในชื่อไฟล์
```

---

## 📝 Summary:

**Frontend v1.4:**
```
✅ ใช้ Image component แทน emoji
✅ ใช้ ImageBackground สำหรับ location
✅ getImageUrl() helper function
✅ รองรับทั้ง local และ production
```

**Backend ต้องมี:**
```
✅ public/assets/ folder
✅ ServeStaticModule
✅ รูป seeds (5 ตัว x 1 รูป = 5 files)
✅ รูป locations (4 ตัว x 2 รูป = 8 files)
```

**Total: 13 image files**

---

## 💡 Placeholder Images:

ถ้ายังไม่มีรูป ใช้ placeholder ก่อน:

```typescript
const getImageUrl = (path: string): string => {
  // Placeholder service
  return `https://via.placeholder.com/512/4CAF50/FFFFFF?text=Seed`;
};
```

---

**พร้อมใช้!** 🎨

แค่ setup backend serve static files + วางรูปเข้า public/assets/
