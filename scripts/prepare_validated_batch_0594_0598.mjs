import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const workDir = "/home/ubuntu/dontonyo-work/batch-0594-0598";
const outputDir = path.join(root, "supabase", "batch-0594-0598");
export const BATCH_PAGES = [594, 595, 596, 597, 598];
export const PIPELINE_VERSION = "vision-quality-gated-batch-0594-0598-v1";
const BOOK_TITLE = "Jubayer's GK";
const q = value => `'${String(value ?? "").replaceAll("'", "''")}'`;
const json = value => `${q(JSON.stringify(value))}::jsonb`;
const hash = value => crypto.createHash("sha256").update(value, "utf8").digest("hex");
const values = rows => rows.map(row => `(${row.map(q).join(",")})`).join(",\n");
const files = BATCH_PAGES.map(page => path.join(workDir, "pages", `page_${String(page).padStart(4, "0")}.json`));

const refs = {
  berlinWall: "https://diplomacy.state.gov/berlin-wall/",
  holocaust: "https://encyclopedia.ushmm.org/content/en/article/hitler-comes-to-power",
  waterloo: "https://www.nam.ac.uk/explore/battle-waterloo",
};

const ctx = page => {
  if (page <= 596) return { chapter: "europe", chapterTitle: "ইউরোপ", topic: "france-napoleon-and-enlightenment-reference", topicTitle: "ফ্রান্স — নেপোলিয়ন ও Enlightenment রেফারেন্স", domain: "france" };
  if (page === 597) return { chapter: "europe", chapterTitle: "ইউরোপ", topic: "germany-berlin-wall-reference", topicTitle: "জার্মানি ও বার্লিন প্রাচীর রেফারেন্স", domain: "germany" };
  return { chapter: "europe", chapterTitle: "ইউরোপ", topic: "germany-bismarck-and-nazi-era-reference", topicTitle: "জার্মানি — বিসমার্ক ও নাৎসি-যুগের রেফারেন্স", domain: "germany" };
};

const fact = (page, title, body, status = "source_attributed", confidence = "high", sources = [], timeSensitive = false) => ({ source_page: page, title, fact_text: body, status, confidence, sources, timeSensitive, ...ctx(page), canonical_hash: hash(`fact|${page}|${title}|${body}`) });
const note = (page, title, content, status = "source_attributed", confidence = "high", sources = []) => ({ source_page: page, title, content, status, confidence, sources, timeSensitive: true, ...ctx(page), canonical_hash: hash(`note|${page}|${title}|${content}`) });
const mcq = (number, question, options, correct, source, confidence = "high", sources = []) => ({ source_page: 596, number, question, options, correct, source, status: sources.length ? "verified" : "source_attributed", confidence, sources, ...ctx(596), canonical_hash: hash(`mcq|596|${number}|${question}`) });

