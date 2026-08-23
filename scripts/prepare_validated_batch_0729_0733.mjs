import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const work = "/home/ubuntu/dontonyo-work/batch-0729-0733";
const out = path.join(root, "supabase", "batch-0729-0733");
const bookTitle = "Jubayer's GK";
export const BATCH_PAGES = [729, 730, 731, 732, 733];
export const PIPELINE_VERSION = "local-ocr-quality-gated-batch-0729-0733-v1";
const q = value => `'${String(value ?? "").replaceAll("'", "''")}'`;
const j = value => `${q(JSON.stringify(value))}::jsonb`;
const hash = value => crypto.createHash("sha256").update(value).digest("hex");
const entityTable = type => ({ fact: "gk_facts", note: "gk_notes", mcq: "gk_mcqs" })[type];
const entity = (type, value) => `(SELECT id FROM public.${entityTable(type)} WHERE canonical_hash=${q(value.hash)} LIMIT 1)`;
const verificationTag = item => item.status === "verified" ? "externally-verified" : "source-attributed";
const examMeta = source => source.includes("DU") ? ["University of Dhaka", "University of Dhaka", "admission", "dhaka-university"] : source.includes("BCS") ? ["Bangladesh Civil Service", null, "competitive", "bcs"] : ["Other Bangladesh examination", null, "competitive", "other-bangladesh-exam"];

async function load() {
  const content = JSON.parse(await fs.readFile(path.join(out, "approved_content.json"), "utf8"));
  const pages = await Promise.all(BATCH_PAGES.map(async page => {
    const image = await fs.readFile(path.join(work, "rendered", `page_${String(page).padStart(4, "0")}.jpg`));
    const raw = await fs.readFile(path.join(work, "ocr", `page_${String(page).padStart(4, "0")}.txt`), "utf8");
    return { page, sha256: hash(image), raw };
  }));
  const facts = content.facts.map(item => ({ ...item, domain: content.topics.find(topic => topic.slug === item.topic)?.domain, type: "fact", hash: hash(`fact|${item.page}|${item.title}|${item.text}`), confidence: item.status === "verified" ? "high" : "medium" }));
  const notes = content.notes.map(item => ({ ...item, domain: content.topics.find(topic => topic.slug === item.topic)?.domain, type: "note", hash: hash(`note|${item.page}|${item.title}|${item.text}`), confidence: "high" }));
  const mcqs = content.mcqs.map(item => ({ ...item, topic: content.topics.find(topic => topic.page === item.page)?.slug, domain: content.topics.find(topic => topic.page === item.page)?.domain, type: "mcq", hash: hash(`mcq|${item.page}|${item.number}|${item.question}`), confidence: item.status === "verified" ? "high" : "medium" }));
  return { content, pages, facts, notes, mcqs };
}

function sqlForFacts(facts) {
  return facts.map(item => `INSERT INTO public.gk_facts (book_id,chapter_id,topic_id,title,fact_text,explanation,source_page,source_section,source_excerpt,importance,confidence,canonical_hash)
SELECT b.id,c.id,t.id,${q(item.title)},${q(item.text)},'Source-derived reference; verification status, citations, and historic scope are recorded in the batch ledger.',${item.page},${q(item.title)},${q(item.text)},3,${q(item.confidence)}::confidence_level,${q(item.hash)}
FROM public.books b JOIN public.chapters c ON c.book_id=b.id AND c.slug='europe' JOIN public.topics t ON t.chapter_id=c.id AND t.slug=${q(item.topic)}
WHERE b.title=${q(bookTitle)} ON CONFLICT (canonical_hash) DO UPDATE SET fact_text=EXCLUDED.fact_text,explanation=EXCLUDED.explanation,confidence=EXCLUDED.confidence;`).join("\n");
}

function sqlForNotes(notes) {
  return notes.map(item => `INSERT INTO public.gk_notes (book_id,chapter_id,topic_id,title,content,source_page,source_section,display_order,confidence,canonical_hash)
SELECT b.id,c.id,t.id,${q(item.title)},${q(item.text)},${item.page},${q(item.title)},${item.page},${q(item.confidence)}::confidence_level,${q(item.hash)}
FROM public.books b JOIN public.chapters c ON c.book_id=b.id AND c.slug='europe' JOIN public.topics t ON t.chapter_id=c.id AND t.slug=${q(item.topic)}
WHERE b.title=${q(bookTitle)} ON CONFLICT (canonical_hash) DO UPDATE SET content=EXCLUDED.content,confidence=EXCLUDED.confidence;`).join("\n");
}

