import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const work = "/home/ubuntu/dontonyo-work/batch-0794-0798";
const out = path.join(root, "supabase", "batch-0794-0798");
const bookTitle = "Jubayer's GK";
const q = (value) => `'${String(value ?? "").replaceAll("'", "''")}'`;
const j = (value) => `${q(JSON.stringify(value))}::jsonb`;
const hash = (value) => createHash("sha256").update(value).digest("hex");
const factEntity = (item) => `(SELECT id FROM public.gk_facts WHERE canonical_hash=${q(item.hash)} LIMIT 1)`;

export const BATCH_PAGES = [794, 795, 796, 797, 798];
export const PIPELINE_VERSION = "local-ocr-quality-gated-batch-0794-0798-v1";

export async function buildBatch() {
  const content = JSON.parse(await fs.readFile(path.join(out, "approved_content.json"), "utf8"));
  const pages = await Promise.all(BATCH_PAGES.map(async (page) => ({
    page,
    sha256: hash(await fs.readFile(path.join(work, "rendered", `page_${String(page).padStart(4, "0")}.jpg`))),
    raw: await fs.readFile(path.join(work, "ocr", `page_${String(page).padStart(4, "0")}.txt`), "utf8"),
  })));
  const facts = content.facts.map((item) => ({ ...item, domain: content.topics.find((topic) => topic.slug === item.topic)?.domain, hash: hash(`fact|${item.page}|${item.title}|${item.text}`), confidence: "high" }));
  const audit = {
    batch_pages: BATCH_PAGES,
    pipeline_version: PIPELINE_VERSION,
    generated_facts: facts.length,
    generated_notes: 0,
    generated_mcqs: 0,
    generated_options: 0,
    generated_flashcards: facts.length,
    source_pages: pages.map((page) => ({ page: page.page, review_status: "completed_image_grounded_review", image_sha256: page.sha256, overall_confidence: "medium" })),
    verification_counts: { verified: facts.length, conflicting: 0, source_attributed: 0 },
    source_anomalies: [
      "All 35 ordered overlap-safe source tiles were reviewed.",
      "Local OCR was reconciled with visual evidence; image evidence controlled.",
      "Only three exact neutral literary author-work attributions passed visual readability, OCR reconciliation, duplicate screening, and authority-verification gates.",
      "Political, military, leadership, economic, ideological, religiously adjacent, location-linked, biographical, current-status, duplicate, and source-imprecise claims were withheld."
    ],
    quality_gates: [
      "Only source pages 794–798 are included.",
      "Only exact neutral literary author-work attributions with visual readability, OCR reconciliation, duplicate screening, and direct authority corroboration are admitted.",
      "No notes or MCQs are included because no reviewed source item clears the conservative content boundary for those forms.",
      "Only established domain and quality tag categories are inserted.",
      "Only reviewed source-page provenance, topic boundaries, three verified facts, and their derived flashcard/search artifacts are admitted."
    ]
  };
  const topicSql = content.topics.map((topic) => `INSERT INTO public.topics (chapter_id,title,slug,description,source_page,display_order) SELECT c.id,${q(topic.title)},${q(topic.slug)},'Source-derived content with completed visual review, conservative classification, and recorded verification.',${topic.page},${topic.order} FROM public.chapters c JOIN public.books b ON b.id=c.book_id WHERE b.title=${q(bookTitle)} AND c.slug='europe' AND NOT EXISTS (SELECT 1 FROM public.topics x WHERE x.chapter_id=c.id AND x.slug=${q(topic.slug)});`).join("\n");
  const pageSql = pages.map((page) => {
    const topic = content.topics.find((item) => item.page === page.page).slug;
    const metadata = {
      physical_source_page: page.page,
      source_image_sha256: page.sha256,
      review_status: "completed_image_grounded_review",
      review_report: `${out}/visual_review_794_798.md`,
      classification_report: `${out}/classification_decisions.md`,
      verification_report: `${out}/external_verification.md`,
      recovery_artifacts: [`page_${String(page.page).padStart(4, "0")}.txt`],
      orientation_note: "Rendered source image visually verified upright before local OCR."
    };
    return `INSERT INTO public.source_pages (import_run_id,book_id,source_page,page_kind,raw_transcription,chapter_heading,topic_heading,confidence,extraction_method,model_name,notes,review_metadata) SELECT (SELECT id FROM public.import_runs WHERE pipeline_version=${q(PIPELINE_VERSION)} ORDER BY started_at DESC LIMIT 1),b.id,${page.page},'educational'::page_kind,${q(page.raw)},'World history',${q(topic)},'medium'::confidence_level,'local_ocr_with_image_grounded_review','tesseract-ben+eng','All ordered source tiles reviewed; upright OCR reconciled with visual evidence; only classified records imported.',${j(metadata)} FROM public.books b WHERE b.title=${q(bookTitle)} AND NOT EXISTS (SELECT 1 FROM public.source_pages s WHERE s.book_id=b.id AND s.source_page=${page.page});`;
  }).join("\n");
  const factSql = facts.map((item) => `INSERT INTO public.gk_facts (book_id,chapter_id,topic_id,title,fact_text,explanation,source_page,source_section,source_excerpt,importance,confidence,canonical_hash) SELECT b.id,c.id,t.id,${q(item.title)},${q(item.text)},'Exact neutral literary author-work attribution was visually reviewed, OCR-reconciled, duplicate-screened, and directly authority-verified; citations are recorded in the batch verification ledger.',${item.page},${q(item.title)},${q(item.text)},3,'high'::confidence_level,${q(item.hash)} FROM public.books b JOIN public.chapters c ON c.book_id=b.id AND c.slug='europe' JOIN public.topics t ON t.chapter_id=c.id AND t.slug=${q(item.topic)} WHERE b.title=${q(bookTitle)} ON CONFLICT (canonical_hash) DO UPDATE SET fact_text=EXCLUDED.fact_text,explanation=EXCLUDED.explanation,confidence=EXCLUDED.confidence;`).join("\n");
  const tags = [["world-history", "World history", "domain", "Historically scoped world-reference material."], ["externally-verified", "Externally verified", "quality", "Directly corroborated record."], ["literary-attribution", "Literary attribution", "quality", "Exact author-work relationship corroborated by an authority source."]];
  const tagSql = `INSERT INTO public.content_tags (slug,label,category,description) VALUES ${tags.map((row) => `(${row.map(q).join(",")})`).join(",")} ON CONFLICT (slug) DO UPDATE SET label=EXCLUDED.label,category=EXCLUDED.category,description=EXCLUDED.description;\n${facts.map((item) => [item.domain, "externally-verified", "literary-attribution"].map((slug) => `INSERT INTO public.content_tag_assignments (tag_id,entity_type,entity_id,source_page,confidence,assigned_by) SELECT t.id,'fact',${factEntity(item)},${item.page},'high'::confidence_level,'batch-0794-0798-quality-pipeline' FROM public.content_tags t WHERE t.slug=${q(slug)} ON CONFLICT DO NOTHING;`).join("\n")).join("\n")}`;
  const verificationSql = facts.map((item) => `INSERT INTO public.fact_verifications (source_page,entity_type,entity_id,claim_text,normalized_claim,verification_status,confidence,verification_sources,audit_note) SELECT ${item.page},'fact',${factEntity(item)},${q(item.text)},NULL,'verified','high'::confidence_level,${j(item.sources)},'Exact neutral literary author-work attribution was visually reviewed, OCR-reconciled, duplicate-screened, and directly corroborated by the recorded authority source.' WHERE NOT EXISTS (SELECT 1 FROM public.fact_verifications v WHERE v.entity_type='fact' AND v.entity_id=${factEntity(item)} AND v.claim_text=${q(item.text)});`).join("\n");
  const derivedSql = `INSERT INTO public.flashcards (subject_id,book_id,chapter_id,topic_id,front_text,back_text,source_type,source_id,source_key) SELECT (SELECT id FROM public.subjects ORDER BY created_at ASC LIMIT 1),f.book_id,f.chapter_id,f.topic_id,f.title,f.fact_text,'fact',f.id,'batch0794-0798:fact:'||f.id::text FROM public.gk_facts f WHERE f.source_page BETWEEN 794 AND 798 AND NOT EXISTS (SELECT 1 FROM public.flashcards z WHERE z.source_key='batch0794-0798:fact:'||f.id::text);\nINSERT INTO public.search_documents (entity_type,entity_id,title,body,english_metadata) SELECT 'fact',f.id,f.title,f.fact_text,'Verified literary attribution | source page '||f.source_page::text FROM public.gk_facts f WHERE f.source_page BETWEEN 794 AND 798 AND NOT EXISTS (SELECT 1 FROM public.search_documents d WHERE d.entity_type='fact' AND d.entity_id=f.id);`;
  const sql = `-- Generated by prepare_validated_batch_0794_0798.mjs. Source pages 794–798 only.\nBEGIN;\nINSERT INTO public.import_runs (source_filename,source_sha256,pipeline_version,status,completed_at,audit) SELECT 'Jubayer''sgk.pdf',${q(hash(pages.map((page) => page.sha256).join("|")))},${q(PIPELINE_VERSION)},'completed',now(),${j(audit)} WHERE NOT EXISTS (SELECT 1 FROM public.import_runs WHERE pipeline_version=${q(PIPELINE_VERSION)});\n${topicSql}\n${pageSql}\n${factSql}\n${tagSql}\n${verificationSql}\n${derivedSql}\nCOMMIT;`;
  return { sql, audit, counts: { batch_pages: BATCH_PAGES, review_tiles: 35, eligible_facts: facts.length, eligible_notes: 0, eligible_mcqs: 0, eligible_mcq_options: 0, withheld_mcqs: 0, derived_records: facts.length, verification_statuses: audit.verification_counts } };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const { sql, audit, counts } = await buildBatch();
  await fs.mkdir(out, { recursive: true });
  await fs.writeFile(path.join(out, "validated_import.sql"), sql);
  await fs.writeFile(path.join(out, "batch_audit.json"), JSON.stringify(audit, null, 2));
  await fs.writeFile(path.join(out, "execute_sql_request.json"), JSON.stringify({ project_id: "rennotctgrxvbpghbimx", query: sql }));
  await fs.writeFile(path.join(work, "import_input_counts.json"), JSON.stringify(counts, null, 2));
}