const facts = [
  fact(594, "Napoleon Bonaparte — 1769 Corsica birth", "উৎসে Napoleon Bonaparte-এর জন্ম ১৭৬৯ সালে Corsica দ্বীপে বলা হয়েছে।"),
  fact(594, "Napoleon — First Consul in 1799", "উৎসে Napoleon ১৭৯৯ সালে France-এর First Consul হন বলা হয়েছে।"),
  fact(594, "Napoleon — Emperor in 1804", "উৎসে Napoleon ১৮০৪ সালে নিজেকে France-এর Emperor ঘোষণা করেন বলা হয়েছে।"),
  fact(594, "Napoleon — Hundred Days", "উৎসে Napoleon-এর সঙ্গে Hundred Days অভিযানের উল্লেখ আছে।", "source_attributed", "medium", [], true),
  fact(594, "Napoleon — 1821 death in Saint Helena exile", "উৎসে Napoleon ১৮২১ সালে Saint Helena দ্বীপে নির্বাসিত অবস্থায় মারা যান বলা হয়েছে।"),
  fact(594, "Battle of Trafalgar — 1805", "উৎসে ১৮০৫ সালের Trafalgar যুদ্ধে British navy France–Spain-এর সম্মিলিত বাহিনীকে পরাজিত করে এবং Nelson-এর নেতৃত্বের উল্লেখ আছে।", "source_attributed", "high", [], true),
  fact(594, "Battle of Waterloo — 18 June 1815", "National Army Museum অনুযায়ী ১৮ জুন ১৮১৫ Waterloo-তে Napoleon-এর French army Duke of Wellington ও Marshal Blücher নেতৃত্বাধীন coalition-এর মুখোমুখি হয়।", "verified", "high", [refs.waterloo], true),
  fact(594, "Battle of Leipzig — 1813", "উৎসে ১৮১৩ সালের Leipzig যুদ্ধকে Battle of Leipzig নামেও উল্লেখ করা হয়েছে।", "source_attributed", "high", [], true),
  fact(594, "Napoleon — Elba and Saint Helena exiles", "উৎসে Napoleon-এর প্রথম নির্বাসন ১৮১৪ সালে Elba এবং দ্বিতীয় নির্বাসন ১৮১৫ সালে Saint Helena-য় বলা হয়েছে।", "source_attributed", "high", [], true),
  fact(595, "Charles de Gaulle — Free France in 1940", "উৎসে ১৯৪০ সালে France পতনের পর Charles de Gaulle-এর Free France forces-এর নেতৃত্ব/গঠনের উল্লেখ আছে।", "source_attributed", "high", [], true),
  fact(595, "Jean-Jacques Rousseau — The Social Contract", "উৎসে Jean-Jacques Rousseau-এর গ্রন্থ হিসেবে The Social Contract উল্লেখ আছে।"),
  fact(595, "Jean-Jacques Rousseau — Discourse on Inequality", "উৎসে Jean-Jacques Rousseau-এর গ্রন্থ হিসেবে Discourse on Inequality উল্লেখ আছে।"),
  fact(595, "Jean-Jacques Rousseau — Émile", "উৎসে Jean-Jacques Rousseau-এর গ্রন্থ হিসেবে Émile উল্লেখ আছে।"),
  fact(595, "Rousseau quotation — source reference", "উৎসে Rousseau-এর নামে `Man is born free, but everywhere he is in chains` উদ্ধৃতিটি মুদ্রিত আছে।", "source_attributed", "high", [], true),
  fact(595, "Voltaire — Candide", "উৎসে Voltaire-এর গ্রন্থ হিসেবে Candide উল্লেখ আছে।"),
  fact(595, "Montesquieu — The Spirit of the Laws", "উৎসে Montesquieu-এর গ্রন্থ হিসেবে The Spirit of the Laws উল্লেখ আছে।"),
  fact(595, "Montesquieu — Persian Letters", "উৎসে Montesquieu-এর গ্রন্থ হিসেবে Persian Letters উল্লেখ আছে。"),
  fact(595, "Montesquieu — separation of powers association", "উৎসে Montesquieu-কে ক্ষমতা-বিভাজনের নীতির সঙ্গে যুক্ত করা হয়েছে।", "source_attributed", "high", [], true),
  fact(597, "Berlin — Spree River", "উৎসে Berlin-কে Spree নদীর তীরে অবস্থিত বলা হয়েছে।"),
  fact(597, "Nuremberg trials — 1945 start", "উৎসে Nuremberg-এ German war criminals-এর বিচার ১৯৪৫ সালে শুরু হয় বলা হয়েছে।", "source_attributed", "high", [], true),
  fact(597, "Black Forest — Germany", "উৎসে Black Forest Germany-তে অবস্থিত বলা হয়েছে।"),
  fact(597, "Angela Merkel — first woman Chancellor", "উৎসে Angela Merkel-কে Germany-এর প্রথম নারী Chancellor হিসেবে উল্লেখ করা হয়েছে।", "source_attributed", "high", [], true),
  fact(597, "Berlin Wall — construction on 13 August 1961", "উৎসে Berlin Wall ১৩ আগস্ট ১৯৬১ নির্মাণের তারিখ দেওয়া হয়েছে।", "source_attributed", "high", [refs.berlinWall], true),
  fact(597, "Berlin Wall — former East Germany construction context", "উৎসে Berlin Wall-এর নির্মাতা হিসেবে former East Germany-এর উল্লেখ আছে।", "source_attributed", "high", [refs.berlinWall], true),
  fact(597, "Berlin Wall — 155 km source reference", "উৎসে Berlin Wall-এর দৈর্ঘ্য ১৫৫ কিলোমিটার (৯৬ মাইল) বলা হয়েছে।", "source_attributed", "high", [], true),
  fact(597, "West Germany — Bonn as former capital", "উৎসে Bonn-কে West Germany-এর former capital বলা হয়েছে।", "source_attributed", "high", [refs.berlinWall], true),
  fact(597, "East Germany — East Berlin capital context", "উৎসে Berlin-কে East Germany-এর capital বলা হয়েছে; এটি historic Cold War context হিসেবে রাখা হয়েছে।", "source_attributed", "high", [refs.berlinWall], true),
  fact(597, "Berlin Wall — 9 November 1989 opening/fall", "উৎসে Berlin Wall-এর পতনের তারিখ ৯ নভেম্বর ১৯৮৯ বলা হয়েছে।", "source_attributed", "high", [refs.berlinWall], true),
  fact(597, "German reunification and Unity Day", "উৎসে German reunification-এর তারিখ ৩ অক্টোবর ১৯৯০ এবং German Unity Day ৩ অক্টোবর বলা হয়েছে।", "source_attributed", "high", [refs.berlinWall], true),
  fact(598, "Otto von Bismarck — first Chancellor of the German Empire", "উৎসে Otto von Bismarck-কে Germany-এর প্রথম Chancellor বলা হয়েছে; এটি German Empire-এর historic office contextে রাখা হয়েছে।", "source_attributed", "high", [], true),
  fact(598, "Bismarck — 1862 Blood and Iron context", "উৎসে Bismarck-এর ১৮৬২ সালের Blood and Iron policy/address context উল্লেখ আছে।", "source_attributed", "high", [], true),
  fact(598, "Bismarck — Denmark war in unification source summary", "উৎসে Denmark-এর সঙ্গে যুদ্ধকে Bismarck-এর German unification source summary-র অংশ বলা হয়েছে।", "source_attributed", "medium", [], true),
  fact(598, "Bismarck — Austro-Prussian war in unification source summary", "উৎসে Austro-Prussian যুদ্ধকে Bismarck-এর German unification source summary-র অংশ বলা হয়েছে।", "source_attributed", "medium", [], true),
  fact(598, "Bismarck — Franco-Prussian war in unification source summary", "উৎসে Franco-Prussian যুদ্ধকে Bismarck-এর German unification source summary-র অংশ বলা হয়েছে।", "source_attributed", "medium", [], true),
  fact(598, "Adolf Hitler — 1889 Austrian birth", "উৎসে Adolf Hitler-এর জন্ম ১৮৮৯ সালে Austria-তে বলা হয়েছে।", "source_attributed", "high", [], true),
  fact(598, "Adolf Hitler — First World War service", "উৎসে Adolf Hitler-এর German side-এ First World War soldier হিসেবে অংশগ্রহণের উল্লেখ আছে।", "source_attributed", "high", [], true),
  fact(598, "Adolf Hitler — Chancellor appointment in 1933", "United States Holocaust Memorial Museum অনুযায়ী German President Paul von Hindenburg ৩০ জানুয়ারি ১৯৩৩ Hitler-কে Chancellor নিয়োগ দেন।", "verified", "high", [refs.holocaust], true),
  fact(598, "Nazi Party — full name and contextual identity", "United States Holocaust Memorial Museum অনুযায়ী Nazi Party-এর পূর্ণ নাম National Socialist German Workers’ Party; প্রতিষ্ঠানটি একে far-right, racist, antisemitic, anticommunist এবং antidemocratic দল হিসেবে বর্ণনা করে।", "verified", "high", [refs.holocaust], true),
  fact(598, "Gestapo — source historical reference", "উৎসে Gestapo-কে Nazi-era secret police force হিসেবে উল্লেখ করা হয়েছে।", "source_attributed", "high", [], true),
  fact(598, "Mein Kampf — source reference", "উৎসে Mein Kampf (My Struggle)-কে Hitler-এর আত্মজীবনীমূলক গ্রন্থ হিসেবে উল্লেখ করা হয়েছে।", "source_attributed", "high", [], true),
  fact(598, "Adolf Hitler — 30 April 1945 death", "উৎসে Adolf Hitler ৩০ এপ্রিল ১৯৪৫ আত্মহত্যা করেন বলা হয়েছে।", "source_attributed", "high", [], true),
];

