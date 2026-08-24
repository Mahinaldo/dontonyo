# Integrity Report — Physical Pages 734–738

The tested deterministic transaction was applied to Supabase project `rennotctgrxvbpghbimx`. A bounded, read-only audit query checked only this batch’s source-page range, topic slugs, source-page content entities, fact-verification rows, batch-prefixed flashcards, and corresponding search documents.

| Artifact | Expected | Actual | Result |
|---|---:|---:|---|
| Source-page provenance records | 5 | 5 | Pass |
| Topic boundary records | 5 | 5 | Pass |
| Facts | 0 | 0 | Pass |
| Notes | 0 | 0 | Pass |
| MCQs | 0 | 0 | Pass |
| Fact-verification rows | 0 | 0 | Pass |
| Derived flashcards | 0 | 0 | Pass |
| Derived search documents | 0 | 0 | Pass |

The audit returned no discrepancy. The no-admission result is intentional: source-page provenance is retained while excluded financial, specialized-agency, transport, policy, and current-status material is not transformed into learner-facing content.
