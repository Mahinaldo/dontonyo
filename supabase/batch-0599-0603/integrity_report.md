# Pages 599–603 Integrity Report

## Result

The idempotent transaction for physical source pages **599–603** was successfully applied to the Dontonyo Supabase content database after structured OCR, full ordered visual review, classification, external verification, and a focused contract test.

| Integrity check | Expected | Observed | Result |
|---|---:|---:|---|
| Imported source pages | 5 | 5 | Pass |
| New Europe topics | 4 | 4 | Pass |
| Facts | 38 | 38 | Pass |
| Structured notes | 8 | 8 | Pass |
| Eligible MCQs | 7 | 7 | Pass |
| MCQ options | 28 | 28 | Pass |
| MCQs without exactly four options | 0 | 0 | Pass |
| MCQs without exactly one correct key | 0 | 0 | Pass |
| Verification rows | 53 | 53 | Pass |
| Orphan verification records | 0 | 0 | Pass |
| Derived flashcards | 53 | 53 | Pass |
| Search documents | 53 | 53 | Pass |

## Content and Safety Boundary

The batch retains **38 facts**, **eight bounded notes**, and **seven complete past-exam MCQs**. Five unsafe MCQs were withheld because of materially unclear stems, corrupt or duplicate option sets, inaccurate historical premises, or sensitive Nazi-party wording. The scan’s false Stalin/Mussolini signatory line, false Stalin presidential label, distorted political claims, unclear RSDLP framing, source superlatives, and incomplete Thatcher quotation were withheld rather than corrected into detached learner facts.

Thirteen records have direct corroboration from the Library of Congress, the National Security Archive, or the Berlin Wall Foundation. The remaining records are explicit source-attributed historical references. Political, ideological, military, territorial, and repression material remains historically scoped throughout the import.

## Validation Evidence

The focused `batch0599_0603_import` contract passed all three assertions. The complete project suite passed with **42 test files and 101 tests**, followed by clean `tsc --noEmit` validation.

## Source Artifacts

All 35 ordered overlap-safe review tiles, OCR artifacts, render checksums, classification decisions, external-verification ledger, deterministic generator, generated SQL, audit output, integrity query, and focused contract are retained with this batch.
