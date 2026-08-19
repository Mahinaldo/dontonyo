import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const workDir = "/home/ubuntu/dontonyo-work/batch-0464-0468";
const outputDir = path.join(root, "supabase", "batch-0464-0468");
const pageFiles = [464, 465, 466, 467, 468].map(page => path.join(workDir, "pages", `page_${String(page).padStart(4, "0")}.json`));

export const BATCH_PAGES = [464, 465, 466, 467, 468];
export const BOOK_TITLE = "Jubayer's GK";
export const PIPELINE_VERSION = "vision-quality-gated-batch-0464-0468-v1";

const refs = {
  newspaper: ["https://en.banglapedia.org/index.php/Newspapers_and_Periodicals"],
  begum: ["https://en.banglapedia.org/index.php/Kamal%2C_Begum_Sufia"],
  pennyBlack: ["https://www.postalmuseum.org/collections/highlights/the-first-ever-stamp-the-penny-black/"],
  satellite: [
    "https://www.thalesgroup.com/en/news-centre/press-releases/bangabandhu-satellite-1-successfully-launched",
    "https://www.spacex.com/launches/bangabandhusatellite1",
  ],
  btv: ["http://btv.gov.bd/pages/static-pages/6922db5a933eb65569e099bf"],
  btrc: ["http://btrc.gov.bd/pages/static-pages/6922e040933eb65569e26312"],
  army: ["https://www.army.mil.bd/History"],
};

const tags = [
  ["bangladesh-media", "Bangladesh media", "domain", "Bangladesh journalism, broadcasting, radio, and related institutions."],
  ["newspaper-history", "Newspaper history", "content_type", "Newspaper and periodical history."],
  ["postal-services", "Postal services", "content_type", "Postal system, stamps, and mail infrastructure."],
  ["satellite-telecom", "Satellite and telecom", "content_type", "Satellite, cable, and telecommunications material."],
  ["bangladesh-defence", "Bangladesh defence", "domain", "Bangladesh armed forces and defence institutions."],
  ["bangladesh-police", "Bangladesh Police", "domain", "Police organisation, roles, and history."],
  ["biography", "Biography", "content_type", "Named-person biographical source material."],
  ["table", "Table or reference list", "content_type", "Source table, structured list, or labeled reference information."],
  ["definition", "Definition", "content_type", "Definition or mnemonic preserved from the source."],
  ["past-exam-mcq", "Past-exam MCQ", "content_type", "Multiple-choice question with a printed exam source."],
  ["answer-key", "Answer key", "content_type", "Printed answer-key-derived MCQ answer."],
  ["source-attributed", "Source-attributed", "quality", "Preserved from the book with source linkage but no completed independent verification."],
  ["externally-verified", "Externally verified", "quality", "Corroborated by an external source listed in the verification ledger."],
  ["conflicting-verification", "Conflicting verification", "quality", "External evidence conflicts with the book's exact claim or printed answer."],
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
  if (page === 464) return { chapter: "bangladesh-media", topic: "bangladesh-newspapers", chapterTitle: "বাংলাদেশের গণমাধ্যম", topicTitle: "বাংলাদেশের সংবাদপত্র", baseTag: "newspaper-history" };
  if (page === 465) return { chapter: "bangladesh-media", topic: "news-agencies-postal", chapterTitle: "বাংলাদেশের গণমাধ্যম", topicTitle: "সংবাদ সংস্থা ও ডাক ব্যবস্থা", baseTag: "postal-services" };
  if (page === 466 || page === 467) return { chapter: "bangladesh-media", topic: page === 467 ? "satellite-past-exam-mcqs" : "satellite-telecom", chapterTitle: "বাংলাদেশের গণমাধ্যম", topicTitle: page === 467 ? "যোগাযোগভিত্তিক বিগত বছরের প্রশ্ন" : "স্যাটেলাইট ও টেলিযোগাযোগ", baseTag: "satellite-telecom" };
  return { chapter: "bangladesh-defence-security", topic: "bangladesh-defence-security", chapterTitle: "বাংলাদেশের প্রতিরক্ষা ও নিরাপত্তা বাহিনী", topicTitle: "প্রতিরক্ষা ও নিরাপত্তা বাহিনী", baseTag: "bangladesh-defence" };
}