const notes = [
  note(594, "Napoleon reference — attribution boundary", "উৎসে Napoleon-এর জীবন, যুদ্ধ, উদ্ধৃতি ও দ্বীপসমূহের reference আছে। সতর্কতা | three quotations, `child of the French Revolution` এবং `Little Corsican` labels, এবং Trafalgar Square-এর কারণ-সম্পর্কিত বাক্য learner fact হিসেবে import করা হয়নি।"),
  note(594, "Napoleonic wars — command boundary", "Waterloo-র জন্য National Army Museum-এর direct corroboration আছে; scan-এর Trafalgar ও Leipzig wording source-attributed রাখা হয়েছে। Waterloo-কে কেবল British-led যুদ্ধ বলা হয়নি, কারণ museum Wellington ও Blücher নেতৃত্বাধীন coalition-এর কথা বলে।", "source_attributed", "high", [refs.waterloo]),
  note(595, "French personalities — attribution boundary", "Rousseau, Voltaire ও Montesquieu-এর source-visible works retained। Rousseau as sole originator of Liberty–Equality–Fraternity, Romanticism founder label, Voltaire quotation/`French Renaissance` claim, `Annals of the Empire`, এবং Montesquieu climate quotation withheld।"),
  note(596, "France past-exam MCQ — quality boundary", "Q01–Q04, Q06–Q07, Q09 ও Q12 complete stem/options/key boundary পূরণ করে। Q05/Q08-এ Bastille শব্দটি corrupted, Q10–Q11 materially unclear; তাই four MCQ withheld। Q12-এর `child of the French Revolution` explanation-এ source label হিসেবে সীমাবদ্ধ রাখা হয়েছে।"),
  note(597, "Germany reference — historic and time-sensitive boundary", "Ambiguous historical names, George III wording, Ottoman-war simplification, Angela Merkel `youngest` claim, CeBIT superlative, Austria language generalization, এবং Brandenburg Gate wording withheld। Only bounded, source-visible historical facts were retained."),
  note(597, "Berlin Wall — Cold War context", "Postwar division, state-system labels, capital terminology, Wall chronology, and reunification are historic Cold War reference. Political-system labels are not stated as timeless current facts; U.S. State Department historical context is attached to relevant records.", "source_attributed", "high", [refs.berlinWall]),
  note(598, "Bismarck reference — attribution boundary", "Bismarck’s first-Chancellor, 1862, and unification-war references are source-attributed. `father of modern Germany`, unclear country adjective, military-rank claim, and unattributed quotation are not normalized into study facts."),
  note(598, "Nazi-era reference — safety boundary", "All Nazi-era material is historic, contextualized, and not celebratory. Party ideology, political slogans, honorifics, and propaganda language are withheld; USHMM’s historical framing accompanies the 1933 appointment and party-identity records.", "source_attributed", "high", [refs.holocaust]),
  note(598, "Nazi-era institutional precision", "The scan’s claim that Hitler remained Chancellor through 1945 and its standalone Gestapo formation-year claim are not imported as unqualified facts. The import retains only bounded, neutral historical reference language."),
];

