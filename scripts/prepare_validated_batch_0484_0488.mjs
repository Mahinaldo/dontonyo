import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const workDir = "/home/ubuntu/dontonyo-work/batch-0484-0488";
const outputDir = path.join(root, "supabase", "batch-0484-0488");
const sourcePages = [484, 485, 486, 487, 488];
const pageFiles = sourcePages.map(page => path.join(workDir, "pages", `page_${String(page).padStart(4, "0")}.json`));

export const BATCH_PAGES = [484, 485, 486, 487, 488];
export const BOOK_TITLE = "Jubayer's GK";
export const PIPELINE_VERSION = "vision-quality-gated-batch-0484-0488-v1";

const refs = {
  bcb: ["https://www.tigercricket.com.bd/history"],
  testStatus: ["https://www.tbsnews.net/sports/day-bangladesh-gained-test-status-2000-266497"],
  womensTest: ["https://www.tbsnews.net/sports/bangladesh-womens-cricket-team-gets-test-status-225793"],
  ganges: ["https://lpr.adb.org/sites/default/files/resource/1610/ganges-water-sharing-treaty-1996.pdf"],
};

const sha = value => crypto.createHash("sha256").update(value, "utf8").digest("hex");
const q = value => `'${String(value ?? "").replaceAll("'", "''")}'`;
const json = value => `${q(JSON.stringify(value))}::jsonb`;
const values = rows => rows.map(row => `(${row.map(q).join(", ")})`).join(",\n");
const confidence = value => value === "low" || value === "high" ? value : "medium";

const tags = [
  ["bangladesh-sports", "Bangladesh sports", "domain", "Bangladesh sports history, athletes, institutions, and past-exam material."],
  ["cricket", "Cricket", "content_type", "Cricket record, history, or player material."],
  ["football", "Football", "content_type", "Football record or historical material."],
  ["olympics", "Olympics", "content_type", "Olympic participation material."],
  ["chess", "Chess", "content_type", "Chess players, titles, or source lists."],
  ["sports-biography", "Sports biography", "content_type", "Source-preserved athlete biography."],
  ["sports-institution", "Sports institution", "content_type", "Sports governing body or educational institution."],
  ["table", "Table or structured reference", "content_type", "Source diagram, table, or structured reference list."],
  ["past-exam-mcq", "Past-exam MCQ", "content_type", "MCQ with printed exam metadata and answer key."],
  ["answer-key", "Answer key", "content_type", "Correct answer from the printed source answer key."],
  ["source-attributed", "Source-attributed", "quality", "Source-preserved content not fully independently verified."],
  ["externally-verified", "Externally verified", "quality", "Claim corroborated by a direct external reference in the batch ledger."],
  ["dhaka-university", "University of Dhaka", "exam_source", "University of Dhaka examination label as printed."],
  ["bcs", "BCS", "exam_source", "Bangladesh Civil Service examination label as printed."],
  ["medical-admission", "Medical admission", "exam_source", "Medical admission examination label as printed."],
  ["other-recruitment", "Other university and recruitment exam", "exam_source", "Other university or recruitment examination label as printed."],
];

function pageContext(page) {
  if (page === 484) {
    return {
      chapter: "bangladesh-treaties",
      topic: "treaties-past-exam-mcqs",
      chapterTitle: "বাংলাদেশের চুক্তি",
      topicTitle: "চুক্তি সম্পর্কিত বিগত বছরের প্রশ্ন",
    };
  }
  if (page === 488) {
    return {
      chapter: "bangladesh-sports",
      topic: "sports-past-exam-mcqs",
      chapterTitle: "বাংলাদেশের খেলাধুলা",
      topicTitle: "এই অধ্যায়ের সাথে জড়িত বিগত বছরের প্রশ্ন",
    };
  }
  if (page === 487) {
    return {
      chapter: "bangladesh-sports",
      topic: "bangladesh-sports-biographies",
      chapterTitle: "বাংলাদেশের খেলাধুলা",
      topicTitle: "খেলাধুলার অন্যান্য তথ্য ও জীবনী",
    };
  }
  return {
    chapter: "bangladesh-sports",
    topic: "bangladesh-sports-reference",
    chapterTitle: "বাংলাদেশের খেলাধুলা",
    topicTitle: page === 485 ? "ওয়ানডে ক্রিকেটে বাংলাদেশ" : "বিভিন্ন খেলাধুলায় বাংলাদেশ",
  };
}

function verification(page, text, kind = "fact", number = null) {
  if (kind === "mcq" && page === 484 && ["13", "17"].includes(number)) {
    return { status: "verified", confidence: "high", sources: refs.ganges };
  }
  if (page === 485 && text.includes("২৬ জুন, ২০০০")) {
    return { status: "verified", confidence: "high", sources: refs.testStatus };
  }
  if (page === 486 && (text.includes("দশম টেস্ট খেলুড়ে দেশ") || text.includes("অভিষেক টেস্ট") && text.includes("ভারতের বিপক্ষে"))) {
    return { status: "verified", confidence: "high", sources: refs.testStatus };
  }
  if (page === 487 && (text.includes("বিসিবি প্রতিষ্ঠিত হয়- ১৯৭২") || text.includes("ICC এর সহযোগী দেশ নির্বাচিত হয়- ১৯৭৭") || text.includes("ICC ট্রফিতে প্রথম অংশগ্রহণ করে- ১৯৭৯"))) {
    return { status: "verified", confidence: "high", sources: refs.bcb };
  }
  if (page === 487 && text.includes("জাতীয় নারী ক্রিকেট দল টেস্ট মর্যাদা লাভ করে- ১ এপ্রিল, ২০২১")) {
    return { status: "verified", confidence: "high", sources: refs.womensTest };
  }
  if (kind === "mcq" && page === 488 && number === "02") {
    return { status: "verified", confidence: "high", sources: refs.womensTest };
  }
  if (kind === "mcq" && page === 488 && ["10", "15"].includes(number)) {
    return { status: "verified", confidence: "high", sources: refs.testStatus };
  }
  return { status: "source_attributed", confidence: "medium", sources: [] };
}

