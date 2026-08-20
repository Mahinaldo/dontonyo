import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const workDir = "/home/ubuntu/dontonyo-work/batch-0559-0563";
const outputDir = path.join(root, "supabase", "batch-0559-0563");
export const BATCH_PAGES = [559, 560, 561, 562, 563];
export const PIPELINE_VERSION = "vision-quality-gated-batch-0559-0563-v1";
const BOOK_TITLE = "Jubayer's GK";
const q = value => `'${String(value ?? "").replaceAll("'", "''")}'`;
const json = value => `${q(JSON.stringify(value))}::jsonb`;
const hash = value => crypto.createHash("sha256").update(value, "utf8").digest("hex");
const values = rows => rows.map(row => `(${row.map(q).join(",")})`).join(",\n");
const files = BATCH_PAGES.map(page => path.join(workDir, "pages", `page_${String(page).padStart(4, "0")}.json`));

const refs = {
  balfour: "https://www.un.org/unispal/document/auto-insert-193242/",
  declaration: "https://main.knesset.gov.il/en/about/pages/declaration.aspx",
  unMembership: "https://www.un.org/unispal/document/auto-insert-200016/",
  palestineHistory: "https://www.un.org/unispal/history/",
  eastJerusalem: "https://history.state.gov/milestones/1961-1968/arab-israeli-war-1967",
  ironDome: "https://mod.gov.il/en/press-releases/press-room/israel-mod-signs-multi-billion-dollar-contract-with-rafael-to-expand-serial-production-of-iron-dome-system",
  rezaShah: "https://www.britannica.com/biography/Reza-Shah-Pahlavi",
  iranRevolution: "https://www.britannica.com/event/Iranian-Revolution",
  bushehr: "https://www.nti.org/education-center/facilities/bushehr-nuclear-power-plant-bnpp/",
  unIraqKuwait: "https://peacekeeping.un.org/sites/default/files/past/unikom/background.html",
  iraqWar: "https://www.georgewbushlibrary.gov/research/topic-guides/the-iraq-war",
  uniimog: "https://peacekeeping.un.org/sites/default/files/past/uniimog.htm",
  karbala: "https://www.britannica.com/place/Karbala",
  fallujah: "https://www.britannica.com/place/Fallujah",
  centralAsia: "https://www.britannica.com/place/Central-Asia",
};

const ctx = page => {
  if (page === 559) return { chapter: "middle-east-country-profiles", chapterTitle: "মধ্যপ্রাচ্যের দেশসমূহ", topic: "israel-special-facts-reference", topicTitle: "ইসরাইল — বিশেষ তথ্য ও উৎস-রেফারেন্স", domain: "israel" };
  if (page === 560) return { chapter: "middle-east-country-profiles", chapterTitle: "মধ্যপ্রাচ্যের দেশসমূহ", topic: "israel-past-questions", topicTitle: "ইসরাইল — বিগত বছরের প্রশ্ন", domain: "israel" };
  if (page === 561) return { chapter: "middle-east-country-profiles", chapterTitle: "মধ্যপ্রাচ্যের দেশসমূহ", topic: "iran-reference-profile", topicTitle: "ইরান — উৎস-রেফারেন্স", domain: "iran" };
  if (page === 562) return { chapter: "middle-east-country-profiles", chapterTitle: "মধ্যপ্রাচ্যের দেশসমূহ", topic: "iraq-reference-profile", topicTitle: "ইরাক — উৎস-রেফারেন্স", domain: "iraq" };
  return { chapter: "middle-east-country-profiles", chapterTitle: "মধ্যপ্রাচ্যের দেশসমূহ", topic: "iraq-past-questions-central-asia-table", topicTitle: "ইরাকের বিগত প্রশ্ন ও মধ্য এশিয়ার উৎস-টেবিল", domain: "iraq" };
};
const fact = (page, title, body, status = "source_attributed", confidence = "medium", sources = [], domain = ctx(page).domain, timeSensitive = false) => ({ source_page: page, title, fact_text: body, status, confidence, sources, domain, timeSensitive, ...ctx(page), canonical_hash: hash(`fact|${page}|${title}|${body}`) });
const note = (page, title, body, confidence = "medium", domain = ctx(page).domain, timeSensitive = false) => ({ source_page: page, title, content: body, status: "source_attributed", confidence, sources: [], domain, timeSensitive, ...ctx(page), canonical_hash: hash(`note|${page}|${title}|${body}`) });
const mcq = (page, number, question, options, correct, source, confidence = "high", domain = ctx(page).domain, timeSensitive = false, sources = []) => ({ source_page: page, number, question, options, correct, source, confidence, status: "source_attributed", sources, domain, timeSensitive, ...ctx(page), canonical_hash: hash(`mcq|${page}|${number}|${question}`) });

