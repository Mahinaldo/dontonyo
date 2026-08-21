import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const workDir = "/home/ubuntu/dontonyo-work/batch-0599-0603";
const outDir = path.join(root, "supabase", "batch-0599-0603");
const BOOK = "Jubayer's GK";
export const BATCH_PAGES = [599, 600, 601, 602, 603];
export const PIPELINE_VERSION = "vision-quality-gated-batch-0599-0603-v1";
const q = value => `'${String(value ?? "").replaceAll("'", "''")}'`;
const json = value => `${q(JSON.stringify(value))}::jsonb`;
const hash = value => crypto.createHash("sha256").update(value, "utf8").digest("hex");
const tuple = rows => rows.map(row => `(${row.map(q).join(",")})`).join(",\n");
const ref = {
  locSoviet: "https://www.loc.gov/exhibits/archives/sovi.html",
  locInternal: "https://www.loc.gov/exhibits/archives/intn.html",
  nsaGorbachev: "https://nsarchive.gwu.edu/briefing-book/2016-03-02/gorbachev-file",
  berlinWall: "https://www.stiftung-berliner-mauer.de/en/topics/berlin-wall",
};

const context = page => {
  if (page === 599) return { chapter: "europe", topic: "marx-engels-and-marxism-source-reference", domain: "europe" };
  if (page === 600) return { chapter: "europe", topic: "germany-berlin-wall-past-questions-reference", domain: "germany" };
  if (page <= 602) return { chapter: "europe", topic: "russia-ussr-and-russian-revolution-reference", domain: "russia" };
  return { chapter: "europe", topic: "lenin-stalin-gorbachev-reference", domain: "russia" };
};
const fact = (page, title, text, status = "source_attributed", sources = [], confidence = "high") => ({ source_page: page, title, text, status, sources, confidence, ...context(page), hash: hash(`fact|${page}|${title}|${text}`) });
const note = (page, title, text, status = "source_attributed", sources = [], confidence = "high") => ({ source_page: page, title, text, status, sources, confidence, ...context(page), hash: hash(`note|${page}|${title}|${text}`) });
const mcq = (number, question, options, correct, source, status = "source_attributed", sources = []) => ({ source_page: 600, number, question, options, correct, source, status, sources, confidence: "high", ...context(600), hash: hash(`mcq|600|${number}|${question}`) });

