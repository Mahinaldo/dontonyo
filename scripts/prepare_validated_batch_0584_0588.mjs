import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const workDir = "/home/ubuntu/dontonyo-work/batch-0584-0588";
const outputDir = path.join(root, "supabase", "batch-0584-0588");
export const BATCH_PAGES = [584, 585, 586, 587, 588];
export const PIPELINE_VERSION = "vision-quality-gated-batch-0584-0588-v1";
const BOOK_TITLE = "Jubayer's GK";
const q = value => `'${String(value ?? "").replaceAll("'", "''")}'`;
const json = value => `${q(JSON.stringify(value))}::jsonb`;
const hash = value => crypto.createHash("sha256").update(value, "utf8").digest("hex");
const values = rows => rows.map(row => `(${row.map(q).join(",")})`).join(",\n");
const files = BATCH_PAGES.map(page => path.join(workDir, "pages", `page_${String(page).padStart(4, "0")}.json`));

const refs = {
  magna: "https://www.parliament.uk/magnacarta/",
  magnaDate: "https://www.nationalarchives.gov.uk/education/resources/magna-carta/british-library-magna-carta-1215-runnymede/",
  petition: "https://www.parliament.uk/about/living-heritage/evolutionofparliament/parliamentaryauthority/civilwar/collections/petition-of-right/",
  bill: "https://www.parliament.uk/about/living-heritage/evolutionofparliament/parliamentaryauthority/revolution/collections1/collections-glorious-revolution/billofrights/",
  tudor: "https://www.nationalarchives.gov.uk/whats-on/events/henry-vii-treason-and-trust/",
  royals: "https://www.royal.uk/the-king",
  primeMinisters: "https://www.gov.uk/government/history/past-prime-ministers",
  pmHistory: "https://history.blog.gov.uk/2012/01/01/the-institution-of-prime-minister/",
  churchill: "https://www.gov.uk/government/history/past-prime-ministers/winston-churchill",
  nobel: "https://www.nobelprize.org/prizes/literature/1953/summary/",
  downing: "https://www.gov.uk/government/history/10-downing-street",
};

const ctx = page => ({
  chapter: "europe",
  chapterTitle: "ইউরোপ",
  topic: page === 584 || page === 585 ? "uk-formation-parliament-constitutional-reference" : page === 586 ? "uk-monarchy-reference-584-586" : "uk-prime-ministers-downing-street-reference",
  topicTitle: page === 584 || page === 585 ? "যুক্তরাজ্য — গঠন, পার্লামেন্ট ও সাংবিধানিক রেফারেন্স" : page === 586 ? "যুক্তরাজ্য — রাজতন্ত্র ও টিউডর রেফারেন্স" : "যুক্তরাজ্য — প্রধানমন্ত্রী ও ডাউনিং স্ট্রিট রেফারেন্স",
});
const fact = (page, title, body, status = "source_attributed", confidence = "medium", sources = [], timeSensitive = false) => ({ source_page: page, title, fact_text: body, status, confidence, sources, timeSensitive, ...ctx(page), canonical_hash: hash(`fact|${page}|${title}|${body}`) });
const note = (page, title, content, status = "source_attributed", confidence = "high", sources = [], timeSensitive = true) => ({ source_page: page, title, content, status, confidence, sources, timeSensitive, ...ctx(page), canonical_hash: hash(`note|${page}|${title}|${content}`) });