const mcqs = [
  mcq("01", "কে বলেছিলেন, ‘মানুষ জন্মগতভাবে স্বাধীন কিন্তু সর্বত্রই সে শৃঙ্খলিত’?", ["জার্মানির লেনিন", "জ্যাঁ-জ্যাক রুশো", "কার্ল মার্কস", "জন লক"], "খ", "DU খ ২০২৩–২৪"),
  mcq("02", "চার্লস দ্য গল কোন দেশের নেতা ছিলেন?", ["ফ্রান্স", "জার্মানি", "স্পেন", "পর্তুগাল"], "ক", "DC খ ২০০৯–১০"),
  mcq("03", "ফ্রান্সে নেপোলিয়ন বোনাপার্ট ক্ষমতায় এসেছিলেন কোন সালে?", ["১৭৮৯", "১৭৯৯", "১৮০২", "১৭৫৪"], "খ", "DU খ ২০০৯–১০"),
  mcq("04", "ফরাসি বিপ্লব কোন সালে শুরু হয়েছিল?", ["১৬৪৮", "১৬৮৮", "১৭৮৯", "১৮০৫"], "গ", "DU খ ২০০৯–১০, ১৯৯৭–৯৮"),
  mcq("06", "রোবসপিয়ের কে ছিলেন?", ["আমেরিকান লেখক", "স্পেনের গেরিলা যোদ্ধা", "চলচ্চিত্র অভিনেতা", "ফরাসি বিপ্লবের নেতা"], "ঘ", "DU খ ২০১৩–১৪"),
  mcq("07", "ফ্রান্সের সম্রাট নেপোলিয়নের জীবনাবসান হয় কোথায়?", ["এলবা দ্বীপে", "ওয়াটারলুতে", "Versailles শহরে", "Saint Helena দ্বীপে"], "ঘ", "26 BCS"),
  mcq("09", "নেপোলিয়ন কোথায় জন্মগ্রহণ করেন?", ["সিসিলি", "মাল্টা", "কর্সিকা", "সার্দিনিয়া"], "গ", "জবি ২০১০–১১"),
  mcq("12", "ফরাসি বিপ্লবের শিশু বলা হয়েছে কাকে?", ["রেনে", "জন লক", "ভলতেয়ার", "নেপোলিয়ন"], "ঘ", "Marketing ২০০৪–০৫"),
];

