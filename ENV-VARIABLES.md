# 🔐 Environment Variables Guide

## 📋 القائمة الكاملة

هذه هي كل الـ Environment Variables المطلوبة للمشروع:

### 1️⃣ Backend Variables (للسيرفر)

```bash
SUPABASE_URL=https://qdxwpohacuzxvktcpxvi.supabase.co
SUPABASE_PUBLISHABLE_KEY=sb_publishable_0Q_RXWs0cfen9EooZhkvTw_Pe-OycaN
SUPABASE_PROJECT_ID=qdxwpohacuzxvktcpxvi
```

**الاستخدام:**
- تُستخدم في API Routes (`src/routes/api/`)
- للاتصال بـ Supabase من السيرفر
- **لا** تظهر في المتصفح

---

### 2️⃣ Frontend Variables (للمتصفح)

```bash
VITE_SUPABASE_URL=https://qdxwpohacuzxvktcpxvi.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_0Q_RXWs0cfen9EooZhkvTw_Pe-OycaN
VITE_SUPABASE_PROJECT_ID=qdxwpohacuzxvktcpxvi
```

**الاستخدام:**
- تُستخدم في Frontend (`public/site/db-sync.js`)
- متاحة في المتصفح
- **يجب** أن تبدأ بـ `VITE_`

**ملاحظة:** القيم نفسها للـ Backend والـ Frontend، فقط البادئة تختلف!

---

## 🔍 شرح كل متغير