const facts = [
  fact(584, "Great Britain ও United Kingdom — উৎসের সংজ্ঞা", "উৎসের সংক্ষিপ্ত table-এ Great Britain-কে England, Scotland ও Wales-এর সমষ্টি এবং United Kingdom-কে সেই তিনটির সঙ্গে Northern Ireland যুক্ত রূপে উপস্থাপন করা হয়েছে।", "source_attributed", "high", [], true),
  fact(584, "British Parliament — দ্বিকক্ষ রূপ", "উৎসে British Parliament-কে দ্বিকক্ষ আইনসভা বলা হয়েছে; এর দুই কক্ষ House of Commons ও House of Lords।", "source_attributed", "high", [], true),
  fact(585, "Magna Carta — ১৫ জুন ১২১৫", "UK Parliament ও The National Archives অনুযায়ী Magna Carta ১৫ জুন ১২১৫ তারিখে King John-এর সঙ্গে যুক্ত ঐতিহাসিক দলিল।", "verified", "high", [refs.magna, refs.magnaDate]),
  fact(585, "Petition of Right — ১৬২৮", "UK Parliament-এর parliamentary collection অনুযায়ী Petition of Right-এর তারিখ ১৬২৮।", "verified", "high", [refs.petition]),
  fact(585, "English Bill of Rights — ১৬৮৯", "UK Parliament-এর collection অনুযায়ী Bill of Rights 1689 English Parliament-এর একটি Act; উৎসে মুদ্রিত ১৬৮৯ chronology corroborated।", "verified", "high", [refs.bill]),
  fact(586, "Henry VII — টিউডর রাজবংশ", "The National Archives Henry Tudor-কে ১৪৮৫-এর Bosworth victory-পরবর্তী প্রথম Tudor monarch এবং Tudor dynasty consolidation-এর সঙ্গে যুক্ত করেছে।", "verified", "high", [refs.tudor]),
  fact(586, "Charles III — accession", "Royal Household biography অনুযায়ী Charles Philip Arthur George তাঁর মা Queen Elizabeth II-এর মৃত্যুর পর ৮ সেপ্টেম্বর ২০২২ King Charles III হন।", "verified", "high", [refs.royals], true),
  fact(587, "Robert Walpole — ১৭২১–১৭৪২", "GOV.UK past-prime-minister record-এ Sir Robert Walpole-এর Whig term ১৭২১–১৭৪২; premiership institution history তাঁকে early modern premiership-এর dominant figure হিসেবে ব্যাখ্যা করে।", "verified", "high", [refs.primeMinisters, refs.pmHistory]),
  fact(587, "Winston Churchill — wartime premiership ও Nobel", "GOV.UK অনুযায়ী Winston Churchill ১৯৪০–৪৫ সালে Prime Minister ছিলেন এবং ১৯৫৩ সালে Literature Nobel পান; NobelPrize.org-এর citation তাঁর historical/biographical description ও oratory-র স্বীকৃতি দেয়।", "verified", "high", [refs.churchill, refs.nobel]),
  fact(587, "Margaret Thatcher — প্রথম নারী প্রধানমন্ত্রী", "GOV.UK past-prime-minister record-এ Baroness Thatcher-এর Conservative term ১৯৭৯–১৯৯০; তিনি United Kingdom-এর প্রথম নারী Prime Minister হিসেবে উৎসে আলোচিত।", "verified", "high", [refs.primeMinisters]),
  fact(588, "Theresa May ও Edward Heath — date-bounded terms", "GOV.UK record অনুযায়ী Theresa May ২০১৬–২০১৯ এবং Edward Heath ১৯৭০–১৯৭৪ Prime Minister ছিলেন; ফলে ১৯৭১ Bangladesh Liberation War সময়ের Heath reference date-bounded।", "verified", "high", [refs.primeMinisters], true),
  fact(588, "10 Downing Street — official residence ও office", "GOV.UK 10 Downing Street-কে British Prime Minister-এর official residence এবং office হিসেবে বর্ণনা করে।", "verified", "high", [refs.downing], true),
];

