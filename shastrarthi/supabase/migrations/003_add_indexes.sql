CREATE INDEX IF NOT EXISTS idx_texts_slug ON texts(slug);
CREATE INDEX IF NOT EXISTS idx_texts_category ON texts(category);
CREATE INDEX IF NOT EXISTS idx_texts_difficulty ON texts(difficulty);
CREATE INDEX IF NOT EXISTS idx_texts_created_at ON texts(created_at DESC);
