import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const workDir = "/home/ubuntu/dontonyo-work/batch-0579-0583";
const outputDir = path.join(root, "supabase", "batch-0579-0583");
export const BATCH_PAGES = [579, 580, 581, 582, 583];
export const PIPELINE_VERSION = "vision-quality-gated-batch-0579-0583-v1";
const BOOK_TITLE = "Jubayer's GK";
const q = value => `'${String(value ?? "").replaceAll("'", "''")}'`;
const json = value => `${q(JSON.stringify(value))}::jsonb`;
const hash = value => crypto.createHash("sha256").update(value, "utf8").digest("hex");
const values = rows => rows.map(row => `(${row.map(q).join(",")})`).join(",\n");
const files = BATCH_PAGES.map(page => path.join(workDir, "pages", `page_${String(page).padStart(4, "0")}.json`));

const refs = {
  singapore: "https://www.nlb.gov.sg/main/article-detail?cmsuuid=dc1efe7a-8159-40b2-9244-cdb078755013",
  malaysia: "https://history.state.gov/historicaldocuments/frus1964-68v26/d270",
  aquino: "https://www.womenshistory.org/education-resources/biographies/corazon-aquino",
  karabakh: "https://www.cfr.org/global-conflict-tracker/conflict/nagorno-karabakh-conflict",
  qatar: "https://history.state.gov/countries/qatar",
  lebanon: "https://tile.loc.gov/storage-services/service/ll/llglrd/2018298839/2018298839.pdf",
  vatican: "https://www.britannica.com/place/Vatican-City",
  uk: "https://www.britannica.com/place/United-Kingdom",
  abolition: "https://www.nationalarchives.gov.uk/explore-the-collection/explore-by-time-period/georgians/1833-abolition-of-slavery-act-and-compensation-claims/",
};

const ctx = page => {
  if (page <= 580) return { chapter: "asia-other-states", chapterTitle: "এশিয়ার অন্যান্য গুরুত্বপূর্ণ রাষ্ট্র", topic: page === 579 ? "asia-other-states-singapore-yemen-philippines" : "asia-other-states-west-central-reference", topicTitle: page === 579 ? "এশিয়ার অন্যান্য রাষ্ট্র — সিঙ্গাপুর, ইয়েমেন ও ফিলিপাইন" : "এশিয়ার অন্যান্য রাষ্ট্র — ব্রুনাই থেকে লেবানন", domain: "asia" };
  if (page === 581) return { chapter: "europe", chapterTitle: "ইউরোপ", topic: "europe-regional-country-map", topicTitle: "ইউরোপ — অঞ্চলভিত্তিক দেশ-তালিকা ও মানচিত্র", domain: "europe" };
  if (page === 582) return { chapter: "europe", chapterTitle: "ইউরোপ", topic: "europe-reference-and-past-questions", topicTitle: "ইউরোপ — তথ্যভাণ্ডার ও বিগত বছরের প্রশ্ন", domain: "europe" };
  return { chapter: "europe", chapterTitle: "ইউরোপ", topic: "united-kingdom-source-reference", topicTitle: "যুক্তরাজ্য — পরিচিতি ও পরিভাষা উৎস-রেফারেন্স", domain: "united-kingdom" };
};

const fact = (page, title, body, status = "source_attributed", confidence = "medium", sources = [], timeSensitive = false) => ({
  source_page: page, title, fact_text: body, status, confidence, sources, timeSensitive, ...ctx(page), canonical_hash: hash(`fact|${page}|${title}|${body}`),
});
const note = (page, title, content, confidence = "high", timeSensitive = true, sources = []) => ({
  source_page: page, title, content, status: "source_attributed", confidence, sources, timeSensitive, ...ctx(page), canonical_hash: hash(`note|${page}|${title}|${content}`),
});
const mcq = (page, number, question, options, correct, source, confidence = "high", sources = [], timeSensitive = false) => ({
  source_page: page, number, question, options, correct, source, status: sources.length ? "verified" : "source_attributed", confidence, sources, timeSensitive, ...ctx(page), canonical_hash: hash(`mcq|${page}|${number}|${question}`),
});

