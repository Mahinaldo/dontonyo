import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const workDir = "/home/ubuntu/dontonyo-work/batch-0474-0478";
const outputDir = path.join(root, "supabase", "batch-0474-0478");
const pageFiles = [474, 475, 476, 477, 478].map(page => path.join(workDir, "pages", `page_${String(page).padStart(4, "0")}.json`));

export const BATCH_PAGES = [474, 475, 476, 477, 478];
export const BOOK_TITLE = "Jubayer's GK";
export const PIPELINE_VERSION = "vision-quality-gated-batch-0474-0478-v1";

const refs = {
  padma: ["http://www.padmabridge.gov.bd/"],
  biman: ["https://biman.gov.bd/pages/static-pages/6922dc57933eb65569e0fd29"],
  jamunaRail: ["https://www.thedailystar.net/news/bangladesh/news/jamuna-rail-bridge-inaugurated-trains-run-120-kmh-3851231"],
  brtc: ["http://bdlaws.minlaw.gov.bd/act-details-314.html"],
};

const tags = [
  ["bangladesh-defence", "Bangladesh defence", "domain", "Bangladesh armed forces, security institutions, and military terminology."],
  ["bangladesh-transport", "Bangladesh transport", "domain", "Bangladesh road, rail, inland-water, air, bridge, and public-transport material."],
  ["roads-railways", "Roads and railways", "content_type", "Road, railway, station, bridge, and gauge reference material."],
  ["waterways-aviation", "Waterways and aviation", "content_type", "Water transport, seaport, airport, and aviation reference material."],
  ["bridges-flyovers", "Bridges and flyovers", "content_type", "Bridge and flyover reference material."],
  ["table", "Table or reference list", "content_type", "Source table, structured list, or labelled reference information."],
  ["definition", "Definition", "content_type", "Definition or terminology preserved from the source."],
  ["past-exam-mcq", "Past-exam MCQ", "content_type", "Multiple-choice question with a printed exam source."],
  ["answer-key", "Answer key", "content_type", "Printed answer-key-derived MCQ answer."],
  ["low-confidence-answer", "Low-confidence answer", "quality", "Printed answer is ambiguous, incomplete, or not mapped to a visible option."],
  ["source-attributed", "Source-attributed", "quality", "Preserved from the book with source linkage but no completed independent verification."],
  ["externally-verified", "Externally verified", "quality", "Corroborated by an external source listed in the verification ledger."],
  ["dhaka-university", "University of Dhaka", "exam_source", "University admission examination label as printed."],
  ["bcs", "BCS", "exam_source", "Bangladesh Civil Service examination label as printed."],
  ["medical-admission", "Medical admission", "exam_source", "Medical admission examination label as printed."],
  ["other-recruitment", "Other university and recruitment exam", "exam_source", "Other university or recruitment-exam label as printed."],
];

const sha = value => crypto.createHash("sha256").update(value, "utf8").digest("hex");
const q = value => `'${String(value ?? "").replaceAll("'", "''")}'`;
const qJson = value => `${q(JSON.stringify(value))}::jsonb`;
const values = rows => rows.map(row => `(${row.map(q).join(", ")})`).join(",\n");
const confidence = value => (value === "high" || value === "low" ? value : "medium");

function contextFor(page) {
  if (page === 474) return { chapter: "bangladesh-defence-security", topic: "defence-past-exam-mcqs", chapterTitle: "বাংলাদেশের প্রতিরক্ষা ও নিরাপত্তা বাহিনী", topicTitle: "এই অধ্যায়ের সাথে জড়িত বিগত বছরের প্রশ্ন", baseTag: "past-exam-mcq" };
  if (page === 475) return { chapter: "bangladesh-transport", topic: "roads-and-railways", chapterTitle: "পরিবহন ও যোগাযোগ ব্যবস্থা", topicTitle: "সড়ক পথ ও রেলপথ", baseTag: "roads-railways" };
  if (page === 476) return { chapter: "bangladesh-transport", topic: "waterways-and-aviation", chapterTitle: "পরিবহন ও যোগাযোগ ব্যবস্থা", topicTitle: "নৌ-পথ ও আকাশ পথ", baseTag: "waterways-aviation" };
  if (page === 477) return { chapter: "bangladesh-transport", topic: "bridges-and-flyovers", chapterTitle: "পরিবহন ও যোগাযোগ ব্যবস্থা", topicTitle: "বাংলাদেশের সেতু ও ফ্লাইওভার", baseTag: "bridges-flyovers" };
  return { chapter: "bangladesh-transport", topic: "transport-past-exam-mcqs", chapterTitle: "পরিবহন ও যোগাযোগ ব্যবস্থা", topicTitle: "এই অধ্যায়ের সাথে জড়িত বিগত বছরের প্রশ্ন", baseTag: "past-exam-mcq" };
}

function verdict(page, text) {
  if ((page === 475 || page === 477 || page === 478) && text.includes("পদ্মা সেতু") && text.includes("৬.১৫")) return { status: "verified", confidence: "high", sources: refs.padma };
  if (page === 475 && text.includes("BRTC") && text.includes("১৯৬১")) return { status: "verified", confidence: "high", sources: refs.brtc };
  if (page === 476 && text.includes("৪ জানুয়ারি") && text.includes("১৯৭২")) return { status: "verified", confidence: "high", sources: refs.biman };
  if ((page === 475 || page === 477 || page === 478) && text.includes("যমুনা রেল") && text.includes("৪.৮")) return { status: "verified", confidence: "high", sources: refs.jamunaRail };
  return { status: "source_attributed", confidence: "medium", sources: [] };
}

const fact = (source_page, topic_slug, title, fact_text, content_type) => ({
  source_page,
  chapter_slug: contextFor(source_page).chapter,
  topic_slug,
  title,
  fact_text,
  source_excerpt: fact_text,
  content_type,
  importance: 3,
  ...verdict(source_page, fact_text),
});

