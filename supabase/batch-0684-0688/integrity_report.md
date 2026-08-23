# Pages 684–688 Import Integrity Report

The idempotent transaction for physical PDF pages **684–688** completed successfully. The bounded Supabase read below was run after the transaction and matches the generated-content contract.

| Metric | Expected | Actual | Result |
|---|---:|---:|---|
| Source pages | 5 | 5 | Pass |
| Approved facts | 7 | 7 | Pass |
| Scope-boundary notes | 5 | 5 | Pass |
| Source-keyed MCQs | 4 | 4 | Pass |
| MCQ options | 16 | 16 | Pass |
| Derived flashcards | 16 | 16 | Pass |
| Search documents | 16 | 16 | Pass |
| Fact verifications | 16 | 16 | Pass |
| Invalid verification statuses | 0 | 0 | Pass |
| Invalid tag categories | 0 | 0 | Pass |
| Malformed facts | 0 | 0 | Pass |
| Malformed notes | 0 | 0 | Pass |
| Malformed MCQs | 0 | 0 | Pass |

The source review covered **35 ordered overlap-safe tiles**. Of 14 readable past-exam questions on page 685, **4** met the full readability, four-option, printed-key, source-label, and safe-premise requirements; **10** were deliberately withheld. Page 688’s arms-control material is retained only as a source-attributed scope-boundary note.

All records use the batch-isolated `batch0684-0688:` derived keys, physical source-page provenance, allowed tag categories, and accepted verification statuses.
