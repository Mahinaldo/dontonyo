# Jubayer’s GK — Validated Batch 0459–0463 Import Report

**Authorized boundary:** physical source-PDF pages **459–463 only**. No page beyond 463 was extracted or imported in this run. This source-preserving batch uses pipeline version `vision-quality-gated-batch-0459-0463-v1` and was applied idempotently to Supabase project `rennotctgrxvbpghbimx`.

## Review and classification

Each page was rendered, transcribed, and reviewed against the page image. Source transcripts, raw model responses, image checksums, correction lists, accepted tags, and confidence metadata remain in the per-page artifact directory. The import keeps different content types distinct: headings establish relational context, facts and biographies become facts, the single study note remains a note, and page 462’s questions, options, answer key, and exam labels become MCQs, options, and source links.

| Source page | Primary material | Image-review result | Special handling |
|---:|---|---|---|
| 459 | Bangladesh and South Asian film history | Accepted | Film-history and biography tags; the single-director *Surjya Dighal Bari* statement is conflict-flagged. |
| 460 | BFDC, Liberation War films, Zahir Raihan, Tanvir Mokammel | Accepted with flags | The image review corrected **লালসাল** to **লালসালু**. |
| 461 | Hiralal Sen, Satyajit Ray, Ritwik Ghatak, Tareque Masud | Accepted | Visual tile review reconciled the physical source page with printed book page 408; the nested OCR page-number mismatch is retained in audit metadata. |
| 462 | Film past-exam MCQs and answer key | Accepted with flags | 9 MCQs, every printed option, the printed answer key, and source-exam labels were retained. |
| 463 | Bangladesh Television, radio, and telecommunications | Accepted | Media-and-telecom tags; date conflicts are visible rather than silently rewritten. |

## Records added and integrity checks

| Record type | Added | Validation result |
|---|---:|---|
| Source pages | 5 | All pages 459–463 present. |
| Facts / notes | 88 / 1 | Each has a source page, semantic tag, and verification record. |
| MCQs / options | 9 / 36 | All 9 MCQs have exactly 4 options and one marked correct option. |
| Flashcards / search documents | 98 / 98 | Derived from the imported facts, note, and MCQs. |
| Tag assignments | 223 | Domain, content type, exam source, and quality state are stored separately. |
| Fact-verification records | 98 | 11 verified, 4 conflicting, 83 source-attributed. |

## External verification outcomes

The ledger distinguishes the physical printed claim from any externally checked normalization. Claims without direct independent corroboration are **source-attributed**, not presented as verified.

| Topic | Status | Decision |
|---|---|---|
| *Mukh O Mukhosh* as a 1956 Abdul Jabbar Khan film | Verified | Independent Bangladeshi reporting corroborates the director and 1956 release context. [1] [2] |
| Zahir Raihan’s *Sangam* and *Stop Genocide* | Verified | Banglapedia and an academic PubMed-indexed paper corroborate the relevant film history. [3] [4] |
| Satyajit Ray’s 1992 Academy Honorary Award | Verified | The Academy’s record identifies the 1992 Honorary Award. [5] |
| BTV’s 1964 pilot launch, DIT/Rajuk location, 1975 Rampura move, and 1980 colour broadcasting | Verified | Corroborated by Bangladesh Television’s own history. [6] |
| Card-phone in 1992 and first digital telephone system in 1990 | Conflicting | The BTRC’s own historical timeline reports different milestones. The printed claims remain in the database with low confidence and a caution explanation. [7] |
| *Surjya Dighal Bari* director answer | Conflicting | Credible reporting identifies Sheikh Niamat Ali and Masihuddin Shaker as joint directors; the printed single, conflated option and answer key remain source-linked but low confidence. [8] [9] |

> **Integrity rule:** a conflict does not erase the source. It preserves the book’s exact wording and links it to an explicit verification status, confidence flag, audit note, and external URLs.

## Supabase totals after this batch

| Table family | Current total |
|---|---:|
| Source pages | 211 |
| Chapters / topics | 39 / 16 |
| Notes / facts | 151 / 2,830 |
| MCQs / options | 133 / 532 |
| Flashcards / search documents | 3,000 / 3,159 |
| Content-tag assignments / verification records | 368 / 157 |

The highest physical source page now present is **463**. This concludes the authorized batch; no additional OCR or import is to start until the user explicitly requests the next five-page range.

## References

[1]: https://www.thedailystar.net/culture/entertainment/news/how-mukh-o-mukhosh-bangladeshs-first-film-was-made-4239111 "The Daily Star — Mukh O Mukhosh"
[2]: https://observerbd.com/news/586226 "The Daily Observer — Mukh O Mukhosh at 70"
[3]: https://en.banglapedia.org/index.php/Raihan%2C_Zahir "Banglapedia — Zahir Raihan"
[4]: https://pubmed.ncbi.nlm.nih.gov/41691478/ "PubMed — Zahir Raihan’s Stop Genocide"
[5]: https://aaspeechesdb.oscars.org/link/064-24/ "Academy Awards Acceptance Speech Database — Satyajit Ray"
[6]: http://btv.gov.bd/pages/static-pages/6922db5a933eb65569e099bf "Bangladesh Television — history"
[7]: http://btrc.gov.bd/pages/static-pages/6922e040933eb65569e26312 "BTRC — telecommunications-history timeline"
[8]: https://www.jugantor.com/entertainment/976080 "Jugantor — Surjya Dighal Bari"
[9]: https://www.prothomalo.com/entertainment/dhallywood/wb0drsam8v "Prothom Alo — Surjya Dighal Bari"