const facts = [
  fact(579, "Singapore — Malaysia federation ও separation", "Singapore National Library Board অনুযায়ী Singapore ১৬ সেপ্টেম্বর ১৯৬৩ Malaysia federation-এ যুক্ত হয় এবং ৯ আগস্ট ১৯৬৫ Malaysia থেকে পৃথক হয়ে স্বাধীন ও সার্বভৌম রাষ্ট্র হয়।", "verified", "high", [refs.singapore, refs.malaysia], true),
  fact(579, "Malaysia federation — ১৬ সেপ্টেম্বর ১৯৬৩", "Singapore National Library Board-এর chronology অনুযায়ী Federation of Malaysia ১৬ সেপ্টেম্বর ১৯৬৩ গঠিত হয়।", "verified", "high", [refs.singapore], true),
  fact(580, "Qatar — ১৯৭১ independence", "U.S. Office of the Historian অনুযায়ী Qatar ৩ সেপ্টেম্বর ১৯৭১ Great Britain-এর protectorate arrangement শেষ হওয়ার পরে independence ঘোষণা করে।", "verified", "high", [refs.qatar], true),
  fact(582, "Volga — ইউরোপের দীর্ঘতম নদী", "উৎসে Volga-কে ইউরোপের দীর্ঘতম নদী বলা হয়েছে।", "source_attributed", "high"),
  fact(582, "Vatican City — ক্ষুদ্রতম স্বাধীন রাষ্ট্র", "Britannica অনুযায়ী Vatican City বিশ্বের ক্ষুদ্রতম fully independent nation-state; উৎসের area-based Europe MCQ-এর answer key Vatican City।", "verified", "high", [refs.vatican], true),
];

const notes = [
  note(579, "সিঙ্গাপুরের বিগত প্রশ্ন — quality boundary", "উৎসে *From Third World to First*, ১৯৬৩–১৯৬৫ Singapore–Malaysia chronology, British colonial history, এবং Malaysia formation নিয়ে ছয়টি MCQ আছে।\nসতর্কতা | Q03-এ keyed author-name rendering corrupted এবং Q04-এর honorary title/descriptive distractors অস্পষ্ট; দুটি withheld। Q01, Q02, Q05 ও Q06 কেবল complete options, printed key এবং date-bounded explanation-সহ রাখা হয়েছে।", "high", true, [refs.singapore]),
  note(579, "ইয়েমেন ও ফিলিপাইন — source-attribution boundary", "উৎসে Yemen-এর Sana'a, riyal, Bab el-Mandeb এবং Houthi/Ansar Allah/Prosperity Guardian প্রসঙ্গ আছে; Philippines-এর Mindanao, Corazon Aquino, colonial history ও autonomy প্রসঙ্গও আছে।\nসতর্কতা | ongoing conflict, religious/demographic language, British-rule premise, uncertain Bangsamoro reading, এবং ‘Asia-র প্রথম নারী President’ wording source-attributed অথবা withheld; কোনও current-status inference করা হয়নি।", "medium", true, [refs.aquino]),
  note(580, "এশিয়ার অন্যান্য রাষ্ট্র — source quality boundary", "উৎসে Brunei, Mongolia, Azerbaijan, Qatar ও Lebanon-এর সংক্ষিপ্ত তথ্য আছে।\nসতর্কতা | Brunei/Mongolia অংশের বহু শব্দ visually low-confidence; এগুলো withheld। Azerbaijan/Nagorno-Karabakh, religious majority, Lebanon confessional offices, river/border, এবং military-operation wording source-attributed।", "high", true, [refs.karabakh, refs.lebanon]),
  note(581, "ইউরোপ — অঞ্চলভিত্তিক দেশ-তালিকা", "উৎসের map/table-এ Europe-এর অঞ্চলভিত্তিক ৪৮টি independent country classification, Kosovo, Transcaucasian countries, এবং North Macedonia renaming note আছে।\nসতর্কতা | country total, region membership, Kosovo placement, এবং Transcaucasian grouping definition- ও geopolitical-status-dependent; table-টি কেবল source-derived reference হিসেবে রাখা হয়েছে।", "high", true),
  note(582, "ইউরোপ — তথ্যভাণ্ডার ও withheld premises", "উৎসে northern hemisphere, Volga, Italy-এর volcano, Vatican City, Russia rankings, Alps, Venice/Belgium/UK nicknames, Spain climate, এবং past-exam questions আছে।\nসতর্কতা | rank, population, superlative, nickname, industry-output, এবং Russia/Europe framing source-attributed। ‘Alps-এর সর্বোচ্চ শৃঙ্গ Mount Elbrus’ conflicting; tunnel question-এ type/date নেই; এগুলো withheld।", "high", true, [refs.vatican]),
  note(583, "যুক্তরাজ্য — সংবিধান ও Great Britain পরিভাষা", "উৎসে United Kingdom-এর official-name wording, England/Scotland/Wales/Northern Ireland, capital London, এবং Great Britain বনাম United Kingdom distinction আছে।\nসতর্কতা | constitutional, sovereignty, constituent-country এবং terminology wording source-attributed। ১৮৩৩ slavery sentence Act-এর passage, apprenticeship transition ও ১৮৩৮ full emancipation-এর chronology সম্পূর্ণ দেখায় না; এটি withheld।", "high", true, [refs.uk, refs.abolition]),
];

