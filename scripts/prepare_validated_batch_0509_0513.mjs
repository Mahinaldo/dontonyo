import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const workDir = "/home/ubuntu/dontonyo-work/batch-0509-0513";
const outputDir = path.join(root, "supabase", "batch-0509-0513");
export const BATCH_PAGES = [509, 510, 511, 512, 513];
export const PIPELINE_VERSION = "vision-quality-gated-batch-0509-0513-v1";
const BOOK_TITLE = "Jubayer's GK";
const pageFiles = BATCH_PAGES.map(page => path.join(workDir, "pages", `page_${String(page).padStart(4, "0")}.json`));
const q = value => `'${String(value ?? "").replaceAll("'", "''")}'`;
const json = value => `${q(JSON.stringify(value))}::jsonb`;
const sha = value => crypto.createHash("sha256").update(value, "utf8").digest("hex");
const values = rows => rows.map(row => `(${row.map(q).join(", ")})`).join(",\n");

const refs = {
  ethnologue: ["https://www.ethnologue.com/insights/most-spoken-language/"],
  sierraLeone: ["https://www.bssnews.net/fact-check/248438", "https://dubawa.org/bengali-bangla-has-never-been-used-as-sierra-leones-official-language/"],
  myanmar: ["https://commonslibrary.parliament.uk/myanmar-military-takeover-and-international-response/"],
};

const tags = [
  ["world-languages", "World languages", "domain", "Source-derived world-language reference material."],
  ["language-reference-table", "Language reference table", "content_type", "Structured source table of languages and countries of use."],
  ["legislatures", "World legislatures", "domain", "Source-derived legislature reference material."],
  ["unicameral-legislature", "Unicameral legislature", "content_type", "Structured source reference for single-chamber legislatures."],
  ["bicameral-legislature", "Bicameral legislature", "content_type", "Structured source reference for two-chamber legislatures."],
  ["past-exam-mcq", "Past-exam MCQ", "content_type", "MCQ with printed exam metadata and answer key."],
  ["answer-key", "Answer key", "content_type", "Correct answer from the printed source answer key."],
  ["source-attributed", "Source-attributed", "quality", "Source-preserved material without direct corroboration in this batch."],
  ["externally-verified", "Externally verified", "quality", "Claim directly corroborated by an external authority."],
  ["conflicting", "Conflicting external evidence", "quality", "Source claim conflicts with credible external evidence and is retained without silent correction."],
  ["time-sensitive", "Time-sensitive reference", "quality", "Political or institutional material that requires future review."],
  ["dhaka-university", "University of Dhaka", "exam_source", "University of Dhaka examination label as printed."],
  ["bcs", "BCS", "exam_source", "Bangladesh Civil Service examination label as printed."],
  ["other-recruitment", "Other recruitment examination", "exam_source", "Other university, bank, academy, or recruitment examination label as printed."],
];

const context = page => {
  if (page === 509) return { chapter: "asia-capitals-currencies", topic: "capitals-currencies-past-exam-mcqs", chapterTitle: "এশিয়া মহাদেশ", topicTitle: "এই অধ্যায়ের সাথে জড়িত বিগত বছরের প্রশ্ন" };
  if (page === 510) return { chapter: "world-languages-reference", topic: "languages-reference", chapterTitle: "বিভিন্ন দেশের ভাষা", topicTitle: "ভাষা ও ভাষার ব্যবহারকারী দেশ" };
  if (page === 511) return { chapter: "world-languages-reference", topic: "language-past-exam-mcqs", chapterTitle: "বিভিন্ন দেশের ভাষা", topicTitle: "এই অধ্যায়ের সাথে জড়িত বিগত বছরের প্রশ্ন" };
  if (page === 512) return { chapter: "world-legislatures", topic: "unicameral-legislature-reference", chapterTitle: "বিশ্বের বিভিন্ন দেশের আইনসভার নাম", topicTitle: "এক কক্ষবিশিষ্ট আইনসভা" };
  return { chapter: "world-legislatures", topic: "bicameral-legislature-reference", chapterTitle: "বিশ্বের বিভিন্ন দেশের আইনসভার নাম", topicTitle: "দ্বি-কক্ষ বিশিষ্ট আইনসভা" };
};

const note = (source_page, title, content, confidence = "medium") => ({
  source_page, title, content, ...context(source_page), status: "source_attributed", confidence,
  canonical_hash: sha(`note|${source_page}|${title}|${content}`), sources: [],
});

