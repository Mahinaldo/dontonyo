import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const workDir = "/home/ubuntu/dontonyo-work/batch-0479-0483";
const outputDir = path.join(root, "supabase", "batch-0479-0483");
const sourcePages = [479, 480, 481, 482, 483];
const pageFiles = sourcePages.map(page => path.join(workDir, "pages", `page_${String(page).padStart(4, "0")}.json`));

export const BATCH_PAGES = [479, 480, 481, 482, 483];
export const BOOK_TITLE = "Jubayer's GK";
export const PIPELINE_VERSION = "vision-quality-gated-batch-0479-0483-v1";

const refs = {
  un: ["https://nypm.mofa.gov.bd/pages/static-pages/695266a935ce18e1c05aaa47"],
  ticfa: ["https://ustr.gov/about-us/policy-offices/press-office/press-releases/2013/November/US-Bangladesh-TICFA-Signing"],
  ganges: ["https://lpr.adb.org/sites/default/files/resource/1610/ganges-water-sharing-treaty-1996.pdf"],
};

const sha = value => crypto.createHash("sha256").update(value, "utf8").digest("hex");
const q = value => `'${String(value ?? "").replaceAll("'", "''")}'`;
const json = value => `${q(JSON.stringify(value))}::jsonb`;
const values = rows => rows.map(row => `(${row.map(q).join(", ")})`).join(",\n");
const confidence = value => value === "low" || value === "high" ? value : "medium";

const tags = [
  ["bangladesh-international-relations", "Bangladesh international relations", "domain", "Bangladesh’s membership, representation, and participation in international organisations."],
  ["bangladesh-treaties", "Bangladesh treaties", "domain", "Bangladesh bilateral and multilateral treaty reference material."],
  ["international-organisations", "International organisations", "content_type", "International organisation, membership, representation, or treaty-context material."],
  ["treaty", "Treaty", "content_type", "Treaty, accord, agreement, or associated legal-reference material."],
  ["table", "Table or reference list", "content_type", "Source table or structured reference list."],
  ["definition", "Definition", "content_type", "Definition or expansion preserved from the scanned source."],
  ["past-exam-mcq", "Past-exam MCQ", "content_type", "MCQ with source-page exam metadata and printed answer key."],
  ["answer-key", "Answer key", "content_type", "Answer derived from the printed source answer key."],
  ["source-attributed", "Source-attributed", "quality", "Source-preserved content not fully independently verified."],
  ["externally-verified", "Externally verified", "quality", "Claim corroborated by a direct external reference in the batch ledger."],
  ["source-typo-preserved", "Source typo preserved", "quality", "Visible source typo retained and separately documented rather than silently corrected."],
  ["dhaka-university", "University of Dhaka", "exam_source", "University of Dhaka examination label as printed."],
  ["bcs", "BCS", "exam_source", "Bangladesh Civil Service examination label as printed."],
  ["medical-admission", "Medical admission", "exam_source", "Medical admission examination label as printed."],
  ["other-recruitment", "Other university and recruitment exam", "exam_source", "Other university or recruitment examination label as printed."],
];

function pageContext(page) {
  if ([479, 480, 481].includes(page)) return { chapter: "bangladesh-international-relations", topic: page === 479 ? "un-and-international-organisations" : "international-relations-past-exam-mcqs", chapterTitle: "আন্তর্জাতিক ক্ষেত্রে বাংলাদেশ", topicTitle: page === 479 ? "জাতিসংঘ ও আন্তর্জাতিক সংস্থা" : "এই অধ্যায়ের সাথে জড়িত বিগত বছরের প্রশ্ন" };
  return { chapter: "bangladesh-treaties", topic: page === 482 ? "bangladesh-treaties-reference" : "treaties-past-exam-mcqs", chapterTitle: "বাংলাদেশের চুক্তি", topicTitle: page === 482 ? "বাংলাদেশের গুরুত্বপূর্ণ চুক্তি" : "এই অধ্যায়ের সাথে জড়িত বিগত বছরের প্রশ্ন" };
}

function verification(page, text, kind = "fact") {
  if (page === 479 && (text.includes("১৭ সেপ্টেম্বর, ১৯৭৪") || text.includes("১৯৭৯-৮০ এবং ২০০০-০১") || text.includes("হুমায়ুন রশীদ চৌধুরী"))) return { status: "verified", confidence: "high", sources: refs.un };
  if (kind === "mcq" && page === 480 && (text.startsWith("কোন সালে বাংলাদেশ জাতিসংঘের সদস্যপদ লাভ করে?") || text.startsWith("জাতিসংঘ সাধারণ পরিষদের প্রথম বাংলাদেশি সভাপতি কে?") || text.startsWith("বাংলাদেশ নিম্নে উল্লেখিত কোন সময়ের জন্য জাতিসংঘ নিরাপত্তা পরিষদে অস্থায়ী সদস্য নির্বাচিত হয়েছিল?"))) return { status: "verified", confidence: "high", sources: refs.un };
  if (kind === "mcq" && page === 481 && (text.startsWith("বাংলাদেশ কতবার জাতিসংঘের নিরাপত্তা পরিষদের অস্থায়ী সদস্য নির্বাচিত হয়েছিল?") || text.startsWith("বাংলাদেশ জাতিসংঘের কততম সদস্য?") || text.startsWith("বাংলাদেশ কতবার নিরাপত্তা পরিষদের সদস্য পদ লাভ করে?") || text.startsWith("কোন তারিখে বাংলাদেশ জাতিসংঘ সদস্যপদ লাভ করে?"))) return { status: "verified", confidence: "high", sources: refs.un };
  if (page === 482 && text.includes("টিকফা")) return { status: "verified", confidence: "high", sources: refs.ticfa };
  if (page === 482 && text.includes("১২ ডিসেম্বর, ১৯৯৬") && text.includes("৩০ বছর")) return { status: "verified", confidence: "high", sources: refs.ganges };
  if (page === 483 && (text.includes("টিকফা") || text.includes("গঙ্গার পানি বন্টন"))) return { status: "verified", confidence: "high", sources: text.includes("টিকফা") ? refs.ticfa : refs.ganges };
  return { status: "source_attributed", confidence: kind === "mcq" ? "medium" : "medium", sources: [] };
}

