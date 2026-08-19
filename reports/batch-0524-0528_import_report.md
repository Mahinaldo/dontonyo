# Pages 524–528 Import Report

## Batch outcome

Physical PDF pages **524–528** were OCRed with the recovered documented GPT vision workflow, reconciled against all **25 ordered dense-image tiles**, verified where claims were well-bounded, and committed to Supabase through an idempotent transaction. The visible book footers **467–471** are preserved separately from physical PDF-page identifiers.

| Record type | Imported count |
| --- | ---: |
| Source pages | 5 |
| Facts | 45 |
| Structured notes/tables | 3 |
| Past-exam MCQs | 14 |
| MCQ options | 56 |
| Flashcards | 62 |
| Search documents | 62 |
| Verification rows | 62 |
| Tag assignments | 203 |

## Quality and verification handling

The pages preserve scanned Bangla wording, answer keys, question numbers, and original examination labels. Page 524 retains unresolved printed cells—including `শিবকন`, `ভোকা`, `ইয়াসিকিয়াং`, and `তুর্কিস্তান`—instead of substituting guessed place names. Page 525 retains visually unclear options under low confidence. Page 526’s 44-state Asia taxonomy, regional groupings, and Palestine note are stored as time-sensitive, source-era reference material.

Two bounded claims received direct corroboration. The United Nations reported that India was projected to overtake China as the world’s most populous country in April 2023.[1] The Borneo Project describes Borneo as divided among Malaysia, Indonesia, and Brunei, and describes Indonesian Borneo as Kalimantan.[2] All other Asia geography, demographic, constitutional, and political-reference claims remain explicitly **source_attributed**; no unreviewed OCR artifacts after the Macau entry were imported.

## Integrity and validation

The post-import integrity audit returned exactly **5 source pages, 45 facts, 3 notes, 14 MCQs, 56 options, 62 flashcards, 62 search documents, 62 verification rows, and 203 tag assignments**. Full validation passed with **20 Vitest files and 39 tests**, followed by a successful TypeScript check.

| Supabase total after import | Count |
| --- | ---: |
| Source pages | 276 |
| Chapters | 62 |
| Topics | 76 |
| Facts | 3,209 |
| Notes | 237 |
| MCQs | 361 |
| MCQ options | 1,444 |
| Flashcards | 3,693 |
| Search documents | 3,852 |
| Tag assignments | 2,347 |
| Fact verifications | 850 |

## Audit artifacts

The OCR audit is in `/home/ubuntu/dontonyo-work/batch-0524-0528/audit.json`. Tile reconciliation is documented in `reports/batch-0524-0528_visual_review.md`; evidence statuses are in `reports/batch-0524-0528_external_verification.md`; and the idempotent SQL transaction with integrity and totals requests is in `supabase/batch-0524-0528/`.

## References

[1]: https://www.un.org/en/desa/india-overtake-china-world-most-populous-country-april-2023-united-nations-projects "United Nations — India to overtake China as world’s most populous country"
[2]: https://borneoproject.org/borneo-2/ "The Borneo Project — About Borneo"
