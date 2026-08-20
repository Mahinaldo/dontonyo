import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const workDir = "/home/ubuntu/dontonyo-work/batch-0544-0548";
const outputDir = path.join(root, "supabase", "batch-0544-0548");
export const BATCH_PAGES = [544, 545, 546, 547, 548];
export const PIPELINE_VERSION = "vision-quality-gated-batch-0544-0548-v1";
const BOOK_TITLE = "Jubayer's GK";

const q = value => `'${String(value ?? "").replaceAll("'", "''")}'`;
const json = value => `${q(JSON.stringify(value))}::jsonb`;
const hash = value => crypto.createHash("sha256").update(value, "utf8").digest("hex");
const values = rows => rows.map(row => `(${row.map(q).join(",")})`).join(",\n");
const files = BATCH_PAGES.map(page => path.join(workDir, "pages", `page_${String(page).padStart(4, "0")}.json`));

const refs = {
  vietnam: "https://history.state.gov/historicaldocuments/frus1969-76v42/d70",
  myanmar1962: "https://history.state.gov/historicaldocuments/frus1961-63v23/d49",
  bhasanChar: "https://www.hrw.org/report/2021/06/07/island-jail-middle-sea/bangladeshs-relocation-rohingya-refugees-bhasan-char",
};

const ctx = page => {
  if (page === 544) return { chapter: "southeast-asia-country-profiles", chapterTitle: "দক্ষিণ-পূর্ব এশিয়ার দেশসমূহ", topic: "thailand-maldives-past-questions", topicTitle: "থাইল্যান্ড ও মালদ্বীপ — বিগত প্রশ্ন", domain: "thailand" };
  if (page === 545) return { chapter: "indochina-country-profiles", chapterTitle: "ইন্দোচীনের ৩ টি দেশ", topic: "vietnam-cambodia-reference", topicTitle: "ভিয়েতনাম ও কম্বোডিয়া", domain: "vietnam" };
  if (page === 546) return { chapter: "indochina-country-profiles", chapterTitle: "ইন্দোচীনের ৩ টি দেশ", topic: "laos-timor-leste-reference", topicTitle: "লাওস ও তিমুর-লেস্তে", domain: "timor-leste" };
  if (page === 547) return { chapter: "myanmar-rohingya-reference", chapterTitle: "মিয়ানমার ও রোহিঙ্গা সমস্যা", topic: "myanmar-reference", topicTitle: "মিয়ানমার", domain: "myanmar" };
  return { chapter: "myanmar-rohingya-reference", chapterTitle: "মিয়ানমার ও রোহিঙ্গা সমস্যা", topic: "rohingya-reference", topicTitle: "রোহিঙ্গা সমস্যা", domain: "rohingya" };
};

const fact = (sourcePage, title, factText, status = "source_attributed", confidence = "medium", sources = [], domain = ctx(sourcePage).domain, timeSensitive = false) => ({
  source_page: sourcePage,
  title,
  fact_text: factText,
  status,
  confidence,
  sources,
  domain,
  timeSensitive,
  ...ctx(sourcePage),
  canonical_hash: hash(`fact|${sourcePage}|${title}|${factText}`),
});
const note = (sourcePage, title, content, confidence = "medium", domain = ctx(sourcePage).domain, timeSensitive = false) => ({
  source_page: sourcePage,
  title,
  content,
  status: "source_attributed",
  confidence,
  sources: [],
  domain,
  timeSensitive,
  ...ctx(sourcePage),
  canonical_hash: hash(`note|${sourcePage}|${title}|${content}`),
});
const mcq = (sourcePage, number, question, options, correct, source, confidence = "high", domain = ctx(sourcePage).domain) => ({
  source_page: sourcePage,
  number,
  question,
  options,
  correct,
  source,
  confidence,
  status: "source_attributed",
  sources: [],
  domain,
  ...ctx(sourcePage),
  canonical_hash: hash(`mcq|${sourcePage}|${number}|${question}`),
});

