# Batch 0529–0533 External Verification Ledger

## Purpose and Method

This ledger records **claim-level verification decisions** for physical source pages 529–533 of *Jubayer's GK*. The import preserves the reviewed Bangla source reading. It does not silently replace source text with contemporary wording. A record is marked **verified** only where a cited external source directly corroborates the material claim. Political, constitutional, and population-sensitive material remains **source_attributed** even where a reputable source provides useful contextual support.

| Status | Meaning used by this batch |
|---|---|
| **verified** | The claim is directly corroborated by an identified authoritative or reputable source. |
| **source_attributed** | The reviewed source claim is retained with its page reference, confidence flag, and any time-sensitivity metadata; it is not represented as independently verified. |
| **conflicting** | The reviewed source wording is inaccurate, incomplete, or inconsistent with the external record; the source form remains visible and the discrepancy is recorded. |

## Directly Corroborated Claims

| Source page | Reviewed source claim | Result | Evidence and import treatment |
|---:|---|---|---|
| 529 | Mahatma Gandhi’s birthday is **2 October**; International Day of Non-Violence is observed on that date. | **verified** | The United Nations states that the day is observed on 2 October, Gandhi’s birthday.[^un-nonviolence] Import as a verified fact with `person`, `history`, and `nonviolence` tags. |
| 529 | Mother Teresa was born in Skopje; her family was of Albanian descent; she founded the Missionaries of Charity in 1950; she received the 1979 Peace Prize. | **verified** | The Nobel Foundation’s biography confirms her birthplace, Albanian descent, 7 October 1950 permission to form Missionaries of Charity, and its 1979 Peace Prize record.[^nobel-teresa-bio][^nobel-teresa-prize] Import distinct verified biographical facts; preserve the source’s 1948 citizenship wording as source-attributed because it is not corroborated by the cited source. |
| 530 | Rajiv Gandhi was killed on **21 May 1991** in a suicide bombing by Thenmozhi “Gayatri” Rajaratnam, associated with LTTE. | **verified** | The Association for Diplomatic Studies and Training archival account explicitly gives the date, method, assailant, and LTTE association.[^adst-rajiv] Import the verified date/context; retain the source’s Bangla spellings and “Nalini” sentencing claim separately as source-attributed/low confidence. |
| 530 | Amartya Sen received the Economics Prize in **1998**. | **verified** | The Nobel Foundation records that the 1998 Sveriges Riksbank Prize in Economic Sciences in Memory of Alfred Nobel was awarded to Amartya Sen for contributions to welfare economics.[^nobel-sen] Import as a verified fact. The source’s “Asia’s first” framing remains source-attributed because it is broader and not established by this citation. |

## Source-Attributed, Time-Sensitive, or Conservative Imports