const facts = [
  fact(559, "Balfour Declaration (১৯১৭)", "United Nations-এ সংরক্ষিত ২ নভেম্বর ১৯১৭-এর Balfour Declaration-এ Palestine-এ Jewish people-এর national home প্রতিষ্ঠার প্রতি British Government-এর সমর্থনের ভাষা আছে।", "verified", "high", [refs.balfour], "israel", true),
  fact(559, "Israel declaration (১৪ মে ১৯৪৮)", "Knesset-এর ঘোষণাপত্রে ১৪ মে ১৯৪৮ তারিখে State of Israel প্রতিষ্ঠার ঘোষণা লিপিবদ্ধ আছে।", "verified", "high", [refs.declaration], "israel", true),
  fact(559, "Israel UN membership (১৯৪৯)", "United Nations Yearbook অনুযায়ী Resolution 273 (III)-এর মাধ্যমে ১১ মে ১৯৪৯ Israel-কে UN membership দেওয়া হয়।", "verified", "high", [refs.unMembership], "israel", true),
  fact(561, "Reza Shah Pahlavi (১৯২৫)", "Britannica অনুযায়ী Reza Khan ১৯২৫ সালে Iranian parliament-এর constituent assembly-এর মাধ্যমে shah নির্বাচিত হন।", "verified", "high", [refs.rezaShah], "iran", true),
  fact(561, "Iranian Revolution (১৯৭৮–৭৯)", "Britannica অনুযায়ী ১৯৭৮–৭৯ Iranian Revolution monarchy-এর পতন ঘটায় এবং Islamic republic প্রতিষ্ঠার দিকে নিয়ে যায়।", "verified", "high", [refs.iranRevolution], "iran", true),
  fact(561, "Bushehr nuclear plant — source-qualified reference", "Nuclear Threat Initiative Bushehr Nuclear Power Plant-কে Iran-এর first commercial nuclear reactor হিসেবে বর্ণনা করে।", "verified", "medium", [refs.bushehr], "iran", true),
  fact(562, "Iraq invasion of Kuwait (১৯৯০)", "United Nations UNIKOM background অনুযায়ী ২ আগস্ট ১৯৯০ Iraq Kuwait আক্রমণ ও দখল করে।", "verified", "high", [refs.unIraqKuwait], "iraq", true),
  fact(562, "Operation Iraqi Freedom (২০০৩)", "George W. Bush Presidential Library অনুযায়ী U.S.-led coalition ১৯ মার্চ ২০০৩ Operation Iraqi Freedom শুরু করে।", "verified", "high", [refs.iraqWar], "iraq", true),
  fact(562, "Saddam Hussein execution (২০০৬)", "George W. Bush Presidential Library অনুযায়ী Saddam Hussein ২০০৬ সালে Iraqi court-এর রায়ে মৃত্যুদণ্ড পান এবং ৩০ ডিসেম্বর ২০০৬ তাঁর সাজা কার্যকর হয়।", "verified", "high", [refs.iraqWar], "iraq", true),
  fact(563, "Central Asian independence (১৯৯১)", "Britannica অনুযায়ী Soviet Union ভেঙে যাওয়ার পরে Kazakhstan, Uzbekistan, Kyrgyzstan, Tajikistan ও Turkmenistan ১৯৯১ সালে স্বাধীন রাষ্ট্র হয়।", "verified", "high", [refs.centralAsia], "central-asia", false),
];

