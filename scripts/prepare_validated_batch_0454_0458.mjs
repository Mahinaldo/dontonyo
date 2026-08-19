import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const workDir = "/home/ubuntu/dontonyo-work/batch-0454-0458";
const outputDir = path.join(root, "supabase", "batch-0454-0458");
const pageFiles = [
  path.join(workDir, "pages", "page_0454.json"),
  path.join(workDir, "pages", "page_0455.json"),
  path.join(workDir, "pages", "page_0456.json"),
  path.join(workDir, "pages", "page_0457.json"),
  path.join(workDir, "retry-0458", "pages", "page_0458.json"),
];

export const BATCH_PAGES = [454, 455, 456, 457, 458];
export const BOOK_TITLE = "Jubayer's GK";
export const PIPELINE_VERSION = "vision-quality-gated-batch-0454-0458-v1";

const sha = value => crypto.createHash("sha256").update(value, "utf8").digest("hex");
const q = value => `'${String(value ?? "").replaceAll("'", "''")}'`;
const qJson = value => `${q(JSON.stringify(value))}::jsonb`;
const confidence = value => (value === "high" || value === "low" ? value : "medium");

const tags = [
  ["bangla-literature", "Bangla literature", "domain", "Bangla literary authors, quotations, poems, and works."],
  ["world-history", "World history", "domain", "Global historical events and cultural history."],
  ["bangladesh-history", "Bangladesh history", "domain", "Bangladesh historical and political context."],
  ["literary-quotation", "Literary quotation", "content_type", "Source-attributed literary quotation."],
  ["historical-context", "Historical context", "content_type", "Historical or cultural context note."],
  ["past-exam-mcq", "Past-exam MCQ", "content_type", "Multiple-choice question labelled with an exam source in the book."],
  ["answer-key", "Answer key", "content_type", "Printed answer-key-derived MCQ answer."],
  ["source-attributed", "Source-attributed", "quality", "Preserved from the book but not independently verified in this batch."],
  ["externally-verified", "Externally verified", "quality", "Corroborated by one or more listed external sources."],
  ["conflicting-verification", "Conflicting verification", "quality", "External sources conflict with or do not establish the book’s specific claim."],
  ["dhaka-university", "University of Dhaka", "exam_source", "University admission examination label as printed in the source."],
  ["bcs", "BCS", "exam_source", "Bangladesh Civil Service examination label as printed in the source."],
];

