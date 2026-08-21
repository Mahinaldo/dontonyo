# Pages 584–588 Integrity Report

## Result

The idempotent import transaction for physical source pages **584–588** was applied to the Dontonyo content database on 2026-08-21 after the focused contract test passed. The initial transaction attempt was fully rolled back by PostgreSQL because the import ledger label `conflicting_source` did not match the database’s constrained verification-status vocabulary. The generator was repaired to map that ledger label to the permitted database value `conflicting` while retaining the explicit conflict audit note, then regenerated and re-tested before the successful apply.

| Integrity check | Expected | Observed | Result |
|---|---:|---:|---|
| Imported source pages | 5 | 5 | Pass |
| New Europe topics | 3 | 3 | Pass |
| Facts | 12 | 12 | Pass |
| Notes | 8 | 8 | Pass |
| MCQs | 0 | 0 | Pass |
| Fact and note verification rows | 20 | 20 | Pass |
| Derived flashcards | 20 | 20 | Pass |
| Search documents | 20 | 20 | Pass |
| Orphan verification records | 0 | 0 | Pass |

## Verification Boundary

The batch includes **10 verified**, **1 conflicting**, and **9 source-attributed** records. Pages 584–588 are UK reference material rather than a source-complete MCQ block, so no MCQ, option, or answer record was inferred or manufactured.

The stored conflict covers the scan’s unsupported characterization of Winston Churchill’s 1953 Nobel Prize rationale. It is retained only as a caveated source note with its conflict documented in the batch ledger.

## Validation Evidence

The focused `batch0584_0588_import` contract suite passed all 3 assertions after the repair. The complete project validation passed: **39 test files, 92 tests**, followed by clean `tsc --noEmit` validation.

## Source Artifacts

The batch audit, deterministic generator, SQL transaction, classification ledger, external-verification ledger, OCR artifacts, and review attestation are retained with the batch. All 35 ordered overlap-safe visual-review tiles were attested before import.
