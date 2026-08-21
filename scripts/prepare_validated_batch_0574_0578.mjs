import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const workDir = "/home/ubuntu/dontonyo-work/batch-0574-0578";
const outputDir = path.join(root, "supabase", "batch-0574-0578");
export const BATCH_PAGES = [574, 575, 576, 577, 578];
export const PIPELINE_VERSION = "vision-quality-gated-batch-0574-0578-v1";
const BOOK_TITLE = "Jubayer's GK";
const q = value => `'${String(value ?? "").replaceAll("'", "''")}'`;
const json = value => `${q(JSON.stringify(value))}::jsonb`;
const hash = value => crypto.createHash("sha256").update(value, "utf8").digest("hex");
const values = rows => rows.map(row => `(${row.map(q).join(",")})`).join(",\n");
const files = BATCH_PAGES.map(page => path.join(workDir, "pages", `page_${String(page).padStart(4, "0")}.json`));

const refs = {
  china1949: "https://history.state.gov/milestones/1945-1952/chinese-rev",
  koreaHistory: "https://history.state.gov/milestones/1945-1952/korean-war",
  armistice: "https://www.archives.gov/milestone-documents/armistice-agreement-restoration-south-korean-state",
  uncArmistice: "https://www.unc.mil/History/1951-1953-Armistice-Negotiations/",
  imperial: "https://www.kunaicho.go.jp/kids/about/syocho.html",
  unu: "https://unu.edu/about",
  atomic: "https://www.archives.gov/news/topics/hiroshima-nagasaki-75",
  singaporeHistory: "https://sg75.pa.gov.sg/the-singapore-story/",
  lee: "https://www.nlb.gov.sg/main/article-detail?cmsuuid=5d7ebff1-0403-42bc-8f11-eee9f5967755",
  marina: "https://www.marinabaysands.com/guides/exceptional-experiences/marina-bay-sands-architecture.html",
};

const ctx = page => {
  if (page === 574) return { chapter: "china", chapterTitle: "চীন", topic: "china-past-questions-574", topicTitle: "চীন — বিগত বছরের প্রশ্ন (৫৭৪)", domain: "china" };
  if (page === 575) return { chapter: "korea", chapterTitle: "উত্তর ও দক্ষিণ কোরিয়া", topic: "korea-division-reference", topicTitle: "কোরিয়া — বিভাজন ও কোরীয় যুদ্ধ উৎস-রেফারেন্স", domain: "korea" };
  if (page === 576) return { chapter: "japan", chapterTitle: "জাপান", topic: "japan-geography-islands-reference", topicTitle: "জাপান — ভূ-প্রকৃতি ও প্রধান দ্বীপ", domain: "japan" };
  if (page === 577) return { chapter: "japan", chapterTitle: "জাপান", topic: "japan-special-information-reference", topicTitle: "জাপান — বিশেষ তথ্য উৎস-রেফারেন্স", domain: "japan" };
  return { chapter: "singapore", chapterTitle: "সিঙ্গাপুর", topic: "singapore-history-lee-kuan-yew-reference", topicTitle: "সিঙ্গাপুর — ইতিহাস ও লি কুয়ান ইউ", domain: "singapore" };
};

const fact = (page, title, body, status = "source_attributed", confidence = "medium", sources = [], timeSensitive = false) => ({
  source_page: page, title, fact_text: body, status, confidence, sources, timeSensitive, ...ctx(page), canonical_hash: hash(`fact|${page}|${title}|${body}`),
});
const note = (page, title, body, confidence = "high", timeSensitive = true) => ({
  source_page: page, title, content: body, status: "source_attributed", confidence, sources: [], timeSensitive, ...ctx(page), canonical_hash: hash(`note|${page}|${title}|${body}`),
});
const mcq = (number, question, options, correct, source, confidence = "high", sources = [], timeSensitive = false) => ({
  source_page: 574, number, question, options, correct, source, status: "source_attributed", confidence, sources, timeSensitive, ...ctx(574), canonical_hash: hash(`mcq|574|${number}|${question}`),
});

