import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const work = "/home/ubuntu/dontonyo-work/batch-0744-0748";
const out = path.join(root, "supabase", "batch-0744-0748");
const bookTitle = "Jubayer's GK";
export const BATCH_PAGES = [744, 745, 746, 747, 748];
export const PIPELINE_VERSION = "local-ocr-quality-gated-batch-0744-0748-v1";
const q = value => `'${String(value ?? "").replaceAll("'", "''")}'`;
const j = value => `${q(JSON.stringify(value))}::jsonb`;
const hash = value => createHash("sha256").update(value).digest("hex");

async function load() {
  const content = JSON.parse(await fs.readFile(path.join(out, "approved_content.json"), "utf8"));
  const pages = await Promise.all(BATCH_PAGES.map(async page => {
    const image = await fs.readFile(path.join(work, "rendered", `page_${String(page).padStart(4, "0")}.jpg`));
    const raw = await fs.readFile(path.join(work, "ocr", `page_${String(page).padStart(4, "0")}.txt`), "utf8");
    return { page, sha256: hash(image), raw };
  }));
  return { content, pages };
}

function sqlForTags() {
  const tags = [
    ["world-history", "World history", "domain", "Historically scoped world-reference material."],
    ["reference-note", "Structured source note", "content_type", "Bounded source reference with caveats."],
    ["source-attributed", "Source-attributed", "quality", "Source-preserved record without direct corroboration in this batch."],
    ["externally-verified", "Externally verified", "quality", "Directly corroborated record."],
    ["historic-scope", "Historic scope", "quality", "Historic political, institutional, or diplomatic reference."]
  ];
  return `INSERT INTO public.content_tags (slug,label,category,description) VALUES ${tags.map(row => `(${row.map(q).join(",")})`).join(",")} ON CONFLICT (slug) DO UPDATE SET label=EXCLUDED.label,category=EXCLUDED.category,description=EXCLUDED.description;`;
}

function sqlForDerived() {
  const range = "BETWEEN 744 AND 748";
  return `INSERT INTO public.flashcards (subject_id,book_id,chapter_id,topic_id,front_text,back_text,source_type,source_id,source_key)
SELECT (SELECT id FROM public.subjects ORDER BY created_at ASC LIMIT 1),f.book_id,f.chapter_id,f.topic_id,f.title,f.fact_text,'fact',f.id,'batch0744-0748:fact:'||f.id::text FROM public.gk_facts f WHERE f.source_page ${range} AND NOT EXISTS (SELECT 1 FROM public.flashcards z WHERE z.source_key='batch0744-0748:fact:'||f.id::text);
INSERT INTO public.flashcards (subject_id,book_id,chapter_id,topic_id,front_text,back_text,source_type,source_id,source_key)
SELECT (SELECT id FROM public.subjects ORDER BY created_at ASC LIMIT 1),n.book_id,n.chapter_id,n.topic_id,n.title,n.content,'note',n.id,'batch0744-0748:note:'||n.id::text FROM public.gk_notes n WHERE n.source_page ${range} AND NOT EXISTS (SELECT 1 FROM public.flashcards z WHERE z.source_key='batch0744-0748:note:'||n.id::text);
INSERT INTO public.flashcards (subject_id,book_id,chapter_id,topic_id,front_text,back_text,source_type,source_id,source_key)
SELECT (SELECT id FROM public.subjects ORDER BY created_at ASC LIMIT 1),m.book_id,m.chapter_id,m.topic_id,m.question,'সঠিক উত্তর: '||o.option_key||'. '||o.option_text,'mcq',m.id,'batch0744-0748:mcq:'||m.id::text FROM public.gk_mcqs m JOIN public.gk_mcq_options o ON o.mcq_id=m.id AND o.is_correct WHERE m.source_page ${range} AND NOT EXISTS (SELECT 1 FROM public.flashcards z WHERE z.source_key='batch0744-0748:mcq:'||m.id::text);
INSERT INTO public.search_documents (entity_type,entity_id,title,body,english_metadata)
SELECT 'fact',f.id,f.title,f.fact_text,'Status-marked GK fact | source page '||f.source_page::text FROM public.gk_facts f WHERE f.source_page ${range} AND NOT EXISTS (SELECT 1 FROM public.search_documents d WHERE d.entity_type='fact' AND d.entity_id=f.id);
INSERT INTO public.search_documents (entity_type,entity_id,title,body,english_metadata)
SELECT 'note',n.id,n.title,n.content,'Structured source note | source page '||n.source_page::text FROM public.gk_notes n WHERE n.source_page ${range} AND NOT EXISTS (SELECT 1 FROM public.search_documents d WHERE d.entity_type='note' AND d.entity_id=n.id);
INSERT INTO public.search_documents (entity_type,entity_id,title,body,english_metadata)
SELECT 'mcq',m.id,NULL,m.question,'Past-exam MCQ | source page '||m.source_page::text||' | question '||m.source_question_number FROM public.gk_mcqs m WHERE m.source_page ${range} AND NOT EXISTS (SELECT 1 FROM public.search_documents d WHERE d.entity_type='mcq' AND d.entity_id=m.id);`;
}

