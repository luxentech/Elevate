-- =====================================================
-- Supabase Database Setup for Elevate Platform
-- =====================================================
-- هذا الملف يحتوي على كل الـ SQL اللازم لتجهيز قاعدة البيانات
-- =====================================================

-- 1. إنشاء جدول site_store (إذا لم يكن موجوداً)
-- هذا الجدول يخزن البيانات المشتركة بين كل المستخدمين
CREATE TABLE IF NOT EXISTS public.site_store (
    key TEXT PRIMARY KEY NOT NULL,
    value JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. تفعيل Row Level Security على جدول site_store
ALTER TABLE public.site_store ENABLE ROW LEVEL SECURITY;

-- 3. إنشاء Policy للقراءة (السماح للجميع بالقراءة)
DROP POLICY IF EXISTS "Allow public read access" ON public.site_store;
CREATE POLICY "Allow public read access"
ON public.site_store
FOR SELECT
TO public
USING (true);

-- 4. إنشاء Policy للكتابة (السماح للجميع بالكتابة حالياً - يمكن تقييده لاحقاً)
-- ملاحظة: في Production يفضل تقييد الكتابة للأدمن فقط
DROP POLICY IF EXISTS "Allow public write access" ON public.site_store;
CREATE POLICY "Allow public write access"
ON public.site_store
FOR ALL
TO public
USING (true)
WITH CHECK (true);

-- 5. إنشاء Function لتحديث updated_at تلقائياً
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. إنشاء Trigger لتحديث updated_at
DROP TRIGGER IF EXISTS set_updated_at ON public.site_store;
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON public.site_store
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- 7. إدراج البيانات الافتراضية (إذا كان الجدول فارغاً)
INSERT INTO public.site_store (key, value) 
VALUES 
    ('luxen_general_cards', '[]'::jsonb),
    ('luxen_partners', '[]'::jsonb),
    ('luxen_comments', '[]'::jsonb),
    ('luxen_likes', '{}'::jsonb),
    ('luxen_all_users', '[]'::jsonb),
    ('luxen_notifications', '[]'::jsonb),
    ('luxen_category_status', '{}'::jsonb)
ON CONFLICT (key) DO NOTHING;

-- =====================================================
-- تأكد من أن الجداول الأخرى موجودة أيضاً
-- =====================================================

-- جدول opportunities (للفرص)
CREATE TABLE IF NOT EXISTS public.opportunities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    title_ar TEXT,
    description TEXT,
    description_ar TEXT,
    category TEXT NOT NULL,
    organization TEXT,
    location TEXT,
    deadline TIMESTAMPTZ,
    image_url TEXT,
    apply_url TEXT,
    featured BOOLEAN DEFAULT false,
    status TEXT DEFAULT 'visible' CHECK (status IN ('visible', 'soon', 'hidden')),
    created_by UUID,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- جدول partners (للشركاء)
CREATE TABLE IF NOT EXISTS public.partners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    logo_url TEXT,
    website_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- جدول profiles (للمستخدمين)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    display_name TEXT,
    avatar_url TEXT,
    university TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- جدول user_roles (للأدوار)
CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('admin', 'user')),
    UNIQUE(user_id, role)
);

-- جدول saved_opportunities (للفرص المحفوظة)
CREATE TABLE IF NOT EXISTS public.saved_opportunities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    opportunity_id UUID NOT NULL REFERENCES public.opportunities(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id, opportunity_id)
);

-- =====================================================
-- تفعيل RLS على الجداول الأخرى
-- =====================================================

ALTER TABLE public.opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_opportunities ENABLE ROW LEVEL SECURITY;

-- Policies للـ opportunities
DROP POLICY IF EXISTS "Anyone can view visible opportunities" ON public.opportunities;
CREATE POLICY "Anyone can view visible opportunities"
ON public.opportunities FOR SELECT
TO public
USING (status = 'visible' OR status = 'soon');

-- Policies للـ partners
DROP POLICY IF EXISTS "Anyone can view partners" ON public.partners;
CREATE POLICY "Anyone can view partners"
ON public.partners FOR SELECT
TO public
USING (true);

-- =====================================================
-- إنشاء Indexes لتحسين الأداء
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_opportunities_category ON public.opportunities(category);
CREATE INDEX IF NOT EXISTS idx_opportunities_status ON public.opportunities(status);
CREATE INDEX IF NOT EXISTS idx_opportunities_deadline ON public.opportunities(deadline);
CREATE INDEX IF NOT EXISTS idx_site_store_key ON public.site_store(key);

-- =====================================================
-- Function للتحقق من الأدوار (has_role)
-- =====================================================

CREATE OR REPLACE FUNCTION public.has_role(_role TEXT, _user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.user_roles
        WHERE user_id = _user_id AND role = _role
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- انتهى الإعداد!
-- =====================================================
-- الآن يمكنك رفع المشروع على Vercel
-- تأكد من إضافة Environment Variables في Vercel:
-- - SUPABASE_URL
-- - SUPABASE_PUBLISHABLE_KEY
-- - SUPABASE_PROJECT_ID
-- - VITE_SUPABASE_URL
-- - VITE_SUPABASE_PUBLISHABLE_KEY
-- - VITE_SUPABASE_PROJECT_ID
-- =====================================================