const fact = (source_page, title, fact_text, tag) => {
  const context = pageContext(source_page);
  const result = verification(source_page, fact_text);
  return { source_page, chapter_slug: context.chapter, topic_slug: context.topic, title, fact_text, tag, ...result, canonical_hash: sha(`fact|${source_page}|${title}|${fact_text}`) };
};

const facts = [
  fact(485, "ওয়ানডে ক্রিকেটে বাংলাদেশ", "বাংলাদেশ ষষ্ঠ আইসিসি ট্রফিতে চ্যাম্পিয়ন হয়- ১৯৯৭ সালে (মালয়েশিয়ায়)।", "cricket"),
  fact(485, "ওয়ানডে ক্রিকেটে বাংলাদেশ", "ওয়ানডে ক্রিকেটে বাংলাদেশ প্রথম পরাজিত করে- কেনিয়াকে, ১৯৯৮ সালে।", "cricket"),
  fact(485, "ওয়ানডে ক্রিকেটে বাংলাদেশ", "ওয়ানডে ক্রিকেটে বাংলাদেশের পক্ষে এক ম্যাচে সর্বোচ্চ রান সংগ্রাহক- লিটন দাস (১৭৬ রান)।", "cricket"),
  fact(485, "ওয়ানডে ক্রিকেটে বাংলাদেশ", "বাংলাদেশ প্রথম যে দেশকে পরাজিত করে ওয়ানডে ও টেস্ট সিরিজ জয়লাভ করে- জিম্বাবুয়ে।", "cricket"),
  fact(485, "ওয়ানডে ক্রিকেটে বাংলাদেশ", "ওয়ানডেতে বাংলাদেশের দলীয় সর্বোচ্চ রান- ৩৪৯ রান (আয়ারল্যান্ডের বিপক্ষে)।", "cricket"),
  fact(485, "ওয়ানডে ক্রিকেটে বাংলাদেশ", "বাংলাদেশের পক্ষে ওয়ানডে ক্রিকেটে প্রথম হ্যাটট্রিক অর্জনকারী বোলার- শাহাদাত হোসেন রাজীব (২০০৬ সালে); জিম্বাবুয়ের বিপক্ষে।", "cricket"),
  fact(485, "ওয়ানডে ক্রিকেটে বাংলাদেশ", "বাংলাদেশের মহিলা ক্রিকেট দল ওয়ানডে স্ট্যাটাস লাভ করে- ২৪ নভেম্বর, ২০১১।", "cricket"),
  fact(485, "ওয়ানডে ক্রিকেটে বাংলাদেশ", "বাংলাদেশের প্রথম ক্রিকেটার হিসাবে ওয়ানডে ক্রিকেটে ৯০০০ রান পূর্ণ করেছে- তামিম ইকবাল।", "cricket"),
  fact(485, "বাংলাদেশ ক্রিকেটের মর্যাদা", "বাংলাদেশ ওয়ানডে স্ট্যাটাস লাভ করে- ১৯৯৭ সালে।", "cricket"),
  fact(485, "বাংলাদেশ ক্রিকেটের মর্যাদা", "বাংলাদেশ টেস্ট স্ট্যাটাস লাভ করে- ২৬ জুন, ২০০০ সালে।", "cricket"),
  fact(485, "বিশ্বকাপ ক্রিকেটে বাংলাদেশ", "বিশ্বকাপ ক্রিকেটে বাংলাদেশের অভিষেক হয়- ১৯৯৯ (নিউজিল্যান্ডের বিরুদ্ধে)।", "cricket"),
  fact(485, "বিশ্বকাপ ক্রিকেটে বাংলাদেশ", "বিশ্বকাপ ক্রিকেটে যে দলের বিরুদ্ধে বাংলাদেশ প্রথম জয়লাভ করে- স্কটল্যান্ড।", "cricket"),
  fact(485, "বিশ্বকাপ ক্রিকেটে বাংলাদেশ", "২০১১ সালের বিশ্বকাপ ক্রিকেটের উদ্বোধনী ম্যাচ অনুষ্ঠিত হয়- ঢাকায়।", "cricket"),
  fact(486, "টেস্ট ক্রিকেটে বাংলাদেশ", "বাংলাদেশ বিশ্বের- দশম টেস্ট খেলুড়ে দেশ।", "cricket"),
  fact(486, "টেস্ট ক্রিকেটে বাংলাদেশ", "বাংলাদেশ ক্রিকেট দলের অভিষেক টেস্ট অনুষ্ঠিত হয়- ২০০০ সালে, ঢাকায়; বাংলাদেশ অভিষেক টেস্ট খেলে- ভারতের বিপক্ষে।", "cricket"),
  fact(486, "টেস্ট ক্রিকেটে বাংলাদেশ", "বাংলাদেশের পক্ষে টেস্ট ক্রিকেটে প্রথম হ্যাটট্রিক অর্জনকারী বোলার- অলক কাপালি (২০০৩ সালে); পাকিস্তানের বিপক্ষে।", "cricket"),
  fact(486, "টেস্ট ক্রিকেটে বাংলাদেশ", "টেস্ট ক্রিকেটে বাংলাদেশের পক্ষে প্রথম ডাবল সেঞ্চুরি করেন- মুশফিকুর রহিম।", "cricket"),
  fact(486, "টেস্ট ক্রিকেটে বাংলাদেশ", "টেস্ট ক্রিকেটে বাংলাদেশের এক ইনিংসে সর্বোচ্চ রান- ৬৩৮ রান (শ্রীলঙ্কার বিপক্ষে)।", "cricket"),
  fact(486, "অলিম্পিকে বাংলাদেশ", "বাংলাদেশ বিশ্ব অলিম্পিকে প্রথম অংশগ্রহণ করে- লস এঞ্জেলসে, ১৯৮৪ সালে; প্রথম অংশগ্রহণ ছিল- ২৩তম অলিম্পিকে।", "olympics"),
  fact(486, "ফুটবলে বাংলাদেশ", "বাংলাদেশ ফিফার সদস্যপদ লাভ করে- ১ জানুয়ারি, ১৯৭৬ সালে।", "football"),
  fact(486, "ফুটবলে বাংলাদেশ", "বাংলাদেশ প্রথম বিশ্বকাপ ফুটবলের বাছাইপর্বে অংশগ্রহণ করে- ১৯৮৬ সালে।", "football"),
  fact(486, "ফুটবলে বাংলাদেশ", "ঢাকা প্রথম বিভাগ ফুটবল লীগ শুরু হয়- ১৯১৫ সাল থেকে।", "football"),
  fact(486, "ফুটবলে বাংলাদেশ", "বাংলাদেশের ফুটবল ইতিহাসের শ্রেষ্ঠ খেলোয়াড়- যাদুকর সামাদ।", "football"),
  fact(486, "ফুটবলে বাংলাদেশ", "স্বাধীন বাংলা ফুটবল দলের অধিনায়ক ছিলেন- জাকারিয়া পিন্টু।", "football"),
  fact(486, "বাংলাদেশের দাবাড়ু", "দাবা খেলার সর্বোচ্চ খেতাব- গ্র্যান্ডমাস্টার।", "chess"),
  fact(486, "বাংলাদেশের দাবাড়ু", "বাংলাদেশের সর্বশ্রেষ্ঠ দাবাড়ু- নিয়াজ মোর্শেদ।", "chess"),
  fact(486, "বাংলাদেশের দাবাড়ু", "বাংলাদেশে একমাত্র আন্তর্জাতিক মহিলা দাবাড়ু- রানী হামিদ।", "chess"),
  fact(487, "খেলাধুলার অন্যান্য তথ্য", "বাংলাদেশের জাতীয় খেলা কাবাডি; কাবাডি খেলার পূর্ণনাম- হাডুডু; কাবাডিকে জাতীয় খেলার মর্যাদা দেওয়া হয়- ১৯৭২ সালে।", "bangladesh-sports"),
  fact(487, "বাংলাদেশ ক্রিকেট বোর্ড", "বাংলাদেশ ক্রিকেটের সর্বোচ্চ নিয়ন্ত্রক সংস্থা- বাংলাদেশ ক্রিকেট বোর্ড (বিসিবি)।", "sports-institution"),
  fact(487, "বাংলাদেশ ক্রিকেট বোর্ড", "বিসিবি প্রতিষ্ঠিত হয়- ১৯৭২ সালে।", "sports-institution"),
  fact(487, "বাংলাদেশ নারী ক্রিকেট", "বাংলাদেশ জাতীয় নারী ক্রিকেট দল টেস্ট মর্যাদা লাভ করে- ১ এপ্রিল, ২০২১।", "cricket"),
  fact(487, "খেলাধুলার অন্যান্য তথ্য", "বাংলাদেশ কমনওয়েলথ গেমসে অংশগ্রহণ করে- ১৯৭৮ সালে (১১তম আসরে)।", "bangladesh-sports"),
  fact(487, "বাংলাদেশ ক্রিকেট বোর্ড", "বাংলাদেশ ICC এর সহযোগী দেশ নির্বাচিত হয়- ১৯৭৭ সালে।", "sports-institution"),
  fact(487, "বাংলাদেশ ক্রিকেট বোর্ড", "বাংলাদেশ ICC ট্রফিতে প্রথম অংশগ্রহণ করে- ১৯৭৯ সালে।", "sports-institution"),
  fact(487, "খেলাধুলার অন্যান্য তথ্য", "বাংলাদেশের ওয়ানডে নারী ক্রিকেটে প্রথম সেঞ্চুরি করে- ফারজানা হক পিংকি (ভারতের বিপক্ষে)।", "cricket"),
  fact(487, "খেলাধুলার অন্যান্য তথ্য", "ওয়ানডে ফরম্যাটে অভিষেক ম্যাচে প্রথম পাঁচ উইকেট শিকারী- তাসকিন আহমেদ।", "cricket"),
  fact(487, "খেলাধুলার অন্যান্য তথ্য", "বিশ্বের প্রথম ব্যাটার হিসাবে টেস্ট ক্রিকেটে অবস্ট্রাকটিং দ্য ফিল্ড আউট হন- মুশফিকুর রহমান।", "cricket"),
].map(row => ({ ...row, status: row.status, confidence: row.confidence, sources: row.sources }));