const facts = [
  fact(599, "Karl Marx — Prussian birth reference", "উৎসে Karl Marx-এর জন্ম German Prussia-তে বলা হয়েছে।"),
  fact(599, "Communist Manifesto — Marx and Engels association", "উৎসে *Communist Manifesto* Karl Marx ও Friedrich Engels-এর যৌথ রাজনৈতিক গ্রন্থ হিসেবে উল্লেখ আছে।"),
  fact(599, "Karl Marx — The Poverty of Philosophy", "উৎসে *The Poverty of Philosophy* Karl Marx-এর উল্লেখযোগ্য গ্রন্থ হিসেবে আছে।"),
  fact(599, "Karl Marx — Das Kapital", "উৎসে *Das Kapital* Karl Marx-এর উল্লেখযোগ্য গ্রন্থ হিসেবে আছে; অস্পষ্ট বাংলা gloss সংরক্ষণ করা হয়নি।"),
  fact(599, "Friedrich Engels — German philosopher reference", "উৎসে Friedrich Engels-কে একজন German philosopher হিসেবে উল্লেখ করা হয়েছে।"),
  fact(599, "Marxism — source association", "উৎসে Marxism-কে Karl Marx ও Friedrich Engels-এর মতবাদের সঙ্গে যুক্ত করা হয়েছে; এটি source-attributed ideological reference।"),
  fact(601, "Russia — largest country by area source reference", "উৎসে Russia-কে আয়তনে বিশ্বের বৃহত্তম দেশ বলা হয়েছে।"),
  fact(601, "Russia — fourteen land-neighbour reference", "উৎসে Russia-এর ১৪টি দেশের সঙ্গে স্থলসীমান্তের উল্লেখ আছে।", "source_attributed", [], "medium"),
  fact(601, "Russia — Europe and Asia geography", "উৎসে Russia-কে Europe ও Asia—দুই মহাদেশে অবস্থিত বলা হয়েছে।"),
  fact(601, "USSR — 1922 formation source reference", "উৎসে Soviet Union/USSR গঠনের বছর ১৯২২ বলা হয়েছে; এটি historic state contextে রাখা হয়েছে।"),
  fact(601, "USSR — fifteen-republic historic reference", "উৎসে USSR-কে ১৫টি Soviet republic-এর federation হিসেবে বর্ণনা করা হয়েছে; এটি তার শেষ-পর্বের historic reference হিসেবে রাখা হয়েছে।", "source_attributed", [], "medium"),
  fact(601, "USSR — formal dissolution on 26 December 1991", "উৎসে Soviet Union-এর আনুষ্ঠানিক dissolution-এর তারিখ ২৬ ডিসেম্বর ১৯৯১ বলা হয়েছে; এটি historic contextে রাখা হয়েছে।", "source_attributed", [ref.locSoviet]),
  fact(601, "Russian Federation — largest successor-state source reference", "উৎসে former USSR states-এর মধ্যে Russian Federation/Russia-কে বৃহত্তম বলা হয়েছে; এটি source-attributed historic reference।"),
  fact(601, "USSR — full-form expansion", "উৎসে USSR-এর পূর্ণরূপ `Union of Soviet Socialist Republics` দেওয়া হয়েছে।"),
  fact(601, "Chernobyl — 1986 accident source reference", "উৎসে Chernobyl nuclear-power accident-এর বছর ১৯৮৬ বলা হয়েছে; এটি Soviet-era source contextে রাখা হয়েছে।"),
  fact(601, "Boris Yeltsin — 1991–1999 presidential tenure source reference", "উৎসে Boris Yeltsin-এর presidential tenure ১৯৯১–১৯৯৯ বলা হয়েছে; `first democratic` superlative বাদ দেওয়া হয়েছে।", "source_attributed", [], "medium"),
  fact(601, "Peter the Great — first Russian emperor", "উৎসে Peter the Great-কে Russia-এর প্রথম emperor বলা হয়েছে; এটি historic monarchy contextে রাখা হয়েছে।"),
  fact(601, "Tsar — historic Russian ruler title", "উৎসে Russian monarchs-এর historic title হিসেবে Tsar উল্লেখ আছে।"),
  fact(601, "Lenin Mausoleum — Red Square source reference", "উৎসে Vladimir Lenin-এর সংরক্ষিত দেহ Moscow-এর Red Square-এর Lenin Mausoleum-এ উল্লেখ আছে; এটি location reference হিসেবে সীমাবদ্ধ।", "source_attributed", [], "medium"),
  fact(602, "Russian Revolution — 1917", "উৎসে Russian Revolution-এর বছর ১৯১৭ বলা হয়েছে।", "verified", [ref.locSoviet]),
  fact(602, "Bolsheviks — Lenin and November 1917 seizure of power", "Library of Congress অনুযায়ী Vladimir Lenin-এর Bolshevik wing November 1917-এ Petrograd-এ power seize করে; এটি historic event reference।", "verified", [ref.locSoviet]),
  fact(602, "Russian Revolution — October and Bolshevik labels", "উৎসে Russian Revolution-কে October Revolution ও Bolshevik Revolution নামেও উল্লেখ করা হয়েছে।"),
  fact(602, "Petrograd — historical Saint Petersburg reference", "উৎসে Petrograd-কে বর্তমান Saint Petersburg-এর historic name/context হিসেবে উল্লেখ করা হয়েছে।"),
  fact(602, "Nicholas II — Tsar during 1917 Revolution", "উৎসে 1917 Russian Revolution-এর সময় Nicholas II-কে Tsar বলা হয়েছে; এটি historic monarchy contextে রাখা হয়েছে।"),
  fact(602, "Tsarist system — 1917 fall reference", "উৎসে Russia-এর Tsarist system-এর পতন ১৯১৭ সালে বলা হয়েছে; এটি historic reference।"),
  fact(602, "Red Guards — revolution-era source reference", "উৎসে Red Guards-কে Russian Revolution-era revolutionary force হিসেবে উল্লেখ করা হয়েছে; এটি source-attributed historic reference।", "source_attributed", [], "medium"),
  fact(603, "Vladimir Lenin — full name", "উৎসে Vladimir Lenin-এর পূর্ণ নাম Vladimir Ilyich Ulyanov Lenin বলা হয়েছে।"),
  fact(603, "Vladimir Lenin — 1924 death", "উৎসে Vladimir Lenin-এর মৃত্যুর বছর ১৯২৪ বলা হয়েছে।"),
  fact(603, "Lenin — New Economic Policy", "উৎসে Lenin-এর সঙ্গে New Economic Policy (NEP) প্রবর্তনের উল্লেখ আছে; এটি historic policy reference।"),
  fact(603, "Lenin work — The State and Revolution", "উৎসে *The State and Revolution* Lenin-এর উল্লেখযোগ্য গ্রন্থ হিসেবে আছে।"),
  fact(603, "Lenin work — Imperialism, the Highest Stage of Capitalism", "উৎসে *Imperialism, the Highest Stage of Capitalism* Lenin-এর উল্লেখযোগ্য গ্রন্থ হিসেবে আছে।"),
  fact(603, "Lenin work — Left-Wing Communism", "উৎসে *Left-Wing Communism* Lenin-এর উল্লেখযোগ্য গ্রন্থ হিসেবে মুদ্রিত আছে; পূর্ণ subtitle scan-এ নেই।"),
  fact(603, "Lenin work — The Development of Capitalism in Russia", "উৎসে *The Development of Capitalism in Russia* Lenin-এর উল্লেখযোগ্য গ্রন্থ হিসেবে আছে।"),
  fact(603, "Great Terror — Stalin-era historic context", "Library of Congress অনুযায়ী 1930-এর দশকের Great Terror Stalin-এর absolute dominance নিশ্চিত করার police terror ছিল; এটি historic repression contextে রাখা হয়েছে।", "verified", [ref.locInternal]),
  fact(603, "Mikhail Gorbachev — final Soviet President", "National Security Archive Gorbachev-কে Soviet Union-এর first and last President হিসেবে বর্ণনা করে; এটি historic office contextে রাখা হয়েছে।", "verified", [ref.nsaGorbachev]),
  fact(603, "Soviet collapse — 1991 Gorbachev tenure context", "Library of Congress ও National Security Archive 1991 Soviet collapse-এর historic Gorbachev-era context দেয়; একক-কারণ assertion করা হয়নি।", "verified", [ref.locInternal, ref.nsaGorbachev]),
  fact(603, "Glasnost and Perestroika — historic reform terms", "উৎসে Gorbachev-এর সঙ্গে Glasnost ও Perestroika উল্লেখ আছে; National Security Archive reform contextে Perestroika বর্ণনা করে।", "verified", [ref.locInternal, ref.nsaGorbachev]),
  fact(603, "Perestroika — 1987 reform-programme source reference", "উৎসে Gorbachev ১৯৮৭ সালে রাজনৈতিক ও অর্থনৈতিক reform programme চালু করেন বলা হয়েছে; এটি source-attributed historic reference।", "source_attributed", [], "medium"),
];

