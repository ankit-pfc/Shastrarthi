-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Texts (pre-loaded content)
CREATE TABLE texts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    title_en TEXT NOT NULL,
    title_sa TEXT,
    category TEXT NOT NULL CHECK (category IN ('Veda', 'Upanishad', 'Tantra', 'Yoga', 'Itihasa', 'Purana')),
    tradition TEXT CHECK (tradition IN ('Advaita', 'Vishishtadvaita', 'Dvaita', 'Shakta', 'Shaiva', 'Buddhist', 'Jain')),
    difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced', 'scholar')),
    description TEXT,
    verse_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT now()
);

-- Verses (atomic content units)
CREATE TABLE verses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    text_id UUID REFERENCES texts(id) ON DELETE CASCADE,
    ref TEXT NOT NULL, -- e.g., '2.47', '1.2', '1.1.3'
    order_index INT NOT NULL,
    sanskrit TEXT,
    transliteration TEXT,
    translation_en TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT now()
);

CREATE INDEX idx_verses_text_id ON verses(text_id);
CREATE INDEX idx_verses_order ON verses(text_id, order_index);

-- Profiles (linked to Supabase Auth users)
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    preferences JSONB DEFAULT '{
        "theme": "light",
        "fontSize": "medium",
        "showSanskrit": true,
        "showTransliteration": true
    }'::jsonb,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
);

-- Saved texts (My Library)
CREATE TABLE user_texts (
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    text_id UUID REFERENCES texts(id) ON DELETE CASCADE,
    saved_at TIMESTAMP DEFAULT now(),
    PRIMARY KEY (user_id, text_id)
);

-- Bookmarks
CREATE TABLE bookmarks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    verse_id UUID REFERENCES verses(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT now(),
    UNIQUE(user_id, verse_id)
);

-- Notes
CREATE TABLE notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    verse_id UUID REFERENCES verses(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
);

-- Reading progress (optional for MVP)
CREATE TABLE reading_progress (
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    text_id UUID REFERENCES texts(id) ON DELETE CASCADE,
    last_verse_index INT DEFAULT 0,
    completed_at TIMESTAMP,
    PRIMARY KEY (user_id, text_id)
);

-- Row Level Security Policies

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_texts ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE reading_progress ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Public profiles are viewable" ON profiles
    FOR SELECT USING (true);

-- User texts policies
CREATE POLICY "Users can view own saved texts" ON user_texts
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can save texts" ON user_texts
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove saved texts" ON user_texts
    FOR DELETE USING (auth.uid() = user_id);

-- Bookmarks policies
CREATE POLICY "Users can view own bookmarks" ON bookmarks
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create bookmarks" ON bookmarks
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete bookmarks" ON bookmarks
    FOR DELETE USING (auth.uid() = user_id);

-- Notes policies
CREATE POLICY "Users can view own notes" ON notes
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create notes" ON notes
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own notes" ON notes
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete notes" ON notes
    FOR DELETE USING (auth.uid() = user_id);

-- Reading progress policies
CREATE POLICY "Users can view own progress" ON reading_progress
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own progress" ON reading_progress
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress" ON reading_progress
    FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Texts and verses are public (no RLS needed for reading)
-- But we can add policies if needed for future features

-- Function to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, name)
    VALUES (
        new.id,
        new.email,
        new.raw_user_meta_data->>'name'
    );
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call the function
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for profiles table
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at();

-- Trigger for notes table
CREATE TRIGGER update_notes_updated_at
    BEFORE UPDATE ON public.notes
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at();