| Source pages | Material | Status and rationale | Required import metadata |
|---:|---|---|---|
| 529 | India overview: comparative South-Asia size/population, borders, maritime geography, and island territory. | **source_attributed**. Geographic framing is retained but not separately researched in this batch. | `geography`, `India`, `source-attributed`; reviewed confidence. |
| 529–531 | Gandhi/Nehru/Indira/Rajiv/Nehru–Gandhi family relationship and office lists. | **source_attributed** except the directly corroborated rows above. Several claims are historical but contain source-spelling or terminology issues, including “দৌহিত্র.” | `biography`, `India`, `time-sensitive` where office role is involved; preserve anomalies. |
| 530 | Indira Gandhi assassination details, Rajiv Gandhi’s ordinal office label, Bofors wording, alleged conspirator/sentencing rows, Kalam quote and bibliography, and Amartya Sen ancestral-home / “first Asian” claims. | **source_attributed**. These require broader source-by-source validation than the bounded batch ledger supplies; uncertain names and quote punctuation are retained only as reviewed source text. | `biography`, `India`, `source-anomaly` or `low-confidence` where the review flags a span. |
| 531 | President and prime minister panels, party-alignment wording, political family table, women’s-office “first” claims. | **source_attributed**. Political office/order content is time-sensitive or needs formal list validation. The page’s Manmohan Singh dates are **2004–2014** in the reviewed transcript; preserve this reviewed form rather than the earlier OCR anomaly. | `politics`, `India`, `time-sensitive`, source page and page-level medium confidence. |
| 532 | INC/BJP foundation/personnel/symbol table and “largest political party” wording. | **source_attributed**. Party roles, descriptions, and comparative membership wording are political/time-sensitive; no silent normalisation is permitted. | `politics`, `India`, `time-sensitive`; preserve `পাঞ্জা` as printed/uncertain. |
| 532 | Golden Temple, Operation Blue Star, Sikh/Guru Nanak, Santiniketan, and Visva-Bharati rows. | **source_attributed**. The source wording is preserved; no attempt is made to resolve the causality or institutional-history simplifications in the source. | `history`, `religion`, `culture`, `source-attributed`. |
| 532 | 28-state / 8-union-territory list and Jammu & Kashmir constitutional/reorganisation material. | **source_attributed**. The 2019 reorganisation is contextually supported by PRS Legislative Research’s bill summary, which describes the two Union Territories; the underlying statutory record is India Code.[^prs-jk][^india-code-jk] Because this is constitutional/political and potentially time-sensitive, import it as reviewed source content, not a current-law assertion. | `politics`, `constitution`, `India`, `time-sensitive`, page-level medium confidence. |
| 533 | Map captions, state-extremes legend, and partially legible location-history table. | **source_attributed**. The page review is low confidence. Import only the four clear legend rows and the clearly reviewed readings of Fatehpur Sikri, Taj Mahal, Babri Masjid, Aligarh, and the explicitly qualified mosque row; omit broken row alignment and unreadable map labels. | `map`, `geography`, `India`, `low-confidence`, `source-attributed`; include correction/anomaly metadata. |

## Source Anomalies and Withholding Rules

| Source page | Item | Decision |
|---:|---|---|
| 529 | Nehru’s relationship row uses **দৌহিত্র** for Rajiv Gandhi. | Preserve as an explicit low-confidence source anomaly; do not normalize the term in the source text. |
| 530 | Bodyguard names, Bofors phrase, suicide-bomber transliteration, and Kalam quotation punctuation are uncertain. | Preserve only where source-derived with low/medium confidence and no fabricated normalisation. |
| 531 | Headings beginning “জিন তথ্য,” “মতিলাল” spelling, and political labels are uncertain/time-sensitive. | Preserve reviewed wording with confidence metadata. |
| 532 | INC symbol text “পাঞ্জা,” founder-name orthography, and island spelling are uncertain. | Retain the review’s unresolved-span metadata. |
| 533 | Some map labels and several table-row alignments are unreadable. | **Do not create reconstructed facts** for unreadable entries. Retain one source note documenting the low-confidence page and import only clearly readable entries. |

[^un-nonviolence]: [United Nations, “International Day of Non-Violence”](https://www.un.org/en/observances/non-violence-day).
[^nobel-teresa-bio]: [Nobel Prize, “Mother Teresa – Biographical”](https://www.nobelprize.org/prizes/peace/1979/teresa/biographical/).
[^nobel-teresa-prize]: [Nobel Prize, “The Nobel Peace Prize 1979”](https://www.nobelprize.org/prizes/peace/1979/summary/).
[^adst-rajiv]: [Association for Diplomatic Studies and Training, “Reap the Whirlwind — The Assassination of Rajiv Gandhi”](https://adst.org/2015/05/reap-the-whirlwind-the-assassination-of-rajiv-gandhi/).
[^nobel-sen]: [Nobel Prize, “The Sveriges Riksbank Prize in Economic Sciences in Memory of Alfred Nobel 1998”](https://www.nobelprize.org/prizes/economic-sciences/1998/summary/).
[^prs-jk]: [PRS Legislative Research, “The Jammu and Kashmir Reorganisation Bill, 2019”](https://prsindia.org/billtrack/prs-products/prs-bill-summary-3333).
[^india-code-jk]: [India Code, “Jammu and Kashmir Reorganisation Act, 2019”](https://www.indiacode.nic.in/handle/123456789/12030?view_type=browse).
