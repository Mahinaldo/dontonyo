# Integrity Report — Jubayer’s GK Recovery Physical Pages 264–268

The generated idempotent import transaction returned `[]`. The subsequent bounded Supabase audit observed the required provenance-only result: exactly five source pages and five page-local topics, with no learner-facing records admitted.

| Entity | Expected | Observed | Status |
|---|---:|---:|---|
| Reviewed source pages | 5 | 5 | Pass |
| Page-local provenance topics | 5 | 5 | Pass |
| Learner facts | 0 | 0 | Pass |
| Learner notes | 0 | 0 | Pass |
| MCQs | 0 | 0 | Pass |
| MCQ options | 0 | 0 | Pass |
| Verification rows | 0 | 0 | Pass |
| Flashcards | 0 | 0 | Pass |
| Search documents | 0 | 0 | Pass |

The MCQ-options audit uses the corrected relationship join, `public.gk_mcq_options o JOIN public.gk_mcqs m ON m.id = o.mcq_id`, and bounds the count on `m.source_page BETWEEN 264 AND 268`. This avoids an invalid direct source-page assumption on the options table.