const facts = [
  fact(475, "roads-and-railways", "সড়ক পথ", "যোগাযোগ মন্ত্রণালয়ের নাম পরিবর্তন করে রাখা হয়- সড়ক পরিবহন ও সেতু মন্ত্রণালয়।", "roads-railways"),
  fact(475, "roads-and-railways", "সড়ক পথ", "বাংলাদেশ সড়ক পরিবহনে নিয়োজিত সরকারি সংস্থা- বি.আর.টি.সি।", "roads-railways"),
  fact(475, "roads-and-railways", "সড়ক পথ", "BRTC- Bangladesh Road Transport Corporation (প্রতিষ্ঠা- ১৯৬১)।", "roads-railways"),
  fact(475, "roads-and-railways", "সড়ক পথ", "বাংলাদেশের দীর্ঘতম সেতু- পদ্মা সেতু (দৈর্ঘ্য- ৬.১৫ কি.মি)।", "roads-railways"),
  fact(475, "roads-and-railways", "সড়ক পথ", "বাংলাদেশের দ্বিতীয় দীর্ঘতম সড়ক ও রেলসেতু 'যমুনা সেতু'র দৈর্ঘ্য- ৪.৮ কি. মি.।", "roads-railways"),
  fact(475, "roads-and-railways", "সড়ক পথ", "বাংলাদেশের প্রথম ফ্লাইওভারের নাম- মহাখালী ফ্লাইওভার।", "roads-railways"),
  fact(475, "roads-and-railways", "সড়ক পথ", "এশিয়ার দেশগুলোর মধ্যে সড়ক পথে যোগাযোগের জন্য প্রতিষ্ঠা করা হয়- এশিয়ান হাইওয়ে (১৯৫৯)।", "roads-railways"),
  fact(475, "roads-and-railways", "সড়ক পথ", "এশিয়ান হাইওয়ে যুক্ত করে- ৩২টি দেশকে।", "roads-railways"),
  fact(475, "roads-and-railways", "রেলপথ", "বিশ্বে প্রথম রেলপথ চালু হয়- ১৮২৫ সালে; যুক্তরাজ্যে।", "roads-railways"),
  fact(475, "roads-and-railways", "রেলপথ", "উপমহাদেশে সর্বপ্রথম রেলগাড়ি চালু করেন- লর্ড ডালহৌসী; ১৮৫৩ সালে।", "roads-railways"),
  fact(475, "roads-and-railways", "রেলপথ", "বাংলাদেশে প্রথম রেললাইন স্থাপিত হয়- ১৮৬২ সালে।", "roads-railways"),
  fact(475, "roads-and-railways", "রেলপথ", "বাংলাদেশের প্রথম আন্তঃনগর ট্রেন সার্ভিস চালু হয়- ১৯৮৫ সালে।", "roads-railways"),
  fact(475, "roads-and-railways", "রেলপথ", "দেশে DEMU (Diesel Electric Multiple Unit) ট্রেন যুক্ত হয়- ২০১৩ সালে।", "roads-railways"),
  fact(475, "roads-and-railways", "রেলপথ", "বাংলাদেশে রেলওয়ের কারখানা আছে- ৬টি।", "roads-railways"),
  fact(475, "roads-and-railways", "রেলপথ", "বাংলাদেশে প্রথম রেললাইন স্থাপিত হয়- দর্শনা হতে কুষ্টিয়ার জগতি পর্যন্ত।", "roads-railways"),
  fact(475, "roads-and-railways", "রেলপথ", "রেলওয়ের সার্বিক সদর দপ্তর অবস্থিত- ঢাকা।", "roads-railways"),
  fact(475, "roads-and-railways", "রেলপথ", "রেলওয়ের পূর্বাঞ্চলের সদর দপ্তর- চট্টগ্রামে।", "roads-railways"),
  fact(475, "roads-and-railways", "রেলপথ", "রেলওয়ের পশ্চিমাঞ্চলের সদর দপ্তর- রাজশাহীতে।", "roads-railways"),
  fact(475, "roads-and-railways", "রেলপথ", "বাংলাদেশের বৃহত্তম রেলওয়ে স্টেশন- কমলাপুর রেলওয়ে স্টেশন।", "roads-railways"),
  fact(475, "roads-and-railways", "রেলপথ", "রেলওয়ের সর্ববৃহৎ কারখানা অবস্থিত- সৈয়দপুরে।", "roads-railways"),
  fact(475, "roads-and-railways", "রেলপথ", "বাংলাদেশের যে বিভাগে রেলপথ নেই- বরিশাল।", "roads-railways"),
  fact(475, "roads-and-railways", "রেলপথ", "এককভাবে বাংলাদেশের দীর্ঘতম রেলসেতু- যমুনা রেলসেতু (দৈর্ঘ্য- ৪.৮ কি.মি.)।", "roads-railways"),
  fact(475, "roads-and-railways", "রেলপথ", "যমুনা রেলসেতু যুক্ত করেছে- সিরাজগঞ্জ ও টাঙ্গাইল জেলাকে।", "roads-railways"),
  fact(475, "roads-and-railways", "রেলপথ", "ভারতের প্রথম রেল লাইন নির্মিত হয়- হাওড়া থেকে হুগলী (চুঁচুড়া) পর্যন্ত (দৈর্ঘ্য- ৩৮ কি.মি)।", "roads-railways"),
  fact(475, "roads-and-railways", "রেলপথ", "রেল লাইন নির্মাণ করে- ইস্ট ইন্ডিয়া রেলওয়ে কোম্পানি (১৮৫৪ সালে)।", "roads-railways"),
  fact(475, "roads-and-railways", "রেলপথ", "ব্রিটিশ সরকার তিন ধরনের গেজের (প্রস্থের) রেলপথ প্রবর্তন করেন- মিটার গেজ, ব্রড গেজ, ন্যারো গেজ।", "definition"),
  fact(475, "roads-and-railways", "রেলপথ", "বাংলাদেশের ব্রডগেজ রেলওয়ে লাইন সবচেয়ে বেশি রয়েছে- রাজশাহী বিভাগে।", "roads-railways"),
  fact(476, "waterways-and-aviation", "নৌ-পথ", "বাংলাদেশ নৌ পরিবহন সংস্থার নাম- BIWTC (প্রতিষ্ঠা- ১৯৫৮)।", "waterways-aviation"),
  fact(476, "waterways-and-aviation", "নৌ-পথ", "BIWTC এর সদর দপ্তর- ঢাকা।", "waterways-aviation"),
  fact(476, "waterways-and-aviation", "নৌ-পথ", "BIWTC যে মন্ত্রণালয়ের অধীনে- নৌ-পরিবহন মন্ত্রণালয়।", "waterways-aviation"),
  fact(476, "waterways-and-aviation", "নৌ-পথ", "নদীপথে ঢাকার সাথে সরাসরি সংযুক্ত নয়- রাঙামাটি জেলা।", "waterways-aviation"),
  fact(476, "waterways-and-aviation", "নৌ-পথ", "বাংলাদেশের শিপিং কর্পোরেশন চালু হয়- ১৯৭২ সালে।", "waterways-aviation"),
  fact(476, "waterways-and-aviation", "নৌ-পথ", "মোংলা বন্দর অবস্থিত- বাগেরহাটে।", "waterways-aviation"),
  fact(476, "waterways-and-aviation", "নৌ-পথ", "বর্তমানে বাংলাদেশের সমুদ্র বন্দর- ৪টি।", "waterways-aviation"),
  fact(476, "waterways-and-aviation", "নৌ-পথ", "মিয়ানমারের সাথে বাণিজ্য কার্যক্রম চলে- টেকনাফ বন্দরে।", "waterways-aviation"),
  fact(476, "waterways-and-aviation", "আকাশ পথ", "বাংলাদেশ বিমান সংস্থার বর্তমান নাম- বিমান বাংলাদেশ এয়ারলাইন্স লিমিটেড।", "waterways-aviation"),
  fact(476, "waterways-and-aviation", "আকাশ পথ", "গঠিত হয়- ৪ জানুয়ারি, ১৯৭২ সালে।", "waterways-aviation"),
  fact(476, "waterways-and-aviation", "আকাশ পথ", "বাংলাদেশ বিমান সংস্থার পূর্বনাম- বিমান বাংলাদেশ এয়ারলাইন্স।", "waterways-aviation"),
  fact(476, "waterways-and-aviation", "আকাশ পথ", "বাংলাদেশ বিমানের স্লোগান- Your home in the sky.", "waterways-aviation"),
  fact(476, "waterways-and-aviation", "আকাশ পথ", "বাংলাদেশ বিমানের প্রতীক- বলাকা।", "waterways-aviation"),
  fact(476, "waterways-and-aviation", "আকাশ পথ", "বাংলাদেশে আন্তর্জাতিক বিমানবন্দর- ৩টি।", "waterways-aviation"),
  fact(476, "waterways-and-aviation", "আকাশ পথ", "বাংলাদেশ বিমানের প্রথম আন্তর্জাতিক ফ্লাইট চালু হয়- ৪ মার্চ, ১৯৭২ সালে।", "waterways-aviation"),
  fact(476, "waterways-and-aviation", "আকাশ পথ", "বাংলাদেশ বিমানের প্রথম ফ্লাইট ছিল- ঢাকা-লন্ডন-ঢাকা।", "waterways-aviation"),
  fact(476, "waterways-and-aviation", "আকাশ পথ", "বাংলাদেশ বিমানের প্রথম মহিলা পাইলট- কানিজ ফাতেমা রোকসানা।", "waterways-aviation"),
  fact(476, "waterways-and-aviation", "আকাশ পথ", "প্রথম বেসরকারি বিমান সংস্থা- এ্যারো বেঙ্গল এয়ারলাইন্স।", "waterways-aviation"),
  fact(476, "waterways-and-aviation", "আকাশ পথ", "বাংলাদেশের অভ্যন্তরীণ বিমানবন্দর- ১১টি।", "waterways-aviation"),
  fact(477, "bridges-and-flyovers", "পদ্মা সেতু", "বাংলাদেশের বৃহত্তম সেতু- পদ্মা সেতু।", "bridges-flyovers"),
  fact(477, "bridges-and-flyovers", "পদ্মা সেতু", "দৈর্ঘ্য- ৬.১৫ কিলোমিটার; প্রস্থ- ১৮.১০ মিটার।", "bridges-flyovers"),
  fact(477, "bridges-and-flyovers", "পদ্মা সেতু", "অবস্থান- ৩টি জেলার উপর। যথা: মুন্সিগঞ্জ, শরীয়তপুর, মাদারীপুর।", "bridges-flyovers"),
  fact(477, "bridges-and-flyovers", "পদ্মা সেতু", "সংযুক্ত করেছে- দক্ষিণ অঞ্চলের ২১টি জেলাকে।", "bridges-flyovers"),
  fact(477, "bridges-and-flyovers", "যমুনা রেল সেতু", "বাংলাদেশের সর্ববৃহৎ রেল সেতু- যমুনা রেল সেতু।", "bridges-flyovers"),
  fact(477, "bridges-and-flyovers", "যমুনা রেল সেতু", "দৈর্ঘ্য- ৪.৮ কিলোমিটার।", "bridges-flyovers"),
  fact(477, "bridges-and-flyovers", "যমুনা রেল সেতু", "সংযুক্ত করেছে- সিরাজগঞ্জ ও টাঙ্গাইল জেলাকে।", "bridges-flyovers"),
  fact(477, "bridges-and-flyovers", "হার্ডিঞ্জ ব্রিজ", "বাংলাদেশের একক বৃহত্তম রেল সেতু- হার্ডিঞ্জ ব্রিজ।", "bridges-flyovers"),
  fact(477, "bridges-and-flyovers", "হার্ডিঞ্জ ব্রিজ", "নির্মাণ করেন- লর্ড হার্ডিঞ্জ।", "bridges-flyovers"),
  fact(477, "bridges-and-flyovers", "হার্ডিঞ্জ ব্রিজ", "অবস্থিত- কুষ্টিয়া ও পাবনা জেলার সংযোগস্থলে পদ্মা নদীর উপর।", "bridges-flyovers"),
  fact(477, "bridges-and-flyovers", "লালন শাহ সেতু", "বাংলাদেশের তৃতীয় বৃহত্তম সেতু- লালন শাহ সেতু।", "bridges-flyovers"),
  fact(477, "bridges-and-flyovers", "লালন শাহ সেতু", "দৈর্ঘ্য- ১.৮ কিলোমিটার।", "bridges-flyovers"),
  fact(477, "bridges-and-flyovers", "লালন শাহ সেতু", "সংযুক্ত করেছে- পাবনা ও কুষ্টিয়াকে।", "bridges-flyovers"),
  fact(477, "bridges-and-flyovers", "খান জাহান আলী সেতু", "এটি রূপসা ব্রিজ নামেও পরিচিত।", "bridges-flyovers"),
  fact(477, "bridges-and-flyovers", "খান জাহান আলী সেতু", "নির্মিত হয়েছে- রূপসা নদীর উপরে।", "bridges-flyovers"),
  fact(477, "bridges-and-flyovers", "খান জাহান আলী সেতু", "সংযুক্ত করেছে- খুলনা ও বাগেরহাটকে।", "bridges-flyovers"),
  fact(477, "bridges-and-flyovers", "মহাখালী ফ্লাইওভার", "বাংলাদেশের প্রথম ফ্লাইওভার- মহাখালী ফ্লাইওভার।", "bridges-flyovers"),
  fact(477, "bridges-and-flyovers", "মহাখালী ফ্লাইওভার", "দৈর্ঘ্য- ১.১২ কিলোমিটার।", "bridges-flyovers"),
  fact(477, "bridges-and-flyovers", "মহাখালী ফ্লাইওভার", "উদ্বোধন করেন- বেগম খালেদা জিয়া (২০০৪) সালে।", "bridges-flyovers"),
  fact(477, "bridges-and-flyovers", "মেয়র মোহাম্মদ হানিফ ফ্লাইওভার", "বাংলাদেশের দীর্ঘতম ফ্লাইওভার- মেয়র মোহাম্মদ হানিফ ফ্লাইওভার।", "bridges-flyovers"),
  fact(477, "bridges-and-flyovers", "মেয়র মোহাম্মদ হানিফ ফ্লাইওভার", "দৈর্ঘ্য- ১১.৮ কিলোমিটার।", "bridges-flyovers"),
  fact(477, "bridges-and-flyovers", "মেয়র মোহাম্মদ হানিফ ফ্লাইওভার", "অবস্থান- গুলিস্তান থেকে যাত্রাবাড়ী।", "bridges-flyovers"),
].map(row => ({ ...row, canonical_hash: sha(`fact|${row.source_page}|${row.title}|${row.fact_text}`) }));