const notes = [
  note(510, "ভাষা ও ভাষার ব্যবহারকারী দেশ", "ভাষা | ভাষার ব্যবহারকারী দেশ\nবাংলা | বাংলাদেশ, ভারতের পশ্চিমবঙ্গ ও আসাম\nজার্মান | জার্মানি, অস্ট্রিয়া, সুইজারল্যান্ড, লিচটেনস্টেইন\nফার্সি | ইরান\nডারি এবং পশতু | আফগানিস্তান\nস্প্যানিশ | স্পেন, আর্জেন্টিনা, উরুগুয়ে, কলম্বিয়া, কিউবা, ভেনেজুয়েলা\nপর্তুগিজ | পর্তুগাল, ব্রাজিল\nসোয়াহিলি | কেনিয়া, তানজানিয়া\nমানদিনকা | গিনি, সেনেগাল, গাম্বিয়া\nডাচ | নেদারল্যান্ড, বেলজিয়াম, সুরিনাম\nখেমার | কম্বোডিয়া\nসিংহল | শ্রীলঙ্কা\nগ্রিক | গ্রিস, সাইপ্রাস\nচিওয়া | মালাউই\nদোজাংখা | ভুটান\nমৈথিলি | নেপাল\nবার্মিজ | মিয়ানমার\nদিভেহি | মালদ্বীপ\nবাহাসা | ইন্দোনেশিয়া\nহিব্রু | ইসরায়েল\nকিরুন্ডি | বুরুন্ডি\nআকান | ঘানা (কিন্তু ঘানার প্রধান ভাষা ইংরেজি)\nঅ্যামারিক | ইথিওপিয়া\nমজর (Magyar) | হাঙ্গেরি\nমান্দারিন/পুনেতগুয়া | চীন"),
  note(512, "এক কক্ষবিশিষ্ট আইনসভা", "দেশ | আইনসভার নাম\nচীন | ন্যাশনাল পিপলস্ কংগ্রেস\nউত্তর কোরিয়া | সুপ্রিম পিপলস্ এ্যাসেম্বলি\nদক্ষিণ কোরিয়া | ন্যাশনাল অ্যাসেম্বলি\nমঙ্গোলিয়া | স্টেট গ্রেট খুরাল\nশ্রীলংকা | পার্লামেন্ট\nমালদ্বীপ | পিপলস্ মজলিস\nব্রুনাই | লেজিসলেটিভ কাউন্সিল\nআর্মেনিয়া | ন্যাশনাল অ্যাসেম্বলি\nইসরাইল | নেসেট (Knesset)\nতুরস্ক | গ্র্যান্ড ন্যাশনাল অ্যাসেম্বলি\nআজারবাইজান | মিলি মজলিস\nআলবেনিয়া | কুভেনদি\nনেদারল্যান্ডস | স্টেটাস জেনারেল\nলিথুনিয়া ও লাটভিয়া | সীম (source-preserved combined entry)\nফিনল্যান্ড | এডুসকুন্ডা\nআইসল্যান্ড | অলথিং\nনরওয়ে | স্টরটিং\nডেনমার্ক | ফোকটিং\nসুইডেন | রিকসড্যাগ\nলিচেনস্টাইন | ডায়েট\nগ্রিস | হেলিনিক পার্লামেন্ট (Vouli ton Ellinon)\nমিশর | মজলিস ই নওয়াব (House of Representatives)\nইরান | মজলিস (Islamic Consultative Assembly)"),
  note(513, "দ্বি-কক্ষ বিশিষ্ট আইনসভা", "দেশ | আইনসভার নাম | উচ্চ কক্ষ | নিম্ন কক্ষ\nআফগানিস্তান | ন্যাশনাল অ্যাসেম্বলি (জিরগা) | হাউজ অব এলডারস (মেশরানো জিরগা) | হাউজ অব দ্য পিপল (ওলেসি জিরগা)\nভারত | পার্লামেন্ট | কাউন্সিল অব স্টেটস (রাজ্যসভা) | হাউজ অব দ্য পিপল (লোকসভা)\nপাকিস্তান | পার্লামেন্ট (মজলিস ই শূরা) | সিনেট | ন্যাশনাল অ্যাসেম্বলি\nনেপাল | ফেডারেল পার্লামেন্ট (সংসদ) | ন্যাশনাল অ্যাসেম্বলি (রাষ্ট্রীয় সভা) | হাউজ অব রিপ্রেজেনটেটিভস (প্রতিনিধি সভা)\nভুটান | পার্লামেন্ট (সোগডু) | ন্যাশনাল কাউন্সিল (Gyelyong Tshogde) | ন্যাশনাল অ্যাসেম্বলি (Gyelyong Tshogdu)\nমিয়ানমার | দ্য অ্যাসেম্বলি অব দ্য ইউনিয়ন (পিদাংসু) | হাউজ অব দ্য ন্যাশনালিটিস | হাউজ অব রিপ্রেজেনটেটিভস\nজাপান | ডায়েট | হাউজ অব কাউন্সিলরস | হাউজ অব রিপ্রেজেনটেটিভস\nযুক্তরাজ্য | পার্লামেন্ট | হাউজ অব লর্ডস | হাউজ অব কমন্স\nজার্মানি | — | ফেডারেল কাউন্সিল (বুন্ডেসর‍্যাট) | ফেডারেল ডায়েট (বুন্ডেসট্যাগ)\nইতালি | পার্লামেন্ট | সিনেট অব দ্য রিপাবলিক | চেম্বার অব ডেপুটিস\nরাশিয়া | ফেডারেল অ্যাসেম্বলি | ফেডারেশন কাউন্সিল | ডুমা/দুমা\nফ্রান্স | পার্লামেন্ট | সিনেট | ন্যাশনাল অ্যাসেম্বলি\nযুক্তরাষ্ট্র | কংগ্রেস | সিনেট | হাউজ অব রিপ্রেজেনটেটিভস\nকানাডা | পার্লামেন্ট | সিনেট | হাউজ অব কমন্স\nদ. আফ্রিকা | পার্লামেন্ট | ন্যাশনাল কাউন্সিল অব প্রভিন্স | ন্যাশনাল অ্যাসেম্বলি"),
];

const fact = (source_page, title, fact_text, status = "source_attributed", confidence = "medium", sources = []) => ({
  source_page, title, fact_text, ...context(source_page), status, confidence, sources,
  canonical_hash: sha(`fact|${source_page}|${title}|${fact_text}`),
});

