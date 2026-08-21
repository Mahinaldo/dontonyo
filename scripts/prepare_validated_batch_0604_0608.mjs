import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const workDir = "/home/ubuntu/dontonyo-work/batch-0604-0608";
const outDir = path.join(root, "supabase", "batch-0604-0608");
const BOOK = "Jubayer's GK";
export const BATCH_PAGES = [604, 605, 606, 607, 608];
export const PIPELINE_VERSION = "vision-quality-gated-batch-0604-0608-v1";
const q = value => `'${String(value ?? "").replaceAll("'", "''")}'`;
const json = value => `${q(JSON.stringify(value))}::jsonb`;
const hash = value => crypto.createHash("sha256").update(value, "utf8").digest("hex");
const tuple = rows => rows.map(row => `(${row.map(q).join(",")})`).join(",\n");

const ref = {
  cis: "https://www.mfa.am/en/international-organisations/2",
  cisCommittee: "https://eccis.org/en/page/28",
  arctic: "https://arctic-council.org/about/states/russian-federation/",
  glasnost: "https://www.britannica.com/topic/glasnost",
  sovietCollapse: "https://history.state.gov/milestones/1989-1992/collapse-soviet-union",
  unFounders: "https://research.un.org/en/unmembers/founders",
  greece: "https://www.britannica.com/place/Greece",
  teachingLineage: "https://www.britannica.com/question/Who-were-Aristotles-teachers-and-students",
  italyRepublic: "https://www.difesa.it/eng/primo-piano/towards-2-june/32062.html",
  italy: "https://www.britannica.com/place/Italy",
  italyPeninsula: "https://www.britannica.com/place/Italian-Peninsula",
  romanEmpire: "https://www.britannica.com/place/Roman-Empire",
};

const context = page => {
  if (page === 604) return { chapter: "europe", topic: "cis-and-soviet-history-past-questions-reference", domain: "russia" };
  if (page <= 606) return { chapter: "europe", topic: "greece-classical-reference", domain: "greece" };
  if (page === 607) return { chapter: "europe", topic: "greece-historical-figures-past-questions-reference", domain: "greece" };
  return { chapter: "europe", topic: "italy-reference", domain: "italy" };
};
const fact = (page, title, text, status = "source_attributed", sources = [], confidence = "high") => ({ source_page: page, title, text, status, sources, confidence, ...context(page), hash: hash(`fact|${page}|${title}|${text}`) });
const note = (page, title, text, status = "source_attributed", sources = [], confidence = "high") => ({ source_page: page, title, text, status, sources, confidence, ...context(page), hash: hash(`note|${page}|${title}|${text}`) });
const mcq = (page, number, question, options, correct, source, status = "source_attributed", sources = []) => ({ source_page: page, number, question, options, correct, source, status, sources, confidence: "high", ...context(page), hash: hash(`mcq|${page}|${number}|${question}`) });