### `SUPABASE_URL` / `VITE_SUPABASE_URL`
- **القيمة:** `https://qdxwpohacuzxvktcpxvi.supabase.co`
- **الوصف:** رابط مشروع Supabase
- **كيفية الحصول عليه:**
  1. افتح [Supabase Dashboard](https://supabase.com/dashboard)
  2. اختار المشروع
  3. Settings → API → Project URL

### `SUPABASE_PUBLISHABLE_KEY` / `VITE_SUPABASE_PUBLISHABLE_KEY`
- **القيمة:** `sb_publishable_0Q_RXWs0cfen9EooZhkvTw_Pe-OycaN`
- **الوصف:** مفتاح عام للوصول للـ API
- **كيفية الحصول عليه:**
  1. Supabase Dashboard → Settings → API
  2. Project API keys → **anon** / **public**
- **هل هو آمن؟** نعم، هذا المفتاح مصمم للاستخدام العام

### `SUPABASE_PROJECT_ID` / `VITE_SUPABASE_PROJECT_ID`
- **القيمة:** `qdxwpohacuzxvktcpxvi`
- **الوصف:** معرف المشروع
- **كيفية الحصول عليه:**
  - هو الجزء الأول من الـ URL:
  - `https://[PROJECT_ID].supabase.co`

---

## 🎯 أين تضيفها؟

### 1. Development (محلي)

#### ملف `.env` في جذر المشروع:
```bash
# انسخ من .env.example
cp .env.example .env

# ثم أضف القيم الحقيقية
SUPABASE_URL=https://qdxwpohacuzxvktcpxvi.supabase.co
SUPABASE_PUBLISHABLE_KEY=sb_publishable_0Q_RXWs0cfen9EooZhkvTw_Pe-OycaN
SUPABASE_PROJECT_ID=qdxwpohacuzxvktcpxvi
VITE_SUPABASE_URL=https://qdxwpohacuzxvktcpxvi.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_0Q_RXWs0cfen9EooZhkvTw_Pe-OycaN
VITE_SUPABASE_PROJECT_ID=qdxwpohacuzxvktcpxvi
```

**تشغيل:**
```bash
npm run dev
```

---

### 2. Production (Vercel)

#### في Vercel Dashboard:

1. افتح Project Settings
2. اذهب لـ **Environment Variables**
3. أضف واحداً تلو الآخر:

| Name | Value | Environment |
|------|-------|------------|
| `SUPABASE_URL` | `https://qdxwpohacuzxvktcpxvi.supabase.co` | Production, Preview, Development |
| `SUPABASE_PUBLISHABLE_KEY` | `sb_publishable_0Q_RXWs0cfen9EooZhkvTw_Pe-OycaN` | Production, Preview, Development |
| `SUPABASE_PROJECT_ID` | `qdxwpohacuzxvktcpxvi` | Production, Preview, Development |
| `VITE_SUPABASE_URL` | `https://qdxwpohacuzxvktcpxvi.supabase.co` | Production, Preview, Development |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | `sb_publishable_0Q_RXWs0cfen9EooZhkvTw_Pe-OycaN` | Production, Preview, Development |
| `VITE_SUPABASE_PROJECT_ID` | `qdxwpohacuzxvktcpxvi` | Production, Preview, Development |

4. **Redeploy** المشروع بعد الإضافة

---

#### من خلال Vercel CLI:

```bash
# إضافة متغير واحد
vercel env add SUPABASE_URL

# سيطلب منك:
# 1. القيمة (Value)
# 2. Environment (اختر: Production, Preview, Development)

# كرر للـ 6 متغيرات
vercel env add SUPABASE_PUBLISHABLE_KEY
vercel env add SUPABASE_PROJECT_ID
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_PUBLISHABLE_KEY
vercel env add VITE_SUPABASE_PROJECT_ID

# سحب المتغيرات محلياً (للاختبار)
vercel env pull .env.local
```

---

## ✅ التحقق من الإضافة

### في Development:
```bash
# شغّل السيرفر
npm run dev

# افتح Console في المتصفح
console.log(import.meta.env.VITE_SUPABASE_URL)
# يجب أن تظهر: https://qdxwpohacuzxvktcpxvi.supabase.co
```

### في Production:
1. افتح الموقع على Vercel
2. افتح Console (F12)
3. ابحث عن أخطاء مثل:
   ```
   Missing Supabase environment variable
   ```
4. إذا لم توجد أخطاء → ✅ كل شيء يعمل!

---

## ❌ الأخطاء الشائعة

### 1. "Missing environment variable"
**السبب:** لم تضف المتغير على Vercel  
**الحل:**
```bash
# أضف المتغير الناقص
vercel env add VARIABLE_NAME

# ثم Redeploy
vercel --prod
```

### 2. "Unauthorized: Invalid API key"
**السبب:** قيمة `SUPABASE_PUBLISHABLE_KEY` خاطئة  
**الحل:**
1. Supabase Dashboard → Settings → API
2. انسخ القيمة الصحيحة
3. حدّث على Vercel
4. Redeploy

### 3. المتغيرات تظهر في Developer Console
**السبب:** هذا طبيعي للمتغيرات التي تبدأ بـ `VITE_`  
**حل:** لا مشكلة! المفتاح العام (`publishable`) آمن للاستخدام

### 4. "Cannot connect to Supabase"
**السبب:** URL خاطئ أو المشروع متوقف  
**الحل:**
1. تحقق من URL في Supabase Dashboard
2. تأكد أن المشروع Active (غير Paused)
3. تحقق من الإنترنت

---

## 🔒 الأمان

### ✅ آمن للمشاركة:
- `SUPABASE_URL` ✅
- `SUPABASE_PUBLISHABLE_KEY` ✅
- `SUPABASE_PROJECT_ID` ✅

هذه القيم **عامة** ومصممة للاستخدام في Frontend.

### ❌ لا تشارك أبداً:
- `SUPABASE_SERVICE_ROLE_KEY` ❌ (لو استخدمته)
- Any `SECRET` keys ❌

**في مشروعنا:** نستخدم `PUBLISHABLE_KEY` فقط، وهو آمن. ✅

---

## 📝 Template للنسخ

### للـ Vercel Dashboard:
```
Name: SUPABASE_URL
Value: https://qdxwpohacuzxvktcpxvi.supabase.co

Name: SUPABASE_PUBLISHABLE_KEY
Value: sb_publishable_0Q_RXWs0cfen9EooZhkvTw_Pe-OycaN

Name: SUPABASE_PROJECT_ID
Value: qdxwpohacuzxvktcpxvi

Name: VITE_SUPABASE_URL
Value: https://qdxwpohacuzxvktcpxvi.supabase.co

Name: VITE_SUPABASE_PUBLISHABLE_KEY
Value: sb_publishable_0Q_RXWs0cfen9EooZhkvTw_Pe-OycaN

Name: VITE_SUPABASE_PROJECT_ID
Value: qdxwpohacuzxvktcpxvi
```

### للـ `.env` محلي:
```bash
SUPABASE_URL=https://qdxwpohacuzxvktcpxvi.supabase.co
SUPABASE_PUBLISHABLE_KEY=sb_publishable_0Q_RXWs0cfen9EooZhkvTw_Pe-OycaN
SUPABASE_PROJECT_ID=qdxwpohacuzxvktcpxvi
VITE_SUPABASE_URL=https://qdxwpohacuzxvktcpxvi.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_0Q_RXWs0cfen9EooZhkvTw_Pe-OycaN
VITE_SUPABASE_PROJECT_ID=qdxwpohacuzxvktcpxvi
```

---

## 🎯 Checklist

قبل الرفع، تأكد:

- [ ] كل الـ 6 متغيرات مضافة على Vercel
- [ ] القيم صحيحة (تطابق `.env`)
- [ ] Environment اخترت: Production + Preview + Development
- [ ] عملت Redeploy بعد الإضافة
- [ ] الموقع يفتح بدون أخطاء Console
- [ ] البيانات تظهر من Supabase

---

## 📞 مساعدة

إذا واجهت مشكلة:
- **واتساب:** +201124310907
- **بريد:** contact.luxentech@gmail.com

---

**ملاحظة:** هذا الملف للمرجع فقط. لا ترفعه على GitHub مع القيم الحقيقية!