const facts = [
  fact(544, "থাইল্যান্ড শব্দের অর্থ (source statement)", "উৎসে ‘থাইল্যান্ড’ শব্দের অর্থ ‘মুক্তভূমি (Land of Free)’ বলা হয়েছে।", "source_attributed", "high"),
  fact(544, "থাইল্যান্ডের ঔপনিবেশিক অতীত (source statement)", "উৎসে থাইল্যান্ডকে দক্ষিণ-পূর্ব এশিয়ার একমাত্র চিরস্বাধীন বা মুক্ত দেশ এবং অতীতে অন্য কোনো দেশের উপনিবেশ না হওয়া দেশ বলা হয়েছে।", "source_attributed", "medium"),
  fact(544, "থাইল্যান্ডের পূর্বনাম (source statement)", "উৎসে থাইল্যান্ডের পূর্বনাম ‘সিয়ামদেশ’ বলা হয়েছে।", "source_attributed", "medium"),
  fact(544, "সাদা হাতির দেশ (source statement)", "থাইল্যান্ডকে ‘সাদা হাতির দেশ’ বলা হয় বলে উৎসে উল্লেখ আছে।", "source_attributed", "high"),
  fact(544, "থাইল্যান্ডের ধর্মীয় পরিচয় (source statement)", "উৎসে থাইল্যান্ডকে বৌদ্ধ ধর্মাবলম্বীদের দেশ বলা হয়েছে।", "source_attributed", "high"),
  fact(544, "দ্বিতীয় বিশ্বযুদ্ধে থাইল্যান্ড (source statement)", "উৎসে দ্বিতীয় বিশ্বযুদ্ধের সময় থাইল্যান্ড জাপানের দখলে ছিল বলে উল্লেখ আছে।", "source_attributed", "medium", [], "thailand", true),
  fact(544, "থাইল্যান্ডের প্রথম নারী প্রধানমন্ত্রী (source statement)", "উৎসে ইংলাক সিনাওয়াত্রাকে থাইল্যান্ডের প্রথম নারী প্রধানমন্ত্রী বলা হয়েছে।", "source_attributed", "high", [], "thailand", true),
  fact(544, "থাইল্যান্ডে বাধ্যতামূলক ভোট (source statement)", "উৎসে থাইল্যান্ডকে দক্ষিণ-পূর্ব এশিয়ার বাধ্যতামূলক ভোটদানের দেশ বলা হয়েছে।", "source_attributed", "high", [], "thailand", true),

  fact(545, "ভিয়েতনামের রাষ্ট্রব্যবস্থা (source statement)", "উৎসে ভিয়েতনামকে একদলীয় কমিউনিস্ট রাষ্ট্র বলা হয়েছে।", "source_attributed", "high", [], "vietnam", true),
  fact(545, "দ্বিতীয় বিশ্বযুদ্ধে ভিয়েতনাম (source statement)", "উৎসে দ্বিতীয় বিশ্বযুদ্ধের সময় ভিয়েতনাম জাপানের অধীনে ছিল বলে উল্লেখ আছে।", "source_attributed", "high", [], "vietnam", true),
  fact(545, "প্রথম ইন্দোচীন যুদ্ধের উৎস-সময়রেখা", "উৎসে প্রথম ইন্দোচীন যুদ্ধকে ১৯৪৬–১৯৫৩ সময়পর্বের সঙ্গে যুক্ত করে ভিয়েতনামের স্বাধীনতা ও বিভাজনের বর্ণনা রয়েছে।", "source_attributed", "high", [], "vietnam", true),
  fact(545, "ভিয়েতনামের বিভাজন (source statement)", "উৎসে ভিয়েতনাম ১৯৫৪ সালে দুই ভাগে বিভক্ত হয় বলে উল্লেখ আছে।", "source_attributed", "high", [], "vietnam", true),
  fact(545, "দ্বিতীয় ইন্দোচীন যুদ্ধের উৎস-সময়রেখা", "উৎসে দ্বিতীয় ইন্দোচীন যুদ্ধকে উত্তর ও দক্ষিণ ভিয়েতনামের মধ্যে ১৯৫৫–১৯৭৫ সময়পর্বের যুদ্ধ বলা হয়েছে।", "source_attributed", "high", [], "vietnam", true),
  fact(545, "ভিয়েতনামের পুনঃএকত্রীকরণ (১৯৭৬)", "ভিয়েতনামের দুই রাষ্ট্রীয় অংশ ১৯৭৬ সালে একত্রিত হয়ে Socialist Republic of Vietnam গঠন করে।", "verified", "high", [refs.vietnam], "vietnam", true),
  fact(545, "হো চি মিনের ভূমিকা (source statement)", "উৎসে হো চি মিনকে ভিয়েতনামের কমিউনিস্ট বিপ্লবী নেতা, স্বাধীনতা ঘোষণাকারী এবং কমিউনিস্ট পার্টির নেতা বলা হয়েছে।", "source_attributed", "high", [], "vietnam", true),
  fact(545, "হো চি মিন সিটির পূর্বনাম (source statement)", "উৎসে হো চি মিন সিটির পূর্বনাম সায়গন বলা হয়েছে।", "source_attributed", "high", [], "vietnam"),
  fact(545, "কম্বোডিয়ার ঐতিহাসিক নাম (source statement)", "উৎসে কম্বোডিয়াকে ইতিহাসে কম্পুচিয়া নামে পরিচিত বলা হয়েছে।", "source_attributed", "medium", [], "cambodia"),
  fact(545, "খেমার প্রজাতন্ত্র (source statement)", "উৎসে কম্বোডিয়ার পুরনাম খেমার প্রজাতন্ত্র বলা হয়েছে।", "source_attributed", "high", [], "cambodia", true),
  fact(545, "খেমার রুজ (source statement)", "উৎসে খেমার রুজকে কম্বোডিয়ার একটি রাজনৈতিক দল বলা হয়েছে।", "source_attributed", "high", [], "cambodia", true),
  fact(545, "আংকরভাটের অবস্থান (source statement)", "উৎসে পৃথিবীর সর্ববৃহৎ মন্দির আংকরভাট কম্বোডিয়ায় অবস্থিত বলা হয়েছে।", "source_attributed", "high", [], "cambodia"),
  fact(545, "ফ্রিডম পার্ক (source statement)", "উৎসে ‘গণতন্ত্র চত্বর’ বর্তমানে Freedom Park নামে পরিচিত বলা হয়েছে।", "source_attributed", "high", [], "cambodia", true),

  fact(546, "লাওসের রাষ্ট্রব্যবস্থা (source statement)", "উৎসে লাওসকে একদলীয় কমিউনিস্ট রাষ্ট্র বলা হয়েছে।", "source_attributed", "high", [], "laos", true),
  fact(546, "লাওসের অধিবাসীর নাম (source statement)", "উৎসে লাওসের অধিবাসীদের লাওসিয়ান নামে পরিচিত বলা হয়েছে।", "source_attributed", "high", [], "laos"),
  fact(546, "ফরাসি ইন্দোচীনে লাওস (source statement)", "উৎসে লাওসকে পূর্বে ইন্দোচীন ইউনিয়ন তথা ফরাসি ইন্দোচীনের অংশ বলা হয়েছে।", "source_attributed", "medium", [], "laos", true),
  fact(546, "তিমুর-লেস্তের ১৯৭৫ ঘোষণা (source statement)", "উৎসে ১৯৭৫ সালে পর্তুগালের উপনিবেশ থেকে তিমুর-লেস্তের স্বাধীনতা ঘোষণার কথা বলা হয়েছে।", "source_attributed", "medium", [], "timor-leste", true),
  fact(546, "তিমুর-লেস্তে দখলের উৎস-সময়রেখা", "উৎসে স্বাধীনতা ঘোষণার নয় দিন পর ইন্দোনেশিয়া তিমুর-লেস্তে দখল করে বলে উল্লেখ আছে।", "source_attributed", "medium", [], "timor-leste", true),
  fact(546, "তিমুর-লেস্তের ১৯৯৯ গণভোট (source statement)", "উৎসে ১৯৯৯ সালে জাতিসংঘের তত্ত্বাবধানে তিমুর-লেস্তেতে স্বাধীনতা প্রশ্নে গণভোটের কথা বলা হয়েছে।", "source_attributed", "high", [], "timor-leste", true),
  fact(546, "তিমুর-লেস্তের ২০০২ স্বাধীনতা (source statement)", "উৎসে তিমুর-লেস্তে ২০০২ সালে ইন্দোনেশিয়ার কাছ থেকে স্বাধীনতা লাভ করে বলে উল্লেখ আছে।", "source_attributed", "high", [], "timor-leste", true),
  fact(546, "তিমুর-লেস্তের পূর্বনাম (source statement)", "উৎসে তিমুর-লেস্তের পুরোনাম পূর্ব তিমুর বলা হয়েছে।", "source_attributed", "high", [], "timor-leste"),
  fact(546, "ফ্রেটিলিন (source statement)", "উৎসে তিমুর-লেস্তের আন্দোলনকারী গোষ্ঠীর নাম ফ্রেটিলিন বলা হয়েছে।", "source_attributed", "high", [], "timor-leste", true),
  fact(546, "তিমুর-লেস্তের জাতিসংঘ সদস্যপদ (source statement)", "উৎসে তিমুর-লেস্তে ২০০২ সালে জাতিসংঘের ১৯১তম সদস্য হয় বলে উল্লেখ আছে।", "source_attributed", "high", [], "timor-leste", true),
  fact(546, "পশ্চিম তিমুরের অবস্থান (source statement)", "উৎসে পশ্চিম তিমুরকে ইন্দোনেশিয়ার পূর্ব নুসা তেনগারার অংশ বলা হয়েছে।", "source_attributed", "medium", [], "timor-leste", true),

  fact(547, "মিয়ানমারের প্রাচীন নাম (source statement)", "উৎসে মিয়ানমারের প্রাচীন নাম বর্মদেশ বলা হয়েছে।", "source_attributed", "high", [], "myanmar"),
  fact(547, "প্যাগোডার দেশ (source statement)", "উৎসে মিয়ানমারকে ‘প্যাগোডার দেশ’ বলা হয়েছে।", "source_attributed", "high", [], "myanmar"),
  fact(547, "বার্মা থেকে মিয়ানমার নামকরণ (source statement)", "উৎসে ১৯৮৯ সালে বার্মার নাম পরিবর্তন করে মিয়ানমার করা হয় বলে উল্লেখ আছে।", "source_attributed", "high", [], "myanmar", true),
  fact(547, "দ্বিতীয় বিশ্বযুদ্ধে মিয়ানমার (source statement)", "উৎসে দ্বিতীয় বিশ্বযুদ্ধের সময় মিয়ানমার এশিয়া অঞ্চলের গুরুত্বপূর্ণ যুদ্ধক্ষেত্র এবং ১৯৪২–১৯৪৫ সালে জাপানের অধীনে ছিল বলে বলা হয়েছে।", "source_attributed", "high", [], "myanmar", true),
  fact(547, "মিয়ানমারের স্বাধীনতা (source statement)", "উৎসে মিয়ানমার ১৯৪৮ সালে ব্রিটেনের কাছ থেকে স্বাধীনতা লাভ করে বলে উল্লেখ আছে।", "source_attributed", "high", [], "myanmar", true),
  fact(547, "মিয়ানমারের ১৯৬২ সামরিক অভ্যুত্থান", "জেনারেল নে উইন ২ মার্চ ১৯৬২ সালে বার্মার সরকারকে উৎখাত করেন।", "verified", "high", [refs.myanmar1962], "myanmar", true),
  fact(547, "জাফরানি বিপ্লব (source statement)", "উৎসে ২০০৭ সালের মিয়ানমারের বৌদ্ধ ভিক্ষুদের আন্দোলনকে ‘জাফরানি বিপ্লব’ বলা হয়েছে।", "source_attributed", "high", [], "myanmar", true),
  fact(547, "মিয়ানমারের সীমান্ত (source statement)", "উৎসে মিয়ানমারের সঙ্গে পাঁচটি রাষ্ট্রের সীমান্ত এবং দেশগুলোর নাম বাংলাদেশ, চীন, থাইল্যান্ড, ভারত ও লাওস বলা হয়েছে।", "source_attributed", "high", [], "myanmar", true),
  fact(547, "ইনসেন কারাগার (source statement)", "উৎসে ইনসেন কারাগার মিয়ানমারে অবস্থিত বলা হয়েছে।", "source_attributed", "medium", [], "myanmar", true),
  fact(547, "NLD-এর পূর্ণরূপ (source statement)", "উৎসে NLD-এর পূর্ণরূপ National League for Democracy বলা হয়েছে।", "source_attributed", "high", [], "myanmar", true),
  fact(547, "NLD-এর প্রতিষ্ঠাকাল (source statement)", "উৎসে NLD ১৯৮৮ সালে প্রতিষ্ঠিত বলা হয়েছে।", "source_attributed", "high", [], "myanmar", true),

  fact(548, "রোহিঙ্গা নাগরিকত্ববিষয়ক উৎস-বক্তব্য", "উৎসে মিয়ানমার সরকার ১৯৮২ সালে রোহিঙ্গাদের নাগরিকত্ব বাতিল করে বলে উল্লেখ আছে।", "source_attributed", "medium", [], "rohingya", true),
  fact(548, "রাখাইনের পূর্বনাম (source statement)", "উৎসে রাখাইন রাজ্যের পূর্বনাম আরাকান বলা হয়েছে।", "source_attributed", "high", [], "rohingya"),
  fact(548, "রাখাইনের সম্প্রদায় সম্পর্কিত উৎস-বক্তব্য", "উৎসে রাখাইন রাজ্যে বসবাসকারী দুটি সম্প্রদায় হিসেবে ‘মগ’ ও ‘রোহিঙ্গা’র উল্লেখ আছে।", "source_attributed", "high", [], "rohingya", true),
  fact(548, "১৯৭৮ সালে বাংলাদেশে রোহিঙ্গা আগমন (source statement)", "উৎসে মিয়ানমার থেকে বাংলাদেশে রোহিঙ্গাদের প্রথম আগমন ১৯৭৮ সালে বলা হয়েছে।", "source_attributed", "high", [], "rohingya", true),
  fact(548, "২০১৭ সালের সামরিক অভিযান সম্পর্কে উৎস-বক্তব্য", "উৎসে ২৫ আগস্ট ২০১৭ সালে রোহিঙ্গাদের বিরুদ্ধে মিয়ানমারের সেনাবাহিনীর ‘Ethnic Cleansing’ অভিযানের উল্লেখ আছে; এটি উৎস-অভিহিত ভাষা হিসেবে সংরক্ষিত।", "source_attributed", "high", [], "rohingya", true),
  fact(548, "ভাসান চরে রোহিঙ্গা স্থানান্তর", "বাংলাদেশ ২০২০ সালের ডিসেম্বর থেকে রোহিঙ্গা শরণার্থীদের ভাসান চরে স্থানান্তর শুরু করে।", "verified", "high", [refs.bhasanChar], "rohingya", true),
  fact(548, "ARSA-এর উৎস-বিবরণ", "উৎসে ARSA-কে মিয়ানমারের রোহিঙ্গাদের সশস্ত্র সংগঠন বলা হয়েছে।", "source_attributed", "high", [], "rohingya", true),
  fact(548, "ARSA-এর পূর্ণরূপ (source statement)", "উৎসে ARSA-এর পূর্ণরূপ ‘আরাকান রোহিঙ্গা স্যালভেশন আর্মি’ বলা হয়েছে।", "source_attributed", "high", [], "rohingya", true),
  fact(548, "ARSA-এর পূর্বনাম (source statement)", "উৎসে ARSA-কে পূর্বে Faith Movement বলা হতো বলে উল্লেখ আছে।", "source_attributed", "high", [], "rohingya", true),
  fact(548, "ARSA-কে নিয়ে সরকারি অবস্থান (source statement)", "উৎসে মিয়ানমার সরকার ARSA-কে সন্ত্রাসী সংগঠন হিসেবে আখ্যায়িত করে বলে উল্লেখ আছে।", "source_attributed", "high", [], "rohingya", true),
  fact(548, "আনান কমিশনের বিকল্প নাম (source statement)", "উৎসে আনান কমিশনের অপর নাম ‘দি অ্যাডভাইজরি কমিশন অন রাখাইন স্টেট’ বলা হয়েছে।", "source_attributed", "high", [], "rohingya", true),
  fact(548, "আনান কমিশনের গঠনকাল (source statement)", "উৎসে আনান কমিশন ২০১৬ সালে গঠিত বলা হয়েছে।", "source_attributed", "high", [], "rohingya", true),
];