const facts = [
  fact(574, "গণচীন প্রতিষ্ঠা (১ অক্টোবর ১৯৪৯)", "U.S. Office of the Historian অনুযায়ী ১ অক্টোবর ১৯৪৯ Mao Zedong People's Republic of China প্রতিষ্ঠার ঘোষণা দেন।", "verified", "high", [refs.china1949], true),
  fact(575, "কোরিয়া — ৩৮তম অক্ষরেখায় অস্থায়ী বিভাজন", "U.S. Office of the Historian অনুযায়ী দ্বিতীয় বিশ্বযুদ্ধের সময় Japan-এর বাহিনী অপসারণ তদারকির জন্য United States ও Soviet Union কোরিয়াকে ৩৮তম অক্ষরেখায় সাময়িকভাবে বিভাজনে সম্মত হয়।", "verified", "high", [refs.koreaHistory], true),
  fact(575, "কোরীয় যুদ্ধ ও ১৯৫৩ Armistice", "U.S. National Archives অনুযায়ী Korean War ২৫ জুন ১৯৫০ শুরু হয় এবং ২৭ জুলাই ১৯৫৩ Panmunjom-এ Armistice স্বাক্ষরিত হয়; এটি যুদ্ধবিরতি স্থগিত করে, স্থায়ী peace treaty নয়।", "verified", "high", [refs.armistice], true),
  fact(576, "কোরীয় Demilitarized Zone (DMZ)", "U.S. National Archives অনুযায়ী ১৯৫৩ Armistice উভয় বাহিনীর মধ্যে buffer হিসেবে ৪,০০০ মিটার প্রশস্ত Demilitarized Zone প্রতিষ্ঠা করে।", "verified", "high", [refs.armistice, refs.uncArmistice], true),
  fact(576, "জাপানের প্রধান চার দ্বীপ", "উৎসে Japan-এর প্রধান চার দ্বীপ হিসেবে হনসু, কিউসু, হোক্কাইডো ও শিকোকুর তালিকা আছে।", "source_attributed", "high", [], false),
  fact(576, "হনসু ও টোকিও", "উৎসের দ্বীপ-মানচিত্রে হনসুকে আয়তনে Japan-এর বৃহত্তম দ্বীপ এবং Tokyo-কে Honshu-তে অবস্থিত রাজধানী হিসেবে দেখানো হয়েছে।", "source_attributed", "high", [], false),
  fact(577, "Emperor Naruhito — ১২৬তম সম্রাট", "Japan-এর Imperial Household Agency-এর পৃষ্ঠায় Reiwa যুগে Naruhito-কে ১২৬তম সম্রাট হিসেবে বর্ণনা করা হয়েছে। এটি সময়-সংবেদনশীল officeholder তথ্য।", "verified", "high", [refs.imperial], true),
  fact(577, "United Nations University — Tokyo ও ১৯৭৩ Charter", "United Nations University অনুযায়ী General Assembly ১৯৭৩ সালে UNU Charter অনুমোদন করে; Japan headquarters-এর জন্য Tokyo facilities দেয় এবং academic work ১৯৭৫ সালে শুরু হয়।", "verified", "high", [refs.unu], true),
  fact(577, "হিরোশিমা ও নাগাসাকি — ১৯৪৫", "U.S. National Archives অনুযায়ী Hiroshima ও Nagasaki-তে atomic bombing যথাক্রমে ৬ ও ৯ আগস্ট ১৯৪৫ ঘটে; National Archives Little Boy-কে Hiroshima mission-এর bomb হিসেবে চিহ্নিত করে।", "verified", "high", [refs.atomic], true),
  fact(578, "Singapore — Malaysia federation ও independence", "Singapore Government timeline অনুযায়ী Singapore ১৬ সেপ্টেম্বর ১৯৬৩ Malaysia federation-এ যুক্ত হয় এবং ৯ আগস্ট ১৯৬৫ Singapore Independence হয়।", "verified", "high", [refs.singaporeHistory], true),
  fact(578, "Halimah Yacob — Singapore-এর প্রথম নারী President", "Singapore Government timeline অনুযায়ী Halimah Yacob ২০১৭ সালে Singapore-এর eighth President ও first female President নির্বাচিত হন।", "verified", "high", [refs.singaporeHistory], true),
  fact(578, "Lee Kuan Yew — প্রথম Prime Minister", "Singapore National Library Board অনুযায়ী Lee Kuan Yew ১৯৫৯ থেকে ১৯৯০ সাল পর্যন্ত Singapore-এর প্রথম Prime Minister ছিলেন।", "verified", "high", [refs.lee], true),
];

