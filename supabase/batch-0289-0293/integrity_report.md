# Integrity Report — Jubayer’s GK Recovery Physical Pages 289–293

The deterministic idempotent import returned `[]`. The bounded post-import audit confirms that this batch admitted exactly five reviewed source pages and five page-local provenance topics, with no learner-facing content.

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

The MCQ-options count uses the corrected relationship join, `public.gk_mcq_options o JOIN public.gk_mcqs m ON m.id = o.mcq_id`, and is bounded by `m.source_page BETWEEN 289 AND 293`. It does not presume a direct source-page column on options.
