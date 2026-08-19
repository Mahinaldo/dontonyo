import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const workDir = "/home/ubuntu/dontonyo-work/batch-0469-0473";
const outputDir = path.join(root, "supabase", "batch-0469-0473");
const pageFiles = [469, 470, 471, 472, 473].map(page => path.join(workDir, "pages", `page_${String(page).padStart(4, "0")}.json`));

export const BATCH_PAGES = [469, 470, 471, 472, 473];
export const BOOK_TITLE = "Jubayer's GK";
export const PIPELINE_VERSION = "vision-quality-gated-batch-0469-0473-v1";

const refs = {
  baf: ["https://baf.mil.bd/baf-history.php"],
  osmani: ["https://www.osmanimuseum.org.bd/e/about-us/"],
  navy: ["https://en.prothomalo.com/bangladesh/bangladeshs-first-chief-of-naval-staff-navy-nurul-huq-dies"],
  seaAngel: [
    "https://www.usmcu.edu/Research/Marine-Corps-History-Division/Information-for-Units/-Marine-Corps-Humanitarian-Operations/",
    "https://www.marines.mil/Portals/1/Publications/ANGELS%20FROM%20THE%20SEA%20-%20RELIEF%20OPERATIONS%20IN%20BANGLADESH%201991%20PCN%2019000316400_1.pdf",
  ],
  seaAngel2: [
    "https://www.usmcu.edu/Research/Marine-Corps-History-Division/Information-for-Units/-Marine-Corps-Humanitarian-Operations/",
    "https://www.11thmeu.marines.mil/Media-Room/Stories/Article/Article/533488/sea-angel-ii-lands-in-bangladesh-with-more-aid/",
  ],
  thunderbolt: ["https://www.thedailystar.net/city/gulshan-attack-ispr-briefing-1230pm-1249231"],
};

const tags = [
  ["bangladesh-defence", "Bangladesh defence", "domain", "Bangladesh armed forces, security institutions, and military terminology."],
  ["bangladesh-police", "Bangladesh Police", "domain", "Police organisation, law references, and policing history."],
  ["border-security", "Border and public security", "domain", "Border Guard, RAB, Coast Guard, SSF, Ansar, and public-security material."],
  ["bangladesh-operations", "Bangladesh operations", "content_type", "Named security, relief, and public-administration operations."],
  ["biography", "Biography", "content_type", "Named-person biographical source material."],
  ["table", "Table or reference list", "content_type", "Source table, structured list, or labelled reference information."],
  ["definition", "Definition", "content_type", "Definition or terminology preserved from the source."],
  ["location-reference", "Location reference", "content_type", "Institution location preserved as a separate study note."],
  ["source-attributed", "Source-attributed", "quality", "Preserved from the book with source linkage but no completed independent verification."],
  ["externally-verified", "Externally verified", "quality", "Corroborated by an external source listed in the verification ledger."],
  ["conflicting-verification", "Conflicting verification", "quality", "External evidence conflicts with the book's exact claim or printed answer."],
];

const sha = value => crypto.createHash("sha256").update(value, "utf8").digest("hex");
const q = value => `'${String(value ?? "").replaceAll("'", "''")}'`;
const qJson = value => `${q(JSON.stringify(value))}::jsonb`;
const values = rows => rows.map(row => `(${row.map(q).join(", ")})`).join(",\n");
const confidence = value => (value === "high" || value === "low" ? value : "medium");