const notes = [
  { source_page: 475, title: "রেলপথ নেই এমন জেলা", content: "রেলপথ নেই এমন জেলা: বরিশাল, ভোলা, পটুয়াখালী, বরগুনা, পিরোজপুর, ঝালকাঠি, লক্ষ্মীপুর, মানিকগঞ্জ, মেহেরপুর, মাগুরা, শেরপুর, বান্দরবান, খাগড়াছড়ি ও রাঙ্গামাটি।", content_type: "table" },
  { source_page: 476, title: "আন্তর্জাতিক বিমানবন্দর", content: "১ ঢাকায় হযরত শাহজালাল (র.) আন্তর্জাতিক বিমানবন্দর\n২ চট্টগ্রামে শাহ আমানত আন্তর্জাতিক বিমানবন্দর\n৩ সিলেটে ওসমানী আন্তর্জাতিক বিমানবন্দর", content_type: "table" },
  { source_page: 476, title: "উল্লেখযোগ্য কয়েকটি অভ্যন্তরীণ বিমানবন্দর", content: "খানজাহান আলী বিমানবন্দর (বাগেরহাট) | সৈয়দপুর বিমানবন্দর (নীলফামারী) | ঈশ্বরদী বিমানবন্দর (পাবনা) | শাহ মখদুম বিমানবন্দর (রাজশাহী)", content_type: "table" },
  { source_page: 476, title: "ট্রাফিক লাইটের ক্রম", content: "রাস্তায় যে ট্রাফিক লাইট জ্বালানো হয়: লাল - হলুদ - সবুজ - হলুদ - লাল", content_type: "definition" },
  { source_page: 478, title: "দীর্ঘতম রেলসেতু বিষয়ক নোট", content: "নোট: বর্তমানে বাংলাদেশের দীর্ঘতম রেলসেতু- যমুনা রেলসেতু (দৈর্ঘ্য- ৪.৮ কি.মি.)।", content_type: "table" },
].map(row => ({ ...row, chapter_slug: contextFor(row.source_page).chapter, topic_slug: contextFor(row.source_page).topic, ...verdict(row.source_page, row.content), canonical_hash: sha(`note|${row.source_page}|${row.title}|${row.content}`) }));

