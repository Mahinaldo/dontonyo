import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const workDir = "/home/ubuntu/dontonyo-work/batch-0489-0493";
const outputDir = path.join(root, "supabase", "batch-0489-0493");
const sourcePages = [489, 490, 491, 492, 493];
const pageFiles = sourcePages.map(page => path.join(workDir, "pages", `page_${String(page).padStart(4, "0")}.json`));

export const BATCH_PAGES = [489, 490, 491, 492, 493];
export const BOOK_TITLE = "Jubayer's GK";
export const PIPELINE_VERSION = "vision-quality-gated-batch-0489-0493-v1";

const refs = {
  guinnessHot: ["https://www.guinnessworldrecords.com/world-records/66559-hottest-places"],
  mariana: ["https://www.ncei.noaa.gov/news/planet-postcard-mariana-trench"],
};

const sha = value => crypto.createHash("sha256").update(value, "utf8").digest("hex");
const q = value => `'${String(value ?? "").replaceAll("'", "''")}'`;
const json = value => `${q(JSON.stringify(value))}::jsonb`;
const values = rows => rows.map(row => `(${row.map(q).join(", ")})`).join(",\n");
const confidence = value => value === "low" || value === "high" ? value : "medium";

const tags = [
  ["bangladesh-abbreviations", "Bangladesh abbreviations", "domain", "Source-preserved abbreviation and expansion reference material."],
  ["international-affairs", "International affairs", "domain", "Source-derived international affairs and Earth reference material."],
  ["earth-reference", "Earth reference", "content_type", "Earth, ocean, continent, country, and geographic-reference material."],
  ["definition", "Definition", "content_type", "Definition or expansion preserved from the scanned source."],
  ["table", "Table or structured reference", "content_type", "Source table or structured reference list."],
  ["image-caption", "Image caption", "content_type", "Source image caption retained as context, not transformed into a fact."],
  ["past-exam-mcq", "Past-exam MCQ", "content_type", "MCQ with printed exam metadata and answer key."],
  ["answer-key", "Answer key", "content_type", "Correct answer from the printed source answer key."],
  ["source-attributed", "Source-attributed", "quality", "Source-preserved content not fully independently verified."],
  ["externally-verified", "Externally verified", "quality", "Claim corroborated by a direct external reference in the batch ledger."],
  ["source-typo-preserved", "Source typo preserved", "quality", "Visible source anomaly retained and separately documented rather than silently corrected."],
  ["dhaka-university", "University of Dhaka", "exam_source", "University of Dhaka examination label as printed."],
  ["bcs", "BCS", "exam_source", "Bangladesh Civil Service examination label as printed."],
  ["other-recruitment", "Other university and recruitment exam", "exam_source", "Other university or recruitment examination label as printed."],
];

function pageContext(page) {
  if (page === 489) {
    return { chapter: "bangladesh-abbreviations", topic: "bangladesh-abbreviations-reference", chapterTitle: "Abbreviations of Bangladesh", topicTitle: "Abbreviations of Bangladesh" };
  }
  if (page === 490) {
    return { chapter: "international-affairs", topic: "international-affairs-overview", chapterTitle: "আন্তর্জাতিক বিষয়াবলী", topicTitle: "আন্তর্জাতিক বিষয়াবলী" };
  }
  return { chapter: "international-affairs", topic: page === 493 ? "earth-past-exam-mcqs" : "earth-reference-material", chapterTitle: "আন্তর্জাতিক বিষয়াবলী", topicTitle: page === 493 ? "এই অধ্যায়ের সাথে জড়িত বিগত বছরের প্রশ্ন" : "পৃথিবী পরিচিতি" };
}

function verification(sourcePage, text, kind = "fact") {
  if (sourcePage === 491 && text.includes("মারিয়ানা ট্রেঞ্চ")) return { status: "verified", confidence: "high", sources: refs.mariana };
  if (sourcePage === 492 && text.includes("ডেথ ভ্যালি") && text.includes("৫৬.৭")) return { status: "verified", confidence: "medium", sources: refs.guinnessHot };
  return { status: "source_attributed", confidence: kind === "mcq" ? "medium" : "medium", sources: [] };
}

const fact = (source_page, title, fact_text, tag = "earth-reference") => {
  const context = pageContext(source_page);
  const verified = verification(source_page, fact_text);
  return { source_page, chapter_slug: context.chapter, topic_slug: context.topic, title, fact_text, tag, ...verified, canonical_hash: sha(`fact|${source_page}|${title}|${fact_text}`) };
};

