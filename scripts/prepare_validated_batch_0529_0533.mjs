import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const workDir = "/home/ubuntu/dontonyo-work/batch-0529-0533";
const outputDir = path.join(root, "supabase", "batch-0529-0533");
export const BATCH_PAGES = [529, 530, 531, 532, 533];
export const PIPELINE_VERSION = "vision-quality-gated-batch-0529-0533-v1";
const BOOK_TITLE = "Jubayer's GK";
const q = value => `'${String(value ?? "").replaceAll("'", "''")}'`;
const json = value => `${q(JSON.stringify(value))}::jsonb`;
const hash = value => crypto.createHash("sha256").update(value, "utf8").digest("hex");
const values = rows => rows.map(row => `(${row.map(q).join(",")})`).join(",\n");
const files = BATCH_PAGES.map(page => path.join(workDir, "pages", `page_${String(page).padStart(4, "0")}.json`));
const refs = {
  unNonviolence: "https://www.un.org/en/observances/non-violence-day",
  nobelTeresaBio: "https://www.nobelprize.org/prizes/peace/1979/teresa/biographical/",
  nobelTeresaPrize: "https://www.nobelprize.org/prizes/peace/1979/summary/",
  adstRajiv: "https://adst.org/2015/05/reap-the-whirlwind-the-assassination-of-rajiv-gandhi/",
  nobelSen: "https://www.nobelprize.org/prizes/economic-sciences/1998/summary/",
  pmManmohan: "https://www.pmindia.gov.in/en/former_pm/dr-manmohan-singh-2/",
  prsJk: "https://prsindia.org/billtrack/prs-products/prs-bill-summary-3333",
  indiaCodeJk: "https://www.indiacode.nic.in/handle/123456789/12030?view_type=browse",
};
const ctx = page => ({
  chapter: "india",
  chapterTitle: "ভারত",
  topic: page === 529 ? "india-overview-personalities" : page === 530 ? "india-notable-personalities" : page === 531 ? "india-presidents-pm-society" : page === 532 ? "india-parties-culture-administration" : "india-map-reference",
  topicTitle: page === 529 ? "ভারত পরিচিতি ও বিখ্যাত ব্যক্তিত্ব" : page === 530 ? "ভারতের বিখ্যাত ব্যক্তিত্ব" : page === 531 ? "ভারতের রাষ্ট্রপতি, প্রধানমন্ত্রী ও নারী অগ্রণী" : page === 532 ? "রাজনৈতিক দল, সংস্কৃতি ও প্রশাসনিক অঞ্চল" : "ভারতের ২৮টি রাজ্য ও উল্লেখযোগ্য স্থান",
});
const fact = (page, title, text, status = "source_attributed", confidence = "medium", sources = []) => ({
  source_page: page, title, fact_text: text, status, confidence, sources, ...ctx(page),
  canonical_hash: hash(`fact|${page}|${title}|${text}`),
});
const note = (page, title, content, confidence = "medium") => ({
  source_page: page, title, content, status: "source_attributed", confidence, sources: [], ...ctx(page),
  canonical_hash: hash(`note|${page}|${title}|${content}`),
});