function contextFor(page) {
  if (page === 469) return { chapter: "bangladesh-defence-security", topic: "bangladesh-police-information", chapterTitle: "বাংলাদেশের প্রতিরক্ষা ও নিরাপত্তা বাহিনী", topicTitle: "বাংলাদেশ পুলিশ", baseTag: "bangladesh-police" };
  if (page === 470) return { chapter: "bangladesh-defence-security", topic: "armed-forces", chapterTitle: "বাংলাদেশের প্রতিরক্ষা ও নিরাপত্তা বাহিনী", topicTitle: "বাংলাদেশের সশস্ত্র বাহিনী", baseTag: "bangladesh-defence" };
  if (page === 471) return { chapter: "bangladesh-defence-security", topic: "border-and-public-security", chapterTitle: "বাংলাদেশের প্রতিরক্ষা ও নিরাপত্তা বাহিনী", topicTitle: "সীমান্ত ও জননিরাপত্তা বাহিনী", baseTag: "border-security" };
  if (page === 472) return { chapter: "bangladesh-defence-security", topic: "ansar-and-military-terms", chapterTitle: "বাংলাদেশের প্রতিরক্ষা ও নিরাপত্তা বাহিনী", topicTitle: "আনসার ও সামরিক পরিভাষা", baseTag: "bangladesh-defence" };
  return { chapter: "bangladesh-defence-security", topic: "bangladesh-operations", chapterTitle: "বাংলাদেশের প্রতিরক্ষা ও নিরাপত্তা বাহিনী", topicTitle: "বাংলাদেশের অপারেশন", baseTag: "bangladesh-operations" };
}

function verdict(page, text) {
  if (page === 470 && text.includes("এ কে খন্দকার")) return { status: "verified", confidence: "high", sources: refs.baf };
  if (page === 470 && text.includes("এম এ জি ওসমানী")) return { status: "verified", confidence: "high", sources: refs.osmani };
  if (page === 470 && text.includes("নূরুল হক")) return { status: "verified", confidence: "high", sources: refs.navy };
  if (page === 473 && text.includes("১৯৯১ সালে বাংলাদেশে পরিচালিত মার্কিন ত্রাণ")) return { status: "source_attributed", confidence: "medium", sources: [] };
  if (page === 473 && text.includes("সি অ্যাঞ্জেল-২")) return { status: "verified", confidence: "high", sources: refs.seaAngel2 };
  if (page === 473 && (text.includes("সি অ্যাঞ্জেল") || text.includes("সি এঞ্জেল"))) return { status: "verified", confidence: "high", sources: refs.seaAngel };
  if (page === 473 && text.includes("থান্ডার বোল্ট")) return { status: "verified", confidence: "high", sources: refs.thunderbolt };
  return { status: "source_attributed", confidence: "medium", sources: [] };
}

function bulletParts(text) {
  return text
    .replaceAll("\r", "")
    .split(/(?:\n\s*-\s*|\s*[♦•]\s*)/)
    .map(item => item.trim())
    .filter(item => item.length >= 4);
}

function nonHeadingFactParts(page, block) {
  if (page.source_page === 473 && block.block_type === "table") return block.text.split("\n").map(item => item.trim()).filter(Boolean);
  if (page.source_page === 470 && block.block_type === "fact") return [block.text.trim()];
  return bulletParts(block.text);
}

function buildFacts(pages) {
  const rows = [];
  for (const page of pages) {
    const context = contextFor(page.source_page);
    let heading = context.topicTitle;
    for (const block of page.transcription.blocks) {
      if (["chapter_heading", "topic_heading"].includes(block.block_type)) {
        heading = block.text;
        continue;
      }
      if (!(["fact", "biography"].includes(block.block_type) || (page.source_page === 473 && block.block_type === "table"))) continue;
      for (const factText of nonHeadingFactParts(page, block)) {
        if (factText.length < 4) continue;
        const quality = verdict(page.source_page, factText);
        rows.push({
          source_page: page.source_page,
          chapter_slug: context.chapter,
          topic_slug: context.topic,
          title: heading,
          fact_text: factText,
          source_excerpt: factText,
          content_type: page.source_page === 473 ? "bangladesh-operations" : block.block_type === "biography" ? "biography" : context.baseTag,
          importance: quality.status === "verified" ? 4 : 3,
          ...quality,
        });
      }
    }
  }
  return rows.map(row => ({ ...row, canonical_hash: sha(`fact|${row.source_page}|${row.title}|${row.fact_text}`) }));
}