const notes = [
  note(599, "Marx and Engels — ideological and quotation boundary", "Source-visible Marx/Engels works are retained. `father` labels, class-struggle theory summaries, production/culture claims, labor/exploitation assertion, and quotations are not transformed into neutral learner facts."),
  note(600, "Berlin Wall past-exam block — historic boundary", "Only Q01–Q06 and Q08 meet the complete stem/options/key and historical-consistency threshold. Berlin Wall and reunification wording is stored as historic Cold War material, not current political description.", "verified", [ref.berlinWall]),
  note(601, "Russia and USSR — political and territorial boundary", "USSR formation, republic count, dissolution, and successor-state wording are historic source material. No Soviet or Russia-era political label is stated as a timeless contemporary fact."),
  note(601, "Russia source conflicts — withheld", "The scan’s `father of World War II` claim, Stalin/Mussolini Molotov–Ribbentrop signatory line, unclear 1917 republic wording, beard-tax line, and 1710 capital-move claim are withheld rather than corrected into detached facts."),
  note(602, "Russian Revolution — political-history boundary", "The batch retains only bounded chronology, people, historical labels, and location context. Land-seizure quantity, property declaration, military/alignment claims, ten-day duration, and first-socialist-country superlative are withheld."),
  note(603, "Lenin and Stalin — historical-context boundary", "Lenin bibliographic/policy references are retained. RSDLP founding wording, the unreadable 1924 line, incomplete mausoleum claim, *Pravda* control wording, and unqualified Five-Year-Plan statement are withheld. Great Terror is preserved only in evidence-backed historic context.", "verified", [ref.locSoviet, ref.locInternal]),
  note(603, "Gorbachev — reform and collapse boundary", "Gorbachev’s final Soviet presidency and reform-era context are retained. The Thatcher quotation is incomplete and withheld; neither Glasnost nor Perestroika is presented as a sole cause of the USSR’s collapse.", "verified", [ref.locInternal, ref.nsaGorbachev]),
  note(603, "Nazi and Soviet terminology safety", "The batch does not reproduce political propaganda, ideological slogans, or collective-blame formulations as study facts. All state-system and repression references retain explicit historic scope."),
];