const mcq = (source_page, number, question, options, correct, source, status = "source_attributed", conf = "medium", sources = []) => ({ source_page, number, question, options, correct, source, status, conf, sources, canonical_hash: sha(`mcq|${source_page}|${number}|${question}`) });
const mcqs = [
  mcq(474, "01", "বাংলাদেশ সেনাবাহিনীর সর্বোচ্চ পদ-", ["জেনারেল", "লেফটেন্যান্ট জেনারেল", "ফিল্ড মার্শাল", "ভাইস-এডমিরাল"], "ক", "DU খ' ০৯-১০, ঘ' ৯৫-৯৬"),
  mcq(474, "02", "বাংলাদেশ সোর্ড অব অনার পুরস্কার প্রাপ্ত প্রথম নারী-", ["রাজিয়া সুলতানা", "তারামন বিবি", "মারিয়া ইসলাম", "মারজিয়া ইসলাম"], "ঘ", "DU খ' ০৪-০৫"),
  mcq(474, "03", "বাংলাদেশে পুলিশ একাডেমি কোথায় অবস্থিত?", ["যশোর", "কুমিল্লা", "সারদা", "বগুড়া"], "গ", "DU ঘ' ৯৬-৯৭"),
  mcq(474, "04", "বিডিআর হত্যাকাণ্ড সংঘটিত হয়-", ["২১শে ফেব্রুয়ারি, ২০০৭", "২৩শে ফেব্রুয়ারি, ২০০৮", "২৪শে ফেব্রুয়ারি, ২০০৯", "২৫শে ফেব্রুয়ারি, ২০০৯"], "ঘ", "DU খ' ১০-১১"),
  mcq(474, "05", "বাংলাদেশ রাইফেলস্-এর পরিবর্তিত নাম-", ["বর্ডার গার্ড বাংলাদেশ", "বর্ডার রাইফেলস্ গার্ড", "বর্ডার অপারেশন ফ্রন্ট", "বাংলার বর্ডার গার্ড"], "ক", "DU ঘ' ১০-১১/জাবি, মানবিক ১৩-১৪"),
  mcq(474, "06", "বাংলাদেশের বিমান বাহিনীর প্রশিক্ষণ কেন্দ্র কোথায় অবস্থিত?", ["চট্টগ্রাম", "ঢাকা", "যশোর", "সিলেট"], "গ", "DU ঘ' ৯৫-৯৬"),
  mcq(474, "07", "১৯৭৫ সালের ১৫ আগস্ট ভোর রাত পর্যন্ত বাংলাদেশের সেনাবাহিনী প্রধান কে ছিলেন?", ["মেজর জেনারেল জিয়াউর রহমান", "মেজর জেনারেল মঞ্জুর", "মেজর জেনারেল এ কে এম শফিউল্লাহ", "মেজর জেনারেল এইচএম এরশাদ"], "গ", "23 BCS"),
  mcq(474, "08", "প্রথম মহিলা পুলিশ নিয়োগ করা হয় কোন সালে?", ["১৯৭২", "১৯৭৪", "১৯৭৭", "১৯৭৮"], "খ", "24 BCS"),
  mcq(474, "09", "বঙ্গ-ভারত উপমহাদেশের প্রথম পুলিশ ব্যবস্থা কে চালু করেন?", ["মিবার্ড", "সম্রাট আকবর", "লর্ড ক্যানিং", "সম্রাট শাহজাহান"], "গ", "MC ০৭-০৮"),
  mcq(474, "10", "জাহানাবাদ সেনানিবাস কোন জেলায়?", ["রাজশাহী", "চট্টগ্রাম", "সিলেট", "খুলনা"], "ঘ", "রাবি-সমাজবিজ্ঞান বিভাগ, ০৫-০৬"),
  mcq(474, "11", "বাংলাদেশের প্রথম নৌবহরের নাম-", ["ঈসা খাঁন", "মোয়াজ্জেম", "বঙ্গবন্ধু", "তিতুমীর"], "গ", "রাবি-ইতিহাস, ০৮-০৯"),
  mcq(478, "01", "বঙ্গবন্ধু সেতুর দৈর্ঘ্য কত?", ["৪.৫", "৪.৮", "৫.২", "৬.২"], "খ", "DU ঘ' ৯৯-০০, ৯৫-৯৬; 20, 19 BCS"),
  mcq(478, "02", "কর্ণফুলী নদীর উপর সেতুর নাম-", ["কর্ণফুলী সেতু", "শাহ আমানত সেতু", "কিংস সেতু", "চট্টগ্রাম সেতু"], "খ", "DU খ' ১১-১২"),
  mcq(478, "03", "প্রস্তাবিত পদ্মা সেতুর দৈর্ঘ্য কত কিলোমিটার?", ["৪.৮", "৫.০৩", "৬.৮", "৬.১৫"], "ঘ", "27 BCS; DU ঘ' ০৬-০৭/জবি গ' ১৩-১৪", "verified", "high", refs.padma),
  mcq(478, "04", "ঢাকা শহরের প্রথম ফ্লাইওভার উদ্বোধন করা হয়-", ["৩ নভেম্বর ২০০৪", "৪ নভেম্বর ২০০৪", "৫ নভেম্বর ২০০৪", "৬ নভেম্বর ২০০৪"], "খ", "DU খ' ১৪-১৫"),
  mcq(478, "05", "বাংলাদেশের প্রস্তাবিত গভীর সমুদ্র বন্দরটি কোথায় গড়ে তোলা হবে?", ["কুতুবদিয়া", "হাতিরদিয়া", "সোনাদিয়া", "মংলা"], "গ", "DU ঘ' ০৯-১০"),
  mcq(478, "06", "'মাওয়া ফেরিঘাট' কোন জেলায় অবস্থিত?", ["শরীয়তপুর", "মাদারীপুর", "ঢাকা", "মুন্সিগঞ্জ"], "ঘ", "DU খ' ০৮-০৯"),
  mcq(478, "07", "মংলা বন্দর কোন জেলায় অবস্থিত?", ["খুলনা", "বাগেরহাট", "সাতক্ষীরা", "বরগুনা"], "খ", "DU খ' ০২-০৩"),
  mcq(478, "08", "বাংলাদেশ রেলওয়ে পূর্বাঞ্চলীয় সদর দপ্তর কোথায় অবস্থিত?", ["ঢাকা", "চট্টগ্রাম", "ঈশ্বরদী", "পার্বতীপুর"], "খ", "DU ঘ' ৯৯-০০"),
  mcq(478, "09", "বাংলাদেশের আন্তর্জাতিক বিমানবন্দরের সংখ্যা?", ["একটি", "দুইটি", "তিনটি", "চারটি"], "গ", "DU খ' ০০-০১; ঘ' ০০-০১"),
  mcq(478, "10", "নিম্নলিখিত কোন জেলায় বিমানবন্দর নেই?", ["ঢাকা", "খুলনা", "চট্টগ্রাম", "সিলেটে"], "খ", "DU ঙ' ০৩-০৪"),
  mcq(478, "11", "'......' জেলায় রেল যোগাযোগ নেই?", ["জামালপুর", "পটুয়াখালী", "নাটোর", "নেত্রকোণা"], "খ", "30 BCS"),
  mcq(478, "12", "বাংলাদেশের বৃহত্তম স্থল বন্দর-", ["সোনা মসজিদ", "চট্টগ্রাম", "বেনাপোল", "হিলি"], "গ", "24 BCS"),
  mcq(478, "13", "বাংলাদেশের দীর্ঘতম রেল সেতু-", ["ভৈরব", "হার্ডিঞ্জ", "ব্রহ্মপুত্র", "তিস্তা"], "*", "16 BCS", "source_attributed", "low", []),
  mcq(478, "14", "মেয়র মোহাম্মদ হানিফ ফ্লাইওভারের দৈর্ঘ্য কত?", ["১১.২ কি.মি.", "১২.২ কি.মি.", "১১.৮ কি.মি.", "১২.৮ কি.মি."], "গ", "36 BCS"),
  mcq(478, "15", "বাংলাদেশে রেলওয়ের সর্ববৃহৎ কারখানা কোথায়?", ["চট্টগ্রাম", "পাকশী", "সৈয়দপুর", "আখাউড়া"], "গ", "32 BCS"),
];