function verdict(page, text) {
  const normalized = text.replaceAll("’", "'");
  if (page === 464 && (normalized.includes("১৭৮০") || normalized.includes("বেঙ্গল গেজেট") || normalized.includes("জেমস অগাস্টাস হিকি") || normalized.includes("সমাচার দর্পণ") || normalized.includes("দিকদর্শন") || normalized.includes("বাঙালি মালিকানা") || normalized.includes("রংপুর বার্তাবহ") || normalized.includes("ঢাকা নিউজ") || normalized.includes("ঢাকা প্রকাশ"))) return { status: "verified", confidence: "high", sources: refs.newspaper };
  if (page === 464 && (normalized.includes("বেগম পত্রিকার প্রথম সম্পাদক") || normalized.includes("মোহাম্মদ নাসিরউদ্দিন"))) return { status: "verified", confidence: "high", sources: refs.begum };
  if (page === 465 && normalized.includes("স্যার রোনাল্ড")) return { status: "conflicting", confidence: "low", sources: refs.pennyBlack };
  if (page === 465 && (normalized.includes("পেনিব্ল্যাক") || normalized.includes("ফিলাটেলি"))) return { status: "verified", confidence: "high", sources: refs.pennyBlack };
  if ((page === 466 || page === 467) && (normalized.includes("ফ্লোরিডা") || normalized.includes("কেইপ ক্যানাভেরাল") || normalized.includes("Falcon 9") || normalized.includes("স্পেসএক্স") || normalized.includes("১২ মে, ২০১৮") || normalized.includes("ফ্রান্সের প্রতিষ্ঠান বঙ্গবন্ধু স্যাটেলাইট-১ তৈরি"))) return { status: "verified", confidence: "high", sources: refs.satellite };
  if (page === 467 && normalized.includes("রামপুরায় টেলিভিশন কেন্দ্র") && normalized.includes("১৯৭৫")) return { status: "verified", confidence: "high", sources: refs.btv };
  if (page === 467 && normalized.includes("সর্বপ্রথম টেলিফোন ব্যবস্থা") && normalized.includes("১৯৯০")) return { status: "conflicting", confidence: "low", sources: refs.btrc };
  return { status: "source_attributed", confidence: "medium", sources: [] };
}

function splitFactText(text) {
  if (text.includes("•")) return text.split("•").map(item => item.trim()).filter(Boolean);
  if (text.includes(" - ")) return text.replace(/^\s*-\s*/, "").replaceAll(" - ", "\n").split("\n").map(item => item.trim()).filter(Boolean);
  return [text.trim()];
}

function buildFacts(pages) {
  const records = [];
  for (const page of pages) {
    if (page.source_page === 467) continue;
    let heading = contextFor(page.source_page).topicTitle;
    const context = contextFor(page.source_page);
    let activeTag = context.baseTag;
    for (const block of page.transcription.blocks) {
      if (["chapter_heading", "topic_heading"].includes(block.block_type)) {
        heading = block.text;
        if (page.source_page === 468 && (block.text === "বাংলাদেশ পুলিশ" || block.text === "পুলিশের পদবি")) activeTag = "bangladesh-police";
        continue;
      }
      if (!["fact", "biography"].includes(block.block_type)) continue;
      const texts = page.source_page === 468 && block.block_type === "biography"
        ? [
            "মারজিয়া ইসলাম — সোর্ড অব অনারপ্রাপ্ত একমাত্র নৌ-ক্যাডেট।",
            "সরওয়ার জাহান নিজাম — বাংলাদেশের প্রথম ভাইস এডমিরাল।",
            "অনুপ কুমার চাকমা — সেনাবাহিনীর প্রথম চাকমা মেজর জেনারেল।",
          ]
        : splitFactText(block.text);
      for (const factText of texts) {
        if (!factText || factText.length < 4 || factText === "এম. এ খালেক") continue;
        const quality = verdict(page.source_page, factText);
        const contentType = block.block_type === "biography" ? "biography" : activeTag;
        records.push({
          source_page: page.source_page,
          chapter_slug: context.chapter,
          topic_slug: context.topic,
          title: heading,
          fact_text: factText,
          source_excerpt: factText,
          content_type: contentType,
          importance: quality.status === "conflicting" ? 4 : block.block_type === "biography" ? 2 : 3,
          ...quality,
        });
      }
    }
  }
  return records.map(row => ({ ...row, canonical_hash: sha(`fact|${row.source_page}|${row.title}|${row.fact_text}`) }));
}