export async function buildBatch() {
  const { content, pages } = await load();
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
    source_anomalies: ["All 35 ordered overlap-safe source tiles were reviewed.", "The rendered source images were upright and local OCR was reconciled with visual evidence.", "Pages 745–748 include visually completed printed answer-key tables; page 747 visibly marks one session-date question as having no correct option.", "Institutional, financial, economic, legal, treaty, security, development, environmental, humanitarian, gender, trade, policy, membership, leadership, location, term, measurement, date, and current-status claims were withheld rather than reconstructed."],
    quality_gates: ["Only source pages 744–748 are included.", "No facts, notes, or MCQs are included because no reviewed source claim clears the conservative quality and safety boundary.", "Only allowed tag categories are inserted.", "Only reviewed source-page provenance and source-page topic boundaries are admitted; all content records remain intentionally empty."]
  };
  const topicSql = content.topics.map(topic => `INSERT INTO public.topics (chapter_id,title,slug,description,source_page,display_order)
SELECT c.id,${q(topic.title)},${q(topic.slug)},'Source-derived content with completed visual review, conservative classification, and recorded verification.',${topic.page},${topic.order}
FROM public.chapters c JOIN public.books b ON b.id=c.book_id WHERE b.title=${q(bookTitle)} AND c.slug='europe'
AND NOT EXISTS (SELECT 1 FROM public.topics t WHERE t.chapter_id=c.id AND t.slug=${q(topic.slug)});`).join("\n");
  const pageSql = pages.map(page => {
    const topic = content.topics.find(item => item.page === page.page).slug;
    const metadata = { physical_source_page: page.page, source_image_sha256: page.sha256, review_status: "completed_image_grounded_review", review_report: `${out}/visual_review_744_748.md`, classification_report: `${out}/classification_decisions.md`, verification_report: `${out}/external_verification.md`, recovery_artifacts: [`page_${String(page.page).padStart(4, "0")}.txt`], orientation_note: "Rendered source image visually verified upright before local OCR." };
    return `INSERT INTO public.source_pages (import_run_id,book_id,source_page,page_kind,raw_transcription,chapter_heading,topic_heading,confidence,extraction_method,model_name,notes,review_metadata)
SELECT (SELECT id FROM public.import_runs WHERE pipeline_version=${q(PIPELINE_VERSION)} ORDER BY started_at DESC LIMIT 1),b.id,${page.page},'educational'::page_kind,${q(page.raw)},'World history',${q(topic)},'medium'::confidence_level,'local_ocr_with_image_grounded_review','tesseract-ben+eng','All ordered source tiles reviewed; upright OCR reconciled with visual evidence; only classified records imported.',${j(metadata)}
FROM public.books b WHERE b.title=${q(bookTitle)} AND NOT EXISTS (SELECT 1 FROM public.source_pages s WHERE s.book_id=b.id AND s.source_page=${page.page});`;
  }).join("\n");
  const sql = `-- Generated by prepare_validated_batch_0744_0748.mjs. Source pages 744–748 only.
BEGIN;
INSERT INTO public.import_runs (source_filename,source_sha256,pipeline_version,status,completed_at,audit) VALUES ('Jubayer''sgk.pdf',${q(hash(pages.map(page => page.sha256).join("|")))},${q(PIPELINE_VERSION)},'completed',now(),${j(audit)});
${topicSql}
${pageSql}
${sqlForTags()}
${sqlForDerived()}
COMMIT;`;
  return { sql, audit, counts: { batch_pages: BATCH_PAGES, review_tiles: 35, eligible_facts: 0, eligible_notes: 0, eligible_mcqs: 0, eligible_mcq_options: 0, withheld_mcqs: 0, derived_records: 0, verification_statuses: audit.verification_counts } };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const { sql, audit, counts } = await buildBatch();
  await fs.mkdir(out, { recursive: true });
  await fs.writeFile(path.join(out, "validated_import.sql"), sql);
  await fs.writeFile(path.join(out, "batch_audit.json"), JSON.stringify(audit, null, 2));
  await fs.writeFile(path.join(out, "execute_sql_request.json"), JSON.stringify({ project_id: "rennotctgrxvbpghbimx", query: sql }));
  await fs.writeFile(path.join(work, "import_input_counts.json"), JSON.stringify(counts, null, 2));
  console.log(JSON.stringify({ out, audit, counts }, null, 2));
}