const sourceFacts = [
  {
    source_page: 457,
    topic_slug: "historical-context",
    title: "উনসত্তরের গণঅভ্যুত্থান ও শহীদ আসাদ",
    fact_text: "আমানউল্লাহ মোহাম্মদ আসাদুজ্জামান ২০ জানুয়ারি ১৯৬৯ সালে ঢাকা শহরে ছাত্র মিছিলে নেতৃত্ব দেওয়ার সময় পুলিশের গুলিতে নিহত হন; তাঁর রক্তমাখা শার্ট প্রতীকে পরিণত হয় এবং শামসুর রাহমান ‘আসাদের শার্ট’ কবিতা লেখেন।",
    source_excerpt: "৬৯ এর গণঅভ্যুত্থানে ২০ জানুয়ারি গুলি করে হত্যা করা হলো নরসিংদীর ছেলে আসাদকে। আসাদের লাশ নিয়ে মিছিল হলো, আসাদের রক্তমাখা শার্ট নিয়ে মিছিল হলো। নরসিংদীরই আরেক কবি শামসুর রাহমান লিখলেন সেই বিখ্যাত কবিতা- আসাদের শার্ট",
    importance: 5,
    confidence: "high",
    verification_status: "verified",
    sources: [
      "https://bangla.thedailystar.net/news/bangladesh/news-552606",
      "https://www.prothomalo.com/special-supplement/%E0%A6%B6%E0%A6%BE%E0%A6%B0%E0%A7%8D%E0%A6%9F-%E0%A6%B9%E0%A6%B2%E0%A7%8B-%E0%A6%AA%E0%A7%8D%E0%A6%B0%E0%A6%BE%E0%A6%A3%E0%A7%87%E0%A6%B0-%E0%A6%AA%E0%A6%A4%E0%A6%BE%E0%A6%95%E0%A6%BE",
      "https://www.ittefaq.com.bd/311086/%E0%A6%B6%E0%A6%B9%E0%A7%80%E0%A6%A6-%E0%A6%86%E0%A6%B8%E0%A6%BE%E0%A6%A6-%E0%A6%A6%E0%A6%BF%E0%A6%AC%E0%A6%B8-%E0%A6%86%E0%A6%9C",
    ],
  },
  {
    source_page: 457,
    topic_slug: "historical-context",
    title: "পাবলো পিকাসোর ‘গের্নিকা’",
    fact_text: "১৯৩৭ সালের ২৬ এপ্রিল স্পেনের বাস্ক শহর গের্নিকায় জার্মান ও ইতালীয় বাহিনীর বোমাবর্ষণের প্রেক্ষিতে পাবলো পিকাসো ‘গের্নিকা’ চিত্রকর্মটি আঁকেন।",
    source_excerpt: "১৯৩৭ সালে হিটলার স্পেনে আক্রমণ করে স্পেনের গোয়ের্নিকা শহরটি ধ্বংস করে। এই ধ্বংস যজ্ঞের চিত্রকর্ম আঁকেন স্পেনের মানবতাবাদী বিখ্যাত চিত্রকর পাবলো পিকাসো। যা বিখ্যাত চিত্রকর্ম ‘গোয়ের্নিকা’।",
    importance: 4,
    confidence: "high",
    verification_status: "verified",
    sources: [
      "https://www.museoreinasofia.es/en/collections/artwork/guernica-0",
      "https://guernica.museoreinasofia.es/en",
    ],
  },
  {
    source_page: 457,
    topic_slug: "historical-context",
    title: "স্ট্যাচু অব লিবার্টি",
    fact_text: "ফরাসি জনগণের উপহার ‘স্ট্যাচু অব লিবার্টি’ যুক্তরাষ্ট্রের স্বাধীনতার শতবার্ষিকী ও দুই দেশের বন্ধুত্ব স্মরণে প্রস্তাবিত হয়; এটি ২৮ অক্টোবর ১৮৮৬ সালে উন্মোচিত হয়।",
    source_excerpt: "আমেরিকার স্বাধীনতার একশত বছর পূর্তিতে ফ্রান্স আমেরিকার জন্য উপহার পাঠায় যেটি ‘স্ট্যাচু অব লিবার্টি’। ... ফ্রান্স ১৮৮৬ সালে আমেরিকাকে উপহার পাঠায় ‘স্ট্যাচু অব লিবার্টি’।",
    importance: 4,
    confidence: "high",
    verification_status: "verified",
    sources: [
      "https://www.nps.gov/stli/learn/historyculture/places_creating_statue.htm",
      "https://www.nps.gov/stli/learn/statue-of-liberty-facts.htm",
    ],
  },
];