const mcqs = [
  mcq(579, "01", "‘From Third World to First’ বইটি কে রচনা করেন?", ["লি কুয়ান ইউ", "এ. পি. জে. আবদুল কালাম", "মাহাথির মোহাম্মদ", "অমর্ত্য সেন"], "ক", "DU খ ২৩–২৪", "high", [], true),
  mcq(579, "02", "১৯৬৫ সালে স্বাধীনতা লাভের আগে সিঙ্গাপুর কোন দেশের অংশ ছিল?", ["ইন্দোনেশিয়া", "মালয়েশিয়া", "কম্বোডিয়া", "চীন"], "খ", "DU খ ২০–২১", "high", [refs.singapore, refs.malaysia], true),
  mcq(579, "05", "সিঙ্গাপুর কোন দেশের উপনিবেশ ছিল?", ["France", "UK", "USA", "Italy"], "খ", "RAKUB সিনিয়র অফিসার–১০", "high", [refs.singapore], true),
  mcq(579, "06", "কবে মালয়েশিয়া যুক্তরাষ্ট্র গঠন হয়েছিল?", ["১৯৬১ সালে", "১৯৬৩ সালে", "১৯৬৪ সালে", "১৯৬৫ সালে"], "খ", "তথ্য মন্ত্রণালয়ের তথ্য অফিসার–০৫", "high", [refs.singapore], true),
  mcq(582, "01", "আয়তনে ইউরোপ মহাদেশের ক্ষুদ্রতম দেশ কোনটি?", ["নরওয়ে", "সুইডেন", "ভ্যাটিকান সিটি", "সান মারিনো"], "গ", "34 BCS", "high", [refs.vatican], true),
  mcq(582, "03", "পিরেনেইস পর্বত কোন কোন দেশের সীমান্তে অবস্থিত?", ["আর্জেন্টিনা–ব্রাজিল", "ইতালি–ভ্যাটিকান সিটি", "চীন–জাপান", "ফ্রান্স–স্পেন"], "ঘ", "বাংলাদেশ ব্যাংক সহকারী পরিদর্শক–০৮", "high"),
];