const facts = [
  fact(490, "আন্তর্জাতিক বিষয়াবলী", "মানুষের হাতে তৈরি পৃথিবীর সবচেয়ে বড় স্থাপত্য চীনের মহাপ্রাচীর", "international-affairs"),
  fact(491, "পৃথিবী পরিচিতি", "পৃথিবীর আনুমানিক বয়স- ৪.৬ বিলিয়ন বছর বা ৪৬০ কোটি বছর প্রায়।"),
  fact(491, "পৃথিবী পরিচিতি", "পৃথিবীকে উত্তর দক্ষিণে বিভক্ত করেছে- নিরক্ষ রেখা।"),
  fact(491, "পৃথিবী পরিচিতি", "সূর্য থেকে পর্যায়ক্রমে তৃতীয় গ্রহ- পৃথিবী।"),
  fact(491, "পৃথিবী পরিচিতি", "পৃথিবীর বৃহত্তম মহাসাগর- প্রশান্ত মহাসাগর।"),
  fact(491, "পৃথিবী পরিচিতি", "পৃথিবীর গভীরতম মহাসাগর- প্রশান্ত মহাসাগর।"),
  fact(491, "পৃথিবী পরিচিতি", "প্রশান্ত মহাসাগরের গভীরতম স্থানের নাম- মারিয়ানা ট্রেঞ্চ।"),
  fact(491, "পৃথিবী পরিচিতি", "পৃথিবীর ক্ষুদ্রতম মহাসাগর- উত্তর মহাসাগর।"),
  fact(491, "পৃথিবী পরিচিতি", "পৃথিবীর বৃহত্তম মহাদেশ- এশিয়া মহাদেশ।"),
  fact(491, "পৃথিবী পরিচিতি", "পৃথিবীর ক্ষুদ্রতম মহাদেশ- ওশেনিয়া/অস্ট্রেলিয়া মহাদেশ।"),
  fact(491, "পৃথিবী পরিচিতি", "পৃথিবীর মোট রাষ্ট্রের সংখ্যা- ২৪৯টি।"),
  fact(492, "পৃথিবী পরিচিতি", "পৃথিবীর মোট স্বাধীন রাষ্ট্রের সংখ্যা- ১৯৫টি।"),
  fact(492, "পৃথিবী পরিচিতি", "আয়তনে পৃথিবীর বৃহত্তম দেশ- রাশিয়া।"),
  fact(492, "পৃথিবী পরিচিতি", "জনসংখ্যায় পৃথিবীর বৃহত্তম দেশ- ভারত।"),
  fact(492, "পৃথিবী পরিচিতি", "আয়তনে ও জনসংখ্যায় পৃথিবীর ক্ষুদ্রতম দেশ- ভ্যাটিক্যান সিটি।"),
  fact(492, "পৃথিবী পরিচিতি", "পৃথিবীর সর্বাধিক সীমান্তবর্তী দেশ- চীন ও রাশিয়া (১৪ টি করে দেশের সাথে সীমান্ত)।"),
  fact(492, "পৃথিবী পরিচিতি", "পৃথিবীর দীর্ঘতম সীমান্ত যে দুইটি দেশের মধ্যে অবস্থিত- যুক্তরাষ্ট্র-কানাডা।"),
  fact(492, "পৃথিবী পরিচিতি", "পৃথিবীর ক্ষুদ্রতম সীমান্ত যে দু'টি দেশের মধ্যে অবস্থিত- ইতালি-ভ্যাটিক্যান সিটি।"),
  fact(492, "পৃথিবী পরিচিতি", "পৃথিবীর সর্বাধিক দ্বীপপুঞ্জের দেশ- ইন্দোনেশিয়া।"),
  fact(492, "পৃথিবী পরিচিতি", "পৃথিবীর সবচেয়ে প্রলম্বিত বা সরু দেশ- চিলি।"),
  fact(492, "পৃথিবী পরিচিতি", "পৃথিবীর ছিদ্রায়িত দেশ- ইতালি ও দক্ষিণ আফ্রিকা।"),
  fact(492, "পৃথিবী পরিচিতি", "পৃথিবীর সবচেয়ে উত্তরের নগরীর নাম- হ্যামারফাস্ট; নরওয়ে।"),
  fact(492, "পৃথিবী পরিচিতি", "পৃথিবীর সবচেয়ে দক্ষিণের নগরীর নাম- পুয়ের্তো উইলিয়াম; চিলি।"),
  fact(492, "পৃথিবী পরিচিতি", "পৃথিবীর যে দুটি দেশ দুই মহাদেশে অবস্থিত- রাশিয়া ও তুরস্ক।"),
  fact(492, "পৃথিবী পরিচিতি", "পৃথিবীর খণ্ডিত রাষ্ট্রগুলো- ইন্দোনেশিয়া ও জাপান।"),
  fact(492, "পৃথিবী পরিচিতি", "পৃথিবীর সর্বাধিক বৃষ্টিপাতের স্থান- মৌসিনরাম; ভারতের মেঘালয়ে অবস্থিত।"),
  fact(492, "পৃথিবী পরিচিতি", "পৃথিবীর দীর্ঘতম নদী- নীল নদ।"),
  fact(492, "পৃথিবী পরিচিতি", "পৃথিবীর ক্ষুদ্রতম নদী- রোঁ নদী।"),
  fact(492, "পৃথিবী পরিচিতি", "বিশ্বের প্রাচীনতম সভ্যতা- মেসোপটেমিয়া সভ্যতা।"),
  fact(492, "পৃথিবী পরিচিতি", "বিশ্বের প্রাচীনতম বিশ্ববিদ্যালয়- নালন্দা বিশ্ববিদ্যালয় (ভারত)।"),
  fact(492, "পৃথিবী পরিচিতি", "বিশ্বের সবচেয়ে প্রাচীন ভাষা- হিব্রু ভাষা।"),
  fact(492, "পৃথিবী পরিচিতি", "পৃথিবীর শীতলতম স্থান- ভস্তক (-৮৯° সে.); এন্টার্কটিকায় অবস্থিত।"),
  fact(492, "পৃথিবী পরিচিতি", "পৃথিবীর উষ্ণতম স্থান- ডেথ ভ্যালি, যুক্তরাষ্ট্র (৫৬.৭°)। [সূত্র: guinnessworldrecords]"),
];