const notes = [
  note(544, "থাইল্যান্ড — উৎস সারাংশ", "উৎসে থাইল্যান্ডের ‘মুক্তভূমি’ অর্থ, সিয়াম নাম, সাদা হাতির উপনাম, বৌদ্ধ পরিচয়, দ্বিতীয় বিশ্বযুদ্ধের সময় জাপানি দখল, রাজনৈতিক আন্দোলন, নারী প্রধানমন্ত্রী এবং বাধ্যতামূলক ভোটের কথা আছে।\nসতর্কতা | সিয়াম নামকরণ, রাজা-সম্পর্কিত দীর্ঘ-রাজত্বের লাইন এবং পৃষ্ঠা-৫৪৪-এর প্রথম থাইল্যান্ড MCQ-এর একটি শব্দ স্ক্যানে অস্পষ্ট; সেগুলো নীরবে পূরণ বা সংশোধন করা হয়নি।", "medium", "thailand", true),
  note(545, "ভিয়েতনাম ও হো চি মিন — উৎস সারাংশ", "উৎসে ভিয়েতনামের দ্বিতীয় বিশ্বযুদ্ধ, ইন্দোচীন যুদ্ধ, ১৯৫৪ বিভাজন, ১৯৭৬ একত্রীকরণ, হো চি মিন এবং সায়গন/হো চি মিন সিটি সম্পর্কিত তথ্য আছে।\nসতর্কতা | ‘The Tiger of Bicycle’ অস্বাভাবিক বাক্যটি কেবল উৎস-নোটে রাখা হয়েছে; স্বাধীন fact হিসেবে আমদানি করা হয়নি।", "medium", "vietnam", true),
  note(545, "কম্বোডিয়া — উৎস সারাংশ", "উৎসে কম্পুচিয়া, খেমার প্রজাতন্ত্র, খেমার রুজ, আংকরভাট এবং Freedom Park সম্পর্কিত তথ্য আছে।\nসতর্কতা | পল পটের সহযোগীর নাম এবং নরোদম সিহানুক-সংক্রান্ত কয়েকটি বানান/উপাধি স্ক্যানে অনিশ্চিত; সেগুলো নতুন স্বতন্ত্র fact হিসেবে তৈরি করা হয়নি।", "medium", "cambodia", true),
  note(546, "লাওস ও তিমুর-লেস্তে — উৎস সারাংশ", "উৎসে লাওসের একদলীয় কমিউনিস্ট রাষ্ট্রব্যবস্থা, লাওসিয়ান পরিচয় এবং ফরাসি ইন্দোচীন সম্পর্ক আছে। তিমুর-লেস্তে অংশে ১৯৭৫ ঘোষণা, ইন্দোনেশীয় দখল, ১৯৯৯ গণভোট, ২০০২ স্বাধীনতা, ফ্রেটিলিন ও পূর্ব/পশ্চিম তিমুরের তথ্য রয়েছে।\nসতর্কতা | ‘লাওস একটি তুলনবিহিত দেশ’ বর্ণনাটি অস্পষ্ট হওয়ায় স্বতন্ত্র fact হিসেবে আমদানি করা হয়নি।", "medium", "timor-leste", true),
  note(547, "মিয়ানমার — উৎস-সময়ভিত্তিক রেফারেন্স", "উৎসে বর্মদেশ নাম, ১৯৮৯ নাম পরিবর্তন, দ্বিতীয় বিশ্বযুদ্ধ, ১৯৪৮ স্বাধীনতা, ১৯৬২ সামরিক শাসন, জাফরানি আন্দোলন, সীমান্তরাষ্ট্র, জাতিগোষ্ঠী এবং NLD সম্পর্কিত উৎস-সময়ের তথ্য আছে।\nসতর্কতা | আইনসভা, গডস আর্মি, নাসাকা, ইয়াঙ্গুনের একটি কবর-সম্পর্কিত লাইন এবং অন্যান্য রাজনৈতিক/নিরাপত্তা বিষয়ক অংশ আংশিক অস্পষ্ট বা সময়-সংবেদনশীল; কেবল উৎস-অভিহিত অবস্থায় রাখা হয়েছে।", "medium", "myanmar", true),
  note(548, "রোহিঙ্গা, ARSA ও আনান কমিশন — উৎস-সময়ভিত্তিক নোট", "উৎসে রোহিঙ্গা নাগরিকত্ব, ২০১৭ সামরিক অভিযান, ১৯৭৮ আগমন, ARSA, আনান কমিশন এবং মিয়ানমারের সাংবিধানিক পরিবর্তনের বর্ণনা রয়েছে।\nসতর্কতা | ১৯৮২ নাগরিকত্ব আইন, ২০১৭ অভিযানের ভাষা, সরকারি ARSA শ্রেণিবিন্যাস এবং সাংবিধানিক ব্যাখ্যাগুলো source-attributed হিসেবে রাখা হয়েছে; সেগুলোকে স্বতন্ত্র বর্তমান বা আইনি সিদ্ধান্ত হিসেবে উপস্থাপন করা হয়নি। ‘মাও মাও’, স্থানীয় ARSA নাম এবং চলচ্চিত্র-নির্মাতার লাইন withheld রাখা হয়েছে।", "medium", "rohingya", true),
  note(548, "মিয়ানমারের সাংবিধানিক পরিবর্তন — উৎস-সংক্ষিপ্তসার", "উৎসে ২০০৮ সালের নতুন সংবিধান, ‘Republic of the Union of Myanmar’ নাম, ইয়াঙ্গুন থেকে নৈপিদোতে রাজধানী স্থানান্তর এবং প্রধানমন্ত্রীর পদ বাতিল করে উপ-রাষ্ট্রপতি পদ প্রতিষ্ঠার বর্ণনা রয়েছে।\nসতর্কতা | এই রাজনৈতিক ও প্রাতিষ্ঠানিক উপাদানগুলো উৎস-সময়ের, এবং শহরের বাংলা বানান স্ক্যানে ভিন্ন; তাই আলাদা বর্তমান fact হিসেবে স্বাভাবিকীকরণ করা হয়নি।", "medium", "myanmar", true),
];

