# Integrity Report — Jubayer’s GK Recovery Physical Pages 284–288

The idempotent import transaction returned `[]`. The bounded Supabase audit observed five reviewed source pages and five page-local topics, while all learner-facing tables remain at zero for this provenance-only batch.

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

The MCQ-options count uses the corrected relationship join, `public.gk_mcq_options o JOIN public.gk_mcqs m ON m.id = o.mcq_id`, bounded through `m.source_page BETWEEN 284 AND 288`. It does not assume a direct source-page column on option rows.