function buildNotes(pages) {
  const rows = [];
  const add = (page, title, content, contentType, qualityOverride) => {
    if (!content || content.trim().length < 4) return;
    const quality = qualityOverride ?? verdict(page.source_page, content);
    rows.push({ ...contextFor(page.source_page), source_page: page.source_page, title, content: content.trim(), content_type: contentType, ...quality, canonical_hash: sha(`note|${page.source_page}|${title}|${content}`) });
  };
  for (const page of pages) {
    let heading = contextFor(page.source_page).topicTitle;
    for (const block of page.transcription.blocks) {
      if (["chapter_heading", "topic_heading"].includes(block.block_type)) {
        heading = block.text;
        continue;
      }
      if (block.block_type === "definition") add(page, heading, block.text, "definition");
      if (block.block_type === "table") add(page, heading, block.text, "table", { status: "source_attributed", confidence: "medium", sources: [] });
      if (block.block_type === "note") add(page, heading, block.text, "location-reference");
      if (page.source_page === 472 && block.block_type === "misc" && block.text.includes("ব্যাটালিয়ন সদর")) add(page, heading, block.text, "location-reference");
    }
  }
  return rows;
}

function pageMetadata(page) {
  const printedBookPage = { 469: 412, 470: 413, 471: 414, 472: 415, 473: 416 }[page.source_page];
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
    page_number_mismatch: nested !== page.source_page ? "Nested OCR metadata differs from the physical PDF page; physical source_page remains canonical." : null,
    visual_review_report: page.source_page === 471 ? "/home/ubuntu/dontonyo/reports/batch-0469-0473_visual_review.md" : null,
    external_verification_report: "/home/ubuntu/dontonyo/reports/batch-0469-0473_external_verification.md",
    page_kind: page.source_page === 470 || page.source_page === 471 || page.source_page === 472 || page.source_page === 473 ? "mixed" : "educational",
  };
}

function qualityTag(status) { return status === "verified" ? "externally-verified" : status === "conflicting" ? "conflicting-verification" : "source-attributed"; }
function lookup(row) {
  if (row.entity_type === "fact") return `(SELECT id FROM public.gk_facts WHERE canonical_hash = ${q(row.canonical_hash)} LIMIT 1)`;
  return `(SELECT id FROM public.gk_notes WHERE canonical_hash = ${q(row.canonical_hash)} LIMIT 1)`;
}