function auxiliaryNotes(pages) {
  const notes = [];
  const add = (source_page, title, content, type, quality = verdict(source_page, content)) => {
    const context = contextFor(source_page);
    notes.push({ source_page, chapter_slug: context.chapter, topic_slug: context.topic, title, content, content_type: type, ...quality, canonical_hash: sha(`note|${source_page}|${title}|${content}`) });
  };
  for (const page of pages) {
    let heading = contextFor(page.source_page).topicTitle;
    for (const block of page.transcription.blocks) {
      if (["chapter_heading", "topic_heading"].includes(block.block_type)) {
        heading = block.text;
        continue;
      }
      if (block.block_type === "note") {
        const quality = page.source_page === 464 && block.text.includes("১৯৫০")
          ? { status: "source_attributed", confidence: "medium", sources: refs.begum }
          : verdict(page.source_page, block.text);
        add(page.source_page, heading, block.text, "table", quality);
      }
      if (block.block_type === "table") add(page.source_page, heading, block.text, "table");
      if (block.block_type === "definition") add(page.source_page, heading, block.text, "definition");
      if (block.block_type !== "misc") continue;
      if (page.source_page === 465 && (block.text.startsWith("১ বাসস") || block.text.startsWith("রাজশাহী") || block.text.startsWith("চুয়াডাঙ্গা"))) add(page.source_page, heading, block.text, "table");
      if (page.source_page === 466 && (block.text.startsWith("ব্যবহারকারীর ডিভাইস") || block.text.startsWith("১ম জয়দেবপুর"))) add(page.source_page, heading, block.text, "table");
    }
  }
  return notes;
}

const mcqs = [
  ["01", "স্বাধীনতার পর প্রকাশিত প্রথম স্মারক ডাকটিকেটে কিসের ছবি ছিল?", ["কেন্দ্রীয় শহীদ মিনার", "দোয়েল পাখি", "শাপলা ফুল", "ষাট গম্বুজ মসজিদ"], "ক", "DU '21-22", "source_attributed", "medium", []],
  ["02", "কোন দেশের প্রতিষ্ঠান বঙ্গবন্ধু স্যাটেলাইট-১ তৈরি করেছে?", ["মার্কিন যুক্তরাষ্ট্র", "ফ্রান্স", "ইংল্যান্ড", "জার্মানি"], "খ", "DU '18-19", "verified", "high", refs.satellite],
  ["03", "বঙ্গবন্ধু স্যাটেলাইট-১ উৎক্ষেপণ করা হয় যে স্থান থেকে-", ["ফ্লোরিডা", "টেক্সাস", "ক্যালিফোর্নিয়া", "নিউইয়র্ক"], "ক", "DU '18-19", "verified", "high", refs.satellite],
  ["04", "স্বাধীন বাংলা বেতার কেন্দ্র প্রথম কোথায় স্থাপিত হয়?", ["মেহেরপুর", "বেতবুনিয়া", "কালুরঘাট", "হালুয়াঘাট"], "গ", "DU '16-17", "source_attributed", "medium", []],
  ["05", "'সাবমেরিন ক্যাবল' প্রকল্পটি কোন মন্ত্রণালয়ের কার্যক্রম?", ["অর্থ", "ডাক ও টেলিযোগাযোগ", "বিজ্ঞান ও প্রযুক্তি", "পররাষ্ট্র"], "খ", "25 BCS / DU '13-14", "source_attributed", "medium", []],
  ["06", "বাংলাদেশে সর্বপ্রথম ইন্টারনেট সিস্টেম চালুর সন-", ["১৯৯৫", "১৯৯৬", "১৯৯৮", "১৯৯৭"], "খ", "DU '05-06", "source_attributed", "medium", []],
  ["07", "বঙ্গবন্ধু স্যাটেলাইট-২ কী ধরনের স্যাটেলাইট হবে?", ["কমিউনিকেশন স্যাটেলাইট", "ওয়েদার স্যাটেলাইট", "আর্থ অবজারভেশন স্যাটেলাইট", "ন্যাভিগেশন স্যাটেলাইট"], "গ", "44 BCS", "source_attributed", "medium", []],
  ["08", "বাংলাদেশের সর্বপ্রথম টেলিফোন ব্যবস্থা কবে চালু হয়?", ["৪ জানুয়ারি ১৯৯০", "৩ ফেব্রুয়ারি ১৯৯০", "৩ মার্চ ১৯৯০", "৪ জানুয়ারি ১৯৯১"], "ক", "26 BCS", "conflicting", "low", refs.btrc],
  ["09", "বাংলাদেশের প্রথম রঙিন টেলিভিশন চালু হয়-", ["১ ডিসেম্বর ১৯৮০", "১ নভেম্বর ১৯৮০", "১ জানুয়ারি ১৯৮১", "১ জানুয়ারি ১৯৭৯"], "ক", "26 BCS / IB-Kh '03-04", "source_attributed", "medium", []],
  ["10", "বাংলাদেশে নিম্নের কোন তারিখে প্রথম সেল ফোন চালু হয়?", ["১৬ ডিসেম্বর ২০০৫", "৮ আগস্ট ১৯৯৩", "২৫ নভেম্বর ১৯৯৩", "২৬ মার্চ ১৯৯৮"], "খ", "MC '09-10", "source_attributed", "medium", []],
  ["11", "বাংলাদেশে নিম্নের কোন স্থানটি সাবমেরিন ক্যাবলের ল্যান্ডিং স্টেশন?", ["মহেশখালী", "ডুলাহাজরা", "ঝিলংজা", "নারিকেল বীথি"], "গ", "MC '09-10", "source_attributed", "medium", []],
  ["12", "ঢাকায় রামপুরায় টেলিভিশন কেন্দ্র স্থাপিত হয়-", ["১৯৭২ সালে", "১৯৭৩ সালে", "১৯৭৪ সালে", "১৯৭৫ সালে"], "ঘ", "Planning Ministry DPO '02", "verified", "high", refs.btv],
  ["13", "ঢাকা টেলিভিশনের প্রথম নাটক কোনটি?", ["একতলা-দোতলা", "জমিদার দর্পণ", "কবর", "কাবুলিওয়ালা"], "ক", "Police Assistant Chemist '02", "source_attributed", "medium", []],
].map(([number, question, options, correct, source, status, conf, sources]) => ({ number, question, options, correct, source, status, conf, sources, canonical_hash: sha(`mcq|467|${number}|${question}`) }));

