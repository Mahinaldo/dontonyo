import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const work = "/home/ubuntu/dontonyo-work/batch-0914-0918";
const out = path.join(root, "supabase", "batch-0914-0918");
const quote = value => `'${String(value ?? "").replaceAll("'", "''")}'`;
const json = value => `${quote(JSON.stringify(value))}::jsonb`;
const hash = value => createHash("sha256").update(value).digest("hex");

export const BATCH_PAGES = [914, 915, 916, 917, 918];
export const PIPELINE_VERSION = "local-ocr-quality-gated-batch-0914-0918-v1";

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
      "All 35 ordered overlap-safe source tiles were reviewed.",
      "Local Bangla-English OCR was reconciled with visual evidence; image evidence controlled.",
      "OCR degradation, damaged table text, a malformed cosmology duration, partial list content, and an unreconstructible answer-key row were preserved rather than normalized.",
      "Economic, fiscal, government, national, legal, financial-crime, military, environmental, climate, historical, biographical, attribution-sensitive, identity-sensitive, geographic, current-status, and date-sensitive claims were withheld.",
    ],
    quality_gates: [
      "Only source pages 914–918 are included.",
      "No reviewed claim clears the conservative quality, policy-safety, and authority-verification boundary.",
      "Only reviewed source provenance and page-local topic boundaries are admitted.",
    ],
  };
  const topicSql = content.topics.map(topic => `INSERT INTO public.topics (chapter_id,title,slug,description,source_page,display_order) SELECT c.id,${quote(topic.title)},${quote(topic.slug)},'Source-derived content with completed visual review, conservative classification, and recorded verification decision.',${topic.page},${topic.order} FROM public.chapters c JOIN public.books b ON b.id=c.book_id WHERE b.title='Jubayer''s GK' AND c.slug='europe' AND NOT EXISTS (SELECT 1 FROM public.topics x WHERE x.chapter_id=c.id AND x.slug=${quote(topic.slug)});`).join("\n");
  const pageSql = pages.map(page => {
    const topic = content.topics.find(item => item.page === page.page).slug;
    const metadata = { physical_source_page: page.page, source_image_sha256: page.sha256, review_status: "completed_image_grounded_review", review_report: `${out}/visual_review_914_918.md`, classification_report: `${out}/classification_decisions.md`, verification_report: `${out}/external_verification.md`, orientation_note: "Rendered source image visually verified upright before local OCR." };
    return `INSERT INTO public.source_pages (import_run_id,book_id,source_page,page_kind,raw_transcription,chapter_heading,topic_heading,confidence,extraction_method,model_name,notes,review_metadata) SELECT (SELECT id FROM public.import_runs WHERE pipeline_version=${quote(PIPELINE_VERSION)} ORDER BY started_at DESC LIMIT 1),b.id,${page.page},'educational'::page_kind,${quote(page.raw)},'Economics, development, science, and climate source reference',${quote(topic)},'medium'::confidence_level,'local_ocr_with_image_grounded_review','tesseract-ben+eng','All ordered source tiles reviewed; upright OCR reconciled with visual evidence; no learner-facing records classified for import.',${json(metadata)} FROM public.books b WHERE b.title='Jubayer''s GK' AND NOT EXISTS (SELECT 1 FROM public.source_pages s WHERE s.book_id=b.id AND s.source_page=${page.page});`;
  }).join("\n");
  const tags = [["source-provenance", "Source provenance", "quality", "Source-preserved record without learner-facing claim admission."], ["economics-reference", "Economics reference", "domain", "Economics material retained as reviewed source provenance."], ["environment-development-reference", "Environment and development reference", "domain", "Environment and human-development material retained as reviewed source provenance."], ["science-climate-reference", "Science and climate reference", "domain", "Science and climate material retained as reviewed source provenance."]];
  const sql = `-- Generated by prepare_validated_batch_0914_0918.mjs. Source pages 914–918 only.\nBEGIN;\nINSERT INTO public.import_runs (source_filename,source_sha256,pipeline_version,status,completed_at,audit) SELECT 'Jubayer''sgk.pdf',${quote(hash(pages.map(page => page.sha256).join("|")))},${quote(PIPELINE_VERSION)},'completed',now(),${json(audit)} WHERE NOT EXISTS (SELECT 1 FROM public.import_runs WHERE pipeline_version=${quote(PIPELINE_VERSION)});\n${topicSql}\n${pageSql}\nINSERT INTO public.content_tags (slug,label,category,description) VALUES ${tags.map(row => `(${row.map(quote).join(",")})`).join(",")} ON CONFLICT (slug) DO UPDATE SET label=EXCLUDED.label,category=EXCLUDED.category,description=EXCLUDED.description;\nCOMMIT;`;
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
