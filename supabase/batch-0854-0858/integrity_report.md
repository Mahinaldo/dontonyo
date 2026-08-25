# Bounded Integrity Report — Physical Pages 854–858

The idempotent selective import completed against the configured Jubayer’s GK Supabase project. The bounded audit covers physical source pages 854–858, the exact five page-local topic slugs, the approved artwork-attribution facts, and all learner-facing derived tables in scope.

| Audit target | Expected | Observed | Result |
|---|---:|---:|---|
| Source pages | 5 | 5 | Pass |
| Page-local topics | 5 | 5 | Pass |
| Verified facts | 3 | 3 | Pass |
| Notes | 0 | 0 | Pass |
| MCQs | 0 | 0 | Pass |
| MCQ options | 0 | 0 | Pass |
| Fact verifications | 3 | 3 | Pass |
| Source-derived flashcards | 3 | 3 | Pass |
| Fact-backed search documents | 3 | 3 | Pass |

The audit joins `public.gk_mcq_options` through `public.gk_mcqs`, and joins search documents to their fact sources. The results match the selective-admission manifest exactly.