const facts = [
  fact(604, "CIS — full-form expansion", "উৎসে CIS-এর পূর্ণরূপ `Commonwealth of Independent States` দেওয়া হয়েছে।", "verified", [ref.cis]),
  fact(604, "CIS — 1991 establishment", "Republic of Armenia MFA অনুযায়ী CIS প্রতিষ্ঠার চুক্তি ৮ ডিসেম্বর ১৯৯১ সালে Belarus, Russia ও Ukraine-এর নেতারা স্বাক্ষর করেন; এটি historic institutional reference।", "verified", [ref.cis]),
  fact(604, "CIS Executive Committee — Minsk headquarters", "CIS Executive Committee অনুযায়ী এর headquarters Minsk, Belarus-এ; Moscow-তে branch office আছে।", "verified", [ref.cisCommittee]),
  fact(604, "Georgia — historic CIS membership and withdrawal", "Republic of Armenia MFA অনুযায়ী Georgia ১৯৯৩ সালে CIS member-state হয় এবং ১৮ আগস্ট ২০০৯ সালে আনুষ্ঠানিকভাবে withdraw করে; এটি historic membership reference।", "verified", [ref.cis]),
  fact(605, "Greece — founding UN Member", "UN Dag Hammarskjöld Library অনুযায়ী Greece ২৬ জুন ১৯৪৫ UN Charter স্বাক্ষর করে এবং ২৫ অক্টোবর ১৯৪৫ instrument of ratification deposit করে; এটি founding-member historic reference।", "verified", [ref.unFounders]),
  fact(605, "Greece — Hellas source reference", "উৎসে Greece-এর পুরোনাম/ঐতিহাসিক নাম হিসেবে `Hellas` উল্লেখ আছে; scan-এর সরলীকৃত etymology এখানে সংরক্ষণ করা হয়নি।", "source_attributed", [], "medium"),
  fact(605, "Mount Olympus — Greece geography", "Britannica অনুযায়ী Mount Olympus Greece-এর সর্বোচ্চ পর্বত; এটি geographic reference।", "verified", [ref.greece]),
  fact(605, "Athens and Sparta — ancient Greek city-state context", "উৎসে Athens ও Sparta-এর উল্লেখ আছে; Britannica-এর ancient-Greece contextে এগুলো historic Greek city-states হিসেবে সীমিতভাবে রাখা হয়েছে।", "verified", [ref.greece]),
  fact(605, "Socrates, Plato, Aristotle and Alexander — teaching lineage", "Britannica অনুযায়ী Plato ছিলেন Socrates-এর student, Aristotle ছিলেন Plato-এর student, এবং Alexander ছিলেন Aristotle-এর বিখ্যাত student; এটি historic teaching-lineage reference।", "verified", [ref.teachingLineage]),
  fact(607, "Herodotus — The Histories source reference", "উৎসে Herodotus-এর সঙ্গে *The Histories* এবং Greco-Persian War-এর বিষয়বস্তুর উল্লেখ আছে; `father of history` superlative সংরক্ষণ করা হয়নি।", "source_attributed", [], "medium"),
  fact(607, "Homer — Greek poet source reference", "উৎসে Homer-কে Greek poet এবং *Iliad* ও *Odyssey*-এর সঙ্গে যুক্ত করা হয়েছে; এটি source-attributed literature reference।", "source_attributed", [], "medium"),
  fact(608, "Italy — 1946 republic transition", "Italian Ministry of Defence অনুযায়ী ২ জুন ১৯৪৬ institutional referendum-এর popular vote Italian Republic-এর জন্ম দেয়; এটি historic constitutional reference।", "verified", [ref.italyRepublic]),
  fact(608, "Italy — capital Rome", "Italy-এর রাজধানী Rome; এটি source-visible stable geographic reference।", "verified", [ref.italy]),
  fact(608, "Italy — early-opera source association", "উৎসে opera-এর প্রথম প্রচলনের সঙ্গে Italy-এর সম্পর্ক উল্লেখ আছে; এটিকে unqualified priority claim না করে historic cultural source reference হিসেবে রাখা হয়েছে।", "source_attributed", [], "medium"),
  fact(608, "Rome — seven hills source reference", "উৎসে Rome-কে সাত পাহাড়ের শহর বলা হয়েছে; এটি traditional historic designation হিসেবে source-attributed রাখা হয়েছে।", "source_attributed", [], "medium"),
  fact(608, "Augustus — first Roman emperor", "Britannica অনুযায়ী Augustus ২৭ BCE–১৪ CE Rome-এর প্রথম emperor ছিলেন; এটি historic office context।", "verified", [ref.romanEmpire]),
  fact(608, "Romulus Augustulus — final Western Roman emperor", "Britannica অনুযায়ী Romulus Augustulus ছিলেন Western Roman Empire-এর শেষ emperor; Western-Roman scope স্পষ্ট রাখা হয়েছে।", "verified", [ref.romanEmpire]),
  fact(608, "Italy — Vatican City and San Marino geographic context", "Britannica অনুযায়ী Italian Peninsula-তে independent republic San Marino ও Vatican City রয়েছে; উৎসের informal `ছিদ্রায়িত রাষ্ট্র` label সংরক্ষণ করা হয়নি।", "verified", [ref.italyPeninsula]),
];

