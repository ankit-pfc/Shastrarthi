CREATE TABLE IF NOT EXISTS extract_datasets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    data JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_extract_datasets_user_created_at ON extract_datasets(user_id, created_at DESC);

ALTER TABLE extract_datasets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own extract datasets" ON extract_datasets
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own extract datasets" ON extract_datasets
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own extract datasets" ON extract_datasets
    FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own extract datasets" ON extract_datasets
    FOR DELETE USING (auth.uid() = user_id);

CREATE TRIGGER update_extract_datasets_updated_at
    BEFORE UPDATE ON extract_datasets
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at();
