import fs from "node:fs/promises";

const outDir = process.argv[2] ?? "data/gk-extracted";
const readJsonl = async name => {
  const content = await fs
    .readFile(`${outDir}/${name}`, "utf8")
    .catch(() => "");
  return content
    .split("\n")
    .filter(Boolean)
    .map(line => JSON.parse(line));
};
const pages = await readJsonl("pages.jsonl");
const content = await readJsonl("content.jsonl");
const mcqs = await readJsonl("mcqs.jsonl");
const duplicateKeys = rows =>
  rows.length - new Set(rows.map(row => row.idempotency_key)).size;
const report = {
  pages: {
    processed: pages.filter(row => row.status === "processed").length,
    skipped: pages.filter(row => row.status === "empty").length,
    failures: pages.filter(row => row.status === "failed").length,
    ocr: pages.filter(row => row.extraction_method === "ocr").length,
  },
  records: {
    content: content.length,
    facts: content.filter(row => row.content_type === "fact").length,
    notes: content.filter(row => row.content_type === "note").length,
    mcqs: mcqs.length,
    lowConfidence: [...content, ...mcqs].filter(row => row.confidence === "low")
      .length,
    duplicateContentKeys: duplicateKeys(content),
    duplicateMcqKeys: duplicateKeys(mcqs),
  },
  integrity: {
    emptyContent: content.filter(row => !row.source_text?.trim()).length,
    emptyQuestions: mcqs.filter(row => !row.question?.trim()).length,
    missingOptions: mcqs.filter(
      row => !row.options || Object.keys(row.options).length < 2
    ).length,
    missingAnswers: mcqs.filter(row => !row.correct_option).length,
    missingQuestionNumbers: mcqs.filter(row => !row.source_question_number).length,
    missingExamMetadata: mcqs.filter(row => !row.metadata_validation?.has_exam_metadata && !row.source_text).length,
    missingExplanations: mcqs.filter(row => !row.metadata_validation?.has_explanation).length,
    pagesWithErrors: pages
      .filter(row => row.status === "failed")
      .map(row => row.page),
  },
};
report.ok =
  report.integrity.emptyContent === 0 &&
  report.integrity.emptyQuestions === 0 &&
  report.integrity.missingOptions === 0 &&
  report.records.duplicateContentKeys === 0 &&
  report.records.duplicateMcqKeys === 0;
await fs.writeFile(
  `${outDir}/validation.json`,
  JSON.stringify(report, null, 2),
  "utf8"
);
console.log(JSON.stringify(report, null, 2));
if (!report.ok) process.exitCode = 2;
