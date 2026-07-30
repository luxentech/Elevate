# 🏗️ بنية النظام (System Architecture)

## 📊 نظرة عامة

```
┌─────────────────────────────────────────────────────────────┐
│                      Elevate Platform                        │
│                   (Partner Portal System)                    │
└─────────────────────────────────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
        ▼                   ▼                   ▼
┌──────────────┐   ┌──────────────┐   ┌──────────────┐
│   Browser    │   │   Browser    │   │   Browser    │
│  (Device 1)  │   │  (Device 2)  │   │  (Device 3)  │
└──────┬───────┘   └──────┬───────┘   └──────┬───────┘
       │                  │                  │
       └──────────────────┼──────────────────┘
                          │
                          ▼
              ┌───────────────────────┐
              │  db-sync.js           │
              │  (Sync Layer)         │
              └───────────┬───────────┘
                          │
                          ▼
              ┌───────────────────────┐
              │  localStorage         │
              │  (Local Cache)        │
              └───────────┬───────────┘
                          │
                          ▼
              ┌───────────────────────┐
              │  /api/public/store    │
              │  (API Endpoint)       │
              └───────────┬───────────┘
                          │
                          ▼
              ┌───────────────────────┐
              │  Supabase Database    │
              │  (PostgreSQL)         │
              └───────────────────────┘
```

---

## 🔄 تدفق البيانات (Data Flow)

### 1️⃣ عند فتح الموقع (Page Load)

```
User opens website
       │
       ▼
┌─────────────────────┐
│ db-sync.js loads    │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Read from cache     │ ← localStorage (offline support)
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ GET /api/store      │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Supabase returns    │
│ latest data         │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Update UI           │
│ Update cache        │
└─────────────────────┘
```

### 2️⃣ عند إضافة بيانات (Add Data)

```
Admin adds partner
       │
       ▼
┌─────────────────────┐
│ localStorage.set()  │ ← Intercepted by db-sync.js
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Update memory       │
│ Update cache        │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ POST /api/store     │
│ { key, value }      │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Supabase saves      │
│ to database         │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ All devices         │
│ auto-refresh        │
│ (within 15s)        │
└─────────────────────┘
```

### 3️⃣ المزامنة التلقائية (Auto-Sync)

```
Every 15 seconds
       │
       ▼
┌─────────────────────┐
│ Check if idle       │
└──────────┬──────────┘
           │ Yes
           ▼
┌─────────────────────┐
│ GET /api/store      │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Compare with local  │
└──────────┬──────────┘
           │ Changes detected
           ▼
┌─────────────────────┐
│ Update UI           │
│ Update cache        │
└─────────────────────┘
```

---

## 🗄️ قاعدة البيانات (Database Schema)

### جدول `site_store`
```sql
CREATE TABLE site_store (
    key TEXT PRIMARY KEY,
    value JSONB,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ
);
```

#### البيانات المخزنة:
```json
{
  "luxen_general_cards": [
    {
      "id": "1234567890",
      "type": "competitions",
      "name": "مسابقة البرمجة",
      "category": "تكنولوجيا",
      "imgOuter": "https://...",
      "imgInner": "https://...",
      "isFeatured": true,
      "tags": "برمجة تقنية",
      "deadline": "2024-12-31",
      "description": "...",
      "status": "visible"
    }
  ],
  
  "luxen_partners": [
    {
      "id": "1234567890",
      "name": "Google",
      "type": "شركة تقنية",
      "logo": "https://..."
    }
  ],
  
  "luxen_comments": [
    {
      "id": "1234567890",
      "cardId": "opportunity_id",
      "name": "أحمد",
      "text": "فرصة رائعة!",
      "date": "2024-01-15"
    }
  ],
  
  "luxen_likes": {
    "opportunity_id": ["user1", "user2"]
  },
  
  "luxen_all_users": [
    {
      "id": "1234567890",
      "username": "user1",
      "name": "أحمد محمد",
      "isAdmin": false
    }
  ],
  
  "luxen_notifications": [
    {
      "id": "1234567890",
      "title": "إشعار جديد",
      "message": "...",
      "link": "#",
      "date": "2024-01-15",
      "read": false
    }
  ],
  
  "luxen_category_status": {
    "competitions": "visible",
    "scholarships": "visible",
    "jobs": "soon"
  }
}
```

---

## 🔐 الأمان (Security)

### Row Level Security (RLS)

```sql
-- القراءة: متاحة للجميع
CREATE POLICY "Allow public read"
ON site_store FOR SELECT
USING (true);

-- الكتابة: متاحة للجميع حالياً
CREATE POLICY "Allow public write"
ON site_store FOR ALL
USING (true)
WITH CHECK (true);
```

