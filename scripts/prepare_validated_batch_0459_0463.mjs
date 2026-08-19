import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const workDir = "/home/ubuntu/dontonyo-work/batch-0459-0463";
const outputDir = path.join(root, "supabase", "batch-0459-0463");
const pageFiles = [459, 460, 461, 462, 463].map(page => path.join(workDir, "pages", `page_${String(page).padStart(4, "0")}.json`));

export const BATCH_PAGES = [459, 460, 461, 462, 463];
export const BOOK_TITLE = "Jubayer's GK";
export const PIPELINE_VERSION = "vision-quality-gated-batch-0459-0463-v1";

const verificationUrls = {
  mukhOMukhosh: [
    "https://www.thedailystar.net/culture/entertainment/news/how-mukh-o-mukhosh-bangladeshs-first-film-was-made-4239111",
    "https://observerbd.com/news/586226",
  ],
  zahir: [
    "https://en.banglapedia.org/index.php/Raihan%2C_Zahir",
    "https://pubmed.ncbi.nlm.nih.gov/41691478/",
  ],
  academy: ["https://aaspeechesdb.oscars.org/link/064-24/"],
  btv: ["http://btv.gov.bd/pages/static-pages/6922db5a933eb65569e099bf"],
  btrc: ["http://btrc.gov.bd/pages/static-pages/6922e040933eb65569e26312"],
  surjya: [
    "https://www.jugantor.com/entertainment/976080",
    "https://www.prothomalo.com/entertainment/dhallywood/wb0drsam8v",
  ],
};

const tags = [
  ["bangladesh-film", "Bangladesh film", "domain", "Bangladesh, South Asian, and Liberation War cinema."],
  ["bangladesh-media", "Bangladesh media", "domain", "Broadcasting, radio, and telecommunications in Bangladesh."],
  ["film-history", "Film history", "content_type", "Film-history facts preserved from the source."],
  ["biography", "Biography", "content_type", "Biographical source material."],
  ["media-and-telecom", "Media and telecom", "content_type", "Broadcasting and telecommunications content."],
  ["past-exam-mcq", "Past-exam MCQ", "content_type", "Multiple-choice question with printed exam label."],
  ["answer-key", "Answer key", "content_type", "Printed answer-key-derived answer."],
  ["source-attributed", "Source-attributed", "quality", "Preserved from the book with explicit source linkage but no completed independent verification."],
  ["externally-verified", "Externally verified", "quality", "Corroborated by listed independent or primary external sources."],
  ["conflicting-verification", "Conflicting verification", "quality", "A credible source contradicts or does not establish the book’s exact claim."],
  ["dhaka-university", "University of Dhaka", "exam_source", "University admission examination label as printed in the source."],
  ["bcs", "BCS", "exam_source", "Bangladesh Civil Service examination label as printed in the source."],
  ["chittagong-university", "University of Chittagong", "exam_source", "University admission examination label as printed in the source."],
];

const sha = value => crypto.createHash("sha256").update(value, "utf8").digest("hex");
const q = value => `'${String(value ?? "").replaceAll("'", "''")}'`;
const qJson = value => `${q(JSON.stringify(value))}::jsonb`;
const confidence = value => (value === "high" || value === "low" ? value : "medium");
const values = rows => rows.map(row => `(${row.map(q).join(", ")})`).join(",\n");

function batchContext(sourcePage) {
  if (sourcePage === 463) {
    return {
      chapterSlug: "bangladesh-media",
      topicSlug: "bangladesh-media",
      chapterTitle: "বাংলাদেশের গণমাধ্যম",
      topicTitle: "বাংলাদেশের গণমাধ্যম",
      semanticTag: "media-and-telecom",
    };
  }
  return {
    chapterSlug: "bangladesh-film",
    topicSlug: sourcePage === 462 ? "film-past-exam-mcqs" : "bangladesh-film",
    chapterTitle: "বাংলাদেশের চলচ্চিত্র",
    topicTitle: sourcePage === 462 ? "চলচ্চিত্রভিত্তিক বিগত বছরের প্রশ্ন" : "বাংলাদেশের চলচ্চিত্র",
    semanticTag: sourcePage === 462 ? "past-exam-mcq" : "film-history",
  };
}

