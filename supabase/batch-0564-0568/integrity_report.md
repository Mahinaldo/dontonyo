# Pages 564–568 — Supabase Import Integrity Report

## Transaction outcome

The quality-gated transaction for physical source pages **564–568** committed successfully to Supabase project `rennotctgrxvbpghbimx`. An initial transaction attempt was rolled back in full after the database correctly rejected a new China chapter with a missing required `chapter_number`. The deterministic generator was repaired to derive the next chapter number from the existing book sequence, regenerated, recontracted, and reapplied. No partial records from the failed attempt were retained.

| Surface | Expected | Confirmed after commit |
| --- | ---: | ---: |
| Source pages | 5 | 5 |
| New verified facts | 12 | 12 |
| Caveated structured notes | 5 | 5 |
| Eligible MCQs | 10 | 10 |
| MCQ options | 40 | 40 |
| Flashcards | 27 | 27 |
| Search documents | 27 | 27 |
| Verification records | 27 | 27 |

The imported MCQ keys are `565:01–04, 565:06, 566:01–03, 567:01–02`. Every imported MCQ has four options and exactly one correct option. The relational malformed-MCQ check returned **0**.

## Integrity checks

| Check | Result |
| --- | --- |
| Missing verification rows for facts, notes, or MCQs | 0 |
| Missing search documents for facts, notes, or MCQs | 0 |
| China entities missing the `asia` domain tag | 0 |
| China entities incorrectly carrying the `west-asia` domain tag | 0 |
| Source-page scope outside 564–568 in generated batch records | 0 |
| Duplicate topic creation for `middle-east-country-profiles` | 0; existing chapter reused |
| New China chapter number | 70; derived from existing maximum 69 |

## Quality decisions

All five pages were rendered at 300 DPI, processed with `gpt-5-mini`, and checked through **35 ordered overlap-safe source tiles**. The importer is restricted to pipeline version `vision-quality-gated-batch-0564-0568-v1` and uses canonical hashes and stable derived-record keys for idempotence.

> Page 564’s source-scale review confirms **29 October 1923** for the Turkish-republic date; a stale OCR reading of 23 October was excluded. The source’s caliphate-abolition wording was preserved only in a conflict-caveated note because the corroborated chronology differs.

The following scanned questions were intentionally withheld: page 565 Q05 because an option is low confidence; page 566 Q04 because its religious/political premise and option/key structure are unsafe; and page 567 Q03 because it relies on a time-sensitive institutional premise. Golan, political, religious, security, diplomatic, demographic, ranking, officeholder, and changing-superlative wording remains source-attributed rather than being normalized into current neutral facts.

## Validation status

The focused contract test for this batch passed after regeneration. The project-wide test suite and TypeScript validation are run next, before checkpointing and GitHub synchronization.
