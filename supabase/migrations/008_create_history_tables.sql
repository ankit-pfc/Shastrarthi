CREATE TABLE history_entities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  entity_type TEXT NOT NULL, -- 'empire', 'kingdom', 'temple', 'guru', 'lineage', 'event', 'literature', 'archaeological', 'path', 'school'
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
  relation_type TEXT NOT NULL, -- e.g., 'part_of', 'predecessor', 'successor', 'student_of', 'authored', 'path_root_text', 'path_lineage_member', 'path_school', 'school_founder', 'guru_student_of', 'text_referenced_by_path'
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE history_timelines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  entity_ids UUID[], -- Array of history_entity IDs to include in the timeline
  created_at TIMESTAMPTZ DEFAULT now()
);