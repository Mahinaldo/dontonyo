# Integrity Report — Validated GK Pages 709–713

The deterministic import was applied to Supabase after its focused contract test passed. The bounded database audit matches the approved single-fact import contract exactly.

| Record type | Expected | Actual | Result |
|---|---:|---:|---|
| Physical source pages | 5 | 5 | Match |
| Verified facts | 1 | 1 | Match |
| Source-attributed notes | 0 | 0 | Match |
| Approved MCQs | 0 | 0 | Match |
| MCQ options | 0 | 0 | Match |
| Fact-verification rows | 1 | 1 | Match |
| Derived flashcards | 1 | 1 | Match |
| Derived search documents | 1 | 1 | Match |
| Content-tag assignments | 3 | 3 | Match |

The three tag assignments are the domain, external-verification quality, and historic-scope tags for the Black Tuesday fact. All intelligence, security, war, treaty, territorial, political, religious, current-status, causal, and source-imprecise claims from the reviewed five pages remain withheld. The generated import is idempotent through canonical hashes and batch-prefixed derived-record keys; the bounded audit query is retained in `integrity_query_request.json`.
