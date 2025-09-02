# 📚 Updated Folder Structure Documentation

## Overview
ไฟล์ types, services, และ hooks ได้ถูกย้ายไปที่โฟลเดอร์ `lib` เพื่อให้โครงสร้างเป็นระเบียบมากขึ้นและตามมาตรฐาน Next.js

## 📁 New Final Structure

```
src/
├── app/
│   └── home/
│       └── page.tsx                 # Home page component
├── components/
│   ├── home/                        # Home page specific components
│   │   ├── AppIntro.tsx
│   │   ├── AppStats.tsx
│   │   ├── GroupCard.tsx
│   │   ├── YourGroupsSection.tsx
│   │   └── index.ts
│   ├── shared/                      # Shared components
│   │   ├── AppHeader.tsx
│   │   └── index.ts
│   ├── ui/                          # UI library components
│   └── schemas.ts
├── config/
│   ├── home/                        # Home page specific config
│   │   └── index.ts
│   └── shared/                      # Shared config
│       ├── app.ts
│       └── index.ts
├── lib/                             # 🆕 Core business logic
│   ├── hooks/                       # Custom React hooks
│   │   ├── home/
│   │   │   ├── useUserGroups.ts
│   │   │   ├── useGroupSearch.ts
│   │   │   └── index.ts
│   │   ├── shared/
│   │   │   ├── useAsync.ts
│   │   │   └── index.ts
│   │   └── index.ts
│   ├── services/                    # API services
│   │   ├── home/
│   │   │   ├── groupService.ts
│   │   │   └── index.ts
│   │   ├── shared/
│   │   │   └── index.ts
│   │   └── index.ts
│   ├── types/                       # TypeScript types
│   │   ├── home/
│   │   │   ├── group.ts
│   │   │   └── index.ts
│   │   ├── shared/
│   │   │   └── index.ts
│   │   └── index.ts
│   └── utils.ts                     # Utility functions (existing)
├── hooks/                           # 🔗 Re-exports from lib
│   └── index.ts
├── services/                        # 🔗 Re-exports from lib
│   └── index.ts
├── types/                           # 🔗 Re-exports from lib
│   └── index.ts
└── styles/
    └── globals.css
```

## 🎯 Key Changes

### ✅ **What Changed:**
1. **ย้าย core logic ไปที่ `lib/`** - ตามมาตรฐาน Next.js
2. **รักษา compatibility** - โฟลเดอร์เก่ายังใช้งานได้ผ่าน re-exports
3. **จัดระเบียบตาม feature** - แยกไฟล์ตาม page/feature ที่ใช้
4. **ลด coupling** - แต่ละหน้าพึ่งพาไฟล์ของตัวเองเป็นหลัก

### 🔄 **Import Patterns:**

```typescript
// ✅ Recommended: Direct import from lib
import { useUserGroups } from '../../lib/hooks/home';
import { Group } from '../../lib/types/home';
import { groupService } from '../../lib/services/home';

// ✅ Also works: Via re-exports (backward compatibility)
import { useUserGroups } from '../../hooks';
import { Group } from '../../types';
import { groupService } from '../../services';
```

## 📋 Benefits of New Structure

### 🏗️ **Architecture Benefits:**
1. **Following Next.js conventions** - `lib` folder เป็นมาตรฐาน
2. **Clear separation** - business logic แยกจาก UI components
3. **Easier testing** - logic ใน `lib` test ได้ง่าย
4. **Better organization** - ระบบใหญ่ขึ้นก็จัดการได้
5. **Backward compatibility** - code เก่ายังใช้งานได้

### 📊 **Developer Experience:**
- **ง่ายต่อการหา** - รู้ทันทีว่าไฟล์อยู่ที่ไหน
- **ขยายง่าย** - เพิ่ม feature ใหม่ได้ง่าย
- **แยกความรับผิดชอบ** - แต่ละส่วนมีหน้าที่ชัดเจน
- **Import สะอาด** - มี option หลายแบบ

## 🚀 How to Add New Features

### 🆕 **For new pages (e.g., Profile):**
```
lib/
├── hooks/profile/
├── services/profile/
├── types/profile/
└── ...

components/profile/
├── ProfileForm.tsx
├── ProfileCard.tsx
└── index.ts
```

### 🔧 **For shared functionality:**
```
lib/
├── hooks/shared/
├── services/shared/
├── types/shared/
└── ...

components/shared/
├── NewComponent.tsx
└── index.ts
```

## 📝 Migration Notes

- **Existing imports still work** - ไม่ต้องเปลี่ยน code เก่า
- **New code should use lib/** - import ตรงจาก lib
- **Gradual migration** - ค่อยๆ ย้าย import เก่าได้

โครงสร้างใหม่นี้ทำให้โปรเจ็กต์เป็นระเบียบและพร้อมสำหรับการขยายระบบในอนาคต! 🎉