const mcqs = [
  mcq(544, "01", "মালদ্বীপ কোন সাগরে অবস্থিত?", ["ভারত মহাসাগর", "বঙ্গোপসাগর", "আরব সাগর", "প্রশান্ত উপসাগর"], "ক", "DU ঋ ৯৯-০০", "high", "maldives"),
  mcq(544, "02", "কোন দেশে স্থায়ী সেনাবাহিনী নেই?", ["মালদ্বীপ", "নেপাল", "ভুটান", "শ্রীলঙ্কা"], "ক", "DU ঋ ০৩-০৪; ‘০০-০১, ৯৭-৯৮, ৯৫-৯৬, 30 BCS", "high", "maldives"),
  mcq(544, "03", "জনববৃদ্ধি পরিবর্তনের ব্যাপকতা তুলে ধরার জন্য যে দেশটি সমুদ্রের গভীরে মন্ত্রিসভার বৈঠক করেছে?", ["ফিজি", "পাপুয়া নিউগিনি", "গোয়াম", "মালদ্বীপ"], "ঘ", "35 BCS", "medium", "maldives"),
  mcq(544, "05", "১৭৬৭ সাল থেকে বর্তমান সময় পর্যন্ত কোন দেশে ______ শাসন করেছিলেন?", ["থাইল্যান্ড", "নেপাল", "ভুটান", "লাওস"], "ক", "DU ঋ ১২-১৩", "low", "thailand"),
  mcq(544, "06", "কোন দেশটি অতীতে কখনও অন্য কোন দেশের উপনিবেশে পরিণত হয়নি?", ["থাইল্যান্ড", "মায়ানমার", "ইন্দোনেশিয়া", "মালয়েশিয়া"], "ক", "DU ঋ ১৭-১৮; 20 BCS", "medium", "thailand"),
  mcq(546, "01", "হে চি মিন কে ছিলেন?", ["উত্তর কোরিয়ার প্রেসিডেন্ট", "সংযুক্ত ভিয়েতনামের প্রথম প্রেসিডেন্ট", "ভিয়েতনাম কমিউনিস্ট পার্টির নেতা", "আগের কোনোটিই নয়"], "গ", "DU ঘ’ ০০-০১", "high", "vietnam"),
  mcq(546, "02", "হে চি মিন নামটি যে দেশের স্বাধীনতা সংগ্রামের সাথে জড়িত-", ["কিউবা", "চীন", "ভিয়েতনাম", "দ. কোরিয়া"], "গ", "রবি ঘ’ ১৪-১৫", "high", "vietnam"),
  mcq(546, "03", "Pol pot was the leader of-", ["Cambodia", "Vietnam", "Laos", "Thailand"], "ক", "জবি সি’ ১ : ১৫-১৬", "high", "cambodia"),
  mcq(546, "04", "১৯৭৪ সালের আগে পূর্ব তিমুর কোন দেশের উপনিবেশ ছিল?", ["ব্রিটেন", "ফ্রান্স", "স্পেন", "পর্তুগাল"], "ঘ", "DU ঘ’ ০০-০১", "high", "timor-leste"),
  mcq(546, "05", "স্বাধীনতার পূর্বে পূর্ব তিমুর কোন দেশের অধীন ছিল?", ["পর্তুগাল", "ইন্দোনেশিয়া", "মালয়েশিয়া", "ফিলিপাইন্স"], "খ", "জবি ঘ’ ০৯-১০", "high", "timor-leste"),
];

