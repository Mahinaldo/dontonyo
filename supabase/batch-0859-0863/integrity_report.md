# Bounded Integrity Report — Physical Pages 859–863

The idempotent provenance import completed against the configured Jubayer’s GK Supabase project. The bounded audit covered source pages 859–863, the exact five page-local topic slugs, and every learner-facing table in scope.

| Audit target | Expected | Observed | Result |
|---|---:|---:|---|
| Source pages | 5 | 5 | Pass |
| Page-local topics | 5 | 5 | Pass |
| Facts | 0 | 0 | Pass |
| Notes | 0 | 0 | Pass |
| MCQs | 0 | 0 | Pass |
| MCQ options | 0 | 0 | Pass |
| Fact verifications | 0 | 0 | Pass |
| Flashcards | 0 | 0 | Pass |
| Search documents | 0 | 0 | Pass |

The audit joins `public.gk_mcq_options` through `public.gk_mcqs`, and joins fact-backed search documents through `public.gk_facts`. Results match the conservative provenance-only policy exactly.