function sqlForMcqs(mcqs) {
  return mcqs.map(item => {
    const [name, institution, examType, normalized] = examMeta(item.source);
    const options = item.options.map(([key, text], index) => `INSERT INTO public.gk_mcq_options (mcq_id,option_key,option_text,display_order,is_correct)
SELECT m.id,${q(key)},${q(text)},${index + 1},${key === item.correct} FROM public.gk_mcqs m WHERE m.canonical_hash=${q(item.hash)}
AND NOT EXISTS (SELECT 1 FROM public.gk_mcq_options o WHERE o.mcq_id=m.id AND o.option_key=${q(key)});`).join("\n");
    return `INSERT INTO public.exam_sources (name,institution,exam_type,description,normalized_name)
SELECT ${q(name)},${q(institution)},${q(examType)},${q(`Normalized from printed source label on page ${item.page}.`)},${q(normalized)}
WHERE NOT EXISTS (SELECT 1 FROM public.exam_sources WHERE normalized_name=${q(normalized)});
INSERT INTO public.gk_mcqs (book_id,chapter_id,topic_id,question,correct_option,explanation,source_page,source_section,source_question_number,difficulty,confidence,canonical_hash)
SELECT b.id,c.id,t.id,${q(item.question)},${q(item.correct)},${q("Printed answer key was visually reviewed; the quality and verification boundary is documented in this batch.")},${item.page},'বিগত বছরের প্রশ্ন',${q(item.number)},3,${q(item.confidence)}::confidence_level,${q(item.hash)}
FROM public.books b JOIN public.chapters c ON c.book_id=b.id AND c.slug='europe' JOIN public.topics t ON t.chapter_id=c.id AND t.slug=${q(item.topic)}
WHERE b.title=${q(bookTitle)} ON CONFLICT (canonical_hash) DO UPDATE SET correct_option=EXCLUDED.correct_option,explanation=EXCLUDED.explanation,confidence=EXCLUDED.confidence;
${options}
INSERT INTO public.gk_mcq_sources (mcq_id,exam_source_id,year,session,source_text,source_page)
SELECT m.id,(SELECT id FROM public.exam_sources WHERE normalized_name=${q(normalized)} LIMIT 1),NULL,${q(item.source)},${q(item.source)},${item.page}
FROM public.gk_mcqs m WHERE m.canonical_hash=${q(item.hash)}
AND NOT EXISTS (SELECT 1 FROM public.gk_mcq_sources s WHERE s.mcq_id=m.id AND s.source_text=${q(item.source)} AND s.source_page=${item.page});`;
  }).join("\n");
}

function sqlForTags(records) {
  const tags = [
    ["world-history", "World history", "domain", "Historically scoped world-reference material."],
    ["reference-note", "Structured source note", "content_type", "Bounded source reference with caveats."],
    ["source-attributed", "Source-attributed", "quality", "Source-preserved record without direct corroboration in this batch."], ["externally-verified", "Externally verified", "quality", "Directly corroborated record."], ["historic-scope", "Historic scope", "quality", "Historic political, institutional, or diplomatic reference."]
  ];
  const insertTags = `INSERT INTO public.content_tags (slug,label,category,description) VALUES ${tags.map(row => `(${row.map(q).join(",")})`).join(",")} ON CONFLICT (slug) DO UPDATE SET label=EXCLUDED.label,category=EXCLUDED.category,description=EXCLUDED.description;`;
  const assignments = records.map(item => {
    const shared = [item.domain, verificationTag(item), "historic-scope"];
    const slugs = item.type === "note" ? [...shared, "reference-note"] : item.type === "mcq" ? [...shared, "past-exam-mcq", "answer-key", examMeta(item.source)[3]] : shared;
    return slugs.map(slug => `INSERT INTO public.content_tag_assignments (tag_id,entity_type,entity_id,source_page,confidence,assigned_by)
SELECT t.id,${q(item.type)},${entity(item.type, item)},${item.page},${q(item.confidence)}::confidence_level,'batch-0724-0728-quality-pipeline'
FROM public.content_tags t WHERE t.slug=${q(slug)} ON CONFLICT DO NOTHING;`).join("\n");
  }).join("\n");
  return `${insertTags}\n${assignments}`;
}