const facts = [
  fact(510, "প্রাচীন ভাষা (source statement)", "পৃথিবীর সবচেয়ে প্রাচীন ভাষা- হিব্রু।", "source_attributed", "low"),
  fact(510, "সবচেয়ে বেশি মাতৃভাষী বক্তার ভাষা", "বিশ্বে সবচেয়ে বেশি মানুষ কথা বলে- চীনের মান্দারিন ভাষায়।", "verified", "high", refs.ethnologue),
  fact(510, "পৃথিবীর সর্বশ্রেষ্ঠ ভাষাবিদ (source statement)", "পৃথিবীর সর্বশ্রেষ্ঠ ভাষাবিদ- স্যার জন বোয়িং (ইংল্যান্ড)।", "source_attributed", "low"),
  fact(510, "বাংলাদেশের সর্বশ্রেষ্ঠ ভাষাবিদ (source statement)", "বাংলাদেশের সর্বশ্রেষ্ঠ ভাষাবিদ- ড. মুহাম্মদ শহীদুল্লাহ্।", "source_attributed", "medium"),
  fact(510, "জাতিবহুল দেশ (source statement)", "বিশ্বের 'জাতিবহুল দেশ' নামে খ্যাত- ভারত।", "source_attributed", "low"),
  fact(510, "সিয়েরা লিওনে বাংলা ভাষার স্বীকৃতি", "সিয়েরা লিওনে অন্যতম রাষ্ট্রভাষা হিসেবে স্বীকৃতি পায়- বাংলা ভাষা।", "conflicting", "low", refs.sierraLeone),
  fact(510, "এস্প্যারান্তোর উদ্ভাবক (source statement)", "এস্প্যারান্তো হলো কৃত্রিম ভাষা যার উদ্ভাবক- পোল্যান্ডের ভাষা বিজ্ঞানী লুডউইগ জামেহফ।", "source_attributed", "medium"),
  fact(510, "লিখন পদ্ধতি (source statement)", "সর্বপ্রথম লিখন পদ্ধতি আবিষ্কৃত হয়- মিশরে (হায়রোগ্লিফিক)।", "source_attributed", "low"),
  fact(510, "মানব শিশুর প্রথম ভাষা (source statement)", "মানব শিশুর প্রথম ভাষার নাম- বাবলিং।", "source_attributed", "medium"),
  fact(510, "ইথনোলগ", "পৃথিবীর ভাষা নিয়ে গবেষণা ও অনুসন্ধানকারী প্রতিষ্ঠান- ইথনোলগ।", "verified", "medium", refs.ethnologue),
  fact(510, "ভাষার শিক্ষা-প্রতিষ্ঠান (source statement)", "বিভিন্ন ভাষার আলাদা আলাদা শিক্ষা-প্রতিষ্ঠান রয়েছে- ভারতে।", "source_attributed", "medium"),
  fact(512, "বিশ্বের বৃহত্তম আইনসভা ভবন (source caption)", "বিশ্বের বৃহত্তম আইনসভা ভবন রোমানিয়ার 'প্যালেস অব দ্য পার্লামেন্ট'।", "source_attributed", "medium"),
  fact(512, "বিশ্বের প্রাচীনতম আইনসভা (source caption)", "বিশ্বের প্রাচীনতম আইনসভা আইসল্যান্ডের অলথিং।", "source_attributed", "medium"),
  fact(512, "পশ্চিমবঙ্গের আইনসভা", "ভারতের পশ্চিমবঙ্গের আইনসভার নাম বিধানসভা।", "source_attributed", "medium"),
  fact(512, "মিয়ানমারের সংসদে সামরিক বাহিনীর আসন", "মিয়ানমারের ২০০৮ সালের সংবিধান অনুযায়ী সংসদে ২৫ শতাংশ আসন অনির্বাচিত সামরিক বাহিনীর সদস্যদের জন্য সংরক্ষিত থাকে।", "verified", "high", refs.myanmar),
  fact(512, "লয়া জিরগা (source statement)", "'লয়া জিরগা' হলো আফগানিস্তানের বিভিন্ন সম্প্রদায়ের প্রবীণ নেতাদের সর্বোচ্চ পরিষদ।", "source_attributed", "medium"),
];

const mcq = (source_page, number, question, options, correct, source, confidence = "high") => ({
  source_page, number, question, options, correct, source, ...context(source_page), status: "source_attributed", confidence, sources: [],
  canonical_hash: sha(`mcq|${source_page}|${number}|${question}`),
});

