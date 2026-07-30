# ✅ Checklist للرفع على Vercel

## 1. Environment Variables على Vercel
اتأكد إنك ضفت المتغيرات دي في Vercel Dashboard → Settings → Environment Variables:

```
SUPABASE_URL=https://qdxwpohacuzxvktcpxvi.supabase.co
SUPABASE_PUBLISHABLE_KEY=sb_publishable_0Q_RXWs0cfen9EooZhkvTw_Pe-OycaN
SUPABASE_PROJECT_ID=qdxwpohacuzxvktcpxvi

VITE_SUPABASE_URL=https://qdxwpohacuzxvktcpxvi.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_0Q_RXWs0cfen9EooZhkvTw_Pe-OycaN
VITE_SUPABASE_PROJECT_ID=qdxwpohacuzxvktcpxvi
```

## 2. الـ Database Tables موجودة؟
اتأكد في Supabase Dashboard إن الجداول دي موجودة:
- ✅ `site_store` (الجدول الأساسي للبيانات المشتركة)
- ✅ `opportunities`
- ✅ `partners`
- ✅ `profiles`
- ✅ `user_roles`
- ✅ `saved_opportunities`

## 3. Row Level Security (RLS) Policies
اتأكد من الـ Policies على جدول `site_store`:
- **قراءة (SELECT)**: السماح للجميع (Public Read)
- **كتابة (INSERT/UPDATE)**: السماح للأدمن فقط (Admin Only)

## 4. الملفات الأساسية
تأكد إن الملفات دي موجودة وشغالة:
- ✅ `/public/site/db-sync.js` (متحمل في HTML)
- ✅ `/src/routes/api/public/store.ts` (API endpoint)
- ✅ `.env` (مش هيترفع لكن الـ env variables هتكون على Vercel)

## 5. خطوات الرفع على Vercel

### A. من خلال GitHub (الطريقة الموصى بها)
```bash
# 1. ادفع الكود على GitHub
git add .
git commit -m "Ready for deployment with Supabase sync"
git push origin main

# 2. روح على Vercel Dashboard
# 3. اختار "Import Project"
# 4. اختار الريبو من GitHub
# 5. ضيف الـ Environment Variables
# 6. اضغط Deploy
```

### B. من خلال Vercel CLI
```bash
# 1. نصب Vercel CLI
npm i -g vercel

# 2. سجل دخول
vercel login

# 3. رفع المشروع
vercel

# 4. للرفع النهائي على Production
vercel --prod
```

## 6. بعد الرفع - اختبار البيانات

1. افتح الموقع على Vercel
2. سجل دخول كـ Admin
3. ضيف شريك جديد
4. افتح الموقع في متصفح تاني (أو Private Window)
5. **المفروض تشوف الشريك ظاهر!** ✅

## 7. في حالة وجود مشاكل

### المشكلة: البيانات مش بتظهر
**الحل:**
1. افتح Console في المتصفح (F12)
2. شوف لو في أخطاء من الـ API
3. اتأكد من الـ Environment Variables على Vercel

### المشكلة: Error 500 من الـ API
**الحل:**
1. افتح Vercel → Functions → Logs
2. شوف الـ Error message
3. غالباً المشكلة في Environment Variables مفقودة

### المشكلة: Supabase Connection Error
**الحل:**
1. اتأكد إن `SUPABASE_URL` و `SUPABASE_PUBLISHABLE_KEY` صحيحين
2. اتأكد إن جدول `site_store` موجود في Supabase
3. اتأكد من الـ RLS Policies

## 8. تحسينات إضافية (اختياري)

### A. Custom Domain
في Vercel Dashboard → Settings → Domains
- ضيف الدومين بتاعك (لو عندك واحد)

### B. Analytics
في Vercel Dashboard → Analytics
- فعّل Analytics عشان تتابع الزوار

### C. Performance
الموقع بيستخدم:
- ✅ localStorage cache (للأوفلاين)
- ✅ Auto-sync كل 15 ثانية
- ✅ يشتغل حتى لو الإنترنت ضعيف

---

## ملاحظات مهمة

1. **لا تنشر `.env` file على GitHub** - الـ values موجودة على Vercel
2. **الـ sync بيحصل تلقائياً** - مش محتاج تعمل حاجة إضافية
3. **البيانات محفوظة في Supabase** - مش على جهازك
4. **كل التعديلات بتظهر لكل المستخدمين** - real-time sync

---

## 🎉 بالتوفيق!

لو محتاج أي مساعدة، تقدر تراسلنا على:
- البريد: contact.luxentech@gmail.com
- واتساب: +201124310907