const note = (source_page, title, content, tag) => {
  const context = pageContext(source_page);
  const result = verification(source_page, content, "note");
  return { source_page, chapter_slug: context.chapter, topic_slug: context.topic, title, content, tag, ...result, canonical_hash: sha(`note|${source_page}|${title}|${content}`) };
};

const notes = [
  note(485, "ক্রিকেটে বাংলাদেশের প্রথম অধিনায়ক", "টি-২০ ক্রিকেট: শাহরিয়ার নাফীস\nওয়ানডে ক্রিকেট: গাজী আশরাফ লিপু\nটেস্ট ক্রিকেট: নাঈমুর রহমান দুর্জয়\nবিশ্বকাপ ক্রিকেট: আমিনুল ইসলাম বুলবুল", "table"),
  note(486, "দাবায় গ্র্যান্ডমাস্টার উপাধিপ্রাপ্ত ৫ জন বাংলাদেশি", "নিয়াজ মোর্শেদ\nআব্দুল্লাহ আল রাকিব\nরিফাত বিন সাত্তার\nজিয়াউর রহমান\nএনামুল হোসেন রাজীব", "chess"),
  note(486, "বাংলাদেশ ক্রীড়া শিক্ষা প্রতিষ্ঠান (BKSP)", "স্থাপিত হয়- ১৯৮৬ সালে।\nঅবস্থান- জিরানী, সাভার।\nবিকেএসপির মূল শিক্ষা কার্যক্রম- উচ্চমাধ্যমিক পর্যন্ত।\nউদ্দেশ্য- জাতীয় পর্যায়ে খেলাধুলার মান উন্নয়ন এবং আন্তর্জাতিক ক্রীড়াঙ্গনে বাংলাদেশের অবস্থানকে সম্মানজনক অবস্থায় উন্নীত করা।", "sports-institution"),
  note(487, "সিদ্দিকুর রহমান", "২০১০ সালে ব্রুনাই ওপেনে চ্যাম্পিয়ন হয়ে বাংলাদেশের প্রথম নাগরিক হিসাবে সিদ্দিকুর রহমান এশিয়ান ট্যুর প্রফেশনাল গলফ টুর্নামেন্ট জয় করেন।", "sports-biography"),
  note(487, "ব্রজেন দাস", "বাংলাদেশের সর্বকালের সর্বশ্রেষ্ঠ সাঁতারু ব্রজেন দাস। ইংলিশ চ্যানেল অতিক্রমকারী প্রথম এশীয় সাঁতারু বাংলাদেশের ব্রজেন দাস। ব্রজেন দাসের পৈতৃক নিবাস মুন্সিগঞ্জ জেলায়।", "sports-biography"),
  note(487, "মুশফিকুর রহিম", "বিশ্বের প্রথম ব্যাটার হিসাবে টেস্ট ক্রিকেটে অবস্ট্রাকটিং দ্য ফিল্ড আউট হন মুশফিকুর রহমান। বাংলাদেশের পক্ষে টেস্ট ক্রিকেটে সর্বোচ্চ রানের রেকর্ড তাঁর। টেস্ট ক্রিকেটের ইতিহাসে বিশ্বের প্রথম এবং একমাত্র উইকেটরক্ষক ব্যাটসম্যান হিসেবে দুটি ডাবল সেঞ্চুরি করার রেকর্ড রয়েছে তাঁর।", "sports-biography"),
];