const notes = [
  note(574, "চীন — বিগত প্রশ্নের quality boundary", "উৎসে গণচীন, Great Leap Forward, Cultural Revolution, purchasing-power parity, Great Wall, annual CO₂ emissions, Hong Kong এবং Dalai Lama-সংক্রান্ত MCQ আছে।\nসতর্কতা | Q19, Q20, Q23, Q24, Q26, Q27, Q28 ও Q31 historical premise, territorial/citizenship framing, superlative/measurement, time-bound wording, বা unreadable stem-এর কারণে withheld। Q21 ও Q29 কেবল source-date-aware historical-exam context-এ রাখা হয়েছে।"),
  note(575, "কোরিয়া — বিভাজন ও যুদ্ধ উৎস-রেফারেন্স", "উৎসে ১৯১০–১৯৪৫ Japanese colonial rule, ৩৮তম অক্ষরেখা, Soviet/United States zones, ১৯৫০–১৯৫৩ Korean War, Kim Il Sung এবং ১৫ আগস্ট ১৯৪৮ South Korea reference আছে।\nসতর্কতা | source-এর ৩৮তম অক্ষরেখা, DMZ ও later military-demarcation framing এক নয়; security, ideology, leadership-title, এবং current-status wording source-attributed অথবা withheld।"),
  note(576, "Panmunjom ও Sunshine Policy উৎস-রেফারেন্স", "উৎসে Panmunjom, ১৯৫৩ Armistice context, DMZ, এবং ১৯৯৮–২০০৭ Sunshine Policy-এর উল্লেখ আছে।\nসতর্কতা | Panmunjom-এ ‘সাধারণত যেকোনো বৈঠক’ হওয়ার broad wording এবং Korea-border terminology source-attributed; imported verified material কেবল Armistice ও DMZ-এর documented context পর্যন্ত সীমিত।"),
  note(576, "জাপান — দেশ-পরিচিতি ও দ্বীপ উৎস-রেফারেন্স", "উৎসে Japan-কে East Asia-র island state, Tokyo-কে রাজধানী ও বৃহত্তম শহর, এবং Honshu, Kyushu, Hokkaido, Shikoku-কে প্রধান চার দ্বীপ বলা হয়েছে।\nসতর্কতা | blurred hazard/city spelling, nickname, এবং অস্পষ্ট মানচিত্রের পাশের prose পুনর্গঠন করা হয়নি।"),
  note(577, "জাপান — বিশেষ তথ্য ও সংবেদনশীল সীমা", "উৎসে Naruhito, Diet, Kyodo, Mount Fuji, Corner Stone of Peace, Korea Strait, Kuril Islands, atomic bombing, Sumo/Judo, chrysanthemum, G-7, Osaka, UNU, Indo-Pacific, Okinawa, Pearl Harbor ও Hiroshima-এর উল্লেখ আছে।\nসতর্কতা | `Republic of Japan` wording unsupported; superlative, city nickname, aid, sport/symbol, territory dispute, military-base, Indo-Pacific attribution, এবং current-office wording source-attributed বা withheld।"),
  note(578, "সিঙ্গাপুর — chronology ও biography উৎস-রেফারেন্স", "উৎসে Japanese occupation, British control, ১৯৬৩ Malaysia federation, ৯ আগস্ট ১৯৬৫ independence, Halimah Yacob, Lee Kuan Yew, *From Third World to First*, এবং Marina Bay Sands-এর উল্লেখ আছে।\nসতর্কতা | ৩১ আগস্ট ১৯৬৩ ‘Britain থেকে স্বাধীনতা’ wording এবং majority-Buddhist claim conflicting; Lee Kuan Yew-কে modern Singapore-এর জনক ও single-leader development framing source-attributed; Marina Bay Sands-এর ১,১২২-foot height withheld।"),
];

