import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const work = "/home/ubuntu/dontonyo-work/batch-0204-0208";
const out = path.join(root, "supabase", "batch-0204-0208");
const quote = value => `'${String(value ?? "").replaceAll("'", "''")}'`;
const json = value => `${quote(JSON.stringify(value))}::jsonb`;
const hash = value => createHash("sha256").update(value).digest("hex");

export const BATCH_PAGES = [204, 205, 206, 207, 208];
export const PIPELINE_VERSION = "local-ocr-quality-gated-recovery-batch-0204-0208-v1";

export async function buildBatch() {
  const content = JSON.parse(await fs.readFile(path.join(out, "approved_content.json"), "utf8"));
  const pages = await Promise.all(BATCH_PAGES.map(async page => ({
    page,
    sha256: hash(await fs.readFile(path.join(work, "rendered", `page_${String(page).padStart(4, "0")}.jpg`))),
    raw: await fs.readFile(path.join(work, "ocr", `page_${String(page).padStart(4, "0")}.txt`), "utf8"),
  })));
  const audit = {
    batch_pages: BATCH_PAGES,
    pipeline_version: PIPELINE_VERSION,
    generated_facts: 0,
    generated_notes: 0,
    generated_mcqs: 0,
    generated_options: 0,
    generated_flashcards: 0,
    source_pages: pages.map(page => ({ page: page.page, review_status: "completed_image_grounded_review", image_sha256: page.sha256, overall_confidence: "medium" })),
    verification_counts: { verified: 0, conflicting: 0, source_attributed: 0 },
    source_anomalies: [
      "All 35 ordered overlap-safe recovery tiles were reviewed.",
      "Local Bangla-English OCR was reconciled with visual evidence; image evidence controlled.",
      "OCR degradation, historical/institutional dates, political/military-security material, reported statements, and printed question-key text were preserved rather than normalized.",
      "Political, military/security, legal, national, party-identity, electoral, historical, death, biographical, memorial, institutional, territorial/location, numerical, literary-attribution, slogan, and date-sensitive claims were withheld.",
    ],
    quality_gates: [
      "Only recovery source pages 204–208 are included.",
      "No reviewed claim clears the conservative quality, policy-safety, internal-consistency, and authority-verification boundary.",
      "Only reviewed source provenance and page-local topic boundaries are admitted.",
    ],
  };
  const topicSql = content.topics.map(topic => `INSERT INTO public.topics (chapter_id,title,slug,description,source_page,display_order) SELECT c.id,${quote(topic.title)},${quote(topic.slug)},'Source-derived content with completed visual review, conservative classification, and recorded verification decision.',${topic.page},${topic.order} FROM public.chapters c JOIN public.books b ON b.id=c.book_id WHERE b.title='Jubayer''s GK' AND c.slug='europe' AND NOT EXISTS (SELECT 1 FROM public.topics x WHERE x.chapter_id=c.id AND x.slug=${quote(topic.slug)});`).join("\n");
  const pageSql = pages.map(page => {
    const topic = content.topics.find(item => item.page === page.page).slug;
    const metadata = { physical_source_page: page.page, source_image_sha256: page.sha256, review_status: "completed_image_grounded_review", review_report: `${out}/visual_review_204_208.md`, classification_report: `${out}/classification_decisions.md`, verification_report: `${out}/external_verification.md`, recovery_audit: `${root}/supabase/final-source-coverage-audit.md`, orientation_note: "Rendered source image visually verified upright before local OCR." };
    return `INSERT INTO public.source_pages (import_run_id,book_id,source_page,page_kind,raw_transcription,chapter_heading,topic_heading,confidence,extraction_method,model_name,notes,review_metadata) SELECT (SELECT id FROM public.import_runs WHERE pipeline_version=${quote(PIPELINE_VERSION)} ORDER BY started_at DESC LIMIT 1),b.id,${page.page},'educational'::page_kind,${quote(page.raw)},'Political-history, language-movement, and question-bank source reference',${quote(topic)},'medium'::confidence_level,'local_ocr_with_image_grounded_review','tesseract-ben+eng','All ordered source tiles reviewed; upright OCR reconciled with visual evidence; no learner-facing records classified for import.',${json(metadata)} FROM public.books b WHERE b.title='Jubayer''s GK' AND NOT EXISTS (SELECT 1 FROM public.source_pages s WHERE s.book_id=b.id AND s.source_page=${page.page});`;
  }).join("\n");
  const tags = [["source-provenance", "Source provenance", "quality", "Source-preserved record without learner-facing claim admission."], ["political-history-reference", "Political history reference", "domain", "Political-history material retained as reviewed source provenance."], ["language-movement-reference", "Language-movement reference", "domain", "Historical language-movement material retained as reviewed source provenance."]];
  const sql = `-- Generated by prepare_validated_batch_0204_0208.mjs. Recovery source pages 204–208 only.\nBEGIN;\nINSERT INTO public.import_runs (source_filename,source_sha256,pipeline_version,status,completed_at,audit) SELECT 'Jubayer''sgk.pdf',${quote(hash(pages.map(page => page.sha256).join("|")))},${quote(PIPELINE_VERSION)},'completed',now(),${json(audit)} WHERE NOT EXISTS (SELECT 1 FROM public.import_runs WHERE pipeline_version=${quote(PIPELINE_VERSION)});\n${topicSql}\n${pageSql}\nINSERT INTO public.content_tags (slug,label,category,description) VALUES ${tags.map(row => `(${row.map(quote).join(",")})`).join(",")} ON CONFLICT (slug) DO UPDATE SET label=EXCLUDED.label,category=EXCLUDED.category,description=EXCLUDED.description;\nCOMMIT;`;
  return { sql, audit, counts: { batch_pages: BATCH_PAGES, review_tiles: 35, eligible_facts: 0, eligible_notes: 0, eligible_mcqs: 0, eligible_mcq_options: 0, withheld_mcqs: 0, derived_records: 0, verification_statuses: audit.verification_counts } };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const { sql, audit, counts } = await buildBatch();
  await fs.mkdir(out, { recursive: true });
  await fs.writeFile(path.join(out, "validated_import.sql"), sql);
  await fs.writeFile(path.join(out, "batch_audit.json"), JSON.stringify(audit, null, 2));
  await fs.writeFile(path.join(out, "execute_sql_request.json"), JSON.stringify({ project_id: "rennotctgrxvbpghbimx", query: sql }));
  await fs.writeFile(path.join(work, "import_input_counts.json"), JSON.stringify(counts, null, 2));
}
