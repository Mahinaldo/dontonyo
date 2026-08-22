# Integrity Report — Pages 619–623

The idempotent transaction for **Jubayer’s GK** pages 619–623 was applied to Supabase after all 35 ordered source tiles, upright local OCR, answer-grid crops, classification decisions, source-status verification, and focused import-contract tests were completed. A first transaction attempt rolled back atomically because MCQ topic mapping was empty; the generator was corrected, regenerated, re-tested, and then applied successfully.

| Check | Result |
|---|---:|
| Physical source pages | 5 |
| Approved facts | 24 |
| Structured source notes | 5 |
| Printed-key-confirmed MCQs | 17 |
| MCQ options | 68 |
| Verification records | 46 |
| Derived flashcards | 46 |
| Search documents | 46 |
| MCQs without exactly four options and one correct option | 0 |
| Invalid verification statuses | 0 |
| Orphan batch tag assignments | 0 |
| Invalid batch tag categories | 0 |

The 17 accepted MCQs cover page 619 questions 01–03 and 06–12, plus page 623 questions 02, 03, 06–09, and 11. All have four options and exactly one source-printed correct key. The batch records **39 verified** and **7 source-attributed** entities; no conflicting, unverified, or rejected entity was inserted. The unsafe source material documented in the classification ledger—including inaccurate or overbroad political/colonial premises, unsupported epithets, rankings, current institutional claims, and inconsistent MCQ keys—was withheld.

The focused `batch0619_0623_import` Vitest contract passed after regeneration. Full application tests and TypeScript validation remain required before the checkpoint.
