import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const workDir = "/home/ubuntu/dontonyo-work/batch-0494-0498";
const outputDir = path.join(root, "supabase", "batch-0494-0498");
const sourcePages = [494, 495, 496, 497, 498];
const pageFiles = sourcePages.map(page => path.join(workDir, "pages", `page_${String(page).padStart(4, "0")}.json`));

export const BATCH_PAGES = [494, 495, 496, 497, 498];
export const BOOK_TITLE = "Jubayer's GK";
export const PIPELINE_VERSION = "vision-quality-gated-batch-0494-0498-v1";

const refs = {
  soviet: ["https://history.state.gov/milestones/1989-1992/collapse-soviet-union"],
  palau: ["https://history.state.gov/countries/palau"],
  timor: ["https://timor-leste.gov.tl/?p=29&lang=en", "https://peacekeeping.un.org/sites/default/files/past/unmiset/background.html"],
};
const sha = value => crypto.createHash("sha256").update(value, "utf8").digest("hex");
const q = value => `'${String(value ?? "").replaceAll("'", "''")}'`;
const json = value => `${q(JSON.stringify(value))}::jsonb`;
const values = rows => rows.map(row => `(${row.map(q).join(", ")})`).join(",\n");
const confidence = value => value === "low" || value === "high" ? value : "medium";

const tags = [
  ["world-countries-colonies", "World countries and colonial history", "domain", "Source-derived former-colony and political-history reference material."],
  ["former-colonies", "Former colonies", "content_type", "Historical former-colony list or statement preserved from the scanned source."],
  ["historical-reference", "Historical reference", "content_type", "Historical country or territory reference material."],
  ["table", "Table or structured reference", "content_type", "Source table or structured reference list."],
  ["image-caption", "Image caption", "content_type", "Source image caption retained as context, not transformed into a fact."],
  ["past-exam-mcq", "Past-exam MCQ", "content_type", "MCQ with printed exam metadata and answer key."],
  ["answer-key", "Answer key", "content_type", "Correct answer from the printed source answer key."],
  ["source-attributed", "Source-attributed", "quality", "Source-preserved content not fully independently verified."],
  ["externally-verified", "Externally verified", "quality", "Claim corroborated by a direct external reference in the batch ledger."],
  ["source-typo-preserved", "Source typo preserved", "quality", "Visible source anomaly retained rather than silently corrected."],
  ["dhaka-university", "University of Dhaka", "exam_source", "University of Dhaka examination label as printed."],
  ["bcs", "BCS", "exam_source", "Bangladesh Civil Service examination label as printed."],
  ["medical-admission", "Medical admission", "exam_source", "Medical admission examination label as printed."],
  ["other-recruitment", "Other university and recruitment exam", "exam_source", "Other university or recruitment examination label as printed."],
];