const notes = [
  note(604, "CIS and Soviet-history — institutional and political boundary", "CIS membership counts, participant classifications, Georgia/Armenia/Turkmenistan status lines, Soviet leadership, reforms, dissolution, and revolution references are historic or institutional content. Current-status inference, ideological superlatives, and corrupted options are withheld."),
  note(605, "Greece reference — chronology and superlative boundary", "The source-visible Greece panel is retained only for corroborated geography, UN status, bounded city-state context, and the teaching lineage. Its compressed chronology, first-philosophy/first-map claims, informal epithets, local-grave claim, and oversimplified etymology are withheld."),
  note(606, "Classical quotation panel — exclusion boundary", "Page 606 consists mainly of attributed philosophical quotations, translated aphorisms, and fragmented biographies. Those quotations and slogans are not transformed into neutral learning facts or flashcards."),
  note(607, "Greek figures past questions — MCQ boundary", "Only Q02, Q06, and Q07 have complete readable stems, four options, visible keys, and acceptable scope. Quotation-attribution questions and the Herodotus-birthplace question with its historically inconsistent key are withheld."),
  note(608, "Italy reference — historic and geographic boundary", "Italy’s 1946 transition, Rome, bounded Roman historic offices, and enclave geography are retained. The Turkey panel is unreadable; Venice-at-the-Po, founding myth, broad Roman-law/religion formulations, and informal labels are withheld rather than rewritten."),
  note(608, "Italy source-text recovery — local OCR limitation", "The page-608 Italy panel was reconciled using local Bangla OCR against the rotated scan after the vision-model credit balance prevented further retry. Only text visible in both recovery paths is classified for import.", "source_attributed", [], "medium"),
];

const mcqs = [
  mcq(604, "02", "কোন দেশের সাথে আর্কটিকের বৃহত্তম সীমান্ত?", ["আমেরিকা", "নরওয়ে", "কানাডা", "রাশিয়া"], "ঘ", "DU ঘ 10–11", "verified", [ref.arctic]),
  mcq(604, "03", "‘পেরেস্ত্রোইকা’র উদ্ভাবক কে?", ["ক্লিনটন", "গর্বাচেভ", "ওয়ালেসা", "ইয়েলৎসিন"], "খ", "DU খ 97–98", "verified", [ref.glasnost]),
  mcq(604, "04", "কোন দেশটি কমনওয়েলথ অব ইন্ডিপেন্ডেন্ট স্টেট (সিআইএস) এর সদস্য রাষ্ট্র?", ["পোল্যান্ড", "চীন", "বেলারুশ", "জার্মানি"], "গ", "DU ঘ 03–04", "verified", [ref.cis]),
  mcq(604, "06", "‘গ্লাসনস্ত’ এর অর্থ কী?", ["সমাজতন্ত্রের সংস্কার", "খোলামেলা আলোচনা", "সমাজতন্ত্র ও গণতন্ত্রের মধ্যে সামঞ্জস্য বিধান", "সমাজতন্ত্রের পরিবর্তে গণতন্ত্র প্রতিষ্ঠা"], "খ", "14, 35 BCS", "verified", [ref.glasnost]),
  mcq(604, "08", "সাবেক সোভিয়েত ইউনিয়নে গর্বাচেভ ক্ষমতাসীন হয়েছিলেন?", ["১৯৮৫ সালে", "১৯৮৮ সালে", "১৯৮৭ সালে", "১৯৯০ সালে"], "ক", "দুর্নীতি দমন পরিদর্শক, 04", "verified", [ref.glasnost]),
  mcq(604, "09", "আনুষ্ঠানিকভাবে সোভিয়েত ইউনিয়ন কত সালে বিভক্ত করা হয়?", ["১৯৯০", "১৯৯১", "১৯৯৩", "১৯৯৪"], "খ", "সমাজসেবা অফিসার, 06", "verified", [ref.sovietCollapse]),
  mcq(604, "10", "সাবেক সোভিয়েত ইউনিয়ন ভেঙ্গে কয়টি রাষ্ট্র গঠন করা হয়েছে?", ["১০টি", "১৫টি", "১২টি", "১৬টি"], "খ", "দুদক সহকারী পরিচালক, 04", "verified", [ref.sovietCollapse]),
  mcq(604, "11", "সিআইএস-এর সদর দপ্তর—", ["মস্কোতে", "বার্লিনে", "মিনস্কে", "দুসানবে"], "গ", "পাবলিক সার্ভিস কমিশনের সহকারী সচিব, 05", "verified", [ref.cisCommittee]),
  mcq(604, "12", "যে বছর রাশিয়ায় বলশেভিক বিপ্লব সংঘটিত হয়—", ["১৯১৬", "১৯১৭", "১৯৪৯", "১৯৬২"], "খ", "চবি খ 07–08", "verified", [ref.sovietCollapse]),
  mcq(607, "02", "গণতন্ত্রের ধারণা উৎসারিত হয় প্রথম কোন দেশে?", ["যুক্তরাষ্ট্র", "প্রাচীন গ্রিস", "প্রাচীন রোম", "প্রাচীন ভারত"], "খ", "44 BCS", "verified", [ref.greece]),
  mcq(607, "06", "হোমার কোন ভাষার কবি?", ["ইংরেজি", "ল্যাটিন", "গ্রিক", "স্প্যানিশ"], "গ", "DU ঘ 96–97", "source_attributed", [],),
  mcq(607, "07", "বীর আলেকজান্ডারের শিক্ষক কে ছিলেন?", ["সফোক্রিস", "সক্রেটিস", "এরিস্টটল", "প্লেটো"], "গ", "DU ঘ 96–97", "verified", [ref.teachingLineage]),
];

