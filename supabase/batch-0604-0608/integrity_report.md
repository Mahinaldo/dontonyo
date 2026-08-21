# Pages 604–608 Import Integrity Report

## Transaction outcome

The idempotent transaction completed successfully in Supabase project `rennotctgrxvbpghbimx`. It imports only the five physical source pages and the classification-ledger-approved records.

| Check | Expected | Observed | Result |
|---|---:|---:|---|
| Source pages | 5 | 5 | Pass |
| Facts | 18 | 18 | Pass |
| Structured notes | 6 | 6 | Pass |
| MCQs | 12 | 12 | Pass |
| MCQ options | 48 | 48 | Pass |
| Verification rows | 36 | 36 | Pass |
| Derived flashcards | 36 | 36 | Pass |
| Derived search documents | 36 | 36 | Pass |

## MCQ relational integrity

All twelve imported MCQs return exactly four option rows and exactly one `is_correct=true` option. The committed questions are page-604 Q02, Q03, Q04, Q06, Q08–Q12 and page-607 Q02, Q06, Q07. No incomplete, quotation-only, ambiguous, or historically inconsistent source question was inserted.

| Verification status | Records | Result |
|---|---:|---|
| `verified` | 24 | Direct external corroboration recorded. |
| `source_attributed` | 12 | Preserved with explicit source/historic scope. |
| `conflicting` | 0 | No conflicting record was imported. |
| Invalid status `conflicting_source` | 0 | Pass — forbidden status absent. |

## Quality boundary

The sideways scan on page 604 was recovered with a counterclockwise rotated source copy and a high-fidelity retry. Page 605 was similarly recovered. Pages 607–608 used local Bangla OCR cross-checked against rotated scans after the available vision-model credits were exhausted; only mutually supported text was considered. Page 606’s quotation panel and the unreadable Turkey panel were audited but intentionally not converted into neutral learner content.

The batch withholds page-604 Q01/Q05/Q07; page-607 Q01/Q03/Q04/Q05; the source’s time-sensitive CIS membership lines; Greece’s compressed chronology and unsupported priority claims; and Italy’s inaccurate, mythic, informal, or overly broad claims. The detailed source, classification, and verification rationales are retained in the companion ledger files.

## Validation evidence

The focused import contract passed. The full regression suite passed with **43 test files and 104 tests**, and TypeScript validation completed with `tsc --noEmit`.