const mcqs = [
  mcq("01", "বার্লিন প্রাচীর কোন সালে নির্মিত হয়েছিল?", ["১৯৪৬", "১৯৪৮", "১৯৬১", "১৯৬২"], "গ", "DU খ 2000–01, 2002–03; 16 BCS", "verified", [ref.berlinWall]),
  mcq("02", "বার্লিন প্রাচীরের পতন হয়—", ["১৯৮৮", "১৯৮৯", "১৯৯০", "১৯৯২"], "খ", "DU খ 2003–04", "verified", [ref.berlinWall]),
  mcq("03", "১৯৯০ সালের কোন তারিখে পূর্ব ও পশ্চিম জার্মানি পুনরায় একটি রাষ্ট্র গঠন করে?", ["২ অক্টোবর (সকালে)", "২ অক্টোবর (মাঝরাতে)", "১ অক্টোবর (দুপুরে)", "৩ অক্টোবর (মাঝরাতে)"], "ঘ", "DU খ 1997–98; 13 BCS"),
  mcq("04", "জার্মানির প্রথম নারী চ্যান্সেলর কে?", ["অ্যাঙ্গেলার ক্র্যাম্প", "লিনা হেডরিচ", "অ্যাঞ্জেলা মার্কেল", "পেট্রা কেলি"], "গ", "41 BCS"),
  mcq("05", "বার্লিন প্রাচীর তৈরি করেছিলেন—", ["সাবেক পূর্ব জার্মানি", "সাবেক পশ্চিম জার্মানি", "দুই জার্মানি একত্রে", "রাশিয়া"], "ক", "Printed source line partly blurred; 2005 visible", "verified", [ref.berlinWall]),
  mcq("06", "বার্লিন প্রাচীর ভেঙ্গে ফেলা হয়—", ["১৯৮৮ সালের ২২ ফেব্রুয়ারি", "১৯৮৯ সালের ৯ নভেম্বর", "১৯৮৯ সালের ১৯ নভেম্বর", "১৯৮৮ সালের ৯ নভেম্বর"], "খ", "Jagannath University খ 2013–14", "verified", [ref.berlinWall]),
  mcq("08", "বিস্মার্ক কে ছিলেন?", ["ফ্রান্সের প্রেসিডেন্ট", "জার্মানির চ্যান্সেলর", "ইংল্যান্ডের প্রধানমন্ত্রী", "অস্ট্রিয়ার প্রধানমন্ত্রী"], "খ", "Thana Election Officer, 2004"),
];