function pageMetadata(page) {
  const printedBookPage = { 474: 417, 475: 418, 476: 419, 477: 420, 478: 421 }[page.source_page];
  const nested = page.transcription.source_page;
  return {
    source_image_sha256: page.source_image_sha256,
    extraction_model: page.model,
    review_status: page.review.review_status,
    corrections: page.review.corrections,
    unresolved_spans: page.review.unresolved_spans,
    accepted_content_tags: page.review.accepted_content_tags,
    physical_source_page: page.source_page,
    printed_book_page: printedBookPage,
    nested_artifact_page_number: nested,
    page_number_mismatch: nested !== page.source_page ? "Nested OCR metadata differs from the physical PDF page; physical source_page and visual footer remain canonical." : null,
    visual_review_report: page.source_page === 474 || page.source_page === 478 ? "/home/ubuntu/dontonyo/reports/batch-0474-0478_visual_review.md" : null,
    external_verification_report: "/home/ubuntu/dontonyo/reports/batch-0474-0478_external_verification.md",
    page_kind: page.source_page === 474 || page.source_page === 478 ? "mcq" : page.source_page === 476 ? "mixed" : "educational",
  };
}

function qualityTag(status) { return status === "verified" ? "externally-verified" : "source-attributed"; }
function examInfo(source) {
  if (source.includes("DU")) return ["University of Dhaka", "University of Dhaka", "admission", "dhaka-university"];
  if (source.includes("BCS")) return ["Bangladesh Civil Service", null, "competitive", "bcs"];
  if (source.includes("MC")) return ["Medical Admission", null, "admission", "medical-admission"];
  return ["Other university and recruitment examination", null, "competitive", "other-recruitment"];
}
function lookup(row) {
  if (row.entity_type === "fact") return `(SELECT id FROM public.gk_facts WHERE canonical_hash = ${q(row.canonical_hash)} LIMIT 1)`;
  if (row.entity_type === "note") return `(SELECT id FROM public.gk_notes WHERE canonical_hash = ${q(row.canonical_hash)} LIMIT 1)`;
  return `(SELECT id FROM public.gk_mcqs WHERE canonical_hash = ${q(row.canonical_hash)} LIMIT 1)`;
}

