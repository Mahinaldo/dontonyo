import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const work = "/home/ubuntu/dontonyo-work/batch-0849-0853";
const out = path.join(root, "supabase", "batch-0849-0853");
const q = value => `'${String(value ?? "").replaceAll("'", "''")}'`;
const j = value => `${q(JSON.stringify(value))}::jsonb`;
const h = value => createHash("sha256").update(value).digest("hex");

export const BATCH_PAGES = [849, 850, 851, 852, 853];
export const PIPELINE_VERSION = "local-ocr-quality-gated-batch-0849-0853-v1";

export async function buildBatch() {
  const content = JSON.parse(await fs.readFile(path.join(out, "approved_content.json"), "utf8"));
  const pages = await Promise.all(BATCH_PAGES.map(async page => ({
    page,
    sha256: h(await fs.readFile(path.join(work, "rendered", `page_${String(page).padStart(4, "0")}.jpg`))),
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
    source_pages: pages.map(source => ({
      page: source.page,
      review_status: "completed_image_grounded_review",
      image_sha256: source.sha256,
      overall_confidence: "medium",
    })),
    verification_counts: { verified: 0, conflicting: 0, source_attributed: 0 },
    source_anomalies: [
      "All 35 ordered overlap-safe source tiles were reviewed.",
      "Local Bangla-English OCR was reconciled with visual evidence; image evidence controlled.",
      "Political, religious, identity, military/security, historical-attribution, ranking and source-imprecise claims were withheld.",
    ],
    quality_gates: [
      "Only source pages 849–853 are included.",
      "No reviewed claim clears the conservative quality and safety boundary.",
      "Only reviewed source provenance and page-local topic boundaries are admitted.",
    ],
  };

  const topicSql = content.topics.map(topic => `INSERT INTO public.topics (chapter_id,title,slug,description,source_page,display_order) SELECT c.id,${q(topic.title)},${q(topic.slug)},'Source-derived content with completed visual review, conservative classification, and recorded verification.',${topic.page},${topic.order} FROM public.chapters c JOIN public.books b ON b.id=c.book_id WHERE b.title='Jubayer''s GK' AND c.slug='europe' AND NOT EXISTS (SELECT 1 FROM public.topics z WHERE z.chapter_id=c.id AND z.slug=${q(topic.slug)});`).join("\n");
  const sourceSql = pages.map(source => {
    const topic = content.topics.find(candidate => candidate.page === source.page).slug;
    const metadata = {
      physical_source_page: source.page,
      source_image_sha256: source.sha256,
      review_status: "completed_image_grounded_review",
      review_report: `${out}/visual_review_849_853.md`,
      classification_report: `${out}/classification_decisions.md`,
    };
    return `INSERT INTO public.source_pages (import_run_id,book_id,source_page,page_kind,raw_transcription,chapter_heading,topic_heading,confidence,extraction_method,model_name,notes,review_metadata) SELECT (SELECT id FROM public.import_runs WHERE pipeline_version=${q(PIPELINE_VERSION)} ORDER BY started_at DESC LIMIT 1),b.id,${source.page},'educational'::page_kind,${q(source.raw)},'World history',${q(topic)},'medium'::confidence_level,'local_ocr_with_image_grounded_review','tesseract-ben+eng','All ordered source tiles reviewed; local OCR reconciled with visual evidence; only classified records imported.',${j(metadata)} FROM public.books b WHERE b.title='Jubayer''s GK' AND NOT EXISTS (SELECT 1 FROM public.source_pages z WHERE z.book_id=b.id AND z.source_page=${source.page});`;
  }).join("\n");
  const sql = `BEGIN;\nINSERT INTO public.import_runs (source_filename,source_sha256,pipeline_version,status,completed_at,audit) SELECT 'Jubayer''sgk.pdf',${q(h(pages.map(source => source.sha256).join("|")))},${q(PIPELINE_VERSION)},'completed',now(),${j(audit)} WHERE NOT EXISTS (SELECT 1 FROM public.import_runs WHERE pipeline_version=${q(PIPELINE_VERSION)});\n${topicSql}\n${sourceSql}\nCOMMIT;`;

  return {
    sql,
    audit,
    counts: {
      batch_pages: BATCH_PAGES,
      review_tiles: 35,
      eligible_facts: 0,
      eligible_notes: 0,
      eligible_mcqs: 0,
      eligible_mcq_options: 0,
      withheld_mcqs: 0,
      derived_records: 0,
      verification_statuses: audit.verification_counts,
    },
  };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const { sql, audit } = await buildBatch();
  await fs.writeFile(path.join(out, "validated_import.sql"), sql);
  await fs.writeFile(path.join(out, "batch_audit.json"), JSON.stringify(audit, null, 2));
  await fs.writeFile(path.join(out, "execute_sql_request.json"), JSON.stringify({ project_id: "rennotctgrxvbpghbimx", query: sql }));
}