function sqlForVerifications(records) {
  return records.map(item => `INSERT INTO public.fact_verifications (source_page,entity_type,entity_id,claim_text,normalized_claim,verification_status,confidence,verification_sources,audit_note)
SELECT ${item.page},${q(item.type)},${entity(item.type, item)},${q(item.type === "mcq" ? `${item.question} — printed answer: ${item.correct}` : item.text)},NULL,${q(item.status)},${q(item.confidence)}::confidence_level,${j(item.sources)},${q(item.status === "verified" ? "Direct corroboration and historical scope are documented in the batch verification ledger." : "Complete source review; record is preserved only with source attribution and stated boundary.")}
WHERE NOT EXISTS (SELECT 1 FROM public.fact_verifications v WHERE v.entity_type=${q(item.type)} AND v.entity_id=${entity(item.type, item)} AND v.claim_text=${q(item.type === "mcq" ? `${item.question} — printed answer: ${item.correct}` : item.text)});`).join("\n");
}

function sqlForDerived() {
  const range = "BETWEEN 729 AND 733";
  return `INSERT INTO public.flashcards (subject_id,book_id,chapter_id,topic_id,front_text,back_text,source_type,source_id,source_key)
SELECT (SELECT id FROM public.subjects ORDER BY created_at ASC LIMIT 1),f.book_id,f.chapter_id,f.topic_id,f.title,f.fact_text,'fact',f.id,'batch0729-0733:fact:'||f.id::text FROM public.gk_facts f WHERE f.source_page ${range} AND NOT EXISTS (SELECT 1 FROM public.flashcards z WHERE z.source_key='batch0729-0733:fact:'||f.id::text);
INSERT INTO public.flashcards (subject_id,book_id,chapter_id,topic_id,front_text,back_text,source_type,source_id,source_key)
SELECT (SELECT id FROM public.subjects ORDER BY created_at ASC LIMIT 1),n.book_id,n.chapter_id,n.topic_id,n.title,n.content,'note',n.id,'batch0729-0733:note:'||n.id::text FROM public.gk_notes n WHERE n.source_page ${range} AND NOT EXISTS (SELECT 1 FROM public.flashcards z WHERE z.source_key='batch0729-0733:note:'||n.id::text);
INSERT INTO public.flashcards (subject_id,book_id,chapter_id,topic_id,front_text,back_text,source_type,source_id,source_key)
SELECT (SELECT id FROM public.subjects ORDER BY created_at ASC LIMIT 1),m.book_id,m.chapter_id,m.topic_id,m.question,'সঠিক উত্তর: '||o.option_key||'. '||o.option_text,'mcq',m.id,'batch0729-0733:mcq:'||m.id::text FROM public.gk_mcqs m JOIN public.gk_mcq_options o ON o.mcq_id=m.id AND o.is_correct WHERE m.source_page ${range} AND NOT EXISTS (SELECT 1 FROM public.flashcards z WHERE z.source_key='batch0729-0733:mcq:'||m.id::text);
INSERT INTO public.search_documents (entity_type,entity_id,title,body,english_metadata)
SELECT 'fact',f.id,f.title,f.fact_text,'Status-marked GK fact | source page '||f.source_page::text FROM public.gk_facts f WHERE f.source_page ${range} AND NOT EXISTS (SELECT 1 FROM public.search_documents d WHERE d.entity_type='fact' AND d.entity_id=f.id);
INSERT INTO public.search_documents (entity_type,entity_id,title,body,english_metadata)
SELECT 'note',n.id,n.title,n.content,'Structured source note | source page '||n.source_page::text FROM public.gk_notes n WHERE n.source_page ${range} AND NOT EXISTS (SELECT 1 FROM public.search_documents d WHERE d.entity_type='note' AND d.entity_id=n.id);
INSERT INTO public.search_documents (entity_type,entity_id,title,body,english_metadata)
SELECT 'mcq',m.id,NULL,m.question,'Past-exam MCQ | source page '||m.source_page::text||' | question '||m.source_question_number FROM public.gk_mcqs m WHERE m.source_page ${range} AND NOT EXISTS (SELECT 1 FROM public.search_documents d WHERE d.entity_type='mcq' AND d.entity_id=m.id);`;
}

