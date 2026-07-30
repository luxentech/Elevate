# رفع الموقع على Vercel

1. ارفع الكود على GitHub ثم اعمل Import للمشروع في Vercel.
2. Framework Preset: Other (الإعدادات موجودة في `vercel.json`).
3. أضف Environment Variables دي في Vercel (Production + Preview):

| Name | القيمة |
|---|---|
| `NITRO_PRESET` | `vercel` |
| `SUPABASE_URL` | نفس القيمة الموجودة في ملف `.env` |
| `SUPABASE_PUBLISHABLE_KEY` | نفس القيمة الموجودة في `.env` |
| `SUPABASE_SERVICE_ROLE_KEY` | مفتاح الـ service role (سري — يُستخدم على السيرفر فقط) |
| `VITE_SUPABASE_URL` | نفس `SUPABASE_URL` |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | نفس `SUPABASE_PUBLISHABLE_KEY` |
| `VITE_SUPABASE_PROJECT_ID` | نفس `SUPABASE_PROJECT_ID` |

4. اضغط Deploy. كل البيانات بتتخزن في قاعدة البيانات عبر `/api/public/store`
   وتظهر على أي متصفح أو جهاز.
