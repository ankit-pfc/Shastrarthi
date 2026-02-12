DROP TABLE IF EXISTS history_timelines CASCADE;
DROP TABLE IF EXISTS history_relations CASCADE;
DROP TABLE IF EXISTS history_entities CASCADE;

CREATE TABLE history_entities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  entity_type TEXT NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT,
  summary TEXT,
  content_md TEXT,
  period_label TEXT,
  period_start_year INT,
  period_end_year INT,
  geography TEXT,
  tags TEXT[],
  evidence_sources TEXT[],
  featured_image_url TEXT,
  meta_description TEXT,
  keywords TEXT[],
  is_published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE history_relations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_entity_id UUID REFERENCES history_entities(id) ON DELETE CASCADE,
  to_entity_id UUID REFERENCES history_entities(id) ON DELETE CASCADE,
  relation_type TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE history_timelines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  entity_ids UUID[],
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_history_entities_slug ON history_entities(slug);
CREATE INDEX idx_history_entities_entity_type ON history_entities(entity_type);
CREATE INDEX idx_history_relations_from_entity_id ON history_relations(from_entity_id);
CREATE INDEX idx_history_relations_to_entity_id ON history_relations(to_entity_id);
CREATE INDEX idx_history_timelines_slug ON history_timelines(slug);

ALTER TABLE history_entities ENABLE ROW LEVEL SECURITY;
ALTER TABLE history_relations ENABLE ROW LEVEL SECURITY;
ALTER TABLE history_timelines ENABLE ROW LEVEL SECURITY;

-- Policies for history_entities
CREATE POLICY "Public history_entities are viewable by everyone." ON history_entities
  FOR SELECT USING (is_published = TRUE);

CREATE POLICY "Users can create history_entities." ON history_entities
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update their own history_entities." ON history_entities
  FOR UPDATE USING (auth.uid() = (SELECT user_id FROM profiles WHERE id = auth.uid()));

CREATE POLICY "Users can delete their own history_entities." ON history_entities
  FOR DELETE USING (auth.uid() = (SELECT user_id FROM profiles WHERE id = auth.uid()));

-- Policies for history_relations
CREATE POLICY "Public history_relations are viewable by everyone." ON history_relations
  FOR SELECT USING (TRUE); -- Assuming relations are public if entities are public

CREATE POLICY "Users can create history_relations." ON history_relations
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update their own history_relations." ON history_relations
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Users can delete their own history_relations." ON history_relations
  FOR DELETE USING (auth.role() = 'authenticated');

-- Policies for history_timelines
CREATE POLICY "Public history_timelines are viewable by everyone." ON history_timelines
  FOR SELECT USING (TRUE); -- Assuming timelines are public

CREATE POLICY "Users can create history_timelines." ON history_timelines
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update their own history_timelines." ON history_timelines
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Users can delete their own history_timelines." ON history_timelines
  FOR DELETE USING (auth.role() = 'authenticated');