const mcq = (source_page, number, question, options, correct, source) => {
  const result = verification(source_page, `${question} ${options.join(" ")}`, "mcq", number);
  return { source_page, number, question, options, correct, source, ...result, canonical_hash: sha(`mcq|${source_page}|${number}|${question}`) };
};

const mcqs = [
  mcq(484, "13", "বাংলাদেশ-ভারত পানি চুক্তির মেয়াদ-", ["১০ বছর", "২০ বছর", "২৫ বছর", "৩০ বছর"], "ঘ", "দুদক পরিদর্শক, ০৩"),
  mcq(484, "14", "ভারত-বাংলাদেশ সীমানা চিহ্নিত করণে মুজিব-ইন্দিরা চুক্তি যে তারিখে সম্পাদিত হয়-", ["১৬ মে, ১৯৭৪", "১৭ মে, ১৯৭৪", "১৬ মে, ১৮৭৫", "১৭ মে, ১৯৭৫"], "ক", "প্রা বি প্র শিক্ষক, ০১"),
  mcq(484, "15", "১৯৭৪ সালে মুজিব-ইন্দিরা চুক্তি স্বাক্ষরিত হয়-", ["ঢাকায়", "দিল্লিতে", "কলকাতায়", "সিমলায়"], "খ", "আনসার ও বিডিপি অধিদপ্তরের সার্কেল অ্যাডজুটেন্ট, ১০"),
  mcq(484, "16", "ফারাক্কা বাঁধ চালু হয় কবে?", ["১৯৭৫ সালে", "১৯৬৯ সালে", "১৯৭০ সালে", "১৯৭৩ সালে"], "ক", "পাসপোর্ট ও ইমিগ্রেশন অধিদপ্তরের সহকারী পরিচালক, ০৭"),
  mcq(484, "17", "সর্বশেষ ফারাক্কা পানি বণ্টন চুক্তি কখন স্বাক্ষরিত হয়?", ["১২ ডিসেম্বর ১৯৯৬", "২৩ মার্চ ১৯৯৭", "১৪ ডিসেম্বর ১৯৯৮", "৩১ জানুয়ারি ২০০১"], "ক", "জবি-খ, ০৫-০৬"),
  mcq(484, "18", "উপজাতিদের প্রতিনিধি হিসেবে কে পার্বত্য চট্টগ্রাম শান্তি চুক্তিতে স্বাক্ষর করেন?", ["মানবেন্দ্র নারায়ণ লারমা", "রাজা দেবাশীষ রায়", "শন্তু লারমা", "বীনা চাকমা"], "গ", "জবি-খ, ০৬-০৭"),
  mcq(484, "19", "দক্ষিণ এশিয়ার প্রথম দেশ হিসেবে CTBT অনুমোদন করে কোন দেশ?", ["ভারত", "বাংলাদেশ", "নেপাল", "পাকিস্তান"], "খ", "জবি-খ, ০৬-০৭"),
  mcq(488, "01", "স্বাধীন বাংলা ফুটবল দলের অধিনায়ক কে ছিলেন?", ["কাজী সালাউদ্দিন", "জাকারিয়া পিন্টু", "সাইদুর রহমান প্যাটেল", "অমলেশ সেন"], "খ", "DU খ ২৩-২৪"),
  mcq(488, "02", "বাংলাদেশ জাতীয় নারী ক্রিকেট দল কবে টেস্ট মর্যাদা লাভ করে?", ["১ এপ্রিল ২০২১", "১০ এপ্রিল ২০২১", "২০ এপ্রিল ২০২১", "৩০ এপ্রিল ২০২১"], "ক", "DU ঘ ২১-২২"),
  mcq(488, "03", "২০২০ সালের অনূর্ধ্ব-১৯ বিশ্বকাপ বিজয়ী বাংলাদেশ ক্রিকেট দলের অধিনায়ক কে ছিলেন?", ["আকবর আলী", "শামীম হোসেন", "শরীফুল ইসলাম", "তৌহিদ হৃদয়"], "ক", "DU খ ২০-২১"),
  mcq(488, "04", "টোকিও অলিম্পিক গেমস ২০২০ এর কোন ইভেন্টে বাংলাদেশ প্রথমবারের মত দ্বিতীয় পর্বে পৌঁছেছিল?", ["সাঁতার", "ধনুবিদ্যা", "শুটিং", "অ্যাথলেটিকস্"], "খ", "DU ঘ ২০-২১"),
  mcq(488, "05", "টেস্ট ক্রিকেটে বাংলাদেশের পক্ষে প্রথম ডাবল সেঞ্চুরি কে করেন?", ["মোহাম্মদ আশরাফুল", "মমিনুল হক", "তামিম ইকবাল", "মুশফিকুর রহিম"], "ঘ", "DU ঘ ১৬-১৭"),
  mcq(488, "06", "বাংলাদেশের প্রথম টেস্ট ক্রিকেট দলের অধিনায়ক কে ছিলেন?", ["আকরাম খান", "আমিনুল ইসলাম", "নাঈমুর রহমান", "খালেদ মাসুদ"], "গ", "DU ঙ ০৩-০৪/চবি-ঘ, ০৭-০৮"),
  mcq(488, "07", "বিশ্বকাপ ক্রিকেট কোন দলের বিরুদ্ধে বাংলাদেশ প্রথম জয়লাভ করে?", ["স্কটল্যান্ড", "মালয়েশিয়া", "পাকিস্তান", "কেনিয়া"], "ক", "DU খ ০৮-০৯"),
  mcq(488, "08", "বাংলাদেশ বিশ্বকাপ ক্রিকেট প্রতিযোগিতায় প্রথম যে দেশের বিরুদ্ধে ম্যাচ খেলেছিল-", ["স্কটল্যান্ড", "নিউজিল্যান্ড", "পাকিস্তান", "জিম্বাবুয়ে"], "খ", "DU খ ০৪-০৫"),
  mcq(488, "09", "বাংলাদেশ.........সাল থেকে গ্রীষ্মকালীন অলিম্পিকে অংশগ্রহণ করে আসছে-", ["১৯৮৫", "১৯৮৪", "১৯৮৬", "১৯৮৩"], "খ", "30 BCS"),
  mcq(488, "10", "বাংলাদেশ কত সালে ক্রিকেট টেস্ট স্ট্যাটাস লাভ করে?", ["১৫ জুন ১৯৯৭", "২৬ জুন ১৯৯৭", "২৬ জুন ২০০০", "২৫ মে ২০০৪"], "গ", "37,30,25 BCS"),
  mcq(488, "11", "প্রথম আইসিসি ট্রফিতে বাংলাদেশ দলের অধিনায়ক কে ছিলেন?", ["আশরাফ হোসেন লিপু", "আকরাম খান", "আমিনুল ইসলাম বুলবুল", "শফিকুল হক হীরা"], "ঘ", "26 BCS"),
  mcq(488, "12", "বাংলাদেশের পক্ষে ওয়ানডে অভিষেকে কোন ক্রিকেটার পাঁচ উইকেট পেয়েছেন?", ["সোহাগ গাজী", "রুবেল হোসেন", "তাইজুল ইসলাম", "তাসকিন আহমেদ"], "ঘ", "35 BCS"),
  mcq(488, "13", "১৯৭১ সালে স্বাধীন বাংলা ফুটবল দলের অধিনায়ক কে ছিলেন?", ["এনায়েতুর রহমান খান", "প্রতাপ শংকর হাজরা", "মেজর হাফিজ উদ্দিন আহমদ", "জাকারিয়া পিন্টু"], "ঘ", "MC 24-25"),
  mcq(488, "14", "কোন সালে বাংলাদেশ ক্রিকেট ওয়ানডে স্ট্যাটাস লাভ করে?", ["১৯৯৮", "১৯৯৯", "১৯৯৬", "১৯৯৭"], "ঘ", "MC 19-20"),
  mcq(488, "15", "বাংলাদেশ কততম টেস্ট প্লেয়িং দেশ হিসাবে স্বীকৃতি পেয়েছে?", ["অষ্টম", "দশম", "নবম", "এগারতম"], "খ", "শাবি-খ, ০৩-০৪"),
  mcq(488, "16", "বাংলাদেশ প্রথম কোন সালে অলিম্পিকে অংশগ্রহণ করে?", ["১৯৮৪", "২০০০", "১৯৯৬", "১৯৭২"], "ক", "মাধ্যমিক সহকারী শিক্ষক, ০৯"),
];

