-- Adds auditability for source-preserving OCR review, semantic tags, and
-- external fact verification. These tables are intentionally server-managed.

ALTER TABLE public.source_pages
  ADD COLUMN IF NOT EXISTS review_metadata jsonb NOT NULL DEFAULT '{}'::jsonb;

CREATE TABLE IF NOT EXISTS public.content_tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  label text NOT NULL,
  category text NOT NULL CHECK (category IN ('domain', 'content_type', 'theme', 'exam_source', 'quality')),
  description text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.content_tag_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tag_id uuid NOT NULL REFERENCES public.content_tags(id) ON DELETE CASCADE,
  entity_type text NOT NULL CHECK (entity_type IN ('source_page', 'note', 'fact', 'mcq', 'flashcard')),
  entity_id uuid NOT NULL,
  source_page integer NOT NULL,
  confidence confidence_level NOT NULL DEFAULT 'medium',
  assigned_by text NOT NULL DEFAULT 'quality_pipeline',
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tag_id, entity_type, entity_id)
);

CREATE TABLE IF NOT EXISTS public.fact_verifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_page integer NOT NULL,
  entity_type text NOT NULL CHECK (entity_type IN ('source_page', 'note', 'fact', 'mcq')),
  entity_id uuid,
  claim_text text NOT NULL,
  normalized_claim text,
  verification_status text NOT NULL CHECK (verification_status IN ('verified', 'source_attributed', 'conflicting', 'unverified', 'rejected')),
  confidence confidence_level NOT NULL DEFAULT 'medium',
  verification_sources jsonb NOT NULL DEFAULT '[]'::jsonb,
  audit_note text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS content_tag_assignments_source_page_idx
  ON public.content_tag_assignments(source_page);
CREATE INDEX IF NOT EXISTS content_tag_assignments_entity_idx
  ON public.content_tag_assignments(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS fact_verifications_source_page_idx
  ON public.fact_verifications(source_page);

ALTER TABLE public.content_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_tag_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fact_verifications ENABLE ROW LEVEL SECURITY;
