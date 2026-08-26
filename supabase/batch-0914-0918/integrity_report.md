# Bounded Integrity Report — Jubayer’s GK Physical Pages 914–918

The idempotent import transaction was executed against Supabase project `rennotctgrxvbpghbimx`. The following bounded audit was then run against **only** physical source pages 914–918 and the five exact page-local source-boundary slugs. The MCQ-option count is correctly bounded through `public.gk_mcq_options` joined to `public.gk_mcqs`.

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

The observed counts match the provenance-only classification. No learner-facing or verification records were inserted to fill the database artificially.