const facts = [
  [479, "কমনওয়েলথে বাংলাদেশ", "সদস্য পদ লাভ করে- ১৮ এপ্রিল, ১৯৭২। সদস্য- ৩৪তম সদস্য। বাংলাদেশ কমনওয়েলথে যোগদানের প্রতিবাদে সদস্যপদ ত্যাগ করে পাকিস্তান।", "international-organisations"],
  [479, "জাতিসংঘে বাংলাদেশ", "সদস্য পদ লাভ করে- ১৭ সেপ্টেম্বর, ১৯৭৪। জাতিসংঘের সদস্য- ১৩৬তম। সদস্যপদ লাভ করে- ২৯তম অধিবেশনে।", "international-organisations"],
  [479, "জাতিসংঘে বাংলাদেশ", "স্থায়ী প্রতিনিধি- মোহাম্মদ আব্দুল মোহিত।", "international-organisations"],
  [479, "জাতিসংঘে বাংলাদেশ", "স্থায়ী পর্যবেক্ষকের আসন লাভ করে- ১৭ অক্টোবর, ১৯৭২। বঙ্গবন্ধু সাধারণ পরিষদে বাংলায় ভাষণ দেন- ২৫ সেপ্টেম্বর, ১৯৭৪ সালে (২৯ তম অধিবেশনে)।", "international-organisations"],
  [479, "জাতিসংঘে বাংলাদেশ", "বাংলাদেশ সাধারণ পরিষদে সভাপতিত্ব করে- ২ বার (১৯৮৬ ও ২০২৪ সালে)। ২০২৪ সালে সভাপতিত্ব করে- ড. খলিলুর রহমান (৭৯ তম অধিবেশনে)।", "international-organisations"],
  [479, "জাতিসংঘে বাংলাদেশ", "১৯৮৬ সালে সভাপতিত্ব করে- হুমায়ুন রশীদ চৌধুরী (৪১ তম অধিবেশনে)।", "international-organisations"],
  [479, "নিরাপত্তা পরিষদে বাংলাদেশ", "সদস্যপদ লাভ করে- ১৯৭৮ সালে।", "international-organisations"],
  [479, "নিরাপত্তা পরিষদে বাংলাদেশ", "অস্থায়ী সদস্য হিসেবে দায়িত্ব পালন করে- ১৯৭৯-৮০ এবং ২০০০-০১ সালে।", "international-organisations"],
  [479, "নিরাপত্তা পরিষদে বাংলাদেশ", "সভাপতিত্ব করে- ২ বার (মার্চ, ২০০০ এবং জুন, ২০০১ সালে)।", "international-organisations"],
  [479, "নিরাপত্তা পরিষদে বাংলাদেশ", "সভাপতিত্ব করেন- আনোয়ারুল করিম চৌধুরী (জাতিসংঘের স্থায়ী প্রতিনিধি ছিলেন)।", "international-organisations"],
  [479, "জাতিসংঘে বাংলাদেশ", "বাংলাদেশ জাতিসংঘের শান্তিরক্ষা বাহিনীতে কাজ করে আসছে- ১৯৮৮ সাল থেকে।", "international-organisations"],
  [479, "জাতিসংঘে বাংলাদেশ", "বাংলাদেশ যে শান্তি মিশনে প্রথম অংশগ্রহণ করে- UNIIMOG.", "international-organisations"],
  [479, "ঢাকায় আন্তর্জাতিক সংস্থার সদর দপ্তর", "আন্তর্জাতিক মাতৃভাষা ইনস্টিটিউট প্রতিষ্ঠিত হয় ২০০১ সালে।", "international-organisations"],
  [482, "ভারত-বাংলাদেশ মৈত্রী চুক্তি- ১৯৭২", "স্বাক্ষরিত হয়- ১৯ মার্চ, ১৯৭২ সালে।", "treaty"],
  [482, "ভারত-বাংলাদেশ মৈত্রী চুক্তি- ১৯৭২", "চুক্তির মেয়াদ- ২৫ বছর। চুক্তির মেয়াদ শেষ হয়- ১৯৯৭ সালে।", "treaty"],
  [482, "গঙ্গা পানি বণ্টন-১৯৯৬", "স্বাক্ষরিত হয়- ১২ ডিসেম্বর, ১৯৯৬ সালে। চুক্তির মেয়াদ- ৩০ বছর (শেষ হবে ২০২৬ সালে)।", "treaty"],
  [482, "গঙ্গা পানি বণ্টন-১৯৯৬", "পানি চুক্তি সম্পাদিত হয়- ৩টি ভাষায় (বাংলা, ইংরেজি, হিন্দি)।", "treaty"],
  [482, "গঙ্গা পানি বণ্টন-১৯৯৬", "পানি চুক্তি অনুযায়ী বাংলাদেশ পাবে- ৩৫ হাজার কিউসেক পানি।", "treaty"],
  [482, "গঙ্গা পানি বণ্টন-১৯৯৬", "পানি চুক্তি কার্যকর হয়- ১ জানুয়ারি, ১৯৯৭ সালে।", "treaty"],
  [482, "পার্বত্য চট্টগ্রাম চুক্তি-১৯৯৭", "ইংরেজি নাম- Chittagong Hill Tracts Peace Accord. স্বাক্ষরিত হয়- ২ ডিসেম্বর, ১৯৯৭।", "treaty"],
  [482, "পার্বত্য চট্টগ্রাম চুক্তি-১৯৯৭", "স্বাক্ষর করেন- বাংলাদেশ সরকার ও পার্বত্য চট্টগ্রাম জনসংহতি সমিতি (PCJSS)। পাহাড়ি জনগণের পক্ষে স্বাক্ষর করেন- সন্তু লারমা।", "treaty"],
  [482, "পার্বত্য চট্টগ্রাম চুক্তি-১৯৯৭", "পার্বত্য চট্টগ্রাম বিষয়ক মন্ত্রণালয় গঠন করা হয়- ২ ডিসেম্বর, ১৯৯৭।", "treaty"],
  [482, "কতিপয় গুরুত্বপূর্ণ চুক্তি", "বাংলাদেশ ও থাইল্যান্ডের মধ্যে আসামি প্রত্যর্পণ স্বাক্ষরিত হয়- ১৯৯৮ সালে।", "treaty"],
  [482, "কতিপয় গুরুত্বপূর্ণ চুক্তি", "বাংলাদেশ ও যুক্তরাষ্ট্রের মধ্যে টিকফা চুক্তি স্বাক্ষরিত হয়- ২৫ নভেম্বর, ২০১৩; এটি বাণিজ্য ও বিনিয়োগ সংক্রান্ত চুক্তি।", "treaty"],
  [482, "কতিপয় গুরুত্বপূর্ণ চুক্তি", "রোহিঙ্গা শরণার্থীদের প্রত্যাবর্তনের বিষয়ে বাংলাদেশ ও মায়ানমারের মধ্যে প্রথম চুক্তি সম্পাদিত হয়- ২৮ এপ্রিল, ১৯৯২ সালে।", "treaty"],
  [482, "কতিপয় গুরুত্বপূর্ণ চুক্তি", "বাংলাদেশ-ভারত বাণিজ্য চুক্তি স্বাক্ষরিত হয়- ৪ অক্টোবর, ১৯৭২।", "treaty"],
  [482, "কতিপয় গুরুত্বপূর্ণ চুক্তি", "বাংলাদেশ-যুক্তরাষ্ট্রের সাথে HANA চুক্তি স্বাক্ষর করে- ১৯৯৮ সালে।", "treaty"],
  [482, "কতিপয় গুরুত্বপূর্ণ চুক্তি", "HANA- Humanitarain Assistance Needs Assessment.", "definition"],
  [482, "কতিপয় গুরুত্বপূর্ণ চুক্তি", "বাংলাদেশ-মিয়ানমার স্থল সীমান্ত চুক্তি স্বাক্ষরিত হয়- ১৯৯৮ সালে।", "treaty"],
  [482, "কতিপয় গুরুত্বপূর্ণ চুক্তি", "Extradition Treaty হল- অপরাধী প্রত্যর্পণ চুক্তি।", "definition"],
].map(([source_page, title, fact_text, tag]) => {
  const context = pageContext(source_page); const v = verification(source_page, fact_text);
  return { source_page, chapter_slug: context.chapter, topic_slug: context.topic, title, fact_text, tag, ...v, canonical_hash: sha(`fact|${source_page}|${title}|${fact_text}`) };
});