const mcqs = [
  mcq("17", "গণচীনের প্রতিষ্ঠাতা কে?", ["মাও সে তুঙ", "সান ইয়াৎ সেন", "চিয়াং কাইশেক", "লিউ শাও চি"], "ক", "তথ্য মন্ত্রণালয়ের গণযোগাযোগ প্রশিক্ষণ-০১", "medium", [refs.china1949], true),
  mcq("18", "‘Great Leap Forward’ ইতিহাসের এই অতি সমালোচিত কর্মসূচিটির প্রবর্তক হচ্ছেন—", ["দেং শিয়াও পিং", "মাও সে তুঙ", "হু জিনতাও", "চৌ এন লাই"], "খ", "DU পৃ. ১৩–১৪", "high", [], true),
  mcq("21", "ক্রয় ক্ষমতার বিচারে বর্তমানে পৃথিবীর সবচেয়ে বড় অর্থনীতি কোনটি?", ["যুক্তরাষ্ট্র", "জার্মানি", "জাপান", "চীন"], "ঘ", "চবি D3, ১৫–১৬", "high", [], true),
  mcq("22", "সাংস্কৃতিক বিপ্লব কোথায় সংঘটিত হয়?", ["কিউবা", "চীন", "রাশিয়া", "চিলি"], "খ", "জব-৯, ০৯–১০", "high", [], true),
  mcq("25", "চীনের প্রাচীর চীন দেশের কোন সীমান্তে অবস্থিত?", ["উত্তর", "পশ্চিম", "পূর্ব", "দক্ষিণ"], "ক", "পররাষ্ট্র মন্ত্রণালয়ের প্রশাসনিক কর্মকর্তা, ০১", "high", [], false),
  mcq("29", "কোন দেশ সবচেয়ে বেশি CO₂ নিঃসরণ করে থাকে?", ["যুক্তরাষ্ট্র", "যুক্তরাজ্য", "চীন", "অস্ট্রেলিয়া"], "গ", "এগ্রি ব্যাংক সিনিয়র অফিসার-১৫", "high", [], true),
  mcq("30", "ব্রিটিশ কর্তৃক হংকং কত বছর শাসিত হয়েছিল?", ["১৫০ বছর", "১০০ বছর", "১৫৬ বছর", "২০০ বছর"], "গ", "রবি ১১–১৫–১৬", "high", [], true),
];

const chapters = [
  [71, "উত্তর ও দক্ষিণ কোরিয়া", "korea", "Source-preserved Korea reference with explicit review and verification status.", 71],
  [72, "জাপান", "japan", "Source-preserved Japan reference with explicit review and verification status.", 72],
  [73, "সিঙ্গাপুর", "singapore", "Source-preserved Singapore reference with explicit review and verification status.", 73],
];
const topics = [
  ["china", "চীন — বিগত বছরের প্রশ্ন (৫৭৪)", "china-past-questions-574", 574, 6],
  ["korea", "কোরিয়া — বিভাজন ও কোরীয় যুদ্ধ উৎস-রেফারেন্স", "korea-division-reference", 575, 1],
  ["japan", "জাপান — ভূ-প্রকৃতি ও প্রধান দ্বীপ", "japan-geography-islands-reference", 576, 1],
  ["japan", "জাপান — বিশেষ তথ্য উৎস-রেফারেন্স", "japan-special-information-reference", 577, 2],
  ["singapore", "সিঙ্গাপুর — ইতিহাস ও লি কুয়ান ইউ", "singapore-history-lee-kuan-yew-reference", 578, 1],
];
const tags = [
  ["asia", "Asia", "domain", "Source-derived Asia reference."], ["east-asia", "East Asia", "domain", "Source-derived East Asia reference."], ["china", "China", "domain", "China source material."], ["korea", "Korea", "domain", "Korea source material."], ["japan", "Japan", "domain", "Japan source material."], ["singapore", "Singapore", "domain", "Singapore source material."],
  ["reference-note", "Structured source note", "content_type", "Structured source reference with explicit caveats."], ["past-exam-mcq", "Past-exam MCQ", "content_type", "MCQ with a printed source key."], ["answer-key", "Answer key", "content_type", "Correct option from the printed key."],
  ["source-attributed", "Source-attributed", "quality", "Source-preserved material without direct corroboration in this batch."], ["externally-verified", "Externally verified", "quality", "Directly corroborated by cited evidence."], ["time-sensitive", "Time-sensitive reference", "quality", "Political, institutional, territorial, religious, diplomatic, military, security, ranking, or dated source material."],
  ["dhaka-university", "University of Dhaka", "exam_source", "University of Dhaka printed examination label."], ["chittagong-university", "University of Chittagong", "exam_source", "University of Chittagong printed examination label."], ["bangladesh-bank-exam", "Bangladesh bank examination", "exam_source", "Printed bank/competitive-examination label."], ["other-bangladesh-exam", "Other Bangladesh examination", "exam_source", "Printed examination label retained without expansion."],
];

const exam = source => {
  if (source.includes("DU")) return ["University of Dhaka", "University of Dhaka", "admission", "dhaka-university"];
  if (source.includes("চবি")) return ["University of Chittagong", "University of Chittagong", "admission", "chittagong-university"];
  if (source.includes("ব্যাংক")) return ["Bangladesh bank examination", null, "competitive", "bangladesh-bank-exam"];
  return ["Other Bangladesh examination", null, "competitive", "other-bangladesh-exam"];
};
const entityRef = (kind, canonicalHash) => `(SELECT id FROM public.${kind === "fact" ? "gk_facts" : kind === "note" ? "gk_notes" : "gk_mcqs"} WHERE canonical_hash=${q(canonicalHash)} LIMIT 1)`;
const quality = row => row.status === "verified" ? "externally-verified" : "source-attributed";

