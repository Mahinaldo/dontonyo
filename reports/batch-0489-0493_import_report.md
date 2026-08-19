# Pages 489–493 Supabase Import Report

## Scope and quality gates

This completed import is restricted to physical source pages **489–493** of *Jubayer’s GK*. Each page was processed through reviewed vision OCR, ordered overlapping tile inspection, semantic separation, an external-verification ledger, a deterministic generator, a focused contract test, and a single idempotent transaction. No source pages beyond 493 were included in this batch.

The source material is separated into abbreviation/reference tables, image-caption context, Earth-reference facts, a continent table, and past-exam MCQs. The image captions on page 490 are retained as a note rather than inferred facts. The world-map illustration on page 491 was not converted into invented labels or claims.

| Imported record family | Count | Audit note |
|---|---:|---|
| Source pages | 5 | Physical pages 489–493, with reviewed printed-page metadata retained separately. |
| Facts | 33 | International-affairs and Earth-reference statements. |
| Notes | 5 | One abbreviation table, one caption note, two Earth tables, and one continent table. |
| MCQs | 10 | All from page 493, with printed question numbers, exam labels, answer key, and four options each. |
| MCQ options | 40 | Four visually validated options per MCQ. |
| Flashcards | 48 | Derived only from this batch’s facts, notes, and validated MCQs. |
| Search documents | 48 | One server-search document per imported fact, note, or MCQ. |
| Fact-verification rows | 48 | One auditable verification-status row per imported fact, note, or MCQ. |
| Tag assignments | 117 | Content, quality, anomaly, and printed-exam-source tags. |

## Verification and source fidelity

The import uses explicit statuses rather than silently modernising source material. The Mariana Trench statement is corroborated by NOAA’s description of Challenger Deep in the Pacific Ocean’s Mariana Trench.[1] The Death Valley **56.7°C** statement is corroborated, with medium confidence, because Guinness World Records recognises the historical record but discusses limitations and later review.[2] The remaining 46 records are intentionally marked `source_attributed`; this includes definition-sensitive country totals, historical superlatives, source tables, captions, and the printed answer-key-backed MCQs.

> The 195 independent-state and 193 UN-member totals on page 492 are retained as a source table. They are not silently treated as interchangeable current counts. The official UN member-state register is retained as the governing contextual reference.[3]

| Source-preserved anomaly | Handling |
|---|---|
| `ADP Annual Development Programmer.` | Retained verbatim in the page-489 table, tagged `source-typo-preserved`, and recorded in batch audit metadata. |
| `BJMA Bangladesh Jute Mills Corporation.` | Retained verbatim rather than changed to the conventional `BJMC`; tagged and recorded as a source anomaly. |
| Page-number inconsistencies | Physical PDF page, nested OCR page metadata, and visually reviewed printed footer are stored separately in source-page review metadata. |
| Faint river name on page 492 | Corrected by visual review to **রোঁ নদী** (Roe River); the OCR artifact’s malformed span is not imported. |

## Integrity and persistent totals

The post-import relational audit returned all expected counts: five source pages, 33 facts, five notes, ten MCQs, 40 options, 48 flashcards, 48 search documents, and 48 verification rows. The Supabase project now contains **241** imported source pages, **46** chapters, **42** topics, **3,101** facts, **193** notes, **237** MCQs, **948** MCQ options, **3,417** flashcards, **3,576** search documents, **1,429** tag assignments, and **574** fact-verification rows.

## Validation status

The focused contract test `server/batch0489_0493_import.test.ts` passed before generation. It locks the five-page boundary, requires idempotent canonical-hash inserts, checks source-anomaly preservation, confirms the complete option count, and requires the direct NOAA and Guinness verification references. The SQL transaction committed without an execution error, and the subsequent integrity query matched the generator audit.

## References

1. [NOAA National Centers for Environmental Information, “Planet Postcard: The Mariana Trench.”](https://www.ncei.noaa.gov/news/planet-postcard-mariana-trench)
2. [Guinness World Records, “Hottest places.”](https://www.guinnessworldrecords.com/world-records/66559-hottest-places)
3. [United Nations, “Member States.”](https://www.un.org/en/about-us/member-states)