const mcqs = [
  mcq(509, "31", "Doha is the capital of-", ["Bahrain", "Qatar", "Brunei", "Oman"], "খ", "Dhaka Bank MTO, 03"),
  mcq(509, "32", "উরুগুয়ের রাজধানীর নাম কী?", ["মন্টেভিডিও", "সান্টিয়াগো", "বোগোটা", "আসানসিওন"], "ক", "পাসপোর্ট ও ইমিগ্রেশন অধিদপ্তরের সহকারী পরিচালক-০৭"),
  mcq(509, "33", "উলানবাটোর কোন দেশের রাজধানী?", ["মঙ্গোলিয়া", "সোমালিয়া", "ঘানা", "কোনটিই নয়"], "ক", "প্রাথমিক ও গণশিক্ষা বিভাগে সহকারী পরিচালক, ০১"),
  mcq(509, "34", "লাওসের রাজধানীর নাম কী?", ["ভিয়েনতিয়েন", "হ্যানয়", "নমপেন", "হো চি মিন সিটি"], "ক", "জাহাবি-আন্তর্জাতিক সম্পর্ক বিভাগ, ০৯-১০"),
  mcq(509, "35", "‘পুত্রজায়া’ হলো-", ["মালির রাজধানী", "মালদ্বীপের রাজধানী", "পেলাউর রাজধানী", "মালয়েশিয়ার প্রশাসনিক রাজধানী"], "ঘ", "PSC এর সহকারি সচিব-০৫"),
  mcq(509, "36", "কোন দেশ ও তার রাজধানীর নাম একই?", ["লেবানন", "সিঙ্গাপুর", "ভুটান", "মালদ্বীপ"], "খ", "প্রাথমিক বিদ্যালয় প্রধান শিক্ষক, ৯৩"),
  mcq(509, "37", "কাজাখস্তান এর রাজধানীর নাম কী?", ["আস্তানা", "দুশানবে", "বিশবেক", "তাসখন্দ"], "ক", "Bangladesh Krishi Bank Assistant Officer, 07"),
  mcq(509, "38", "Which is the capital of Tajikistan?", ["Tashkant", "Doha", "Alma Ata", "None of these"], "ঘ", "Sonali, Janata, Agrani Bank Senior Officer, 08"),
  mcq(509, "39", "ফিজির রাজধানীর নাম কী?", ["ব্রাজাভিলে", "নিকোসিয়া", "সুভা", "সেন্ট জর্জেস"], "গ", "প্রা বি সহকারী শিক্ষক-০৮"),
  mcq(509, "40", "হেলসিংকি কোন দেশের রাজধানী?", ["সুইডেন", "নরওয়ে", "ফিনল্যান্ড", "পোল্যান্ড"], "গ", "সহকারী পল্লী উন্নয়ন কর্মকর্তা-১২"),
  mcq(509, "41", "দক্ষিণ সুদানের রাজধানীর নাম কী?", ["জুবা", "আবিজান", "উইন্ডহোক", "নৌয়াকচট"], "ক", "মেরিন একাডেমি ১৫-১৬"),
  mcq(509, "42", "‘পাউন্ড’ কোন দেশের মুদ্রা নয়?", ["লেবানন", "সিরিয়া", "মিসর", "লুক্সেমবার্গ"], "ঘ", "বাংলাদেশ ব্যাংক-০৮"),
  mcq(509, "43", "সিরিয়ার মুদ্রার নাম কী?", ["পাউন্ড", "রিয়াল", "দিনার", "ডলার"], "ক", "ঢাকা ব্যাংক-০৩"),
  mcq(509, "44", "থাইল্যান্ডের মুদ্রার নাম কী?", ["রুপি", "লিরা", "বাথ", "রিংগিত"], "গ", "অগ্রণী ব্যাংক-০৮"),
  mcq(509, "45", "ভুটানের মুদ্রার নামের সঠিক বানান কোনটি?", ["Gultrum", "Nguyultrum", "Ghumltrum", "Goltrum"], "খ", "ইবি, গ ১৩-১৪"),
  mcq(509, "46", "ইন্দোনেশিয়ার মুদ্রার নাম কী?", ["ডলার", "রুপি", "রিংগিট", "রুপাইয়া"], "ঘ", "বাংলাদেশ ব্যাংক সহকারী পরিচালক-০৬"),
  mcq(511, "01", "আক্ষরিক অর্থে আন্তর্জাতিক ভাষা-", ["আরবি", "ফরাসি", "এসপারেনটো", "ইংরেজি"], "গ", "DU খ' ০৭-০৮", "low"),
  mcq(511, "02", "অস্ট্রিয়ার ভাষা-", ["ইংরেজি", "ফরাসি", "স্পেনিশ", "জার্মান"], "ঘ", "DU খ' ০৫-০৬"),
  mcq(511, "03", "আকান কোন দেশের ভাষা?", ["বেনিন", "ঘানা", "গিনি বিসাউ", "সিয়েরা লিওন"], "খ", "DU খ' ১২-১৩"),
  mcq(511, "04", "মালদ্বীপের প্রধান ভাষা-", ["হিন্দি", "মালয়", "আরবি", "দিভেহী"], "ঘ", "DU ঘ' ১৩-১৪"),
  mcq(511, "05", "সেমীয় ভাষা কোনটি?", ["আরবি", "উর্দু", "ফরাসি", "ফারসি"], "ক", "DU খ' ১৩-১৪"),
  mcq(511, "06", "ক্যাটালন কোন দেশের ভাষা?", ["স্পেন", "বেলজিয়াম", "নাইজেরিয়া", "মঙ্গোলিয়া"], "ক", "14 BCS"),
  mcq(511, "07", "আফগানিস্তানের প্রধান ভাষা কোনটি?", ["আফগানি", "ফার্সি", "পশতুন", "তুর্কি"], "গ", "বাতিলকৃত 24 BCS", "low"),
  mcq(511, "08", "জার্মানি ব্যতিরেকে কোন দেশের প্রায় সকল নাগরিক জার্মান ভাষায় কথা বলে?", ["সুইজারল্যান্ড", "পোল্যান্ড", "অস্ট্রিয়া", "ডেনমার্ক"], "গ", "14 BCS", "medium"),
  mcq(511, "09", "কানাডার ফরাসিভাষী জনগোষ্ঠী কোন অঙ্গ রাজ্যে সর্বাধিক বাস করে?", ["আলবার্টা", "কুইবেক", "মেনিটোবা", "নোভাকোশিয়া"], "খ", "20 BCS"),
  mcq(511, "10", "বিশ্বের স্বীকৃত দ্বিতীয় ভাষা-", ["জার্মান", "আরবি", "ফ্রেঞ্চ", "স্প্যানিশ"], "ঘ", "আবহাওয়া অধিদপ্তরের সহকারী আবহাওয়াবিদ, ৯৫", "low"),
  mcq(511, "11", "What is the native language of Jamaica?", ["French", "English", "Swahili", "Esperanto"], "খ", "Source metadata not printed", "medium"),
  mcq(511, "12", "ভ্যাটিক্যান সিটির ভাষা কোনটি?", ["ল্যাটিন", "স্প্যানিশ", "ফারসি", "গ্রিক"], "ক", "রাবি-গ্রন্থাগার ও তথ্য বিজ্ঞান, ০৭-০৮", "medium"),
  mcq(511, "13", "বিশ্বের সর্বাধিক ভাষার দেশ কোনটি?", ["যুক্তরাষ্ট্র", "পাপুয়া নিউগিনি", "ভারত", "চীন"], "খ", "জবি ঘ' ১৩-১৪"),
  mcq(511, "14", "কিউবার প্রধান ভাষা-", ["ইংরেজি", "মান্দারিন", "ফারসি", "স্প্যানিশ"], "ঘ", "ইবি C' ১৫-১৬"),
  mcq(511, "15", "মরিশাসের ভাষা কী?", ["ডাচ", "ফ্রেঞ্চ", "ইংলিশ", "কোনটিই নয়"], "গ", "মেরিন একাডেমি ১৫-১৬", "medium"),
];