function pageContext(page) {
  const base = { chapter: "world-countries-colonies", chapterTitle: "বিশ্বের স্বাধীন দেশ এবং সাবেক উপনিবেশ" };
  if (page === 494) return { ...base, topic: "british-former-colonies", topicTitle: "যুক্তরাজ্যের সাবেক উপনিবেশভুক্ত দেশ" };
  if (page === 495) return { ...base, topic: "french-and-soviet-reference", topicTitle: "ফ্রান্সের সাবেক উপনিবেশভুক্ত দেশ ও সাবেক সোভিয়েত ইউনিয়ন" };
  if (page === 496) return { ...base, topic: "dutch-spanish-portuguese-colonies", topicTitle: "নেদারল্যান্ডস, স্পেন ও পর্তুগালের সাবেক উপনিবেশভুক্ত দেশ" };
  if (page === 497) return { ...base, topic: "miscellaneous-colonial-reference", topicTitle: "উপনিবেশ সংক্রান্ত বিচিত্র তথ্য" };
  return { ...base, topic: "colonial-history-past-exam-mcqs", topicTitle: "এই অধ্যায়ের সাথে জড়িত বিগত বছরের প্রশ্ন" };
}
function verification(sourcePage, text, kind = "fact", number = null) {
  if (sourcePage === 495 && text.includes("১৯৯১ সালে সাবেক সোভিয়েত ইউনিয়ন")) return { status: "verified", confidence: "high", sources: refs.soviet };
  if (sourcePage === 497 && text.includes("পালাউ স্বাধীনতা")) return { status: "verified", confidence: "high", sources: refs.palau };
  if (sourcePage === 497 && text.includes("তিমুর লিসতে") && text.includes("২০০২")) return { status: "verified", confidence: "high", sources: refs.timor };
  if (kind === "mcq" && sourcePage === 498 && number === "07") return { status: "verified", confidence: "high", sources: refs.timor };
  return { status: "source_attributed", confidence: "medium", sources: [] };
}
const fact = (source_page, title, fact_text, tag = "historical-reference", anomalies = []) => {
  const context = pageContext(source_page); const v = verification(source_page, fact_text);
  return { source_page, chapter_slug: context.chapter, topic_slug: context.topic, title, fact_text, tag, anomalies, ...v, canonical_hash: sha(`fact|${source_page}|${title}|${fact_text}`) };
};
const facts = [
  fact(495, "সাবেক সোভিয়েত ইউনিয়ন", "১৯৯১ সালে সাবেক সোভিয়েত ইউনিয়ন ভেঙে ১৫টি রাষ্ট্র গঠিত হয়-", "historical-reference"),
  fact(496, "নেদারল্যান্ডসের (ডাচ) সাবেক উপনিবেশভুক্ত দেশ", "এশিয়ার একমাত্র দেশ হিসেবে নেদারল্যান্ডসের উপনিবেশভুক্ত ছিল ইন্দোনেশিয়া (পূর্বনাম- ডাচ ইস্ট ইন্ডিজ)।", "former-colonies"),
  fact(496, "নেদারল্যান্ডসের (ডাচ) সাবেক উপনিবেশভুক্ত দেশ", "দক্ষিণ আমেরিকার সুরিনাম উপনিবেশ ছিল নেদারল্যান্ডসের।", "former-colonies"),
  fact(496, "স্পেনের সাবেক উপনিবেশভুক্ত দেশ", "দক্ষিণ আমেরিকার ৯টি দেশ (ব্রাজিল, গায়ানা, সুরিনাম) ব্যতীত বাকিসব ছিল স্পেনের উপনিবেশ-", "former-colonies"),
  fact(496, "স্পেনের সাবেক উপনিবেশভুক্ত দেশ", "উত্তর আমেরিকার অধিকাংশ দেশই ছিল স্পেনের উপনিবেশ-", "former-colonies"),
  fact(496, "পর্তুগালের সাবেক উপনিবেশভুক্ত দেশ", "আফ্রিকা মহাদেশের পর্তুগিজ উপনিবেশভুক্ত দেশ- এঙ্গোলা, মোজাম্বিক, গিনি বিসাউ।", "former-colonies"),
  fact(496, "পর্তুগালের সাবেক উপনিবেশভুক্ত দেশ", "দক্ষিণ আমেরিকার একমাত্র পর্তুগিজ উপনিবেশভুক্ত দেশ- ব্রাজিল।", "former-colonies"),
  ...[
    "তিমুর লিসতে (পূর্ব তিমুর)- ইন্দোনেশিয়ার একটি প্রদেশ ছিল। পরবর্তীতে ২০০২ সালে ইন্দোনেশিয়ার কাছ থেকে স্বাধীনতা লাভ করে। তবে ১৯৭৫ আগে তিমুর লিসতে পর্তুগালের উপনিবেশ ছিল।",
    "নেদারল্যান্ডস ছিল- বেলজিয়াম ও লুক্সেমবার্গের উপনিবেশ।",
    "ব্রিটিশদের কাছ থেকে স্বাধীনতাপ্রাপ্ত প্রথম দেশ- মার্কিন যুক্তরাষ্ট্র।",
    "ভূ-মধ্যসাগরীয় দ্বীপ কর্সিকা বর্তমানে- ফ্রান্সের অধীনে।",
    "জিব্রাল্টার বর্তমানে- ব্রিটেনের অধীনে।",
    "হংকং ছিল- ব্রিটেনের উপনিবেশ।",
    "ব্রিটেন থেকে মুক্ত হওয়া সর্বশেষ দেশ- হংকং।",
    "ম্যাকাও ছিল- পর্তুগালের উপনিবেশ।",
    "নরওয়ে ছিল- সুইডেনের উপনিবেশ।",
    "ফিনল্যান্ড ছিল- সুইডেনের উপনিবেশ।",
    "ফিনল্যান্ড স্বাধীনতা লাভ করে রাশিয়া থেকে কিন্তু উপনিবেশ ছিল সুইডেনের।",
    "এশিয়ার একমাত্র যে দেশটি এক সময় স্প্যানিশ সাম্রাজ্যের অন্তর্ভুক্ত ছিল কিন্তু স্বাধীনতা লাভ করে যুক্তরাষ্ট্র থেকে- ফিলিপাইন।",
    "মধ্য আমেরিকার দেশ পানামা ছিল- কলম্বিয়ার উপনিবেশ।",
    "মঙ্গোলিয়া ছিল- চীনের উপনিবেশ।",
    "পশ্চিম সাহারা অঞ্চলটি উপনিবেশ ছিল- ফ্রান্সের।",
    "লিবিয়া ও সোমালিয়া উপনিবেশ ছিল- ইতালির।",
    "পাপুয়া নিউ গিনি স্বাধীনতা লাভ করে- অস্ট্রেলিয়ার কাছ থেকে।",
    "পালাউ স্বাধীনতা লাভ করে- জাতিসংঘের অছি পরিষদের কাছ থেকে (১৯৯৪)।",
    "রুয়ান্ডা, বুরুন্ডি, গণতান্ত্রিক কঙ্গো প্রজাতন্ত্র উপনিবেশ ছিল- বেলজিয়ামের।",
    "ঘানা ছিল- সুইডেনের উপনিবেশ।",
    "ফকল্যান্ড যে দেশের উপনিবেশ- ব্রিটেনের (১৮৩৩ থেকে)।",
    "হাওয়াই দ্বীপ ও আলাস্কা যে দেশের অংশ- যুক্তরাষ্ট্রের।",
    "পশ্চিম পাপুয়া ও পশ্চিম তিমুর যে দেশের অংশ- ইন্দোনেশিয়ার।",
    "দ্বিতীয় বিশ্বযুদ্ধকালীন কোরিয়া, চীন, মিয়ানমার, তাইওয়ান দখলে ছিল- জাপানের।",
    "অটোম্যান সাম্রাজ্যের অন্তর্ভুক্ত ছিল- গ্রিস, তুরস্ক, আলবেনিয়া, রোমানিয়া, বুলগেরিয়া।",
    "রোমান সাম্রাজ্য মতে- ইতালি ও সুইজারল্যান্ড।",
    "কখনো উপনিবেশ ছিল না- থাইল্যান্ড (কিন্তু আরো কিছু দেশ পাওয়া যায় যেগুলো কখনোই আনুষ্ঠানিকভাবে উপনিবেশ ছিল না। রাষ্ট্রগুলো হলো- নেপাল, ভুটান, জাপান, সৌদি আরব, ইরান, চীন, আফগানিস্তান, ইথিওপিয়া, টোঙ্গা, লাইবেরিয়া)।",
  ].map(text => fact(497, "উপনিবেশ সংক্রান্ত বিচিত্র তথ্য", text, "historical-reference", text.includes("১৯৭৫ আগে") ? ["Visible source wording is '১৯৭৫ আগে'; retained verbatim with anomaly metadata."] : [])),
];
const note = (source_page, title, content, tag = "table", anomalies = []) => {
  const context = pageContext(source_page); const v = verification(source_page, content, "note");
  return { source_page, chapter_slug: context.chapter, topic_slug: context.topic, title, content, tag, anomalies, ...v, canonical_hash: sha(`note|${source_page}|${title}|${content}`) };
};
const notes = [
  note(494, "যুক্তরাজ্যের সাবেক উপনিবেশভুক্ত দেশ", "দক্ষিণ এশিয়া | ভারত, বাংলাদেশ, শ্রীলংকা, পাকিস্তান, আফগানিস্তান, মালদ্বীপ\nদক্ষিণ-পূর্ব এশিয়া | মালয়েশিয়া, ব্রুনাই, সিঙ্গাপুর, মিয়ানমার\nমধ্যপ্রাচ্য | লেবানন ও সিরিয়া ব্যতীত বাকিসব; সৌদি আরব, ইরাক, জর্ডান, মিশর, ইয়েমেন, কুয়েত, সাইপ্রাস, ইসরায়েল, ওমান, কাতার, তুরস্ক, ফিলিস্তিন, স. আরব আমিরাত, বাহরাইন\nআফ্রিকা | গাম্বিয়া, দক্ষিণ আফ্রিকা, নাইজেরিয়া, সিয়েরা লিওন, জাম্বিয়া, উগান্ডা, বতসোয়ানা, সুদান, জিম্বাবুয়ে, কেনিয়া, ঘানা\nদক্ষিণ আমেরিকা | গায়ানা\nউত্তর আমেরিকা | যুক্তরাষ্ট্র, জামাইকা, এন্টিগুয়া ও বারমুডা, কানাডা, বার্বাডোস, গ্রানাডা\nইউরোপ | মাল্টা, আয়ারল্যান্ড\nওশেনিয়া | অস্ট্রেলিয়া, নিউজিল্যান্ড", "table"),
  note(495, "ফ্রান্সের সাবেক উপনিবেশভুক্ত দেশ", "ইন্দো-চীন | ভিয়েতনাম, কম্বোডিয়া, লাওস\nমধ্যপ্রাচ্য | সিরিয়া, লেবানন\nআফ্রিকা | আলজেরিয়া, আইভরিকোস্ট, নাইজার, মরক্কো, ক্যামেরুন, সেনেগাল, তিউনিশিয়া, মাদাগাস্কার, জিবুতি\nউত্তর আমেরিকা | হাইতি", "table"),
  note(495, "সাবেক সোভিয়েত ইউনিয়নের ১৫টি রাষ্ট্র", "১. রাশিয়া\n২. এস্তোনিয়া\n৩. লাটভিয়া\n৪. লিথুয়ানিয়া\n৫. বেলারুশ\n৬. ইউক্রেন\n৭. মলদোভা\n৮. জর্জিয়া\n৯. আর্মেনিয়া\n১০. আজারবাইজান\n১১. কাজাখস্তান\n১২. তুর্কমেনিস্তান\n১৩. উজবেকিস্তান\n১৪. কিরগিজিস্তান\n১৫. তাজিকিস্তান", "table"),
  note(496, "স্পেনের সাবেক উপনিবেশভুক্ত দেশ", "দক্ষিণ আমেরিকার ৯টি দেশ | ভেনেজুয়েলা, কলম্বিয়া, ইকুয়েডর, পেরু, বলিভিয়া, প্যারাগুয়ে, চিলি, আর্জেন্টিনা, উরুগুয়ে\nনোট | [স্প্যানিশ উপনিবেশের অন্তর্ভুক্ত হওয়ায় এ দেশগুলোর ভাষাও স্প্যানিশ]\nউত্তর আমেরিকা | মেক্সিকো, হন্ডুরাস, নিকারাগুয়া, কিউবা, গুয়েতেমালা, ডোমিনিকান প্রজাতন্ত্র, কোস্টারিকা, এল সালভেডর", "table"),
];
const mcq = (number, question, options, correct, source) => { const v = verification(498, `${question} ${options.join(" ")}`, "mcq", number); return { source_page: 498, number, question, options, correct, source, ...v, canonical_hash: sha(`mcq|498|${number}|${question}`) }; };
const mcqs = [
  mcq("01", "সেনেগাল উপনিবেশ ছিল-", ["ফ্রান্সের", "নেদারল্যান্ডসের", "ইংল্যান্ডের", "রাশিয়ার"], "ক", "DU খ' ১০-১১"),
  mcq("02", "ইন্দোনেশিয়া কার উপনিবেশ ছিল?", ["বৃটেন", "ফ্রান্স", "পর্তুগাল", "নেদারল্যান্ডস"], "ঘ", "DU ঘ' ০৯-১০, খ' ০২-০৩"),
  mcq("03", "মিশর যে দেশের উপনিবেশ ছিল-", ["জার্মানি", "নেদারল্যান্ডস", "পর্তুগাল", "বৃটেন"], "ঘ", "DU খ' ০৬-০৭"),
  mcq("04", "মালয়েশিয়া কোন দেশের উপনিবেশ ছিল-", ["ইংল্যান্ড", "স্পেন", "পর্তুগাল", "আর্জেন্টিনা"], "ক", "DU খ' ০৩-০৪"),
  mcq("05", "দক্ষিণ এশিয়ার কোন দেশটি এক সময় স্পেনীয় সাম্রাজ্যের অন্তর্ভুক্ত ছিল?", ["ভিয়েতনাম", "মালয়েশিয়া", "ফিলিপাইন", "সিঙ্গাপুর"], "গ", "DU ঘ' ৯৬-৯৭"),
  mcq("06", "ম্যাকাও উপনিবেশ ছিল-", ["বৃটেনের", "পর্তুগালের", "ফ্রান্সের", "জাপানের"], "খ", "DU ঘ' ১১-১২"),
  mcq("07", "তিমুর লিসতে কোন দেশ থেকে আলাদা হয়েছে?", ["ইন্দোনেশিয়া", "অস্ট্রেলিয়া", "চীন", "থাইল্যান্ড"], "ক", "DU ঘ' ০৯-১০"),
  mcq("08", "১৯৭৪ সালের আগে তিমুর লিসতে কোন দেশের উপনিবেশ ছিল?", ["বৃটেন", "ফ্রান্স", "স্পেন", "পর্তুগাল"], "ঘ", "DU খ' ০০-০১"),
  mcq("09", "ফকল্যান্ড কোন দেশের উপনিবেশ?", ["স্পেন", "আর্জেন্টিনা", "পর্তুগাল", "ইংল্যান্ড"], "ঘ", "DU খ' ০১-০২"),
  mcq("10", "চন্দননগর (পশ্চিমবঙ্গ) একসময় এর উপনিবেশ ছিল?", ["হল্যান্ড", "ফ্রান্স", "ইংল্যান্ড", "পর্তুগাল"], "খ", "DU খ' ০০-০১"),
  mcq("11", "ইরিত্রিয়া কোন দেশের অংশ ছিল?", ["মরক্কো", "ঘানা", "মিশর", "ইথিওপিয়া"], "ঘ", "জবি-ঘ, ০৬-০৭/DU খ' ০৫-০৬"),
  mcq("12", "ফিনল্যান্ড কোন দেশের উপনিবেশ ছিল?", ["রাশিয়া", "ডেনমার্ক", "সুইডেন", "ইংল্যান্ড"], "গ", "41 BCS"),
  mcq("13", "কোনটি বিংশ শতাব্দীর শেষভাগে উপনিবেশবাদের নিগড় থেকে মুক্ত হয়?", ["হংকং", "শ্রীলঙ্কা", "ম্যাকাও", "বাংলাদেশ"], "গ", "27 BCS"),
  mcq("14", "কোন দেশটি কখনও অন্য কোন দেশের উপনিবেশে পরিণত হয়নি?", ["থাইল্যান্ড", "মায়ানমার", "ইন্দোনেশিয়া", "মালয়েশিয়া"], "ক", "20 BCS/ MC ০৫-০৬"),
  mcq("15", "স্বাধীনতার আগে পাপুয়া নিউগিনি কোন দেশের অধীনে ছিল?", ["বৃটেন", "ফ্রান্স", "অস্ট্রেলিয়া", "নিউজিল্যান্ড"], "গ", "17 BCS/ MC ০৪-০৫"),
  mcq("16", "পশ্চিম তিমুর এর বর্তমান মর্যাদা কী?", ["ইন্দোনেশিয়ার একটি অঙ্গরাজ্য", "একটি স্বাধীন দেশ", "অস্ট্রেলিয়ার একটি প্রদেশ", "কোনটি সঠিক নয়"], "ক", "26 BCS"),
];
function examInfo(source) { if (source.includes("DU")) return ["University of Dhaka", "University of Dhaka", "admission", "dhaka-university"]; if (source.includes("BCS")) return ["Bangladesh Civil Service", null, "competitive", "bcs"]; if (source.includes("MC")) return ["Medical Admission", null, "admission", "medical-admission"]; return ["Other university and recruitment examination", null, "competitive", "other-recruitment"]; }
const qualityTag = status => status === "verified" ? "externally-verified" : "source-attributed";
const recordLookup = (type, hash) => type === "fact" ? `(SELECT id FROM public.gk_facts WHERE canonical_hash = ${q(hash)} LIMIT 1)` : type === "note" ? `(SELECT id FROM public.gk_notes WHERE canonical_hash = ${q(hash)} LIMIT 1)` : `(SELECT id FROM public.gk_mcqs WHERE canonical_hash = ${q(hash)} LIMIT 1)`;
function pageMetadata(page) {
  const printed = { 494: 494, 495: 495, 496: 496, 497: 880, 498: 499 }[page.source_page];
  return { source_image_sha256: page.source_image_sha256, extraction_model: page.model, review_status: page.review.review_status, corrections: page.review.corrections, unresolved_spans: page.review.unresolved_spans, accepted_content_tags: page.review.accepted_content_tags, physical_source_page: page.source_page, printed_book_page: printed, nested_artifact_page_number: page.transcription.source_page, page_number_mismatch: printed !== page.source_page ? "Physical PDF page and visually reviewed printed footer are retained separately; no page number was silently normalised." : null, visual_review_report: "/home/ubuntu/dontonyo/reports/batch-0494-0498_visual_review.md", external_verification_report: "/home/ubuntu/dontonyo/reports/batch-0494-0498_external_verification.md" };
}
export async function buildBatch() {
  const pages = await Promise.all(pageFiles.map(async file => JSON.parse(await fs.readFile(file, "utf8"))));
  const checks = [...facts.map(row => ({ type: "fact", hash: row.canonical_hash, source_page: row.source_page, claim: row.fact_text, normalized: row.fact_text, ...verification(row.source_page, row.fact_text) })), ...notes.map(row => ({ type: "note", hash: row.canonical_hash, source_page: row.source_page, claim: row.content, normalized: row.content, ...verification(row.source_page, row.content, "note") })), ...mcqs.map(row => ({ type: "mcq", hash: row.canonical_hash, source_page: row.source_page, claim: `${row.question} — printed answer: ${row.correct}`, normalized: null, ...verification(row.source_page, `${row.question} ${row.options.join(" ")}`, "mcq", row.number) }))];
  const chapterSql = `INSERT INTO public.chapters (book_id, chapter_number, title, slug, description, source_page, display_order) SELECT b.id, 47, 'বিশ্বের স্বাধীন দেশ এবং সাবেক উপনিবেশ', 'world-countries-colonies', 'Source-derived former-colony and historical-reference material with explicit verification states.', 494, 47 FROM public.books b WHERE b.title = ${q(BOOK_TITLE)} AND NOT EXISTS (SELECT 1 FROM public.chapters c WHERE c.book_id = b.id AND c.slug = 'world-countries-colonies');`;
  const topicSql = `INSERT INTO public.topics (chapter_id, title, slug, description, source_page, display_order) SELECT c.id, x.title, x.slug, x.description, x.source_page, x.display_order FROM (VALUES ('যুক্তরাজ্যের সাবেক উপনিবেশভুক্ত দেশ', 'british-former-colonies', 'Source-preserved regional reference list.', 494, 1), ('ফ্রান্সের সাবেক উপনিবেশভুক্ত দেশ ও সাবেক সোভিয়েত ইউনিয়ন', 'french-and-soviet-reference', 'Source lists and Soviet-dissolution reference material.', 495, 2), ('নেদারল্যান্ডস, স্পেন ও পর্তুগালের সাবেক উপনিবেশভুক্ত দেশ', 'dutch-spanish-portuguese-colonies', 'Source former-colony reference material.', 496, 3), ('উপনিবেশ সংক্রান্ত বিচিত্র তথ্য', 'miscellaneous-colonial-reference', 'Source-preserved miscellaneous historical-reference claims.', 497, 4), ('উপনিবেশ সম্পর্কিত বিগত বছরের প্রশ্ন', 'colonial-history-past-exam-mcqs', 'Past-exam MCQs with options, answer key, and exam labels.', 498, 5)) AS x(title, slug, description, source_page, display_order) JOIN public.chapters c ON c.slug = 'world-countries-colonies' AND c.book_id = (SELECT id FROM public.books WHERE title = ${q(BOOK_TITLE)} LIMIT 1) WHERE NOT EXISTS (SELECT 1 FROM public.topics t WHERE t.chapter_id = c.id AND t.slug = x.slug);`;
  const pagesSql = pages.map(page => { const c = pageContext(page.source_page); const kind = page.source_page === 498 ? "mcq" : "educational"; return `INSERT INTO public.source_pages (import_run_id, book_id, source_page, page_kind, raw_transcription, chapter_heading, topic_heading, confidence, extraction_method, model_name, notes, review_metadata) SELECT (SELECT id FROM public.import_runs WHERE pipeline_version = ${q(PIPELINE_VERSION)} ORDER BY started_at DESC LIMIT 1), b.id, ${page.source_page}, ${q(kind)}::page_kind, ${q(page.review.verified_transcript)}, ${q(c.chapterTitle)}, ${q(c.topicTitle)}, ${q(confidence(page.review.overall_confidence))}::confidence_level, 'vision_ocr_with_image_grounded_review', ${q(page.model)}, 'Quality-gated source extraction with ordered tile review, semantic separation, verification ledger, and source-anomaly preservation.', ${json(pageMetadata(page))} FROM public.books b WHERE b.title = ${q(BOOK_TITLE)} AND NOT EXISTS (SELECT 1 FROM public.source_pages s WHERE s.book_id = b.id AND s.source_page = ${page.source_page});`; }).join("\n");
  const factsSql = `WITH data(source_page, chapter_slug, topic_slug, title, fact_text, confidence, canonical_hash, status) AS (VALUES\n${values(facts.map(row => [row.source_page, row.chapter_slug, row.topic_slug, row.title, row.fact_text, row.confidence, row.canonical_hash, row.status]))}) INSERT INTO public.gk_facts (book_id, chapter_id, topic_id, title, fact_text, explanation, source_page, source_section, source_excerpt, importance, confidence, canonical_hash) SELECT b.id, c.id, t.id, d.title, d.fact_text, CASE d.status WHEN 'verified' THEN 'Directly corroborated by a source in the batch verification ledger; original wording is retained.' ELSE 'Source-attributed material retained with explicit verification status and source linkage.' END, d.source_page::integer, d.title, d.fact_text, 3, d.confidence::confidence_level, d.canonical_hash FROM data d JOIN public.books b ON b.title = ${q(BOOK_TITLE)} JOIN public.chapters c ON c.book_id = b.id AND c.slug = d.chapter_slug JOIN public.topics t ON t.chapter_id = c.id AND t.slug = d.topic_slug ON CONFLICT (canonical_hash) DO UPDATE SET fact_text = EXCLUDED.fact_text, explanation = EXCLUDED.explanation, confidence = EXCLUDED.confidence;`;
  const notesSql = `WITH data(source_page, chapter_slug, topic_slug, title, content, confidence, canonical_hash) AS (VALUES\n${values(notes.map(row => [row.source_page, row.chapter_slug, row.topic_slug, row.title, row.content, row.confidence, row.canonical_hash]))}) INSERT INTO public.gk_notes (book_id, chapter_id, topic_id, title, content, source_page, source_section, display_order, confidence, canonical_hash) SELECT b.id, c.id, t.id, d.title, d.content, d.source_page::integer, d.title, d.source_page::integer, d.confidence::confidence_level, d.canonical_hash FROM data d JOIN public.books b ON b.title = ${q(BOOK_TITLE)} JOIN public.chapters c ON c.book_id = b.id AND c.slug = d.chapter_slug JOIN public.topics t ON t.chapter_id = c.id AND t.slug = d.topic_slug ON CONFLICT (canonical_hash) DO UPDATE SET content = EXCLUDED.content, confidence = EXCLUDED.confidence;`;
  const mcqSql = mcqs.map(row => { const [name, institution, exam_type, normalized] = examInfo(row.source); const c = pageContext(row.source_page); const keys = ["ক", "খ", "গ", "ঘ"]; const options = row.options.map((option, index) => `INSERT INTO public.gk_mcq_options (mcq_id, option_key, option_text, display_order, is_correct) SELECT m.id, ${q(keys[index])}, ${q(option)}, ${index + 1}, ${keys[index] === row.correct} FROM public.gk_mcqs m WHERE m.canonical_hash = ${q(row.canonical_hash)} AND NOT EXISTS (SELECT 1 FROM public.gk_mcq_options o WHERE o.mcq_id = m.id AND o.option_key = ${q(keys[index])});`).join("\n"); return `INSERT INTO public.exam_sources (name, institution, exam_type, description, normalized_name) SELECT ${q(name)}, ${q(institution)}, ${q(exam_type)}, ${q(`Normalized from printed source label on page ${row.source_page}.`)}, ${q(normalized)} WHERE NOT EXISTS (SELECT 1 FROM public.exam_sources WHERE normalized_name = ${q(normalized)}); INSERT INTO public.gk_mcqs (book_id, chapter_id, topic_id, question, correct_option, explanation, source_page, source_section, source_question_number, difficulty, confidence, canonical_hash) SELECT b.id, c.id, t.id, ${q(row.question)}, ${q(row.correct)}, ${q(row.status === "verified" ? "Printed answer retained; matching historical context is corroborated in the batch verification ledger." : "Printed answer key retained as source-attributed material pending deeper verification.")}, ${row.source_page}, 'এই অধ্যায়ের সাথে জড়িত বিগত বছরের প্রশ্ন', ${q(row.number)}, 3, ${q(row.confidence)}::confidence_level, ${q(row.canonical_hash)} FROM public.books b JOIN public.chapters c ON c.book_id = b.id AND c.slug = ${q(c.chapter)} JOIN public.topics t ON t.chapter_id = c.id AND t.slug = ${q(c.topic)} WHERE b.title = ${q(BOOK_TITLE)} ON CONFLICT (canonical_hash) DO UPDATE SET correct_option = EXCLUDED.correct_option, explanation = EXCLUDED.explanation, confidence = EXCLUDED.confidence; ${options} INSERT INTO public.gk_mcq_sources (mcq_id, exam_source_id, year, session, source_text, source_page) SELECT m.id, (SELECT id FROM public.exam_sources WHERE normalized_name = ${q(normalized)} LIMIT 1), NULL, ${q(row.source)}, ${q(row.source)}, ${row.source_page} FROM public.gk_mcqs m WHERE m.canonical_hash = ${q(row.canonical_hash)} AND NOT EXISTS (SELECT 1 FROM public.gk_mcq_sources s WHERE s.mcq_id = m.id AND s.source_text = ${q(row.source)} AND s.source_page = ${row.source_page});`; }).join("\n");
  const tagSql = `INSERT INTO public.content_tags (slug, label, category, description) VALUES\n${tags.map(tag => `(${tag.map(q).join(", ")})`).join(",\n")} ON CONFLICT (slug) DO UPDATE SET label = EXCLUDED.label, category = EXCLUDED.category, description = EXCLUDED.description;\n${facts.map(row => [row.tag, qualityTag(row.status), ...(row.anomalies.length ? ["source-typo-preserved"] : [])].map(tag => `INSERT INTO public.content_tag_assignments (tag_id, entity_type, entity_id, source_page, confidence, assigned_by) SELECT t.id, 'fact', f.id, ${row.source_page}, ${q(row.confidence)}::confidence_level, 'batch-0494-0498-quality-pipeline' FROM public.content_tags t JOIN public.gk_facts f ON f.canonical_hash = ${q(row.canonical_hash)} WHERE t.slug = ${q(tag)} ON CONFLICT DO NOTHING;`).join("\n")).join("\n")}\n${notes.map(row => [row.tag, qualityTag(row.status)].map(tag => `INSERT INTO public.content_tag_assignments (tag_id, entity_type, entity_id, source_page, confidence, assigned_by) SELECT t.id, 'note', n.id, ${row.source_page}, ${q(row.confidence)}::confidence_level, 'batch-0494-0498-quality-pipeline' FROM public.content_tags t JOIN public.gk_notes n ON n.canonical_hash = ${q(row.canonical_hash)} WHERE t.slug = ${q(tag)} ON CONFLICT DO NOTHING;`).join("\n")).join("\n")}\n${mcqs.map(row => ["past-exam-mcq", "answer-key", examInfo(row.source)[3], qualityTag(row.status)].map(tag => `INSERT INTO public.content_tag_assignments (tag_id, entity_type, entity_id, source_page, confidence, assigned_by) SELECT t.id, 'mcq', m.id, ${row.source_page}, ${q(row.confidence)}::confidence_level, 'batch-0494-0498-quality-pipeline' FROM public.content_tags t JOIN public.gk_mcqs m ON m.canonical_hash = ${q(row.canonical_hash)} WHERE t.slug = ${q(tag)} ON CONFLICT DO NOTHING;`).join("\n")).join("\n")}`;
  const verificationSql = checks.map(row => { const id = recordLookup(row.type, row.hash); return `INSERT INTO public.fact_verifications (source_page, entity_type, entity_id, claim_text, normalized_claim, verification_status, confidence, verification_sources, audit_note) SELECT ${row.source_page}, ${q(row.type)}, ${id}, ${q(row.claim)}, ${row.normalized ? q(row.normalized) : "NULL"}, ${q(row.status)}, ${q(row.confidence)}::confidence_level, ${json(row.sources)}, ${q(row.status === "verified" ? "Direct external corroboration is listed in the batch verification ledger." : "Source-attributed record retained with explicit source linkage; no silent factual update.")} WHERE NOT EXISTS (SELECT 1 FROM public.fact_verifications v WHERE v.entity_type = ${q(row.type)} AND v.entity_id = ${id} AND v.claim_text = ${q(row.claim)});`; }).join("\n");
  const derivedSql = `INSERT INTO public.flashcards (subject_id, book_id, chapter_id, topic_id, front_text, back_text, source_type, source_id, source_key) SELECT (SELECT id FROM public.subjects ORDER BY created_at ASC LIMIT 1), f.book_id, f.chapter_id, f.topic_id, f.title, f.fact_text, 'fact', f.id, 'batch0494-0498:fact:' || f.id::text FROM public.gk_facts f WHERE f.source_page BETWEEN 494 AND 497 AND NOT EXISTS (SELECT 1 FROM public.flashcards c WHERE c.source_key = 'batch0494-0498:fact:' || f.id::text); INSERT INTO public.flashcards (subject_id, book_id, chapter_id, topic_id, front_text, back_text, source_type, source_id, source_key) SELECT (SELECT id FROM public.subjects ORDER BY created_at ASC LIMIT 1), n.book_id, n.chapter_id, n.topic_id, n.title, n.content, 'note', n.id, 'batch0494-0498:note:' || n.id::text FROM public.gk_notes n WHERE n.source_page BETWEEN 494 AND 497 AND NOT EXISTS (SELECT 1 FROM public.flashcards c WHERE c.source_key = 'batch0494-0498:note:' || n.id::text); INSERT INTO public.flashcards (subject_id, book_id, chapter_id, topic_id, front_text, back_text, source_type, source_id, source_key) SELECT (SELECT id FROM public.subjects ORDER BY created_at ASC LIMIT 1), m.book_id, m.chapter_id, m.topic_id, m.question, 'সঠিক উত্তর: ' || o.option_key || '. ' || o.option_text, 'mcq', m.id, 'batch0494-0498:mcq:' || m.id::text FROM public.gk_mcqs m JOIN public.gk_mcq_options o ON o.mcq_id = m.id AND o.is_correct WHERE m.source_page = 498 AND NOT EXISTS (SELECT 1 FROM public.flashcards c WHERE c.source_key = 'batch0494-0498:mcq:' || m.id::text); INSERT INTO public.search_documents (entity_type, entity_id, title, body, english_metadata) SELECT 'fact', f.id, f.title, f.fact_text, 'Source-linked GK fact | page ' || f.source_page::text FROM public.gk_facts f WHERE f.source_page BETWEEN 494 AND 497 AND NOT EXISTS (SELECT 1 FROM public.search_documents d WHERE d.entity_type = 'fact' AND d.entity_id = f.id); INSERT INTO public.search_documents (entity_type, entity_id, title, body, english_metadata) SELECT 'note', n.id, n.title, n.content, 'Source-linked GK note | page ' || n.source_page::text FROM public.gk_notes n WHERE n.source_page BETWEEN 494 AND 497 AND NOT EXISTS (SELECT 1 FROM public.search_documents d WHERE d.entity_type = 'note' AND d.entity_id = n.id); INSERT INTO public.search_documents (entity_type, entity_id, title, body, english_metadata) SELECT 'mcq', m.id, NULL, m.question, 'Past-exam MCQ | page ' || m.source_page::text || ' | question ' || m.source_question_number FROM public.gk_mcqs m WHERE m.source_page = 498 AND NOT EXISTS (SELECT 1 FROM public.search_documents d WHERE d.entity_type = 'mcq' AND d.entity_id = m.id);`;
  const audit = { batch_pages: BATCH_PAGES, pipeline_version: PIPELINE_VERSION, source_pages: pages.map(page => ({ page: page.source_page, sha256: page.source_image_sha256, review: page.review.review_status })), generated_fact_candidates: facts.length, generated_notes: notes.length, generated_mcqs: mcqs.length, generated_options: mcqs.length * 4, verification_statuses: Object.groupBy(checks, row => row.status), source_anomalies: facts.flatMap(row => row.anomalies.map(anomaly => ({ source_page: row.source_page, anomaly }))), quality_gates: ["Five physical PDF pages only; do not extend this batch without explicit user instruction.", "Reviewed OCR artifacts and all ordered dense-page visual tiles are retained.", "Facts, structured lists, image captions, MCQs, options, answer key, and exam metadata remain distinct.", "Visible source typos, joined option spacing, and printed-footer anomalies are retained in metadata rather than silently changed.", "All generated inserts are idempotent by source page, canonical hash, or source key."] };
  const sql = `-- Generated by scripts/prepare_validated_batch_0494_0498.mjs\n-- Source pages: 494–498 only. Do not extend this batch without explicit user instruction.\nBEGIN;\nINSERT INTO public.import_runs (source_filename, source_sha256, pipeline_version, status, completed_at, audit) VALUES ('Jubayer''sgk.pdf', ${q(sha(pages.map(page => page.source_image_sha256).join("|")))}, ${q(PIPELINE_VERSION)}, 'completed', now(), ${json(audit)});\n${chapterSql}\n${topicSql}\n${pagesSql}\n${factsSql}\n${notesSql}\n${mcqSql}\n${tagSql}\n${verificationSql}\n${derivedSql}\nCOMMIT;`;
  return { sql, audit };
}
if (process.argv[1] === fileURLToPath(import.meta.url)) { const { sql, audit } = await buildBatch(); await fs.mkdir(outputDir, { recursive: true }); await fs.writeFile(path.join(outputDir, "validated_import.sql"), sql, "utf8"); await fs.writeFile(path.join(outputDir, "batch_audit.json"), JSON.stringify(audit, null, 2), "utf8"); await fs.writeFile(path.join(outputDir, "execute_sql_request.json"), JSON.stringify({ project_id: "rennotctgrxvbpghbimx", query: sql }), "utf8"); console.log(JSON.stringify({ outputDir, ...audit }, null, 2)); }
