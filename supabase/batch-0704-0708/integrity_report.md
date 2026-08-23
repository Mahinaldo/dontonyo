# Integrity Report — Validated GK Pages 704–708

The deterministic import was applied to Supabase after the focused contract test passed. A bounded database audit returned the following actual counts. All expected records are present, no source-attributed note was generated, and the derived records use only the `batch0704-0708` key namespace.

| Record type | Expected | Actual | Result |
|---|---:|---:|---|
| Physical source pages | 5 | 5 | Match |
| Verified facts | 5 | 5 | Match |
| Source-attributed notes | 0 | 0 | Match |
| Approved MCQs | 5 | 5 | Match |
| MCQ options | 20 | 20 | Match |
| MCQ source labels | 5 | 5 | Match |
| Fact-verification rows | 10 | 10 | Match |
| Derived flashcards | 10 | 10 | Match |
| Derived search documents | 10 | 10 | Match |
| Content-tag assignments | 45 | 45 | Match |

The **45** tag assignments reconcile to 15 fact assignments (domain, verification quality, historic scope) and 30 MCQ assignments (those three shared tags plus past-exam, answer-key, and printed-exam-source tags). Each admitted record is externally verified; all organization-table and related past-question content on pages 705–708 remains withheld under the documented conflict, territorial, extremist, political, religious, current-status, and security-sensitive boundaries.

The import remains idempotent through canonical hashes, conditional source-page and derived-record insertion, and conflict-safe MCQ/fact upserts. The bounded integrity query is retained in `integrity_query_request.json`.