const facts = [
  fact(529, "দক্ষিণ এশিয়ায় ভারতের অবস্থান (source statement)", "আয়তন ও জনসংখ্যা উভয় দিক দিয়ে দক্ষিণ এশিয়ার বৃহত্তম দেশ ভারত।", "source_attributed", "high"),
  fact(529, "ভারতের সীমানা ও জলভাগ (source statement)", "পশ্চিমে আরব সাগর ও পাকিস্তান, পূর্বে বাংলাদেশ ও মিয়ানমার, উত্তর-পূর্বে চীন, নেপাল ও ভুটান; দক্ষিণে ভারত মহাসাগর এবং পূর্বে বঙ্গোপসাগর ভারতের ভৌগোলিক প্রেক্ষিত।", "source_attributed", "high"),
  fact(529, "আন্দামান ও নিকোবর (source statement)", "বঙ্গোপসাগরের আন্দামান ও নিকোবর দ্বীপপুঞ্জ ভারতের অংশ।", "source_attributed", "high"),
  fact(529, "মহাত্মা গান্ধীর পরিচিতি (source statement)", "মহাত্মা গান্ধী ভারতের জাতির জনক ও জাতীয়তাবাদী নেতা।", "source_attributed", "medium"),
  fact(529, "মহাত্মা গান্ধীর প্রকৃত নাম (source statement)", "প্রকৃত নাম- মোহনদাস করমচাঁদ গান্ধী।", "source_attributed", "medium"),
  fact(529, "মহাত্মা উপাধি (source statement)", "বিশ্বকবি রবীন্দ্রনাথ ঠাকুর মহাত্মা উপাধি দেন।", "source_attributed", "medium"),
  fact(529, "গান্ধীর সত্যাগ্রহ (source statement)", "মহাত্মা গান্ধী সত্যাগ্রহ আন্দোলনের প্রবক্তা।", "source_attributed", "high"),
  fact(529, "মহাত্মা গান্ধীর জন্মদিন", "মহাত্মা গান্ধীর জন্মদিন ২ অক্টোবর।", "verified", "high", [refs.unNonviolence]),
  fact(529, "আন্তর্জাতিক অহিংসা দিবস", "আন্তর্জাতিক অহিংসা দিবস ২ অক্টোবর।", "verified", "high", [refs.unNonviolence]),
  fact(529, "অসহযোগ আন্দোলনের সময়কাল (source statement)", "অসহযোগ আন্দোলনের সময়কাল ১৯২০-১৯২২।", "source_attributed", "high"),
  fact(529, "কায়সার-ই-হিন্দ খেতাব (source statement)", "অসহযোগ আন্দোলনকালে গান্ধী ব্রিটিশ সরকার প্রদত্ত 'কায়সার-ই-হিন্দ' খেতাব ফিরিয়ে দেন।", "source_attributed", "medium"),
  fact(529, "Indian Opinion (source statement)", "গান্ধী দক্ষিণ আফ্রিকায় 'ইন্ডিয়ান অপিনিয়ন' পত্রিকাটি সম্পাদনা করতেন।", "source_attributed", "medium"),
  fact(529, "জওহরলাল নেহেরুর ভূমিকা (source statement)", "জওহরলাল নেহেরু স্বাধীন ভারতের প্রথম প্রধানমন্ত্রী ছিলেন।", "source_attributed", "high"),
  fact(529, "নেহেরু-ইন্দিরা সম্পর্ক (source statement)", "ইন্দিরা গান্ধী জওহরলাল নেহেরুর মেয়ে।", "source_attributed", "high"),
  fact(529, "নেহেরু-রাজীব সম্পর্ক (source-printed anomaly)", "উৎসে রাজীব গান্ধীকে জওহরলাল নেহেরুর 'দৌহিত্র' হিসেবে দেওয়া হয়েছে।", "source_attributed", "low"),
  fact(529, "মাদার তেরেসার জন্মস্থান ও বংশোদ্ভব", "মাদার তেরেসা স্কোপজে জন্মগ্রহণ করেন এবং তাঁর পরিবার আলবেনীয় বংশোদ্ভূত ছিল।", "verified", "high", [refs.nobelTeresaBio]),
  fact(529, "মাদার তেরেসার ভারতীয় নাগরিকত্ব (source statement)", "মাদার তেরেসা ১৯৪৮ সালে ভারতের নাগরিকত্ব লাভ করেন।", "source_attributed", "medium"),
  fact(529, "Missionaries of Charity", "মাদার তেরেসা ১৯৫০ সালে Missionaries of Charity প্রতিষ্ঠা করেন।", "verified", "high", [refs.nobelTeresaBio]),
  fact(529, "মাদার তেরেসার নোবেল শান্তি পুরস্কার", "মাদার তেরেসা ১৯৭৯ সালে নোবেল শান্তি পুরস্কার লাভ করেন।", "verified", "high", [refs.nobelTeresaPrize]),
  fact(529, "মাদার তেরেসার কলকাতায় মৃত্যু (source statement)", "মাদার তেরেসা পশ্চিমবঙ্গের কলকাতায় মৃত্যুবরণ করেন।", "source_attributed", "high"),
  fact(530, "ইন্দিরা গান্ধীর প্রধানমন্ত্রিত্ব (source statement)", "ইন্দিরা গান্ধী ভারতের তৃতীয় প্রধানমন্ত্রী ও প্রথম নারী প্রধানমন্ত্রী ছিলেন।", "source_attributed", "high"),
  fact(530, "মুক্তিযুদ্ধকালে ইন্দিরা গান্ধী (source statement)", "বাংলাদেশের মুক্তিযুদ্ধের সময় ইন্দিরা গান্ধী ভারতের প্রধানমন্ত্রী ছিলেন।", "source_attributed", "high"),
  fact(530, "ইন্দিরা গান্ধীর মৃত্যু (source statement)", "উৎসে বলা হয়েছে, ইন্দিরা গান্ধী ১৯৮৪ সালে নিজ দেহরক্ষী সাতওয়ান্ট সিং ও বি আন্ট সিং-এর গুলিতে নিহত হন।", "source_attributed", "low"),
  fact(530, "রাজীব গান্ধীর প্রধানমন্ত্রিত্ব (source statement)", "রাজীব গান্ধী ভারতের ষষ্ঠ প্রধানমন্ত্রী ছিলেন।", "source_attributed", "high"),
  fact(530, "রাজীব গান্ধী ও বফর্স (source statement)", "উৎসে রাজীব গান্ধীকে বফর্স কেলেঙ্কারির সঙ্গে যুক্ত ভারতীয় প্রধানমন্ত্রী বলা হয়েছে।", "source_attributed", "low"),
  fact(530, "রাজীব গান্ধীর হত্যাকাণ্ড", "রাজীব গান্ধী ২১ মে ১৯৯১ সালে LTTE-সংশ্লিষ্ট আত্মঘাতী বোমা হামলায় নিহত হন।", "verified", "high", [refs.adstRajiv]),
  fact(530, "রাজীব গান্ধী হত্যাকারীর পরিচয়", "Thenmozhi 'Gayatri' Rajaratnam নামের LTTE-সংশ্লিষ্ট নারী আত্মঘাতী বোমা হামলাকারী রাজীব গান্ধীকে হত্যা করেন।", "verified", "high", [refs.adstRajiv]),
  fact(530, "নলিনী সংক্রান্ত উৎস-বিবৃতি", "উৎসে রাজীব গান্ধী হত্যা মামলায় যাবজ্জীবন কারাদণ্ডপ্রাপ্ত আসামীর নাম নলিনী বলা হয়েছে।", "source_attributed", "medium"),
  fact(530, "এ.পি.জে. আব্দুল কালামের পরিচিতি (source statement)", "এ.পি.জে. আব্দুল কালাম বিখ্যাত পরমাণু বিজ্ঞানী ও ভারতের রাষ্ট্রপতি ছিলেন।", "source_attributed", "high"),
  fact(530, "এ.পি.জে. আব্দুল কালামের উপাধি (source statement)", "এ.পি.জে. আব্দুল কালাম 'মিসাইল ম্যান' নামে পরিচিত।", "source_attributed", "high"),
  fact(530, "অমর্ত্য সেনের পরিচিতি (source statement)", "অমর্ত্য সেন ভারতীয় বাঙালি অর্থনীতিবিদ ও দার্শনিক।", "source_attributed", "high"),
  fact(530, "অমর্ত্য সেনের পৈতৃক নিবাস (source statement)", "অমর্ত্য সেনের পৈতৃক নিবাস বাংলাদেশের মানিকগঞ্জ জেলায়।", "source_attributed", "medium"),
  fact(530, "অমর্ত্য সেনের অর্থনীতির নোবেল", "অমর্ত্য সেন ১৯৯৮ সালে অর্থনীতিতে নোবেল পুরস্কার লাভ করেন।", "verified", "high", [refs.nobelSen]),
  fact(530, "এশিয়ার প্রথম অর্থনীতির নোবেলজয়ী (source statement)", "উৎসে অমর্ত্য সেনকে অর্থনীতিতে এশিয়ার প্রথম নোবেলজয়ী বলা হয়েছে।", "source_attributed", "medium"),
  fact(531, "স্বাধীন ভারতের প্রথম রাষ্ট্রপতি (source statement)", "স্বাধীন ভারতের প্রথম রাষ্ট্রপতি ড. রাজেন্দ্র প্রসাদ (১৯৫০-১৯৬২)।", "source_attributed", "high"),
  fact(531, "ভারতের প্রথম মুসলিম রাষ্ট্রপতি (source statement)", "ভারতের প্রথম মুসলিম রাষ্ট্রপতি ড. জাকির হোসেন।", "source_attributed", "high"),
  fact(531, "ভারতের দ্বিতীয় মুসলিম রাষ্ট্রপতি (source statement)", "ভারতের দ্বিতীয় মুসলিম রাষ্ট্রপতি ফকরুদ্দিন আলী আহমদ।", "source_attributed", "high"),
  fact(531, "ভারতের প্রথম নারী রাষ্ট্রপতি (source statement)", "ভারতের প্রথম নারী রাষ্ট্রপতি প্রতিভা পাটিল।", "source_attributed", "high"),
  fact(531, "মুক্তিযুদ্ধকালে ভারতের রাষ্ট্রপতি (source statement)", "বাংলাদেশের মুক্তিযুদ্ধকালে ভারতের রাষ্ট্রপতি ছিলেন ভি. ভি. গিরি।", "source_attributed", "high"),
  fact(531, "প্রণব মুখার্জি (source statement)", "উৎসে প্রণব মুখার্জীকে ভারতের ১৩তম ও প্রথম বাঙালি রাষ্ট্রপতি বলা হয়েছে; ২০১২ সালে নির্বাচিত হন।", "source_attributed", "medium"),
  fact(531, "মনমোহন সিংয়ের মেয়াদ (source-printed conflicting date)", "উৎসে মনমোহন সিংকে প্রথম শিখ প্রধানমন্ত্রী এবং ২০০৮-২০১৪ মেয়াদের প্রধানমন্ত্রী বলা হয়েছে।", "conflicting", "medium", [refs.pmManmohan]),
  fact(531, "ভারতে মুসলিম প্রধানমন্ত্রী (source statement)", "উৎসে বলা হয়েছে, এখন পর্যন্ত ভারতে কোনো মুসলিম প্রধানমন্ত্রী হননি।", "source_attributed", "high"),
  fact(531, "বিজয় লক্ষ্মী পণ্ডিত (source statement)", "জাতিসংঘের প্রথম মহিলা সভাপত্রী ছিলেন বিজয় লক্ষ্মী পণ্ডিত।", "source_attributed", "high"),
  fact(531, "মাদার তেরেসা ও নারী নোবেল (source statement)", "উৎসে মাদার তেরেসাকে ভারতীয় একমাত্র নোবেল বিজয়ী নারী বলা হয়েছে।", "source_attributed", "medium"),
  fact(531, "সরোজিনী নাইডু ও কংগ্রেস (source statement)", "ভারতীয় জাতীয় কংগ্রেসের প্রথম নারী সভাপতি সরোজিনী নাইডু।", "source_attributed", "high"),
  fact(531, "সরোজিনী নাইডু ও গভর্নর পদ (source statement)", "ভারতের প্রথম প্রাদেশিক নারী রাষ্ট্রপাল (গভর্নর) ছিলেন সরোজিনী নাইডু।", "source_attributed", "high"),
  fact(532, "INC প্রতিষ্ঠাকাল (source statement)", "ভারতীয় জাতীয় কংগ্রেস (INC) প্রতিষ্ঠিত হয় ১৮৮৫ সালে।", "source_attributed", "high"),
  fact(532, "INC প্রতিষ্ঠাতা (source statement)", "উৎসে INC-এর প্রতিষ্ঠাতা আলেন অক্টেভিয়ান হিউম, দাদাভাই নওরোজি ও দিনেশ ওয়াচা।", "source_attributed", "medium"),
  fact(532, "BJP প্রতিষ্ঠাকাল (source statement)", "ভারতীয় জনতা পার্টি (BJP) প্রতিষ্ঠিত হয় ১৯৮০ সালে।", "source_attributed", "high"),
  fact(532, "BJP প্রতিষ্ঠাতা (source statement)", "উৎসে BJP-এর প্রতিষ্ঠাতা অটল বিহারী বাজপেয়ী।", "source_attributed", "medium"),
  fact(532, "স্বর্ণমন্দিরের অবস্থান (source statement)", "স্বর্ণমন্দির ভারতের পাঞ্জাব প্রদেশের অমৃতসর নগরীতে অবস্থিত শিখদের পবিত্র মন্দির।", "source_attributed", "high"),
  fact(532, "অপারেশন ব্লু স্টার (source statement)", "উৎসে ১৯৮৪ সালে ইন্দিরা সরকারের 'ব্লু স্টার' অভিযান এবং পরবর্তী শিখ ক্ষোভ/ইন্দিরা গান্ধীর মৃত্যুর সম্পর্ক বর্ণিত হয়েছে।", "source_attributed", "high"),
  fact(532, "শিখ ধর্মে গুরু নানক (source statement)", "শিখরা গুরু নানকের অনুসারী।", "source_attributed", "high"),
  fact(532, "শান্তিনিকেতনের অবস্থান (source statement)", "শান্তিনিকেতন পশ্চিমবঙ্গের বোলপুরে অবস্থিত একটি ছোট শহর।", "source_attributed", "high"),
  fact(532, "বিশ্বভারতী (source statement)", "রবীন্দ্রনাথ ঠাকুর শান্তিনিকেতনে বিশ্বভারতী নামে একটি বিদ্যালয় প্রতিষ্ঠা করেন।", "source_attributed", "high"),
  fact(532, "ভারতের রাজ্য সংখ্যা (source statement)", "মোট রাজ্য ২৮টি; সর্বশেষ রাজ্য তেলেঙ্গানা, ২০১৪ সালে।", "source_attributed", "high"),
  fact(532, "ভারতের কেন্দ্রশাসিত অঞ্চল সংখ্যা (source statement)", "উৎসে ভারতের কেন্দ্রশাসিত অঞ্চল ৮টি বলা হয়েছে।", "source_attributed", "medium"),
  fact(532, "জম্মু ও কাশ্মীর পুনর্গঠন (source statement)", "উৎসে বলা হয়েছে, ২০১৯ সালে জম্মু ও কাশ্মীরের বিশেষ মর্যাদা বাতিল করে জম্মু ও কাশ্মীর এবং লাদাখ নামে দুই কেন্দ্রশাসিত অঞ্চলে বিভক্ত করা হয়।", "source_attributed", "high", [refs.prsJk, refs.indiaCodeJk]),
  fact(533, "আয়তনে ভারতের বৃহত্তম রাজ্য (source map legend)", "আয়তনে ভারতের বৃহত্তম রাজ্য রাজস্থান।", "source_attributed", "low"),
  fact(533, "জনসংখ্যায় ভারতের বৃহত্তম রাজ্য (source map legend)", "জনসংখ্যায় ভারতের বৃহত্তম রাজ্য উত্তরপ্রদেশ।", "source_attributed", "low"),
  fact(533, "আয়তনে ভারতের ক্ষুদ্রতম রাজ্য (source map legend)", "আয়তনে ভারতের ক্ষুদ্রতম রাজ্য গোয়া।", "source_attributed", "low"),
  fact(533, "জনসংখ্যায় ভারতের ক্ষুদ্রতম রাজ্য (source map legend)", "জনসংখ্যায় ভারতের ক্ষুদ্রতম রাজ্য সিকিম।", "source_attributed", "low"),
  fact(533, "ফতেহপুর সিক্রি (source table)", "ফতেহপুর সিক্রি উত্তর প্রদেশে; উৎসে বলা হয়েছে সম্রাট আকবর এটিকে মুঘল সাম্রাজ্যের রাজধানী ঘোষণা করেন।", "source_attributed", "low"),
  fact(533, "তাজমহল (source table)", "তাজমহল উত্তর প্রদেশে; উৎসে বলা হয়েছে সম্রাট শাহজাহান এটি নির্মাণ করেন।", "source_attributed", "low"),
  fact(533, "বাবরি মসজিদ (source table)", "বাবরি মসজিদ উত্তর প্রদেশের অযোধ্যাতে; উৎসে এটি সম্রাট বাবরের নির্মাণ বলা হয়েছে।", "source_attributed", "low"),
  fact(533, "আলিগড় (source table)", "আলিগড় ভারতের উত্তর প্রদেশে অবস্থিত।", "source_attributed", "low"),
];