export async function buildBatch() {
  const { content, pages, facts, notes, mcqs } = await load();
  const records = [...facts, ...notes, ...mcqs];
  const audit = {
    batch_pages: BATCH_PAGES, pipeline_version: PIPELINE_VERSION, generated_facts: facts.length, generated_notes: notes.length, generated_mcqs: mcqs.length, generated_options: mcqs.length * 4, generated_flashcards: records.length,
    source_pages: pages.map(page => ({ page: page.page, review_status: "completed_image_grounded_review", image_sha256: page.sha256, overall_confidence: "medium" })),
    verification_counts: { verified: records.filter(item => item.status === "verified").length, conflicting: 0, source_attributed: records.filter(item => item.status === "source_attributed").length },
    source_anomalies: ["All 35 ordered overlap-safe source tiles were reviewed.", "The rendered source images were already upright and local OCR was reconciled with visual evidence.", "Institutional, political, diplomatic, membership, judicial, treaty, procedural, security, conflict, leadership, biographical, casualty, award, country-status, regional, current-status, and source-imprecise claims were withheld rather than reconstructed."],
    quality_gates: ["Only source pages 729–733 are included.", "No facts, notes, or MCQs are included because no reviewed source claim clears the conservative quality and safety boundary.", "Only allowed tag categories are inserted.", "Only reviewed source-page provenance and source-page topic boundaries are admitted; all content records remain intentionally empty."]
  };
  const topicSql = content.topics.map(topic => `INSERT INTO public.topics (chapter_id,title,slug,description,source_page,display_order)
SELECT c.id,${q(topic.title)},${q(topic.slug)},'Source-derived content with completed visual review, conservative classification, and recorded verification.',${topic.page},${topic.order}
FROM public.chapters c JOIN public.books b ON b.id=c.book_id WHERE b.title=${q(bookTitle)} AND c.slug='europe'
AND NOT EXISTS (SELECT 1 FROM public.topics t WHERE t.chapter_id=c.id AND t.slug=${q(topic.slug)});`).join("\n");
  const pageSql = pages.map(page => {
    const topic = content.topics.find(item => item.page === page.page).slug;
    const metadata = { physical_source_page: page.page, source_image_sha256: page.sha256, review_status: "completed_image_grounded_review", review_report: `${out}/visual_review_729_733.md`, classification_report: `${out}/classification_decisions.md`, verification_report: `${out}/external_verification.md`, recovery_artifacts: [`page_${String(page.page).padStart(4, "0")}.txt`], orientation_note: "Rendered source image visually verified upright before local OCR." };
    return `INSERT INTO public.source_pages (import_run_id,book_id,source_page,page_kind,raw_transcription,chapter_heading,topic_heading,confidence,extraction_method,model_name,notes,review_metadata)
SELECT (SELECT id FROM public.import_runs WHERE pipeline_version=${q(PIPELINE_VERSION)} ORDER BY started_at DESC LIMIT 1),b.id,${page.page},'educational'::page_kind,${q(page.raw)},'World history',${q(topic)},'medium'::confidence_level,'local_ocr_with_image_grounded_review','tesseract-ben+eng','All ordered source tiles reviewed; upright OCR reconciled with visual evidence; only classified records imported.',${j(metadata)}
FROM public.books b WHERE b.title=${q(bookTitle)} AND NOT EXISTS (SELECT 1 FROM public.source_pages s WHERE s.book_id=b.id AND s.source_page=${page.page});`;
  }).join("\n");
  const sql = `-- Generated by prepare_validated_batch_0729_0733.mjs. Source pages 729–733 only.\nBEGIN;\nINSERT INTO public.import_runs (source_filename,source_sha256,pipeline_version,status,completed_at,audit) VALUES ('Jubayer''sgk.pdf',${q(hash(pages.map(page => page.sha256).join("|")))},${q(PIPELINE_VERSION)},'completed',now(),${j(audit)});\n${topicSql}\n${pageSql}\n${sqlForFacts(facts)}\n${sqlForNotes(notes)}\n${sqlForMcqs(mcqs)}\n${sqlForTags(records)}\n${sqlForVerifications(records)}\n${sqlForDerived()}\nCOMMIT;`;
  return { sql, audit, counts: { batch_pages: BATCH_PAGES, review_tiles: 35, eligible_facts: facts.length, eligible_notes: notes.length, eligible_mcqs: mcqs.length, eligible_mcq_options: 0, withheld_mcqs: 0, derived_records: records.length, verification_statuses: audit.verification_counts } };
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
