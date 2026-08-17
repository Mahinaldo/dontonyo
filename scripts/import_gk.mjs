import fs from "node:fs/promises";
import crypto from "node:crypto";
import mysql from "mysql2/promise";

const outDir = process.argv[2] ?? "data/gk-extracted";
const batchSize = Number(process.env.IMPORT_BATCH_SIZE ?? 100);
const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) throw new Error("DATABASE_URL is required for import");

const readJsonl = async name => {
  const content = await fs
    .readFile(`${outDir}/${name}`, "utf8")
    .catch(() => "");
  return content
    .split("\n")
    .filter(Boolean)
    .map(line => JSON.parse(line));
};
const slugify = value =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 150) || "unclassified";
const chapterNumberFromHint = hint => {
  if (!hint) return null;
  const match = hint.match(
    /(?:chapter|অধ্যায়|অধ্যায়)\s*[()\-:০-৯0-9]*([০-৯0-9]{1,3})/i
  );
  if (!match) return null;
  return Number(
    match[1].replace(/[০-৯]/g, digit => "০১২৩৪৫৬৭৮৯".indexOf(digit))
  );
};
const hash = value => crypto.createHash("sha256").update(value).digest("hex");
const chunks = (rows, size) =>
  Array.from({ length: Math.ceil(rows.length / size) }, (_, index) =>
    rows.slice(index * size, index * size + size)
  );