const topics = [
  ["europe", "ফ্রান্স — নেপোলিয়ন ও Enlightenment রেফারেন্স", "france-napoleon-and-enlightenment-reference", 594, 10],
  ["europe", "জার্মানি ও বার্লিন প্রাচীর রেফারেন্স", "germany-berlin-wall-reference", 597, 11],
  ["europe", "জার্মানি — বিসমার্ক ও নাৎসি-যুগের রেফারেন্স", "germany-bismarck-and-nazi-era-reference", 598, 12],
];
const tags = [
  ["europe", "Europe", "domain", "Source-derived Europe reference."], ["france", "France", "domain", "France source material."], ["germany", "Germany", "domain", "Germany source material."],
  ["reference-note", "Structured source note", "content_type", "Structured source reference with explicit caveats."], ["past-exam-mcq", "Past-exam MCQ", "content_type", "MCQ with a visually reviewed printed key."], ["answer-key", "Answer key", "content_type", "Correct option from printed key."],
  ["source-attributed", "Source-attributed", "quality", "Source-preserved material without direct corroboration in this batch."], ["externally-verified", "Externally verified", "quality", "Directly corroborated by cited evidence."], ["time-sensitive", "Historic or time-sensitive reference", "quality", "Dated institutional or historical source material."],
  ["dhaka-university", "University of Dhaka", "exam_source", "Printed University of Dhaka examination label."], ["bcs", "Bangladesh Civil Service", "exam_source", "Printed BCS examination label."], ["other-bangladesh-exam", "Other Bangladesh examination", "exam_source", "Printed competitive-examination label retained without expansion."],
];
const exam = source => source.includes("DU") ? ["University of Dhaka", "University of Dhaka", "admission", "dhaka-university"] : source.includes("BCS") ? ["Bangladesh Civil Service", null, "competitive", "bcs"] : ["Other Bangladesh examination", null, "competitive", "other-bangladesh-exam"];
const entityRef = (kind, canonicalHash) => `(SELECT id FROM public.${kind === "fact" ? "gk_facts" : kind === "note" ? "gk_notes" : "gk_mcqs"} WHERE canonical_hash=${q(canonicalHash)} LIMIT 1)`;
const quality = row => row.status === "verified" ? "externally-verified" : "source-attributed";