const notes = [
  note(529, "মহাত্মা গান্ধী ও জওহরলাল নেহেরু — উৎস প্যানেল", "ব্যক্তি | উৎসে প্রদত্ত তথ্য\nমহাত্মা গান্ধী | ভারতের জাতির জনক ও জাতীয়তাবাদী নেতা; খদ্দর, সত্যাগ্রহ, অহিংসা ও অসহযোগ আন্দোলনের সঙ্গে সংশ্লিষ্ট; রচনা: The Story of My Experiments with Truth\nজওহরলাল নেহেরু | স্বাধীন ভারতের প্রথম প্রধানমন্ত্রী; পিতা মতিলাল নেহেরু; মেয়ে ইন্দিরা গান্ধী; রচনা: An Autobiography এবং The Discovery of India\nসতর্কতা | উৎসে রাজীব গান্ধীর সম্পর্কের জন্য 'দৌহিত্র' শব্দটি রয়েছে; এই শব্দটি অপরিবর্তিতভাবে উৎস-অ্যানোমালি হিসেবে সংরক্ষিত।", "medium"),
  note(530, "এ.পি.জে. আব্দুল কালাম ও অমর্ত্য সেন — উৎস প্যানেল", "ব্যক্তি | উৎসে প্রদত্ত তথ্য\nএ.পি.জে. আব্দুল কালাম | 'মিসাইল ম্যান'; রচনা: Wings of Fire, My Journey, Turning Points; মুদ্রিত উক্তি: Dream is not that which you see while sleeping it is something that does not let you sleep.\nঅমর্ত্য সেন | ভারতীয় বাঙালি অর্থনীতিবিদ ও দার্শনিক; রচনা: Poverty and Famines, The Idea of Justice, Development as Freedom, Identity and Violence, Home in the World.\nসতর্কতা | উৎসে অমর্ত্য সেনকে অর্থনীতিতে এশিয়ার প্রথম নোবেলজয়ী বলা হয়েছে; বাহ্যিকভাবে এই বিস্তৃত তুলনামূলক দাবি যাচাই করা হয়নি।", "medium"),
  note(531, "ভারতীয় রাজনীতিতে পরিবারতন্ত্র — উৎস তালিকা", "সম্পর্ক | উৎসে প্রদত্ত তথ্য\nমতিলাল নেহেরু | ছেলে জওহরলাল নেহেরু\nজওহরলাল নেহেরু | মেয়ে ইন্দিরা গান্ধী\nইন্দিরা গান্ধী | স্বামী ফিরোজ গান্ধী; ছেলে রাজীব গান্ধী\nরাজীব গান্ধী | স্ত্রী সোনিয়া গান্ধী; সন্তান রাহুল গান্ধী ও প্রিয়াঙ্কা গান্ধী\nসোনিয়া গান্ধী | জন্মসূত্রে ইতালীয় নাগরিক (source statement)\nরাজনৈতিক-সময়সংবেদী বিষয় | উৎস-পৃষ্ঠার মাধ্যমে উৎস-অভিহিত, স্বতন্ত্র বর্তমান-রাজনীতি হিসেবে উপস্থাপিত নয়।", "medium"),
  note(532, "ভারতের বৃহত্তম দুই রাজনৈতিক দল — উৎস তুলনা", "বিষয় | ভারতীয় জাতীয় কংগ্রেস (INC) | ভারতীয় জনতা পার্টি (BJP)\nউৎসে প্রদত্ত প্রতিষ্ঠাকাল | ১৮৮৫ | ১৯৮০\nউৎসে প্রদত্ত প্রতিষ্ঠাতা | আলেন অক্টেভিয়ান হিউম, দাদাভাই নওরোজি ও দিনেশ ওয়াচা | অটল বিহারী বাজপেয়ী\nউৎসে প্রতীক | হাত/পাঞ্জা [visual reading; OCR spelling flagged] | পদ্মফুল\nসতর্কতা | দলীয় ইতিহাস, নেতৃত্ব, সদস্যতা ও রাজনৈতিক বর্ণনা সময়-সংবেদী; সব বর্ণনা উৎস-অভিহিত হিসেবে সংরক্ষিত।", "medium"),
  note(532, "ভারতের রাজ্য ও কেন্দ্রশাসিত অঞ্চল — উৎস তালিকা", "উৎসে রাজ্য | ২৮টি; সর্বশেষ তেলেঙ্গানা (২০১৪)\nউৎসে কেন্দ্রশাসিত অঞ্চল | দিল্লি; চণ্ডীগড়; জম্মু ও কাশ্মীর; লাদাখ; লাক্ষদ্বীপ; আন্দামান ও নিকোবর দ্বীপপুঞ্জ; দাদরা-নগর হাভেলি ও দমন-দিউ; পুদুচেরি\nজম্মু ও কাশ্মীরের উৎস-নোট | সংবিধানের ৩৭০ ও ৩৫(ক) অনুচ্ছেদের অধীনে বিশেষ মর্যাদার উল্লেখ; ২০১৯ সালের পুনর্গঠনে দুটি কেন্দ্রশাসিত অঞ্চল।\nসতর্কতা | সাংবিধানিক ও প্রশাসনিক বিষয়টি সময়-সংবেদী উৎস-তথ্য হিসেবে রাখা হয়েছে।", "medium"),
  note(533, "ভারতের ২৮টি রাজ্য — পর্যালোচিত মানচিত্রের পাঠ", "মানচিত্রে স্পষ্ট পাঠ | হিমাচল প্রদেশ, পাঞ্জাব, হরিয়ানা, উত্তরাখণ্ড, উত্তর প্রদেশ, বিহার, পশ্চিমবঙ্গ, সিকিম, অসম, মেঘালয়, ত্রিপুরা, মণিপুর, মিজোরাম, নাগাল্যান্ড, অরুণাচল প্রদেশ, রাজস্থান, মধ্য প্রদেশ, গুজরাট, মহারাষ্ট্র, ছত্তিশগড়, ওড়িশা, তেলেঙ্গানা, গোয়া, কর্ণাটক, অন্ধ্র প্রদেশ, তামিলনাডু, কেরালা।\nপৃষ্ঠার সীমাবদ্ধতা | মানচিত্রের কিছু নাম ঝাপসা/আংশিক এবং টেবিলের একাধিক সারির বাঁ-পাশ/ডান-পাশের সম্বন্ধ অনিশ্চিত; অনিশ্চিত নাম বা সারি থেকে পুনর্গঠিত দাবি তৈরি করা হয়নি।\nদৃশ্যমান শেষ-সারি | আনন্দপুর সাহিব, পাঞ্জাবের শিখ উপাসনালয়; হযরত বল মসজিদ, কাশ্মীরের একটি নবী মুহাম্মদ (স.)-সম্পর্কিত স্মৃতিচিহ্ন-উল্লেখ; শ্রীনগর, ভারতের উত্তরে।", "low"),
];