const topics = [
  ["europe", "Marx, Engels ও Marxism source reference", "marx-engels-and-marxism-source-reference", 599, 13],
  ["europe", "Germany ও Berlin Wall past-question reference", "germany-berlin-wall-past-questions-reference", 600, 14],
  ["europe", "Russia, USSR ও Russian Revolution reference", "russia-ussr-and-russian-revolution-reference", 601, 15],
  ["europe", "Lenin, Stalin ও Gorbachev reference", "lenin-stalin-gorbachev-reference", 603, 16],
];
const tags = [
  ["europe", "Europe", "domain", "Europe source material."], ["germany", "Germany", "domain", "Germany source material."], ["russia", "Russia and USSR historical reference", "domain", "Russia/USSR source material."],
  ["reference-note", "Structured source note", "content_type", "Bounded source reference with caveats."], ["past-exam-mcq", "Past-exam MCQ", "content_type", "Source-complete past-exam item."], ["answer-key", "Printed answer key", "content_type", "Visually reviewed printed answer key."],
  ["source-attributed", "Source-attributed", "quality", "Source-preserved record without direct corroboration in this batch."], ["externally-verified", "Externally verified", "quality", "Directly corroborated record."], ["historic-scope", "Historic scope", "quality", "Historic political, institutional, or territorial reference."],
  ["dhaka-university", "University of Dhaka", "exam_source", "Printed University of Dhaka source label."], ["bcs", "Bangladesh Civil Service", "exam_source", "Printed BCS source label."], ["mixed-exam-source", "Mixed printed examination source", "exam_source", "Multiple printed source labels in one MCQ."], ["other-bangladesh-exam", "Other Bangladesh examination", "exam_source", "Other printed examination source label."],
];
const sourceMeta = source => source.includes("DU") && source.includes("BCS") ? ["Mixed printed exam source", null, "competitive", "mixed-exam-source"] : source.includes("DU") ? ["University of Dhaka", "University of Dhaka", "admission", "dhaka-university"] : source.includes("BCS") ? ["Bangladesh Civil Service", null, "competitive", "bcs"] : ["Other Bangladesh examination", null, "competitive", "other-bangladesh-exam"];
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
    source_anomalies: ["All five source pages were rendered at 300 DPI, transcribed with gpt-5-mini, and reviewed through all 35 ordered overlap-safe tiles.", "Pages 599–603 retain 38 facts, eight scope notes, and seven complete past-exam MCQs; five unsafe MCQs were withheld.", "Ideological quotations, distorted Soviet claims, an incorrect Stalin office label, political simplifications, corrupted questions, and an incomplete Thatcher quotation were withheld.", "Political, institutional, military, territorial, and repression content is stored only with historic scope and explicit verification status."],
    quality_gates: ["Exactly physical source pages 599–603 are imported.", "Every imported MCQ has four visually reviewed options and exactly one printed source key.", "No corrupted, ambiguous, unsafe, historically inconsistent, duplicated, or ideologically unbounded MCQ is imported.", "Content tag categories are limited to the database-approved taxonomy.", "All upserts use stable canonical hashes and batch-scoped derived-record keys."],
  };
  const topicSql = `INSERT INTO public.topics (chapter_id,title,slug,description,source_page,display_order) SELECT c.id,x.title,x.slug,'Source-preserved content with complete visual review and explicit verification status.',x.page::integer,x.ord::integer FROM (VALUES ${tuple(topics)}) x(chapter_slug,title,slug,page,ord) JOIN public.chapters c ON c.slug=x.chapter_slug AND c.book_id=(SELECT id FROM public.books WHERE title=${q(BOOK)} LIMIT 1) WHERE NOT EXISTS (SELECT 1 FROM public.topics t WHERE t.chapter_id=c.id AND t.slug=x.slug);`;
  const printPage = { 599: 602, 600: 603, 601: 604, 602: 605, 603: 606 };
  const pageSql = pages.map(page => { const c = context(page.source_page); const meta = { physical_source_page: page.source_page, printed_book_page: printPage[page.source_page], source_image_sha256: page.source_image_sha256, extraction_model: page.model, review_status: "completed_image_grounded_review", review_report: `${workDir}/visual_review_599_603.md`, classification_report: `${workDir}/classification_decisions.md`, verification_report: `${workDir}/external_verification.md`, original_ocr_review_status: page.review.review_status, unresolved_spans: page.review.unresolved_spans }; return `INSERT INTO public.source_pages (import_run_id,book_id,source_page,page_kind,raw_transcription,chapter_heading,topic_heading,confidence,extraction_method,model_name,notes,review_metadata) SELECT (SELECT id FROM public.import_runs WHERE pipeline_version=${q(PIPELINE_VERSION)} ORDER BY started_at DESC LIMIT 1),b.id,${page.source_page},'educational'::page_kind,${q(page.transcription.verbatim_transcript)},${q("Europe")},${q(c.topic)},${q(page.review.overall_confidence)}::confidence_level,'vision_ocr_with_image_grounded_review',${q(page.model)},'Ordered 300-DPI source-tile review completed; import uses only classified records.',${json(meta)} FROM public.books b WHERE b.title=${q(BOOK)} AND NOT EXISTS (SELECT 1 FROM public.source_pages s WHERE s.book_id=b.id AND s.source_page=${page.source_page});`; }).join("\n");
  const factSql = `WITH d(page,chapter_slug,topic_slug,title,body,confidence,canonical_hash) AS (VALUES ${tuple(facts.map(item => [item.source_page, item.chapter, item.topic, item.title, item.text, item.confidence, item.hash]))}) INSERT INTO public.gk_facts (book_id,chapter_id,topic_id,title,fact_text,explanation,source_page,source_section,source_excerpt,importance,confidence,canonical_hash) SELECT b.id,c.id,t.id,d.title,d.body,'Source-derived historic reference with explicit batch verification status.',d.page::integer,d.title,d.body,3,d.confidence::confidence_level,d.canonical_hash FROM d JOIN public.books b ON b.title=${q(BOOK)} JOIN public.chapters c ON c.book_id=b.id AND c.slug=d.chapter_slug JOIN public.topics t ON t.chapter_id=c.id AND t.slug=d.topic_slug ON CONFLICT (canonical_hash) DO UPDATE SET fact_text=EXCLUDED.fact_text,explanation=EXCLUDED.explanation,confidence=EXCLUDED.confidence;`;
  const noteSql = `WITH d(page,chapter_slug,topic_slug,title,body,confidence,canonical_hash) AS (VALUES ${tuple(notes.map(item => [item.source_page, item.chapter, item.topic, item.title, item.text, item.confidence, item.hash]))}) INSERT INTO public.gk_notes (book_id,chapter_id,topic_id,title,content,source_page,source_section,display_order,confidence,canonical_hash) SELECT b.id,c.id,t.id,d.title,d.body,d.page::integer,d.title,d.page::integer,d.confidence::confidence_level,d.canonical_hash FROM d JOIN public.books b ON b.title=${q(BOOK)} JOIN public.chapters c ON c.book_id=b.id AND c.slug=d.chapter_slug JOIN public.topics t ON t.chapter_id=c.id AND t.slug=d.topic_slug ON CONFLICT (canonical_hash) DO UPDATE SET content=EXCLUDED.content,confidence=EXCLUDED.confidence;`;
  const mcqSql = mcqs.map(item => { const [name, institution, examType, normalized] = sourceMeta(item.source); const keys = ["ক", "খ", "গ", "ঘ"]; const options = item.options.map((option, index) => `INSERT INTO public.gk_mcq_options (mcq_id,option_key,option_text,display_order,is_correct) SELECT m.id,${q(keys[index])},${q(option)},${index + 1},${keys[index] === item.correct} FROM public.gk_mcqs m WHERE m.canonical_hash=${q(item.hash)} AND NOT EXISTS (SELECT 1 FROM public.gk_mcq_options o WHERE o.mcq_id=m.id AND o.option_key=${q(keys[index])});`).join("\n"); const explanation = item.status === "verified" ? "Printed key visually reviewed; historic claim corroboration and scope are recorded in the batch ledger." : "Printed key visually reviewed; source-attributed historic question retained with explicit scope."; return `INSERT INTO public.exam_sources (name,institution,exam_type,description,normalized_name) SELECT ${q(name)},${q(institution)},${q(examType)},${q(`Normalized from printed source label on page ${item.source_page}.`)},${q(normalized)} WHERE NOT EXISTS (SELECT 1 FROM public.exam_sources WHERE normalized_name=${q(normalized)}); INSERT INTO public.gk_mcqs (book_id,chapter_id,topic_id,question,correct_option,explanation,source_page,source_section,source_question_number,difficulty,confidence,canonical_hash) SELECT b.id,c.id,t.id,${q(item.question)},${q(item.correct)},${q(explanation)},${item.source_page},'এই অধ্যায়ের সাথে জড়িত বিগত বছরের প্রশ্ন',${q(item.number)},3,'high'::confidence_level,${q(item.hash)} FROM public.books b JOIN public.chapters c ON c.book_id=b.id AND c.slug=${q(item.chapter)} JOIN public.topics t ON t.chapter_id=c.id AND t.slug=${q(item.topic)} WHERE b.title=${q(BOOK)} ON CONFLICT (canonical_hash) DO UPDATE SET correct_option=EXCLUDED.correct_option,explanation=EXCLUDED.explanation,confidence=EXCLUDED.confidence; ${options} INSERT INTO public.gk_mcq_sources (mcq_id,exam_source_id,year,session,source_text,source_page) SELECT m.id,(SELECT id FROM public.exam_sources WHERE normalized_name=${q(normalized)} LIMIT 1),NULL,${q(item.source)},${q(item.source)},${item.source_page} FROM public.gk_mcqs m WHERE m.canonical_hash=${q(item.hash)} AND NOT EXISTS (SELECT 1 FROM public.gk_mcq_sources s WHERE s.mcq_id=m.id AND s.source_text=${q(item.source)} AND s.source_page=${item.source_page});`; }).join("\n");
  const assign = (kind, item, slugs) => slugs.map(slug => `INSERT INTO public.content_tag_assignments (tag_id,entity_type,entity_id,source_page,confidence,assigned_by) SELECT t.id,${q(kind)},${entity(kind, item)},${item.source_page},${q(item.confidence)}::confidence_level,'batch-0599-0603-quality-pipeline' FROM public.content_tags t WHERE t.slug=${q(slug)} ON CONFLICT DO NOTHING;`).join("\n");
  const tagSql = `INSERT INTO public.content_tags (slug,label,category,description) VALUES ${tags.map(row => `(${row.map(q).join(",")})`).join(",")} ON CONFLICT (slug) DO UPDATE SET label=EXCLUDED.label,category=EXCLUDED.category,description=EXCLUDED.description;
${facts.map(item => assign("fact", item, ["europe", item.domain, quality(item), "historic-scope"])).join("\n")}
${notes.map(item => assign("note", item, ["europe", item.domain, "reference-note", quality(item), "historic-scope"])).join("\n")}
${mcqs.map(item => assign("mcq", item, ["europe", item.domain, "past-exam-mcq", "answer-key", sourceMeta(item.source)[3], quality(item), "historic-scope"])).join("\n")}`;
  const verificationSql = records.map(({ kind, item, claim }) => `INSERT INTO public.fact_verifications (source_page,entity_type,entity_id,claim_text,normalized_claim,verification_status,confidence,verification_sources,audit_note) SELECT ${item.source_page},${q(kind)},${entity(kind, item)},${q(claim)},NULL,${q(item.status)},${q(item.confidence)}::confidence_level,${json(item.sources)},${q(item.status === "verified" ? "Direct corroboration and historic boundary are recorded in the batch verification ledger." : "Source-attributed record retained after complete image review and conservative classification.")} WHERE NOT EXISTS (SELECT 1 FROM public.fact_verifications v WHERE v.entity_type=${q(kind)} AND v.entity_id=${entity(kind, item)} AND v.claim_text=${q(claim)});`).join("\n");
  const derivedSql = `INSERT INTO public.flashcards (subject_id,book_id,chapter_id,topic_id,front_text,back_text,source_type,source_id,source_key) SELECT (SELECT id FROM public.subjects ORDER BY created_at ASC LIMIT 1),f.book_id,f.chapter_id,f.topic_id,f.title,f.fact_text,'fact',f.id,'batch0599-0603:fact:'||f.id::text FROM public.gk_facts f WHERE f.source_page BETWEEN 599 AND 603 AND NOT EXISTS (SELECT 1 FROM public.flashcards c WHERE c.source_key='batch0599-0603:fact:'||f.id::text); INSERT INTO public.flashcards (subject_id,book_id,chapter_id,topic_id,front_text,back_text,source_type,source_id,source_key) SELECT (SELECT id FROM public.subjects ORDER BY created_at ASC LIMIT 1),n.book_id,n.chapter_id,n.topic_id,n.title,n.content,'note',n.id,'batch0599-0603:note:'||n.id::text FROM public.gk_notes n WHERE n.source_page BETWEEN 599 AND 603 AND NOT EXISTS (SELECT 1 FROM public.flashcards c WHERE c.source_key='batch0599-0603:note:'||n.id::text); INSERT INTO public.flashcards (subject_id,book_id,chapter_id,topic_id,front_text,back_text,source_type,source_id,source_key) SELECT (SELECT id FROM public.subjects ORDER BY created_at ASC LIMIT 1),m.book_id,m.chapter_id,m.topic_id,m.question,'সঠিক উত্তর: '||o.option_key||'. '||o.option_text,'mcq',m.id,'batch0599-0603:mcq:'||m.id::text FROM public.gk_mcqs m JOIN public.gk_mcq_options o ON o.mcq_id=m.id AND o.is_correct WHERE m.source_page BETWEEN 599 AND 603 AND NOT EXISTS (SELECT 1 FROM public.flashcards c WHERE c.source_key='batch0599-0603:mcq:'||m.id::text); INSERT INTO public.search_documents (entity_type,entity_id,title,body,english_metadata) SELECT 'fact',f.id,f.title,f.fact_text,'Status-marked GK fact | source page '||f.source_page::text FROM public.gk_facts f WHERE f.source_page BETWEEN 599 AND 603 AND NOT EXISTS (SELECT 1 FROM public.search_documents d WHERE d.entity_type='fact' AND d.entity_id=f.id); INSERT INTO public.search_documents (entity_type,entity_id,title,body,english_metadata) SELECT 'note',n.id,n.title,n.content,'Structured source reference | source page '||n.source_page::text FROM public.gk_notes n WHERE n.source_page BETWEEN 599 AND 603 AND NOT EXISTS (SELECT 1 FROM public.search_documents d WHERE d.entity_type='note' AND d.entity_id=n.id); INSERT INTO public.search_documents (entity_type,entity_id,title,body,english_metadata) SELECT 'mcq',m.id,NULL,m.question,'Past-exam MCQ | source page '||m.source_page::text||' | question '||m.source_question_number FROM public.gk_mcqs m WHERE m.source_page BETWEEN 599 AND 603 AND NOT EXISTS (SELECT 1 FROM public.search_documents d WHERE d.entity_type='mcq' AND d.entity_id=m.id);`;
  const sql = `-- Generated by prepare_validated_batch_0599_0603.mjs. Source pages 599–603 only.\nBEGIN;\nINSERT INTO public.import_runs (source_filename,source_sha256,pipeline_version,status,completed_at,audit) VALUES ('Jubayer''sgk.pdf',${q(hash(pages.map(page => page.source_image_sha256).join("|")))},${q(PIPELINE_VERSION)},'completed',now(),${json(audit)});\n${topicSql}\n${pageSql}\n${factSql}\n${noteSql}\n${mcqSql}\n${tagSql}\n${verificationSql}\n${derivedSql}\nCOMMIT;`;
  return { sql, audit };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const { sql, audit } = await buildBatch();
  const counts = { batch_pages: BATCH_PAGES, review_tiles: 35, eligible_facts: facts.length, eligible_notes: notes.length, eligible_mcqs: mcqs.length, eligible_mcq_options: mcqs.length * 4, withheld_mcqs: 5, derived_records: audit.generated_flashcards, verification_statuses: audit.verification_counts };
  await fs.mkdir(outDir, { recursive: true });
  await fs.writeFile(path.join(outDir, "validated_import.sql"), sql);
  await fs.writeFile(path.join(outDir, "batch_audit.json"), JSON.stringify(audit, null, 2));
  await fs.writeFile(path.join(outDir, "execute_sql_request.json"), JSON.stringify({ project_id: "rennotctgrxvbpghbimx", query: sql }));
  await fs.writeFile(path.join(workDir, "import_input_counts.json"), JSON.stringify(counts, null, 2));
  console.log(JSON.stringify({ output_dir: outDir, audit, counts }, null, 2));
}