const notes = [
  note(584, "যুক্তরাজ্য গঠন — উৎসের ১৫৩৬–১৯২২ chronology", "উৎসে ১৫৩৬, ১৭০৭, ১৮০১ ও ১৯২২ সালের একটি Great Britain/United Kingdom formation sequence আছে।\nসতর্কতা | Ireland ও Northern Ireland-এর constitutional wording সংক্ষিপ্ত ও source-bound; এটি বর্তমান sovereignty claim হিসেবে পুনর্লিখন করা হয়নি।"),
  note(584, "British Parliament — quality boundary", "উৎসে Parliament, Westminster Palace, Thames location, রাজা/রানীর অধিবেশন আহ্বান এবং House membership counts আছে।\nসতর্কতা | House of Lords-এর মুদ্রিত count, প্রথম নারী Speaker-এর অস্পষ্ট নাম, এবং ‘oldest parliamentary democracy’ superlative withheld; constitutional maxims current-law statements হিসেবে import করা হয়নি।"),
  note(585, "Magna Carta ও Bill of Rights — source labels", "উৎসে Magna Carta-কে ‘first constitution’, ‘Bible of the British constitution’ ও ‘first constitutional document’ বলা হয়েছে।\nসতর্কতা | consulted official records date ও constitutional significance support করে, কিন্তু এই absolute labels নয়; তাই labels-গুলো কেবল source framing। Petition of Right 1628 এবং Bill of Rights 1689 date corroborated।", "source_attributed", "high", [refs.magna, refs.petition, refs.bill]),
  note(586, "British monarchy — quality boundary", "উৎসে Tudor, Elizabeth I, Mary I, George III, Edward VIII, Elizabeth II ও Charles III সম্পর্কিত reference lines আছে।\nসতর্কতা | unreadable lines, historical nickname/health framing, alleged slave-trade abolition, and visibly corrupted Charles/Diana/Liz Truss wording withheld. Charles III accession only was corroborated."),
  note(587, "UK prime ministers — sequence and attribution boundary", "উৎসে Walpole, Gladstone, Churchill ও Thatcher-এর biography panels আছে।\nসতর্কতা | Gladstone-এর ১৮৬৮–৯৪ continuous range official term list-এর সঙ্গে মেলে না; quote/nickname and single-cause `Iron Lady` wording source-attributed। Churchill Nobel single-book explanation is not imported as an award fact."),
  note(587, "Margaret Thatcher — source portrait note", "উৎসে Thatcher-এর Conservative affiliation, early chemistry work, Falklands-war premiership, `Iron Lady` label এবং death year আছে।\nসতর্কতা | Falklands conflict and nickname causation are source-attributed historical framing, not a simplified causal fact.", "source_attributed", "medium", [refs.primeMinisters]),
  note(588, "Churchill Nobel correction — verification boundary", "উৎসের caution panel নিজেই একটি common single-book Nobel rationale সংশোধন করে six-volume *The Second World War* উল্লেখ করেছে।\nসতর্কতা | NobelPrize.org-এর official 1953 citation কোনও একক বইকে award basis বলে না; তাই panel-টি source-attributed caution হিসেবে রাখা হয়েছে, verified book-causation হিসেবে নয়।", "conflicting_source", "high", [refs.nobel]),
  note(588, "Downing Street — source quality boundary", "উৎসে 9, 10, 11 ও 12 Downing Street-এর office assignment আছে।\nসতর্কতা | 9 নম্বরের text low-confidence; 11/12 office assignments changeable institutional information। GOV.UK history অনুযায়ী 1682–84 construction chronology scan-এর 1680 claim-এর সঙ্গে conflict করে; 10 Downing Street residence/office fact only directly retained।", "source_attributed", "high", [refs.downing]),
];

const topics = [
  ["europe", "যুক্তরাজ্য — গঠন, পার্লামেন্ট ও সাংবিধানিক রেফারেন্স", "uk-formation-parliament-constitutional-reference", 584, 4],
  ["europe", "যুক্তরাজ্য — রাজতন্ত্র ও টিউডর রেফারেন্স", "uk-monarchy-reference-584-586", 586, 5],
  ["europe", "যুক্তরাজ্য — প্রধানমন্ত্রী ও ডাউনিং স্ট্রিট রেফারেন্স", "uk-prime-ministers-downing-street-reference", 587, 6],
];
const tags = [
  ["europe", "Europe", "domain", "Source-derived Europe reference."],
  ["united-kingdom", "United Kingdom", "domain", "United Kingdom source material."],
  ["reference-note", "Structured source note", "content_type", "Structured source reference with explicit caveats."],
  ["source-attributed", "Source-attributed", "quality", "Source-preserved material without direct corroboration in this batch."],
  ["externally-verified", "Externally verified", "quality", "Directly corroborated by cited evidence."],
  ["conflicting-source", "Conflicting source", "quality", "Material source conflict retained only with an explicit caveat."],
  ["time-sensitive", "Time-sensitive reference", "quality", "Political, institutional, constitutional, officeholder, military, or dated source material."],
];
const entityRef = (kind, canonicalHash) => `(SELECT id FROM public.${kind === "fact" ? "gk_facts" : "gk_notes"} WHERE canonical_hash=${q(canonicalHash)} LIMIT 1)`;
const quality = row => row.status === "verified" ? "externally-verified" : row.status === "conflicting_source" ? "conflicting-source" : "source-attributed";