const notes = [
  [479, "ঢাকায় আন্তর্জাতিক সংস্থার সদর দপ্তর", "সংস্থা | প্রতিষ্ঠা\nICDDRB | ১৯৬০\nSAIC | ১৯৮৯\nCIRDAP | ১৯৭৯\nIJSG | ২০০২\nSMRC | ১৯৯৫", "table"],
  [479, "কমনওয়েলথ ও IMF সদস্যপদ নোট", "নোট: বাংলাদেশ প্রথম আন্তর্জাতিক সংস্থা হিসেবে সদস্যপদ লাভ করে কমনওয়েলথের। কিন্তু জাতিসংঘভুক্ত প্রথম সংস্থা হিসেবে সদস্যপদ লাভ করে IMF-এর।", "table"],
  [480, "বাংলাদেশের বিভিন্ন আন্তর্জাতিক সংস্থার সদস্যপদ লাভ", "সংস্থা | সদস্যপদ লাভ\nIMF | ১০ মে, ১৯৭২\nILO | ১৯৭২\nUNESCO | ১৯৭২\nFAO | ১৯৭৩\nNAM | ১৯৭৩\nOIC | ১৯৭৪\nIBRD | ১৯৭২\nICC | ২০১০\nWTO | ১ জানুয়ারি, ১৯৯৫", "table"],
  [480, "WORLD TRADE ORGANIZATION", "বাংলাদেশ বিশ্ববাণিজ্য সংস্থার (WTO) সদস্যপদ লাভ করে ১ জানুয়ারি, ১৯৯৫।", "international-organisations"],
  [482, "গঙ্গা পানি বণ্টন-১৯৯৬", "১৯৯৬ সালে গঙ্গার পানি চুক্তি অনুযায়ী বাংলাদেশ পাবে ৩৫ হাজার কিউসেক পানি।", "table"],
].map(([source_page, title, content, tag]) => {
  const context = pageContext(source_page); const v = verification(source_page, content, "note");
  return { source_page, chapter_slug: context.chapter, topic_slug: context.topic, title, content, tag, ...v, canonical_hash: sha(`note|${source_page}|${title}|${content}`) };
});

