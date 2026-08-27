# Integrity Report — Jubayer’s GK Recovery Physical Pages 304–308

The deterministic import completed and its batch-bounded audit observed exactly five reviewed source pages and five page-local provenance topics. Every learner-facing count is zero.

| Entity | Expected | Observed | Status |
|---|---:|---:|---|
| Reviewed source pages | 5 | 5 | Pass |
| Page-local provenance topics | 5 | 5 | Pass |
| Learner facts and notes | 0 / 0 | 0 / 0 | Pass |
| MCQs and options | 0 / 0 | 0 / 0 | Pass |
| Verification rows | 0 | 0 | Pass |
| Flashcards and search documents | 0 / 0 | 0 / 0 | Pass |

The MCQ-options count is correctly bounded through `public.gk_mcq_options o JOIN public.gk_mcqs m ON m.id = o.mcq_id` with `m.source_page BETWEEN 304 AND 308`.
