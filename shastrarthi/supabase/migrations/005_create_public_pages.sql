CREATE TABLE IF NOT EXISTS public_pages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    source_query TEXT,
    language TEXT DEFAULT 'en',
    mode TEXT DEFAULT 'simplify' CHECK (mode IN ('simplify', 'translate')),
    meta_description TEXT,
    keywords TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_public_pages_slug ON public_pages(slug);
CREATE INDEX IF NOT EXISTS idx_public_pages_mode_language ON public_pages(mode, language);
CREATE INDEX IF NOT EXISTS idx_public_pages_created_at ON public_pages(created_at DESC);

ALTER TABLE public_pages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view public pages" ON public_pages
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create public pages" ON public_pages
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update public pages" ON public_pages
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE TRIGGER update_public_pages_updated_at
    BEFORE UPDATE ON public_pages
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at();