const mcq = (source_page, number, question, options, correct, source) => {
  const v = verification(source_page, `${question} ${options.join(" ")}`, "mcq");
  return { source_page, number, question, options, correct, source, ...v, canonical_hash: sha(`mcq|${source_page}|${number}|${question}`) };
};
const mcqs = [
  mcq(480, "01", "কোন সালে বাংলাদেশ জাতিসংঘের সদস্যপদ লাভ করে?", ["১৯৭২ সালে", "১৯৭৩ সালে", "১৯৭৪ সালে", "১৯৭৬ সালে"], "গ", "DU ঘ ০২-০৩, ০২-০৩, ১৮-১৯, ৯৫-৯৬"),
  mcq(480, "02", "জাতিসংঘ সাধারণ পরিষদের প্রথম বাংলাদেশি সভাপতি কে?", ["বি.এস. সিদ্দিকী", "খাজা ওয়াসিউদ্দীন", "হুমায়ুন রশীদ চৌধুরী", "শমসের মুবিন চৌধুরী"], "গ", "27 BCS/DU খ ০৬-০৭"),
  mcq(480, "03", "জাতিসংঘে নিযুক্ত বাংলাদেশের স্থায়ী প্রতিনিধি কে?", ["দেবপ্রিয় ভট্টাচার্য", "মাসুদ বিন মোমেন", "হুমায়ুন কবীর", "মুহম্মদ জমির"], "খ", "DU ঘ ০৭-০৮"),
  mcq(480, "04", "বাংলাদেশ বিশ্ববাণিজ্য সংস্থার (WTO) সদস্যপদ লাভ করে?", ["১৯৯১ সালে", "১৯৯৪ সালে", "১৯৯২ সালে", "১৯৯৫ সালে"], "ঘ", "26 BCS; DU ঘ ০৮-০৯"),
  mcq(480, "05", "বাংলাদেশ প্রথম কোন আন্তর্জাতিক সংস্থার সদস্যপদ লাভ করে?", ["ওআইসি", "এফএও", "কমনওয়েলথ", "ন্যাম"], "গ", "DU ঘ ০৭-০৮, ০৫-০৬"),
  mcq(480, "06", "বাংলাদেশ কোন সালে কমনওয়েলথ এর সদস্যপদ লাভ করে?", ["১৯৭২ সালে", "১৯৭৩ সালে", "১৯৭৪ সালে", "১৯৭৫ সালে"], "ক", "20 BCS; DU খ ০৩-০৪"),
  mcq(480, "07", "বাংলাদেশ নিম্নে উল্লেখিত কোন সময়ের জন্য জাতিসংঘ নিরাপত্তা পরিষদে অস্থায়ী সদস্য নির্বাচিত হয়েছিল?", ["১৯৭৮-৭৯", "১৯৭৯-৮০", "১৯৮০-৮১", "১৯৮১-৮২"], "খ", "15 BCS; DU খ ৯৮-৯৯"),
  mcq(481, "08", "জাতিসংঘের মহাসচিব কফি আনান বাংলাদেশ সফর করেন-", ["২০০০ সালে", "২০০১ সালে", "২০০২ সালে", "২০০৩ সালে"], "খ", "DU খ' ০৫-০৬"),
  mcq(481, "09", "বাংলাদেশ কতবার জাতিসংঘের নিরাপত্তা পরিষদের অস্থায়ী সদস্য নির্বাচিত হয়েছিল?", ["৩ বার", "১ বার", "৪ বার", "২ বার"], "ঘ", "DU খ' ০১-০২"),
  mcq(481, "10", "বাংলাদেশ কোনটির সদস্য নয়?", ["আইএলও", "আইএমএফ", "ওআইসি", "ওপেক"], "ঘ", "DU ঘ' ০০-০১; খ' ৯৮-৯৯"),
  mcq(481, "11", "জাতিসংঘের কোন সংস্থায় বাংলাদেশ সর্বোচ্চ পদ পেয়েছে?", ["FAO", "জনসংখ্যা কাউন্সিল", "ইউনিডো", "এসকাপ"], "ঘ", "DU খ' ৯৬-৯৭"),
  mcq(481, "12", "বাংলাদেশ জাতিসংঘ শান্তিরক্ষা মিশনে কোন সাল থেকে কাজ শুরু করে?", ["১৯৭৮ সাল", "১৯৮০ সাল", "১৯৮২ সাল", "১৯৮৮ সাল"], "ঘ", "চবি 'E' 15-16/DU ঘ' ১৩-১৪"),
  mcq(481, "13", "বাংলাদেশ OIC-র সদস্য হয় কোন সনে?", ["১৯৭৩ সনে", "১৯৭৪ সনে", "১৯৭৫ সনে", "১৯৭৬ সনে"], "খ", "43, 27, 26, 22 BCS"),
  mcq(481, "14", "বাংলাদেশ জাতিসংঘের কততম সদস্য?", ["১৩৬ তম", "১৩৭ তম", "১৩৮ তম", "১৩৯ তম"], "ক", "27 BCS"),
  mcq(481, "15", "জাতির জনক বঙ্গবন্ধু জাতিসংঘের কোথায় বাংলা ভাষায় ভাষণ প্রদান করেন?", ["স্বস্তি পরিষদ", "সাধারণ পরিষদের অধিবেশন", "ইকোসোক", "ইউনেস্কোতে"], "খ", "22 BCS"),
  mcq(481, "16", "নিম্নলিখিত কোন আঞ্চলিক/আন্তর্জাতিক সদর দফতর ঢাকায় অবস্থিত?", ["SAARC", "APEC", "ADB", "CIRDAP"], "ঘ", "20, 15 BCS"),
  mcq(481, "17", "বাংলাদেশ কতবার নিরাপত্তা পরিষদের সদস্য পদ লাভ করে?", ["২ বার", "৩ বার", "১ বার", "৪ বার"], "ক", "22 BCS/জবি-খ, ০৮-০৯"),
  mcq(481, "18", "জাতিসংঘের নিম্নের কোন মহাসচিব বাংলাদেশ সফর করেন নাই?", ["কুর্ট ওয়াল্ড হেইম", "বান কি মুন", "উথান্ট", "কফি আনান"], "গ", "MC 12-13"),
  mcq(481, "19", "কোন তারিখে বাংলাদেশ জাতিসংঘ সদস্যপদ লাভ করে?", ["১৬ ডিসেম্বর, ১৯৭৫", "১৭ সেপ্টেম্বর, ১৯৭৪", "১৪ নভেম্বর, ১৯৭৩", "৩১ ডিসেম্বর, ১৯৭২"], "খ", "খাদ্য অধিদপ্তরের খাদ্য পরিদর্শক, ০৯"),
  mcq(481, "20", "বাংলাদেশ কমনওয়েলথের কততম সদস্য?", ["৩০ তম", "৩২ তম", "৩৪ তম", "৩৬ তম"], "গ", "উপজেলা ও থানা শিক্ষা অফিসার, ০৫"),
  mcq(483, "01", "পার্বত্য চট্টগ্রামে শান্তি চুক্তি কবে সম্পাদিত হয়?", ["১২ নভেম্বর, ১৯৯৭", "২ ডিসেম্বর, ১৯৯৭", "১৬ ডিসেম্বর, ১৯৯৭", "২৫ ডিসেম্বর, ১৯৯৭"], "খ", "DU ঘ' ১৭-১৮, ০৭-০৮; (38, 20, BCS)"),
  mcq(483, "02", "এখন পর্যন্ত ফারাক্কার উপর কয়টি চুক্তি স্বাক্ষরিত হয়েছে?", ["২ টি", "৩ টি", "৪ টি", "৫ টি"], "ঘ", "DU খ' ০০-০১; ঘ' ৯৭-৯৮"),
  mcq(483, "03", "১৯৭৬ সনে কোন রাজনৈতিক নেতা ফারাক্কা মিছিলে নেতৃত্ব দেন-", ["আব্দুল হামিদ খান ভাসানী", "মনি সিং", "মোজাফফর আহমেদ", "জিয়াউর রহমান"], "ক", "DU ঘ' ৯৭-৯৮"),
  mcq(483, "04", "ভারত-বাংলাদেশ মৈত্রী চুক্তি স্বাক্ষরিত হয় কত তারিখে?", ["১৯৭১ সালের ২৬ মার্চ", "১৯৭২ সালের ১৯ মার্চ", "১৯৭২ সালের ১০ জানুয়ারি", "১৯৭১ সালের ১৬ ডিসেম্বর"], "খ", "DU ঘ' ১৪-১৫"),
  mcq(483, "05", "ফারাক্কা বাঁধ বাংলাদেশের সীমান্ত থেকে কত দূরে অবস্থিত?", ["২৪.৭ কিলোমিটার", "২১.০ কিলোমিটার", "১৯.৩ কিলোমিটার", "১৬.৫ কিলোমিটার"], "ঘ", "13 BCS/DU খ' ০৬-০৭"),
  mcq(483, "06", "গঙ্গার পানি বন্টন চুক্তি স্বাক্ষরিত হয়েছে কবে?", ["১২ ডিসেম্বর, ১৯৯৫", "২৬ মার্চ, ১৯৯৬", "১২ ডিসেম্বর, ১৯৯৬", "২৬ মার্চ, ১৯৯৭"], "গ", "সহকারী থানা অফিসার, ০৯/ DU ঘ' ০৫-০৬"),
  mcq(483, "07", "Extradition Treaty হল -", ["উত্তর মেরু চুক্তি", "অপরাধী প্রত্যর্পণ চুক্তি", "পরিবেশ দূষণ সংক্রান্ত চুক্তি", "তেল গ্যাস আহরণ চুক্তি"], "খ", "DU খ' ০৮-০৯"),
  mcq(483, "08", "'টিকফা' চুক্তির দুইপক্ষ-", ["ভারত-বাংলাদেশ", "নেপাল-বাংলাদেশ", "বাংলাদেশ-যুক্তরাষ্ট্র", "বাংলাদেশ-যুক্তরাজ্য"], "গ", "DU খ' ১৪-১৫"),
  mcq(483, "09", "বাংলাদেশ সরকার এবং পিসিজেএসএস (PCJSS) এর মধ্যে পার্বত্য চট্টগ্রাম শান্তিচুক্তি কবে স্বাক্ষরিত হয়েছিল?", ["০৪ ডিসেম্বর, ১৯৯৫", "০৬ নভেম্বর, ১৯৯৮", "০২ ডিসেম্বর, ১৯৯৭", "০৭ ডিসেম্বর, ১৯৯৮"], "গ", "30 BCS"),
  mcq(483, "10", "বাংলাদেশ ও ভারতের মধ্যে সম্পাদিত গঙ্গার পানি বন্টন চুক্তি কখন শেষ হবে?", ["২০৪০", "২০২৬", "২০২৪", "২০৩০"], "খ", "44 BCS"),
  mcq(483, "11", "বাংলাদেশ কোন সনে CTBT অনুমোদন করে?", ["১৯৯৯", "২০০০", "২০০১", "২০০২"], "খ", "25 BCS"),
  mcq(483, "12", "ভারতের সঙ্গে বাংলাদেশের পানি চুক্তি কোথায় স্বাক্ষরিত হয়?", ["দার্জিলিং", "কলকাতা", "নয়াদিল্লি", "ঢাকা"], "গ", "21 BCS"),
];