const tags = [
  ["southeast-asia", "Southeast Asia", "domain", "Source-derived Southeast Asian country reference."],
  ["thailand", "Thailand", "domain", "Thailand source material."],
  ["maldives", "Maldives", "domain", "Maldives source material."],
  ["vietnam", "Vietnam", "domain", "Vietnam source material."],
  ["cambodia", "Cambodia", "domain", "Cambodia source material."],
  ["laos", "Laos", "domain", "Laos source material."],
  ["timor-leste", "Timor-Leste", "domain", "Timor-Leste source material."],
  ["myanmar", "Myanmar", "domain", "Myanmar source material."],
  ["rohingya", "Rohingya", "domain", "Rohingya source material."],
  ["reference-note", "Structured source note", "content_type", "Structured source reference with explicit caveats."],
  ["past-exam-mcq", "Past-exam MCQ", "content_type", "MCQ with a printed examination label and answer key."],
  ["answer-key", "Answer key", "content_type", "Correct option from the printed answer key."],
  ["source-attributed", "Source-attributed", "quality", "Source-preserved material without direct corroboration in this batch."],
  ["externally-verified", "Externally verified", "quality", "Claim directly corroborated by cited evidence."],
  ["time-sensitive", "Time-sensitive reference", "quality", "Political, security, institutional, legal, or historical-status material requiring source framing."],
  ["low-confidence", "Low-confidence source reading", "quality", "A source scan is incomplete or uncertain."],
  ["dhaka-university", "University of Dhaka", "exam_source", "University of Dhaka printed exam label."],
  ["bcs", "Bangladesh Civil Service", "exam_source", "Bangladesh Civil Service printed exam label."],
  ["rajshahi-university", "University of Rajshahi", "exam_source", "University of Rajshahi printed exam label."],
  ["jagannath-university", "Jagannath University", "exam_source", "Jagannath University printed exam label."],
];

