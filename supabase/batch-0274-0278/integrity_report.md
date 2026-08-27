# Integrity Report — Jubayer’s GK Recovery Physical Pages 274–278

The idempotent import transaction returned `[]`. The bounded Supabase audit observed the required provenance-only state: exactly five reviewed source pages and five page-local topics, while every learner-facing table remains at zero for this batch.

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

The MCQ-options count is deliberately derived through `public.gk_mcq_options o JOIN public.gk_mcqs m ON m.id = o.mcq_id`, with the source-page range bounded on `m.source_page BETWEEN 274 AND 278`. This corrected join does not assume an unsupported direct source-page field on option rows.