export async function buildBatch() {
  const pages = await Promise.all(files.map(file => fs.readFile(file, "utf8").then(JSON.parse)));
  const checks = [...facts.map(row => ({ kind: "fact", claim: row.fact_text, ...row })), ...notes.map(row => ({ kind: "note", claim: row.content, ...row })), ...mcqs.map(row => ({ kind: "mcq", claim: `${row.question} — printed answer: ${row.correct}`, ...row }))];
  const audit = {
    batch_pages: BATCH_PAGES, pipeline_version: PIPELINE_VERSION,
    source_pages: pages.map(page => ({ page: page.source_page, review_status: "completed_image_grounded_review", image_sha256: page.source_image_sha256, overall_confidence: page.review.overall_confidence })),
    generated_facts: facts.length, generated_notes: notes.length, generated_mcqs: mcqs.length, generated_options: mcqs.length * 4, generated_flashcards: facts.length + notes.length + mcqs.length,
    verification_counts: { verified: checks.filter(row => row.status === "verified").length, conflicting: 0, source_attributed: checks.filter(row => row.status === "source_attributed").length },
    source_anomalies: ["All five source pages were rendered at 300 DPI, transcribed with gpt-5-mini, and reviewed through all 35 ordered overlap-safe tiles.", "Pages 594–598 retain 41 facts, nine bounded notes, and eight complete past-exam MCQs; four unsafe MCQs were withheld.", "Ambiguous historical names, distorted French-philosophy claims, time-sensitive German institutional claims, false Merkel/CeBIT superlatives, and Nazi propaganda language were withheld rather than corrected into invented records.", "Political, military, institutional, constitutional, and Nazi-era content remains historically scoped and explicitly source-attributed unless directly corroborated."],
    quality_gates: ["Exactly physical source pages 594–598 are imported.", "Every imported MCQ has four visually reviewed options and one printed source key.", "No corrupted, ambiguous, unsafe, or historically inconsistent MCQ is imported.", "Content tags use only approved categories; country and region tags use category domain.", "Upserts use canonical hashes and stable derived-record keys."],
  };
  const topicSql = `INSERT INTO public.topics (chapter_id,title,slug,description,source_page,display_order) SELECT c.id,x.title,x.slug,'Source-preserved content with explicit review and verification status.',x.page::integer,x.ord::integer FROM (VALUES ${values(topics)}) x(chapter_slug,title,slug,page,ord) JOIN public.chapters c ON c.slug=x.chapter_slug AND c.book_id=(SELECT id FROM public.books WHERE title=${q(BOOK_TITLE)} LIMIT 1) WHERE NOT EXISTS (SELECT 1 FROM public.topics t WHERE t.chapter_id=c.id AND t.slug=x.slug);`;
  const printed = { 594: 597, 595: 598, 596: 599, 597: 600, 598: 601 };
  const pageSql = pages.map(page => { const c = ctx(page.source_page); const metadata = { source_image_sha256: page.source_image_sha256, extraction_model: page.model, review_status: "completed_image_grounded_review", corrections: page.review.corrections, unresolved_spans: page.review.unresolved_spans, physical_source_page: page.source_page, printed_book_page: printed[page.source_page], visual_review_report: `${workDir}/visual_review_594_598.md`, external_verification_report: `${workDir}/external_verification.md`, classification_report: `${workDir}/classification_decisions.md` }; return `INSERT INTO public.source_pages (import_run_id,book_id,source_page,page_kind,raw_transcription,chapter_heading,topic_heading,confidence,extraction_method,model_name,notes,review_metadata) SELECT (SELECT id FROM public.import_runs WHERE pipeline_version=${q(PIPELINE_VERSION)} ORDER BY started_at DESC LIMIT 1),b.id,${page.source_page},'educational'::page_kind,${q(page.review.verified_transcript)},${q(c.chapterTitle)},${q(c.topicTitle)},${q(page.review.overall_confidence)}::confidence_level,'vision_ocr_with_image_grounded_review',${q(page.model)},'Quality-gated extraction with ordered source-tile review, withholding rules, source attribution, and explicit verification status.',${json(metadata)} FROM public.books b WHERE b.title=${q(BOOK_TITLE)} AND NOT EXISTS (SELECT 1 FROM public.source_pages s WHERE s.book_id=b.id AND s.source_page=${page.source_page});`; }).join("\n");
  const factSql = `WITH d(page,chapter_slug,topic_slug,title,body,status,confidence,hash) AS (VALUES ${values(facts.map(row => [row.source_page, row.chapter, row.topic, row.title, row.fact_text, row.status, row.confidence, row.canonical_hash]))}) INSERT INTO public.gk_facts (book_id,chapter_id,topic_id,title,fact_text,explanation,source_page,source_section,source_excerpt,importance,confidence,canonical_hash) SELECT b.id,c.id,t.id,d.title,d.body,CASE d.status WHEN 'verified' THEN 'Direct corroboration is recorded in the batch verification ledger.' ELSE 'Source-attributed historic material retained after ordered image review; it is not silently updated as a current assertion.' END,d.page::integer,d.title,d.body,3,d.confidence::confidence_level,d.hash FROM d JOIN public.books b ON b.title=${q(BOOK_TITLE)} JOIN public.chapters c ON c.book_id=b.id AND c.slug=d.chapter_slug JOIN public.topics t ON t.chapter_id=c.id AND t.slug=d.topic_slug ON CONFLICT (canonical_hash) DO UPDATE SET fact_text=EXCLUDED.fact_text,explanation=EXCLUDED.explanation,confidence=EXCLUDED.confidence;`;
  const noteSql = `WITH d(page,chapter_slug,topic_slug,title,body,confidence,hash) AS (VALUES ${values(notes.map(row => [row.source_page, row.chapter, row.topic, row.title, row.content, row.confidence, row.canonical_hash]))}) INSERT INTO public.gk_notes (book_id,chapter_id,topic_id,title,content,source_page,source_section,display_order,confidence,canonical_hash) SELECT b.id,c.id,t.id,d.title,d.body,d.page::integer,d.title,d.page::integer,d.confidence::confidence_level,d.hash FROM d JOIN public.books b ON b.title=${q(BOOK_TITLE)} JOIN public.chapters c ON c.book_id=b.id AND c.slug=d.chapter_slug JOIN public.topics t ON t.chapter_id=c.id AND t.slug=d.topic_slug ON CONFLICT (canonical_hash) DO UPDATE SET content=EXCLUDED.content,confidence=EXCLUDED.confidence;`;
  const mcqSql = mcqs.map(row => { const [name, institution, examType, normalizedName] = exam(row.source); const keys = ["ক", "খ", "গ", "ঘ"]; const optionSql = row.options.map((option, index) => `INSERT INTO public.gk_mcq_options (mcq_id,option_key,option_text,display_order,is_correct) SELECT m.id,${q(keys[index])},${q(option)},${index + 1},${keys[index] === row.correct} FROM public.gk_mcqs m WHERE m.canonical_hash=${q(row.canonical_hash)} AND NOT EXISTS (SELECT 1 FROM public.gk_mcq_options o WHERE o.mcq_id=m.id AND o.option_key=${q(keys[index])});`).join("\n"); const explanation = row.status === "verified" ? "Printed answer key visually reviewed; direct corroboration and scope are recorded in the batch verification ledger." : "Printed answer key visually reviewed; this past-exam wording is source-attributed and bounded in the batch verification ledger."; return `INSERT INTO public.exam_sources (name,institution,exam_type,description,normalized_name) SELECT ${q(name)},${q(institution)},${q(examType)},${q(`Normalized from printed source label on page ${row.source_page}.`)},${q(normalizedName)} WHERE NOT EXISTS (SELECT 1 FROM public.exam_sources WHERE normalized_name=${q(normalizedName)}); INSERT INTO public.gk_mcqs (book_id,chapter_id,topic_id,question,correct_option,explanation,source_page,source_section,source_question_number,difficulty,confidence,canonical_hash) SELECT b.id,c.id,t.id,${q(row.question)},${q(row.correct)},${q(explanation)},${row.source_page},'এই অধ্যায়ের সাথে জড়িত বিগত বছরের প্রশ্ন',${q(row.number)},3,${q(row.confidence)}::confidence_level,${q(row.canonical_hash)} FROM public.books b JOIN public.chapters c ON c.book_id=b.id AND c.slug=${q(row.chapter)} JOIN public.topics t ON t.chapter_id=c.id AND t.slug=${q(row.topic)} WHERE b.title=${q(BOOK_TITLE)} ON CONFLICT (canonical_hash) DO UPDATE SET correct_option=EXCLUDED.correct_option,explanation=EXCLUDED.explanation,confidence=EXCLUDED.confidence; ${optionSql} INSERT INTO public.gk_mcq_sources (mcq_id,exam_source_id,year,session,source_text,source_page) SELECT m.id,(SELECT id FROM public.exam_sources WHERE normalized_name=${q(normalizedName)} LIMIT 1),NULL,${q(row.source)},${q(row.source)},${row.source_page} FROM public.gk_mcqs m WHERE m.canonical_hash=${q(row.canonical_hash)} AND NOT EXISTS (SELECT 1 FROM public.gk_mcq_sources s WHERE s.mcq_id=m.id AND s.source_text=${q(row.source)} AND s.source_page=${row.source_page});`; }).join("\n");
  const assignment = (kind, row, tagSlugs) => tagSlugs.map(tag => `INSERT INTO public.content_tag_assignments (tag_id,entity_type,entity_id,source_page,confidence,assigned_by) SELECT t.id,${q(kind)},${entityRef(kind, row.canonical_hash)},${row.source_page},${q(row.confidence)}::confidence_level,'batch-0594-0598-quality-pipeline' FROM public.content_tags t WHERE t.slug=${q(tag)} ON CONFLICT DO NOTHING;`).join("\n");
  const tagSql = `INSERT INTO public.content_tags (slug,label,category,description) VALUES ${tags.map(row => `(${row.map(q).join(",")})`).join(",")} ON CONFLICT (slug) DO UPDATE SET label=EXCLUDED.label,category=EXCLUDED.category,description=EXCLUDED.description;
${facts.map(row => assignment("fact", row, ["europe", row.domain, quality(row), ...(row.timeSensitive ? ["time-sensitive"] : [])])).join("\n")}
${notes.map(row => assignment("note", row, ["europe", row.domain, "reference-note", quality(row), "time-sensitive"])).join("\n")}
${mcqs.map(row => assignment("mcq", row, ["europe", row.domain, "past-exam-mcq", "answer-key", exam(row.source)[3], quality(row)])).join("\n")}`;
  const verificationSql = checks.map(row => `INSERT INTO public.fact_verifications (source_page,entity_type,entity_id,claim_text,normalized_claim,verification_status,confidence,verification_sources,audit_note) SELECT ${row.source_page},${q(row.kind)},${entityRef(row.kind, row.canonical_hash)},${q(row.claim)},NULL,${q(row.status)},${q(row.confidence)}::confidence_level,${json(row.sources)},${q(row.status === "verified" ? "Direct corroboration is listed in the batch verification ledger." : "Source-attributed record retained with ordered image-grounded validation and explicit source linkage.")} WHERE NOT EXISTS (SELECT 1 FROM public.fact_verifications v WHERE v.entity_type=${q(row.kind)} AND v.entity_id=${entityRef(row.kind, row.canonical_hash)} AND v.claim_text=${q(row.claim)});`).join("\n");
  const derivedSql = `INSERT INTO public.flashcards (subject_id,book_id,chapter_id,topic_id,front_text,back_text,source_type,source_id,source_key) SELECT (SELECT id FROM public.subjects ORDER BY created_at ASC LIMIT 1),f.book_id,f.chapter_id,f.topic_id,f.title,f.fact_text,'fact',f.id,'batch0594-0598:fact:'||f.id::text FROM public.gk_facts f WHERE f.source_page BETWEEN 594 AND 598 AND NOT EXISTS (SELECT 1 FROM public.flashcards c WHERE c.source_key='batch0594-0598:fact:'||f.id::text); INSERT INTO public.flashcards (subject_id,book_id,chapter_id,topic_id,front_text,back_text,source_type,source_id,source_key) SELECT (SELECT id FROM public.subjects ORDER BY created_at ASC LIMIT 1),n.book_id,n.chapter_id,n.topic_id,n.title,n.content,'note',n.id,'batch0594-0598:note:'||n.id::text FROM public.gk_notes n WHERE n.source_page BETWEEN 594 AND 598 AND NOT EXISTS (SELECT 1 FROM public.flashcards c WHERE c.source_key='batch0594-0598:note:'||n.id::text); INSERT INTO public.flashcards (subject_id,book_id,chapter_id,topic_id,front_text,back_text,source_type,source_id,source_key) SELECT (SELECT id FROM public.subjects ORDER BY created_at ASC LIMIT 1),m.book_id,m.chapter_id,m.topic_id,m.question,'সঠিক উত্তর: '||o.option_key||'. '||o.option_text,'mcq',m.id,'batch0594-0598:mcq:'||m.id::text FROM public.gk_mcqs m JOIN public.gk_mcq_options o ON o.mcq_id=m.id AND o.is_correct WHERE m.source_page BETWEEN 594 AND 598 AND NOT EXISTS (SELECT 1 FROM public.flashcards c WHERE c.source_key='batch0594-0598:mcq:'||m.id::text); INSERT INTO public.search_documents (entity_type,entity_id,title,body,english_metadata) SELECT 'fact',f.id,f.title,f.fact_text,'Status-marked GK fact | source page '||f.source_page::text FROM public.gk_facts f WHERE f.source_page BETWEEN 594 AND 598 AND NOT EXISTS (SELECT 1 FROM public.search_documents d WHERE d.entity_type='fact' AND d.entity_id=f.id); INSERT INTO public.search_documents (entity_type,entity_id,title,body,english_metadata) SELECT 'note',n.id,n.title,n.content,'Structured source reference | source page '||n.source_page::text FROM public.gk_notes n WHERE n.source_page BETWEEN 594 AND 598 AND NOT EXISTS (SELECT 1 FROM public.search_documents d WHERE d.entity_type='note' AND d.entity_id=n.id); INSERT INTO public.search_documents (entity_type,entity_id,title,body,english_metadata) SELECT 'mcq',m.id,NULL,m.question,'Past-exam MCQ | source page '||m.source_page::text||' | question '||m.source_question_number FROM public.gk_mcqs m WHERE m.source_page BETWEEN 594 AND 598 AND NOT EXISTS (SELECT 1 FROM public.search_documents d WHERE d.entity_type='mcq' AND d.entity_id=m.id);`;
  const sql = `-- Generated by prepare_validated_batch_0594_0598.mjs. Source pages 594–598 only.\nBEGIN;\nINSERT INTO public.import_runs (source_filename,source_sha256,pipeline_version,status,completed_at,audit) VALUES ('Jubayer''sgk.pdf',${q(hash(pages.map(page => page.source_image_sha256).join("|")))},${q(PIPELINE_VERSION)},'completed',now(),${json(audit)});\n${topicSql}\n${pageSql}\n${factSql}\n${noteSql}\n${mcqSql}\n${tagSql}\n${verificationSql}\n${derivedSql}\nCOMMIT;`;
  return { sql, audit };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const { sql, audit } = await buildBatch();
  const counts = { batch_pages: BATCH_PAGES, review_tiles: 35, eligible_mcqs: mcqs.length, eligible_mcq_options: mcqs.length * 4, withheld_mcqs: 4, fact_candidates: facts.length, note_candidates: notes.length, verification_statuses: audit.verification_counts };
  await fs.mkdir(outputDir, { recursive: true });
  await fs.writeFile(path.join(outputDir, "validated_import.sql"), sql);
  await fs.writeFile(path.join(outputDir, "batch_audit.json"), JSON.stringify(audit, null, 2));
  await fs.writeFile(path.join(outputDir, "execute_sql_request.json"), JSON.stringify({ project_id: "rennotctgrxvbpghbimx", query: sql }));
  await fs.writeFile(path.join(workDir, "import_input_counts.json"), JSON.stringify(counts, null, 2));
  console.log(JSON.stringify({ outputDir, ...audit, counts }, null, 2));
}
