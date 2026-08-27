# Bounded Integrity Report — Jubayer’s GK Recovery Physical Pages 254–258

The idempotent recovery import transaction was executed against Supabase project `rennotctgrxvbpghbimx`. The bounded audit queried **only** physical source pages 254–258 and their five exact page-local provenance-topic slugs. The MCQ-option count is bounded through `public.gk_mcq_options o` joined to `public.gk_mcqs m ON m.id=o.mcq_id`.

| Record category | Expected | Observed | Status |
|---|---:|---:|---|
| Source pages | 5 | 5 | Pass |
| Source-boundary topics | 5 | 5 | Pass |
| Learner-facing facts | 0 | 0 | Pass |
| Learner-facing notes | 0 | 0 | Pass |
| Learner-facing MCQs | 0 | 0 | Pass |
| MCQ options | 0 | 0 | Pass |
| Fact verifications | 0 | 0 | Pass |
| Flashcards | 0 | 0 | Pass |
| Search documents | 0 | 0 | Pass |

The observed counts match the provenance-only classification. No learner-facing or verification records were inserted from legal, political, national, constitutional, diplomatic, military/security, historical, cultural, literary, recognition, memorial/death, answer-key, named-person, source-imprecise, or date-sensitive material.