const pages = await readJsonl("pages.jsonl");
const content = await readJsonl("content.jsonl");
const mcqs = await readJsonl("mcqs.jsonl");
const audit = {
  outDir,
  pagesRead: pages.length,
  contentRead: content.length,
  mcqsRead: mcqs.length,
  factsImported: 0,
  notesImported: 0,
  mcqsImported: 0,
  optionsImported: 0,
  rejected: 0,
  batches: 0,
  uncertainChapterRecords: 0,
};
const pool = await mysql.createPool({
  uri: databaseUrl,
  connectionLimit: 4,
  multipleStatements: false,
});
const connection = await pool.getConnection();
try {
  await connection.beginTransaction();
  await connection.execute(
    "INSERT INTO subjects (name, slug, description, displayOrder, isActive) VALUES (?, ?, ?, 1, true) ON DUPLICATE KEY UPDATE name=VALUES(name)",
    [
      "General Knowledge",
      "gk",
      "Structured Bangla GK for university admission preparation",
    ]
  );
  const [subjectRows] = await connection.execute(
    "SELECT id FROM subjects WHERE slug = ? LIMIT 1",
    ["gk"]
  );
  const subjectId = subjectRows[0].id;
  await connection.execute(
    "INSERT INTO books (subjectId, title, slug, description, sourceType, displayOrder, isActive) VALUES (?, ?, ?, ?, ?, 1, true) ON DUPLICATE KEY UPDATE title=VALUES(title)",
    [
      subjectId,
      "Jubayer’s GK",
      "jubayers-gk",
      "Source book imported as structured educational content.",
      "scanned-pdf",
    ]
  );
  const [bookRows] = await connection.execute(
    "SELECT id FROM books WHERE slug = ? LIMIT 1",
    ["jubayers-gk"]
  );
  const bookId = bookRows[0].id;
  const chapterIds = new Map();
  await connection.execute(
    "INSERT INTO chapters (bookId, chapterNumber, title, slug, description, displayOrder) VALUES (?, 999, ?, ?, ?, 999) ON DUPLICATE KEY UPDATE description=VALUES(description)",
    [bookId, "Unclassified source pages", "unclassified-source-pages", "System-labelled holding chapter for records whose scanned chapter banner is uncertain."]
  );
  const [fallbackRows] = await connection.execute(
    "SELECT id FROM chapters WHERE bookId = ? AND chapterNumber = 999 LIMIT 1",
    [bookId]
  );
  chapterIds.set(0, fallbackRows[0].id);
  const topicIds = new Map();
  const chapterHints = new Map();
  for (const row of [...content, ...mcqs]) {
    const number = chapterNumberFromHint(row.chapter_hint);
    if (number && !chapterHints.has(number))
      chapterHints.set(number, row.chapter_hint);
  }
  for (const [number, hint] of chapterHints) {
    const title = `Chapter ${number}`;
    await connection.execute(
      "INSERT INTO chapters (bookId, chapterNumber, title, slug, description, displayOrder) VALUES (?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE description=VALUES(description)",
      [bookId, number, title, slugify(title), hint, number]
    );
    const [rows] = await connection.execute(
      "SELECT id FROM chapters WHERE bookId = ? AND chapterNumber = ? LIMIT 1",
      [bookId, number]
    );
    chapterIds.set(number, rows[0].id);
  }
  for (const row of content) {
    const chapterNumber = chapterNumberFromHint(row.chapter_hint);
    const chapterId = chapterNumber ? chapterIds.get(chapterNumber) : null;
    for (const topicTitle of row.topic_hints ?? []) {
      if (!chapterId || !topicTitle) continue;
      const topicKey = `${chapterId}:${slugify(topicTitle)}`;
      await connection.execute(
        "INSERT INTO topics (chapterId, title, slug, displayOrder, isActive) VALUES (?, ?, ?, ?, true) ON DUPLICATE KEY UPDATE title=VALUES(title)",
        [chapterId, topicTitle, slugify(topicTitle), row.source_page ?? 1]
      );
      const [topicRows] = await connection.execute(
        "SELECT id FROM topics WHERE chapterId = ? AND slug = ? LIMIT 1",
        [chapterId, slugify(topicTitle)]
      );
      topicIds.set(topicKey, topicRows[0].id);
    }
  }
  for (const batch of chunks(content, batchSize)) {
    audit.batches += 1;
    for (const row of batch) {
      const number = chapterNumberFromHint(row.chapter_hint);
      const chapterId = (number ? chapterIds.get(number) : null) ?? chapterIds.get(0);
      if (!chapterId) {
        audit.uncertainChapterRecords += 1;
        continue;
      }
      const type = row.content_type === "note" ? "note" : "fact";
      if (type === "note") {
        await connection.execute(
          "INSERT INTO gkNotes (bookId, chapterId, title, content, sourcePage, displayOrder, confidence, idempotencyKey) VALUES (?, ?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE content=VALUES(content), confidence=VALUES(confidence)",
          [
            bookId,
            chapterId,
            `Source page ${row.source_page}`,
            row.source_text,
            row.source_page,
            row.source_page,
            row.confidence,
            row.idempotency_key,
          ]
        );
        audit.notesImported += 1;
      } else {
        await connection.execute(
          "INSERT INTO gkFacts (bookId, chapterId, title, factText, sourcePage, confidence, idempotencyKey) VALUES (?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE factText=VALUES(factText), confidence=VALUES(confidence)",
          [
            bookId,
            chapterId,
            null,
            row.source_text,
            row.source_page,
            row.confidence,
            row.idempotency_key,
          ]
        );
        audit.factsImported += 1;
      }
    }
  }
  for (const batch of chunks(mcqs, batchSize)) {
    audit.batches += 1;
    for (const row of batch) {
      const number = chapterNumberFromHint(row.chapter_hint);
      const chapterId = (number ? chapterIds.get(number) : null) ?? chapterIds.get(0);
      if (
        !chapterId ||
        !row.question ||
        !row.options ||
        Object.keys(row.options).length < 2
      ) {
        audit.rejected += 1;
        continue;
      }
      const [result] = await connection.execute(
        "INSERT INTO gkMcqs (bookId, chapterId, question, correctOption, sourcePage, sourceQuestionNumber, confidence, sourceHash) VALUES (?, ?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE question=VALUES(question), correctOption=VALUES(correctOption), confidence=VALUES(confidence)",
        [
          bookId,
          chapterId,
          row.question,
          row.correct_option,
          row.source_page,
          row.source_question_number,
          row.confidence,
          row.idempotency_key,
        ]
      );
      const [idRows] = await connection.execute(
        "SELECT id FROM gkMcqs WHERE sourceHash = ? LIMIT 1",
        [row.idempotency_key]
      );
      const mcqId = idRows[0].id;
      for (const [key, text] of Object.entries(row.options)) {
        await connection.execute(
          "INSERT INTO gkMcqOptions (mcqId, optionKey, optionText, displayOrder, isCorrect) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE optionText=VALUES(optionText), isCorrect=VALUES(isCorrect)",
          [
            mcqId,
            key,
            text,
            "কখগঘ".indexOf(key) + 1,
            key === row.correct_option,
          ]
        );
        audit.optionsImported += 1;
      }
      audit.mcqsImported += 1;
    }
  }
  await connection.execute(
    "INSERT INTO flashcards (subjectId, bookId, chapterId, frontText, backText, sourceType, sourceId, sourceKey) SELECT ?, bookId, chapterId, COALESCE(title, 'Key fact'), factText, 'fact', id, CONCAT('fact:', id) FROM gkFacts WHERE bookId = ? ON DUPLICATE KEY UPDATE frontText=VALUES(frontText), backText=VALUES(backText)",
    [subjectId, bookId]
  );
  await connection.execute(
    "INSERT INTO flashcards (subjectId, bookId, chapterId, frontText, backText, sourceType, sourceId, sourceKey) SELECT ?, bookId, chapterId, title, content, 'note', id, CONCAT('note:', id) FROM gkNotes WHERE bookId = ? ON DUPLICATE KEY UPDATE frontText=VALUES(frontText), backText=VALUES(backText)",
    [subjectId, bookId]
  );
  await connection.execute(
    "INSERT INTO searchDocuments (entityType, entityId, title, body, englishMetadata, searchText) SELECT 'chapter', id, title, COALESCE(description, title), CONCAT('Chapter ', chapterNumber), CONCAT(title, ' ', COALESCE(description, '')) FROM chapters WHERE bookId = ? ON DUPLICATE KEY UPDATE title=VALUES(title), body=VALUES(body), englishMetadata=VALUES(englishMetadata), searchText=VALUES(searchText)",
    [bookId]
  );
  await connection.execute(
    "INSERT INTO searchDocuments (entityType, entityId, title, body, englishMetadata, searchText) SELECT 'fact', id, title, factText, CONCAT('GK fact page ', sourcePage), CONCAT(COALESCE(title, ''), ' ', factText) FROM gkFacts WHERE bookId = ? ON DUPLICATE KEY UPDATE title=VALUES(title), body=VALUES(body), englishMetadata=VALUES(englishMetadata), searchText=VALUES(searchText)",
    [bookId]
  );
  await connection.execute(
    "INSERT INTO searchDocuments (entityType, entityId, title, body, englishMetadata, searchText) SELECT 'note', id, title, content, CONCAT('GK note page ', sourcePage), CONCAT(title, ' ', content) FROM gkNotes WHERE bookId = ? ON DUPLICATE KEY UPDATE title=VALUES(title), body=VALUES(body), englishMetadata=VALUES(englishMetadata), searchText=VALUES(searchText)",
    [bookId]
  );
  await connection.execute(
    "INSERT INTO searchDocuments (entityType, entityId, title, body, englishMetadata, searchText) SELECT 'mcq', id, NULL, question, CONCAT('MCQ page ', sourcePage, ' question ', sourceQuestionNumber), question FROM gkMcqs WHERE bookId = ? ON DUPLICATE KEY UPDATE body=VALUES(body), englishMetadata=VALUES(englishMetadata), searchText=VALUES(searchText)",
    [bookId]
  );
  await connection.commit();
} catch (error) {
  await connection.rollback();
  throw error;
} finally {
  connection.release();
  await pool.end();
}
await fs.writeFile(
  `${outDir}/import-audit.json`,
  JSON.stringify(audit, null, 2),
  "utf8"
);
console.log(JSON.stringify(audit, null, 2));