const note = (source_page, title, content, tag, anomalies = []) => {
  const context = pageContext(source_page);
  const verified = verification(source_page, content, "note");
  return { source_page, chapter_slug: context.chapter, topic_slug: context.topic, title, content, tag, anomalies, ...verified, canonical_hash: sha(`note|${source_page}|${title}|${content}`) };
};

const notes = [
  note(489, "Abbreviations of Bangladesh", "ADP Annual Development Programmer.\nADC Additional Deputy Commissioner.\nBA Bachelor of Arts.\nBBA Bachelor of Business Administration.\nBAF Bangladesh Air Force.\nBASIC Bank of Small Industries and Commerce.\nBCB Bangladesh Cricket Board.\nBCom Bachelor of Commerce.\nBCS Bangladesh Civil Service.\nBDR Bangladesh Rifles.\nBJMA Bangladesh Jute Mills Corporation.\nBIT Bangladesh Institute of Technology.\nBAS Bangladesh Academy for Science.\nBOA Bangladesh Olympic Association.\nBSC Bangladesh Shipping Corporation.\nBSTI Bangladesh Standards and Testing Institution.\nBURO Bangladesh Unemployment Rehabilitation Organization.\nCID Criminal Investigation Department.\nDD Deputy Director.\nDG Director General.\nDIG Deputy Inspector General (of Police.)\nDMC Dhaka Medical College.\nDMP Dhaka Metropolitan Police.\nGM General Manager.\nNAEM National Academy for Educational Management.\nNIPORT National Institute of Population Research and Training.\nNU National University.\nRAB Rapid Action Battalion.\nRAJUK Rajdhani Unnayan Kartripokkha.\nTCB Trading Corporation of Bangladesh.\nUCB United Commercial Bank.\nUNO Upazila Nirbahi Officer.\nVC Vice Chairman.\nVP Vice President.\nZPG Zero Population Growth.", "table", ["The source visibly prints 'Annual Development Programmer' for ADP; retained verbatim.", "The source visibly prints 'BJMA' for Bangladesh Jute Mills Corporation; retained verbatim rather than silently changed to BJMC."]),
  note(490, "পৃষ্ঠা 490-এর চিত্রের ক্যাপশন", "স্ট্যাচু অব লিবার্টি\nব্যাবিলনের ঝুলন্ত উদ্যান", "image-caption"),
  note(491, "পৃথিবীর মহাসাগর", "পৃথিবীতে মহাসাগর রয়েছে- ৫টি\nপ্রশান্ত মহাসাগর\nআটলান্টিক মহাসাগর\nভারত মহাসাগর\nউত্তর/আর্কটিক মহাসাগর\nদক্ষিণ/এন্টার্কটিক মহাসাগর", "table"),
  note(491, "পৃথিবীর মহাদেশ", "পৃথিবীতে মহাদেশ রয়েছে- ৭টি\nএশিয়া\nআফ্রিকা\nইউরোপ\nউত্তর আমেরিকা\nদক্ষিণ আমেরিকা\nওশেনিয়া/অস্ট্রেলিয়া\nএন্টার্কটিকা", "table"),
  note(492, "মহাদেশভিত্তিক স্বাধীন রাষ্ট্র", "মহাদেশ | মোট স্বাধীন দেশ | জাতিসংঘভুক্ত দেশ | সর্বশেষ স্বাধীন রাষ্ট্র\nএশিয়া | ৪৪ | ৪৪ | তিমুর লিসতে\nইউরোপ | ৪৮ | ৪৬ | কসোভো\nআফ্রিকা | ৫৪ | ৫৪ | দক্ষিণ সুদান\nউত্তর আমেরিকা | ২৩ | ২৩ | সেন্ট কিটস এন্ড নেভিস\nদক্ষিণ আমেরিকা | ১২ | ১২ | সুরিনাম\nওশেনিয়া | ১৪ | ১৪ | টুভালু\nএন্টার্কটিকা | - | - | -\nমোট | ১৯৫ | ১৯৩ | -", "table"),
];

