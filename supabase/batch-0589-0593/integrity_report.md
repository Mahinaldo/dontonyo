# Pages 589–593 Integrity Report

## Result

The idempotent transaction for physical source pages **589–593** was applied successfully to the Dontonyo Supabase content database after the full OCR, ordered visual review, classification, external-verification, and focused-contract gates passed.

| Integrity check | Expected | Observed | Result |
|---|---:|---:|---|
| Imported source pages | 5 | 5 | Pass |
| New Europe topics | 3 | 3 | Pass |
| Facts | 14 | 14 | Pass |
| Structured notes | 5 | 5 | Pass |
| Eligible MCQs | 18 | 18 | Pass |
| MCQ options | 72 | 72 | Pass |
| MCQs without exactly four options | 0 | 0 | Pass |
| MCQs without exactly one correct key | 0 | 0 | Pass |
| Verification rows | 37 | 37 | Pass |
| Orphan verification records | 0 | 0 | Pass |
| Derived flashcards | 37 | 37 | Pass |
| Search documents | 37 | 37 | Pass |

## Content Boundary

The batch retains 14 facts, five caveated notes, and 18 complete past-exam MCQs. Ten unsafe MCQs were withheld because their options, answer keys, premises, or time-sensitive institutional claims could not be retained safely. The audit preserves 12 directly corroborated records, one explicit conflict note, and 24 source-attributed records.

The scan’s unsupported Open University superlative, France-reference distortions, Eiffel Tower financing assertion, false Robespierre execution date, and Jacobin-founder assertion were withheld rather than silently corrected or replaced. Political, institutional, constitutional, cultural-label, and historical-periodization language remains explicitly scoped in the content and verification ledgers.

## Validation Evidence

The focused `batch0589_0593_import` contract passed all three assertions. The full project suite passed with **40 test files and 95 tests**, followed by clean `tsc --noEmit` validation.

## Source Artifacts

All OCR artifacts, render checksums, the 35-tile visual-review attestation, classification decisions, external-verification ledger, generated SQL, audit report, and deterministic generator are retained with this batch.