function examInfo(source) {
  if (source.includes("DU")) return ["University of Dhaka", "University of Dhaka", "admission", "dhaka-university"];
  if (source.includes("BCS")) return ["Bangladesh Civil Service", null, "competitive", "bcs"];
  if (source.includes("MC")) return ["Medical Admission", null, "admission", "medical-admission"];
  return ["Other university and recruitment examination", null, "competitive", "other-recruitment"];
}
function qualityTag(status) { return status === "verified" ? "externally-verified" : "source-attributed"; }
function recordLookup(type, hash) { return type === "fact" ? `(SELECT id FROM public.gk_facts WHERE canonical_hash = ${q(hash)} LIMIT 1)` : type === "note" ? `(SELECT id FROM public.gk_notes WHERE canonical_hash = ${q(hash)} LIMIT 1)` : `(SELECT id FROM public.gk_mcqs WHERE canonical_hash = ${q(hash)} LIMIT 1)`; }

function pageMetadata(page) {
  const printed = { 479: 422, 480: 423, 481: 424, 482: 425, 483: 426 }[page.source_page];
  return { source_image_sha256: page.source_image_sha256, extraction_model: page.model, review_status: page.review.review_status, corrections: page.review.corrections, unresolved_spans: page.review.unresolved_spans, accepted_content_tags: page.review.accepted_content_tags, physical_source_page: page.source_page, printed_book_page: printed, nested_artifact_page_number: page.transcription.source_page, page_number_mismatch: page.transcription.source_page !== page.source_page ? "Nested OCR page metadata differs from physical source page; physical page and visual footer remain canonical." : null, visual_review_report: "/home/ubuntu/dontonyo/reports/batch-0479-0483_visual_review.md", external_verification_report: "/home/ubuntu/dontonyo/reports/batch-0479-0483_external_verification.md" };
}