const notes = [
  note(559, "ইসরাইল — বিশেষ তথ্যের উৎস-সতর্কতা", "উৎসে Theodor Herzl, Chaim Weizmann, David Ben-Gurion, Golda Meir, Balfour Declaration, ১৯১৭/১৯৪৮/১৯৪৯, Aman, Mossad এবং Operation Defensive Shield-এর উল্লেখ আছে।\nসতর্কতা | biographical lines-এর বাইরে capital, territorial, state-status, military ও security wording source-attributed; hostile phrase এবং অস্পষ্ট লাইন learning fact হিসেবে নেওয়া হয়নি।", "medium", "israel", true),
  note(559, "২০১৮ আইন — উৎস-সময়ভিত্তিক নোট", "উৎসে জুলাই ২০১৮ সালের একটি আইনকে Jewish nation-state ও Jerusalem-সংক্রান্ত ভাষায় উপস্থাপন করা হয়েছে।\nসতর্কতা | law, capital ও reaction wording রাজনৈতিক/আইনি সংবেদনশীল এবং কিছুটা অস্পষ্ট; কেবল source-attributed note হিসেবে রাখা হয়েছে, current neutral fact হিসেবে নয়।", "medium", "israel", true),
  note(560, "ইসরাইল/ফিলিস্তিন — বিগত বছরের প্রশ্নের উৎস-সতর্কতা", "উৎসের প্রশ্নগুলো Al-Aqsa, Balfour Declaration, ১৯৪৮, East Jerusalem এবং Iron Dome-সংক্রান্ত।\nসতর্কতা | historical/territorial/security context explicit source attribution সহ রাখা হয়েছে; time-bound, dual-key, incorrect-premise ও option-mismatch প্রশ্ন বাদ দেওয়া হয়েছে।", "high", "israel", true),
  note(560, "প্রকাশিত Turkey correction — withheld question record", "উৎসে Q10-এর নিচে বলা হয়েছে Turkey প্রথম মুসলিম recognizer, কিন্তু Turkey বিকল্পে নেই এবং printed key Egypt নির্দেশ করে।\nসিদ্ধান্ত | source correction-টি audit note হিসেবে সংরক্ষিত; Q10 valid MCQ হিসেবে আমদানি করা হয়নি।", "high", "israel", true),
  note(561, "ইরান — ঐতিহাসিক ও বিশেষ তথ্যের উৎস-রেফারেন্স", "উৎসে Reza Shah, ১৯৭৯ Islamic Revolution, Ruhollah Khomeini, Persia/Iran naming, Revolutionary Guard, Persian Gulf, Bushehr, Nader Shah, Guardian Council ও cities-এর উল্লেখ আছে।\nসতর্কতা | governance, institutional-power, nuclear, election, diplomatic ও military wording source-attributed; পৃথকভাবে corroborated dates ছাড়া বাক্যগুলো current fact হিসেবে নেওয়া হয়নি।", "medium", "iran", true),
  note(561, "ইরান — map and dispute captions", "উৎসের মানচিত্রে Abu Musa এবং Shatt al-Arab-সংক্রান্ত captions আছে।\nসতর্কতা | territorial/waterway/conflict phrasing source-attributed; scan-এর caption থেকে কোনো স্বাধীন border, ownership বা causal assertion তৈরি করা হয়নি।", "medium", "iran", true),
  note(562, "ইরাক — ভৌগোলিক ও ঐতিহাসিক উৎস-রেফারেন্স", "উৎসে Euphrates, Tigris, Mesopotamia, British control, ১৯৩২ independence, Baghdad, Hulagu, Basra, Bayt al-Hikmah ও Iraq history-এর সংক্ষিপ্তসার আছে।\nসতর্কতা | unclear river transliterations, Hanging Gardens, waterway, armed-force ও political wording source-attributed অথবা withheld।", "medium", "iraq", true),
  note(562, "ইরাক — ১৯৯০–২০০৬ conflict-era source note", "উৎসে Kuwait ১৯৯০, ২০০৩ invasion, Baghdad fall, Operation Iraqi Freedom, Desert Storm, Desert Fox, Ba'ath Party ও Saddam Hussein-এর উল্লেখ আছে।\nসতর্কতা | যুদ্ধ/দখল/security framing source-attributed; শুধু directly corroborated dates আলাদা fact হিসেবে আছে।", "high", "iraq", true),
  note(562, "কারবালা ও religious-history source note", "উৎসে Karbala, Euphrates এবং ৬১ হিজরি-সংক্রান্ত religious-memory narrative আছে।\nসতর্কতা | ধর্মীয় শব্দচয়ন ও narrative source-attributed; এটি condensed neutral history বা assessment fact হিসেবে রূপান্তর করা হয়নি।", "medium", "iraq", true),
  note(563, "ইরাক — বিগত বছরের প্রশ্নের উৎস-রেফারেন্স", "উৎসে Karbala, UNIIMOG, Abu Ghraib, Fallujah এবং ১৯৯০ Kuwait invasion-সংক্রান্ত MCQ আছে।\nসতর্কতা | Q03-এর একটি option low-confidence; তাই Q03 withheld। বাকিগুলোর চারটি option এবং printed key visual review-এ মিলেছে।", "high", "iraq", true),
  note(563, "পাঁচটি মধ্য এশীয় দেশের উৎস-টেবিল", "উৎসে Kazakhstan, Kyrgyzstan, Turkmenistan, Uzbekistan ও Tajikistan-এর ১৯৯১ independence context, capitals, currency, superlatives এবং slogans আছে।\nসতর্কতা | দেশগুলোর `North-West Asia` classification, `no seaport` generalization, rankings, slogans, `Father of Apple Tree`, `ডার্বিন ল্যান্ড` এবং `City of Fountains` independent facts নয়; tableটি source-attributed অবস্থায় রাখা হয়েছে।", "medium", "central-asia", false),
];

