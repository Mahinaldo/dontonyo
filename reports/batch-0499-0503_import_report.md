# Pages 499–503 Supabase Import Report

## Scope and outcome

This report covers **physical source pages 499–503 only**. The batch was processed through source-grounded vision OCR, ordered five-tile visual review of all five pages, semantic separation, targeted external verification, deterministic SQL generation, focused contract testing, an idempotent Supabase transaction, and integrity audit. No source page beyond 503 was included.

## Integrity results

| Record family | Imported / derived count |
|---|---:|
| Source pages | 5 |
| Status-marked facts | 3 |
| Structured capital-and-currency notes | 15 |
| MCQs | 0 |
| Flashcards | 18 |
| Search documents | 18 |
| Fact verifications | 18 |
| Tag assignments | 51 |

The integrity query returned the same counts. The regional tables were intentionally stored as structured, source-preserved notes rather than expanded into hundreds of independently asserted current facts.

## Verification outcomes

| Item | Status | Handling |
|---|---|---|
| Nusantara source note (page 499) | `verified` | The source’s **proposed capital** wording is retained and linked to U.S. International Trade Administration material describing construction and phased relocation. |
| South Africa’s three capital roles (page 502) | `verified` | Directly corroborated against the Government of South Africa; the source’s Cape Town role wording remains verbatim. |
| Israel–Tel Aviv–Shekel source table row (page 500) | `conflicting` | An official Israeli MFA statement identifies Jerusalem as the capital and seat of government. The source row is retained without silent replacement and tagged as conflicting / low confidence. |
| Other capital-and-currency rows | `source_attributed` | Retained in the reviewed structured source tables, with provenance and future-review capability. |

## Transaction repair record

The initial transaction was rejected before commit by a typed-topic SQL mismatch, then the corrected retry was rejected before commit by an invalid tag-category value. Both errors occurred within an explicit transaction and thus produced no partial batch records. The generator and its focused contract test were corrected for numeric casts and allowed taxonomy categories; the final transaction committed successfully.

## Source-preservation decisions

| Source item | Handling |
|---|---|
| Physical pages 499–503 / printed footers 442–446 | Stored separately in review metadata; no page number was silently normalized. |
| Page 501 footer `888` | Preserved as a visible source artifact separate from physical page 501. |
| Page 502 footer | Corrected from initial OCR `885` to visually reviewed **445**. |
| Indonesia and South Africa capital-role wording | Retained as source text even where direct authorities use more current or different role language. |
| Israel table row | Retained source text with explicit external-conflict status. |

## Updated Supabase totals

| Record family | Total after import |
|---|---:|
| Source pages | 251 |
| Chapters | 50 |
| Topics | 52 |
| Facts | 3,138 |
| Notes | 212 |
| MCQs | 253 |
| MCQ options | 1,012 |
| Flashcards | 3,489 |
| Search documents | 3,648 |
| Tag assignments | 1,621 |
| Fact verifications | 646 |

## Validation evidence

The focused contract test passed before generation and again after the typed SQL/taxonomy repair. The next batch-close check is the full Vitest suite and TypeScript validation before the required checkpoint.