const topics = [
  ["europe", "CIS ও Soviet-history past-question reference", "cis-and-soviet-history-past-questions-reference", 604, 17],
  ["europe", "Greece classical reference", "greece-classical-reference", 605, 18],
  ["europe", "Greece historical-figures past-question reference", "greece-historical-figures-past-questions-reference", 607, 19],
  ["europe", "Italy reference", "italy-reference", 608, 20],
];
const tags = [
  ["europe", "Europe", "domain", "Europe source material."], ["russia", "Russia and USSR historical reference", "domain", "Russia/USSR source material."], ["greece", "Greece source reference", "domain", "Greece source material."], ["italy", "Italy source reference", "domain", "Italy source material."],
  ["reference-note", "Structured source note", "content_type", "Bounded source reference with caveats."], ["past-exam-mcq", "Past-exam MCQ", "content_type", "Source-complete past-exam item."], ["answer-key", "Printed answer key", "content_type", "Visually reviewed printed answer key."],
  ["source-attributed", "Source-attributed", "quality", "Source-preserved record without direct corroboration in this batch."], ["externally-verified", "Externally verified", "quality", "Directly corroborated record."], ["historic-scope", "Historic scope", "quality", "Historic political, institutional, territorial, cultural, or geographic reference."],
  ["dhaka-university", "University of Dhaka", "exam_source", "Printed University of Dhaka source label."], ["bcs", "Bangladesh Civil Service", "exam_source", "Printed BCS source label."], ["other-bangladesh-exam", "Other Bangladesh examination", "exam_source", "Other printed examination source label."],
];
const sourceMeta = source => source.includes("DU") ? ["University of Dhaka", "University of Dhaka", "admission", "dhaka-university"] : source.includes("BCS") ? ["Bangladesh Civil Service", null, "competitive", "bcs"] : ["Other Bangladesh examination", null, "competitive", "other-bangladesh-exam"];
const tableFor = kind => kind === "fact" ? "gk_facts" : kind === "note" ? "gk_notes" : "gk_mcqs";
const entity = (kind, item) => `(SELECT id FROM public.${tableFor(kind)} WHERE canonical_hash=${q(item.hash)} LIMIT 1)`;
const quality = item => item.status === "verified" ? "externally-verified" : "source-attributed";