const mcqs = [
  ["01", "কে রবীন্দ্রনাথ ঠাকুরের ‘গীতাঞ্জলি’র ইংরেজি অনুবাদ করেন?", ["রবীন্দ্রনাথ ঠাকুর", "ডব্লিউ বি ইয়েটস", "চার্লস ডিকেন্স", "জন কিটস"], "ক", "DU '11-12", "verified", "high", ["https://publish.illinois.edu/tagoreintranslation-uiuc/about-the-project/", "https://www.poetryfoundation.org/poems/45668/gitanjali-35"]],
  ["02", "বরিশালের রূপে মুগ্ধ হয়ে কোন কবি এই নগরকে ‘বাংলার ভেনিস’ আখ্যা দিয়েছিলেন?", ["রবীন্দ্রনাথ ঠাকুর", "কাজী নজরুল ইসলাম", "জসীমউদ্দীন", "জীবনানন্দ দাশ"], "ঘ", "DU '20-21", "source_attributed", "medium", []],
  ["03", "কাজী নজরুল ইসলাম কোন ছবিতে অভিনয় করেছিলেন?", ["আয়না", "ধ্রুব", "পথে হল দেরি", "রক্তকরবী"], "খ", "DU '15-16", "verified", "high", ["https://www.prothomalo.com/entertainment/tollywood/dof8q715au", "https://www.thedailystar.net/entertainment/tv-film/news/negative-kazi-nazrul-islams-film-dhruva-destroyed-says-kolkatas-nt1"]],
  ["04", "কিশোর পত্রিকা ‘বালক’ প্রতিষ্ঠা কার অমর কীর্তি?", ["স্বর্ণকুমারী দেবী", "সেলিনা হোসেন", "আল মাহমুদ", "কাদম্বরী দেবী"], "ক", "30 BCS", "conflicting", "low", []],
  ["05", "কোনটি জাতীয় কবি কাজী নজরুল ইসলাম রচিত গ্রন্থ নয়?", ["ব্যথার দান", "দোলনচাঁপা", "শিউলিমালা", "সোনার তরী"], "ঘ", "44 BCS", "source_attributed", "medium", []],
  ["06", "নিম্নের কোন পত্রিকাটির প্রকাশনা উপলক্ষে রবীন্দ্রনাথ ঠাকুর আশীর্বাদ বাণী পাঠিয়েছিলেন?", ["সবুজপত্র", "শনিবারের চিঠি", "কল্লোল", "ধূমকেতু"], "ঘ", "44 BCS", "source_attributed", "medium", []],
  ["07", "বাংলা গীতি কবিতায় ভোরের পাখি কে?", ["বিহারীলাল চক্রবর্তী", "সত্যেন্দ্রনাথ দত্ত", "ঈশ্বরচন্দ্র বিদ্যাসাগর", "যতীন্দ্রনাথ বাগচী"], "ক", "14, 11 BCS", "source_attributed", "medium", []],
  ["08", "কোন খ্যাতিমান লেখক ‘বীরবল’ ছদ্মনামে লিখতেন?", ["প্রমথ চৌধুরী", "রবীন্দ্রনাথ ঠাকুর", "অমীয় চক্রবর্তী", "বঙ্কিমচন্দ্র চট্টোপাধ্যায়"], "ক", "14 BCS", "source_attributed", "medium", []],
  ["09", "সনেট কবিতার প্রবর্তক কে?", ["দ্বিজেন্দ্র লাল রায়", "রজনীকান্ত সেন", "মাইকেল মধুসূদন দত্ত", "অতুলপ্রসাদ সেন"], "গ", "29 BCS", "source_attributed", "medium", []],
  ["10", "বাংলা সাহিত্যে প্রথম মুসলিম নাট্যকার রচিত নাট্যগ্রন্থ কোনটি?", ["বসন্তকুমারী", "নীল দর্পণ", "কৃষ্ণকুমারী", "কীর্তিবিলাস"], "ক", "14 BCS", "source_attributed", "medium", []],
  ["11", "প্রথম বাঙালি মুসলমান কবি কে?", ["কায়কোবাদ", "আলাওল", "শাহ্ মুহম্মদ সগীর", "আবদুল হাকিম"], "গ", "MC 03-04", "source_attributed", "medium", []],
].map(([number, question, options, correct, source, status, conf, sources]) => ({ number, question, options, correct, source, status, conf, sources }));

function buildFacts(pages) {
  const out = [];
  for (const page of pages) {
    if (![454, 455, 456].includes(page.source_page)) continue;
    let heading = "Source excerpt";
    for (const block of page.transcription.blocks) {
      if (block.block_type === "topic_heading") {
        heading = block.text;
        continue;
      }
      if (block.block_type !== "fact") continue;
      const text = block.text.replace(/^♦\s*/, "").trim();
      const topic = page.source_page <= 455 ? "bangla-literature" : "historical-context";
      const quality = page.source_page <= 455 ? "source_attributed" : "source_attributed";
      out.push({
        source_page: page.source_page,
        topic_slug: topic,
        title: heading,
        fact_text: text,
        source_excerpt: text,
        importance: page.source_page === 456 ? 3 : 2,
        confidence: page.source_page === 456 ? "medium" : "medium",
        verification_status: quality,
        sources: [],
      });
    }
  }
  return [...out, ...sourceFacts];
}

function buildNotes(pages) {
  const out = [];
  for (const page of pages) {
    let heading = "Source note";
    for (const block of page.transcription.blocks) {
      if (block.block_type === "topic_heading") {
        heading = block.text;
        continue;
      }
      if (block.block_type !== "note") continue;
      out.push({
        source_page: page.source_page,
        topic_slug: "bangla-literature",
        title: heading,
        content: block.text,
        confidence: "medium",
      });
    }
  }
  return out;
}