const mcqs = [
  mcq(560, "01", "কোন ইসরাইলি নেতার আল-আকসা মসজিদ এলাকা সফরকে কেন্দ্র করে বর্তমান মধ্যপ্রাচ্য সংকট শুরু হয়?", ["শিমন প্যারেজ", "আইজাক রবিন", "গোল্ডা মেয়ার", "অ্যারিয়েল শ্যারন"], "ঘ", "DU ঘ' ০০-০১", "medium", "israel", true, [refs.palestineHistory]),
  mcq(560, "02", "বেলফোারের ঘোষণা কোন রাষ্ট্রের প্রতিষ্ঠার সঙ্গে সম্পর্কিত?", ["পাকিস্তান", "কসোভো", "ইসরাইল", "কিউবা"], "গ", "DU ঘ' ০৮-০৯", "high", "israel", true, [refs.balfour]),
  mcq(560, "06", "ইসরাইল কত সালে পূর্ব জেরুজালেম দখল করেছিলেন?", ["১৯৪৮ সালে", "১৯৫৭ সালে", "১৯৬৭ সালে", "১৯৭৩ সালে"], "গ", "26 BCS", "high", "israel", true, [refs.eastJerusalem]),
  mcq(560, "07", "ইসরাইল রাষ্ট্রের declaration হয় ১৯৪৮ সালের কোন মাসের কত তারিখ?", ["১০", "১২", "১৪", "১৫"], "গ", "প্রশাসন মন্ত্রণালয়ের সরকারি পরিচালক-০৫", "high", "israel", true, [refs.declaration]),
  mcq(560, "08", "ইহুদী রাষ্ট্র প্রতিষ্ঠার প্রতিশ্রুতি সংবলিত 'বেলফোরের ঘোষণা' কখন দেওয়া হয়েছিল?", ["১৯১৪ সালে", "১৯১৭ সালে", "১৯১৯ সালে", "১৯৪৮ সালে"], "খ", "পররাষ্ট্রমন্ত্রণালয়ের প্রশাসনিক কর্মচারী-০১", "high", "israel", true, [refs.balfour]),
  mcq(560, "12", "ইসরাইলের কেপশান প্রতিরক্ষা ব্যাবস্থা নাম-", ["Patriot", "Pantsir-S1", "Iron Dome", "S-300PS"], "গ", "নবা A'১৪-১৫", "medium", "israel", true, [refs.ironDome]),
  mcq(563, "01", "কারবালা বর্তমান কোন দেশে অবস্থিত?", ["জর্ডান", "সিরিয়া", "সৌদি আরব", "ইরাক"], "ঘ", "DU '০২-০৩", "high", "iraq", true, [refs.karbala]),
  mcq(563, "02", "ইরান-ইরাক যুদ্ধবিষয় তদারকি কাজে নিয়োজিত জাতিসংঘের বাহিনী কোন নামে পরিচিত ছিল?", ["UNIMOG", "UNIIMOG", "UNGOMAP", "UNICEF"], "খ", "43 BCS", "medium", "iran-iraq", true, [refs.uniimog]),
  mcq(563, "04", "ফালুজা শহরটি কোন দেশে অবস্থিত?", ["ইরাক", "সিরিয়া", "লিবিয়া", "ইরান"], "ক", "সশস্ত্র মন্ত্রণালয়ের প্রশাসনিক কর্মচারী, ০৭", "medium", "iraq", true, [refs.fallujah]),
  mcq(563, "05", "কত সালে ইরাক কুয়েত দখল করেছিল?", ["১৯৮৯", "১৯৯০", "১৯৯১", "১৯৯২"], "খ", "রবি, ইতিহাস, ০৮-০৯", "high", "iraq", true, [refs.unIraqKuwait]),
];

const tags = [
  ["west-asia", "West Asia", "domain", "Source-derived West Asia reference."], ["israel", "Israel", "domain", "Israel source material."], ["iran", "Iran", "domain", "Iran source material."], ["iraq", "Iraq", "domain", "Iraq source material."], ["central-asia", "Central Asia", "domain", "Central Asia source material."], ["iran-iraq", "Iran–Iraq", "domain", "Iran–Iraq source material."],
  ["reference-note", "Structured source note", "content_type", "Structured source reference with explicit caveats."], ["past-exam-mcq", "Past-exam MCQ", "content_type", "MCQ with a printed source key."], ["answer-key", "Answer key", "content_type", "Correct option from the printed key."],
  ["source-attributed", "Source-attributed", "quality", "Source-preserved material without direct corroboration in this batch."], ["externally-verified", "Externally verified", "quality", "Directly corroborated by cited evidence."], ["time-sensitive", "Time-sensitive reference", "quality", "Political, institutional, territorial, religious, diplomatic, military, nuclear, or security source material."],
  ["dhaka-university", "University of Dhaka", "exam_source", "University of Dhaka printed examination label."], ["bcs", "Bangladesh Civil Service", "exam_source", "Bangladesh Civil Service printed examination label."], ["unresolved-printed-label", "Unresolved printed label", "exam_source", "Partly unclear examination/source label retained without invention."],
];
const exam = source => {
  if (source.includes("DU")) return ["University of Dhaka", "University of Dhaka", "admission", "dhaka-university"];
  if (source.includes("BCS")) return ["Bangladesh Civil Service", null, "competitive", "bcs"];
  return ["Unresolved printed label", null, "competitive", "unresolved-printed-label"];
};
const quality = row => row.status === "verified" ? "externally-verified" : row.status === "conflicting" ? "conflicting-source" : "source-attributed";
const entityRef = (kind, h) => `(SELECT id FROM public.${kind === "fact" ? "gk_facts" : kind === "note" ? "gk_notes" : "gk_mcqs"} WHERE canonical_hash=${q(h)} LIMIT 1)`;