export async function buildBatch() {
  const pages = await Promise.all(BATCH_PAGES.map(page => fs.readFile(path.join(workDir, "pages", `page_${String(page).padStart(4, "0")}.json`), "utf8").then(JSON.parse)));
  const records = [...facts.map(item => ({ kind: "fact", item, claim: item.text })), ...notes.map(item => ({ kind: "note", item, claim: item.text })), ...mcqs.map(item => ({ kind: "mcq", item, claim: `${item.question} — printed answer: ${item.correct}` }))];
  const audit = {
    batch_pages: BATCH_PAGES, pipeline_version: PIPELINE_VERSION,
    source_pages: pages.map(page => ({ page: page.source_page, review_status: "completed_image_grounded_review", image_sha256: page.source_image_sha256, overall_confidence: page.review.overall_confidence })),
    generated_facts: facts.length, generated_notes: notes.length, generated_mcqs: mcqs.length, generated_options: mcqs.length * 4, generated_flashcards: records.length,
    verification_counts: { verified: records.filter(row => row.item.status === "verified").length, conflicting: 0, source_attributed: records.filter(row => row.item.status === "source_attributed").length },
    source_anomalies: ["Pages 604–608 were rendered at 300 DPI and reviewed in order. Page 604 was recovered through a rotated high-fidelity retry; page 605 through a rotated retry; pages 607–608 through local Bangla OCR cross-checked against rotated scans after the vision-credit balance became unavailable.", "The page-606 quotation panel is preserved in source-page audit metadata but produces no neutral facts or MCQs.", "Page-604 Q01 is incomplete; Q05 is ambiguous; Q07 is ideologically loaded. Page-607 Q01/Q04/Q05 are quotation questions and Q03 has a historically inconsistent key. Page-608 Turkey text is not reconstructed."],
    quality_gates: ["Exactly physical source pages 604–608 are imported.", "Every imported MCQ has four visually reviewed options and exactly one printed source key.", "No corrupted, ambiguous, unsafe, ideologically unbounded, historically inconsistent, or unreadable MCQ is imported.", "Content tag categories are limited to the database-approved taxonomy.", "All upserts use stable canonical hashes and batch-scoped derived-record keys."],
  };
  const topicSql = `INSERT INTO public.topics (chapter_id,title,slug,description,source_page,display_order) SELECT c.id,x.title,x.slug,'Source-preserved content with complete visual review and explicit verification status.',x.page::integer,x.ord::integer FROM (VALUES ${tuple(topics)}) x(chapter_slug,title,slug,page,ord) JOIN public.chapters c ON c.slug=x.chapter_slug AND c.book_id=(SELECT id FROM public.books WHERE title=${q(BOOK)} LIMIT 1) WHERE NOT EXISTS (SELECT 1 FROM public.topics t WHERE t.chapter_id=c.id AND t.slug=x.slug);`;
  const printedBookPage = { 604: 549, 605: 548, 606: null, 607: 550, 608: 551 };
  const pageSql = pages.map(page => { const c = context(page.source_page); const meta = { physical_source_page: page.source_page, printed_book_page: printedBookPage[page.source_page], source_image_sha256: page.source_image_sha256, extraction_model: page.model, review_status: "completed_image_grounded_review", review_report: `${workDir}/visual_review_604_608.md`, classification_report: `${workDir}/classification_decisions.md`, verification_report: `${workDir}/external_verification.md`, original_ocr_review_status: page.review.review_status, recovery_artifacts: page.source_page === 604 ? ["page_0604_rotated_retry.json"] : page.source_page === 605 ? ["page_0605_rotated_retry.json"] : page.source_page >= 607 ? [`page_${String(page.source_page).padStart(4, "0")}_tesseract.txt`] : [], unresolved_spans: page.review.unresolved_spans }; return `INSERT INTO public.source_pages (import_run_id,book_id,source_page,page_kind,raw_transcription,chapter_heading,topic_heading,confidence,extraction_method,model_name,notes,review_metadata) SELECT (SELECT id FROM public.import_runs WHERE pipeline_version=${q(PIPELINE_VERSION)} ORDER BY started_at DESC LIMIT 1),b.id,${page.source_page},'educational'::page_kind,${q(page.transcription.verbatim_transcript)},${q("Europe")},${q(c.topic)},${q(page.review.overall_confidence)}::confidence_level,'vision_ocr_with_image_grounded_review',${q(page.model)},'Ordered source-tile review completed; records use only ledger-classified source text.',${json(meta)} FROM public.books b WHERE b.title=${q(BOOK)} AND NOT EXISTS (SELECT 1 FROM public.source_pages s WHERE s.book_id=b.id AND s.source_page=${page.source_page});`; }).join("\n");
  const factSql = `WITH d(page,chapter_slug,topic_slug,title,body,confidence,canonical_hash) AS (VALUES ${tuple(facts.map(item => [item.source_page, item.chapter, item.topic, item.title, item.text, item.confidence, item.hash]))}) INSERT INTO public.gk_facts (book_id,chapter_id,topic_id,title,fact_text,explanation,source_page,source_section,source_excerpt,importance,confidence,canonical_hash) SELECT b.id,c.id,t.id,d.title,d.body,'Source-derived reference with explicit verification status and historic scope where applicable.',d.page::integer,d.title,d.body,3,d.confidence::confidence_level,d.canonical_hash FROM d JOIN public.books b ON b.title=${q(BOOK)} JOIN public.chapters c ON c.book_id=b.id AND c.slug=d.chapter_slug JOIN public.topics t ON t.chapter_id=c.id AND t.slug=d.topic_slug ON CONFLICT (canonical_hash) DO UPDATE SET fact_text=EXCLUDED.fact_text,explanation=EXCLUDED.explanation,confidence=EXCLUDED.confidence;`;
  const noteSql = `WITH d(page,chapter_slug,topic_slug,title,body,confidence,canonical_hash) AS (VALUES ${tuple(notes.map(item => [item.source_page, item.chapter, item.topic, item.title, item.text, item.confidence, item.hash]))}) INSERT INTO public.gk_notes (book_id,chapter_id,topic_id,title,content,source_page,source_section,display_order,confidence,canonical_hash) SELECT b.id,c.id,t.id,d.title,d.body,d.page::integer,d.title,d.page::integer,d.confidence::confidence_level,d.canonical_hash FROM d JOIN public.books b ON b.title=${q(BOOK)} JOIN public.chapters c ON c.book_id=b.id AND c.slug=d.chapter_slug JOIN public.topics t ON t.chapter_id=c.id AND t.slug=d.topic_slug ON CONFLICT (canonical_hash) DO UPDATE SET content=EXCLUDED.content,confidence=EXCLUDED.confidence;`;
  const mcqSql = mcqs.map(item => { const [name, institution, examType, normalized] = sourceMeta(item.source); const keys = ["ক", "খ", "গ", "ঘ"]; const options = item.options.map((option, index) => `INSERT INTO public.gk_mcq_options (mcq_id,option_key,option_text,display_order,is_correct) SELECT m.id,${q(keys[index])},${q(option)},${index + 1},${keys[index] === item.correct} FROM public.gk_mcqs m WHERE m.canonical_hash=${q(item.hash)} AND NOT EXISTS (SELECT 1 FROM public.gk_mcq_options o WHERE o.mcq_id=m.id AND o.option_key=${q(keys[index])});`).join("\n"); const explanation = item.status === "verified" ? "Printed key visually reviewed; verification and historic scope are recorded in the batch ledger." : "Printed key visually reviewed; the source-attributed context is recorded in the batch ledger."; return `INSERT INTO public.exam_sources (name,institution,exam_type,description,normalized_name) SELECT ${q(name)},${q(institution)},${q(examType)},${q(`Normalized from printed source label on page ${item.source_page}.`)},${q(normalized)} WHERE NOT EXISTS (SELECT 1 FROM public.exam_sources WHERE normalized_name=${q(normalized)}); INSERT INTO public.gk_mcqs (book_id,chapter_id,topic_id,question,correct_option,explanation,source_page,source_section,source_question_number,difficulty,confidence,canonical_hash) SELECT b.id,c.id,t.id,${q(item.question)},${q(item.correct)},${q(explanation)},${item.source_page},'বিগত বছরের প্রশ্ন',${q(item.number)},3,'high'::confidence_level,${q(item.hash)} FROM public.books b JOIN public.chapters c ON c.book_id=b.id AND c.slug=${q(item.chapter)} JOIN public.topics t ON t.chapter_id=c.id AND t.slug=${q(item.topic)} WHERE b.title=${q(BOOK)} ON CONFLICT (canonical_hash) DO UPDATE SET correct_option=EXCLUDED.correct_option,explanation=EXCLUDED.explanation,confidence=EXCLUDED.confidence; ${options} INSERT INTO public.gk_mcq_sources (mcq_id,exam_source_id,year,session,source_text,source_page) SELECT m.id,(SELECT id FROM public.exam_sources WHERE normalized_name=${q(normalized)} LIMIT 1),NULL,${q(item.source)},${q(item.source)},${item.source_page} FROM public.gk_mcqs m WHERE m.canonical_hash=${q(item.hash)} AND NOT EXISTS (SELECT 1 FROM public.gk_mcq_sources s WHERE s.mcq_id=m.id AND s.source_text=${q(item.source)} AND s.source_page=${item.source_page});`; }).join("\n");
  const assign = (kind, item, slugs) => slugs.map(slug => `INSERT INTO public.content_tag_assignments (tag_id,entity_type,entity_id,source_page,confidence,assigned_by) SELECT t.id,${q(kind)},${entity(kind, item)},${item.source_page},${q(item.confidence)}::confidence_level,'batch-0604-0608-quality-pipeline' FROM public.content_tags t WHERE t.slug=${q(slug)} ON CONFLICT DO NOTHING;`).join("\n");
  const tagSql = `INSERT INTO public.content_tags (slug,label,category,description) VALUES ${tags.map(row => `(${row.map(q).join(",")})`).join(",")} ON CONFLICT (slug) DO UPDATE SET label=EXCLUDED.label,category=EXCLUDED.category,description=EXCLUDED.description;
${facts.map(item => assign("fact", item, ["europe", item.domain, quality(item), "historic-scope"])).join("\n")}
${notes.map(item => assign("note", item, ["europe", item.domain, "reference-note", quality(item), "historic-scope"])).join("\n")}
${mcqs.map(item => assign("mcq", item, ["europe", item.domain, "past-exam-mcq", "answer-key", sourceMeta(item.source)[3], quality(item), "historic-scope"])).join("\n")}`;
  const verificationSql = records.map(({ kind, item, claim }) => `INSERT INTO public.fact_verifications (source_page,entity_type,entity_id,claim_text,normalized_claim,verification_status,confidence,verification_sources,audit_note) SELECT ${item.source_page},${q(kind)},${entity(kind, item)},${q(claim)},NULL,${q(item.status)},${q(item.confidence)}::confidence_level,${json(item.sources)},${q(item.status === "verified" ? "Direct corroboration and historic boundary are recorded in the batch verification ledger." : "Source-attributed record retained after complete image review and conservative classification.")} WHERE NOT EXISTS (SELECT 1 FROM public.fact_verifications v WHERE v.entity_type=${q(kind)} AND v.entity_id=${entity(kind, item)} AND v.claim_text=${q(claim)});`).join("\n");
  const derivedSql = `INSERT INTO public.flashcards (subject_id,book_id,chapter_id,topic_id,front_text,back_text,source_type,source_id,source_key) SELECT (SELECT id FROM public.subjects ORDER BY created_at ASC LIMIT 1),f.book_id,f.chapter_id,f.topic_id,f.title,f.fact_text,'fact',f.id,'batch0604-0608:fact:'||f.id::text FROM public.gk_facts f WHERE f.source_page BETWEEN 604 AND 608 AND NOT EXISTS (SELECT 1 FROM public.flashcards c WHERE c.source_key='batch0604-0608:fact:'||f.id::text); INSERT INTO public.flashcards (subject_id,book_id,chapter_id,topic_id,front_text,back_text,source_type,source_id,source_key) SELECT (SELECT id FROM public.subjects ORDER BY created_at ASC LIMIT 1),n.book_id,n.chapter_id,n.topic_id,n.title,n.content,'note',n.id,'batch0604-0608:note:'||n.id::text FROM public.gk_notes n WHERE n.source_page BETWEEN 604 AND 608 AND NOT EXISTS (SELECT 1 FROM public.flashcards c WHERE c.source_key='batch0604-0608:note:'||n.id::text); INSERT INTO public.flashcards (subject_id,book_id,chapter_id,topic_id,front_text,back_text,source_type,source_id,source_key) SELECT (SELECT id FROM public.subjects ORDER BY created_at ASC LIMIT 1),m.book_id,m.chapter_id,m.topic_id,m.question,'সঠিক উত্তর: '||o.option_key||'. '||o.option_text,'mcq',m.id,'batch0604-0608:mcq:'||m.id::text FROM public.gk_mcqs m JOIN public.gk_mcq_options o ON o.mcq_id=m.id AND o.is_correct WHERE m.source_page BETWEEN 604 AND 608 AND NOT EXISTS (SELECT 1 FROM public.flashcards c WHERE c.source_key='batch0604-0608:mcq:'||m.id::text); INSERT INTO public.search_documents (entity_type,entity_id,title,body,english_metadata) SELECT 'fact',f.id,f.title,f.fact_text,'Status-marked GK fact | source page '||f.source_page::text FROM public.gk_facts f WHERE f.source_page BETWEEN 604 AND 608 AND NOT EXISTS (SELECT 1 FROM public.search_documents d WHERE d.entity_type='fact' AND d.entity_id=f.id); INSERT INTO public.search_documents (entity_type,entity_id,title,body,english_metadata) SELECT 'note',n.id,n.title,n.content,'Structured source reference | source page '||n.source_page::text FROM public.gk_notes n WHERE n.source_page BETWEEN 604 AND 608 AND NOT EXISTS (SELECT 1 FROM public.search_documents d WHERE d.entity_type='note' AND d.entity_id=n.id); INSERT INTO public.search_documents (entity_type,entity_id,title,body,english_metadata) SELECT 'mcq',m.id,NULL,m.question,'Past-exam MCQ | source page '||m.source_page::text||' | question '||m.source_question_number FROM public.gk_mcqs m WHERE m.source_page BETWEEN 604 AND 608 AND NOT EXISTS (SELECT 1 FROM public.search_documents d WHERE d.entity_type='mcq' AND d.entity_id=m.id);`;
  const sql = `-- Generated by prepare_validated_batch_0604_0608.mjs. Source pages 604–608 only.\nBEGIN;\nINSERT INTO public.import_runs (source_filename,source_sha256,pipeline_version,status,completed_at,audit) VALUES ('Jubayer''sgk.pdf',${q(hash(pages.map(page => page.source_image_sha256).join("|")))},${q(PIPELINE_VERSION)},'completed',now(),${json(audit)});\n${topicSql}\n${pageSql}\n${factSql}\n${noteSql}\n${mcqSql}\n${tagSql}\n${verificationSql}\n${derivedSql}\nCOMMIT;`;
  return { sql, audit };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const { sql, audit } = await buildBatch();
  const counts = { batch_pages: BATCH_PAGES, review_tiles: 33, eligible_facts: facts.length, eligible_notes: notes.length, eligible_mcqs: mcqs.length, eligible_mcq_options: mcqs.length * 4, withheld_mcqs: 7, derived_records: audit.generated_flashcards, verification_statuses: audit.verification_counts };
  await fs.mkdir(outDir, { recursive: true });
  await fs.writeFile(path.join(outDir, "validated_import.sql"), sql);
  await fs.writeFile(path.join(outDir, "batch_audit.json"), JSON.stringify(audit, null, 2));
  await fs.writeFile(path.join(outDir, "execute_sql_request.json"), JSON.stringify({ project_id: "rennotctgrxvbpghbimx", query: sql }));
  await fs.writeFile(path.join(workDir, "import_input_counts.json"), JSON.stringify(counts, null, 2));
  console.log(JSON.stringify({ output_dir: outDir, audit, counts }, null, 2));
}
