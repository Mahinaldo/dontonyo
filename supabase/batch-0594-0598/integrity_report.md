# Pages 594–598 Integrity Report

## Result

The idempotent transaction for physical source pages **594–598** was successfully applied to the Dontonyo Supabase content database after full OCR, ordered visual review, classification, external-verification, and focused-contract gates passed.

| Integrity check | Expected | Observed | Result |
|---|---:|---:|---|
| Imported source pages | 5 | 5 | Pass |
| New Europe topics | 3 | 3 | Pass |
| Facts | 41 | 41 | Pass |
| Structured notes | 9 | 9 | Pass |
| Eligible MCQs | 8 | 8 | Pass |
| MCQ options | 32 | 32 | Pass |
| MCQs without exactly four options | 0 | 0 | Pass |
| MCQs without exactly one correct key | 0 | 0 | Pass |
| Verification rows | 58 | 58 | Pass |
| Orphan verification records | 0 | 0 | Pass |
| Derived flashcards | 58 | 58 | Pass |
| Search documents | 58 | 58 | Pass |

## Content and Safety Boundary

The batch retains **41 facts**, **nine bounded notes**, and **eight complete past-exam MCQs**. Four corrupted or materially unclear MCQs were withheld. The source’s distorted philosophy claims, dated German institutional assertions, false or overbroad superlatives, and Nazi ideological slogans were withheld rather than reconstructed, silently corrected, or normalized as study facts.

Three directly corroborated records cover Waterloo, Hitler’s 1933 chancellorship, and the Nazi Party’s historically contextualized identity. The remaining content is explicitly marked as source-attributed or historically scoped. The Berlin Wall, Bismarck, and Nazi-era material retains its period context; it does not assert source-era political wording as a present-day fact.

## Validation Evidence

The focused `batch0594_0598_import` contract passed all three assertions. The complete project suite passed with **41 test files and 98 tests**, followed by clean `tsc --noEmit` validation.

## Source Artifacts

All 35 ordered overlap-safe visual-review tiles, OCR artifacts, render checksums, classification decisions, external-verification ledger, deterministic generator, generated SQL, audit report, integrity query, and focused contract are retained with the batch.
