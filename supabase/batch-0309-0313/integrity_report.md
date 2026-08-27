# Bounded Integrity Report — Physical Pages 309–313

The deterministic import was followed by a page-scoped audit against the configured Supabase project. The audit is bounded to the physical source-page range 309–313, the five exact topic slugs, and the related MCQ-option and search-document joins.

| Audited record class | Expected | Observed | Result |
|---|---:|---:|---|
| Reviewed source pages | 5 | 5 | Pass |
| Page-local topics | 5 | 5 | Pass |
| Learner-facing facts | 0 | 0 | Pass |
| Learner-facing notes | 0 | 0 | Pass |
| MCQs | 0 | 0 | Pass |
| MCQ options, joined through page-scoped MCQs | 0 | 0 | Pass |
| Fact-verification rows | 0 | 0 | Pass |
| Flashcards under batch source key | 0 | 0 | Pass |
| Search documents joined to page-scoped facts | 0 | 0 | Pass |

> **Integrity decision:** The observed result matches the provenance-only contract. Pages 309–313 contributed reviewed source provenance and topic boundaries only; no learner-facing content was admitted.

The query used for this result is preserved in `integrity_query_request.json`. The raw tool result was captured outside the versioned package as a transient audit trace.
