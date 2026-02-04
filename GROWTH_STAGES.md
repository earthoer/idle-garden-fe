# Growth Stages Update 🌱

Tree images now change based on growth progress!

---

## ✨ New Features:

### 1. **Dynamic Tree Images**
```
Progress:
0-25%   → _01.png (Seed/Sprout)
26-50%  → _02.png (Small plant)
51-75%  → _03.png (Medium plant)
76-100% → _04.png (Full grown)
```

### 2. **Clickable Game Area**
```
✅ กดได้ทั่วทั้ง game area
✅ กดเพื่อ water tree
✅ Disabled เมื่อ tree พร้อม sell
```

### 3. **Fixed Tree Info**
```
✅ แสดงชื่อ seed (Bean Sprout)
✅ แสดง sell value จริง (100g)
✅ Timer countdown ถูกต้อง
✅ Progress bar ทำงาน
```

---

## 🎨 Growth Stages:

### Stage 1 (0-25%): **Seed/Sprout** 🌱
```
bean_sprout_01.png
radish_01.png
lettuce_01.png
spinach_01.png
carrot_01.png
```

### Stage 2 (26-50%): **Small Plant** 🌿
```
bean_sprout_02.png
radish_02.png
...
```

### Stage 3 (51-75%): **Medium Plant** 🪴
```
bean_sprout_03.png
radish_03.png
...
```

### Stage 4 (76-100%): **Full Grown** 🌳
```
bean_sprout_04.png
radish_04.png
...
```

---

## 🔧 Technical Implementation:

### 1. **getTreeImageByProgress()** - `src/utils/images.ts`

```typescript
export const getTreeImageByProgress = (
  seedIcon: string, 
  progressPercent: number
): string => {
  let stage = 1;
  if (progressPercent >= 76) stage = 4;
  else if (progressPercent >= 51) stage = 3;
  else if (progressPercent >= 26) stage = 2;
  else stage = 1;
  
  // Replace _04 with stage
  const stageIcon = seedIcon.replace(/_04\.png$/, `_0${stage}.png`);
  return getImageUrl(stageIcon);
};
```

### 2. **Progress Calculation** - `GameScreen.tsx`

```typescript
const now = Date.now();
const startTime = new Date(currentTree.startTime).getTime();
const endTime = new Date(currentTree.endTime).getTime();
const totalTime = endTime - startTime;
const elapsed = now - startTime;

progressPercent = (elapsed / totalTime) * 100;
```

### 3. **Tree Visual**

```typescript
<Image
  source={{ 
    uri: getTreeImageByProgress(currentSeed.icon, progressPercent) 
  }}
  style={styles.treePlantImage}
/>
```

---

## 📊 Example Progress:

```
Bean Sprout (5 min total):

Time 0:00  → Progress 0%   → bean_sprout_01.png
Time 1:15  → Progress 25%  → bean_sprout_01.png
Time 1:30  → Progress 30%  → bean_sprout_02.png
Time 2:30  → Progress 50%  → bean_sprout_02.png
Time 2:45  → Progress 55%  → bean_sprout_03.png
Time 3:45  → Progress 75%  → bean_sprout_03.png
Time 3:50  → Progress 77%  → bean_sprout_04.png
Time 5:00  → Progress 100% → bean_sprout_04.png (Ready!)
```

---

## 🖼️ GitHub Images Required:

**Each seed needs 4 images:**

```
seeds/
├── bean_sprout/
│   ├── bean_sprout_01.png ⭐ Stage 1
│   ├── bean_sprout_02.png ⭐ Stage 2
│   ├── bean_sprout_03.png ⭐ Stage 3
│   └── bean_sprout_04.png ⭐ Stage 4
├── radish/
│   ├── radish_01.png
│   ├── radish_02.png
│   ├── radish_03.png
│   └── radish_04.png
... (ทำครบ 5 seeds)
```

**Total: 5 seeds × 4 stages = 20 images**

---

## 🎯 User Experience:

### Before (v1.6):
```
❌ รูปต้นไม้ไม่เปลี่ยน (ใช้ _04 ตลอด)
❌ กดไม่ได้
❌ แสดงค่าผิด (NaN)
```

### After (v1.7):
```
✅ รูปต้นไม้เติบโตตาม %
✅ กดได้ทั่วทั้ง area
✅ แสดงค่าถูกต้อง
✅ Progress bar แสดง %
✅ Real-time updates
```

---

## 🚀 Testing:

### 1. Plant Tree:
```
1. เลือก seed (Bean Sprout)
2. กดปลูก
3. ✅ ควรเห็นรูป bean_sprout_01.png
```

### 2. Watch Growth:
```
รอ 1-2 นาที
✅ ควรเห็นรูปเปลี่ยนจาก _01 → _02 → _03 → _04
```

### 3. Water Tree:
```
กดทุกที่ใน game area
✅ Time reduces
✅ รูปเปลี่ยนเร็วขึ้น
```

### 4. Sell Tree:
```
รอจนถึง 100%
✅ Button "Sell" enable
✅ กดขาย ได้เงินถูกต้อง
```

---

## 🔄 Update Images:

### Add Stage 1-3 to GitHub:

```bash
cd image-deposit/seeds

# Bean Sprout
cp bean_sprout_stage1.png bean_sprout/bean_sprout_01.png
cp bean_sprout_stage2.png bean_sprout/bean_sprout_02.png
cp bean_sprout_stage3.png bean_sprout/bean_sprout_03.png
# (_04 มีอยู่แล้ว)

# Radish
cp radish_stage1.png radish/radish_01.png
cp radish_stage2.png radish/radish_02.png
cp radish_stage3.png radish/radish_03.png

# ... (ทำครบ 5 seeds)

# Push
git add seeds/
git commit -m "Add growth stages (01-03)"
git push
```

---

## 📝 Backend Response:

**API now returns:**
```json
{
  "plantedTree": {
    "_id": "...",
    "seedId": { ... },
    "startTime": "2026-02-03T13:34:06.085Z",
    "endTime": "2026-02-03T13:39:06.085Z",
    "quality": "normal"
  }
}
```

**Frontend uses:**
```typescript
startTime → คำนวณ elapsed
endTime → คำนวณ total
progress = (elapsed / total) * 100
stage = getStageByProgress(progress)
image = seedIcon.replace('_04', `_0${stage}`)
```

---

## 💡 Tips:

### Placeholder Images:
```
ถ้ายังไม่มีรูป stage 1-3:
- App จะพยายามโหลด (404)
- แสดง broken image
- ใช้ _04 แทนชั่วคราว (แก้ใน code)
```

### Fallback:
```typescript
// ถ้ารูป stage ไม่มี fallback เป็น _04
const stageIcon = seedIcon.replace(/_04\.png$/, `_0${stage}.png`);
// หรือ
const stageIcon = stage === 4 ? seedIcon : seedIcon.replace('_04', `_0${stage}`);
```

---

## ✅ Summary:

**v1.7 Features:**
```
✅ Growth stages (4 stages)
✅ Dynamic images based on progress
✅ Clickable game area
✅ Fixed tree info display
✅ Real-time timer
✅ Correct progress calculation
✅ Working water/sell buttons
```

**Required:**
```
⚠️ Add stage 1-3 images to GitHub (15 more images)
```

**Already Have:**
```
✅ Stage 4 images (5 images)
✅ Location images (8 images)
```

**Total Images Needed: 28 images**
- Seeds: 20 (5 × 4 stages)
- Locations: 8 (4 × 2 types)

---

**Version:** 1.7.0  
**Date:** Feb 3, 2026  
**Status:** Ready to test (need stage 1-3 images) 🌱✨