const mcq = (number, question, options, correct, source) => {
  const verified = verification(493, `${question} ${options.join(" ")}`, "mcq");
  return { source_page: 493, number, question, options, correct, source, ...verified, canonical_hash: sha(`mcq|493|${number}|${question}`) };
};

const mcqs = [
  mcq("01", "আয়তনের দিক থেকে বিশ্বের সর্ববৃহৎ দেশ-", ["কানাডা", "রাশিয়া", "ব্রাজিল", "ভারত"], "খ", "DU ঘ' ০৭-০৮, ০২-০৩, ০০-০১"),
  mcq("02", "আয়তনে সবচেয়ে বড় দেশ-", ["অস্ট্রেলিয়া", "কানাডা", "চীন", "মার্কিন যুক্তরাষ্ট্র"], "খ", "DU খ' ১৪-১৫"),
  mcq("03", "আয়তনের দিক দিয়ে পৃথিবীর তৃতীয় বৃহত্তম দেশ-", ["চীন", "যুক্তরাষ্ট্র", "অস্ট্রেলিয়া", "ব্রাজিল"], "ক", "DU খ' ০৭-০৮"),
  mcq("04", "আয়তন ও লোকসংখ্যায় কোনটি পৃথিবীর ক্ষুদ্রতম স্বাধীন দেশ?", ["মালদ্বীপ", "ভ্যাটিকান সিটি", "তাইওয়ান", "সিঙ্গাপুর"], "খ", "DU ঘ' ৯৮-৯৯: খ' ৯৭-৯৮"),
  mcq("05", "ক্ষুদ্রতম মহাদেশ-", ["অস্ট্রেলিয়া", "ইউরোপ", "আফ্রিকা", "দ. আফ্রিকা"], "ক", "45 BCS"),
  mcq("06", "বিশ্বের নতুনতম রাষ্ট্র কোনটি?", ["লাইবেরিয়া", "হংকং", "পূর্ব তিমুর", "দক্ষিণ সুদান"], "ঘ", "25 BCS"),
  mcq("07", "পৃথিবীর বৃহত্তম মহাদেশ কোনটি?", ["আফ্রিকা", "ইউরেশিয়া", "এশিয়া", "উত্তর আমেরিকা"], "গ", "22 BCS"),
  mcq("08", "The second Largest continent on Earth is-", ["Asia", "Africa", "North America", "South America"], "খ", "জাহাবি রাষ্ট্রবিজ্ঞান, ০৮-০৯"),
  mcq("09", "Which is the world's second-largest country in land area?", ["China", "Canada", "Russia", "Brazil"], "খ", "Eastern Bank Officer, 05"),
  mcq("10", "সমুদ্রপথে প্রথম বিশ্ব ভ্রমণ করেন কে?", ["ফার্ডিনান্ড ম্যাগেলান", "জর্জ ফার্নান্দেজ", "কলম্বাস", "ভাস্কো-দা-গামা"], "ক", "চবি 'I' 15-16"),
];

function examInfo(source) {
  if (source.includes("DU")) return ["University of Dhaka", "University of Dhaka", "admission", "dhaka-university"];
  if (source.includes("BCS")) return ["Bangladesh Civil Service", null, "competitive", "bcs"];
  return ["Other university and recruitment examination", null, "competitive", "other-recruitment"];
}

function qualityTag(status) { return status === "verified" ? "externally-verified" : "source-attributed"; }
function recordLookup(type, hash) {
  if (type === "fact") return `(SELECT id FROM public.gk_facts WHERE canonical_hash = ${q(hash)} LIMIT 1)`;
  if (type === "note") return `(SELECT id FROM public.gk_notes WHERE canonical_hash = ${q(hash)} LIMIT 1)`;
  return `(SELECT id FROM public.gk_mcqs WHERE canonical_hash = ${q(hash)} LIMIT 1)`;
}

