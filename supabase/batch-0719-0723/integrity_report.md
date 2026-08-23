# Integrity Report — Physical Pages 719–723

The tested deterministic transaction was applied to Supabase project `rennotctgrxvbpghbimx`. A bounded, read-only audit query then checked only this batch’s page range, canonical titles, source-question pairs, verification status, derived-record key prefix, and corresponding search entities.

| Artifact | Expected | Actual | Result |
|---|---:|---:|---|
| Source-page provenance records | 5 | 5 | Pass |
| Topic records | 5 | 5 | Pass |
| Verified facts | 3 | 3 | Pass |
| Verified source-keyed MCQs | 2 | 2 | Pass |
| MCQ options | 8 | 8 | Pass |
| Verified fact-verification rows | 5 | 5 | Pass |
| Derived flashcards | 5 | 5 | Pass |
| Derived search documents | 5 | 5 | Pass |

The audit returned no count discrepancy. The source transaction remains idempotent through canonical hashes, unique source-page checks, unique MCQ-option checks, unique verification checks, and batch-prefixed derived-record keys.