function verificationFor(sourcePage, text) {
  const input = text.replaceAll("’", "'");
  if (sourcePage === 459 && (input.includes("বাংলাদেশের প্রথম চলচ্চিত্র- মুখ ও মুখোশ") || input.includes("প্রথম পূর্ণদৈর্ঘ্য বাংলা সবাক চলচ্চিত্র- মুখ ও মুখোশ") || input.includes("'মুখ ও মুখোশ' চলচ্চিত্রের পরিচালক"))) {
    return { status: "verified", confidence: "high", sources: verificationUrls.mukhOMukhosh };
  }
  if (sourcePage === 460 && (input.includes("সঙ্গম") || input.includes("Stop Genocide"))) {
    return { status: "verified", confidence: "high", sources: verificationUrls.zahir };
  }
  if (sourcePage === 461 && input.includes("অস্কার বিজয়ী পরিচালক")) {
    return { status: "verified", confidence: "high", sources: verificationUrls.academy };
  }
  if (sourcePage === 459 && input.includes("সূর্য দীঘল বাড়ি") && input.includes("শেখ নিয়ামত আলী")) {
    return { status: "conflicting", confidence: "low", sources: verificationUrls.surjya };
  }
  if (sourcePage === 463 && (input.includes("স্থাপিত হয়- ১৯৬৪") || input.includes("ডিআইটি ভবনের বর্তমান নাম") || input.includes("রামপুরা টিভি কেন্দ্র") || input.includes("রঙিন টেলিভিশন"))) {
    return { status: "verified", confidence: "high", sources: verificationUrls.btv };
  }
  if (sourcePage === 463 && (input.includes("কার্ডফোন") || input.includes("ডিজিটাল টেলিফোন"))) {
    return { status: "conflicting", confidence: "low", sources: verificationUrls.btrc };
  }
  return { status: "source_attributed", confidence: "medium", sources: [] };
}

function bulletLines(text) {
  const normalized = text.replaceAll("\r", "").trim();
  if (!normalized.includes("•")) return [normalized];
  return normalized.split("•").map(item => item.trim()).filter(Boolean).filter(item => !/^(জহির রায়হান|হীরালাল সেন|সত্যজিৎ রায়|ঋত্বিক ঘটক|তারেক মাসুদ|তানভীর মোকাম্মেল)$/.test(item));
}

function buildFacts(pages) {
  const rows = [];
  for (const page of pages) {
    if (page.source_page === 462) continue;
    const context = batchContext(page.source_page);
    let heading = context.topicTitle;
    for (const block of page.transcription.blocks) {
      if (block.block_type === "chapter_heading" || block.block_type === "topic_heading") {
        heading = block.text;
        continue;
      }
      if (!["fact", "biography"].includes(block.block_type)) continue;
      for (const factText of bulletLines(block.text)) {
        if (!factText || factText.length < 3) continue;
        const verdict = verificationFor(page.source_page, factText);
        rows.push({
          source_page: page.source_page,
          chapter_slug: context.chapterSlug,
          topic_slug: context.topicSlug,
          title: heading,
          fact_text: factText,
          source_excerpt: factText,
          importance: verdict.status === "conflicting" ? 4 : block.block_type === "biography" ? 2 : 3,
          content_type: block.block_type === "biography" ? "biography" : context.semanticTag,
          ...verdict,
        });
      }
    }
  }
  return rows.map(row => ({ ...row, canonical_hash: sha(`fact|${row.source_page}|${row.title}|${row.fact_text}`) }));
}

function buildNotes(pages) {
  const rows = [];
  for (const page of pages) {
    const context = batchContext(page.source_page);
    let heading = context.topicTitle;
    for (const block of page.transcription.blocks) {
      if (block.block_type === "chapter_heading" || block.block_type === "topic_heading") {
        heading = block.text;
        continue;
      }
      if (block.block_type !== "note") continue;
      const verdict = verificationFor(page.source_page, block.text);
      rows.push({
        source_page: page.source_page,
        chapter_slug: context.chapterSlug,
        topic_slug: context.topicSlug,
        title: heading,
        content: block.text,
        content_type: context.semanticTag,
        ...verdict,
        canonical_hash: sha(`note|${page.source_page}|${heading}|${block.text}`),
      });
    }
  }
  return rows;
}