export async function buildBatch() {
  const pages = await Promise.all(files.map(file => fs.readFile(file, "utf8").then(JSON.parse)));
  const checks = [...facts.map(row => ({ kind: "fact", claim: row.fact_text, ...row })), ...notes.map(row => ({ kind: "note", claim: row.content, ...row }))];
  const audit = {
    batch_pages: BATCH_PAGES,
    pipeline_version: PIPELINE_VERSION,
    source_pages: pages.map(page => ({ page: page.source_page, review_status: "completed_image_grounded_review", image_sha256: page.source_image_sha256, overall_confidence: page.review.overall_confidence })),
    generated_facts: facts.length,
    generated_notes: notes.length,
    generated_mcqs: 0,
    generated_options: 0,
    generated_flashcards: facts.length + notes.length,
    verification_counts: { verified: checks.filter(row => row.status === "verified").length, conflicting: checks.filter(row => row.status === "conflicting_source").length, source_attributed: checks.filter(row => row.status === "source_attributed").length },
    source_anomalies: [
      "All five pages were rendered at 300 DPI, transcribed with gpt-5-mini, and reviewed through all 35 ordered overlap-safe tiles.",
      "No source-complete MCQ block appears in pages 584–588; no MCQ or option record is generated.",
      "Unreadable, corrupt, time-sensitive, institutional, superlative, and historically conflicting claims are withheld or explicitly source-attributed.",
      "The scan’s Magna Carta absolute labels, Gladstone continuous-date claim, Churchill single-book Nobel rationale, Downing Street 1680 claim, and corrupted page-586 officeholder/death text are not imported as unqualified facts.",
    ],
    quality_gates: [
      "Exactly physical source pages 584–588 are imported.",
      "Every imported fact/note is visually reviewed and records an explicit verification status.",
      "No unsupported MCQ is manufactured from non-MCQ reference pages.",
      "Content tags use only approved categories; country and regional tags use category domain.",
      "Upserts use canonical hashes and stable derived-record keys.",
    ],
  };
  const topicSql = `INSERT INTO public.topics (chapter_id,title,slug,description,source_page,display_order) SELECT c.id,x.title,x.slug,'Source-preserved content with explicit review and verification status.',x.page::integer,x.ord::integer FROM (VALUES ${values(topics)}) x(chapter_slug,title,slug,page,ord) JOIN public.chapters c ON c.slug=x.chapter_slug AND c.book_id=(SELECT id FROM public.books WHERE title=${q(BOOK_TITLE)} LIMIT 1) WHERE NOT EXISTS (SELECT 1 FROM public.topics t WHERE t.chapter_id=c.id AND t.slug=x.slug);`;
  const printed = { 584: 527, 585: 528, 586: 529, 587: 530, 588: 531 };
  const pageSql = pages.map(page => {
    const c = ctx(page.source_page);
    const metadata = { source_image_sha256: page.source_image_sha256, extraction_model: page.model, review_status: "completed_image_grounded_review", corrections: page.review.corrections, unresolved_spans: page.review.unresolved_spans, physical_source_page: page.source_page, printed_book_page: printed[page.source_page], visual_review_report: `${workDir}/visual_review_584_588.md`, external_verification_report: `${workDir}/external_verification.md`, classification_report: `${workDir}/classification_decisions.md` };
    return `INSERT INTO public.source_pages (import_run_id,book_id,source_page,page_kind,raw_transcription,chapter_heading,topic_heading,confidence,extraction_method,model_name,notes,review_metadata) SELECT (SELECT id FROM public.import_runs WHERE pipeline_version=${q(PIPELINE_VERSION)} ORDER BY started_at DESC LIMIT 1),b.id,${page.source_page},'educational'::page_kind,${q(page.review.verified_transcript)},${q(c.chapterTitle)},${q(c.topicTitle)},${q(page.review.overall_confidence)}::confidence_level,'vision_ocr_with_image_grounded_review',${q(page.model)},'Quality-gated extraction with ordered source-tile review, withholding rules, source attribution, and explicit verification status.',${json(metadata)} FROM public.books b WHERE b.title=${q(BOOK_TITLE)} AND NOT EXISTS (SELECT 1 FROM public.source_pages s WHERE s.book_id=b.id AND s.source_page=${page.source_page});`;
  }).join("\n");
  const factSql = `WITH d(page,chapter_slug,topic_slug,title,body,status,confidence,hash) AS (VALUES ${values(facts.map(row => [row.source_page, row.chapter, row.topic, row.title, row.fact_text, row.status, row.confidence, row.canonical_hash]))}) INSERT INTO public.gk_facts (book_id,chapter_id,topic_id,title,fact_text,explanation,source_page,source_section,source_excerpt,importance,confidence,canonical_hash) SELECT b.id,c.id,t.id,d.title,d.body,CASE d.status WHEN 'verified' THEN 'Direct corroboration is recorded in the batch verification ledger.' ELSE 'Source-attributed material retained after ordered image review; it is not silently updated as a current assertion.' END,d.page::integer,d.title,d.body,3,d.confidence::confidence_level,d.hash FROM d JOIN public.books b ON b.title=${q(BOOK_TITLE)} JOIN public.chapters c ON c.book_id=b.id AND c.slug=d.chapter_slug JOIN public.topics t ON t.chapter_id=c.id AND t.slug=d.topic_slug ON CONFLICT (canonical_hash) DO UPDATE SET fact_text=EXCLUDED.fact_text,explanation=EXCLUDED.explanation,confidence=EXCLUDED.confidence;`;
  const noteSql = `WITH d(page,chapter_slug,topic_slug,title,body,confidence,hash) AS (VALUES ${values(notes.map(row => [row.source_page, row.chapter, row.topic, row.title, row.content, row.confidence, row.canonical_hash]))}) INSERT INTO public.gk_notes (book_id,chapter_id,topic_id,title,content,source_page,source_section,display_order,confidence,canonical_hash) SELECT b.id,c.id,t.id,d.title,d.body,d.page::integer,d.title,d.page::integer,d.confidence::confidence_level,d.hash FROM d JOIN public.books b ON b.title=${q(BOOK_TITLE)} JOIN public.chapters c ON c.book_id=b.id AND c.slug=d.chapter_slug JOIN public.topics t ON t.chapter_id=c.id AND t.slug=d.topic_slug ON CONFLICT (canonical_hash) DO UPDATE SET content=EXCLUDED.content,confidence=EXCLUDED.confidence;`;
  const assignment = (kind, row, tagSlugs) => tagSlugs.map(tag => `INSERT INTO public.content_tag_assignments (tag_id,entity_type,entity_id,source_page,confidence,assigned_by) SELECT t.id,${q(kind)},${entityRef(kind, row.canonical_hash)},${row.source_page},${q(row.confidence)}::confidence_level,'batch-0584-0588-quality-pipeline' FROM public.content_tags t WHERE t.slug=${q(tag)} ON CONFLICT DO NOTHING;`).join("\n");
  const tagSql = `INSERT INTO public.content_tags (slug,label,category,description) VALUES ${tags.map(row => `(${row.map(q).join(",")})`).join(",")} ON CONFLICT (slug) DO UPDATE SET label=EXCLUDED.label,category=EXCLUDED.category,description=EXCLUDED.description;
${facts.map(row => assignment("fact", row, ["europe", "united-kingdom", quality(row), ...(row.timeSensitive ? ["time-sensitive"] : [])])).join("\n")}
${notes.map(row => assignment("note", row, ["europe", "united-kingdom", "reference-note", quality(row), ...(row.timeSensitive ? ["time-sensitive"] : [])])).join("\n")}`;
  const verificationSql = checks.map(row => `INSERT INTO public.fact_verifications (source_page,entity_type,entity_id,claim_text,normalized_claim,verification_status,confidence,verification_sources,audit_note) SELECT ${row.source_page},${q(row.kind)},${entityRef(row.kind, row.canonical_hash)},${q(row.claim)},NULL,${q(row.status === "conflicting_source" ? "conflicting" : row.status)},${q(row.confidence)}::confidence_level,${json(row.sources)},${q(row.status === "verified" ? "Direct corroboration is listed in the batch verification ledger." : row.status === "conflicting_source" ? "Conflict is explicitly documented in the batch verification ledger; record is a caveated source note." : "Source-attributed record retained with ordered image-grounded validation and explicit source linkage.")} WHERE NOT EXISTS (SELECT 1 FROM public.fact_verifications v WHERE v.entity_type=${q(row.kind)} AND v.entity_id=${entityRef(row.kind, row.canonical_hash)} AND v.claim_text=${q(row.claim)});`).join("\n");
  const derivedSql = `INSERT INTO public.flashcards (subject_id,book_id,chapter_id,topic_id,front_text,back_text,source_type,source_id,source_key) SELECT (SELECT id FROM public.subjects ORDER BY created_at ASC LIMIT 1),f.book_id,f.chapter_id,f.topic_id,f.title,f.fact_text,'fact',f.id,'batch0584-0588:fact:'||f.id::text FROM public.gk_facts f WHERE f.source_page BETWEEN 584 AND 588 AND NOT EXISTS (SELECT 1 FROM public.flashcards c WHERE c.source_key='batch0584-0588:fact:'||f.id::text); INSERT INTO public.flashcards (subject_id,book_id,chapter_id,topic_id,front_text,back_text,source_type,source_id,source_key) SELECT (SELECT id FROM public.subjects ORDER BY created_at ASC LIMIT 1),n.book_id,n.chapter_id,n.topic_id,n.title,n.content,'note',n.id,'batch0584-0588:note:'||n.id::text FROM public.gk_notes n WHERE n.source_page BETWEEN 584 AND 588 AND NOT EXISTS (SELECT 1 FROM public.flashcards c WHERE c.source_key='batch0584-0588:note:'||n.id::text); INSERT INTO public.search_documents (entity_type,entity_id,title,body,english_metadata) SELECT 'fact',f.id,f.title,f.fact_text,'Status-marked GK fact | source page '||f.source_page::text FROM public.gk_facts f WHERE f.source_page BETWEEN 584 AND 588 AND NOT EXISTS (SELECT 1 FROM public.search_documents d WHERE d.entity_type='fact' AND d.entity_id=f.id); INSERT INTO public.search_documents (entity_type,entity_id,title,body,english_metadata) SELECT 'note',n.id,n.title,n.content,'Structured source reference | source page '||n.source_page::text FROM public.gk_notes n WHERE n.source_page BETWEEN 584 AND 588 AND NOT EXISTS (SELECT 1 FROM public.search_documents d WHERE d.entity_type='note' AND d.entity_id=n.id);`;
  const sql = `-- Generated by prepare_validated_batch_0584_0588.mjs. Source pages 584–588 only.\nBEGIN;\nINSERT INTO public.import_runs (source_filename,source_sha256,pipeline_version,status,completed_at,audit) VALUES ('Jubayer''sgk.pdf',${q(hash(pages.map(page => page.source_image_sha256).join("|")))},${q(PIPELINE_VERSION)},'completed',now(),${json(audit)});\n${topicSql}\n${pageSql}\n${factSql}\n${noteSql}\n${tagSql}\n${verificationSql}\n${derivedSql}\nCOMMIT;`;
  return { sql, audit };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const { sql, audit } = await buildBatch();
  const counts = { batch_pages: BATCH_PAGES, review_tiles: 35, eligible_mcqs: 0, eligible_mcq_options: 0, withheld_mcqs: 0, fact_candidates: facts.length, note_candidates: notes.length, verification_statuses: audit.verification_counts };
  await fs.mkdir(outputDir, { recursive: true });
  await fs.writeFile(path.join(outputDir, "validated_import.sql"), sql);
  await fs.writeFile(path.join(outputDir, "batch_audit.json"), JSON.stringify(audit, null, 2));
  await fs.writeFile(path.join(outputDir, "execute_sql_request.json"), JSON.stringify({ project_id: "rennotctgrxvbpghbimx", query: sql }));
  await fs.writeFile(path.join(workDir, "import_input_counts.json"), JSON.stringify(counts, null, 2));
  console.log(JSON.stringify({ outputDir, ...audit, counts }, null, 2));
}
