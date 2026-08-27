# Integrity Report — Jubayer’s GK Recovery Physical Pages 299–303

The deterministic import completed and the bounded audit observed exactly five reviewed source pages and five page-local provenance topics. Every learner-facing count is zero.

| Entity | Expected | Observed | Status |
|---|---:|---:|---|
| Reviewed source pages | 5 | 5 | Pass |
| Page-local provenance topics | 5 | 5 | Pass |
| Learner facts | 0 | 0 | Pass |
| Learner notes | 0 | 0 | Pass |
| MCQs and options | 0 | 0 / 0 | Pass |
| Verification rows | 0 | 0 | Pass |
| Flashcards | 0 | 0 | Pass |
| Search documents | 0 | 0 | Pass |

The MCQ-options count uses `public.gk_mcq_options o JOIN public.gk_mcqs m ON m.id = o.mcq_id`, bounded by `m.source_page BETWEEN 299 AND 303`, rather than presuming a source-page field exists directly on options.