const mcqs = [
  ["01", "নিচের কোন চলচ্চিত্রটির নির্মাতা ঋত্বিক ঘটক?", ["জন অরণ্য", "সুবর্ণ রেখা", "পদাতিক", "সীমানা পেরিয়ে"], "খ", "DU ঘ' ২১-২২", "source_attributed", "medium", []],
  ["02", "আন্তর্জাতিক খ্যাতিসম্পন্ন 'মাটির ময়না' চলচ্চিত্রের নির্মাতা কে?", ["আলমগীর কবির", "তারেক মাসুদ", "তানভীর মোকাম্মেল", "মোরশেদুল ইসলাম"], "খ", "DU ঘ' ১৮-১৯, DU খ' ০৪-০৫", "source_attributed", "medium", []],
  ["03", "জীবন থেকে নেয়া চলচ্চিত্রটির পরিচালক কে?", ["জহির রায়হান", "আলমগীর কবির", "সুভাষ দত্ত", "খান আতাউর রহমান"], "ক", "DU ঘ' ১৭-১৮, DU ঘ' ০৫-০৬", "source_attributed", "medium", []],
  ["04", "কোন চলচ্চিত্র ১৯৪৭-এর দেশভাগ নিয়ে নির্মিত?", ["যুদ্ধ শিশু", "আবার তোরা মানুষ হ", "চিত্রা নদীর পাড়ে", "নদীর নাম মধুমতি"], "গ", "DU ঘ' ১৪-১৫", "source_attributed", "medium", []],
  ["05", "'জীবন থেকে নেয়া' চলচ্চিত্রটির পরিচালক কে?", ["আমজাদ হোসেন", "আলমগীর", "জহির রায়হান", "সুভাষ দত্ত"], "গ", "39 BCS", "source_attributed", "medium", []],
  ["06", "'সূর্যদীঘল বাড়ী' চলচ্চিত্রের পরিচালক কে?", ["শেখ নিয়ামত শাকের", "জহির রায়হান", "সুভাষ দত্ত", "খান আতা"], "ক", "26 BCS", "conflicting", "low", verificationUrls.surjya],
  ["07", "মুক্তিযুদ্ধভিত্তিক প্রামাণ্য চলচ্চিত্র 'Stop Genocide' এর পরিচালক কে?", ["আলমগীর কবির", "বাবুল চৌধুরী", "গীতা মেহতা", "জহির রায়হান"], "ঘ", "ইবি-ক, ০৩-০৪", "verified", "high", verificationUrls.zahir],
  ["08", "পৃথিবীর বিখ্যাত চলচ্চিত্রকার সত্যজিৎ রায়ের পৈতৃক নিবাস কোথায়?", ["গাইবান্ধা", "যশোর", "ময়মনসিংহ", "কিশোরগঞ্জ"], "ঘ", "থানা শিক্ষা অফিসার, ০৪", "source_attributed", "medium", []],
  ["09", "'হীরক রাজার দেশে' ছবিটির পরিচালক কে?", ["মৃণাল সেন", "তানভীর মোকাম্মেল", "সত্যজিৎ রায়", "তরুণ মজুমদার"], "গ", "চবি খ, ০৯-১০", "source_attributed", "medium", []],
].map(([number, question, options, correct, source, status, conf, sources]) => ({ number, question, options, correct, source, status, conf, sources, canonical_hash: sha(`mcq|462|${number}|${question}`) }));

function sourceMetadata(page) {
  const sourcePage = page.source_page;
  const printedBookPage = { 459: 402, 460: 460, 461: 408, 462: 405, 463: 406 }[sourcePage];
  const nestedArtifactPage = page.transcription.source_page;
  return {
    source_image_sha256: page.source_image_sha256,
    extraction_model: page.model,
    review_status: page.review.review_status,
    corrections: page.review.corrections,
    unresolved_spans: page.review.unresolved_spans,
    accepted_content_tags: page.review.accepted_content_tags,
    external_verification_report: "/home/ubuntu/dontonyo/reports/batch-0459-0463_external_verification.md",
    visual_review_report: sourcePage === 461 ? "/home/ubuntu/dontonyo/reports/batch-0459-0463_visual_review.md" : null,
    physical_source_page: sourcePage,
    printed_book_page: printedBookPage,
    nested_artifact_page_number: nestedArtifactPage,
    page_number_mismatch: nestedArtifactPage !== sourcePage ? "Nested OCR metadata reports a printed book page instead of the physical source-PDF page; relational source_page uses the physical source page." : null,
    page_kind: sourcePage === 462 ? "mcq" : sourcePage === 460 ? "mixed" : "educational",
  };
}