function examInfo(source) {
  if (source.includes("DU")) return ["University of Dhaka", "University of Dhaka", "admission", "dhaka-university"];
  if (source.includes("BCS")) return ["Bangladesh Civil Service", null, "competitive", "bcs"];
  if (source.startsWith("MC")) return ["Medical Admission", null, "admission", "medical-admission"];
  return ["Other university and recruitment examination", null, "competitive", "other-recruitment"];
}

function qualityTag(status) { return status === "verified" ? "externally-verified" : "source-attributed"; }
function recordLookup(type, hash) {
  if (type === "fact") return `(SELECT id FROM public.gk_facts WHERE canonical_hash = ${q(hash)} LIMIT 1)`;
  if (type === "note") return `(SELECT id FROM public.gk_notes WHERE canonical_hash = ${q(hash)} LIMIT 1)`;
  return `(SELECT id FROM public.gk_mcqs WHERE canonical_hash = ${q(hash)} LIMIT 1)`;
}

function pageMetadata(page) {
  const printed = { 484: 427, 485: 428, 486: 429, 487: 430, 488: 431 }[page.source_page];
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
    page_number_mismatch: page.transcription.source_page !== page.source_page ? "Nested OCR page metadata differs from the physical PDF page; physical source page and reviewed footer are canonical." : null,
    visual_review_report: "/home/ubuntu/dontonyo/reports/batch-0484-0488_visual_review.md",
    external_verification_report: "/home/ubuntu/dontonyo/reports/batch-0484-0488_external_verification.md",
  };
}

