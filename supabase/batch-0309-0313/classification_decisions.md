# Classification Decisions — Physical Pages 309–313

## Review basis

This batch was rendered directly from the immutable source PDF at 300 DPI. Every page measured 5,296 × 7,500 pixels and was reviewed via seven manifest-ordered, vertical, overlap-safe tiles, for 35 viewed tiles total. Local `tesseract -l ben+eng --psm 6` output was used only as a secondary transcript and reconciled against the visual ledger; imagery controlled whenever OCR was truncated, distorted, or inconsistent.

| Physical page | Reviewed source material | Classification decision | Reason for withholding learner-facing content |
|---:|---|---|---|
| 309 | Bangladesh education and local-government/medical/university prior-question MCQs, choices, and answer key. | **Provenance only** | Questions, options, answer-key mappings, named institutions, dates, and numerical/policy claims require source attribution and authoritative verification before any learner-facing use. |
| 310 | Illustrated chronological narrative concerning the establishment of the University of Dhaka. | **Provenance only** | Historical events, dates, named people, commissions, appointments, and institutional history are source claims requiring authoritative corroboration. |
| 311 | Nathan Commission facts, a source-internal correction about member count, establishment-era individuals, and officeholder list. | **Provenance only** | The source itself flags a conflicting market-book claim. Names, dates, titles, affiliations, and conflict-sensitive history must not be normalized or admitted without an authoritative resolution. |
| 312 | University establishment-time counts, “Oxford of the East” description, and biographies of early female students/teachers. | **Provenance only** | Historical numerical, institutional, educational, biographical, travel, literary-attribution, and officeholder claims require authoritative verification. |
| 313 | DUCSU history and officeholders, convocation chronology including a source correction note, and University of Dhaka monogram/slogan history. | **Provenance only** | Institutional branding/current-status, historical dates, named people, political-history references, and emblem chronology require official and authoritative verification. |

> **Zero-admission decision.** No source statement in this batch clears the combined image-grounded extraction, semantic classification, source-note, policy-sensitivity, and authority-verification gates required for learner-facing content.

Accordingly, the deterministic import may create only the five reviewed `source_pages`, five page-local `topics`, reusable provenance/domain tags, and the associated `import_run`. It must create **zero** facts, notes, MCQs, MCQ options, flashcards, search documents, or verification rows. The review ledger retains source wording and uncertainty without silent correction.