**ملاحظة:** يمكن تقييد الكتابة للأدمن فقط:
```sql
-- للأدمن فقط (مستقبلاً)
CREATE POLICY "Admin only write"
ON site_store FOR ALL
USING (has_role('admin', auth.uid()))
WITH CHECK (has_role('admin', auth.uid()));
```

---

## 📦 المكونات (Components)

### Frontend (`public/site/`)
```
script.js
├── App.init()                 → تهيئة التطبيق
├── App.renderPartners()       → عرض الشركاء
├── App.renderOpportunities()  → عرض الفرص
└── Admin.init()               → لوحة التحكم

style.css
└── التصميم الكامل للموقع

db-sync.js
├── localStorage interceptor   → اعتراض التخزين
├── API sync                   → مزامنة مع API
└── auto-refresh               → تحديث تلقائي
```

### Backend (`src/routes/api/`)
```
public/store.ts
├── GET  → جلب البيانات
└── POST → حفظ البيانات
```

### Database Integration (`src/integrations/supabase/`)
```
client.ts       → Supabase client
client.server.ts → Server-side client
types.ts        → TypeScript types
```

---

## ⚡ الأداء (Performance)

### استراتيجية الكاش:
```
┌─────────────────────┐
│  Memory (RAM)       │ ← أسرع (0ms)
└──────────┬──────────┘
           │ Fallback
           ▼
┌─────────────────────┐
│  localStorage       │ ← سريع (5-10ms)
└──────────┬──────────┘
           │ Fallback
           ▼
┌─────────────────────┐
│  Supabase API       │ ← متوسط (50-200ms)
└─────────────────────┘
```

### وقت الاستجابة:
- **أول تحميل:** 500ms (من Supabase)
- **التحديثات:** Instant (من Memory)
- **Sync:** Background (لا يعيق المستخدم)

---

## 🌐 البنية التحتية (Infrastructure)

```
┌──────────────────────────────────────────┐
│           User's Browser                 │
│  ┌────────────────────────────────────┐  │
│  │  React App + db-sync.js            │  │
│  └────────────────────────────────────┘  │
└────────────────┬─────────────────────────┘
                 │ HTTPS
                 ▼
┌──────────────────────────────────────────┐
│          Vercel Edge Network             │
│  ┌────────────────────────────────────┐  │
│  │  TanStack Start API                │  │
│  │  Nitro Server                      │  │
│  └────────────────┬───────────────────┘  │
└───────────────────┼──────────────────────┘
                    │ HTTPS + API Key
                    ▼
┌──────────────────────────────────────────┐
│          Supabase Cloud                  │
│  ┌────────────────────────────────────┐  │
│  │  PostgreSQL Database               │  │
│  │  Row Level Security                │  │
│  │  Auto Backup                       │  │
│  └────────────────────────────────────┘  │
└──────────────────────────────────────────┘
```

---

## 🔄 Deployment Pipeline

```
Developer → GitHub → Vercel → Production
    │          │        │          │
    │          │        │          ▼
    │          │        │    ┌──────────┐
    │          │        │    │  Build   │
    │          │        │    └──────────┘
    │          │        │          │
    │          │        │          ▼
    │          │        │    ┌──────────┐
    │          │        │    │ Deploy   │
    │          │        │    └──────────┘
    │          │        │          │
    │          │        │          ▼
    │          │        │    ┌──────────┐
    │          │        └────┤   CDN    │
    │          │             └──────────┘
    │          │                   │
    │          └───────────────────┤
    │                              │
    └──────────────────────────────┘
           Auto-deploy on push
```

---

## 📊 المراقبة (Monitoring)

### Vercel:
- **Functions Logs** → أخطاء API
- **Analytics** → عدد الزوار
- **Performance** → سرعة التحميل

### Supabase:
- **Database Stats** → استهلاك
- **API Logs** → الطلبات
- **Storage** → حجم البيانات

---

## 🛠️ الصيانة (Maintenance)

### يومياً:
- ✅ Auto-backup (Supabase)
- ✅ Auto-scaling (Vercel)

### شهرياً:
- [ ] مراجعة Logs
- [ ] تحديث Dependencies
- [ ] فحص الأمان

### سنوياً:
- [ ] Database optimization
- [ ] Performance audit
- [ ] Security review

---

## 📈 التوسع (Scalability)

### الحالي:
- **Users:** Unlimited
- **Requests:** 500,000/month (Vercel Free)
- **Database:** 500 MB (Supabase Free)

### للتوسع:
1. ترقية Vercel Plan
2. ترقية Supabase Plan
3. إضافة CDN للصور
4. تفعيل Database Indexing

---

**آخر تحديث:** 2024
**النسخة:** 1.0.0
**الحالة:** ✅ Production Ready