const tags = [
  ["india", "India", "domain", "Source-derived India GK reference material."],
  ["biography", "Biography", "content_type", "Source-derived biographical reference."],
  ["politics", "Politics", "domain", "Political or public-office reference material."],
  ["reference-table", "Reference table", "content_type", "Structured source material retained as a note."],
  ["map", "Map reference", "content_type", "Map-caption or map-derived source material."],
  ["source-attributed", "Source-attributed", "quality", "Source-preserved material without direct corroboration in this batch."],
  ["externally-verified", "Externally verified", "quality", "Claim directly corroborated by a cited external source."],
  ["conflicting", "Conflicting source claim", "quality", "Source wording is preserved while credible evidence documents a discrepancy."],
  ["time-sensitive", "Time-sensitive reference", "quality", "Political, constitutional, administrative, or population-sensitive material requiring future review."],
  ["low-confidence", "Low-confidence source reading", "quality", "Source reading is visibly incomplete or uncertain."],
];
const quality = record => record.status === "verified" ? "externally-verified" : record.status === "conflicting" ? "conflicting" : "source-attributed";

export async function buildBatch() {
  const pages = await Promise.all(files.map(file => fs.readFile(file, "utf8").then(JSON.parse)));
  const chapters = [[63, "ভারত", "india", "Source-preserved India overview, biographies, political reference, and map material.", 529]];
  const topics = [
    ["india", "ভারত পরিচিতি ও বিখ্যাত ব্যক্তিত্ব", "india-overview-personalities", 529, 1],
    ["india", "ভারতের বিখ্যাত ব্যক্তিত্ব", "india-notable-personalities", 530, 2],
    ["india", "ভারতের রাষ্ট্রপতি, প্রধানমন্ত্রী ও নারী অগ্রণী", "india-presidents-pm-society", 531, 3],
    ["india", "রাজনৈতিক দল, সংস্কৃতি ও প্রশাসনিক অঞ্চল", "india-parties-culture-administration", 532, 4],
    ["india", "ভারতের ২৮টি রাজ্য ও উল্লেখযোগ্য স্থান", "india-map-reference", 533, 5],
  ];
  const checks = [...facts.map(record => ({ kind: "fact", claim: record.fact_text, ...record })), ...notes.map(record => ({ kind: "note", claim: record.content, ...record }))];
  const audit = {
    batch_pages: BATCH_PAGES,
    pipeline_version: PIPELINE_VERSION,
    source_pages: pages.map(page => ({ page: page.source_page, review_status: page.review.review_status, image_sha256: page.source_image_sha256, overall_confidence: page.review.overall_confidence })),
    generated_facts: facts.length,
    generated_notes: notes.length,
    generated_mcqs: 0,
    generated_options: 0,
    generated_flashcards: facts.length + notes.length,
    verification_counts: { verified: checks.filter(record => record.status === "verified").length, conflicting: checks.filter(record => record.status === "conflicting").length, source_attributed: checks.filter(record => record.status === "source_attributed").length },
    source_anomalies: [
      "Physical PDF pages 529–533 retain printed book footers 472–476.",
      "Page 529 retains the source-printed Nehru/Rajiv relationship word দৌহিত্র as a low-confidence anomaly.",
      "Page 530 retains uncertain bodyguard, Bofors, bomb-assailant transliteration, and quotation punctuation rather than silently normalizing them.",
      "Page 531 source text printing Manmohan Singh’s term as 2008–2014 is explicitly preserved as conflicting; PM India records 2004–2014.",
      "Page 532 political, party, constitutional, and administrative content is time-sensitive and source-attributed.",
      "Page 533 is accepted with flags and low confidence; unreadable map labels and broken table alignments are not reconstructed into facts.",
    ],
    quality_gates: [
      "Exactly physical pages 529–533 are imported.",
      "All 25 ordered visual-review tiles were reviewed.",
      "Facts, structured notes, external verification, flashcards, search documents, and tags remain relationally distinct.",
      "Upserts are idempotent by canonical hash, page, and stable derived-record keys.",
    ],
  };
  const chapterSql = `INSERT INTO public.chapters (book_id,chapter_number,title,slug,description,source_page,display_order) SELECT b.id,x.n::integer,x.title,x.slug,x.description,x.page::integer,x.n::integer FROM (VALUES ${values(chapters)}) x(n,title,slug,description,page) JOIN public.books b ON b.title=${q(BOOK_TITLE)} WHERE NOT EXISTS (SELECT 1 FROM public.chapters c WHERE c.book_id=b.id AND c.slug=x.slug);`;
  const topicSql = `INSERT INTO public.topics (chapter_id,title,slug,description,source_page,display_order) SELECT c.id,x.title,x.slug,'Source-preserved material with explicit verification status.',x.page::integer,x.ord::integer FROM (VALUES ${values(topics)}) x(chapter_slug,title,slug,page,ord) JOIN public.chapters c ON c.slug=x.chapter_slug AND c.book_id=(SELECT id FROM public.books WHERE title=${q(BOOK_TITLE)} LIMIT 1) WHERE NOT EXISTS (SELECT 1 FROM public.topics t WHERE t.chapter_id=c.id AND t.slug=x.slug);`;
  const printedPages = { 529: 472, 530: 473, 531: 474, 532: 475, 533: 476 };
  const pagesSql = pages.map(page => {
    const context = ctx(page.source_page);
    const metadata = { source_image_sha256: page.source_image_sha256, extraction_model: page.model, review_status: page.review.review_status, corrections: page.review.corrections, unresolved_spans: page.review.unresolved_spans, accepted_content_tags: page.review.accepted_content_tags, physical_source_page: page.source_page, printed_book_page: printedPages[page.source_page], artifact_reported_page: page.transcription.source_page, visual_review_report: "/home/ubuntu/dontonyo/reports/batch-0529-0533_visual_review.md", external_verification_report: "/home/ubuntu/dontonyo/reports/batch-0529-0533_external_verification.md", page_number_mismatch: "Physical PDF page and printed source footer are separately preserved." };
    return `INSERT INTO public.source_pages (import_run_id,book_id,source_page,page_kind,raw_transcription,chapter_heading,topic_heading,confidence,extraction_method,model_name,notes,review_metadata) SELECT (SELECT id FROM public.import_runs WHERE pipeline_version=${q(PIPELINE_VERSION)} ORDER BY started_at DESC LIMIT 1),b.id,${page.source_page},'educational'::page_kind,${q(page.review.verified_transcript)},${q(context.chapterTitle)},${q(context.topicTitle)},${q(page.review.overall_confidence)}::confidence_level,'vision_ocr_with_image_grounded_review',${q(page.model)},'Quality-gated extraction with ordered tile review, source-preserved anomalies, and explicit verification statuses.',${json(metadata)} FROM public.books b WHERE b.title=${q(BOOK_TITLE)} AND NOT EXISTS (SELECT 1 FROM public.source_pages s WHERE s.book_id=b.id AND s.source_page=${page.source_page});`;
  }).join("\n");
  const factSql = `WITH d(page,chapter_slug,topic_slug,title,body,status,confidence,hash) AS (VALUES ${values(facts.map(record => [record.source_page, record.chapter, record.topic, record.title, record.fact_text, record.status, record.confidence, record.canonical_hash]))}) INSERT INTO public.gk_facts (book_id,chapter_id,topic_id,title,fact_text,explanation,source_page,source_section,source_excerpt,importance,confidence,canonical_hash) SELECT b.id,c.id,t.id,d.title,d.body,CASE d.status WHEN 'verified' THEN 'Direct external corroboration is recorded in the batch verification ledger.' WHEN 'conflicting' THEN 'The source wording is preserved; a cited record documents the conflict in the verification ledger.' ELSE 'Source-attributed material is retained with visual review and no silent factual update.' END,d.page::integer,d.title,d.body,3,d.confidence::confidence_level,d.hash FROM d JOIN public.books b ON b.title=${q(BOOK_TITLE)} JOIN public.chapters c ON c.book_id=b.id AND c.slug=d.chapter_slug JOIN public.topics t ON t.chapter_id=c.id AND t.slug=d.topic_slug ON CONFLICT (canonical_hash) DO UPDATE SET fact_text=EXCLUDED.fact_text,explanation=EXCLUDED.explanation,confidence=EXCLUDED.confidence;`;
  const noteSql = `WITH d(page,chapter_slug,topic_slug,title,body,confidence,hash) AS (VALUES ${values(notes.map(record => [record.source_page, record.chapter, record.topic, record.title, record.content, record.confidence, record.canonical_hash]))}) INSERT INTO public.gk_notes (book_id,chapter_id,topic_id,title,content,source_page,source_section,display_order,confidence,canonical_hash) SELECT b.id,c.id,t.id,d.title,d.body,d.page::integer,d.title,d.page::integer,d.confidence::confidence_level,d.hash FROM d JOIN public.books b ON b.title=${q(BOOK_TITLE)} JOIN public.chapters c ON c.book_id=b.id AND c.slug=d.chapter_slug JOIN public.topics t ON t.chapter_id=c.id AND t.slug=d.topic_slug ON CONFLICT (canonical_hash) DO UPDATE SET content=EXCLUDED.content,confidence=EXCLUDED.confidence;`;
  const tagSql = `INSERT INTO public.content_tags (slug,label,category,description) VALUES ${tags.map(row => `(${row.map(q).join(",")})`).join(",")} ON CONFLICT (slug) DO UPDATE SET label=EXCLUDED.label,category=EXCLUDED.category,description=EXCLUDED.description;\n${facts.map(record => {
    const assigned = ["india", quality(record), ...(record.source_page >= 531 && record.source_page <= 532 ? ["politics", "time-sensitive"] : []), ...(record.source_page === 533 ? ["map", "low-confidence"] : [])];
    return assigned.map(tag => `INSERT INTO public.content_tag_assignments (tag_id,entity_type,entity_id,source_page,confidence,assigned_by) SELECT t.id,'fact',f.id,${record.source_page},${q(record.confidence)}::confidence_level,'batch-0529-0533-quality-pipeline' FROM public.content_tags t JOIN public.gk_facts f ON f.canonical_hash=${q(record.canonical_hash)} WHERE t.slug=${q(tag)} ON CONFLICT DO NOTHING;`).join("\n");
  }).join("\n")}\n${notes.map(record => {
    const assigned = ["india", "reference-table", "source-attributed", ...(record.source_page >= 531 && record.source_page <= 532 ? ["politics", "time-sensitive"] : []), ...(record.source_page === 533 ? ["map", "low-confidence"] : [])];
    return assigned.map(tag => `INSERT INTO public.content_tag_assignments (tag_id,entity_type,entity_id,source_page,confidence,assigned_by) SELECT t.id,'note',n.id,${record.source_page},${q(record.confidence)}::confidence_level,'batch-0529-0533-quality-pipeline' FROM public.content_tags t JOIN public.gk_notes n ON n.canonical_hash=${q(record.canonical_hash)} WHERE t.slug=${q(tag)} ON CONFLICT DO NOTHING;`).join("\n");
  }).join("\n")}`;
  const recordId = (kind, key) => kind === "fact" ? `(SELECT id FROM public.gk_facts WHERE canonical_hash=${q(key)} LIMIT 1)` : `(SELECT id FROM public.gk_notes WHERE canonical_hash=${q(key)} LIMIT 1)`;
  const verificationSql = checks.map(record => `INSERT INTO public.fact_verifications (source_page,entity_type,entity_id,claim_text,normalized_claim,verification_status,confidence,verification_sources,audit_note) SELECT ${record.source_page},${q(record.kind)},${recordId(record.kind, record.canonical_hash)},${q(record.claim)},NULL,${q(record.status)},${q(record.confidence)}::confidence_level,${json(record.sources)},${q(record.status === "verified" ? "Direct external corroboration is listed in the batch verification ledger." : record.status === "conflicting" ? "The reviewed source text is preserved, and a cited official record documents the conflicting time range." : "Source-attributed record retained with image-grounded validation and explicit source linkage.")} WHERE NOT EXISTS (SELECT 1 FROM public.fact_verifications v WHERE v.entity_type=${q(record.kind)} AND v.entity_id=${recordId(record.kind, record.canonical_hash)} AND v.claim_text=${q(record.claim)});`).join("\n");
  const derivedSql = `INSERT INTO public.flashcards (subject_id,book_id,chapter_id,topic_id,front_text,back_text,source_type,source_id,source_key) SELECT (SELECT id FROM public.subjects ORDER BY created_at ASC LIMIT 1),f.book_id,f.chapter_id,f.topic_id,f.title,f.fact_text,'fact',f.id,'batch0529-0533:fact:'||f.id::text FROM public.gk_facts f WHERE f.source_page BETWEEN 529 AND 533 AND NOT EXISTS (SELECT 1 FROM public.flashcards c WHERE c.source_key='batch0529-0533:fact:'||f.id::text); INSERT INTO public.flashcards (subject_id,book_id,chapter_id,topic_id,front_text,back_text,source_type,source_id,source_key) SELECT (SELECT id FROM public.subjects ORDER BY created_at ASC LIMIT 1),n.book_id,n.chapter_id,n.topic_id,n.title,n.content,'note',n.id,'batch0529-0533:note:'||n.id::text FROM public.gk_notes n WHERE n.source_page BETWEEN 529 AND 533 AND NOT EXISTS (SELECT 1 FROM public.flashcards c WHERE c.source_key='batch0529-0533:note:'||n.id::text); INSERT INTO public.search_documents (entity_type,entity_id,title,body,english_metadata) SELECT 'fact',f.id,f.title,f.fact_text,'Status-marked India GK fact | source page '||f.source_page::text FROM public.gk_facts f WHERE f.source_page BETWEEN 529 AND 533 AND NOT EXISTS (SELECT 1 FROM public.search_documents d WHERE d.entity_type='fact' AND d.entity_id=f.id); INSERT INTO public.search_documents (entity_type,entity_id,title,body,english_metadata) SELECT 'note',n.id,n.title,n.content,'Structured source reference | source page '||n.source_page::text FROM public.gk_notes n WHERE n.source_page BETWEEN 529 AND 533 AND NOT EXISTS (SELECT 1 FROM public.search_documents d WHERE d.entity_type='note' AND d.entity_id=n.id);`;
  const sql = `-- Generated by prepare_validated_batch_0529_0533.mjs. Source pages 529–533 only.\nBEGIN;\nINSERT INTO public.import_runs (source_filename,source_sha256,pipeline_version,status,completed_at,audit) VALUES ('Jubayer''sgk.pdf',${q(hash(pages.map(page => page.source_image_sha256).join("|")))},${q(PIPELINE_VERSION)},'completed',now(),${json(audit)});\n${chapterSql}\n${topicSql}\n${pagesSql}\n${factSql}\n${noteSql}\n${tagSql}\n${verificationSql}\n${derivedSql}\nCOMMIT;`;
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