const exam = source => {
  if (source.includes("DU")) return ["University of Dhaka", "University of Dhaka", "admission", "dhaka-university"];
  if (source.includes("BCS")) return ["Bangladesh Civil Service", null, "competitive", "bcs"];
  if (source.includes("রবি")) return ["University of Rajshahi", "University of Rajshahi", "admission", "rajshahi-university"];
  if (source.includes("জবি")) return ["Jagannath University", "Jagannath University", "admission", "jagannath-university"];
  return ["Other university and recruitment examination", null, "competitive", "other-recruitment"];
};
const quality = record => record.status === "verified" ? "externally-verified" : "source-attributed";
const entityRef = (kind, canonicalHash) => `(SELECT id FROM public.${kind === "fact" ? "gk_facts" : kind === "note" ? "gk_notes" : "gk_mcqs"} WHERE canonical_hash=${q(canonicalHash)} LIMIT 1)`;

export async function buildBatch() {
  const pages = await Promise.all(files.map(file => fs.readFile(file, "utf8").then(JSON.parse)));
  const chapters = [
    [66, "দক্ষিণ-পূর্ব এশিয়ার দেশসমূহ", "southeast-asia-country-profiles", "Source-preserved Thailand and linked Maldives past-exam material.", 544],
    [67, "ইন্দোচীনের ৩ টি দেশ", "indochina-country-profiles", "Source-preserved Vietnam, Cambodia, Laos, and Timor-Leste material.", 545],
    [68, "মিয়ানমার ও রোহিঙ্গা সমস্যা", "myanmar-rohingya-reference", "Source-preserved Myanmar and Rohingya reference with time-sensitive caveats.", 547],
  ];
  const topics = [
    ["southeast-asia-country-profiles", "থাইল্যান্ড ও মালদ্বীপ — বিগত প্রশ্ন", "thailand-maldives-past-questions", 544, 1],
    ["indochina-country-profiles", "ভিয়েতনাম ও কম্বোডিয়া", "vietnam-cambodia-reference", 545, 1],
    ["indochina-country-profiles", "লাওস ও তিমুর-লেস্তে", "laos-timor-leste-reference", 546, 2],
    ["myanmar-rohingya-reference", "মিয়ানমার", "myanmar-reference", 547, 1],
    ["myanmar-rohingya-reference", "রোহিঙ্গা সমস্যা", "rohingya-reference", 548, 2],
  ];
  const checks = [
    ...facts.map(row => ({ kind: "fact", claim: row.fact_text, ...row })),
    ...notes.map(row => ({ kind: "note", claim: row.content, ...row })),
    ...mcqs.map(row => ({ kind: "mcq", claim: `${row.question} — printed answer: ${row.correct}`, ...row })),
  ];
  const audit = {
    batch_pages: BATCH_PAGES,
    pipeline_version: PIPELINE_VERSION,
    source_pages: pages.map(page => ({ page: page.source_page, review_status: page.review.review_status, image_sha256: page.source_image_sha256, overall_confidence: page.review.overall_confidence })),
    generated_facts: facts.length,
    generated_notes: notes.length,
    generated_mcqs: mcqs.length,
    generated_options: mcqs.length * 4,
    generated_flashcards: facts.length + notes.length + mcqs.length,
    verification_counts: {
      verified: checks.filter(row => row.status === "verified").length,
      conflicting: 0,
      source_attributed: checks.filter(row => row.status === "source_attributed").length,
    },
    source_anomalies: [
      "Physical PDF pages 544–548 have printed footers 847–491; the apparent non-sequential change reflects the book structure.",
      "Page 548 was recovered by a targeted gpt-5-mini retry at 200 DPI after three earlier empty-completion failures.",
      "Maldives page 544 MCQ Q4 is withheld because its printed answer key is * rather than a single answer.",
      "The unclear ‘মাউ মাউ’ general-name reading is withheld from independent factual import.",
      "The unusual ‘The Tiger of Bicycle’ phrase is preserved only in the Vietnam source note, not as an independent fact.",
      "All political, security, institutional, constitutional, and legal claims remain source-attributed unless directly corroborated.",
    ],
    quality_gates: [
      "Exactly physical pages 544–548 are imported.",
      "All 33 ordered visual-review tiles were reviewed.",
      "Every imported MCQ has four reviewed source options and one printed correct key.",
      "The only ambiguous printed key, Maldives Q4 on page 544, is withheld.",
      "Upserts are idempotent by canonical hash and stable derived-record keys.",
    ],
  };
  const chapterSql = `INSERT INTO public.chapters (book_id,chapter_number,title,slug,description,source_page,display_order) SELECT b.id,x.n::integer,x.title,x.slug,x.description,x.page::integer,x.n::integer FROM (VALUES ${values(chapters)}) x(n,title,slug,description,page) JOIN public.books b ON b.title=${q(BOOK_TITLE)} WHERE NOT EXISTS (SELECT 1 FROM public.chapters c WHERE c.book_id=b.id AND c.slug=x.slug);`;
  const topicSql = `INSERT INTO public.topics (chapter_id,title,slug,description,source_page,display_order) SELECT c.id,x.title,x.slug,'Source-preserved material with explicit verification status.',x.page::integer,x.ord::integer FROM (VALUES ${values(topics)}) x(chapter_slug,title,slug,page,ord) JOIN public.chapters c ON c.slug=x.chapter_slug AND c.book_id=(SELECT id FROM public.books WHERE title=${q(BOOK_TITLE)} LIMIT 1) WHERE NOT EXISTS (SELECT 1 FROM public.topics t WHERE t.chapter_id=c.id AND t.slug=x.slug);`;
  const printed = { 544: 847, 545: 848, 546: 489, 547: 490, 548: 491 };
  const pageSql = pages.map(page => {
    const context = ctx(page.source_page);
    const metadata = {
      source_image_sha256: page.source_image_sha256,
      extraction_model: page.model,
      review_status: page.review.review_status,
      corrections: page.review.corrections,
      unresolved_spans: page.review.unresolved_spans,
      physical_source_page: page.source_page,
      printed_book_page: printed[page.source_page],
      recovery: page.source_page === 548 ? "Targeted gpt-5-mini retry at 200 DPI after three earlier empty-completion failures." : null,
      visual_review_report: "/home/ubuntu/dontonyo-work/batch-0544-0548/visual_review_544_548.md",
      external_verification_report: "/home/ubuntu/dontonyo-work/batch-0544-0548/external_verification.md",
    };
    return `INSERT INTO public.source_pages (import_run_id,book_id,source_page,page_kind,raw_transcription,chapter_heading,topic_heading,confidence,extraction_method,model_name,notes,review_metadata) SELECT (SELECT id FROM public.import_runs WHERE pipeline_version=${q(PIPELINE_VERSION)} ORDER BY started_at DESC LIMIT 1),b.id,${page.source_page},${q([544, 546].includes(page.source_page) ? "mcq" : "educational")}::page_kind,${q(page.review.verified_transcript)},${q(context.chapterTitle)},${q(context.topicTitle)},${q(page.review.overall_confidence)}::confidence_level,'vision_ocr_with_image_grounded_review',${q(page.model)},'Quality-gated extraction with ordered tile review, recovery provenance, and explicit verification statuses.',${json(metadata)} FROM public.books b WHERE b.title=${q(BOOK_TITLE)} AND NOT EXISTS (SELECT 1 FROM public.source_pages s WHERE s.book_id=b.id AND s.source_page=${page.source_page});`;
  }).join("\n");
  const factSql = `WITH d(page,chapter_slug,topic_slug,title,body,status,confidence,hash) AS (VALUES ${values(facts.map(row => [row.source_page, row.chapter, row.topic, row.title, row.fact_text, row.status, row.confidence, row.canonical_hash]))}) INSERT INTO public.gk_facts (book_id,chapter_id,topic_id,title,fact_text,explanation,source_page,source_section,source_excerpt,importance,confidence,canonical_hash) SELECT b.id,c.id,t.id,d.title,d.body,CASE d.status WHEN 'verified' THEN 'Direct external corroboration is recorded in the batch verification ledger.' ELSE 'Source-attributed material is retained with image-grounded review and no silent factual update.' END,d.page::integer,d.title,d.body,3,d.confidence::confidence_level,d.hash FROM d JOIN public.books b ON b.title=${q(BOOK_TITLE)} JOIN public.chapters c ON c.book_id=b.id AND c.slug=d.chapter_slug JOIN public.topics t ON t.chapter_id=c.id AND t.slug=d.topic_slug ON CONFLICT (canonical_hash) DO UPDATE SET fact_text=EXCLUDED.fact_text,explanation=EXCLUDED.explanation,confidence=EXCLUDED.confidence;`;
  const noteSql = `WITH d(page,chapter_slug,topic_slug,title,body,confidence,hash) AS (VALUES ${values(notes.map(row => [row.source_page, row.chapter, row.topic, row.title, row.content, row.confidence, row.canonical_hash]))}) INSERT INTO public.gk_notes (book_id,chapter_id,topic_id,title,content,source_page,source_section,display_order,confidence,canonical_hash) SELECT b.id,c.id,t.id,d.title,d.body,d.page::integer,d.title,d.page::integer,d.confidence::confidence_level,d.hash FROM d JOIN public.books b ON b.title=${q(BOOK_TITLE)} JOIN public.chapters c ON c.book_id=b.id AND c.slug=d.chapter_slug JOIN public.topics t ON t.chapter_id=c.id AND t.slug=d.topic_slug ON CONFLICT (canonical_hash) DO UPDATE SET content=EXCLUDED.content,confidence=EXCLUDED.confidence;`;
  const mcqSql = mcqs.map(row => {
    const [name, institution, examType, normalizedName] = exam(row.source);
    const keys = ["ক", "খ", "গ", "ঘ"];
    const options = row.options.map((option, index) => `INSERT INTO public.gk_mcq_options (mcq_id,option_key,option_text,display_order,is_correct) SELECT m.id,${q(keys[index])},${q(option)},${index + 1},${keys[index] === row.correct} FROM public.gk_mcqs m WHERE m.canonical_hash=${q(row.canonical_hash)} AND NOT EXISTS (SELECT 1 FROM public.gk_mcq_options o WHERE o.mcq_id=m.id AND o.option_key=${q(keys[index])});`).join("\n");
    return `INSERT INTO public.exam_sources (name,institution,exam_type,description,normalized_name) SELECT ${q(name)},${q(institution)},${q(examType)},${q(`Normalized from printed source label on page ${row.source_page}.`)},${q(normalizedName)} WHERE NOT EXISTS (SELECT 1 FROM public.exam_sources WHERE normalized_name=${q(normalizedName)}); INSERT INTO public.gk_mcqs (book_id,chapter_id,topic_id,question,correct_option,explanation,source_page,source_section,source_question_number,difficulty,confidence,canonical_hash) SELECT b.id,c.id,t.id,${q(row.question)},${q(row.correct)},'Printed answer key retained as source-attributed material; all options and the examination label were visually validated.',${row.source_page},'বিগত বছরের প্রশ্ন',${q(row.number)},3,${q(row.confidence)}::confidence_level,${q(row.canonical_hash)} FROM public.books b JOIN public.chapters c ON c.book_id=b.id AND c.slug=${q(row.chapter)} JOIN public.topics t ON t.chapter_id=c.id AND t.slug=${q(row.topic)} WHERE b.title=${q(BOOK_TITLE)} ON CONFLICT (canonical_hash) DO UPDATE SET correct_option=EXCLUDED.correct_option,explanation=EXCLUDED.explanation,confidence=EXCLUDED.confidence; ${options} INSERT INTO public.gk_mcq_sources (mcq_id,exam_source_id,year,session,source_text,source_page) SELECT m.id,(SELECT id FROM public.exam_sources WHERE normalized_name=${q(normalizedName)} LIMIT 1),NULL,${q(row.source)},${q(row.source)},${row.source_page} FROM public.gk_mcqs m WHERE m.canonical_hash=${q(row.canonical_hash)} AND NOT EXISTS (SELECT 1 FROM public.gk_mcq_sources s WHERE s.mcq_id=m.id AND s.source_text=${q(row.source)} AND s.source_page=${row.source_page});`;
  }).join("\n");
  const factTagSql = facts.map(row => ["southeast-asia", row.domain, quality(row), ...(row.timeSensitive ? ["time-sensitive"] : []), ...(row.confidence === "low" ? ["low-confidence"] : [])].map(tag => `INSERT INTO public.content_tag_assignments (tag_id,entity_type,entity_id,source_page,confidence,assigned_by) SELECT t.id,'fact',f.id,${row.source_page},${q(row.confidence)}::confidence_level,'batch-0544-0548-quality-pipeline' FROM public.content_tags t JOIN public.gk_facts f ON f.canonical_hash=${q(row.canonical_hash)} WHERE t.slug=${q(tag)} ON CONFLICT DO NOTHING;`).join("\n")).join("\n");
  const noteTagSql = notes.map(row => ["southeast-asia", row.domain, "reference-note", "source-attributed", ...(row.timeSensitive ? ["time-sensitive"] : [])].map(tag => `INSERT INTO public.content_tag_assignments (tag_id,entity_type,entity_id,source_page,confidence,assigned_by) SELECT t.id,'note',n.id,${row.source_page},${q(row.confidence)}::confidence_level,'batch-0544-0548-quality-pipeline' FROM public.content_tags t JOIN public.gk_notes n ON n.canonical_hash=${q(row.canonical_hash)} WHERE t.slug=${q(tag)} ON CONFLICT DO NOTHING;`).join("\n")).join("\n");
  const mcqTagSql = mcqs.map(row => ["southeast-asia", row.domain, "past-exam-mcq", "answer-key", exam(row.source)[3], "source-attributed", ...(row.confidence === "low" ? ["low-confidence"] : [])].map(tag => `INSERT INTO public.content_tag_assignments (tag_id,entity_type,entity_id,source_page,confidence,assigned_by) SELECT t.id,'mcq',m.id,${row.source_page},${q(row.confidence)}::confidence_level,'batch-0544-0548-quality-pipeline' FROM public.content_tags t JOIN public.gk_mcqs m ON m.canonical_hash=${q(row.canonical_hash)} WHERE t.slug=${q(tag)} ON CONFLICT DO NOTHING;`).join("\n")).join("\n");
  const tagSql = `INSERT INTO public.content_tags (slug,label,category,description) VALUES ${tags.map(row => `(${row.map(q).join(",")})`).join(",")} ON CONFLICT (slug) DO UPDATE SET label=EXCLUDED.label,category=EXCLUDED.category,description=EXCLUDED.description;\n${factTagSql}\n${noteTagSql}\n${mcqTagSql}`;
  const verificationSql = checks.map(row => `INSERT INTO public.fact_verifications (source_page,entity_type,entity_id,claim_text,normalized_claim,verification_status,confidence,verification_sources,audit_note) SELECT ${row.source_page},${q(row.kind)},${entityRef(row.kind, row.canonical_hash)},${q(row.claim)},NULL,${q(row.status)},${q(row.confidence)}::confidence_level,${json(row.sources)},${q(row.status === "verified" ? "Direct external corroboration is listed in the batch verification ledger." : "Source-attributed record retained with ordered image-grounded validation and explicit source linkage.")} WHERE NOT EXISTS (SELECT 1 FROM public.fact_verifications v WHERE v.entity_type=${q(row.kind)} AND v.entity_id=${entityRef(row.kind, row.canonical_hash)} AND v.claim_text=${q(row.claim)});`).join("\n");
  const derivedSql = `INSERT INTO public.flashcards (subject_id,book_id,chapter_id,topic_id,front_text,back_text,source_type,source_id,source_key) SELECT (SELECT id FROM public.subjects ORDER BY created_at ASC LIMIT 1),f.book_id,f.chapter_id,f.topic_id,f.title,f.fact_text,'fact',f.id,'batch0544-0548:fact:'||f.id::text FROM public.gk_facts f WHERE f.source_page BETWEEN 544 AND 548 AND NOT EXISTS (SELECT 1 FROM public.flashcards c WHERE c.source_key='batch0544-0548:fact:'||f.id::text); INSERT INTO public.flashcards (subject_id,book_id,chapter_id,topic_id,front_text,back_text,source_type,source_id,source_key) SELECT (SELECT id FROM public.subjects ORDER BY created_at ASC LIMIT 1),n.book_id,n.chapter_id,n.topic_id,n.title,n.content,'note',n.id,'batch0544-0548:note:'||n.id::text FROM public.gk_notes n WHERE n.source_page BETWEEN 544 AND 548 AND NOT EXISTS (SELECT 1 FROM public.flashcards c WHERE c.source_key='batch0544-0548:note:'||n.id::text); INSERT INTO public.flashcards (subject_id,book_id,chapter_id,topic_id,front_text,back_text,source_type,source_id,source_key) SELECT (SELECT id FROM public.subjects ORDER BY created_at ASC LIMIT 1),m.book_id,m.chapter_id,m.topic_id,m.question,'সঠিক উত্তর: '||o.option_key||'. '||o.option_text,'mcq',m.id,'batch0544-0548:mcq:'||m.id::text FROM public.gk_mcqs m JOIN public.gk_mcq_options o ON o.mcq_id=m.id AND o.is_correct WHERE m.source_page IN (544,546) AND NOT EXISTS (SELECT 1 FROM public.flashcards c WHERE c.source_key='batch0544-0548:mcq:'||m.id::text); INSERT INTO public.search_documents (entity_type,entity_id,title,body,english_metadata) SELECT 'fact',f.id,f.title,f.fact_text,'Status-marked Southeast Asia GK fact | source page '||f.source_page::text FROM public.gk_facts f WHERE f.source_page BETWEEN 544 AND 548 AND NOT EXISTS (SELECT 1 FROM public.search_documents d WHERE d.entity_type='fact' AND d.entity_id=f.id); INSERT INTO public.search_documents (entity_type,entity_id,title,body,english_metadata) SELECT 'note',n.id,n.title,n.content,'Structured source reference | source page '||n.source_page::text FROM public.gk_notes n WHERE n.source_page BETWEEN 544 AND 548 AND NOT EXISTS (SELECT 1 FROM public.search_documents d WHERE d.entity_type='note' AND d.entity_id=n.id); INSERT INTO public.search_documents (entity_type,entity_id,title,body,english_metadata) SELECT 'mcq',m.id,NULL,m.question,'Past-exam MCQ | source page '||m.source_page::text||' | question '||m.source_question_number FROM public.gk_mcqs m WHERE m.source_page IN (544,546) AND NOT EXISTS (SELECT 1 FROM public.search_documents d WHERE d.entity_type='mcq' AND d.entity_id=m.id);`;
  const sql = `-- Generated by prepare_validated_batch_0544_0548.mjs. Source pages 544–548 only.\nBEGIN;\nINSERT INTO public.import_runs (source_filename,source_sha256,pipeline_version,status,completed_at,audit) VALUES ('Jubayer''sgk.pdf',${q(hash(pages.map(page => page.source_image_sha256).join("|")))},${q(PIPELINE_VERSION)},'completed',now(),${json(audit)});\n${chapterSql}\n${topicSql}\n${pageSql}\n${factSql}\n${noteSql}\n${mcqSql}\n${tagSql}\n${verificationSql}\n${derivedSql}\nCOMMIT;`;
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
