# Elevate - منصة الفرص والمنح 🚀

**Elevate** هي منصة شاملة لاكتشاف الفرص الاستثنائية للطلاب والخريجين - مسابقات، منح دراسية، فرص تطوع، وظائف، كورسات، وأكثر!

[![Built with Lovable](https://img.shields.io/badge/Built%20with-Lovable-ff69b4)](https://lovable.dev)
[![Powered by Supabase](https://img.shields.io/badge/Powered%20by-Supabase-3ECF8E)](https://supabase.com)
[![Deploy with Vercel](https://img.shields.io/badge/Deploy%20with-Vercel-000000)](https://vercel.com)

---

## ✨ المميزات

- 🔍 **بحث ذكي** - ابحث عن الفرص بسهولة وفلترها حسب التصنيف
- 📱 **تصميم متجاوب** - يعمل بشكل مثالي على كل الأجهزة
- 🌐 **دعم ثنائي اللغة** - العربية والإنجليزية
- 💾 **قاعدة بيانات سحابية** - كل البيانات مخزنة على Supabase
- 🔄 **مزامنة تلقائية** - البيانات تتحدث تلقائياً كل 15 ثانية
- 📴 **دعم أوفلاين** - الموقع يعمل حتى بدون إنترنت
- 🎨 **ثيمات متعددة** - وضع الليل والنهار
- 🔐 **لوحة تحكم أدمن** - إدارة كاملة للفرص والشركاء

---

## 🛠️ التقنيات المستخدمة

### Frontend
- **React 19** - مكتبة JavaScript الحديثة
- **TanStack Router** - Routing متقدم
- **TanStack Query** - إدارة البيانات
- **Tailwind CSS** - تصميم سريع وأنيق
- **Radix UI** - مكونات UI قابلة للوصول

### Backend
- **Supabase** - قاعدة بيانات PostgreSQL
- **TanStack Start** - Server-side rendering
- **Nitro** - Server engine

### Deployment
- **Vercel** - استضافة سحابية سريعة
- **Git + GitHub** - إدارة الأكواد

---

## 🚀 البدء السريع

### المتطلبات
- Node.js 18+ (يفضل استخدام [nvm](https://github.com/nvm-sh/nvm))
- npm أو yarn أو bun

### التثبيت المحلي

```bash
# استنساخ المشروع
git clone https://github.com/YOUR-USERNAME/public-partner-portal.git
cd public-partner-portal

# تثبيت الحزم
npm install
# أو
bun install

# إنشاء ملف .env
cp .env.example .env
# ثم أضف بيانات Supabase الخاصة بك

# تشغيل السيرفر المحلي
npm run dev
```

افتح المتصفح على: `http://localhost:3000`

---

## 📦 الرفع على Production

### خطوات الرفع على Vercel

1. **تجهيز Supabase**
   ```bash
   # افتح Supabase Dashboard → SQL Editor
   # نفذ محتوى ملف: supabase-setup.sql
   ```

2. **رفع الكود على GitHub**
   ```bash
   git add .
   git commit -m "Ready for production"
   git push origin main
   ```

3. **الربط مع Vercel**
   - افتح [Vercel Dashboard](https://vercel.com)
   - اختر "Import Project"
   - اختر الريبو من GitHub
   - **أضف Environment Variables:**
     ```
     SUPABASE_URL=https://qdxwpohacuzxvktcpxvi.supabase.co
     SUPABASE_PUBLISHABLE_KEY=sb_publishable_0Q_RXWs0cfen9EooZhkvTw_Pe-OycaN
     VITE_SUPABASE_URL=https://qdxwpohacuzxvktcpxvi.supabase.co
     VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_0Q_RXWs0cfen9EooZhkvTw_Pe-OycaN
     ```
   - اضغط **Deploy**

**للمزيد من التفاصيل، راجع:** [`كيفية-الرفع-على-Vercel.md`](./كيفية-الرفع-على-Vercel.md)

---

## 📁 هيكل المشروع

```
public-partner-portal/
├── public/
│   └── site/                # الموقع الثابت
│       ├── db-sync.js       # مزامنة localStorage مع Database
│       ├── script.js        # منطق التطبيق الرئيسي
│       ├── style.css        # التصميم
│       └── index.html       # الصفحة الرئيسية
├── src/
│   ├── routes/
│   │   └── api/
│   │       └── public/
│   │           └── store.ts # API endpoint للبيانات
│   ├── integrations/
│   │   └── supabase/        # إعدادات Supabase
│   └── components/          # مكونات React
├── supabase-setup.sql       # SQL لإنشاء الجداول
├── DEPLOYMENT-CHECKLIST.md  # قائمة التحقق للرفع
├── كيفية-الرفع-على-Vercel.md # دليل الرفع بالعربي
└── README.md                # هذا الملف
```

---

## 🔧 كيف يعمل نظام المزامنة؟

### 1. التحميل الأولي
```javascript
// عند فتح الموقع، db-sync.js يسحب البيانات من Supabase
GET /api/public/store
↓
localStorage (cache للأوفلاين)
↓
التطبيق يعرض البيانات
```

### 2. إضافة بيانات جديدة
```javascript
// عند إضافة فرصة أو شريك
Admin يضيف بيانات
↓
localStorage.setItem() (بيتم اعتراضه بواسطة db-sync.js)
↓
POST /api/public/store → Supabase Database
↓
كل الأجهزة تحصل على التحديث خلال 15 ثانية
```

### 3. المزامنة التلقائية
```javascript
// كل 15 ثانية
setInterval(() => {
  fetch('/api/public/store')
    .then(data => updateUI(data))
}, 15000);
```

---

## 🗄️ قاعدة البيانات

### الجداول الرئيسية

| جدول | الوصف |
|-----|-------|
| `site_store` | البيانات المشتركة (الفرص، الشركاء، التعليقات) |
| `opportunities` | الفرص المنظمة |
| `partners` | الشركاء |
| `profiles` | ملفات المستخدمين |
| `user_roles` | الأدوار (admin/user) |
| `saved_opportunities` | الفرص المحفوظة |

### مفاتيح site_store

```javascript
{
  "luxen_general_cards": [],      // الفرص
  "luxen_partners": [],            // الشركاء
  "luxen_comments": [],            // التعليقات
  "luxen_likes": {},               // الإعجابات
  "luxen_all_users": [],           // المستخدمين
  "luxen_notifications": [],       // الإشعارات
  "luxen_category_status": {}      // حالة التصنيفات
}
```

---

## 🎨 التخصيص

### تغيير الألوان
عدّل في `public/site/style.css`:
```css
:root {
  --primary-color: #8b5cf6;
  --secondary-color: #3b82f6;
  /* ... */
}
```

### إضافة تصنيف جديد
في `public/site/index.html`:
```html
<a href="?category=new-category" class="category-card">
  <div class="cat-icon"><i class="fas fa-icon"></i></div>
  <h3 class="cat-title">التصنيف الجديد</h3>
</a>
```

---

## 🐛 استكشاف الأخطاء

### البيانات لا تظهر على الأجهزة الأخرى
1. تأكد من تشغيل `supabase-setup.sql` في Supabase
2. تأكد من إضافة Environment Variables على Vercel
3. افتح Console (F12) وابحث عن أخطاء في الشبكة

### خطأ 500 من API
1. افتح Vercel → Functions → Logs
2. تأكد من `SUPABASE_URL` و `SUPABASE_PUBLISHABLE_KEY`
3. تأكد من وجود جدول `site_store`

---

## 🤝 المساهمة

نرحب بالمساهمات! إذا كنت تريد المساعدة:

1. Fork المشروع
2. أنشئ فرع جديد (`git checkout -b feature/amazing-feature`)
3. Commit التغييرات (`git commit -m 'Add amazing feature'`)
4. Push للفرع (`git push origin feature/amazing-feature`)
5. افتح Pull Request

---

## 📞 الدعم

- **البريد الإلكتروني:** contact.luxentech@gmail.com
- **واتساب:** [+201124310907](https://wa.me/201124310907)
- **Issues:** [افتح issue على GitHub](https://github.com/YOUR-USERNAME/public-partner-portal/issues)

---

## 📄 الترخيص

هذا المشروع مرخص تحت رخصة MIT - راجع ملف [LICENSE](LICENSE) للتفاصيل.

---

## 🙏 شكر وتقدير

- **Lovable** - منصة التطوير السريع
- **Supabase** - قاعدة البيانات السحابية
- **Vercel** - الاستضافة السحابية
- **Font Awesome** - الأيقونات
- **Google Fonts** - الخطوط

---

## 🎯 الخطط المستقبلية

- [ ] إشعارات فورية (Push Notifications)
- [ ] تطبيق موبايل (React Native)
- [ ] نظام تقييم الفرص
- [ ] خوارزمية توصيات ذكية
- [ ] دعم المزيد من اللغات

---

<div align="center">

**صُنع بـ ❤️ بواسطة فريق Elevate**

[الموقع](https://elevate-portal.vercel.app) • [GitHub](https://github.com/YOUR-USERNAME/public-partner-portal) • [التواصل](mailto:contact.luxentech@gmail.com)

</div>