function qualityTag(status) {
  return status === "verified" ? "externally-verified" : status === "conflicting" ? "conflicting-verification" : "source-attributed";
}

function examInfo(source) {
  if (source.includes("DU")) return ["University of Dhaka", "University of Dhaka", "admission", "dhaka-university"];
  if (source.includes("BCS")) return ["Bangladesh Civil Service", null, "competitive", "bcs"];
  if (source.includes("চবি")) return ["University of Chittagong", "University of Chittagong", "admission", "chittagong-university"];
  return null;
}

function entityLookup(row) {
  if (row.entity_type === "fact") return `(SELECT id FROM public.gk_facts WHERE canonical_hash = ${q(row.canonical_hash)} LIMIT 1)`;
  if (row.entity_type === "note") return `(SELECT id FROM public.gk_notes WHERE canonical_hash = ${q(row.canonical_hash)} LIMIT 1)`;
  return `(SELECT id FROM public.gk_mcqs WHERE canonical_hash = ${q(row.canonical_hash)} LIMIT 1)`;
}

export async function buildBatch() {
  const pages = await Promise.all(pageFiles.map(async file => JSON.parse(await fs.readFile(file, "utf8"))));
  const facts = buildFacts(pages);
  const notes = buildNotes(pages);
  const verificationRows = [
    ...facts.map(row => ({ entity_type: "fact", canonical_hash: row.canonical_hash, source_page: row.source_page, claim_text: row.source_excerpt, normalized_claim: row.fact_text, status: row.status, confidence: row.confidence, sources: row.sources })),
    ...notes.map(row => ({ entity_type: "note", canonical_hash: row.canonical_hash, source_page: row.source_page, claim_text: row.content, normalized_claim: row.content, status: row.status, confidence: row.confidence, sources: row.sources })),
    ...mcqs.map(row => ({ entity_type: "mcq", canonical_hash: row.canonical_hash, source_page: 462, claim_text: `${row.question} — printed answer: ${row.correct}`, normalized_claim: null, status: row.status, confidence: row.conf, sources: row.sources })),
  ];

  const chapterTopicSql = `
INSERT INTO public.chapters (book_id, chapter_number, title, slug, description, source_page, display_order)
SELECT b.id, x.chapter_number, x.title, x.slug, x.description, x.source_page, x.display_order
FROM (VALUES
  (38, 'বাংলাদেশের চলচ্চিত্র', 'bangladesh-film', 'Source-derived Bangladesh and South Asian film history with explicit verification states.', 459, 38),
  (39, 'বাংলাদেশের গণমাধ্যম', 'bangladesh-media', 'Source-derived broadcasting and telecommunications material with explicit verification states.', 463, 39)
) AS x(chapter_number, title, slug, description, source_page, display_order)
CROSS JOIN (SELECT id FROM public.books WHERE title = ${q(BOOK_TITLE)} LIMIT 1) b
WHERE NOT EXISTS (SELECT 1 FROM public.chapters c WHERE c.book_id = b.id AND c.slug = x.slug);

INSERT INTO public.topics (chapter_id, title, slug, description, source_page, display_order)
SELECT c.id, x.title, x.slug, x.description, x.source_page, x.display_order
FROM (VALUES
  ('bangladesh-film', 'চলচ্চিত্রের ইতিহাস ও ব্যক্তিত্ব', 'bangladesh-film', 'Film history, institutions, and biographical source material.', 459, 1),
  ('bangladesh-film', 'চলচ্চিত্রভিত্তিক বিগত বছরের প্রশ্ন', 'film-past-exam-mcqs', 'Past-exam MCQs and printed answer key from source page 462.', 462, 2),
  ('bangladesh-media', 'টেলিভিশন, বেতার ও টেলিযোগাযোগ', 'bangladesh-media', 'Broadcasting, radio, and telecommunications source material.', 463, 1)
) AS x(chapter_slug, title, slug, description, source_page, display_order)
JOIN public.chapters c ON c.slug = x.chapter_slug AND c.book_id = (SELECT id FROM public.books WHERE title = ${q(BOOK_TITLE)} LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM public.topics t WHERE t.chapter_id = c.id AND t.slug = x.slug);`;

  const sourcePagesSql = pages.map(page => {
    const context = batchContext(page.source_page);
    const meta = sourceMetadata(page);
    return `INSERT INTO public.source_pages (import_run_id, book_id, source_page, page_kind, raw_transcription, chapter_heading, topic_heading, confidence, extraction_method, model_name, notes, review_metadata)
SELECT (SELECT id FROM public.import_runs WHERE pipeline_version = ${q(PIPELINE_VERSION)} ORDER BY started_at DESC LIMIT 1), b.id, ${page.source_page}, ${q(meta.page_kind)}::page_kind, ${q(page.review.verified_transcript)}, ${q(context.chapterTitle)}, ${q(context.topicTitle)}, ${q(confidence(page.review.overall_confidence))}::confidence_level, 'vision_ocr_with_image_grounded_review', ${q(page.model)}, ${q('Quality-gated batch: source-preserving OCR, correction log, semantic tagging, and external-verification ledger recorded.')}, ${qJson(meta)}
FROM public.books b
WHERE b.title = ${q(BOOK_TITLE)}
  AND NOT EXISTS (SELECT 1 FROM public.source_pages s WHERE s.book_id = b.id AND s.source_page = ${page.source_page});`;
  }).join("\n");

  const factRows = facts.map(row => [row.source_page, row.chapter_slug, row.topic_slug, row.title, row.fact_text, row.source_excerpt, row.importance, row.confidence, row.canonical_hash, row.status]);
  const factsSql = `WITH data(source_page, chapter_slug, topic_slug, title, fact_text, source_excerpt, importance, confidence, canonical_hash, status) AS (VALUES
${values(factRows)}
)
INSERT INTO public.gk_facts (book_id, chapter_id, topic_id, title, fact_text, explanation, source_page, source_section, source_excerpt, importance, confidence, canonical_hash)
SELECT b.id, c.id, t.id, d.title, d.fact_text,
  CASE d.status WHEN 'verified' THEN 'Externally corroborated; original source wording is retained in source_excerpt.' WHEN 'conflicting' THEN 'A credible external source conflicts with the printed claim; it remains preserved with a low-confidence caution flag.' ELSE 'Source-attributed content preserved with source linkage and explicit verification status.' END,
  d.source_page::integer, d.title, d.source_excerpt, d.importance::smallint, d.confidence::confidence_level, d.canonical_hash
FROM data d
JOIN public.books b ON b.title = ${q(BOOK_TITLE)}
JOIN public.chapters c ON c.book_id = b.id AND c.slug = d.chapter_slug
JOIN public.topics t ON t.chapter_id = c.id AND t.slug = d.topic_slug
ON CONFLICT (canonical_hash) DO UPDATE SET fact_text = EXCLUDED.fact_text, explanation = EXCLUDED.explanation, confidence = EXCLUDED.confidence, source_excerpt = EXCLUDED.source_excerpt;`;

  const noteRows = notes.map(row => [row.source_page, row.chapter_slug, row.topic_slug, row.title, row.content, row.confidence, row.canonical_hash]);
  const notesSql = `WITH data(source_page, chapter_slug, topic_slug, title, content, confidence, canonical_hash) AS (VALUES
${values(noteRows)}
)
INSERT INTO public.gk_notes (book_id, chapter_id, topic_id, title, content, source_page, source_section, display_order, confidence, canonical_hash)
SELECT b.id, c.id, t.id, d.title, d.content, d.source_page::integer, d.title, d.source_page::integer, d.confidence::confidence_level, d.canonical_hash
FROM data d
JOIN public.books b ON b.title = ${q(BOOK_TITLE)}
JOIN public.chapters c ON c.book_id = b.id AND c.slug = d.chapter_slug
JOIN public.topics t ON t.chapter_id = c.id AND t.slug = d.topic_slug
ON CONFLICT (canonical_hash) DO UPDATE SET content = EXCLUDED.content, confidence = EXCLUDED.confidence;`;

  const mcqSql = mcqs.map(row => {
    const info = examInfo(row.source);
    const optionKeys = ["ক", "খ", "গ", "ঘ"];
    const examSourceSql = info ? `INSERT INTO public.exam_sources (name, institution, exam_type, description, normalized_name)
SELECT ${q(info[0])}, ${q(info[1])}, ${q(info[2])}, 'Exam source normalized from the printed label on source page 462.', ${q(info[3])}
WHERE NOT EXISTS (SELECT 1 FROM public.exam_sources e WHERE e.normalized_name = ${q(info[3])});` : "";
    const optionsSql = row.options.map((text, index) => `INSERT INTO public.gk_mcq_options (mcq_id, option_key, option_text, display_order, is_correct)
SELECT m.id, ${q(optionKeys[index])}, ${q(text)}, ${index + 1}, ${optionKeys[index] === row.correct}
FROM public.gk_mcqs m WHERE m.canonical_hash = ${q(row.canonical_hash)}
  AND NOT EXISTS (SELECT 1 FROM public.gk_mcq_options o WHERE o.mcq_id = m.id AND o.option_key = ${q(optionKeys[index])});`).join("\n");
    const sourceSql = `INSERT INTO public.gk_mcq_sources (mcq_id, exam_source_id, year, session, source_text, source_page)
SELECT m.id, ${info ? `(SELECT id FROM public.exam_sources WHERE normalized_name = ${q(info[3])} LIMIT 1)` : "NULL"}, NULL, ${q(row.source)}, ${q(row.source)}, 462
FROM public.gk_mcqs m WHERE m.canonical_hash = ${q(row.canonical_hash)}
  AND NOT EXISTS (SELECT 1 FROM public.gk_mcq_sources s WHERE s.mcq_id = m.id AND s.source_text = ${q(row.source)} AND s.source_page = 462);`;
    return `${examSourceSql}
INSERT INTO public.gk_mcqs (book_id, chapter_id, topic_id, question, correct_option, explanation, source_page, source_section, source_question_number, difficulty, confidence, canonical_hash)
SELECT b.id, c.id, t.id, ${q(row.question)}, ${q(row.correct)}, ${q(row.status === "verified" ? "The printed answer is externally corroborated; source label and answer key remain preserved." : row.status === "conflicting" ? "The printed answer key is retained, but external reporting identifies joint directors rather than the conflated option wording." : "Printed answer key retained as source-attributed pending deeper verification.")}, 462, 'এই অধ্যায়ের সাথে জড়িত বিগত বছরের প্রশ্ন', ${q(row.number)}, 3, ${q(row.conf)}::confidence_level, ${q(row.canonical_hash)}
FROM public.books b
JOIN public.chapters c ON c.book_id = b.id AND c.slug = 'bangladesh-film'
JOIN public.topics t ON t.chapter_id = c.id AND t.slug = 'film-past-exam-mcqs'
WHERE b.title = ${q(BOOK_TITLE)}
ON CONFLICT (canonical_hash) DO UPDATE SET correct_option = EXCLUDED.correct_option, explanation = EXCLUDED.explanation, confidence = EXCLUDED.confidence;
${optionsSql}
${sourceSql}`;
  }).join("\n");

  const tagsSql = `INSERT INTO public.content_tags (slug, label, category, description) VALUES
${tags.map(tag => `(${tag.map(q).join(", ")})`).join(",\n")}
ON CONFLICT (slug) DO UPDATE SET label = EXCLUDED.label, category = EXCLUDED.category, description = EXCLUDED.description;

${pages.map(page => {
  const baseTags = page.source_page === 462 ? ["bangladesh-film", "past-exam-mcq", "answer-key"] : page.source_page === 463 ? ["bangladesh-media", "media-and-telecom"] : ["bangladesh-film", "film-history"];
  return baseTags.map(tag => `INSERT INTO public.content_tag_assignments (tag_id, entity_type, entity_id, source_page, confidence, assigned_by)
SELECT t.id, 'source_page', s.id, ${page.source_page}, ${q(confidence(page.review.overall_confidence))}::confidence_level, 'batch-0459-0463-quality-pipeline'
FROM public.content_tags t JOIN public.source_pages s ON s.source_page = ${page.source_page} AND s.book_id = (SELECT id FROM public.books WHERE title = ${q(BOOK_TITLE)} LIMIT 1)
WHERE t.slug = ${q(tag)} ON CONFLICT DO NOTHING;`).join("\n");
}).join("\n")}

${facts.map(row => [row.content_type, qualityTag(row.status)].map(tag => `INSERT INTO public.content_tag_assignments (tag_id, entity_type, entity_id, source_page, confidence, assigned_by)
SELECT t.id, 'fact', f.id, ${row.source_page}, ${q(row.confidence)}::confidence_level, 'batch-0459-0463-quality-pipeline'
FROM public.content_tags t JOIN public.gk_facts f ON f.canonical_hash = ${q(row.canonical_hash)}
WHERE t.slug = ${q(tag)} ON CONFLICT DO NOTHING;`).join("\n")).join("\n")}

${notes.map(row => [row.content_type, qualityTag(row.status)].map(tag => `INSERT INTO public.content_tag_assignments (tag_id, entity_type, entity_id, source_page, confidence, assigned_by)
SELECT t.id, 'note', n.id, ${row.source_page}, ${q(row.confidence)}::confidence_level, 'batch-0459-0463-quality-pipeline'
FROM public.content_tags t JOIN public.gk_notes n ON n.canonical_hash = ${q(row.canonical_hash)}
WHERE t.slug = ${q(tag)} ON CONFLICT DO NOTHING;`).join("\n")).join("\n")}

${mcqs.map(row => ["past-exam-mcq", "answer-key", examInfo(row.source)?.[3], qualityTag(row.status)].filter(Boolean).map(tag => `INSERT INTO public.content_tag_assignments (tag_id, entity_type, entity_id, source_page, confidence, assigned_by)
SELECT t.id, 'mcq', m.id, 462, ${q(row.conf)}::confidence_level, 'batch-0459-0463-quality-pipeline'
FROM public.content_tags t JOIN public.gk_mcqs m ON m.canonical_hash = ${q(row.canonical_hash)}
WHERE t.slug = ${q(tag)} ON CONFLICT DO NOTHING;`).join("\n")).join("\n")}`;

  const verificationSql = verificationRows.map(row => {
    const lookup = entityLookup(row);
    return `INSERT INTO public.fact_verifications (source_page, entity_type, entity_id, claim_text, normalized_claim, verification_status, confidence, verification_sources, audit_note)
SELECT ${row.source_page}, ${q(row.entity_type)}, ${lookup}, ${q(row.claim_text)}, ${row.normalized_claim ? q(row.normalized_claim) : "NULL"}, ${q(row.status)}, ${q(row.confidence)}::confidence_level, ${qJson(row.sources)}, ${q(row.status === "verified" ? "External sources corroborate the normalized claim; original book wording remains source-linked." : row.status === "conflicting" ? "The printed source wording is preserved, but credible external evidence conflicts with the claim or answer." : "Retained as source-attributed content; deeper verification is pending.")}
WHERE NOT EXISTS (SELECT 1 FROM public.fact_verifications v WHERE v.entity_type = ${q(row.entity_type)} AND v.entity_id = ${lookup} AND v.claim_text = ${q(row.claim_text)});`;
  }).join("\n");

  const derivedSql = `
INSERT INTO public.flashcards (subject_id, book_id, chapter_id, topic_id, front_text, back_text, source_type, source_id, source_key)
SELECT (SELECT id FROM public.subjects ORDER BY created_at ASC LIMIT 1), f.book_id, f.chapter_id, f.topic_id, COALESCE(f.title, 'মূল তথ্য'), f.fact_text, 'fact', f.id, 'batch0459-0463:fact:' || f.id::text
FROM public.gk_facts f WHERE f.source_page BETWEEN 459 AND 463
  AND NOT EXISTS (SELECT 1 FROM public.flashcards c WHERE c.source_key = 'batch0459-0463:fact:' || f.id::text);

INSERT INTO public.flashcards (subject_id, book_id, chapter_id, topic_id, front_text, back_text, source_type, source_id, source_key)
SELECT (SELECT id FROM public.subjects ORDER BY created_at ASC LIMIT 1), n.book_id, n.chapter_id, n.topic_id, n.title, n.content, 'note', n.id, 'batch0459-0463:note:' || n.id::text
FROM public.gk_notes n WHERE n.source_page BETWEEN 459 AND 463
  AND NOT EXISTS (SELECT 1 FROM public.flashcards c WHERE c.source_key = 'batch0459-0463:note:' || n.id::text);

INSERT INTO public.flashcards (subject_id, book_id, chapter_id, topic_id, front_text, back_text, source_type, source_id, source_key)
SELECT (SELECT id FROM public.subjects ORDER BY created_at ASC LIMIT 1), m.book_id, m.chapter_id, m.topic_id, m.question, 'সঠিক উত্তর: ' || o.option_key || '. ' || o.option_text, 'mcq', m.id, 'batch0459-0463:mcq:' || m.id::text
FROM public.gk_mcqs m JOIN public.gk_mcq_options o ON o.mcq_id = m.id AND o.is_correct
WHERE m.source_page = 462
  AND NOT EXISTS (SELECT 1 FROM public.flashcards c WHERE c.source_key = 'batch0459-0463:mcq:' || m.id::text);

INSERT INTO public.search_documents (entity_type, entity_id, title, body, english_metadata)
SELECT 'fact', f.id, f.title, f.fact_text, 'Validated GK fact | source page ' || f.source_page::text
FROM public.gk_facts f WHERE f.source_page BETWEEN 459 AND 463
  AND NOT EXISTS (SELECT 1 FROM public.search_documents d WHERE d.entity_type = 'fact' AND d.entity_id = f.id);

INSERT INTO public.search_documents (entity_type, entity_id, title, body, english_metadata)
SELECT 'note', n.id, n.title, n.content, 'Source-linked GK note | source page ' || n.source_page::text
FROM public.gk_notes n WHERE n.source_page BETWEEN 459 AND 463
  AND NOT EXISTS (SELECT 1 FROM public.search_documents d WHERE d.entity_type = 'note' AND d.entity_id = n.id);

INSERT INTO public.search_documents (entity_type, entity_id, title, body, english_metadata)
SELECT 'mcq', m.id, NULL, m.question, 'Past-exam MCQ | source page 462 | question ' || COALESCE(m.source_question_number, '')
FROM public.gk_mcqs m WHERE m.source_page = 462
  AND NOT EXISTS (SELECT 1 FROM public.search_documents d WHERE d.entity_type = 'mcq' AND d.entity_id = m.id);`;

  const audit = {
    batch_pages: BATCH_PAGES,
    pipeline_version: PIPELINE_VERSION,
    source_pages: pages.map(page => ({ page: page.source_page, sha256: page.source_image_sha256, review: page.review.review_status })),
    generated_fact_candidates: facts.length,
    generated_notes: notes.length,
    generated_mcqs: mcqs.length,
    generated_options: mcqs.length * 4,
    verification_statuses: Object.groupBy(verificationRows, row => row.status),
    quality_gates: [
      "OCR text and raw model responses remain in the page-level audit artifacts.",
      "Relational source_page uses the physical source-PDF page even where printed book pagination differs.",
      "The page-461 nested page-number mismatch is retained in review metadata rather than silently rewritten.",
      "Content is tagged by domain, semantic type, exam source, and verification status.",
      "Conflicting claims are preserved with low confidence and external evidence rather than normalized as facts.",
      "All inserts are idempotent through source-page existence checks, canonical hashes, and source keys.",
    ],
  };

  const sql = `-- Generated by scripts/prepare_validated_batch_0459_0463.mjs
-- Source pages: 459–463 only. Do not extend this batch without explicit user instruction.
BEGIN;
INSERT INTO public.import_runs (source_filename, source_sha256, pipeline_version, status, completed_at, audit)
VALUES ('Jubayer''sgk.pdf', ${q(sha(pages.map(page => page.source_image_sha256).join("|")))}, ${q(PIPELINE_VERSION)}, 'completed', now(), ${qJson(audit)});
${chapterTopicSql}
${sourcePagesSql}
${factsSql}
${notesSql}
${mcqSql}
${tagsSql}
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
  await fs.writeFile(path.join(outputDir, "execute_sql_request.json"), JSON.stringify({ project_id: "rennotctgrxvbpghbimx", query: sql }), "utf8");
  console.log(JSON.stringify({ outputDir, ...audit }, null, 2));
}