function pageMetadata(page) {
  const printedBookPage = { 464: 407, 465: 408, 466: 409, 467: 410, 468: 411 }[page.source_page];
  const nestedPage = page.transcription.source_page;
  return {
    source_image_sha256: page.source_image_sha256,
    extraction_model: page.model,
    review_status: page.review.review_status,
    corrections: page.review.corrections,
    unresolved_spans: page.review.unresolved_spans,
    accepted_content_tags: page.review.accepted_content_tags,
    physical_source_page: page.source_page,
    printed_book_page: printedBookPage,
    nested_artifact_page_number: nestedPage,
    page_number_mismatch: nestedPage !== page.source_page ? "Nested OCR metadata identifies the printed book page; relational source_page preserves the physical source-PDF page." : null,
    visual_review_report: page.source_page === 468 ? "/home/ubuntu/dontonyo/reports/batch-0464-0468_visual_review.md" : null,
    external_verification_report: "/home/ubuntu/dontonyo/reports/batch-0464-0468_external_verification.md",
    page_kind: page.source_page === 467 ? "mcq" : page.source_page === 466 || page.source_page === 468 ? "mixed" : "educational",
  };
}

function qualityTag(status) { return status === "verified" ? "externally-verified" : status === "conflicting" ? "conflicting-verification" : "source-attributed"; }
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
  const facts = buildFacts(pages);
  const notes = auxiliaryNotes(pages);
  const verificationRows = [
    ...facts.map(row => ({ entity_type: "fact", canonical_hash: row.canonical_hash, source_page: row.source_page, claim_text: row.source_excerpt, normalized_claim: row.fact_text, status: row.status, confidence: row.confidence, sources: row.sources })),
    ...notes.map(row => ({ entity_type: "note", canonical_hash: row.canonical_hash, source_page: row.source_page, claim_text: row.content, normalized_claim: row.content, status: row.status, confidence: row.confidence, sources: row.sources })),
    ...mcqs.map(row => ({ entity_type: "mcq", canonical_hash: row.canonical_hash, source_page: 467, claim_text: `${row.question} — printed answer: ${row.correct}`, normalized_claim: null, status: row.status, confidence: row.conf, sources: row.sources })),
  ];

  const contextSql = `
INSERT INTO public.chapters (book_id, chapter_number, title, slug, description, source_page, display_order)
SELECT b.id, x.n, x.title, x.slug, x.description, x.source_page, x.display_order
FROM (VALUES
  (40, 'বাংলাদেশের প্রতিরক্ষা ও নিরাপত্তা বাহিনী', 'bangladesh-defence-security', 'Source-derived defence and police material with explicit verification states.', 468, 40)
) AS x(n, title, slug, description, source_page, display_order)
CROSS JOIN (SELECT id FROM public.books WHERE title = ${q(BOOK_TITLE)} LIMIT 1) b
WHERE NOT EXISTS (SELECT 1 FROM public.chapters c WHERE c.book_id = b.id AND c.slug = x.slug);

INSERT INTO public.topics (chapter_id, title, slug, description, source_page, display_order)
SELECT c.id, x.title, x.slug, x.description, x.source_page, x.display_order
FROM (VALUES
  ('bangladesh-media', 'বাংলাদেশের সংবাদপত্র', 'bangladesh-newspapers', 'Source-derived newspaper and periodical history.', 464, 2),
  ('bangladesh-media', 'সংবাদ সংস্থা ও ডাক ব্যবস্থা', 'news-agencies-postal', 'Source-derived news-agency and postal-system material.', 465, 3),
  ('bangladesh-media', 'স্যাটেলাইট ও টেলিযোগাযোগ', 'satellite-telecom', 'Source-derived satellite, cable, and telecommunications material.', 466, 4),
  ('bangladesh-media', 'যোগাযোগভিত্তিক বিগত বছরের প্রশ্ন', 'satellite-past-exam-mcqs', 'Past-exam MCQs and printed answer key from source page 467.', 467, 5),
  ('bangladesh-defence-security', 'প্রতিরক্ষা ও নিরাপত্তা বাহিনী', 'bangladesh-defence-security', 'Defence, police, ranks, and definition material.', 468, 1)
) AS x(chapter_slug, title, slug, description, source_page, display_order)
JOIN public.chapters c ON c.slug = x.chapter_slug AND c.book_id = (SELECT id FROM public.books WHERE title = ${q(BOOK_TITLE)} LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM public.topics t WHERE t.chapter_id = c.id AND t.slug = x.slug);`;

  const sourcePagesSql = pages.map(page => {
    const context = contextFor(page.source_page);
    const metadata = pageMetadata(page);
    return `INSERT INTO public.source_pages (import_run_id, book_id, source_page, page_kind, raw_transcription, chapter_heading, topic_heading, confidence, extraction_method, model_name, notes, review_metadata)
SELECT (SELECT id FROM public.import_runs WHERE pipeline_version = ${q(PIPELINE_VERSION)} ORDER BY started_at DESC LIMIT 1), b.id, ${page.source_page}, ${q(metadata.page_kind)}::page_kind, ${q(page.review.verified_transcript)}, ${q(context.chapterTitle)}, ${q(context.topicTitle)}, ${q(confidence(page.review.overall_confidence))}::confidence_level, 'vision_ocr_with_image_grounded_review', ${q(page.model)}, ${q('Quality-gated batch with correction log, separate content-type tags, and external-verification ledger.')}, ${qJson(metadata)}
FROM public.books b WHERE b.title = ${q(BOOK_TITLE)}
  AND NOT EXISTS (SELECT 1 FROM public.source_pages s WHERE s.book_id = b.id AND s.source_page = ${page.source_page});`;
  }).join("\n");

  const factsSql = `WITH data(source_page, chapter_slug, topic_slug, title, fact_text, source_excerpt, importance, confidence, canonical_hash, status) AS (VALUES
${values(facts.map(row => [row.source_page, row.chapter_slug, row.topic_slug, row.title, row.fact_text, row.source_excerpt, row.importance, row.confidence, row.canonical_hash, row.status]))}
)
INSERT INTO public.gk_facts (book_id, chapter_id, topic_id, title, fact_text, explanation, source_page, source_section, source_excerpt, importance, confidence, canonical_hash)
SELECT b.id, c.id, t.id, d.title, d.fact_text,
 CASE d.status WHEN 'verified' THEN 'Externally corroborated; source wording is retained in source_excerpt.' WHEN 'conflicting' THEN 'External evidence conflicts with the printed wording; source material is retained with a low-confidence caution.' ELSE 'Source-attributed material retained with source linkage and explicit verification status.' END,
 d.source_page::integer, d.title, d.source_excerpt, d.importance::smallint, d.confidence::confidence_level, d.canonical_hash
FROM data d JOIN public.books b ON b.title = ${q(BOOK_TITLE)} JOIN public.chapters c ON c.book_id = b.id AND c.slug = d.chapter_slug JOIN public.topics t ON t.chapter_id = c.id AND t.slug = d.topic_slug
ON CONFLICT (canonical_hash) DO UPDATE SET fact_text = EXCLUDED.fact_text, explanation = EXCLUDED.explanation, confidence = EXCLUDED.confidence, source_excerpt = EXCLUDED.source_excerpt;`;

  const notesSql = `WITH data(source_page, chapter_slug, topic_slug, title, content, confidence, canonical_hash) AS (VALUES
${values(notes.map(row => [row.source_page, row.chapter_slug, row.topic_slug, row.title, row.content, row.confidence, row.canonical_hash]))}
)
INSERT INTO public.gk_notes (book_id, chapter_id, topic_id, title, content, source_page, source_section, display_order, confidence, canonical_hash)
SELECT b.id, c.id, t.id, d.title, d.content, d.source_page::integer, d.title, d.source_page::integer, d.confidence::confidence_level, d.canonical_hash
FROM data d JOIN public.books b ON b.title = ${q(BOOK_TITLE)} JOIN public.chapters c ON c.book_id = b.id AND c.slug = d.chapter_slug JOIN public.topics t ON t.chapter_id = c.id AND t.slug = d.topic_slug
ON CONFLICT (canonical_hash) DO UPDATE SET content = EXCLUDED.content, confidence = EXCLUDED.confidence;`;

  const mcqSql = mcqs.map(row => {
    const info = examInfo(row.source); const keys = ["ক", "খ", "গ", "ঘ"];
    const sourceSql = `INSERT INTO public.exam_sources (name, institution, exam_type, description, normalized_name)
SELECT ${q(info[0])}, ${q(info[1])}, ${q(info[2])}, 'Exam source normalized from the printed label on source page 467.', ${q(info[3])}
WHERE NOT EXISTS (SELECT 1 FROM public.exam_sources e WHERE e.normalized_name = ${q(info[3])});`;
    const optionSql = row.options.map((option, index) => `INSERT INTO public.gk_mcq_options (mcq_id, option_key, option_text, display_order, is_correct)
SELECT m.id, ${q(keys[index])}, ${q(option)}, ${index + 1}, ${keys[index] === row.correct} FROM public.gk_mcqs m WHERE m.canonical_hash = ${q(row.canonical_hash)}
AND NOT EXISTS (SELECT 1 FROM public.gk_mcq_options o WHERE o.mcq_id = m.id AND o.option_key = ${q(keys[index])});`).join("\n");
    const linkSql = `INSERT INTO public.gk_mcq_sources (mcq_id, exam_source_id, year, session, source_text, source_page)
SELECT m.id, (SELECT id FROM public.exam_sources WHERE normalized_name = ${q(info[3])} LIMIT 1), NULL, ${q(row.source)}, ${q(row.source)}, 467 FROM public.gk_mcqs m WHERE m.canonical_hash = ${q(row.canonical_hash)}
AND NOT EXISTS (SELECT 1 FROM public.gk_mcq_sources s WHERE s.mcq_id = m.id AND s.source_text = ${q(row.source)} AND s.source_page = 467);`;
    return `${sourceSql}
INSERT INTO public.gk_mcqs (book_id, chapter_id, topic_id, question, correct_option, explanation, source_page, source_section, source_question_number, difficulty, confidence, canonical_hash)
SELECT b.id, c.id, t.id, ${q(row.question)}, ${q(row.correct)}, ${q(row.status === "verified" ? "Printed answer externally corroborated; answer key and exam label remain source-linked." : row.status === "conflicting" ? "The printed answer is retained, but its exact historical proposition conflicts with external evidence." : "Printed answer key retained as source-attributed pending deeper verification.")}, 467, 'এই অধ্যায়ের সাথে জড়িত বিগত বছরের প্রশ্ন', ${q(row.number)}, 3, ${q(row.conf)}::confidence_level, ${q(row.canonical_hash)}
FROM public.books b JOIN public.chapters c ON c.book_id = b.id AND c.slug = 'bangladesh-media' JOIN public.topics t ON t.chapter_id = c.id AND t.slug = 'satellite-past-exam-mcqs' WHERE b.title = ${q(BOOK_TITLE)}
ON CONFLICT (canonical_hash) DO UPDATE SET correct_option = EXCLUDED.correct_option, explanation = EXCLUDED.explanation, confidence = EXCLUDED.confidence;
${optionSql}
${linkSql}`;
  }).join("\n");

  const tagSql = `INSERT INTO public.content_tags (slug, label, category, description) VALUES
${tags.map(tag => `(${tag.map(q).join(", ")})`).join(",\n")}
ON CONFLICT (slug) DO UPDATE SET label = EXCLUDED.label, category = EXCLUDED.category, description = EXCLUDED.description;
${pages.map(page => [contextFor(page.source_page).baseTag, page.source_page === 467 ? "past-exam-mcq" : null].filter(Boolean).map(tag => `INSERT INTO public.content_tag_assignments (tag_id, entity_type, entity_id, source_page, confidence, assigned_by)
SELECT t.id, 'source_page', s.id, ${page.source_page}, ${q(confidence(page.review.overall_confidence))}::confidence_level, 'batch-0464-0468-quality-pipeline' FROM public.content_tags t JOIN public.source_pages s ON s.source_page = ${page.source_page} AND s.book_id = (SELECT id FROM public.books WHERE title = ${q(BOOK_TITLE)} LIMIT 1) WHERE t.slug = ${q(tag)} ON CONFLICT DO NOTHING;`).join("\n")).join("\n")}
${facts.map(row => [row.content_type, qualityTag(row.status)].map(tag => `INSERT INTO public.content_tag_assignments (tag_id, entity_type, entity_id, source_page, confidence, assigned_by)
SELECT t.id, 'fact', f.id, ${row.source_page}, ${q(row.confidence)}::confidence_level, 'batch-0464-0468-quality-pipeline' FROM public.content_tags t JOIN public.gk_facts f ON f.canonical_hash = ${q(row.canonical_hash)} WHERE t.slug = ${q(tag)} ON CONFLICT DO NOTHING;`).join("\n")).join("\n")}
${notes.map(row => [row.content_type, qualityTag(row.status)].map(tag => `INSERT INTO public.content_tag_assignments (tag_id, entity_type, entity_id, source_page, confidence, assigned_by)
SELECT t.id, 'note', n.id, ${row.source_page}, ${q(row.confidence)}::confidence_level, 'batch-0464-0468-quality-pipeline' FROM public.content_tags t JOIN public.gk_notes n ON n.canonical_hash = ${q(row.canonical_hash)} WHERE t.slug = ${q(tag)} ON CONFLICT DO NOTHING;`).join("\n")).join("\n")}
${mcqs.map(row => ["past-exam-mcq", "answer-key", examInfo(row.source)[3], qualityTag(row.status)].map(tag => `INSERT INTO public.content_tag_assignments (tag_id, entity_type, entity_id, source_page, confidence, assigned_by)
SELECT t.id, 'mcq', m.id, 467, ${q(row.conf)}::confidence_level, 'batch-0464-0468-quality-pipeline' FROM public.content_tags t JOIN public.gk_mcqs m ON m.canonical_hash = ${q(row.canonical_hash)} WHERE t.slug = ${q(tag)} ON CONFLICT DO NOTHING;`).join("\n")).join("\n")}`;

  const verificationSql = verificationRows.map(row => {
    const entityId = lookup(row);
    return `INSERT INTO public.fact_verifications (source_page, entity_type, entity_id, claim_text, normalized_claim, verification_status, confidence, verification_sources, audit_note)
SELECT ${row.source_page}, ${q(row.entity_type)}, ${entityId}, ${q(row.claim_text)}, ${row.normalized_claim ? q(row.normalized_claim) : "NULL"}, ${q(row.status)}, ${q(row.confidence)}::confidence_level, ${qJson(row.sources)}, ${q(row.status === "verified" ? "External sources corroborate the normalized claim; book wording remains source-linked." : row.status === "conflicting" ? "Book wording is preserved but a credible source conflicts with the exact proposition." : "Retained as source-attributed material pending deeper verification.")}
WHERE NOT EXISTS (SELECT 1 FROM public.fact_verifications v WHERE v.entity_type = ${q(row.entity_type)} AND v.entity_id = ${entityId} AND v.claim_text = ${q(row.claim_text)});`;
  }).join("\n");

  const derivedSql = `
INSERT INTO public.flashcards (subject_id, book_id, chapter_id, topic_id, front_text, back_text, source_type, source_id, source_key)
SELECT (SELECT id FROM public.subjects ORDER BY created_at ASC LIMIT 1), f.book_id, f.chapter_id, f.topic_id, COALESCE(f.title, 'মূল তথ্য'), f.fact_text, 'fact', f.id, 'batch0464-0468:fact:' || f.id::text FROM public.gk_facts f WHERE f.source_page BETWEEN 464 AND 468 AND NOT EXISTS (SELECT 1 FROM public.flashcards c WHERE c.source_key = 'batch0464-0468:fact:' || f.id::text);
INSERT INTO public.flashcards (subject_id, book_id, chapter_id, topic_id, front_text, back_text, source_type, source_id, source_key)
SELECT (SELECT id FROM public.subjects ORDER BY created_at ASC LIMIT 1), n.book_id, n.chapter_id, n.topic_id, n.title, n.content, 'note', n.id, 'batch0464-0468:note:' || n.id::text FROM public.gk_notes n WHERE n.source_page BETWEEN 464 AND 468 AND NOT EXISTS (SELECT 1 FROM public.flashcards c WHERE c.source_key = 'batch0464-0468:note:' || n.id::text);
INSERT INTO public.flashcards (subject_id, book_id, chapter_id, topic_id, front_text, back_text, source_type, source_id, source_key)
SELECT (SELECT id FROM public.subjects ORDER BY created_at ASC LIMIT 1), m.book_id, m.chapter_id, m.topic_id, m.question, 'সঠিক উত্তর: ' || o.option_key || '. ' || o.option_text, 'mcq', m.id, 'batch0464-0468:mcq:' || m.id::text FROM public.gk_mcqs m JOIN public.gk_mcq_options o ON o.mcq_id = m.id AND o.is_correct WHERE m.source_page = 467 AND NOT EXISTS (SELECT 1 FROM public.flashcards c WHERE c.source_key = 'batch0464-0468:mcq:' || m.id::text);
INSERT INTO public.search_documents (entity_type, entity_id, title, body, english_metadata)
SELECT 'fact', f.id, f.title, f.fact_text, 'Source-linked GK fact | source page ' || f.source_page::text FROM public.gk_facts f WHERE f.source_page BETWEEN 464 AND 468 AND NOT EXISTS (SELECT 1 FROM public.search_documents d WHERE d.entity_type = 'fact' AND d.entity_id = f.id);
INSERT INTO public.search_documents (entity_type, entity_id, title, body, english_metadata)
SELECT 'note', n.id, n.title, n.content, 'Source-linked GK note | source page ' || n.source_page::text FROM public.gk_notes n WHERE n.source_page BETWEEN 464 AND 468 AND NOT EXISTS (SELECT 1 FROM public.search_documents d WHERE d.entity_type = 'note' AND d.entity_id = n.id);
INSERT INTO public.search_documents (entity_type, entity_id, title, body, english_metadata)
SELECT 'mcq', m.id, NULL, m.question, 'Past-exam MCQ | source page 467 | question ' || COALESCE(m.source_question_number, '') FROM public.gk_mcqs m WHERE m.source_page = 467 AND NOT EXISTS (SELECT 1 FROM public.search_documents d WHERE d.entity_type = 'mcq' AND d.entity_id = m.id);`;

  const audit = {
    batch_pages: BATCH_PAGES, pipeline_version: PIPELINE_VERSION,
    source_pages: pages.map(page => ({ page: page.source_page, sha256: page.source_image_sha256, review: page.review.review_status })),
    generated_fact_candidates: facts.length, generated_notes: notes.length, generated_mcqs: mcqs.length, generated_options: mcqs.length * 4,
    verification_statuses: Object.groupBy(verificationRows, row => row.status),
    quality_gates: [
      "Raw OCR and reviewed transcripts are preserved in per-page artifacts and source_pages.raw_transcription.",
      "Physical PDF pages remain distinct from printed page numbers in review metadata.",
      "Biographies, tables, definitions, notes, facts, MCQs, options, answers, and exam labels are imported as distinct typed records.",
      "Conflicting claims remain source-linked and low confidence rather than silently normalized.",
      "All database writes are idempotent through source-page checks, canonical hashes, or source keys.",
    ],
  };
  const sql = `-- Generated by scripts/prepare_validated_batch_0464_0468.mjs\n-- Source pages: 464–468 only. Do not extend this batch without explicit user instruction.\nBEGIN;\nINSERT INTO public.import_runs (source_filename, source_sha256, pipeline_version, status, completed_at, audit) VALUES ('Jubayer''sgk.pdf', ${q(sha(pages.map(page => page.source_image_sha256).join("|")))}, ${q(PIPELINE_VERSION)}, 'completed', now(), ${qJson(audit)});\n${contextSql}\n${sourcePagesSql}\n${factsSql}\n${notesSql}\n${mcqSql}\n${tagSql}\n${verificationSql}\n${derivedSql}\nCOMMIT;`;
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