const chapters = [
  [74, "এশিয়ার অন্যান্য গুরুত্বপূর্ণ রাষ্ট্র", "asia-other-states", "Source-preserved Asian country reference with explicit review and verification status.", 74],
  [75, "ইউরোপ", "europe", "Source-preserved Europe reference with explicit review and verification status.", 75],
];
const topics = [
  ["asia-other-states", "এশিয়ার অন্যান্য রাষ্ট্র — সিঙ্গাপুর, ইয়েমেন ও ফিলিপাইন", "asia-other-states-singapore-yemen-philippines", 579, 1],
  ["asia-other-states", "এশিয়ার অন্যান্য রাষ্ট্র — ব্রুনাই থেকে লেবানন", "asia-other-states-west-central-reference", 580, 2],
  ["europe", "ইউরোপ — অঞ্চলভিত্তিক দেশ-তালিকা ও মানচিত্র", "europe-regional-country-map", 581, 1],
  ["europe", "ইউরোপ — তথ্যভাণ্ডার ও বিগত বছরের প্রশ্ন", "europe-reference-and-past-questions", 582, 2],
  ["europe", "যুক্তরাজ্য — পরিচিতি ও পরিভাষা উৎস-রেফারেন্স", "united-kingdom-source-reference", 583, 3],
];
const tags = [
  ["asia", "Asia", "domain", "Source-derived Asia reference."], ["europe", "Europe", "domain", "Source-derived Europe reference."], ["singapore", "Singapore", "domain", "Singapore source material."], ["yemen", "Yemen", "domain", "Yemen source material."], ["philippines", "Philippines", "domain", "Philippines source material."], ["qatar", "Qatar", "domain", "Qatar source material."], ["azerbaijan", "Azerbaijan", "domain", "Azerbaijan source material."], ["lebanon", "Lebanon", "domain", "Lebanon source material."], ["united-kingdom", "United Kingdom", "domain", "United Kingdom source material."],
  ["reference-note", "Structured source note", "content_type", "Structured source reference with explicit caveats."], ["past-exam-mcq", "Past-exam MCQ", "content_type", "MCQ with a printed source key."], ["answer-key", "Answer key", "content_type", "Correct option from the printed key."], ["map-table", "Map or table reference", "content_type", "Source-derived map/table classification."],
  ["source-attributed", "Source-attributed", "quality", "Source-preserved material without direct corroboration in this batch."], ["externally-verified", "Externally verified", "quality", "Directly corroborated by cited evidence."], ["time-sensitive", "Time-sensitive reference", "quality", "Political, institutional, territorial, religious, diplomatic, military, security, ranking, or dated source material."],
  ["dhaka-university", "University of Dhaka", "exam_source", "University of Dhaka printed examination label."], ["bangladesh-bank-exam", "Bangladesh bank examination", "exam_source", "Printed bank/competitive-examination label."], ["other-bangladesh-exam", "Other Bangladesh examination", "exam_source", "Printed examination label retained without expansion."],
];
const exam = source => {
  if (source.includes("DU")) return ["University of Dhaka", "University of Dhaka", "admission", "dhaka-university"];
  if (source.includes("ব্যাংক")) return ["Bangladesh bank examination", null, "competitive", "bangladesh-bank-exam"];
  return ["Other Bangladesh examination", null, "competitive", "other-bangladesh-exam"];
};
const entityRef = (kind, canonicalHash) => `(SELECT id FROM public.${kind === "fact" ? "gk_facts" : kind === "note" ? "gk_notes" : "gk_mcqs"} WHERE canonical_hash=${q(canonicalHash)} LIMIT 1)`;
const quality = row => row.status === "verified" ? "externally-verified" : "source-attributed";