function examInfo(source) {
  if (source.includes("DU")) return ["University of Dhaka", "University of Dhaka", "admission", "dhaka-university"];
  if (source.includes("BCS")) return ["Bangladesh Civil Service", null, "competitive", "bcs"];
  return ["Other university and recruitment examination", null, "competitive", "other-recruitment"];
}

const qualityTag = status => status === "verified" ? "externally-verified" : status === "conflicting" ? "conflicting" : "source-attributed";
const recordLookup = (type, hash) => type === "fact" ? `(SELECT id FROM public.gk_facts WHERE canonical_hash = ${q(hash)} LIMIT 1)` : type === "note" ? `(SELECT id FROM public.gk_notes WHERE canonical_hash = ${q(hash)} LIMIT 1)` : `(SELECT id FROM public.gk_mcqs WHERE canonical_hash = ${q(hash)} LIMIT 1)`;
const pageMetadata = page => {
  const printed = { 509: 452, 510: 453, 511: 454, 512: 455, 513: 456 }[page.source_page];
  return {
    source_image_sha256: page.source_image_sha256,
    extraction_model: page.model,
    review_status: page.review.review_status,
    corrections: page.review.corrections,
    unresolved_spans: page.review.unresolved_spans,
    accepted_content_tags: page.review.accepted_content_tags,
    physical_source_page: page.source_page,
    printed_book_page: printed,
    artifact_reported_page: page.transcription.source_page,
    visual_review_report: "/home/ubuntu/dontonyo/reports/batch-0509-0513_visual_review.md",
    external_verification_report: "/home/ubuntu/dontonyo/reports/batch-0509-0513_external_verification.md",
    page_number_mismatch: printed !== page.source_page ? "Physical PDF page and printed source footer are separately preserved." : null,
  };
};