export async function buildBatch() {
  const pages = await Promise.all(pageFiles.map(async file => JSON.parse(await fs.readFile(file, "utf8"))));
  const verificationRows = [
    ...facts.map(row => ({ entity_type: "fact", canonical_hash: row.canonical_hash, source_page: row.source_page, claim_text: row.source_excerpt, normalized_claim: row.fact_text, status: row.status, confidence: row.confidence, sources: row.sources })),
    ...notes.map(row => ({ entity_type: "note", canonical_hash: row.canonical_hash, source_page: row.source_page, claim_text: row.content, normalized_claim: row.content, status: row.status, confidence: row.confidence, sources: row.sources })),
    ...mcqs.map(row => ({ entity_type: "mcq", canonical_hash: row.canonical_hash, source_page: row.source_page, claim_text: `${row.question} — printed answer: ${row.correct}`, normalized_claim: null, status: row.status, confidence: row.conf, sources: row.sources })),
  ];
  const contextSql = `
INSERT INTO public.chapters (book_id, chapter_number, title, slug, description, source_page, display_order)
SELECT b.id, 41, 'পরিবহন ও যোগাযোগ ব্যবস্থা', 'bangladesh-transport', 'Source-derived transport, communication, bridge, rail, waterway, and aviation material with explicit verification states.', 475, 41 FROM public.books b WHERE b.title = ${q(BOOK_TITLE)} AND NOT EXISTS (SELECT 1 FROM public.chapters c WHERE c.book_id = b.id AND c.slug = 'bangladesh-transport');
INSERT INTO public.topics (chapter_id, title, slug, description, source_page, display_order)
SELECT c.id, x.title, x.slug, x.description, x.source_page, x.display_order FROM (VALUES
 ('bangladesh-defence-security', 'প্রতিরক্ষা ও নিরাপত্তা বিষয়ক বিগত বছরের প্রশ্ন', 'defence-past-exam-mcqs', 'Past-exam MCQs and printed answer key from source page 474.', 474, 11),
 ('bangladesh-transport', 'সড়ক পথ ও রেলপথ', 'roads-and-railways', 'Source-derived road, rail, station, and gauge reference material.', 475, 1),
 ('bangladesh-transport', 'নৌ-পথ ও আকাশ পথ', 'waterways-and-aviation', 'Source-derived waterway, port, airport, and aviation reference material.', 476, 2),
 ('bangladesh-transport', 'বাংলাদেশের সেতু ও ফ্লাইওভার', 'bridges-and-flyovers', 'Source-derived bridge and flyover reference material.', 477, 3),
 ('bangladesh-transport', 'পরিবহন ও যোগাযোগভিত্তিক বিগত বছরের প্রশ্ন', 'transport-past-exam-mcqs', 'Past-exam MCQs, answer key, and a source-preserved low-confidence item from page 478.', 478, 4)
) AS x(chapter_slug, title, slug, description, source_page, display_order) JOIN public.chapters c ON c.slug = x.chapter_slug AND c.book_id = (SELECT id FROM public.books WHERE title = ${q(BOOK_TITLE)} LIMIT 1) WHERE NOT EXISTS (SELECT 1 FROM public.topics t WHERE t.chapter_id = c.id AND t.slug = x.slug);`;
  const sourcePagesSql = pages.map(page => {
    const context = contextFor(page.source_page); const metadata = pageMetadata(page);
    return `INSERT INTO public.source_pages (import_run_id, book_id, source_page, page_kind, raw_transcription, chapter_heading, topic_heading, confidence, extraction_method, model_name, notes, review_metadata) SELECT (SELECT id FROM public.import_runs WHERE pipeline_version = ${q(PIPELINE_VERSION)} ORDER BY started_at DESC LIMIT 1), b.id, ${page.source_page}, ${q(metadata.page_kind)}::page_kind, ${q(page.review.verified_transcript)}, ${q(context.chapterTitle)}, ${q(context.topicTitle)}, ${q(confidence(page.review.overall_confidence))}::confidence_level, 'vision_ocr_with_image_grounded_review', ${q(page.model)}, ${q('Quality-gated batch with correction log, semantic content-type separation, dense-page visual review, and external-verification ledger.')}, ${qJson(metadata)} FROM public.books b WHERE b.title = ${q(BOOK_TITLE)} AND NOT EXISTS (SELECT 1 FROM public.source_pages s WHERE s.book_id = b.id AND s.source_page = ${page.source_page});`;
  }).join("\n");
  const factsSql = `WITH data(source_page, chapter_slug, topic_slug, title, fact_text, source_excerpt, importance, confidence, canonical_hash, status) AS (VALUES
${values(facts.map(row => [row.source_page, row.chapter_slug, row.topic_slug, row.title, row.fact_text, row.source_excerpt, row.importance, row.confidence, row.canonical_hash, row.status]))})
INSERT INTO public.gk_facts (book_id, chapter_id, topic_id, title, fact_text, explanation, source_page, source_section, source_excerpt, importance, confidence, canonical_hash)
SELECT b.id, c.id, t.id, d.title, d.fact_text, CASE d.status WHEN 'verified' THEN 'Externally corroborated; source wording remains in source_excerpt.' ELSE 'Source-attributed material retained with source linkage and explicit verification status.' END, d.source_page::integer, d.title, d.source_excerpt, d.importance::smallint, d.confidence::confidence_level, d.canonical_hash FROM data d JOIN public.books b ON b.title = ${q(BOOK_TITLE)} JOIN public.chapters c ON c.book_id = b.id AND c.slug = d.chapter_slug JOIN public.topics t ON t.chapter_id = c.id AND t.slug = d.topic_slug ON CONFLICT (canonical_hash) DO UPDATE SET fact_text = EXCLUDED.fact_text, explanation = EXCLUDED.explanation, confidence = EXCLUDED.confidence, source_excerpt = EXCLUDED.source_excerpt;`;
  const notesSql = `WITH data(source_page, chapter_slug, topic_slug, title, content, confidence, canonical_hash) AS (VALUES
${values(notes.map(row => [row.source_page, row.chapter_slug, row.topic_slug, row.title, row.content, row.confidence, row.canonical_hash]))})
INSERT INTO public.gk_notes (book_id, chapter_id, topic_id, title, content, source_page, source_section, display_order, confidence, canonical_hash)
SELECT b.id, c.id, t.id, d.title, d.content, d.source_page::integer, d.title, d.source_page::integer, d.confidence::confidence_level, d.canonical_hash FROM data d JOIN public.books b ON b.title = ${q(BOOK_TITLE)} JOIN public.chapters c ON c.book_id = b.id AND c.slug = d.chapter_slug JOIN public.topics t ON t.chapter_id = c.id AND t.slug = d.topic_slug ON CONFLICT (canonical_hash) DO UPDATE SET content = EXCLUDED.content, confidence = EXCLUDED.confidence;`;
  const mcqSql = mcqs.map(row => {
    const info = examInfo(row.source); const keys = ["ক", "খ", "গ", "ঘ"]; const context = contextFor(row.source_page);
    const sourceSql = `INSERT INTO public.exam_sources (name, institution, exam_type, description, normalized_name) SELECT ${q(info[0])}, ${q(info[1])}, ${q(info[2])}, 'Exam source normalized from the printed label on source page ${row.source_page}.', ${q(info[3])} WHERE NOT EXISTS (SELECT 1 FROM public.exam_sources e WHERE e.normalized_name = ${q(info[3])});`;
    const optionSql = row.options.map((option, index) => `INSERT INTO public.gk_mcq_options (mcq_id, option_key, option_text, display_order, is_correct) SELECT m.id, ${q(keys[index])}, ${q(option)}, ${index + 1}, ${keys[index] === row.correct} FROM public.gk_mcqs m WHERE m.canonical_hash = ${q(row.canonical_hash)} AND NOT EXISTS (SELECT 1 FROM public.gk_mcq_options o WHERE o.mcq_id = m.id AND o.option_key = ${q(keys[index])});`).join("\n");
    const linkSql = `INSERT INTO public.gk_mcq_sources (mcq_id, exam_source_id, year, session, source_text, source_page) SELECT m.id, (SELECT id FROM public.exam_sources WHERE normalized_name = ${q(info[3])} LIMIT 1), NULL, ${q(row.source)}, ${q(row.source)}, ${row.source_page} FROM public.gk_mcqs m WHERE m.canonical_hash = ${q(row.canonical_hash)} AND NOT EXISTS (SELECT 1 FROM public.gk_mcq_sources s WHERE s.mcq_id = m.id AND s.source_text = ${q(row.source)} AND s.source_page = ${row.source_page});`;
    return `${sourceSql}
INSERT INTO public.gk_mcqs (book_id, chapter_id, topic_id, question, correct_option, explanation, source_page, source_section, source_question_number, difficulty, confidence, canonical_hash) SELECT b.id, c.id, t.id, ${q(row.question)}, ${q(row.correct)}, ${q(row.correct === "*" ? "The printed answer-key cell is an asterisk rather than a readable option label. All four printed options are retained; the unresolved source answer is explicitly low confidence." : row.status === "verified" ? "The printed answer is retained and its core fact is externally corroborated; source label remains linked." : "Printed answer key retained as source-attributed pending deeper verification.")}, ${row.source_page}, 'এই অধ্যায়ের সাথে জড়িত বিগত বছরের প্রশ্ন', ${q(row.number)}, 3, ${q(row.conf)}::confidence_level, ${q(row.canonical_hash)} FROM public.books b JOIN public.chapters c ON c.book_id = b.id AND c.slug = ${q(context.chapter)} JOIN public.topics t ON t.chapter_id = c.id AND t.slug = ${q(context.topic)} WHERE b.title = ${q(BOOK_TITLE)} ON CONFLICT (canonical_hash) DO UPDATE SET correct_option = EXCLUDED.correct_option, explanation = EXCLUDED.explanation, confidence = EXCLUDED.confidence;
${optionSql}
${linkSql}`;
  }).join("\n");
  const tagSql = `INSERT INTO public.content_tags (slug, label, category, description) VALUES
${tags.map(tag => `(${tag.map(q).join(", ")})`).join(",\n")}
ON CONFLICT (slug) DO UPDATE SET label = EXCLUDED.label, category = EXCLUDED.category, description = EXCLUDED.description;
${pages.map(page => `INSERT INTO public.content_tag_assignments (tag_id, entity_type, entity_id, source_page, confidence, assigned_by) SELECT t.id, 'source_page', s.id, ${page.source_page}, ${q(confidence(page.review.overall_confidence))}::confidence_level, 'batch-0474-0478-quality-pipeline' FROM public.content_tags t JOIN public.source_pages s ON s.source_page = ${page.source_page} AND s.book_id = (SELECT id FROM public.books WHERE title = ${q(BOOK_TITLE)} LIMIT 1) WHERE t.slug = ${q(contextFor(page.source_page).baseTag)} ON CONFLICT DO NOTHING;`).join("\n")}
${facts.map(row => [row.content_type, qualityTag(row.status)].map(tag => `INSERT INTO public.content_tag_assignments (tag_id, entity_type, entity_id, source_page, confidence, assigned_by) SELECT t.id, 'fact', f.id, ${row.source_page}, ${q(row.confidence)}::confidence_level, 'batch-0474-0478-quality-pipeline' FROM public.content_tags t JOIN public.gk_facts f ON f.canonical_hash = ${q(row.canonical_hash)} WHERE t.slug = ${q(tag)} ON CONFLICT DO NOTHING;`).join("\n")).join("\n")}
${notes.map(row => [row.content_type, qualityTag(row.status)].map(tag => `INSERT INTO public.content_tag_assignments (tag_id, entity_type, entity_id, source_page, confidence, assigned_by) SELECT t.id, 'note', n.id, ${row.source_page}, ${q(row.confidence)}::confidence_level, 'batch-0474-0478-quality-pipeline' FROM public.content_tags t JOIN public.gk_notes n ON n.canonical_hash = ${q(row.canonical_hash)} WHERE t.slug = ${q(tag)} ON CONFLICT DO NOTHING;`).join("\n")).join("\n")}
${mcqs.map(row => ["past-exam-mcq", "answer-key", examInfo(row.source)[3], qualityTag(row.status), ...(row.correct === "*" ? ["low-confidence-answer"] : [])].map(tag => `INSERT INTO public.content_tag_assignments (tag_id, entity_type, entity_id, source_page, confidence, assigned_by) SELECT t.id, 'mcq', m.id, ${row.source_page}, ${q(row.conf)}::confidence_level, 'batch-0474-0478-quality-pipeline' FROM public.content_tags t JOIN public.gk_mcqs m ON m.canonical_hash = ${q(row.canonical_hash)} WHERE t.slug = ${q(tag)} ON CONFLICT DO NOTHING;`).join("\n")).join("\n")}`;
  const verificationSql = verificationRows.map(row => { const entityId = lookup(row); return `INSERT INTO public.fact_verifications (source_page, entity_type, entity_id, claim_text, normalized_claim, verification_status, confidence, verification_sources, audit_note) SELECT ${row.source_page}, ${q(row.entity_type)}, ${entityId}, ${q(row.claim_text)}, ${row.normalized_claim ? q(row.normalized_claim) : "NULL"}, ${q(row.status)}, ${q(row.confidence)}::confidence_level, ${qJson(row.sources)}, ${q(row.status === "verified" ? "External source corroborates this precise claim; book wording remains source-linked." : row.confidence === "low" ? "Printed answer is an asterisk rather than a visible option label; retained as low confidence without inference." : "Retained as source-attributed material pending deeper verification.")} WHERE NOT EXISTS (SELECT 1 FROM public.fact_verifications v WHERE v.entity_type = ${q(row.entity_type)} AND v.entity_id = ${entityId} AND v.claim_text = ${q(row.claim_text)});`; }).join("\n");
  const derivedSql = `
INSERT INTO public.flashcards (subject_id, book_id, chapter_id, topic_id, front_text, back_text, source_type, source_id, source_key) SELECT (SELECT id FROM public.subjects ORDER BY created_at ASC LIMIT 1), f.book_id, f.chapter_id, f.topic_id, COALESCE(f.title, 'মূল তথ্য'), f.fact_text, 'fact', f.id, 'batch0474-0478:fact:' || f.id::text FROM public.gk_facts f WHERE f.source_page BETWEEN 474 AND 478 AND NOT EXISTS (SELECT 1 FROM public.flashcards c WHERE c.source_key = 'batch0474-0478:fact:' || f.id::text);
INSERT INTO public.flashcards (subject_id, book_id, chapter_id, topic_id, front_text, back_text, source_type, source_id, source_key) SELECT (SELECT id FROM public.subjects ORDER BY created_at ASC LIMIT 1), n.book_id, n.chapter_id, n.topic_id, n.title, n.content, 'note', n.id, 'batch0474-0478:note:' || n.id::text FROM public.gk_notes n WHERE n.source_page BETWEEN 474 AND 478 AND NOT EXISTS (SELECT 1 FROM public.flashcards c WHERE c.source_key = 'batch0474-0478:note:' || n.id::text);
INSERT INTO public.flashcards (subject_id, book_id, chapter_id, topic_id, front_text, back_text, source_type, source_id, source_key) SELECT (SELECT id FROM public.subjects ORDER BY created_at ASC LIMIT 1), m.book_id, m.chapter_id, m.topic_id, m.question, CASE WHEN m.correct_option = '*' THEN 'উত্তরমালায় দৃশ্যমান বিকল্প নয়: * (নিম্ন আত্মবিশ্বাস)' ELSE 'সঠিক উত্তর: ' || o.option_key || '. ' || o.option_text END, 'mcq', m.id, 'batch0474-0478:mcq:' || m.id::text FROM public.gk_mcqs m LEFT JOIN public.gk_mcq_options o ON o.mcq_id = m.id AND o.is_correct WHERE m.source_page IN (474, 478) AND NOT EXISTS (SELECT 1 FROM public.flashcards c WHERE c.source_key = 'batch0474-0478:mcq:' || m.id::text);
INSERT INTO public.search_documents (entity_type, entity_id, title, body, english_metadata) SELECT 'fact', f.id, f.title, f.fact_text, 'Source-linked GK fact | source page ' || f.source_page::text FROM public.gk_facts f WHERE f.source_page BETWEEN 474 AND 478 AND NOT EXISTS (SELECT 1 FROM public.search_documents d WHERE d.entity_type = 'fact' AND d.entity_id = f.id);
INSERT INTO public.search_documents (entity_type, entity_id, title, body, english_metadata) SELECT 'note', n.id, n.title, n.content, 'Source-linked GK note | source page ' || n.source_page::text FROM public.gk_notes n WHERE n.source_page BETWEEN 474 AND 478 AND NOT EXISTS (SELECT 1 FROM public.search_documents d WHERE d.entity_type = 'note' AND d.entity_id = n.id);
INSERT INTO public.search_documents (entity_type, entity_id, title, body, english_metadata) SELECT 'mcq', m.id, NULL, m.question, 'Past-exam MCQ | source page ' || m.source_page::text || ' | question ' || COALESCE(m.source_question_number, '') FROM public.gk_mcqs m WHERE m.source_page IN (474, 478) AND NOT EXISTS (SELECT 1 FROM public.search_documents d WHERE d.entity_type = 'mcq' AND d.entity_id = m.id);`;
  const audit = { batch_pages: BATCH_PAGES, pipeline_version: PIPELINE_VERSION, source_pages: pages.map(page => ({ page: page.source_page, sha256: page.source_image_sha256, review: page.review.review_status })), generated_fact_candidates: facts.length, generated_notes: notes.length, generated_mcqs: mcqs.length, generated_options: mcqs.length * 4, low_confidence_mcqs: mcqs.filter(row => row.conf === "low").map(row => ({ source_page: row.source_page, number: row.number, reason: "The source answer-key cell is an asterisk rather than a readable option label." })), verification_statuses: Object.groupBy(verificationRows, row => row.status), quality_gates: ["Raw OCR and reviewed transcripts are preserved in per-page artifacts and source_pages.raw_transcription.", "Physical PDF pages remain distinct from printed book page numbers in review metadata.", "Facts, tables, definitions, notes, MCQs, options, answer keys, and exam labels are imported as distinct typed records.", "The page-478 answer-key asterisk is retained as an explicit low-confidence unresolved source answer, not inferred.", "All database writes are idempotent through source-page checks, canonical hashes, or source keys."] };
  const sql = `-- Generated by scripts/prepare_validated_batch_0474_0478.mjs\n-- Source pages: 474–478 only. Do not extend this batch without explicit user instruction.\nBEGIN;\nINSERT INTO public.import_runs (source_filename, source_sha256, pipeline_version, status, completed_at, audit) VALUES ('Jubayer''sgk.pdf', ${q(sha(pages.map(page => page.source_image_sha256).join("|")))}, ${q(PIPELINE_VERSION)}, 'completed', now(), ${qJson(audit)});\n${contextSql}\n${sourcePagesSql}\n${factsSql}\n${notesSql}\n${mcqSql}\n${tagSql}\n${verificationSql}\n${derivedSql}\nCOMMIT;`;
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