export async function buildBatch() {
  const pages = await Promise.all(files.map(file => fs.readFile(file, "utf8").then(JSON.parse)));
  const topics = [
    ["middle-east-country-profiles", "ইসরাইল — বিশেষ তথ্য ও উৎস-রেফারেন্স", "israel-special-facts-reference", 559, 4],
    ["middle-east-country-profiles", "ইসরাইল — বিগত বছরের প্রশ্ন", "israel-past-questions", 560, 5],
    ["middle-east-country-profiles", "ইরান — উৎস-রেফারেন্স", "iran-reference-profile", 561, 6],
    ["middle-east-country-profiles", "ইরাক — উৎস-রেফারেন্স", "iraq-reference-profile", 562, 7],
    ["middle-east-country-profiles", "ইরাকের বিগত প্রশ্ন ও মধ্য এশিয়ার উৎস-টেবিল", "iraq-past-questions-central-asia-table", 563, 8],
  ];
  const checks = [...facts.map(row => ({ kind: "fact", claim: row.fact_text, ...row })), ...notes.map(row => ({ kind: "note", claim: row.content, ...row })), ...mcqs.map(row => ({ kind: "mcq", claim: `${row.question} — printed answer: ${row.correct}`, ...row }))];
  const audit = {
    batch_pages: BATCH_PAGES, pipeline_version: PIPELINE_VERSION,
    source_pages: pages.map(page => ({ page: page.source_page, review_status: page.review.review_status, image_sha256: page.source_image_sha256, overall_confidence: page.review.overall_confidence })),
    generated_facts: facts.length, generated_notes: notes.length, generated_mcqs: mcqs.length, generated_options: mcqs.length * 4, generated_flashcards: facts.length + notes.length + mcqs.length,
    verification_counts: { verified: checks.filter(row => row.status === "verified").length, conflicting: checks.filter(row => row.status === "conflicting").length, source_attributed: checks.filter(row => row.status === "source_attributed").length },
    source_anomalies: [
      "All five pages rendered at 300 DPI and completed gpt-5-mini transcription plus independent image-grounded review.",
      "All 35 ordered overlapping dense-image tiles were reviewed.",
      "Page 560 questions 03, 04, 05, 09, 10, and 11 are withheld for time-bound, premise, corruption, option-mismatch, or dual-key failures.",
      "Page 563 question 03 is withheld because one source option remains low-confidence in the reviewed scan.",
      "Page 559 hostile wording, page 561 territorial captions, page 562 garbled items, and page 563 slogan/superlative material are not normalized into independent learning facts.",
      "Page 561 physical footer is ৫০৪; a stale low-level OCR footer value is superseded by the reviewed source image.",
    ],
    quality_gates: [
      "Exactly physical pages 559–563 are imported.", "Every imported MCQ has four visually reviewed source options and one printed key.",
      "No corrupted, dual-key, time-bound, option-mismatched, or historically flawed MCQ is imported.",
      "Tags use only approved categories and region/person/institution labels use category domain.", "Upserts are idempotent by canonical hash and stable derived-record keys.",
    ],
  };
  const topicSql = `INSERT INTO public.topics (chapter_id,title,slug,description,source_page,display_order) SELECT c.id,x.title,x.slug,'Source-preserved content with explicit review and verification status.',x.page::integer,x.ord::integer FROM (VALUES ${values(topics)}) x(chapter_slug,title,slug,page,ord) JOIN public.chapters c ON c.slug=x.chapter_slug AND c.book_id=(SELECT id FROM public.books WHERE title=${q(BOOK_TITLE)} LIMIT 1) WHERE NOT EXISTS (SELECT 1 FROM public.topics t WHERE t.chapter_id=c.id AND t.slug=x.slug);`;
  const printed = { 559: 502, 560: 503, 561: 504, 562: 505, 563: 506 };
  const pageSql = pages.map(page => { const c = ctx(page.source_page); const metadata = { source_image_sha256: page.source_image_sha256, extraction_model: page.model, review_status: page.review.review_status, corrections: page.review.corrections, unresolved_spans: page.review.unresolved_spans, physical_source_page: page.source_page, printed_book_page: printed[page.source_page], visual_review_report: `${workDir}/visual_review_559_563.md`, external_verification_report: `${workDir}/external_verification.md`, classification_report: `${workDir}/classification_decisions.md` }; return `INSERT INTO public.source_pages (import_run_id,book_id,source_page,page_kind,raw_transcription,chapter_heading,topic_heading,confidence,extraction_method,model_name,notes,review_metadata) SELECT (SELECT id FROM public.import_runs WHERE pipeline_version=${q(PIPELINE_VERSION)} ORDER BY started_at DESC LIMIT 1),b.id,${page.source_page},${q([560,563].includes(page.source_page) ? "mcq" : "educational")}::page_kind,${q(page.review.verified_transcript)},${q(c.chapterTitle)},${q(c.topicTitle)},${q(page.review.overall_confidence)}::confidence_level,'vision_ocr_with_image_grounded_review',${q(page.model)},'Quality-gated extraction with ordered source-tile review, withholding rules, and explicit verification status.',${json(metadata)} FROM public.books b WHERE b.title=${q(BOOK_TITLE)} AND NOT EXISTS (SELECT 1 FROM public.source_pages s WHERE s.book_id=b.id AND s.source_page=${page.source_page});`; }).join("\n");
  const factSql = `WITH d(page,chapter_slug,topic_slug,title,body,status,confidence,hash) AS (VALUES ${values(facts.map(row => [row.source_page, row.chapter, row.topic, row.title, row.fact_text, row.status, row.confidence, row.canonical_hash]))}) INSERT INTO public.gk_facts (book_id,chapter_id,topic_id,title,fact_text,explanation,source_page,source_section,source_excerpt,importance,confidence,canonical_hash) SELECT b.id,c.id,t.id,d.title,d.body,CASE d.status WHEN 'verified' THEN 'Direct corroboration is recorded in the batch verification ledger.' WHEN 'conflicting' THEN 'The printed source is retained with an explicit caveat and is not silently corrected.' ELSE 'Source-attributed material retained after ordered image review; it is not silently updated as a current assertion.' END,d.page::integer,d.title,d.body,3,d.confidence::confidence_level,d.hash FROM d JOIN public.books b ON b.title=${q(BOOK_TITLE)} JOIN public.chapters c ON c.book_id=b.id AND c.slug=d.chapter_slug JOIN public.topics t ON t.chapter_id=c.id AND t.slug=d.topic_slug ON CONFLICT (canonical_hash) DO UPDATE SET fact_text=EXCLUDED.fact_text,explanation=EXCLUDED.explanation,confidence=EXCLUDED.confidence;`;
  const noteSql = `WITH d(page,chapter_slug,topic_slug,title,body,confidence,hash) AS (VALUES ${values(notes.map(row => [row.source_page, row.chapter, row.topic, row.title, row.content, row.confidence, row.canonical_hash]))}) INSERT INTO public.gk_notes (book_id,chapter_id,topic_id,title,content,source_page,source_section,display_order,confidence,canonical_hash) SELECT b.id,c.id,t.id,d.title,d.body,d.page::integer,d.title,d.page::integer,d.confidence::confidence_level,d.hash FROM d JOIN public.books b ON b.title=${q(BOOK_TITLE)} JOIN public.chapters c ON c.book_id=b.id AND c.slug=d.chapter_slug JOIN public.topics t ON t.chapter_id=c.id AND t.slug=d.topic_slug ON CONFLICT (canonical_hash) DO UPDATE SET content=EXCLUDED.content,confidence=EXCLUDED.confidence;`;
  const mcqSql = mcqs.map(row => { const [name,institution,examType,normalizedName] = exam(row.source); const keys=["ক","খ","গ","ঘ"]; const options=row.options.map((option,index)=>`INSERT INTO public.gk_mcq_options (mcq_id,option_key,option_text,display_order,is_correct) SELECT m.id,${q(keys[index])},${q(option)},${index+1},${keys[index]===row.correct} FROM public.gk_mcqs m WHERE m.canonical_hash=${q(row.canonical_hash)} AND NOT EXISTS (SELECT 1 FROM public.gk_mcq_options o WHERE o.mcq_id=m.id AND o.option_key=${q(keys[index])});`).join("\n"); const explanation = "Printed answer key retained after visual review; historical, territorial, diplomatic, or security context is source-attributed and linked in the batch verification ledger."; return `INSERT INTO public.exam_sources (name,institution,exam_type,description,normalized_name) SELECT ${q(name)},${q(institution)},${q(examType)},${q(`Normalized from printed source label on page ${row.source_page}.`)},${q(normalizedName)} WHERE NOT EXISTS (SELECT 1 FROM public.exam_sources WHERE normalized_name=${q(normalizedName)}); INSERT INTO public.gk_mcqs (book_id,chapter_id,topic_id,question,correct_option,explanation,source_page,source_section,source_question_number,difficulty,confidence,canonical_hash) SELECT b.id,c.id,t.id,${q(row.question)},${q(row.correct)},${q(explanation)},${row.source_page},'বিগত বছরের প্রশ্ন',${q(row.number)},3,${q(row.confidence)}::confidence_level,${q(row.canonical_hash)} FROM public.books b JOIN public.chapters c ON c.book_id=b.id AND c.slug=${q(row.chapter)} JOIN public.topics t ON t.chapter_id=c.id AND t.slug=${q(row.topic)} WHERE b.title=${q(BOOK_TITLE)} ON CONFLICT (canonical_hash) DO UPDATE SET correct_option=EXCLUDED.correct_option,explanation=EXCLUDED.explanation,confidence=EXCLUDED.confidence; ${options} INSERT INTO public.gk_mcq_sources (mcq_id,exam_source_id,year,session,source_text,source_page) SELECT m.id,(SELECT id FROM public.exam_sources WHERE normalized_name=${q(normalizedName)} LIMIT 1),NULL,${q(row.source)},${q(row.source)},${row.source_page} FROM public.gk_mcqs m WHERE m.canonical_hash=${q(row.canonical_hash)} AND NOT EXISTS (SELECT 1 FROM public.gk_mcq_sources s WHERE s.mcq_id=m.id AND s.source_text=${q(row.source)} AND s.source_page=${row.source_page});`; }).join("\n");
  const factTags = facts.map(row => ["west-asia", row.domain, quality(row), ...(row.timeSensitive ? ["time-sensitive"] : [])].map(tag => `INSERT INTO public.content_tag_assignments (tag_id,entity_type,entity_id,source_page,confidence,assigned_by) SELECT t.id,'fact',f.id,${row.source_page},${q(row.confidence)}::confidence_level,'batch-0559-0563-quality-pipeline' FROM public.content_tags t JOIN public.gk_facts f ON f.canonical_hash=${q(row.canonical_hash)} WHERE t.slug=${q(tag)} ON CONFLICT DO NOTHING;`).join("\n")).join("\n");
  const noteTags = notes.map(row => ["west-asia", row.domain, "reference-note", "source-attributed", ...(row.timeSensitive ? ["time-sensitive"] : [])].map(tag => `INSERT INTO public.content_tag_assignments (tag_id,entity_type,entity_id,source_page,confidence,assigned_by) SELECT t.id,'note',n.id,${row.source_page},${q(row.confidence)}::confidence_level,'batch-0559-0563-quality-pipeline' FROM public.content_tags t JOIN public.gk_notes n ON n.canonical_hash=${q(row.canonical_hash)} WHERE t.slug=${q(tag)} ON CONFLICT DO NOTHING;`).join("\n")).join("\n");
  const mcqTags = mcqs.map(row => ["west-asia", row.domain, "past-exam-mcq", "answer-key", exam(row.source)[3], "source-attributed", ...(row.timeSensitive ? ["time-sensitive"] : [])].map(tag => `INSERT INTO public.content_tag_assignments (tag_id,entity_type,entity_id,source_page,confidence,assigned_by) SELECT t.id,'mcq',m.id,${row.source_page},${q(row.confidence)}::confidence_level,'batch-0559-0563-quality-pipeline' FROM public.content_tags t JOIN public.gk_mcqs m ON m.canonical_hash=${q(row.canonical_hash)} WHERE t.slug=${q(tag)} ON CONFLICT DO NOTHING;`).join("\n")).join("\n");
  const tagSql = `INSERT INTO public.content_tags (slug,label,category,description) VALUES ${tags.map(row=>`(${row.map(q).join(",")})`).join(",")} ON CONFLICT (slug) DO UPDATE SET label=EXCLUDED.label,category=EXCLUDED.category,description=EXCLUDED.description;\n${factTags}\n${noteTags}\n${mcqTags}`;
  const verificationSql = checks.map(row => `INSERT INTO public.fact_verifications (source_page,entity_type,entity_id,claim_text,normalized_claim,verification_status,confidence,verification_sources,audit_note) SELECT ${row.source_page},${q(row.kind)},${entityRef(row.kind,row.canonical_hash)},${q(row.claim)},NULL,${q(row.status)},${q(row.confidence)}::confidence_level,${json(row.sources)},${q(row.status === "verified" ? "Direct corroboration is listed in the batch verification ledger." : "Source-attributed record retained with ordered image-grounded validation and explicit source linkage.")} WHERE NOT EXISTS (SELECT 1 FROM public.fact_verifications v WHERE v.entity_type=${q(row.kind)} AND v.entity_id=${entityRef(row.kind,row.canonical_hash)} AND v.claim_text=${q(row.claim)});`).join("\n");
  const derivedSql = `INSERT INTO public.flashcards (subject_id,book_id,chapter_id,topic_id,front_text,back_text,source_type,source_id,source_key) SELECT (SELECT id FROM public.subjects ORDER BY created_at ASC LIMIT 1),f.book_id,f.chapter_id,f.topic_id,f.title,f.fact_text,'fact',f.id,'batch0559-0563:fact:'||f.id::text FROM public.gk_facts f WHERE f.source_page BETWEEN 559 AND 563 AND NOT EXISTS (SELECT 1 FROM public.flashcards c WHERE c.source_key='batch0559-0563:fact:'||f.id::text); INSERT INTO public.flashcards (subject_id,book_id,chapter_id,topic_id,front_text,back_text,source_type,source_id,source_key) SELECT (SELECT id FROM public.subjects ORDER BY created_at ASC LIMIT 1),n.book_id,n.chapter_id,n.topic_id,n.title,n.content,'note',n.id,'batch0559-0563:note:'||n.id::text FROM public.gk_notes n WHERE n.source_page BETWEEN 559 AND 563 AND NOT EXISTS (SELECT 1 FROM public.flashcards c WHERE c.source_key='batch0559-0563:note:'||n.id::text); INSERT INTO public.flashcards (subject_id,book_id,chapter_id,topic_id,front_text,back_text,source_type,source_id,source_key) SELECT (SELECT id FROM public.subjects ORDER BY created_at ASC LIMIT 1),m.book_id,m.chapter_id,m.topic_id,m.question,'সঠিক উত্তর: '||o.option_key||'. '||o.option_text,'mcq',m.id,'batch0559-0563:mcq:'||m.id::text FROM public.gk_mcqs m JOIN public.gk_mcq_options o ON o.mcq_id=m.id AND o.is_correct WHERE m.source_page IN (560,563) AND NOT EXISTS (SELECT 1 FROM public.flashcards c WHERE c.source_key='batch0559-0563:mcq:'||m.id::text); INSERT INTO public.search_documents (entity_type,entity_id,title,body,english_metadata) SELECT 'fact',f.id,f.title,f.fact_text,'Status-marked GK fact | source page '||f.source_page::text FROM public.gk_facts f WHERE f.source_page BETWEEN 559 AND 563 AND NOT EXISTS (SELECT 1 FROM public.search_documents d WHERE d.entity_type='fact' AND d.entity_id=f.id); INSERT INTO public.search_documents (entity_type,entity_id,title,body,english_metadata) SELECT 'note',n.id,n.title,n.content,'Structured source reference | source page '||n.source_page::text FROM public.gk_notes n WHERE n.source_page BETWEEN 559 AND 563 AND NOT EXISTS (SELECT 1 FROM public.search_documents d WHERE d.entity_type='note' AND d.entity_id=n.id); INSERT INTO public.search_documents (entity_type,entity_id,title,body,english_metadata) SELECT 'mcq',m.id,NULL,m.question,'Past-exam MCQ | source page '||m.source_page::text||' | question '||m.source_question_number FROM public.gk_mcqs m WHERE m.source_page IN (560,563) AND NOT EXISTS (SELECT 1 FROM public.search_documents d WHERE d.entity_type='mcq' AND d.entity_id=m.id);`;
  const sql = `-- Generated by prepare_validated_batch_0559_0563.mjs. Source pages 559–563 only.\nBEGIN;\nINSERT INTO public.import_runs (source_filename,source_sha256,pipeline_version,status,completed_at,audit) VALUES ('Jubayer''sgk.pdf',${q(hash(pages.map(page=>page.source_image_sha256).join("|")))},${q(PIPELINE_VERSION)},'completed',now(),${json(audit)});\n${topicSql}\n${pageSql}\n${factSql}\n${noteSql}\n${mcqSql}\n${tagSql}\n${verificationSql}\n${derivedSql}\nCOMMIT;`;
  return { sql, audit };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const { sql, audit } = await buildBatch();
  const counts = { batch_pages: BATCH_PAGES, review_tiles: 35, eligible_mcqs: mcqs.length, eligible_mcq_options: mcqs.length * 4, withheld_mcqs: 7, fact_candidates: facts.length, note_candidates: notes.length, verification_statuses: audit.verification_counts };
  await fs.mkdir(outputDir, { recursive: true });
  await fs.writeFile(path.join(outputDir, "validated_import.sql"), sql);
  await fs.writeFile(path.join(outputDir, "batch_audit.json"), JSON.stringify(audit, null, 2));
  await fs.writeFile(path.join(outputDir, "execute_sql_request.json"), JSON.stringify({ project_id: "rennotctgrxvbpghbimx", query: sql }));
  await fs.writeFile(path.join(workDir, "import_input_counts.json"), JSON.stringify(counts, null, 2));
  console.log(JSON.stringify({ outputDir, ...audit, counts }, null, 2));
}