export async function buildBatch() {
  const pages = await Promise.all(pageFiles.map(async file => JSON.parse(await fs.readFile(file, "utf8"))));
  const chapters = [
    [55, "বিভিন্ন দেশের ভাষা", "world-languages-reference", "Source-preserved language reference material, tables, and past-exam questions.", 510],
    [56, "বিশ্বের বিভিন্ন দেশের আইনসভার নাম", "world-legislatures", "Source-preserved unicameral and bicameral legislature reference tables.", 512],
  ];
  const topics = [
    ["world-languages-reference", "ভাষা ও ভাষার ব্যবহারকারী দেশ", "languages-reference", 510, 1],
    ["world-languages-reference", "ভাষা সম্পর্কিত বিগত বছরের প্রশ্ন", "language-past-exam-mcqs", 511, 2],
    ["world-legislatures", "এক কক্ষবিশিষ্ট আইনসভা", "unicameral-legislature-reference", 512, 1],
    ["world-legislatures", "দ্বি-কক্ষ বিশিষ্ট আইনসভা", "bicameral-legislature-reference", 513, 2],
  ];
  const checks = [
    ...facts.map(row => ({ type: "fact", hash: row.canonical_hash, source_page: row.source_page, claim: row.fact_text, normalized: row.status === "verified" ? row.fact_text : null, status: row.status, confidence: row.confidence, sources: row.sources })),
    ...notes.map(row => ({ type: "note", hash: row.canonical_hash, source_page: row.source_page, claim: row.content, normalized: null, status: row.status, confidence: row.confidence, sources: row.sources })),
    ...mcqs.map(row => ({ type: "mcq", hash: row.canonical_hash, source_page: row.source_page, claim: `${row.question} — printed answer: ${row.correct}`, normalized: null, status: row.status, confidence: row.confidence, sources: row.sources })),
  ];
  const audit = {
    batch_pages: BATCH_PAGES,
    pipeline_version: PIPELINE_VERSION,
    source_pages: pages.map(page => ({ page: page.source_page, review_status: page.review.review_status, image_sha256: page.source_image_sha256 })),
    generated_facts: facts.length,
    generated_notes: notes.length,
    generated_mcqs: mcqs.length,
    generated_options: mcqs.length * 4,
    generated_flashcards: facts.length + notes.length + mcqs.length,
    verification_counts: {
      verified: checks.filter(row => row.status === "verified").length,
      conflicting: checks.filter(row => row.status === "conflicting").length,
      source_attributed: checks.filter(row => row.status === "source_attributed").length,
    },
    source_anomalies: [
      "Physical PDF pages 509–513 have printed book footers 452–456.",
      "Page 509 preserves the source spelling পেলাউর in the Palau option and Tashkant in the Tajikistan option.",
      "Page 510’s Sierra Leone Bengali-language claim is retained with conflicting external evidence.",
      "Page 511’s printed answer keys and exam labels are preserved; lower-confidence language questions are not silently normalized.",
      "Page 512 retains the combined Lithuania/Latvia table entry and time-sensitive Myanmar constitutional wording.",
      "Page 513 preserves the table as source-era institutional reference material, including Myanmar’s chamber names.",
    ],
    quality_gates: [
      "Exactly five physical source pages 509–513 are imported.",
      "All 25 dense-image tiles were reviewed in manifest order with overlap reconciliation.",
      "Facts, structured notes, MCQs, four options, printed answer keys, and exam metadata remain relationally distinct.",
      "All record upserts are deterministic by canonical hash, source page, or stable source key.",
    ],
  };

  const chapterSql = `INSERT INTO public.chapters (book_id, chapter_number, title, slug, description, source_page, display_order) SELECT b.id, x.n::integer, x.title, x.slug, x.description, x.source_page::integer, x.n::integer FROM (VALUES ${values(chapters)}) AS x(n, title, slug, description, source_page) JOIN public.books b ON b.title = ${q(BOOK_TITLE)} WHERE NOT EXISTS (SELECT 1 FROM public.chapters c WHERE c.book_id = b.id AND c.slug = x.slug);`;
  const topicsSql = `INSERT INTO public.topics (chapter_id, title, slug, description, source_page, display_order) SELECT c.id, x.title, x.slug, 'Source-preserved reference material with explicit verification status.', x.source_page::integer, x.display_order::integer FROM (VALUES ${values(topics)}) AS x(chapter_slug, title, slug, source_page, display_order) JOIN public.chapters c ON c.slug = x.chapter_slug AND c.book_id = (SELECT id FROM public.books WHERE title = ${q(BOOK_TITLE)} LIMIT 1) WHERE NOT EXISTS (SELECT 1 FROM public.topics t WHERE t.chapter_id = c.id AND t.slug = x.slug);`;
  const pagesSql = pages.map(page => {
    const c = context(page.source_page);
    const kind = page.source_page === 509 || page.source_page === 511 ? "mcq" : "educational";
    return `INSERT INTO public.source_pages (import_run_id, book_id, source_page, page_kind, raw_transcription, chapter_heading, topic_heading, confidence, extraction_method, model_name, notes, review_metadata) SELECT (SELECT id FROM public.import_runs WHERE pipeline_version = ${q(PIPELINE_VERSION)} ORDER BY started_at DESC LIMIT 1), b.id, ${page.source_page}, ${q(kind)}::page_kind, ${q(page.review.verified_transcript)}, ${q(c.chapterTitle)}, ${q(c.topicTitle)}, 'high'::confidence_level, 'vision_ocr_with_image_grounded_review', ${q(page.model)}, 'Quality-gated extraction with ordered tile review, source-preserved anomalies, and explicit external-verification status.', ${json(pageMetadata(page))} FROM public.books b WHERE b.title = ${q(BOOK_TITLE)} AND NOT EXISTS (SELECT 1 FROM public.source_pages s WHERE s.book_id = b.id AND s.source_page = ${page.source_page});`;
  }).join("\n");
  const factsSql = `WITH d(source_page, chapter_slug, topic_slug, title, fact_text, status, confidence, canonical_hash) AS (VALUES\n${values(facts.map(row => [row.source_page, row.chapter, row.topic, row.title, row.fact_text, row.status, row.confidence, row.canonical_hash]))}) INSERT INTO public.gk_facts (book_id, chapter_id, topic_id, title, fact_text, explanation, source_page, source_section, source_excerpt, importance, confidence, canonical_hash) SELECT b.id, c.id, t.id, d.title, d.fact_text, CASE d.status WHEN 'verified' THEN 'Direct external corroboration is recorded in the batch verification ledger.' WHEN 'conflicting' THEN 'Source wording is retained exactly; credible external evidence conflicts and is recorded in the batch verification ledger.' ELSE 'Source-attributed material is retained with image-grounded review and no silent factual update.' END, d.source_page::integer, d.title, d.fact_text, 3, d.confidence::confidence_level, d.canonical_hash FROM d JOIN public.books b ON b.title = ${q(BOOK_TITLE)} JOIN public.chapters c ON c.book_id = b.id AND c.slug = d.chapter_slug JOIN public.topics t ON t.chapter_id = c.id AND t.slug = d.topic_slug ON CONFLICT (canonical_hash) DO UPDATE SET fact_text = EXCLUDED.fact_text, explanation = EXCLUDED.explanation, confidence = EXCLUDED.confidence;`;
  const notesSql = `WITH d(source_page, chapter_slug, topic_slug, title, content, confidence, canonical_hash) AS (VALUES\n${values(notes.map(row => [row.source_page, row.chapter, row.topic, row.title, row.content, row.confidence, row.canonical_hash]))}) INSERT INTO public.gk_notes (book_id, chapter_id, topic_id, title, content, source_page, source_section, display_order, confidence, canonical_hash) SELECT b.id, c.id, t.id, d.title, d.content, d.source_page::integer, d.title, d.source_page::integer, d.confidence::confidence_level, d.canonical_hash FROM d JOIN public.books b ON b.title = ${q(BOOK_TITLE)} JOIN public.chapters c ON c.book_id = b.id AND c.slug = d.chapter_slug JOIN public.topics t ON t.chapter_id = c.id AND t.slug = d.topic_slug ON CONFLICT (canonical_hash) DO UPDATE SET content = EXCLUDED.content, confidence = EXCLUDED.confidence;`;
  const mcqSql = mcqs.map(row => {
    const [name, institution, examType, normalized] = examInfo(row.source);
    const keys = ["ক", "খ", "গ", "ঘ"];
    const optionSql = row.options.map((option, index) => `INSERT INTO public.gk_mcq_options (mcq_id, option_key, option_text, display_order, is_correct) SELECT m.id, ${q(keys[index])}, ${q(option)}, ${index + 1}, ${keys[index] === row.correct} FROM public.gk_mcqs m WHERE m.canonical_hash = ${q(row.canonical_hash)} AND NOT EXISTS (SELECT 1 FROM public.gk_mcq_options o WHERE o.mcq_id = m.id AND o.option_key = ${q(keys[index])});`).join("\n");
    return `INSERT INTO public.exam_sources (name, institution, exam_type, description, normalized_name) SELECT ${q(name)}, ${q(institution)}, ${q(examType)}, ${q(`Normalized from printed source label on page ${row.source_page}.`)}, ${q(normalized)} WHERE NOT EXISTS (SELECT 1 FROM public.exam_sources WHERE normalized_name = ${q(normalized)}); INSERT INTO public.gk_mcqs (book_id, chapter_id, topic_id, question, correct_option, explanation, source_page, source_section, source_question_number, difficulty, confidence, canonical_hash) SELECT b.id, c.id, t.id, ${q(row.question)}, ${q(row.correct)}, 'Printed answer key retained as source-attributed material; all options and the printed examination label were visually validated.', ${row.source_page}, 'এই অধ্যায়ের সাথে জড়িত বিগত বছরের প্রশ্ন', ${q(row.number)}, 3, ${q(row.confidence)}::confidence_level, ${q(row.canonical_hash)} FROM public.books b JOIN public.chapters c ON c.book_id = b.id AND c.slug = ${q(row.chapter)} JOIN public.topics t ON t.chapter_id = c.id AND t.slug = ${q(row.topic)} WHERE b.title = ${q(BOOK_TITLE)} ON CONFLICT (canonical_hash) DO UPDATE SET correct_option = EXCLUDED.correct_option, explanation = EXCLUDED.explanation, confidence = EXCLUDED.confidence; ${optionSql} INSERT INTO public.gk_mcq_sources (mcq_id, exam_source_id, year, session, source_text, source_page) SELECT m.id, (SELECT id FROM public.exam_sources WHERE normalized_name = ${q(normalized)} LIMIT 1), NULL, ${q(row.source)}, ${q(row.source)}, ${row.source_page} FROM public.gk_mcqs m WHERE m.canonical_hash = ${q(row.canonical_hash)} AND NOT EXISTS (SELECT 1 FROM public.gk_mcq_sources s WHERE s.mcq_id = m.id AND s.source_text = ${q(row.source)} AND s.source_page = ${row.source_page});`;
  }).join("\n");
  const tagSql = `INSERT INTO public.content_tags (slug, label, category, description) VALUES\n${tags.map(tag => `(${tag.map(q).join(", ")})`).join(",\n")} ON CONFLICT (slug) DO UPDATE SET label = EXCLUDED.label, category = EXCLUDED.category, description = EXCLUDED.description;\n${facts.map(row => [qualityTag(row.status), row.source_page === 512 ? "time-sensitive" : null].filter(Boolean).map(tag => `INSERT INTO public.content_tag_assignments (tag_id, entity_type, entity_id, source_page, confidence, assigned_by) SELECT t.id, 'fact', f.id, ${row.source_page}, ${q(row.confidence)}::confidence_level, 'batch-0509-0513-quality-pipeline' FROM public.content_tags t JOIN public.gk_facts f ON f.canonical_hash = ${q(row.canonical_hash)} WHERE t.slug = ${q(tag)} ON CONFLICT DO NOTHING;`).join("\n")).join("\n")}\n${notes.map(row => { const contentTag = row.source_page === 510 ? "language-reference-table" : row.source_page === 512 ? "unicameral-legislature" : "bicameral-legislature"; return [contentTag, "source-attributed", ...(row.source_page >= 512 ? ["legislatures", "time-sensitive"] : ["world-languages"])].map(tag => `INSERT INTO public.content_tag_assignments (tag_id, entity_type, entity_id, source_page, confidence, assigned_by) SELECT t.id, 'note', n.id, ${row.source_page}, ${q(row.confidence)}::confidence_level, 'batch-0509-0513-quality-pipeline' FROM public.content_tags t JOIN public.gk_notes n ON n.canonical_hash = ${q(row.canonical_hash)} WHERE t.slug = ${q(tag)} ON CONFLICT DO NOTHING;`).join("\n"); }).join("\n")}\n${mcqs.map(row => ["past-exam-mcq", "answer-key", examInfo(row.source)[3], "source-attributed"].map(tag => `INSERT INTO public.content_tag_assignments (tag_id, entity_type, entity_id, source_page, confidence, assigned_by) SELECT t.id, 'mcq', m.id, ${row.source_page}, ${q(row.confidence)}::confidence_level, 'batch-0509-0513-quality-pipeline' FROM public.content_tags t JOIN public.gk_mcqs m ON m.canonical_hash = ${q(row.canonical_hash)} WHERE t.slug = ${q(tag)} ON CONFLICT DO NOTHING;`).join("\n")).join("\n")}`;
  const verificationSql = checks.map(row => {
    const id = recordLookup(row.type, row.hash);
    const note = row.status === "verified" ? "Direct external corroboration is listed in the batch verification ledger." : row.status === "conflicting" ? "Source wording is retained with linked external counter-evidence; it is not silently corrected." : "Source-attributed record retained with image-grounded validation and explicit source linkage.";
    return `INSERT INTO public.fact_verifications (source_page, entity_type, entity_id, claim_text, normalized_claim, verification_status, confidence, verification_sources, audit_note) SELECT ${row.source_page}, ${q(row.type)}, ${id}, ${q(row.claim)}, ${row.normalized ? q(row.normalized) : "NULL"}, ${q(row.status)}, ${q(row.confidence)}::confidence_level, ${json(row.sources)}, ${q(note)} WHERE NOT EXISTS (SELECT 1 FROM public.fact_verifications v WHERE v.entity_type = ${q(row.type)} AND v.entity_id = ${id} AND v.claim_text = ${q(row.claim)});`;
  }).join("\n");
  const derivedSql = `INSERT INTO public.flashcards (subject_id, book_id, chapter_id, topic_id, front_text, back_text, source_type, source_id, source_key) SELECT (SELECT id FROM public.subjects ORDER BY created_at ASC LIMIT 1), f.book_id, f.chapter_id, f.topic_id, f.title, f.fact_text, 'fact', f.id, 'batch0509-0513:fact:' || f.id::text FROM public.gk_facts f WHERE f.source_page BETWEEN 509 AND 513 AND NOT EXISTS (SELECT 1 FROM public.flashcards c WHERE c.source_key = 'batch0509-0513:fact:' || f.id::text); INSERT INTO public.flashcards (subject_id, book_id, chapter_id, topic_id, front_text, back_text, source_type, source_id, source_key) SELECT (SELECT id FROM public.subjects ORDER BY created_at ASC LIMIT 1), n.book_id, n.chapter_id, n.topic_id, n.title, n.content, 'note', n.id, 'batch0509-0513:note:' || n.id::text FROM public.gk_notes n WHERE n.source_page BETWEEN 509 AND 513 AND NOT EXISTS (SELECT 1 FROM public.flashcards c WHERE c.source_key = 'batch0509-0513:note:' || n.id::text); INSERT INTO public.flashcards (subject_id, book_id, chapter_id, topic_id, front_text, back_text, source_type, source_id, source_key) SELECT (SELECT id FROM public.subjects ORDER BY created_at ASC LIMIT 1), m.book_id, m.chapter_id, m.topic_id, m.question, 'সঠিক উত্তর: ' || o.option_key || '. ' || o.option_text, 'mcq', m.id, 'batch0509-0513:mcq:' || m.id::text FROM public.gk_mcqs m JOIN public.gk_mcq_options o ON o.mcq_id = m.id AND o.is_correct WHERE m.source_page IN (509, 511) AND NOT EXISTS (SELECT 1 FROM public.flashcards c WHERE c.source_key = 'batch0509-0513:mcq:' || m.id::text); INSERT INTO public.search_documents (entity_type, entity_id, title, body, english_metadata) SELECT 'fact', f.id, f.title, f.fact_text, 'Status-marked GK fact | source page ' || f.source_page::text FROM public.gk_facts f WHERE f.source_page BETWEEN 509 AND 513 AND NOT EXISTS (SELECT 1 FROM public.search_documents d WHERE d.entity_type = 'fact' AND d.entity_id = f.id); INSERT INTO public.search_documents (entity_type, entity_id, title, body, english_metadata) SELECT 'note', n.id, n.title, n.content, 'Structured source reference | source page ' || n.source_page::text FROM public.gk_notes n WHERE n.source_page BETWEEN 509 AND 513 AND NOT EXISTS (SELECT 1 FROM public.search_documents d WHERE d.entity_type = 'note' AND d.entity_id = n.id); INSERT INTO public.search_documents (entity_type, entity_id, title, body, english_metadata) SELECT 'mcq', m.id, NULL, m.question, 'Past-exam MCQ | source page ' || m.source_page::text || ' | question ' || m.source_question_number FROM public.gk_mcqs m WHERE m.source_page IN (509, 511) AND NOT EXISTS (SELECT 1 FROM public.search_documents d WHERE d.entity_type = 'mcq' AND d.entity_id = m.id);`;
  const sql = `-- Generated by scripts/prepare_validated_batch_0509_0513.mjs\n-- Source pages: 509–513 only. The next batch begins at page 514.\nBEGIN;\nINSERT INTO public.import_runs (source_filename, source_sha256, pipeline_version, status, completed_at, audit) VALUES ('Jubayer''sgk.pdf', ${q(sha(pages.map(page => page.source_image_sha256).join("|")))}, ${q(PIPELINE_VERSION)}, 'completed', now(), ${json(audit)});\n${chapterSql}\n${topicsSql}\n${pagesSql}\n${factsSql}\n${notesSql}\n${mcqSql}\n${tagSql}\n${verificationSql}\n${derivedSql}\nCOMMIT;`;
  return { sql, audit };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const { sql, audit } = await buildBatch();
  await fs.mkdir(outputDir, { recursive: true });
  await fs.writeFile(path.join(outputDir, "validated_import.sql"), sql);
  await fs.writeFile(path.join(outputDir, "batch_audit.json"), JSON.stringify(audit, null, 2));
  await fs.writeFile(path.join(outputDir, "execute_sql_request.json"), JSON.stringify({ project_id: "rennotctgrxvbpghbimx", query: sql }));
  console.log(JSON.stringify({ outputDir, ...audit }, null, 2));
}