export async function buildBatch() {
  const pages = await Promise.all(pageFiles.map(async file => JSON.parse(await fs.readFile(file, "utf8"))));
  const checks = [
    ...facts.map(row => ({ type: "fact", hash: row.canonical_hash, source_page: row.source_page, claim: row.fact_text, normalized: row.fact_text, status: row.status, confidence: row.confidence, sources: row.sources })),
    ...notes.map(row => ({ type: "note", hash: row.canonical_hash, source_page: row.source_page, claim: row.content, normalized: row.content, status: row.status, confidence: row.confidence, sources: row.sources })),
    ...mcqs.map(row => ({ type: "mcq", hash: row.canonical_hash, source_page: row.source_page, claim: `${row.question} — printed answer: ${row.correct}`, normalized: null, status: row.status, confidence: row.confidence, sources: row.sources })),
  ];
  const chapterSql = `INSERT INTO public.chapters (book_id, chapter_number, title, slug, description, source_page, display_order) SELECT b.id, 44, 'বাংলাদেশের খেলাধুলা', 'bangladesh-sports', 'Source-derived Bangladesh sports reference material and past-exam MCQs with explicit verification states.', 485, 44 FROM public.books b WHERE b.title = ${q(BOOK_TITLE)} AND NOT EXISTS (SELECT 1 FROM public.chapters c WHERE c.book_id = b.id AND c.slug = 'bangladesh-sports');`;
  const topicSql = `INSERT INTO public.topics (chapter_id, title, slug, description, source_page, display_order) SELECT c.id, x.title, x.slug, x.description, x.source_page, x.display_order FROM (VALUES ('বাংলাদেশের খেলাধুলা রেফারেন্স', 'bangladesh-sports-reference', 'Source-derived cricket, Olympics, football, chess, and institutional reference material.', 485, 1), ('খেলাধুলার অন্যান্য তথ্য ও জীবনী', 'bangladesh-sports-biographies', 'Source-preserved athlete biographies and other sports facts.', 487, 2), ('খেলাধুলা সম্পর্কিত বিগত বছরের প্রশ্ন', 'sports-past-exam-mcqs', 'Past-exam MCQs with all printed options, answer keys, and exam labels.', 484, 3)) AS x(title, slug, description, source_page, display_order) JOIN public.chapters c ON c.slug = 'bangladesh-sports' AND c.book_id = (SELECT id FROM public.books WHERE title = ${q(BOOK_TITLE)} LIMIT 1) WHERE NOT EXISTS (SELECT 1 FROM public.topics t WHERE t.chapter_id = c.id AND t.slug = x.slug);`;
  const pagesSql = pages.map(page => {
    const context = pageContext(page.source_page);
    const kind = [484, 488].includes(page.source_page) ? "mcq" : "educational";
    return `INSERT INTO public.source_pages (import_run_id, book_id, source_page, page_kind, raw_transcription, chapter_heading, topic_heading, confidence, extraction_method, model_name, notes, review_metadata) SELECT (SELECT id FROM public.import_runs WHERE pipeline_version = ${q(PIPELINE_VERSION)} ORDER BY started_at DESC LIMIT 1), b.id, ${page.source_page}, ${q(kind)}::page_kind, ${q(page.review.verified_transcript)}, ${q(context.chapterTitle)}, ${q(context.topicTitle)}, ${q(confidence(page.review.overall_confidence))}::confidence_level, 'vision_ocr_with_image_grounded_review', ${q(page.model)}, 'Quality-gated source extraction with visual review, semantic separation, and verification ledger.', ${json(pageMetadata(page))} FROM public.books b WHERE b.title = ${q(BOOK_TITLE)} AND NOT EXISTS (SELECT 1 FROM public.source_pages s WHERE s.book_id = b.id AND s.source_page = ${page.source_page});`;
  }).join("\n");
  const factsSql = `WITH data(source_page, chapter_slug, topic_slug, title, fact_text, confidence, canonical_hash, status) AS (VALUES\n${values(facts.map(row => [row.source_page, row.chapter_slug, row.topic_slug, row.title, row.fact_text, row.confidence, row.canonical_hash, row.status]))}) INSERT INTO public.gk_facts (book_id, chapter_id, topic_id, title, fact_text, explanation, source_page, source_section, source_excerpt, importance, confidence, canonical_hash) SELECT b.id, c.id, t.id, d.title, d.fact_text, CASE d.status WHEN 'verified' THEN 'Directly corroborated by a source in the batch verification ledger; original wording is retained.' ELSE 'Source-attributed material retained with explicit verification status and source linkage.' END, d.source_page::integer, d.title, d.fact_text, 3, d.confidence::confidence_level, d.canonical_hash FROM data d JOIN public.books b ON b.title = ${q(BOOK_TITLE)} JOIN public.chapters c ON c.book_id = b.id AND c.slug = d.chapter_slug JOIN public.topics t ON t.chapter_id = c.id AND t.slug = d.topic_slug ON CONFLICT (canonical_hash) DO UPDATE SET fact_text = EXCLUDED.fact_text, explanation = EXCLUDED.explanation, confidence = EXCLUDED.confidence;`;
  const notesSql = `WITH data(source_page, chapter_slug, topic_slug, title, content, confidence, canonical_hash) AS (VALUES\n${values(notes.map(row => [row.source_page, row.chapter_slug, row.topic_slug, row.title, row.content, row.confidence, row.canonical_hash]))}) INSERT INTO public.gk_notes (book_id, chapter_id, topic_id, title, content, source_page, source_section, display_order, confidence, canonical_hash) SELECT b.id, c.id, t.id, d.title, d.content, d.source_page::integer, d.title, d.source_page::integer, d.confidence::confidence_level, d.canonical_hash FROM data d JOIN public.books b ON b.title = ${q(BOOK_TITLE)} JOIN public.chapters c ON c.book_id = b.id AND c.slug = d.chapter_slug JOIN public.topics t ON t.chapter_id = c.id AND t.slug = d.topic_slug ON CONFLICT (canonical_hash) DO UPDATE SET content = EXCLUDED.content, confidence = EXCLUDED.confidence;`;
  const mcqSql = mcqs.map(row => {
    const [name, institution, exam_type, normalized] = examInfo(row.source);
    const context = pageContext(row.source_page);
    const keys = ["ক", "খ", "গ", "ঘ"];
    const options = row.options.map((option, index) => `INSERT INTO public.gk_mcq_options (mcq_id, option_key, option_text, display_order, is_correct) SELECT m.id, ${q(keys[index])}, ${q(option)}, ${index + 1}, ${keys[index] === row.correct} FROM public.gk_mcqs m WHERE m.canonical_hash = ${q(row.canonical_hash)} AND NOT EXISTS (SELECT 1 FROM public.gk_mcq_options o WHERE o.mcq_id = m.id AND o.option_key = ${q(keys[index])});`).join("\n");
    return `INSERT INTO public.exam_sources (name, institution, exam_type, description, normalized_name) SELECT ${q(name)}, ${q(institution)}, ${q(exam_type)}, ${q(`Normalized from printed source label on page ${row.source_page}.`)}, ${q(normalized)} WHERE NOT EXISTS (SELECT 1 FROM public.exam_sources WHERE normalized_name = ${q(normalized)}); INSERT INTO public.gk_mcqs (book_id, chapter_id, topic_id, question, correct_option, explanation, source_page, source_section, source_question_number, difficulty, confidence, canonical_hash) SELECT b.id, c.id, t.id, ${q(row.question)}, ${q(row.correct)}, ${q(row.status === "verified" ? "Printed answer retained; the directly matching claim is corroborated in the batch verification ledger." : "Printed answer key retained as source-attributed material pending deeper verification.")}, ${row.source_page}, 'এই অধ্যায়ের সাথে জড়িত বিগত বছরের প্রশ্ন', ${q(row.number)}, 3, ${q(row.confidence)}::confidence_level, ${q(row.canonical_hash)} FROM public.books b JOIN public.chapters c ON c.book_id = b.id AND c.slug = ${q(context.chapter)} JOIN public.topics t ON t.chapter_id = c.id AND t.slug = ${q(context.topic)} WHERE b.title = ${q(BOOK_TITLE)} ON CONFLICT (canonical_hash) DO UPDATE SET correct_option = EXCLUDED.correct_option, explanation = EXCLUDED.explanation, confidence = EXCLUDED.confidence; ${options} INSERT INTO public.gk_mcq_sources (mcq_id, exam_source_id, year, session, source_text, source_page) SELECT m.id, (SELECT id FROM public.exam_sources WHERE normalized_name = ${q(normalized)} LIMIT 1), NULL, ${q(row.source)}, ${q(row.source)}, ${row.source_page} FROM public.gk_mcqs m WHERE m.canonical_hash = ${q(row.canonical_hash)} AND NOT EXISTS (SELECT 1 FROM public.gk_mcq_sources s WHERE s.mcq_id = m.id AND s.source_text = ${q(row.source)} AND s.source_page = ${row.source_page});`;
  }).join("\n");
  const tagSql = `INSERT INTO public.content_tags (slug, label, category, description) VALUES\n${tags.map(tag => `(${tag.map(q).join(", ")})`).join(",\n")} ON CONFLICT (slug) DO UPDATE SET label = EXCLUDED.label, category = EXCLUDED.category, description = EXCLUDED.description;\n${facts.map(row => [row.tag, qualityTag(row.status)].map(tag => `INSERT INTO public.content_tag_assignments (tag_id, entity_type, entity_id, source_page, confidence, assigned_by) SELECT t.id, 'fact', f.id, ${row.source_page}, ${q(row.confidence)}::confidence_level, 'batch-0484-0488-quality-pipeline' FROM public.content_tags t JOIN public.gk_facts f ON f.canonical_hash = ${q(row.canonical_hash)} WHERE t.slug = ${q(tag)} ON CONFLICT DO NOTHING;`).join("\n")).join("\n")}\n${notes.map(row => [row.tag, qualityTag(row.status)].map(tag => `INSERT INTO public.content_tag_assignments (tag_id, entity_type, entity_id, source_page, confidence, assigned_by) SELECT t.id, 'note', n.id, ${row.source_page}, ${q(row.confidence)}::confidence_level, 'batch-0484-0488-quality-pipeline' FROM public.content_tags t JOIN public.gk_notes n ON n.canonical_hash = ${q(row.canonical_hash)} WHERE t.slug = ${q(tag)} ON CONFLICT DO NOTHING;`).join("\n")).join("\n")}\n${mcqs.map(row => ["past-exam-mcq", "answer-key", examInfo(row.source)[3], qualityTag(row.status)].map(tag => `INSERT INTO public.content_tag_assignments (tag_id, entity_type, entity_id, source_page, confidence, assigned_by) SELECT t.id, 'mcq', m.id, ${row.source_page}, ${q(row.confidence)}::confidence_level, 'batch-0484-0488-quality-pipeline' FROM public.content_tags t JOIN public.gk_mcqs m ON m.canonical_hash = ${q(row.canonical_hash)} WHERE t.slug = ${q(tag)} ON CONFLICT DO NOTHING;`).join("\n")).join("\n")}`;
  const verificationSql = checks.map(row => {
    const id = recordLookup(row.type, row.hash);
    return `INSERT INTO public.fact_verifications (source_page, entity_type, entity_id, claim_text, normalized_claim, verification_status, confidence, verification_sources, audit_note) SELECT ${row.source_page}, ${q(row.type)}, ${id}, ${q(row.claim)}, ${row.normalized ? q(row.normalized) : "NULL"}, ${q(row.status)}, ${q(row.confidence)}::confidence_level, ${json(row.sources)}, ${q(row.status === "verified" ? "Direct external corroboration is listed in the batch verification ledger." : "Source-attributed record retained with explicit source linkage; no silent factual update.")} WHERE NOT EXISTS (SELECT 1 FROM public.fact_verifications v WHERE v.entity_type = ${q(row.type)} AND v.entity_id = ${id} AND v.claim_text = ${q(row.claim)});`;
  }).join("\n");
  const derivedSql = `INSERT INTO public.flashcards (subject_id, book_id, chapter_id, topic_id, front_text, back_text, source_type, source_id, source_key) SELECT (SELECT id FROM public.subjects ORDER BY created_at ASC LIMIT 1), f.book_id, f.chapter_id, f.topic_id, f.title, f.fact_text, 'fact', f.id, 'batch0484-0488:fact:' || f.id::text FROM public.gk_facts f WHERE f.source_page BETWEEN 484 AND 488 AND NOT EXISTS (SELECT 1 FROM public.flashcards c WHERE c.source_key = 'batch0484-0488:fact:' || f.id::text); INSERT INTO public.flashcards (subject_id, book_id, chapter_id, topic_id, front_text, back_text, source_type, source_id, source_key) SELECT (SELECT id FROM public.subjects ORDER BY created_at ASC LIMIT 1), n.book_id, n.chapter_id, n.topic_id, n.title, n.content, 'note', n.id, 'batch0484-0488:note:' || n.id::text FROM public.gk_notes n WHERE n.source_page BETWEEN 484 AND 488 AND NOT EXISTS (SELECT 1 FROM public.flashcards c WHERE c.source_key = 'batch0484-0488:note:' || n.id::text); INSERT INTO public.flashcards (subject_id, book_id, chapter_id, topic_id, front_text, back_text, source_type, source_id, source_key) SELECT (SELECT id FROM public.subjects ORDER BY created_at ASC LIMIT 1), m.book_id, m.chapter_id, m.topic_id, m.question, 'সঠিক উত্তর: ' || o.option_key || '. ' || o.option_text, 'mcq', m.id, 'batch0484-0488:mcq:' || m.id::text FROM public.gk_mcqs m JOIN public.gk_mcq_options o ON o.mcq_id = m.id AND o.is_correct WHERE m.source_page IN (484, 488) AND NOT EXISTS (SELECT 1 FROM public.flashcards c WHERE c.source_key = 'batch0484-0488:mcq:' || m.id::text); INSERT INTO public.search_documents (entity_type, entity_id, title, body, english_metadata) SELECT 'fact', f.id, f.title, f.fact_text, 'Source-linked GK fact | page ' || f.source_page::text FROM public.gk_facts f WHERE f.source_page BETWEEN 484 AND 488 AND NOT EXISTS (SELECT 1 FROM public.search_documents d WHERE d.entity_type = 'fact' AND d.entity_id = f.id); INSERT INTO public.search_documents (entity_type, entity_id, title, body, english_metadata) SELECT 'note', n.id, n.title, n.content, 'Source-linked GK note | page ' || n.source_page::text FROM public.gk_notes n WHERE n.source_page BETWEEN 484 AND 488 AND NOT EXISTS (SELECT 1 FROM public.search_documents d WHERE d.entity_type = 'note' AND d.entity_id = n.id); INSERT INTO public.search_documents (entity_type, entity_id, title, body, english_metadata) SELECT 'mcq', m.id, NULL, m.question, 'Past-exam MCQ | page ' || m.source_page::text || ' | question ' || m.source_question_number FROM public.gk_mcqs m WHERE m.source_page IN (484, 488) AND NOT EXISTS (SELECT 1 FROM public.search_documents d WHERE d.entity_type = 'mcq' AND d.entity_id = m.id);`;
  const audit = {
    batch_pages: BATCH_PAGES,
    pipeline_version: PIPELINE_VERSION,
    source_pages: pages.map(page => ({ page: page.source_page, sha256: page.source_image_sha256, review: page.review.review_status })),
    generated_fact_candidates: facts.length,
    generated_notes: notes.length,
    generated_mcqs: mcqs.length,
    generated_options: mcqs.length * 4,
    verification_statuses: Object.groupBy(checks, row => row.status),
    quality_gates: [
      "Five physical PDF pages only.",
      "Reviewed OCR artifacts and ordered dense-page visual review are retained.",
      "Facts, biographies, notes/lists, MCQs, options, answer keys, and exam metadata remain distinct.",
      "Image-grounded corrections to page 485, 486, and 488 metadata are represented in source-page review metadata.",
      "All generated inserts are idempotent by source page, canonical hash, or source key.",
    ],
  };
  const sql = `-- Generated by scripts/prepare_validated_batch_0484_0488.mjs\n-- Source pages: 484–488 only. Do not extend this batch without explicit user instruction.\nBEGIN;\nINSERT INTO public.import_runs (source_filename, source_sha256, pipeline_version, status, completed_at, audit) VALUES ('Jubayer''sgk.pdf', ${q(sha(pages.map(page => page.source_image_sha256).join("|")))}, ${q(PIPELINE_VERSION)}, 'completed', now(), ${json(audit)});\n${chapterSql}\n${topicSql}\n${pagesSql}\n${factsSql}\n${notesSql}\n${mcqSql}\n${tagSql}\n${verificationSql}\n${derivedSql}\nCOMMIT;`;
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