function pageMetadata(page) {
  const printed = { 489: 491, 490: 490, 491: 491, 492: 495, 493: 493 }[page.source_page];
  return {
    source_image_sha256: page.source_image_sha256,
    extraction_model: page.model,
    review_status: page.review.review_status,
    corrections: page.review.corrections,
    unresolved_spans: page.review.unresolved_spans,
    accepted_content_tags: page.review.accepted_content_tags,
    physical_source_page: page.source_page,
    printed_book_page: printed,
    nested_artifact_page_number: page.transcription.source_page,
    page_number_mismatch: page.transcription.source_page !== page.source_page || printed !== page.source_page ? "Physical PDF page, reviewed footer, and nested OCR metadata are retained separately; no page number was silently normalised." : null,
    visual_review_report: "/home/ubuntu/dontonyo/reports/batch-0489-0493_visual_review.md",
    external_verification_report: "/home/ubuntu/dontonyo/reports/batch-0489-0493_external_verification.md",
  };
}

export async function buildBatch() {
  const pages = await Promise.all(pageFiles.map(async file => JSON.parse(await fs.readFile(file, "utf8"))));
  const checks = [
    ...facts.map(row => ({ type: "fact", hash: row.canonical_hash, source_page: row.source_page, claim: row.fact_text, normalized: row.fact_text, status: row.status, confidence: row.confidence, sources: row.sources })),
    ...notes.map(row => ({ type: "note", hash: row.canonical_hash, source_page: row.source_page, claim: row.content, normalized: row.content, status: row.status, confidence: row.confidence, sources: row.sources })),
    ...mcqs.map(row => ({ type: "mcq", hash: row.canonical_hash, source_page: row.source_page, claim: `${row.question} — printed answer: ${row.correct}`, normalized: null, status: row.status, confidence: row.confidence, sources: row.sources })),
  ];
  const chapterSql = `INSERT INTO public.chapters (book_id, chapter_number, title, slug, description, source_page, display_order) SELECT b.id, x.chapter_number, x.title, x.slug, x.description, x.source_page, x.display_order FROM (VALUES (45, 'Abbreviations of Bangladesh', 'bangladesh-abbreviations', 'Source-preserved Bangladesh abbreviation table with visible anomalies retained.', 489, 45), (46, 'আন্তর্জাতিক বিষয়াবলী', 'international-affairs', 'Source-derived international affairs and Earth-reference material with explicit verification states.', 490, 46)) AS x(chapter_number, title, slug, description, source_page, display_order) JOIN public.books b ON b.title = ${q(BOOK_TITLE)} WHERE NOT EXISTS (SELECT 1 FROM public.chapters c WHERE c.book_id = b.id AND c.slug = x.slug);`;
  const topicSql = `INSERT INTO public.topics (chapter_id, title, slug, description, source_page, display_order) SELECT c.id, x.title, x.slug, x.description, x.source_page, x.display_order FROM (VALUES ('bangladesh-abbreviations', 'Abbreviations of Bangladesh', 'bangladesh-abbreviations-reference', 'Source-preserved Bangladesh abbreviation expansions with anomalies retained verbatim.', 489, 1), ('international-affairs', 'আন্তর্জাতিক বিষয়াবলী', 'international-affairs-overview', 'Source chapter opener, image captions, and reference material.', 490, 1), ('international-affairs', 'পৃথিবী পরিচিতি', 'earth-reference-material', 'Source-derived Earth, ocean, continent, country, and geographic reference material.', 491, 2), ('international-affairs', 'পৃথিবী পরিচিতি সম্পর্কিত বিগত বছরের প্রশ্ন', 'earth-past-exam-mcqs', 'Past-exam MCQs with all source options, printed answer key, and exam labels.', 493, 3)) AS x(chapter_slug, title, slug, description, source_page, display_order) JOIN public.chapters c ON c.slug = x.chapter_slug AND c.book_id = (SELECT id FROM public.books WHERE title = ${q(BOOK_TITLE)} LIMIT 1) WHERE NOT EXISTS (SELECT 1 FROM public.topics t WHERE t.chapter_id = c.id AND t.slug = x.slug);`;
  const pagesSql = pages.map(page => {
    const context = pageContext(page.source_page);
    const kind = page.source_page === 493 ? "mcq" : "educational";
    return `INSERT INTO public.source_pages (import_run_id, book_id, source_page, page_kind, raw_transcription, chapter_heading, topic_heading, confidence, extraction_method, model_name, notes, review_metadata) SELECT (SELECT id FROM public.import_runs WHERE pipeline_version = ${q(PIPELINE_VERSION)} ORDER BY started_at DESC LIMIT 1), b.id, ${page.source_page}, ${q(kind)}::page_kind, ${q(page.review.verified_transcript)}, ${q(context.chapterTitle)}, ${q(context.topicTitle)}, ${q(confidence(page.review.overall_confidence))}::confidence_level, 'vision_ocr_with_image_grounded_review', ${q(page.model)}, 'Quality-gated source extraction with ordered tile review, semantic separation, external-verification ledger, and source-anomaly preservation.', ${json(pageMetadata(page))} FROM public.books b WHERE b.title = ${q(BOOK_TITLE)} AND NOT EXISTS (SELECT 1 FROM public.source_pages s WHERE s.book_id = b.id AND s.source_page = ${page.source_page});`;
  }).join("\n");
  const factsSql = `WITH data(source_page, chapter_slug, topic_slug, title, fact_text, confidence, canonical_hash, status) AS (VALUES\n${values(facts.map(row => [row.source_page, row.chapter_slug, row.topic_slug, row.title, row.fact_text, row.confidence, row.canonical_hash, row.status]))}) INSERT INTO public.gk_facts (book_id, chapter_id, topic_id, title, fact_text, explanation, source_page, source_section, source_excerpt, importance, confidence, canonical_hash) SELECT b.id, c.id, t.id, d.title, d.fact_text, CASE d.status WHEN 'verified' THEN 'Directly corroborated by a source in the batch verification ledger; original wording is retained.' ELSE 'Source-attributed material retained with explicit verification status and source linkage.' END, d.source_page::integer, d.title, d.fact_text, 3, d.confidence::confidence_level, d.canonical_hash FROM data d JOIN public.books b ON b.title = ${q(BOOK_TITLE)} JOIN public.chapters c ON c.book_id = b.id AND c.slug = d.chapter_slug JOIN public.topics t ON t.chapter_id = c.id AND t.slug = d.topic_slug ON CONFLICT (canonical_hash) DO UPDATE SET fact_text = EXCLUDED.fact_text, explanation = EXCLUDED.explanation, confidence = EXCLUDED.confidence;`;
  const notesSql = `WITH data(source_page, chapter_slug, topic_slug, title, content, confidence, canonical_hash) AS (VALUES\n${values(notes.map(row => [row.source_page, row.chapter_slug, row.topic_slug, row.title, row.content, row.confidence, row.canonical_hash]))}) INSERT INTO public.gk_notes (book_id, chapter_id, topic_id, title, content, source_page, source_section, display_order, confidence, canonical_hash) SELECT b.id, c.id, t.id, d.title, d.content, d.source_page::integer, d.title, d.source_page::integer, d.confidence::confidence_level, d.canonical_hash FROM data d JOIN public.books b ON b.title = ${q(BOOK_TITLE)} JOIN public.chapters c ON c.book_id = b.id AND c.slug = d.chapter_slug JOIN public.topics t ON t.chapter_id = c.id AND t.slug = d.topic_slug ON CONFLICT (canonical_hash) DO UPDATE SET content = EXCLUDED.content, confidence = EXCLUDED.confidence;`;
  const mcqSql = mcqs.map(row => {
    const [name, institution, exam_type, normalized] = examInfo(row.source);
    const context = pageContext(row.source_page);
    const keys = ["ক", "খ", "গ", "ঘ"];
    const optionsSql = row.options.map((option, index) => `INSERT INTO public.gk_mcq_options (mcq_id, option_key, option_text, display_order, is_correct) SELECT m.id, ${q(keys[index])}, ${q(option)}, ${index + 1}, ${keys[index] === row.correct} FROM public.gk_mcqs m WHERE m.canonical_hash = ${q(row.canonical_hash)} AND NOT EXISTS (SELECT 1 FROM public.gk_mcq_options o WHERE o.mcq_id = m.id AND o.option_key = ${q(keys[index])});`).join("\n");
    return `INSERT INTO public.exam_sources (name, institution, exam_type, description, normalized_name) SELECT ${q(name)}, ${q(institution)}, ${q(exam_type)}, ${q(`Normalized from printed source label on page ${row.source_page}.`)}, ${q(normalized)} WHERE NOT EXISTS (SELECT 1 FROM public.exam_sources WHERE normalized_name = ${q(normalized)}); INSERT INTO public.gk_mcqs (book_id, chapter_id, topic_id, question, correct_option, explanation, source_page, source_section, source_question_number, difficulty, confidence, canonical_hash) SELECT b.id, c.id, t.id, ${q(row.question)}, ${q(row.correct)}, 'Printed answer key retained as source-attributed material. The page image and answer-key sequence were visually reconciled before import.', ${row.source_page}, 'এই অধ্যায়ের সাথে জড়িত বিগত বছরের প্রশ্ন', ${q(row.number)}, 3, ${q(row.confidence)}::confidence_level, ${q(row.canonical_hash)} FROM public.books b JOIN public.chapters c ON c.book_id = b.id AND c.slug = ${q(context.chapter)} JOIN public.topics t ON t.chapter_id = c.id AND t.slug = ${q(context.topic)} WHERE b.title = ${q(BOOK_TITLE)} ON CONFLICT (canonical_hash) DO UPDATE SET correct_option = EXCLUDED.correct_option, explanation = EXCLUDED.explanation, confidence = EXCLUDED.confidence; ${optionsSql} INSERT INTO public.gk_mcq_sources (mcq_id, exam_source_id, year, session, source_text, source_page) SELECT m.id, (SELECT id FROM public.exam_sources WHERE normalized_name = ${q(normalized)} LIMIT 1), NULL, ${q(row.source)}, ${q(row.source)}, ${row.source_page} FROM public.gk_mcqs m WHERE m.canonical_hash = ${q(row.canonical_hash)} AND NOT EXISTS (SELECT 1 FROM public.gk_mcq_sources s WHERE s.mcq_id = m.id AND s.source_text = ${q(row.source)} AND s.source_page = ${row.source_page});`;
  }).join("\n");
  const tagSql = `INSERT INTO public.content_tags (slug, label, category, description) VALUES\n${tags.map(tag => `(${tag.map(q).join(", ")})`).join(",\n")} ON CONFLICT (slug) DO UPDATE SET label = EXCLUDED.label, category = EXCLUDED.category, description = EXCLUDED.description;\n${facts.map(row => [row.tag, qualityTag(row.status)].map(tag => `INSERT INTO public.content_tag_assignments (tag_id, entity_type, entity_id, source_page, confidence, assigned_by) SELECT t.id, 'fact', f.id, ${row.source_page}, ${q(row.confidence)}::confidence_level, 'batch-0489-0493-quality-pipeline' FROM public.content_tags t JOIN public.gk_facts f ON f.canonical_hash = ${q(row.canonical_hash)} WHERE t.slug = ${q(tag)} ON CONFLICT DO NOTHING;`).join("\n")).join("\n")}\n${notes.map(row => [row.tag, qualityTag(row.status), ...(row.anomalies.length ? ["source-typo-preserved"] : [])].map(tag => `INSERT INTO public.content_tag_assignments (tag_id, entity_type, entity_id, source_page, confidence, assigned_by) SELECT t.id, 'note', n.id, ${row.source_page}, ${q(row.confidence)}::confidence_level, 'batch-0489-0493-quality-pipeline' FROM public.content_tags t JOIN public.gk_notes n ON n.canonical_hash = ${q(row.canonical_hash)} WHERE t.slug = ${q(tag)} ON CONFLICT DO NOTHING;`).join("\n")).join("\n")}\n${mcqs.map(row => ["past-exam-mcq", "answer-key", examInfo(row.source)[3], qualityTag(row.status)].map(tag => `INSERT INTO public.content_tag_assignments (tag_id, entity_type, entity_id, source_page, confidence, assigned_by) SELECT t.id, 'mcq', m.id, ${row.source_page}, ${q(row.confidence)}::confidence_level, 'batch-0489-0493-quality-pipeline' FROM public.content_tags t JOIN public.gk_mcqs m ON m.canonical_hash = ${q(row.canonical_hash)} WHERE t.slug = ${q(tag)} ON CONFLICT DO NOTHING;`).join("\n")).join("\n")}`;
  const verificationSql = checks.map(row => {
    const id = recordLookup(row.type, row.hash);
    return `INSERT INTO public.fact_verifications (source_page, entity_type, entity_id, claim_text, normalized_claim, verification_status, confidence, verification_sources, audit_note) SELECT ${row.source_page}, ${q(row.type)}, ${id}, ${q(row.claim)}, ${row.normalized ? q(row.normalized) : "NULL"}, ${q(row.status)}, ${q(row.confidence)}::confidence_level, ${json(row.sources)}, ${q(row.status === "verified" ? "Direct external corroboration is listed in the batch verification ledger." : "Source-attributed record retained with explicit source linkage; no silent factual update.")} WHERE NOT EXISTS (SELECT 1 FROM public.fact_verifications v WHERE v.entity_type = ${q(row.type)} AND v.entity_id = ${id} AND v.claim_text = ${q(row.claim)});`;
  }).join("\n");
  const derivedSql = `INSERT INTO public.flashcards (subject_id, book_id, chapter_id, topic_id, front_text, back_text, source_type, source_id, source_key) SELECT (SELECT id FROM public.subjects ORDER BY created_at ASC LIMIT 1), f.book_id, f.chapter_id, f.topic_id, f.title, f.fact_text, 'fact', f.id, 'batch0489-0493:fact:' || f.id::text FROM public.gk_facts f WHERE f.source_page BETWEEN 489 AND 492 AND NOT EXISTS (SELECT 1 FROM public.flashcards c WHERE c.source_key = 'batch0489-0493:fact:' || f.id::text); INSERT INTO public.flashcards (subject_id, book_id, chapter_id, topic_id, front_text, back_text, source_type, source_id, source_key) SELECT (SELECT id FROM public.subjects ORDER BY created_at ASC LIMIT 1), n.book_id, n.chapter_id, n.topic_id, n.title, n.content, 'note', n.id, 'batch0489-0493:note:' || n.id::text FROM public.gk_notes n WHERE n.source_page BETWEEN 489 AND 492 AND NOT EXISTS (SELECT 1 FROM public.flashcards c WHERE c.source_key = 'batch0489-0493:note:' || n.id::text); INSERT INTO public.flashcards (subject_id, book_id, chapter_id, topic_id, front_text, back_text, source_type, source_id, source_key) SELECT (SELECT id FROM public.subjects ORDER BY created_at ASC LIMIT 1), m.book_id, m.chapter_id, m.topic_id, m.question, 'সঠিক উত্তর: ' || o.option_key || '. ' || o.option_text, 'mcq', m.id, 'batch0489-0493:mcq:' || m.id::text FROM public.gk_mcqs m JOIN public.gk_mcq_options o ON o.mcq_id = m.id AND o.is_correct WHERE m.source_page = 493 AND NOT EXISTS (SELECT 1 FROM public.flashcards c WHERE c.source_key = 'batch0489-0493:mcq:' || m.id::text); INSERT INTO public.search_documents (entity_type, entity_id, title, body, english_metadata) SELECT 'fact', f.id, f.title, f.fact_text, 'Source-linked GK fact | page ' || f.source_page::text FROM public.gk_facts f WHERE f.source_page BETWEEN 489 AND 492 AND NOT EXISTS (SELECT 1 FROM public.search_documents d WHERE d.entity_type = 'fact' AND d.entity_id = f.id); INSERT INTO public.search_documents (entity_type, entity_id, title, body, english_metadata) SELECT 'note', n.id, n.title, n.content, 'Source-linked GK note | page ' || n.source_page::text FROM public.gk_notes n WHERE n.source_page BETWEEN 489 AND 492 AND NOT EXISTS (SELECT 1 FROM public.search_documents d WHERE d.entity_type = 'note' AND d.entity_id = n.id); INSERT INTO public.search_documents (entity_type, entity_id, title, body, english_metadata) SELECT 'mcq', m.id, NULL, m.question, 'Past-exam MCQ | page ' || m.source_page::text || ' | question ' || m.source_question_number FROM public.gk_mcqs m WHERE m.source_page = 493 AND NOT EXISTS (SELECT 1 FROM public.search_documents d WHERE d.entity_type = 'mcq' AND d.entity_id = m.id);`;
  const audit = {
    batch_pages: BATCH_PAGES,
    pipeline_version: PIPELINE_VERSION,
    source_pages: pages.map(page => ({ page: page.source_page, sha256: page.source_image_sha256, review: page.review.review_status })),
    generated_fact_candidates: facts.length,
    generated_notes: notes.length,
    generated_mcqs: mcqs.length,
    generated_options: mcqs.length * 4,
    verification_statuses: Object.groupBy(checks, row => row.status),
    source_anomalies: notes.flatMap(row => row.anomalies.map(anomaly => ({ source_page: row.source_page, anomaly }))),
    quality_gates: [
      "Five physical PDF pages only; do not extend this batch without explicit user instruction.",
      "Reviewed OCR artifacts and all ordered dense-page visual tiles are retained.",
      "Facts, image captions, tables, notes, MCQs, options, answer key, and exam metadata remain distinct.",
      "Visible source anomalies, including Annual Development Programmer and BJMA, are retained verbatim with metadata and tags.",
      "All generated inserts are idempotent by source page, canonical hash, or source key.",
    ],
  };
  const sql = `-- Generated by scripts/prepare_validated_batch_0489_0493.mjs\n-- Source pages: 489–493 only. Do not extend this batch without explicit user instruction.\nBEGIN;\nINSERT INTO public.import_runs (source_filename, source_sha256, pipeline_version, status, completed_at, audit) VALUES ('Jubayer''sgk.pdf', ${q(sha(pages.map(page => page.source_image_sha256).join("|")))}, ${q(PIPELINE_VERSION)}, 'completed', now(), ${json(audit)});\n${chapterSql}\n${topicSql}\n${pagesSql}\n${factsSql}\n${notesSql}\n${mcqSql}\n${tagSql}\n${verificationSql}\n${derivedSql}\nCOMMIT;`;
  return { sql, audit };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const { sql, audit } = await buildBatch();
  await fs.mkdir(outputDir, { recursive: true });
  await fs.writeFile(path.join(outputDir, "validated_import.sql"), sql, "utf8");
  await fs.writeFile(path.join(outputDir, "batch_audit.json"), JSON.stringify(audit, null, 2), "utf8");
  await fs.writeFile(path.join(outputDir, "execute_sql_request.json"), JSON.stringify({ project_id: "rennotctgrxvbpghbimx", query: sql }), "utf8");
  console.log(JSON.stringify({ outputDir, ...audit }, null, 2));
}