export async function buildBatch() {
  const pages = await Promise.all(pageFiles.map(async file => JSON.parse(await fs.readFile(file, "utf8"))));
  const checks = [
    ...facts.map(row => ({ type: "fact", hash: row.canonical_hash, source_page: row.source_page, claim: row.fact_text, normalized: row.fact_text, ...verification(row.source_page, row.fact_text) })),
    ...notes.map(row => ({ type: "note", hash: row.canonical_hash, source_page: row.source_page, claim: row.content, normalized: row.content, ...verification(row.source_page, row.content, "note") })),
    ...mcqs.map(row => ({ type: "mcq", hash: row.canonical_hash, source_page: row.source_page, claim: `${row.question} — printed answer: ${row.correct}`, normalized: null, ...verification(row.source_page, `${row.question} ${row.options.join(" ")}`, "mcq") })),
  ];
  const chapterSql = `INSERT INTO public.chapters (book_id, chapter_number, title, slug, description, source_page, display_order) SELECT b.id, x.chapter_number, x.title, x.slug, x.description, x.source_page, x.display_order FROM (VALUES (42, 'আন্তর্জাতিক ক্ষেত্রে বাংলাদেশ', 'bangladesh-international-relations', 'Source-derived Bangladesh international-relations material with explicit verification states.', 479, 42), (43, 'বাংলাদেশের চুক্তি', 'bangladesh-treaties', 'Source-derived Bangladesh treaty and accord material with explicit verification states.', 482, 43)) AS x(chapter_number, title, slug, description, source_page, display_order) JOIN public.books b ON b.title = ${q(BOOK_TITLE)} WHERE NOT EXISTS (SELECT 1 FROM public.chapters c WHERE c.book_id = b.id AND c.slug = x.slug);`;
  const topicSql = `INSERT INTO public.topics (chapter_id, title, slug, description, source_page, display_order) SELECT c.id, x.title, x.slug, x.description, x.source_page, x.display_order FROM (VALUES ('bangladesh-international-relations', 'জাতিসংঘ ও আন্তর্জাতিক সংস্থা', 'un-and-international-organisations', 'Source-derived UN, Commonwealth, and organisation reference material.', 479, 1), ('bangladesh-international-relations', 'আন্তর্জাতিক সম্পর্কভিত্তিক বিগত বছরের প্রশ্ন', 'international-relations-past-exam-mcqs', 'Past-exam MCQs with all printed options, answer keys, and exam labels.', 480, 2), ('bangladesh-treaties', 'বাংলাদেশের গুরুত্বপূর্ণ চুক্তি', 'bangladesh-treaties-reference', 'Source-derived bilateral and multilateral treaty reference material.', 482, 1), ('bangladesh-treaties', 'চুক্তি সম্পর্কিত বিগত বছরের প্রশ্ন', 'treaties-past-exam-mcqs', 'Past-exam MCQs with all printed options, answer keys, and exam labels.', 483, 2)) AS x(chapter_slug, title, slug, description, source_page, display_order) JOIN public.chapters c ON c.slug = x.chapter_slug AND c.book_id = (SELECT id FROM public.books WHERE title = ${q(BOOK_TITLE)} LIMIT 1) WHERE NOT EXISTS (SELECT 1 FROM public.topics t WHERE t.chapter_id = c.id AND t.slug = x.slug);`;
  const pagesSql = pages.map(page => { const context = pageContext(page.source_page); const kind = [480, 483].includes(page.source_page) ? "mcq" : page.source_page === 479 ? "mixed" : "educational"; return `INSERT INTO public.source_pages (import_run_id, book_id, source_page, page_kind, raw_transcription, chapter_heading, topic_heading, confidence, extraction_method, model_name, notes, review_metadata) SELECT (SELECT id FROM public.import_runs WHERE pipeline_version = ${q(PIPELINE_VERSION)} ORDER BY started_at DESC LIMIT 1), b.id, ${page.source_page}, ${q(kind)}::page_kind, ${q(page.review.verified_transcript)}, ${q(context.chapterTitle)}, ${q(context.topicTitle)}, ${q(confidence(page.review.overall_confidence))}::confidence_level, 'vision_ocr_with_image_grounded_review', ${q(page.model)}, 'Quality-gated source extraction with visual review, semantic separation, and verification ledger.', ${json(pageMetadata(page))} FROM public.books b WHERE b.title = ${q(BOOK_TITLE)} AND NOT EXISTS (SELECT 1 FROM public.source_pages s WHERE s.book_id = b.id AND s.source_page = ${page.source_page});`; }).join("\n");
  const factsSql = `WITH data(source_page, chapter_slug, topic_slug, title, fact_text, confidence, canonical_hash, status) AS (VALUES\n${values(facts.map(row => [row.source_page, row.chapter_slug, row.topic_slug, row.title, row.fact_text, row.confidence, row.canonical_hash, row.status]))}) INSERT INTO public.gk_facts (book_id, chapter_id, topic_id, title, fact_text, explanation, source_page, source_section, source_excerpt, importance, confidence, canonical_hash) SELECT b.id, c.id, t.id, d.title, d.fact_text, CASE d.status WHEN 'verified' THEN 'Directly corroborated by a source in the batch verification ledger; original wording is retained.' ELSE 'Source-attributed material retained with explicit verification status and source linkage.' END, d.source_page::integer, d.title, d.fact_text, 3, d.confidence::confidence_level, d.canonical_hash FROM data d JOIN public.books b ON b.title = ${q(BOOK_TITLE)} JOIN public.chapters c ON c.book_id = b.id AND c.slug = d.chapter_slug JOIN public.topics t ON t.chapter_id = c.id AND t.slug = d.topic_slug ON CONFLICT (canonical_hash) DO UPDATE SET fact_text = EXCLUDED.fact_text, explanation = EXCLUDED.explanation, confidence = EXCLUDED.confidence;`;
  const notesSql = `WITH data(source_page, chapter_slug, topic_slug, title, content, confidence, canonical_hash) AS (VALUES\n${values(notes.map(row => [row.source_page, row.chapter_slug, row.topic_slug, row.title, row.content, row.confidence, row.canonical_hash]))}) INSERT INTO public.gk_notes (book_id, chapter_id, topic_id, title, content, source_page, source_section, display_order, confidence, canonical_hash) SELECT b.id, c.id, t.id, d.title, d.content, d.source_page::integer, d.title, d.source_page::integer, d.confidence::confidence_level, d.canonical_hash FROM data d JOIN public.books b ON b.title = ${q(BOOK_TITLE)} JOIN public.chapters c ON c.book_id = b.id AND c.slug = d.chapter_slug JOIN public.topics t ON t.chapter_id = c.id AND t.slug = d.topic_slug ON CONFLICT (canonical_hash) DO UPDATE SET content = EXCLUDED.content, confidence = EXCLUDED.confidence;`;
  const mcqSql = mcqs.map(row => { const [name, institution, exam_type, normalized] = examInfo(row.source); const keys = ["ক", "খ", "গ", "ঘ"]; const context = pageContext(row.source_page); const options = row.options.map((option, index) => `INSERT INTO public.gk_mcq_options (mcq_id, option_key, option_text, display_order, is_correct) SELECT m.id, ${q(keys[index])}, ${q(option)}, ${index + 1}, ${keys[index] === row.correct} FROM public.gk_mcqs m WHERE m.canonical_hash = ${q(row.canonical_hash)} AND NOT EXISTS (SELECT 1 FROM public.gk_mcq_options o WHERE o.mcq_id = m.id AND o.option_key = ${q(keys[index])});`).join("\n"); return `INSERT INTO public.exam_sources (name, institution, exam_type, description, normalized_name) SELECT ${q(name)}, ${q(institution)}, ${q(exam_type)}, ${q(`Normalized from printed source label on page ${row.source_page}.`)}, ${q(normalized)} WHERE NOT EXISTS (SELECT 1 FROM public.exam_sources WHERE normalized_name = ${q(normalized)}); INSERT INTO public.gk_mcqs (book_id, chapter_id, topic_id, question, correct_option, explanation, source_page, source_section, source_question_number, difficulty, confidence, canonical_hash) SELECT b.id, c.id, t.id, ${q(row.question)}, ${q(row.correct)}, ${q(row.status === "verified" ? "Printed answer is retained; matching historical claim is externally corroborated in the batch ledger." : "Printed answer key retained as source-attributed material pending deeper verification.")}, ${row.source_page}, 'এই অধ্যায়ের সাথে জড়িত বিগত বছরের প্রশ্ন', ${q(row.number)}, 3, ${q(row.confidence)}::confidence_level, ${q(row.canonical_hash)} FROM public.books b JOIN public.chapters c ON c.book_id = b.id AND c.slug = ${q(context.chapter)} JOIN public.topics t ON t.chapter_id = c.id AND t.slug = ${q(context.topic)} WHERE b.title = ${q(BOOK_TITLE)} ON CONFLICT (canonical_hash) DO UPDATE SET correct_option = EXCLUDED.correct_option, explanation = EXCLUDED.explanation, confidence = EXCLUDED.confidence; ${options} INSERT INTO public.gk_mcq_sources (mcq_id, exam_source_id, year, session, source_text, source_page) SELECT m.id, (SELECT id FROM public.exam_sources WHERE normalized_name = ${q(normalized)} LIMIT 1), NULL, ${q(row.source)}, ${q(row.source)}, ${row.source_page} FROM public.gk_mcqs m WHERE m.canonical_hash = ${q(row.canonical_hash)} AND NOT EXISTS (SELECT 1 FROM public.gk_mcq_sources s WHERE s.mcq_id = m.id AND s.source_text = ${q(row.source)} AND s.source_page = ${row.source_page});`; }).join("\n");
  const tagSql = `INSERT INTO public.content_tags (slug, label, category, description) VALUES\n${tags.map(tag => `(${tag.map(q).join(", ")})`).join(",\n")} ON CONFLICT (slug) DO UPDATE SET label = EXCLUDED.label, category = EXCLUDED.category, description = EXCLUDED.description;\n${facts.map(row => [row.tag, qualityTag(row.status), ...(row.fact_text.includes("Humanitarain") ? ["source-typo-preserved"] : [])].map(tag => `INSERT INTO public.content_tag_assignments (tag_id, entity_type, entity_id, source_page, confidence, assigned_by) SELECT t.id, 'fact', f.id, ${row.source_page}, ${q(row.confidence)}::confidence_level, 'batch-0479-0483-quality-pipeline' FROM public.content_tags t JOIN public.gk_facts f ON f.canonical_hash = ${q(row.canonical_hash)} WHERE t.slug = ${q(tag)} ON CONFLICT DO NOTHING;`).join("\n")).join("\n")}\n${notes.map(row => [row.tag, qualityTag(row.status)].map(tag => `INSERT INTO public.content_tag_assignments (tag_id, entity_type, entity_id, source_page, confidence, assigned_by) SELECT t.id, 'note', n.id, ${row.source_page}, ${q(row.confidence)}::confidence_level, 'batch-0479-0483-quality-pipeline' FROM public.content_tags t JOIN public.gk_notes n ON n.canonical_hash = ${q(row.canonical_hash)} WHERE t.slug = ${q(tag)} ON CONFLICT DO NOTHING;`).join("\n")).join("\n")}\n${mcqs.map(row => ["past-exam-mcq", "answer-key", examInfo(row.source)[3], qualityTag(row.status)].map(tag => `INSERT INTO public.content_tag_assignments (tag_id, entity_type, entity_id, source_page, confidence, assigned_by) SELECT t.id, 'mcq', m.id, ${row.source_page}, ${q(row.confidence)}::confidence_level, 'batch-0479-0483-quality-pipeline' FROM public.content_tags t JOIN public.gk_mcqs m ON m.canonical_hash = ${q(row.canonical_hash)} WHERE t.slug = ${q(tag)} ON CONFLICT DO NOTHING;`).join("\n")).join("\n")}`;
  const verificationSql = checks.map(row => { const id = recordLookup(row.type, row.hash); return `INSERT INTO public.fact_verifications (source_page, entity_type, entity_id, claim_text, normalized_claim, verification_status, confidence, verification_sources, audit_note) SELECT ${row.source_page}, ${q(row.type)}, ${id}, ${q(row.claim)}, ${row.normalized ? q(row.normalized) : "NULL"}, ${q(row.status)}, ${q(row.confidence)}::confidence_level, ${json(row.sources)}, ${q(row.status === "verified" ? "Direct external corroboration is listed in the batch verification ledger." : "Source-attributed record retained with explicit source linkage; no silent factual update.")} WHERE NOT EXISTS (SELECT 1 FROM public.fact_verifications v WHERE v.entity_type = ${q(row.type)} AND v.entity_id = ${id} AND v.claim_text = ${q(row.claim)});`; }).join("\n");
  const derivedSql = `INSERT INTO public.flashcards (subject_id, book_id, chapter_id, topic_id, front_text, back_text, source_type, source_id, source_key) SELECT (SELECT id FROM public.subjects ORDER BY created_at ASC LIMIT 1), f.book_id, f.chapter_id, f.topic_id, f.title, f.fact_text, 'fact', f.id, 'batch0479-0483:fact:' || f.id::text FROM public.gk_facts f WHERE f.source_page BETWEEN 479 AND 483 AND NOT EXISTS (SELECT 1 FROM public.flashcards c WHERE c.source_key = 'batch0479-0483:fact:' || f.id::text); INSERT INTO public.flashcards (subject_id, book_id, chapter_id, topic_id, front_text, back_text, source_type, source_id, source_key) SELECT (SELECT id FROM public.subjects ORDER BY created_at ASC LIMIT 1), n.book_id, n.chapter_id, n.topic_id, n.title, n.content, 'note', n.id, 'batch0479-0483:note:' || n.id::text FROM public.gk_notes n WHERE n.source_page BETWEEN 479 AND 483 AND NOT EXISTS (SELECT 1 FROM public.flashcards c WHERE c.source_key = 'batch0479-0483:note:' || n.id::text); INSERT INTO public.flashcards (subject_id, book_id, chapter_id, topic_id, front_text, back_text, source_type, source_id, source_key) SELECT (SELECT id FROM public.subjects ORDER BY created_at ASC LIMIT 1), m.book_id, m.chapter_id, m.topic_id, m.question, 'সঠিক উত্তর: ' || o.option_key || '. ' || o.option_text, 'mcq', m.id, 'batch0479-0483:mcq:' || m.id::text FROM public.gk_mcqs m JOIN public.gk_mcq_options o ON o.mcq_id = m.id AND o.is_correct WHERE m.source_page IN (480, 481, 483) AND NOT EXISTS (SELECT 1 FROM public.flashcards c WHERE c.source_key = 'batch0479-0483:mcq:' || m.id::text); INSERT INTO public.search_documents (entity_type, entity_id, title, body, english_metadata) SELECT 'fact', f.id, f.title, f.fact_text, 'Source-linked GK fact | page ' || f.source_page::text FROM public.gk_facts f WHERE f.source_page BETWEEN 479 AND 483 AND NOT EXISTS (SELECT 1 FROM public.search_documents d WHERE d.entity_type = 'fact' AND d.entity_id = f.id); INSERT INTO public.search_documents (entity_type, entity_id, title, body, english_metadata) SELECT 'note', n.id, n.title, n.content, 'Source-linked GK note | page ' || n.source_page::text FROM public.gk_notes n WHERE n.source_page BETWEEN 479 AND 483 AND NOT EXISTS (SELECT 1 FROM public.search_documents d WHERE d.entity_type = 'note' AND d.entity_id = n.id); INSERT INTO public.search_documents (entity_type, entity_id, title, body, english_metadata) SELECT 'mcq', m.id, NULL, m.question, 'Past-exam MCQ | page ' || m.source_page::text || ' | question ' || m.source_question_number FROM public.gk_mcqs m WHERE m.source_page IN (480, 481, 483) AND NOT EXISTS (SELECT 1 FROM public.search_documents d WHERE d.entity_type = 'mcq' AND d.entity_id = m.id);`;
  const audit = { batch_pages: BATCH_PAGES, pipeline_version: PIPELINE_VERSION, source_pages: pages.map(page => ({ page: page.source_page, sha256: page.source_image_sha256, review: page.review.review_status })), generated_fact_candidates: facts.length, generated_notes: notes.length, generated_mcqs: mcqs.length, generated_options: mcqs.length * 4, verification_statuses: Object.groupBy(checks, row => row.status), quality_gates: ["Five physical PDF pages only.", "Reviewed OCR artifacts and dense-page visual review are retained.", "Facts, notes/tables, definitions, MCQs, options, answer keys, and exam metadata remain distinct.", "Visible source typo Humanitarain is retained and tagged rather than silently normalised.", "All generated inserts are idempotent by source page, canonical hash, or source key."] };
  const sql = `-- Generated by scripts/prepare_validated_batch_0479_0483.mjs\n-- Source pages: 479–483 only. Do not extend this batch without explicit user instruction.\nBEGIN;\nINSERT INTO public.import_runs (source_filename, source_sha256, pipeline_version, status, completed_at, audit) VALUES ('Jubayer''sgk.pdf', ${q(sha(pages.map(page => page.source_image_sha256).join("|")))}, ${q(PIPELINE_VERSION)}, 'completed', now(), ${json(audit)});\n${chapterSql}\n${topicSql}\n${pagesSql}\n${factsSql}\n${notesSql}\n${mcqSql}\n${tagSql}\n${verificationSql}\n${derivedSql}\nCOMMIT;`;
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