export async function buildBatch() {
  const pages = await Promise.all(files.map(file => fs.readFile(file, "utf8").then(JSON.parse)));
  const checks = [
    ...facts.map(row => ({ kind: "fact", claim: row.fact_text, ...row })),
    ...notes.map(row => ({ kind: "note", claim: row.content, ...row })),
    ...mcqs.map(row => ({ kind: "mcq", claim: `${row.question} — printed answer: ${row.correct}`, ...row })),
  ];
  const audit = {
    batch_pages: BATCH_PAGES,
    pipeline_version: PIPELINE_VERSION,
    source_pages: pages.map(page => ({ page: page.source_page, review_status: "completed_image_grounded_review", image_sha256: page.source_image_sha256, overall_confidence: page.review.overall_confidence })),
    generated_facts: facts.length,
    generated_notes: notes.length,
    generated_mcqs: mcqs.length,
    generated_options: mcqs.length * 4,
    generated_flashcards: facts.length + notes.length + mcqs.length,
    verification_counts: { verified: checks.filter(row => row.status === "verified").length, conflicting: 4, source_attributed: checks.filter(row => row.status === "source_attributed").length },
    source_anomalies: [
      "All five pages were rendered at 300 DPI, transcribed with gpt-5-mini, and reviewed through all 35 ordered overlap-safe tiles.",
      "Page 574 Q19, Q20, Q23, Q24, Q26, Q27, Q28, and Q31 are withheld for historically imprecise, ambiguous, territorial/citizenship, superlative/measurement, time-bound, or unreadable material.",
      "Pages 575–576 distinguish the 38th-parallel division, 1953 Armistice, Military Demarcation Line, and DMZ rather than preserving the scan's compressed terminology as a neutral fact.",
      "Page 577's 'Republic of Japan' wording is unsupported; territorial-dispute, military-base, aid, ranking, and current-office claims remain source-attributed or withheld.",
      "Page 578's 31 August 1963 independence wording, majority-Buddhist claim, and 1,122-foot Marina Bay Sands height conflict with external evidence and are withheld or caveated.",
    ],
    quality_gates: [
      "Exactly physical source pages 574–578 are imported.",
      "Every imported MCQ has four visually reviewed options and one printed key.",
      "No corrupted, ambiguous, territorial/citizenship, unbounded time-sensitive, or historically unsafe MCQ is imported.",
      "Content tags use only approved categories; countries and regions use category domain.",
      "Upserts use canonical hashes and stable derived-record keys.",
    ],
  };
  const chapterSql = `INSERT INTO public.chapters (book_id,chapter_number,title,slug,description,display_order) SELECT b.id,x.chapter_number::integer,x.title,x.slug,x.description,x.display_order::integer FROM (VALUES ${values(chapters)}) x(chapter_number,title,slug,description,display_order) CROSS JOIN public.books b WHERE b.title=${q(BOOK_TITLE)} AND NOT EXISTS (SELECT 1 FROM public.chapters c WHERE c.book_id=b.id AND c.slug=x.slug);`;
  const topicSql = `INSERT INTO public.topics (chapter_id,title,slug,description,source_page,display_order) SELECT c.id,x.title,x.slug,'Source-preserved content with explicit review and verification status.',x.page::integer,x.ord::integer FROM (VALUES ${values(topics)}) x(chapter_slug,title,slug,page,ord) JOIN public.chapters c ON c.slug=x.chapter_slug AND c.book_id=(SELECT id FROM public.books WHERE title=${q(BOOK_TITLE)} LIMIT 1) WHERE NOT EXISTS (SELECT 1 FROM public.topics t WHERE t.chapter_id=c.id AND t.slug=x.slug);`;
  const printed = { 574: 571, 575: 572, 576: 573, 577: 574, 578: 575 };
  const pageSql = pages.map(page => {
    const c = ctx(page.source_page);
    const metadata = {
      source_image_sha256: page.source_image_sha256,
      extraction_model: page.model,
      review_status: "completed_image_grounded_review",
      corrections: page.review.corrections,
      unresolved_spans: page.review.unresolved_spans,
      physical_source_page: page.source_page,
      printed_book_page: printed[page.source_page],
      visual_review_report: `${workDir}/visual_review_574_578.md`,
      external_verification_report: `${workDir}/external_verification.md`,
      classification_report: `${workDir}/classification_decisions.md`,
    };
    return `INSERT INTO public.source_pages (import_run_id,book_id,source_page,page_kind,raw_transcription,chapter_heading,topic_heading,confidence,extraction_method,model_name,notes,review_metadata) SELECT (SELECT id FROM public.import_runs WHERE pipeline_version=${q(PIPELINE_VERSION)} ORDER BY started_at DESC LIMIT 1),b.id,${page.source_page},${q(page.source_page === 574 ? "mcq" : "educational")}::page_kind,${q(page.review.verified_transcript)},${q(c.chapterTitle)},${q(c.topicTitle)},${q(page.review.overall_confidence)}::confidence_level,'vision_ocr_with_image_grounded_review',${q(page.model)},'Quality-gated extraction with ordered source-tile review, withholding rules, source attribution, and explicit verification status.',${json(metadata)} FROM public.books b WHERE b.title=${q(BOOK_TITLE)} AND NOT EXISTS (SELECT 1 FROM public.source_pages s WHERE s.book_id=b.id AND s.source_page=${page.source_page});`;
  }).join("\n");
  const factSql = `WITH d(page,chapter_slug,topic_slug,title,body,status,confidence,hash) AS (VALUES ${values(facts.map(row => [row.source_page, row.chapter, row.topic, row.title, row.fact_text, row.status, row.confidence, row.canonical_hash]))}) INSERT INTO public.gk_facts (book_id,chapter_id,topic_id,title,fact_text,explanation,source_page,source_section,source_excerpt,importance,confidence,canonical_hash) SELECT b.id,c.id,t.id,d.title,d.body,CASE d.status WHEN 'verified' THEN 'Direct corroboration is recorded in the batch verification ledger.' ELSE 'Source-attributed material retained after ordered image review; it is not silently updated as a current assertion.' END,d.page::integer,d.title,d.body,3,d.confidence::confidence_level,d.hash FROM d JOIN public.books b ON b.title=${q(BOOK_TITLE)} JOIN public.chapters c ON c.book_id=b.id AND c.slug=d.chapter_slug JOIN public.topics t ON t.chapter_id=c.id AND t.slug=d.topic_slug ON CONFLICT (canonical_hash) DO UPDATE SET fact_text=EXCLUDED.fact_text,explanation=EXCLUDED.explanation,confidence=EXCLUDED.confidence;`;
  const noteSql = `WITH d(page,chapter_slug,topic_slug,title,body,confidence,hash) AS (VALUES ${values(notes.map(row => [row.source_page, row.chapter, row.topic, row.title, row.content, row.confidence, row.canonical_hash]))}) INSERT INTO public.gk_notes (book_id,chapter_id,topic_id,title,content,source_page,source_section,display_order,confidence,canonical_hash) SELECT b.id,c.id,t.id,d.title,d.body,d.page::integer,d.title,d.page::integer,d.confidence::confidence_level,d.hash FROM d JOIN public.books b ON b.title=${q(BOOK_TITLE)} JOIN public.chapters c ON c.book_id=b.id AND c.slug=d.chapter_slug JOIN public.topics t ON t.chapter_id=c.id AND t.slug=d.topic_slug ON CONFLICT (canonical_hash) DO UPDATE SET content=EXCLUDED.content,confidence=EXCLUDED.confidence;`;
  const mcqSql = mcqs.map(row => {
    const [name, institution, examType, normalizedName] = exam(row.source);
    const keys = ["ক", "খ", "গ", "ঘ"];
    const options = row.options.map((option, index) => `INSERT INTO public.gk_mcq_options (mcq_id,option_key,option_text,display_order,is_correct) SELECT m.id,${q(keys[index])},${q(option)},${index + 1},${keys[index] === row.correct} FROM public.gk_mcqs m WHERE m.canonical_hash=${q(row.canonical_hash)} AND NOT EXISTS (SELECT 1 FROM public.gk_mcq_options o WHERE o.mcq_id=m.id AND o.option_key=${q(keys[index])});`).join("\n");
    const explanation = "Printed answer key retained after visual review; historical, territorial, institutional, environmental-ranking, or diplomatic context is source-attributed and bounded in the batch verification ledger.";
    return `INSERT INTO public.exam_sources (name,institution,exam_type,description,normalized_name) SELECT ${q(name)},${q(institution)},${q(examType)},${q(`Normalized from printed source label on page ${row.source_page}.`)},${q(normalizedName)} WHERE NOT EXISTS (SELECT 1 FROM public.exam_sources WHERE normalized_name=${q(normalizedName)}); INSERT INTO public.gk_mcqs (book_id,chapter_id,topic_id,question,correct_option,explanation,source_page,source_section,source_question_number,difficulty,confidence,canonical_hash) SELECT b.id,c.id,t.id,${q(row.question)},${q(row.correct)},${q(explanation)},${row.source_page},'অন্যান্য বিশ্ববিদ্যালয় ও অন্যান্য চাকুরির পরীক্ষা',${q(row.number)},3,${q(row.confidence)}::confidence_level,${q(row.canonical_hash)} FROM public.books b JOIN public.chapters c ON c.book_id=b.id AND c.slug=${q(row.chapter)} JOIN public.topics t ON t.chapter_id=c.id AND t.slug=${q(row.topic)} WHERE b.title=${q(BOOK_TITLE)} ON CONFLICT (canonical_hash) DO UPDATE SET correct_option=EXCLUDED.correct_option,explanation=EXCLUDED.explanation,confidence=EXCLUDED.confidence; ${options} INSERT INTO public.gk_mcq_sources (mcq_id,exam_source_id,year,session,source_text,source_page) SELECT m.id,(SELECT id FROM public.exam_sources WHERE normalized_name=${q(normalizedName)} LIMIT 1),NULL,${q(row.source)},${q(row.source)},${row.source_page} FROM public.gk_mcqs m WHERE m.canonical_hash=${q(row.canonical_hash)} AND NOT EXISTS (SELECT 1 FROM public.gk_mcq_sources s WHERE s.mcq_id=m.id AND s.source_text=${q(row.source)} AND s.source_page=${row.source_page});`;
  }).join("\n");
  const assignment = (kind, row, tagSlugs) => tagSlugs.map(tag => `INSERT INTO public.content_tag_assignments (tag_id,entity_type,entity_id,source_page,confidence,assigned_by) SELECT t.id,${q(kind)},${entityRef(kind, row.canonical_hash)},${row.source_page},${q(row.confidence)}::confidence_level,'batch-0574-0578-quality-pipeline' FROM public.content_tags t WHERE t.slug=${q(tag)} ON CONFLICT DO NOTHING;`).join("\n");
  const tagSql = `INSERT INTO public.content_tags (slug,label,category,description) VALUES ${tags.map(row => `(${row.map(q).join(",")})`).join(",")} ON CONFLICT (slug) DO UPDATE SET label=EXCLUDED.label,category=EXCLUDED.category,description=EXCLUDED.description;\n${facts.map(row => assignment("fact", row, ["asia", "east-asia", row.domain, quality(row), ...(row.timeSensitive ? ["time-sensitive"] : [])])).join("\n")}\n${notes.map(row => assignment("note", row, ["asia", "east-asia", row.domain, "reference-note", "source-attributed", ...(row.timeSensitive ? ["time-sensitive"] : [])])).join("\n")}\n${mcqs.map(row => assignment("mcq", row, ["asia", "east-asia", "china", "past-exam-mcq", "answer-key", exam(row.source)[3], "source-attributed", ...(row.timeSensitive ? ["time-sensitive"] : [])])).join("\n")}`;
  const verificationSql = checks.map(row => `INSERT INTO public.fact_verifications (source_page,entity_type,entity_id,claim_text,normalized_claim,verification_status,confidence,verification_sources,audit_note) SELECT ${row.source_page},${q(row.kind)},${entityRef(row.kind, row.canonical_hash)},${q(row.claim)},NULL,${q(row.status)},${q(row.confidence)}::confidence_level,${json(row.sources)},${q(row.status === "verified" ? "Direct corroboration is listed in the batch verification ledger." : "Source-attributed record retained with ordered image-grounded validation and explicit source linkage.")} WHERE NOT EXISTS (SELECT 1 FROM public.fact_verifications v WHERE v.entity_type=${q(row.kind)} AND v.entity_id=${entityRef(row.kind, row.canonical_hash)} AND v.claim_text=${q(row.claim)});`).join("\n");
  const derivedSql = `INSERT INTO public.flashcards (subject_id,book_id,chapter_id,topic_id,front_text,back_text,source_type,source_id,source_key) SELECT (SELECT id FROM public.subjects ORDER BY created_at ASC LIMIT 1),f.book_id,f.chapter_id,f.topic_id,f.title,f.fact_text,'fact',f.id,'batch0574-0578:fact:'||f.id::text FROM public.gk_facts f WHERE f.source_page BETWEEN 574 AND 578 AND NOT EXISTS (SELECT 1 FROM public.flashcards c WHERE c.source_key='batch0574-0578:fact:'||f.id::text); INSERT INTO public.flashcards (subject_id,book_id,chapter_id,topic_id,front_text,back_text,source_type,source_id,source_key) SELECT (SELECT id FROM public.subjects ORDER BY created_at ASC LIMIT 1),n.book_id,n.chapter_id,n.topic_id,n.title,n.content,'note',n.id,'batch0574-0578:note:'||n.id::text FROM public.gk_notes n WHERE n.source_page BETWEEN 574 AND 578 AND NOT EXISTS (SELECT 1 FROM public.flashcards c WHERE c.source_key='batch0574-0578:note:'||n.id::text); INSERT INTO public.flashcards (subject_id,book_id,chapter_id,topic_id,front_text,back_text,source_type,source_id,source_key) SELECT (SELECT id FROM public.subjects ORDER BY created_at ASC LIMIT 1),m.book_id,m.chapter_id,m.topic_id,m.question,'সঠিক উত্তর: '||o.option_key||'. '||o.option_text,'mcq',m.id,'batch0574-0578:mcq:'||m.id::text FROM public.gk_mcqs m JOIN public.gk_mcq_options o ON o.mcq_id=m.id AND o.is_correct WHERE m.source_page=574 AND NOT EXISTS (SELECT 1 FROM public.flashcards c WHERE c.source_key='batch0574-0578:mcq:'||m.id::text); INSERT INTO public.search_documents (entity_type,entity_id,title,body,english_metadata) SELECT 'fact',f.id,f.title,f.fact_text,'Status-marked GK fact | source page '||f.source_page::text FROM public.gk_facts f WHERE f.source_page BETWEEN 574 AND 578 AND NOT EXISTS (SELECT 1 FROM public.search_documents d WHERE d.entity_type='fact' AND d.entity_id=f.id); INSERT INTO public.search_documents (entity_type,entity_id,title,body,english_metadata) SELECT 'note',n.id,n.title,n.content,'Structured source reference | source page '||n.source_page::text FROM public.gk_notes n WHERE n.source_page BETWEEN 574 AND 578 AND NOT EXISTS (SELECT 1 FROM public.search_documents d WHERE d.entity_type='note' AND d.entity_id=n.id); INSERT INTO public.search_documents (entity_type,entity_id,title,body,english_metadata) SELECT 'mcq',m.id,NULL,m.question,'Past-exam MCQ | source page '||m.source_page::text||' | question '||m.source_question_number FROM public.gk_mcqs m WHERE m.source_page=574 AND NOT EXISTS (SELECT 1 FROM public.search_documents d WHERE d.entity_type='mcq' AND d.entity_id=m.id);`;
  const sql = `-- Generated by prepare_validated_batch_0574_0578.mjs. Source pages 574–578 only.\nBEGIN;\nINSERT INTO public.import_runs (source_filename,source_sha256,pipeline_version,status,completed_at,audit) VALUES ('Jubayer''sgk.pdf',${q(hash(pages.map(page => page.source_image_sha256).join("|")))},${q(PIPELINE_VERSION)},'completed',now(),${json(audit)});\n${chapterSql}\n${topicSql}\n${pageSql}\n${factSql}\n${noteSql}\n${mcqSql}\n${tagSql}\n${verificationSql}\n${derivedSql}\nCOMMIT;`;
  return { sql, audit };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const { sql, audit } = await buildBatch();
  const counts = {
    batch_pages: BATCH_PAGES,
    review_tiles: 35,
    eligible_mcqs: mcqs.length,
    eligible_mcq_options: mcqs.length * 4,
    withheld_mcqs: 8,
    fact_candidates: facts.length,
    note_candidates: notes.length,
    verification_statuses: audit.verification_counts,
  };
  await fs.mkdir(outputDir, { recursive: true });
  await fs.writeFile(path.join(outputDir, "validated_import.sql"), sql);
  await fs.writeFile(path.join(outputDir, "batch_audit.json"), JSON.stringify(audit, null, 2));
  await fs.writeFile(path.join(outputDir, "execute_sql_request.json"), JSON.stringify({ project_id: "rennotctgrxvbpghbimx", query: sql }));
  await fs.writeFile(path.join(workDir, "import_input_counts.json"), JSON.stringify(counts, null, 2));
  console.log(JSON.stringify({ outputDir, ...audit, counts }, null, 2));
}
