# Pages 669–673: import integrity report

The deterministic, idempotent transaction for physical PDF pages **669–673** completed against the configured Supabase project. It preserves five reviewed source-page records and creates bounded historical learning records under the established `europe` chapter.

| Check | Expected | Observed | Result |
|---|---:|---:|---|
| Source-page records | 5 | 5 | Pass |
| Facts | 15 | 15 | Pass |
| Structured notes | 5 | 5 | Pass |
| Admitted MCQs | 0 | 0 | Pass |
| MCQ options | 0 | 0 | Pass |
| Flashcards | 20 | 20 | Pass |
| Search documents | 20 | 20 | Pass |
| Verification records | 20 | 20 | Pass |
| Invalid verification statuses | 0 | 0 | Pass |
| Invalid tag categories | 0 | 0 | Pass |
| Malformed facts | 0 | 0 | Pass |
| Malformed notes | 0 | 0 | Pass |
| Malformed MCQs | 0 | 0 | Pass |

The source review covered **35 ordered overlap-safe tiles**. The batch admits **6 externally verified** records and **14 source-attributed** records with an explicit historical-scope boundary. The printed page-673 answer grid contained **13 readable MCQs**, but none are admitted in this batch: individual independent premise corroboration was incomplete, and several candidates depended on legendary or superlative premises. This is a deliberate quality gate, not an extraction failure.

The batch’s physical-page provenance, image SHA-256 values, OCR transcripts, review reports, canonical hashes, verification status, tags, source-page metadata, flashcards, and search documents are all represented by `approved_content.json`, `batch_audit.json`, `validated_import.sql`, and the database records.