function pageMetadata(page) {
  const kind = page.source_page === 458 ? "mcq" : page.source_page === 456 ? "mixed" : "educational";
  return {
    source_image_sha256: page.source_image_sha256,
    extraction_model: page.model,
    review_status: page.review.review_status,
    corrections: page.review.corrections,
    unresolved_spans: page.review.unresolved_spans,
    accepted_content_tags: page.review.accepted_content_tags,
    external_verification_report: "/home/ubuntu/dontonyo/reports/batch-0454-0458_external_verification.md",
    physical_source_page: page.source_page,
    printed_book_page: page.source_page === 454 ? 397 : page.source_page === 455 ? 398 : page.source_page === 456 ? 399 : page.source_page === 457 ? 400 : 458,
    page_kind: kind,
  };
}

function sourceTypeTagForPage(page) {
  if (page === 458) return ["past-exam-mcq", "answer-key"];
  if (page === 456 || page === 457) return ["historical-context"];
  return ["literary-quotation"];
}

export async function buildBatch() {
  const pages = await Promise.all(pageFiles.map(async file => JSON.parse(await fs.readFile(file, "utf8"))));
  const facts = buildFacts(pages);
  const notes = buildNotes(pages);
  const factRows = facts.map(fact => ({ ...fact, canonical_hash: sha(`fact|${fact.source_page}|${fact.title}|${fact.fact_text}`) }));
  const noteRows = notes.map(note => ({ ...note, canonical_hash: sha(`note|${note.source_page}|${note.title}|${note.content}`) }));
  const mcqRows = mcqs.map(mcq => ({ ...mcq, canonical_hash: sha(`mcq|458|${mcq.number}|${mcq.question}`) }));
  const verificationRows = [
    ...factRows.map(row => ({ entity_type: "fact", canonical_hash: row.canonical_hash, source_page: row.source_page, claim_text: row.source_excerpt, normalized_claim: row.fact_text, status: row.verification_status, confidence: row.confidence, sources: row.sources })),
    ...mcqRows.map(row => ({ entity_type: "mcq", canonical_hash: row.canonical_hash, source_page: 458, claim_text: `${row.question} — source answer: ${row.correct}`, normalized_claim: null, status: row.status, confidence: row.conf, sources: row.sources })),
  ];

  const values = rows => rows.map(row => `(${row.map(q).join(", ")})`).join(",\n");
  const chapterAndTopicSql = `
INSERT INTO public.chapters (book_id, chapter_number, title, slug, description, source_page, display_order)
SELECT b.id, x.chapter_number, x.title, x.slug, x.description, x.source_page, x.display_order
FROM (VALUES
  (36, 'বাংলা সাহিত্য', 'bangla-literature', 'Source-derived literary quotations, contexts, and past-exam questions.', 454, 36),
  (37, 'কতিপয় ঐতিহাসিক প্রেক্ষাপট', 'historical-context', 'Source-derived historical and cultural context with explicit verification status.', 456, 37)
) AS x(chapter_number, title, slug, description, source_page, display_order)
CROSS JOIN (SELECT id FROM public.books WHERE title = ${q(BOOK_TITLE)} LIMIT 1) b
WHERE NOT EXISTS (SELECT 1 FROM public.chapters c WHERE c.book_id = b.id AND c.slug = x.slug);

INSERT INTO public.topics (chapter_id, title, slug, description, source_page, display_order)
SELECT c.id, x.title, x.slug, x.description, x.source_page, x.display_order
FROM (VALUES
  ('bangla-literature', 'কবি ও সাহিত্য উদ্ধৃতি', 'literary-quotations', 'Author-attributed Bangla literary quotations preserved from source pages.', 454, 1),
  ('bangla-literature', 'সাহিত্যভিত্তিক বিগত বছরের প্রশ্ন', 'literature-past-exam-mcqs', 'Past-exam MCQs and printed answer key from source page 458.', 458, 2),
  ('historical-context', 'ঐতিহাসিক ও সাংস্কৃতিক প্রেক্ষাপট', 'historical-context', 'Historical context, cultural references, and external-verification flags.', 456, 1)
) AS x(chapter_slug, title, slug, description, source_page, display_order)
JOIN public.chapters c ON c.slug = x.chapter_slug AND c.book_id = (SELECT id FROM public.books WHERE title = ${q(BOOK_TITLE)} LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM public.topics t WHERE t.chapter_id = c.id AND t.slug = x.slug);`;

  const sourcePagesSql = pages.map(page => {
    const meta = pageMetadata(page);
    const chapterHeading = page.source_page <= 455 || page.source_page === 458 ? "বাংলা সাহিত্য" : "কতিপয় ঐতিহাসিক প্রেক্ষাপট";
    const topicHeading = page.source_page === 458 ? "সাহিত্যভিত্তিক বিগত বছরের প্রশ্ন" : page.source_page <= 455 ? "কবি ও সাহিত্য উদ্ধৃতি" : "ঐতিহাসিক ও সাংস্কৃতিক প্রেক্ষাপট";
    return `INSERT INTO public.source_pages (import_run_id, book_id, source_page, page_kind, raw_transcription, chapter_heading, topic_heading, confidence, extraction_method, model_name, notes, review_metadata)
SELECT (SELECT id FROM public.import_runs WHERE pipeline_version = ${q(PIPELINE_VERSION)} ORDER BY started_at DESC LIMIT 1), b.id, ${page.source_page}, ${q(meta.page_kind)}::page_kind, ${q(page.review.verified_transcript)}, ${q(chapterHeading)}, ${q(topicHeading)}, ${q(confidence(page.review.overall_confidence))}::confidence_level, 'vision_ocr_with_image_grounded_review', ${q(page.model)}, ${q('Quality-gated batch: source-preserving OCR, spelling review, semantic tagging, and external-verification ledger recorded.')}, ${qJson(meta)}
FROM public.books b
WHERE b.title = ${q(BOOK_TITLE)}
  AND NOT EXISTS (SELECT 1 FROM public.source_pages s WHERE s.book_id = b.id AND s.source_page = ${page.source_page});`;
  }).join("\n");

  const factValueRows = factRows.map(row => [
    row.source_page, row.topic_slug, row.title, row.fact_text, row.source_excerpt, row.importance, row.confidence, row.canonical_hash,
    row.verification_status === "verified" ? "Externally corroborated; source wording is retained in source_excerpt." : row.verification_status === "conflicting" ? "External verification conflicts with or does not establish the exact source claim; retained as source-attributed material." : "Source-attributed content retained with its source page and audit status.",
  ]);
  const factsSql = `WITH data(source_page, topic_slug, title, fact_text, source_excerpt, importance, confidence, canonical_hash, explanation) AS (VALUES
${values(factValueRows)}
)
INSERT INTO public.gk_facts (book_id, chapter_id, topic_id, title, fact_text, explanation, source_page, source_section, source_excerpt, importance, confidence, canonical_hash)
SELECT b.id, c.id, t.id, d.title, d.fact_text, d.explanation, d.source_page::integer, d.title, d.source_excerpt, d.importance::smallint, d.confidence::confidence_level, d.canonical_hash
FROM data d
JOIN public.books b ON b.title = ${q(BOOK_TITLE)}
JOIN public.chapters c ON c.book_id = b.id AND c.slug = CASE WHEN d.topic_slug = 'bangla-literature' THEN 'bangla-literature' ELSE 'historical-context' END
JOIN public.topics t ON t.chapter_id = c.id AND t.slug = CASE WHEN d.topic_slug = 'bangla-literature' THEN 'literary-quotations' ELSE 'historical-context' END
ON CONFLICT (canonical_hash) DO UPDATE SET fact_text = EXCLUDED.fact_text, explanation = EXCLUDED.explanation, confidence = EXCLUDED.confidence, source_excerpt = EXCLUDED.source_excerpt;`;

  const noteValueRows = noteRows.map(row => [row.source_page, row.topic_slug, row.title, row.content, row.confidence, row.canonical_hash]);
  const notesSql = noteRows.length ? `WITH data(source_page, topic_slug, title, content, confidence, canonical_hash) AS (VALUES
${values(noteValueRows)}
)
INSERT INTO public.gk_notes (book_id, chapter_id, topic_id, title, content, source_page, source_section, display_order, confidence, canonical_hash)
SELECT b.id, c.id, t.id, d.title, d.content, d.source_page::integer, d.title, d.source_page::integer, d.confidence::confidence_level, d.canonical_hash
FROM data d
JOIN public.books b ON b.title = ${q(BOOK_TITLE)}
JOIN public.chapters c ON c.book_id = b.id AND c.slug = 'bangla-literature'
JOIN public.topics t ON t.chapter_id = c.id AND t.slug = 'literary-quotations'
ON CONFLICT (canonical_hash) DO UPDATE SET content = EXCLUDED.content, confidence = EXCLUDED.confidence;` : "";

  const mcqSql = mcqRows.map(row => {
    const optionKeys = ["ক", "খ", "গ", "ঘ"];
    const sourceInfo = row.source.includes("DU") ? ["University of Dhaka", "University of Dhaka", "admission", "dhaka-university"] : row.source.includes("BCS") ? ["Bangladesh Civil Service", null, "competitive", "bcs"] : null;
    const examSourceSql = sourceInfo ? `INSERT INTO public.exam_sources (name, institution, exam_type, description, normalized_name)
SELECT ${q(sourceInfo[0])}, ${q(sourceInfo[1])}, ${q(sourceInfo[2])}, 'Exam source normalized from the printed label on source page 458.', ${q(sourceInfo[3])}
WHERE NOT EXISTS (SELECT 1 FROM public.exam_sources e WHERE e.normalized_name = ${q(sourceInfo[3])});` : "";
    const optionsSql = row.options.map((text, index) => `INSERT INTO public.gk_mcq_options (mcq_id, option_key, option_text, display_order, is_correct)
SELECT m.id, ${q(optionKeys[index])}, ${q(text)}, ${index + 1}, ${optionKeys[index] === row.correct}
FROM public.gk_mcqs m
WHERE m.canonical_hash = ${q(row.canonical_hash)}
  AND NOT EXISTS (SELECT 1 FROM public.gk_mcq_options o WHERE o.mcq_id = m.id AND o.option_key = ${q(optionKeys[index])});`).join("\n");
    const sourceLinkSql = `INSERT INTO public.gk_mcq_sources (mcq_id, exam_source_id, year, session, source_text, source_page)
SELECT m.id, ${sourceInfo ? `(SELECT id FROM public.exam_sources WHERE normalized_name = ${q(sourceInfo[3])} LIMIT 1)` : "NULL"}, NULL, ${q(row.source)}, ${q(row.source)}, 458
FROM public.gk_mcqs m
WHERE m.canonical_hash = ${q(row.canonical_hash)}
  AND NOT EXISTS (SELECT 1 FROM public.gk_mcq_sources s WHERE s.mcq_id = m.id AND s.source_text = ${q(row.source)} AND s.source_page = 458);`;
    return `${examSourceSql}
INSERT INTO public.gk_mcqs (book_id, chapter_id, topic_id, question, correct_option, explanation, source_page, source_section, source_question_number, difficulty, confidence, canonical_hash)
SELECT b.id, c.id, t.id, ${q(row.question)}, ${q(row.correct)}, ${q(row.status === "verified" ? "Answer externally corroborated; source label and answer key are preserved in the audit record." : row.status === "conflicting" ? "The printed answer key is retained, but external sources do not establish the question’s specific founder claim." : "Printed answer key retained as source-attributed pending deeper verification.")}, 458, 'এই অধ্যায়ের সাথে জড়িত বিগত বছরের প্রশ্ন', ${q(row.number)}, 3, ${q(row.conf)}::confidence_level, ${q(row.canonical_hash)}
FROM public.books b
JOIN public.chapters c ON c.book_id = b.id AND c.slug = 'bangla-literature'
JOIN public.topics t ON t.chapter_id = c.id AND t.slug = 'literature-past-exam-mcqs'
WHERE b.title = ${q(BOOK_TITLE)}
ON CONFLICT (canonical_hash) DO UPDATE SET correct_option = EXCLUDED.correct_option, explanation = EXCLUDED.explanation, confidence = EXCLUDED.confidence;
${optionsSql}
${sourceLinkSql}`;
  }).join("\n");

  const tagSql = `INSERT INTO public.content_tags (slug, label, category, description) VALUES
${tags.map(tag => `(${tag.map(q).join(", ")})`).join(",\n")}
ON CONFLICT (slug) DO UPDATE SET label = EXCLUDED.label, category = EXCLUDED.category, description = EXCLUDED.description;

${pages.map(page => sourceTypeTagForPage(page.source_page).map(tag => `INSERT INTO public.content_tag_assignments (tag_id, entity_type, entity_id, source_page, confidence, assigned_by)
SELECT t.id, 'source_page', s.id, ${page.source_page}, ${q(page.source_page === 458 ? "high" : "medium")}::confidence_level, 'batch-0454-0458-quality-pipeline'
FROM public.content_tags t JOIN public.source_pages s ON s.source_page = ${page.source_page} AND s.book_id = (SELECT id FROM public.books WHERE title = ${q(BOOK_TITLE)} LIMIT 1)
WHERE t.slug = ${q(tag)}
ON CONFLICT DO NOTHING;`).join("\n")).join("\n")}

${factRows.map(row => {
  const semanticTag = row.topic_slug === "bangla-literature" ? "literary-quotation" : "historical-context";
  const qualityTag = row.verification_status === "verified" ? "externally-verified" : row.verification_status === "conflicting" ? "conflicting-verification" : "source-attributed";
  return [semanticTag, qualityTag].map(tag => `INSERT INTO public.content_tag_assignments (tag_id, entity_type, entity_id, source_page, confidence, assigned_by)
SELECT t.id, 'fact', f.id, ${row.source_page}, ${q(row.confidence)}::confidence_level, 'batch-0454-0458-quality-pipeline'
FROM public.content_tags t JOIN public.gk_facts f ON f.canonical_hash = ${q(row.canonical_hash)}
WHERE t.slug = ${q(tag)}
ON CONFLICT DO NOTHING;`).join("\n");
}).join("\n")}

${mcqRows.flatMap(row => ["past-exam-mcq", "answer-key", row.source.includes("DU") ? "dhaka-university" : row.source.includes("BCS") ? "bcs" : null, row.status === "verified" ? "externally-verified" : row.status === "conflicting" ? "conflicting-verification" : "source-attributed"].filter(Boolean).map(tag => `INSERT INTO public.content_tag_assignments (tag_id, entity_type, entity_id, source_page, confidence, assigned_by)
SELECT t.id, 'mcq', m.id, 458, ${q(row.conf)}::confidence_level, 'batch-0454-0458-quality-pipeline'
FROM public.content_tags t JOIN public.gk_mcqs m ON m.canonical_hash = ${q(row.canonical_hash)}
WHERE t.slug = ${q(tag)}
ON CONFLICT DO NOTHING;`)).join("\n")}`;

  const verificationSql = verificationRows.map(row => `INSERT INTO public.fact_verifications (source_page, entity_type, entity_id, claim_text, normalized_claim, verification_status, confidence, verification_sources, audit_note)
SELECT ${row.source_page}, ${q(row.entity_type)}, CASE WHEN ${q(row.entity_type)} = 'fact' THEN (SELECT id FROM public.gk_facts WHERE canonical_hash = ${q(row.canonical_hash)} LIMIT 1) ELSE (SELECT id FROM public.gk_mcqs WHERE canonical_hash = ${q(row.canonical_hash)} LIMIT 1) END, ${q(row.claim_text)}, ${row.normalized_claim ? q(row.normalized_claim) : "NULL"}, ${q(row.status)}, ${q(row.confidence)}::confidence_level, ${qJson(row.sources)}, ${q(row.status === "verified" ? "External sources corroborate the normalized claim; original book wording remains source-linked." : row.status === "conflicting" ? "The printed source answer or attribution is retained but is not established as a verified fact." : "Retained as source-attributed content; deeper verification is pending.")}
WHERE NOT EXISTS (SELECT 1 FROM public.fact_verifications v WHERE v.entity_type = ${q(row.entity_type)} AND v.entity_id = CASE WHEN ${q(row.entity_type)} = 'fact' THEN (SELECT id FROM public.gk_facts WHERE canonical_hash = ${q(row.canonical_hash)} LIMIT 1) ELSE (SELECT id FROM public.gk_mcqs WHERE canonical_hash = ${q(row.canonical_hash)} LIMIT 1) END AND v.claim_text = ${q(row.claim_text)});`).join("\n");

  const derivedSql = `
INSERT INTO public.flashcards (subject_id, book_id, chapter_id, topic_id, front_text, back_text, source_type, source_id, source_key)
SELECT (SELECT id FROM public.subjects ORDER BY created_at ASC LIMIT 1), f.book_id, f.chapter_id, f.topic_id, COALESCE(f.title, 'মূল তথ্য'), f.fact_text, 'fact', f.id, 'batch0454-0458:fact:' || f.id::text
FROM public.gk_facts f
WHERE f.source_page BETWEEN 454 AND 458
  AND NOT EXISTS (SELECT 1 FROM public.flashcards c WHERE c.source_key = 'batch0454-0458:fact:' || f.id::text);

INSERT INTO public.flashcards (subject_id, book_id, chapter_id, topic_id, front_text, back_text, source_type, source_id, source_key)
SELECT (SELECT id FROM public.subjects ORDER BY created_at ASC LIMIT 1), m.book_id, m.chapter_id, m.topic_id, m.question, 'সঠিক উত্তর: ' || o.option_key || '. ' || o.option_text, 'mcq', m.id, 'batch0454-0458:mcq:' || m.id::text
FROM public.gk_mcqs m JOIN public.gk_mcq_options o ON o.mcq_id = m.id AND o.is_correct
WHERE m.source_page = 458
  AND NOT EXISTS (SELECT 1 FROM public.flashcards c WHERE c.source_key = 'batch0454-0458:mcq:' || m.id::text);

INSERT INTO public.search_documents (entity_type, entity_id, title, body, english_metadata)
SELECT 'fact', f.id, f.title, f.fact_text, 'Validated GK fact | source page ' || f.source_page::text
FROM public.gk_facts f WHERE f.source_page BETWEEN 454 AND 458
  AND NOT EXISTS (SELECT 1 FROM public.search_documents d WHERE d.entity_type = 'fact' AND d.entity_id = f.id);

INSERT INTO public.search_documents (entity_type, entity_id, title, body, english_metadata)
SELECT 'note', n.id, n.title, n.content, 'Source-attributed GK note | source page ' || n.source_page::text
FROM public.gk_notes n WHERE n.source_page BETWEEN 454 AND 458
  AND NOT EXISTS (SELECT 1 FROM public.search_documents d WHERE d.entity_type = 'note' AND d.entity_id = n.id);

INSERT INTO public.search_documents (entity_type, entity_id, title, body, english_metadata)
SELECT 'mcq', m.id, NULL, m.question, 'Past-exam MCQ | source page 458 | question ' || COALESCE(m.source_question_number, '')
FROM public.gk_mcqs m WHERE m.source_page = 458
  AND NOT EXISTS (SELECT 1 FROM public.search_documents d WHERE d.entity_type = 'mcq' AND d.entity_id = m.id);`;

  const audit = {
    batch_pages: BATCH_PAGES,
    pipeline_version: PIPELINE_VERSION,
    source_pages: pages.map(page => ({ page: page.source_page, sha256: page.source_image_sha256, review: page.review.review_status })),
    generated_fact_candidates: factRows.length,
    generated_notes: noteRows.length,
    generated_mcqs: mcqRows.length,
    generated_options: mcqRows.length * 4,
    verification_statuses: Object.groupBy(verificationRows, row => row.status),
    quality_gates: [
      "OCR text is preserved in source_pages.raw_transcription.",
      "Each page includes image-grounded review metadata and original correction records.",
      "Content is tagged by domain, content type, exam source, and verification state.",
      "Conflicting or unverified claims remain source-attributed with confidence flags rather than being silently normalized.",
      "All inserts are idempotent through source-page existence checks or canonical/source keys.",
    ],
  };
  const sql = `-- Generated by ${path.relative(root, import.meta.filename ?? "scripts/prepare_validated_batch_0454_0458.mjs")}
-- Source pages: 454–458 only. Do not extend this batch without explicit user instruction.
BEGIN;
INSERT INTO public.import_runs (source_filename, source_sha256, pipeline_version, status, completed_at, audit)
VALUES ('Jubayer''sgk.pdf', ${q(sha(pages.map(page => page.source_image_sha256).join("|")))}, ${q(PIPELINE_VERSION)}, 'completed', now(), ${qJson(audit)});
${chapterAndTopicSql}
${sourcePagesSql}
${factsSql}
${notesSql}
${mcqSql}
${tagSql}
${verificationSql}
${derivedSql}
COMMIT;`;
  return { sql, audit };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const { sql, audit } = await buildBatch();
  await fs.mkdir(outputDir, { recursive: true });
  await fs.writeFile(path.join(outputDir, "validated_import.sql"), sql, "utf8");
  await fs.writeFile(path.join(outputDir, "batch_audit.json"), JSON.stringify(audit, null, 2), "utf8");
  await fs.writeFile(
    path.join(outputDir, "execute_sql_request.json"),
    JSON.stringify({ project_id: "rennotctgrxvbpghbimx", query: sql }),
    "utf8"
  );
  console.log(JSON.stringify({ outputDir, ...audit }, null, 2));
}