export async function buildBatch() {
  const pages = await Promise.all(pageFiles.map(async file => JSON.parse(await fs.readFile(file, "utf8"))));
  const facts = buildFacts(pages);
  const notes = buildNotes(pages);
  const verificationRows = [
    ...facts.map(row => ({ entity_type: "fact", canonical_hash: row.canonical_hash, source_page: row.source_page, claim_text: row.source_excerpt, normalized_claim: row.fact_text, status: row.status, confidence: row.confidence, sources: row.sources })),
    ...notes.map(row => ({ entity_type: "note", canonical_hash: row.canonical_hash, source_page: row.source_page, claim_text: row.content, normalized_claim: row.content, status: row.status, confidence: row.confidence, sources: row.sources })),
  ];
  const contextSql = `
INSERT INTO public.chapters (book_id, chapter_number, title, slug, description, source_page, display_order)
SELECT b.id, 40, 'বাংলাদেশের প্রতিরক্ষা ও নিরাপত্তা বাহিনী', 'bangladesh-defence-security', 'Source-derived defence, police, border-security, and operation material with explicit verification states.', 468, 40
FROM public.books b WHERE b.title = ${q(BOOK_TITLE)} AND NOT EXISTS (SELECT 1 FROM public.chapters c WHERE c.book_id = b.id AND c.slug = 'bangladesh-defence-security');
INSERT INTO public.topics (chapter_id, title, slug, description, source_page, display_order)
SELECT c.id, x.title, x.slug, x.description, x.source_page, x.display_order FROM (VALUES
 ('bangladesh-police-information', 'বাংলাদেশ পুলিশ', 'Police facts, locations, laws, and historical context.', 469, 6),
 ('armed-forces', 'বাংলাদেশের সশস্ত্র বাহিনী', 'Army, Air Force, Navy, and institutional abbreviations.', 470, 7),
 ('border-and-public-security', 'সীমান্ত ও জননিরাপত্তা বাহিনী', 'Border Guard, RAB, Coast Guard, and SSF source material.', 471, 8),
 ('ansar-and-military-terms', 'আনসার ও সামরিক পরিভাষা', 'Ansar-VDP material, academy locations, and military terminology.', 472, 9),
 ('bangladesh-operations', 'বাংলাদেশের অপারেশন', 'Named relief, security, and public-administration operations.', 473, 10)
) AS x(slug, title, description, source_page, display_order) JOIN public.chapters c ON c.slug = 'bangladesh-defence-security' AND c.book_id = (SELECT id FROM public.books WHERE title = ${q(BOOK_TITLE)} LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM public.topics t WHERE t.chapter_id = c.id AND t.slug = x.slug);`;
  const sourcePagesSql = pages.map(page => {
    const context = contextFor(page.source_page); const metadata = pageMetadata(page);
    return `INSERT INTO public.source_pages (import_run_id, book_id, source_page, page_kind, raw_transcription, chapter_heading, topic_heading, confidence, extraction_method, model_name, notes, review_metadata)
SELECT (SELECT id FROM public.import_runs WHERE pipeline_version = ${q(PIPELINE_VERSION)} ORDER BY started_at DESC LIMIT 1), b.id, ${page.source_page}, ${q(metadata.page_kind)}::page_kind, ${q(page.review.verified_transcript)}, ${q(context.chapterTitle)}, ${q(context.topicTitle)}, ${q(confidence(page.review.overall_confidence))}::confidence_level, 'vision_ocr_with_image_grounded_review', ${q(page.model)}, ${q('Quality-gated batch with correction log, content-type separation, visual review, and external-verification ledger.')}, ${qJson(metadata)} FROM public.books b WHERE b.title = ${q(BOOK_TITLE)} AND NOT EXISTS (SELECT 1 FROM public.source_pages s WHERE s.book_id = b.id AND s.source_page = ${page.source_page});`;
  }).join("\n");
  const factsSql = `WITH data(source_page, chapter_slug, topic_slug, title, fact_text, source_excerpt, importance, confidence, canonical_hash, status) AS (VALUES
${values(facts.map(row => [row.source_page, row.chapter_slug, row.topic_slug, row.title, row.fact_text, row.source_excerpt, row.importance, row.confidence, row.canonical_hash, row.status]))})
INSERT INTO public.gk_facts (book_id, chapter_id, topic_id, title, fact_text, explanation, source_page, source_section, source_excerpt, importance, confidence, canonical_hash)
SELECT b.id, c.id, t.id, d.title, d.fact_text, CASE d.status WHEN 'verified' THEN 'Externally corroborated; source wording remains in source_excerpt.' ELSE 'Source-attributed material retained with source linkage and explicit verification status.' END, d.source_page::integer, d.title, d.source_excerpt, d.importance::smallint, d.confidence::confidence_level, d.canonical_hash FROM data d JOIN public.books b ON b.title = ${q(BOOK_TITLE)} JOIN public.chapters c ON c.book_id = b.id AND c.slug = d.chapter_slug JOIN public.topics t ON t.chapter_id = c.id AND t.slug = d.topic_slug ON CONFLICT (canonical_hash) DO UPDATE SET fact_text = EXCLUDED.fact_text, explanation = EXCLUDED.explanation, confidence = EXCLUDED.confidence, source_excerpt = EXCLUDED.source_excerpt;`;
  const notesSql = `WITH data(source_page, chapter_slug, topic_slug, title, content, confidence, canonical_hash) AS (VALUES
${values(notes.map(row => [row.source_page, row.chapter, row.topic, row.title, row.content, row.confidence, row.canonical_hash]))})
INSERT INTO public.gk_notes (book_id, chapter_id, topic_id, title, content, source_page, source_section, display_order, confidence, canonical_hash)
SELECT b.id, c.id, t.id, d.title, d.content, d.source_page::integer, d.title, d.source_page::integer, d.confidence::confidence_level, d.canonical_hash FROM data d JOIN public.books b ON b.title = ${q(BOOK_TITLE)} JOIN public.chapters c ON c.book_id = b.id AND c.slug = d.chapter_slug JOIN public.topics t ON t.chapter_id = c.id AND t.slug = d.topic_slug ON CONFLICT (canonical_hash) DO UPDATE SET content = EXCLUDED.content, confidence = EXCLUDED.confidence;`;
  const tagSql = `INSERT INTO public.content_tags (slug, label, category, description) VALUES
${tags.map(tag => `(${tag.map(q).join(", ")})`).join(",\n")}
ON CONFLICT (slug) DO UPDATE SET label = EXCLUDED.label, category = EXCLUDED.category, description = EXCLUDED.description;
${pages.map(page => `INSERT INTO public.content_tag_assignments (tag_id, entity_type, entity_id, source_page, confidence, assigned_by) SELECT t.id, 'source_page', s.id, ${page.source_page}, ${q(confidence(page.review.overall_confidence))}::confidence_level, 'batch-0469-0473-quality-pipeline' FROM public.content_tags t JOIN public.source_pages s ON s.source_page = ${page.source_page} AND s.book_id = (SELECT id FROM public.books WHERE title = ${q(BOOK_TITLE)} LIMIT 1) WHERE t.slug = ${q(contextFor(page.source_page).baseTag)} ON CONFLICT DO NOTHING;`).join("\n")}
${facts.map(row => [row.content_type, qualityTag(row.status)].map(tag => `INSERT INTO public.content_tag_assignments (tag_id, entity_type, entity_id, source_page, confidence, assigned_by) SELECT t.id, 'fact', f.id, ${row.source_page}, ${q(row.confidence)}::confidence_level, 'batch-0469-0473-quality-pipeline' FROM public.content_tags t JOIN public.gk_facts f ON f.canonical_hash = ${q(row.canonical_hash)} WHERE t.slug = ${q(tag)} ON CONFLICT DO NOTHING;`).join("\n")).join("\n")}
${notes.map(row => [row.content_type, qualityTag(row.status)].map(tag => `INSERT INTO public.content_tag_assignments (tag_id, entity_type, entity_id, source_page, confidence, assigned_by) SELECT t.id, 'note', n.id, ${row.source_page}, ${q(row.confidence)}::confidence_level, 'batch-0469-0473-quality-pipeline' FROM public.content_tags t JOIN public.gk_notes n ON n.canonical_hash = ${q(row.canonical_hash)} WHERE t.slug = ${q(tag)} ON CONFLICT DO NOTHING;`).join("\n")).join("\n")}`;
  const verificationSql = verificationRows.map(row => {
    const entityId = lookup(row);
    return `INSERT INTO public.fact_verifications (source_page, entity_type, entity_id, claim_text, normalized_claim, verification_status, confidence, verification_sources, audit_note) SELECT ${row.source_page}, ${q(row.entity_type)}, ${entityId}, ${q(row.claim_text)}, ${q(row.normalized_claim)}, ${q(row.status)}, ${q(row.confidence)}::confidence_level, ${qJson(row.sources)}, ${q(row.status === "verified" ? "External sources corroborate the normalized claim; book wording remains source-linked." : "Retained as source-attributed material pending deeper verification.")} WHERE NOT EXISTS (SELECT 1 FROM public.fact_verifications v WHERE v.entity_type = ${q(row.entity_type)} AND v.entity_id = ${entityId} AND v.claim_text = ${q(row.claim_text)});`;
  }).join("\n");
  const derivedSql = `
INSERT INTO public.flashcards (subject_id, book_id, chapter_id, topic_id, front_text, back_text, source_type, source_id, source_key) SELECT (SELECT id FROM public.subjects ORDER BY created_at ASC LIMIT 1), f.book_id, f.chapter_id, f.topic_id, COALESCE(f.title, 'মূল তথ্য'), f.fact_text, 'fact', f.id, 'batch0469-0473:fact:' || f.id::text FROM public.gk_facts f WHERE f.source_page BETWEEN 469 AND 473 AND NOT EXISTS (SELECT 1 FROM public.flashcards c WHERE c.source_key = 'batch0469-0473:fact:' || f.id::text);
INSERT INTO public.flashcards (subject_id, book_id, chapter_id, topic_id, front_text, back_text, source_type, source_id, source_key) SELECT (SELECT id FROM public.subjects ORDER BY created_at ASC LIMIT 1), n.book_id, n.chapter_id, n.topic_id, n.title, n.content, 'note', n.id, 'batch0469-0473:note:' || n.id::text FROM public.gk_notes n WHERE n.source_page BETWEEN 469 AND 473 AND NOT EXISTS (SELECT 1 FROM public.flashcards c WHERE c.source_key = 'batch0469-0473:note:' || n.id::text);
INSERT INTO public.search_documents (entity_type, entity_id, title, body, english_metadata) SELECT 'fact', f.id, f.title, f.fact_text, 'Source-linked GK fact | source page ' || f.source_page::text FROM public.gk_facts f WHERE f.source_page BETWEEN 469 AND 473 AND NOT EXISTS (SELECT 1 FROM public.search_documents d WHERE d.entity_type = 'fact' AND d.entity_id = f.id);
INSERT INTO public.search_documents (entity_type, entity_id, title, body, english_metadata) SELECT 'note', n.id, n.title, n.content, 'Source-linked GK note | source page ' || n.source_page::text FROM public.gk_notes n WHERE n.source_page BETWEEN 469 AND 473 AND NOT EXISTS (SELECT 1 FROM public.search_documents d WHERE d.entity_type = 'note' AND d.entity_id = n.id);`;
  const audit = { batch_pages: BATCH_PAGES, pipeline_version: PIPELINE_VERSION, source_pages: pages.map(page => ({ page: page.source_page, sha256: page.source_image_sha256, review: page.review.review_status })), generated_fact_candidates: facts.length, generated_notes: notes.length, generated_mcqs: 0, generated_options: 0, verification_statuses: Object.groupBy(verificationRows, row => row.status), quality_gates: ["Raw OCR and reviewed transcripts are preserved in per-page artifacts and source_pages.raw_transcription.", "Physical PDF pages remain distinct from printed book page numbers in review metadata.", "Facts, tables, definitions, locations, and institutional material are stored as distinct typed records.", "Only externally corroborated claims receive verified status; all others remain source-attributed.", "All database writes are idempotent through source-page checks, canonical hashes, or source keys."] };
  const sql = `-- Generated by scripts/prepare_validated_batch_0469_0473.mjs\n-- Source pages: 469–473 only. Do not extend this batch without explicit user instruction.\nBEGIN;\nINSERT INTO public.import_runs (source_filename, source_sha256, pipeline_version, status, completed_at, audit) VALUES ('Jubayer''sgk.pdf', ${q(sha(pages.map(page => page.source_image_sha256).join("|")))}, ${q(PIPELINE_VERSION)}, 'completed', now(), ${qJson(audit)});\n${contextSql}\n${sourcePagesSql}\n${factsSql}\n${notesSql}\n${tagSql}\n${verificationSql}\n${derivedSql}\nCOMMIT;`;
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