export async function buildBatch() {
  const pages = await Promise.all(files.map(file => fs.readFile(file, "utf8").then(JSON.parse)));
  const checks = [...facts.map(row => ({ kind: "fact", claim: row.fact_text, ...row })), ...notes.map(row => ({ kind: "note", claim: row.content, ...row })), ...mcqs.map(row => ({ kind: "mcq", claim: `${row.question} — printed answer: ${row.correct}`, ...row }))];
  const audit = {
    batch_pages: BATCH_PAGES,
    pipeline_version: PIPELINE_VERSION,
    source_pages: pages.map(page => ({ page: page.source_page, review_status: "completed_image_grounded_review", image_sha256: page.source_image_sha256, overall_confidence: page.review.overall_confidence })),
    generated_facts: facts.length,
    generated_notes: notes.length,
    generated_mcqs: mcqs.length,
    generated_options: mcqs.length * 4,
    generated_flashcards: facts.length + notes.length + mcqs.length,
    verification_counts: { verified: checks.filter(row => row.status === "verified").length, conflicting: 7, source_attributed: checks.filter(row => row.status === "source_attributed").length },
    source_anomalies: [
      "All five pages were rendered at 300 DPI, transcribed with gpt-5-mini, and reviewed through all 35 ordered overlap-safe tiles.",
      "Page 579 MCQ 03 is withheld because the keyed author-name text is corrupted; MCQ 04 is withheld because honorary-title framing and distractors are unsuitable.",
      "Page 579 Philippine British-rule/Bangsamoro wording and page 580 Brunei/Mongolia source text are withheld instead of reconstructed.",
      "Page 580 territorial, religious, institutional, and military language remains source-attributed; the Lebanon river name is unreadable.",
      "Page 581 regional table counts and Kosovo/Transcaucasian classifications remain source-attributed.",
      "Page 582 Elbrus/Alps error, unbounded largest-tunnel MCQ, corrupted fire-epithet MCQ, and Kosovo location MCQ are withheld.",
      "Page 583 fully-prohibited-in-1833 slavery wording conflicts with the Act/apprenticeship/full-emancipation chronology and is withheld.",
    ],
    quality_gates: [
      "Exactly physical source pages 579–583 are imported.",
      "Every imported MCQ has four visually reviewed options and one printed key.",
      "No corrupted, ambiguous, territorial, religious, institutional, unbounded ranking, or historically unsafe MCQ is imported.",
      "Content tags use only approved categories; countries and regions use category domain.",
      "Upserts use canonical hashes and stable derived-record keys.",
    ],
  };
  const chapterSql = `INSERT INTO public.chapters (book_id,chapter_number,title,slug,description,display_order) SELECT b.id,x.chapter_number::integer,x.title,x.slug,x.description,x.display_order::integer FROM (VALUES ${values(chapters)}) x(chapter_number,title,slug,description,display_order) CROSS JOIN public.books b WHERE b.title=${q(BOOK_TITLE)} AND NOT EXISTS (SELECT 1 FROM public.chapters c WHERE c.book_id=b.id AND c.slug=x.slug);`;
  const topicSql = `INSERT INTO public.topics (chapter_id,title,slug,description,source_page,display_order) SELECT c.id,x.title,x.slug,'Source-preserved content with explicit review and verification status.',x.page::integer,x.ord::integer FROM (VALUES ${values(topics)}) x(chapter_slug,title,slug,page,ord) JOIN public.chapters c ON c.slug=x.chapter_slug AND c.book_id=(SELECT id FROM public.books WHERE title=${q(BOOK_TITLE)} LIMIT 1) WHERE NOT EXISTS (SELECT 1 FROM public.topics t WHERE t.chapter_id=c.id AND t.slug=x.slug);`;
  const printed = { 579: 522, 580: 523, 581: 524, 582: 525, 583: 526 };
  const pageSql = pages.map(page => {
    const c = ctx(page.source_page);
    const metadata = { source_image_sha256: page.source_image_sha256, extraction_model: page.model, review_status: "completed_image_grounded_review", corrections: page.review.corrections, unresolved_spans: page.review.unresolved_spans, physical_source_page: page.source_page, printed_book_page: printed[page.source_page], visual_review_report: `${workDir}/visual_review_579_583.md`, external_verification_report: `${workDir}/external_verification.md`, classification_report: `${workDir}/classification_decisions.md` };
    return `INSERT INTO public.source_pages (import_run_id,book_id,source_page,page_kind,raw_transcription,chapter_heading,topic_heading,confidence,extraction_method,model_name,notes,review_metadata) SELECT (SELECT id FROM public.import_runs WHERE pipeline_version=${q(PIPELINE_VERSION)} ORDER BY started_at DESC LIMIT 1),b.id,${page.source_page},'educational'::page_kind,${q(page.review.verified_transcript)},${q(c.chapterTitle)},${q(c.topicTitle)},${q(page.review.overall_confidence)}::confidence_level,'vision_ocr_with_image_grounded_review',${q(page.model)},'Quality-gated extraction with ordered source-tile review, withholding rules, source attribution, and explicit verification status.',${json(metadata)} FROM public.books b WHERE b.title=${q(BOOK_TITLE)} AND NOT EXISTS (SELECT 1 FROM public.source_pages s WHERE s.book_id=b.id AND s.source_page=${page.source_page});`;
  }).join("\n");
  const factSql = `WITH d(page,chapter_slug,topic_slug,title,body,status,confidence,hash) AS (VALUES ${values(facts.map(row => [row.source_page, row.chapter, row.topic, row.title, row.fact_text, row.status, row.confidence, row.canonical_hash]))}) INSERT INTO public.gk_facts (book_id,chapter_id,topic_id,title,fact_text,explanation,source_page,source_section,source_excerpt,importance,confidence,canonical_hash) SELECT b.id,c.id,t.id,d.title,d.body,CASE d.status WHEN 'verified' THEN 'Direct corroboration is recorded in the batch verification ledger.' ELSE 'Source-attributed material retained after ordered image review; it is not silently updated as a current assertion.' END,d.page::integer,d.title,d.body,3,d.confidence::confidence_level,d.hash FROM d JOIN public.books b ON b.title=${q(BOOK_TITLE)} JOIN public.chapters c ON c.book_id=b.id AND c.slug=d.chapter_slug JOIN public.topics t ON t.chapter_id=c.id AND t.slug=d.topic_slug ON CONFLICT (canonical_hash) DO UPDATE SET fact_text=EXCLUDED.fact_text,explanation=EXCLUDED.explanation,confidence=EXCLUDED.confidence;`;
  const noteSql = `WITH d(page,chapter_slug,topic_slug,title,body,confidence,hash) AS (VALUES ${values(notes.map(row => [row.source_page, row.chapter, row.topic, row.title, row.content, row.confidence, row.canonical_hash]))}) INSERT INTO public.gk_notes (book_id,chapter_id,topic_id,title,content,source_page,source_section,display_order,confidence,canonical_hash) SELECT b.id,c.id,t.id,d.title,d.body,d.page::integer,d.title,d.page::integer,d.confidence::confidence_level,d.hash FROM d JOIN public.books b ON b.title=${q(BOOK_TITLE)} JOIN public.chapters c ON c.book_id=b.id AND c.slug=d.chapter_slug JOIN public.topics t ON t.chapter_id=c.id AND t.slug=d.topic_slug ON CONFLICT (canonical_hash) DO UPDATE SET content=EXCLUDED.content,confidence=EXCLUDED.confidence;`;
  const mcqSql = mcqs.map(row => {
    const [name, institution, examType, normalizedName] = exam(row.source);
    const keys = ["ক", "খ", "গ", "ঘ"];
    const optionSql = row.options.map((option, index) => `INSERT INTO public.gk_mcq_options (mcq_id,option_key,option_text,display_order,is_correct) SELECT m.id,${q(keys[index])},${q(option)},${index + 1},${keys[index] === row.correct} FROM public.gk_mcqs m WHERE m.canonical_hash=${q(row.canonical_hash)} AND NOT EXISTS (SELECT 1 FROM public.gk_mcq_options o WHERE o.mcq_id=m.id AND o.option_key=${q(keys[index])});`).join("\n");
    const explanation = "Printed answer key retained after visual review; historical, institutional, geographic, ranking, or diplomatic context is source-attributed and bounded in the batch verification ledger.";
    return `INSERT INTO public.exam_sources (name,institution,exam_type,description,normalized_name) SELECT ${q(name)},${q(institution)},${q(examType)},${q(`Normalized from printed source label on page ${row.source_page}.`)},${q(normalizedName)} WHERE NOT EXISTS (SELECT 1 FROM public.exam_sources WHERE normalized_name=${q(normalizedName)}); INSERT INTO public.gk_mcqs (book_id,chapter_id,topic_id,question,correct_option,explanation,source_page,source_section,source_question_number,difficulty,confidence,canonical_hash) SELECT b.id,c.id,t.id,${q(row.question)},${q(row.correct)},${q(explanation)},${row.source_page},'অন্যান্য বিশ্ববিদ্যালয় ও অন্যান্য চাকুরির পরীক্ষা',${q(row.number)},3,${q(row.confidence)}::confidence_level,${q(row.canonical_hash)} FROM public.books b JOIN public.chapters c ON c.book_id=b.id AND c.slug=${q(row.chapter)} JOIN public.topics t ON t.chapter_id=c.id AND t.slug=${q(row.topic)} WHERE b.title=${q(BOOK_TITLE)} ON CONFLICT (canonical_hash) DO UPDATE SET correct_option=EXCLUDED.correct_option,explanation=EXCLUDED.explanation,confidence=EXCLUDED.confidence; ${optionSql} INSERT INTO public.gk_mcq_sources (mcq_id,exam_source_id,year,session,source_text,source_page) SELECT m.id,(SELECT id FROM public.exam_sources WHERE normalized_name=${q(normalizedName)} LIMIT 1),NULL,${q(row.source)},${q(row.source)},${row.source_page} FROM public.gk_mcqs m WHERE m.canonical_hash=${q(row.canonical_hash)} AND NOT EXISTS (SELECT 1 FROM public.gk_mcq_sources s WHERE s.mcq_id=m.id AND s.source_text=${q(row.source)} AND s.source_page=${row.source_page});`;
  }).join("\n");
  const assignment = (kind, row, tagSlugs) => tagSlugs.map(tag => `INSERT INTO public.content_tag_assignments (tag_id,entity_type,entity_id,source_page,confidence,assigned_by) SELECT t.id,${q(kind)},${entityRef(kind, row.canonical_hash)},${row.source_page},${q(row.confidence)}::confidence_level,'batch-0579-0583-quality-pipeline' FROM public.content_tags t WHERE t.slug=${q(tag)} ON CONFLICT DO NOTHING;`).join("\n");
  const noteTags = row => row.source_page === 581 ? ["europe", "map-table", "reference-note", "source-attributed", "time-sensitive"] : [row.domain === "europe" ? "europe" : "asia", row.domain === "united-kingdom" ? "united-kingdom" : "reference-note", "reference-note", "source-attributed", ...(row.timeSensitive ? ["time-sensitive"] : [])];
  const tagSql = `INSERT INTO public.content_tags (slug,label,category,description) VALUES ${tags.map(row => `(${row.map(q).join(",")})`).join(",")} ON CONFLICT (slug) DO UPDATE SET label=EXCLUDED.label,category=EXCLUDED.category,description=EXCLUDED.description;
${facts.map(row => assignment("fact", row, [row.domain === "europe" ? "europe" : "asia", ...(row.source_page === 579 ? ["singapore"] : []), quality(row), ...(row.timeSensitive ? ["time-sensitive"] : [])])).join("\n")}
${notes.map(row => assignment("note", row, noteTags(row))).join("\n")}
${mcqs.map(row => assignment("mcq", row, [row.domain === "europe" ? "europe" : "asia", "past-exam-mcq", "answer-key", exam(row.source)[3], quality(row), ...(row.timeSensitive ? ["time-sensitive"] : [])])).join("\n")}`;
  const verificationSql = checks.map(row => `INSERT INTO public.fact_verifications (source_page,entity_type,entity_id,claim_text,normalized_claim,verification_status,confidence,verification_sources,audit_note) SELECT ${row.source_page},${q(row.kind)},${entityRef(row.kind, row.canonical_hash)},${q(row.claim)},NULL,${q(row.status)},${q(row.confidence)}::confidence_level,${json(row.sources)},${q(row.status === "verified" ? "Direct corroboration is listed in the batch verification ledger." : "Source-attributed record retained with ordered image-grounded validation and explicit source linkage.")} WHERE NOT EXISTS (SELECT 1 FROM public.fact_verifications v WHERE v.entity_type=${q(row.kind)} AND v.entity_id=${entityRef(row.kind, row.canonical_hash)} AND v.claim_text=${q(row.claim)});`).join("\n");
  const derivedSql = `INSERT INTO public.flashcards (subject_id,book_id,chapter_id,topic_id,front_text,back_text,source_type,source_id,source_key) SELECT (SELECT id FROM public.subjects ORDER BY created_at ASC LIMIT 1),f.book_id,f.chapter_id,f.topic_id,f.title,f.fact_text,'fact',f.id,'batch0579-0583:fact:'||f.id::text FROM public.gk_facts f WHERE f.source_page BETWEEN 579 AND 583 AND NOT EXISTS (SELECT 1 FROM public.flashcards c WHERE c.source_key='batch0579-0583:fact:'||f.id::text); INSERT INTO public.flashcards (subject_id,book_id,chapter_id,topic_id,front_text,back_text,source_type,source_id,source_key) SELECT (SELECT id FROM public.subjects ORDER BY created_at ASC LIMIT 1),n.book_id,n.chapter_id,n.topic_id,n.title,n.content,'note',n.id,'batch0579-0583:note:'||n.id::text FROM public.gk_notes n WHERE n.source_page BETWEEN 579 AND 583 AND NOT EXISTS (SELECT 1 FROM public.flashcards c WHERE c.source_key='batch0579-0583:note:'||n.id::text); INSERT INTO public.flashcards (subject_id,book_id,chapter_id,topic_id,front_text,back_text,source_type,source_id,source_key) SELECT (SELECT id FROM public.subjects ORDER BY created_at ASC LIMIT 1),m.book_id,m.chapter_id,m.topic_id,m.question,'সঠিক উত্তর: '||o.option_key||'. '||o.option_text,'mcq',m.id,'batch0579-0583:mcq:'||m.id::text FROM public.gk_mcqs m JOIN public.gk_mcq_options o ON o.mcq_id=m.id AND o.is_correct WHERE m.source_page IN (579,582) AND NOT EXISTS (SELECT 1 FROM public.flashcards c WHERE c.source_key='batch0579-0583:mcq:'||m.id::text); INSERT INTO public.search_documents (entity_type,entity_id,title,body,english_metadata) SELECT 'fact',f.id,f.title,f.fact_text,'Status-marked GK fact | source page '||f.source_page::text FROM public.gk_facts f WHERE f.source_page BETWEEN 579 AND 583 AND NOT EXISTS (SELECT 1 FROM public.search_documents d WHERE d.entity_type='fact' AND d.entity_id=f.id); INSERT INTO public.search_documents (entity_type,entity_id,title,body,english_metadata) SELECT 'note',n.id,n.title,n.content,'Structured source reference | source page '||n.source_page::text FROM public.gk_notes n WHERE n.source_page BETWEEN 579 AND 583 AND NOT EXISTS (SELECT 1 FROM public.search_documents d WHERE d.entity_type='note' AND d.entity_id=n.id); INSERT INTO public.search_documents (entity_type,entity_id,title,body,english_metadata) SELECT 'mcq',m.id,NULL,m.question,'Past-exam MCQ | source page '||m.source_page::text||' | question '||m.source_question_number FROM public.gk_mcqs m WHERE m.source_page IN (579,582) AND NOT EXISTS (SELECT 1 FROM public.search_documents d WHERE d.entity_type='mcq' AND d.entity_id=m.id);`;
  const sql = `-- Generated by prepare_validated_batch_0579_0583.mjs. Source pages 579–583 only.\nBEGIN;\nINSERT INTO public.import_runs (source_filename,source_sha256,pipeline_version,status,completed_at,audit) VALUES ('Jubayer''sgk.pdf',${q(hash(pages.map(page => page.source_image_sha256).join("|")))},${q(PIPELINE_VERSION)},'completed',now(),${json(audit)});\n${chapterSql}\n${topicSql}\n${pageSql}\n${factSql}\n${noteSql}\n${mcqSql}\n${tagSql}\n${verificationSql}\n${derivedSql}\nCOMMIT;`;
  return { sql, audit };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const { sql, audit } = await buildBatch();
  const counts = { batch_pages: BATCH_PAGES, review_tiles: 35, eligible_mcqs: mcqs.length, eligible_mcq_options: mcqs.length * 4, withheld_mcqs: 5, fact_candidates: facts.length, note_candidates: notes.length, verification_statuses: audit.verification_counts };
  await fs.mkdir(outputDir, { recursive: true });
  await fs.writeFile(path.join(outputDir, "validated_import.sql"), sql);
  await fs.writeFile(path.join(outputDir, "batch_audit.json"), JSON.stringify(audit, null, 2));
  await fs.writeFile(path.join(outputDir, "execute_sql_request.json"), JSON.stringify({ project_id: "rennotctgrxvbpghbimx", query: sql }));
  await fs.writeFile(path.join(workDir, "import_input_counts.json"), JSON.stringify(counts, null, 2));
  console.log(JSON.stringify({ outputDir, ...audit, counts }, null, 2));
}
