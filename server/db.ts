import { and, asc, desc, eq, like, or, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser,
  books,
  chapters,
  dailyProgress,
  flashcards,
  gkFacts,
  gkMcqOptions,
  gkMcqs,
  gkNotes,
  profiles,
  quizAttempts,
  searchDocuments,
  subjects,
  topics,
  userContentProgress,
  users,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) return;
  const values: InsertUser = { openId: user.openId };
  const updateSet: Record<string, unknown> = {};
  for (const field of ["name", "email", "loginMethod"] as const) {
    if (user[field] !== undefined) {
      values[field] = user[field] ?? null;
      updateSet[field] = user[field] ?? null;
    }
  }
  values.lastSignedIn = user.lastSignedIn ?? new Date();
  updateSet.lastSignedIn = values.lastSignedIn;
  if (user.role !== undefined || user.openId === ENV.ownerOpenId) {
    values.role = user.role ?? "admin";
    updateSet.role = values.role;
  }
  await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const rows = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return rows[0];
}

export async function listSubjects() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(subjects).where(eq(subjects.isActive, true)).orderBy(asc(subjects.displayOrder));
}

export async function getGkBook() {
  const db = await getDb();
  if (!db) return undefined;
  const rows = await db.select().from(books).where(eq(books.slug, "jubayers-gk")).limit(1);
  return rows[0];
}

export async function listChapters(bookId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select({ id: chapters.id, chapterNumber: chapters.chapterNumber, title: chapters.title, slug: chapters.slug, description: chapters.description, displayOrder: chapters.displayOrder })
    .from(chapters).where(eq(chapters.bookId, bookId)).orderBy(asc(chapters.displayOrder), asc(chapters.chapterNumber));
}

export async function getChapter(chapterId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const chapterRows = await db.select().from(chapters).where(eq(chapters.id, chapterId)).limit(1);
  const chapter = chapterRows[0];
  if (!chapter) return undefined;
  const [topicRows, noteRows, factRows] = await Promise.all([
    db.select().from(topics).where(eq(topics.chapterId, chapterId)).orderBy(asc(topics.displayOrder), asc(topics.id)),
    db.select({ id: gkNotes.id, title: gkNotes.title, content: gkNotes.content, sourcePage: gkNotes.sourcePage, topicId: gkNotes.topicId }).from(gkNotes).where(eq(gkNotes.chapterId, chapterId)).orderBy(asc(gkNotes.displayOrder), asc(gkNotes.id)).limit(20),
    db.select({ id: gkFacts.id, title: gkFacts.title, factText: gkFacts.factText, explanation: gkFacts.explanation, sourcePage: gkFacts.sourcePage, topicId: gkFacts.topicId }).from(gkFacts).where(eq(gkFacts.chapterId, chapterId)).orderBy(asc(gkFacts.id)).limit(40),
  ]);
  return { chapter, topics: topicRows, notes: noteRows, facts: factRows };
}

export async function getTopic(topicId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const topicRows = await db.select().from(topics).where(eq(topics.id, topicId)).limit(1);
  const topic = topicRows[0];
  if (!topic) return undefined;
  const [notes, facts, mcqRows] = await Promise.all([
    db.select().from(gkNotes).where(eq(gkNotes.topicId, topicId)).orderBy(asc(gkNotes.displayOrder)).limit(30),
    db.select().from(gkFacts).where(eq(gkFacts.topicId, topicId)).orderBy(asc(gkFacts.id)).limit(50),
    db.select().from(gkMcqs).where(eq(gkMcqs.topicId, topicId)).orderBy(asc(gkMcqs.id)).limit(20),
  ]);
  return { topic, notes, facts, mcqs: mcqRows };
}

export async function searchGk(query: string, page: number, pageSize: number) {
  const db = await getDb();
  if (!db || !query.trim()) return { items: [], page, pageSize, hasMore: false };
  const term = `%${query.trim()}%`;
  const offset = Math.max(0, page - 1) * pageSize;
  const items = await db.select({ id: searchDocuments.id, entityType: searchDocuments.entityType, entityId: searchDocuments.entityId, title: searchDocuments.title, body: searchDocuments.body, englishMetadata: searchDocuments.englishMetadata })
    .from(searchDocuments)
    .where(or(like(searchDocuments.searchText, term), like(searchDocuments.englishMetadata, term)))
    .orderBy(desc(sql`CASE WHEN ${searchDocuments.title} LIKE ${term} THEN 2 ELSE 1 END`), asc(searchDocuments.id))
    .limit(pageSize + 1).offset(offset);
  return { items: items.slice(0, pageSize), page, pageSize, hasMore: items.length > pageSize };
}

export async function getPracticeQuestions(limit: number, chapterId?: number) {
  const db = await getDb();
  if (!db) return [];
  const rows = await db.select().from(gkMcqs).where(chapterId ? eq(gkMcqs.chapterId, chapterId) : sql`1 = 1`).orderBy(sql`RAND()`).limit(limit);
  if (!rows.length) return [];
  const options = await db.select().from(gkMcqOptions).where(or(...rows.map(row => eq(gkMcqOptions.mcqId, row.id))));
  return rows.map(question => ({ ...question, options: options.filter(option => option.mcqId === question.id) }));
}

export async function getFlashcards(userId: number, limit: number) {
  const db = await getDb();
  if (!db) return [];
  const rows = await db.select({ card: flashcards, progress: userContentProgress }).from(flashcards)
    .leftJoin(userContentProgress, and(eq(userContentProgress.contentId, flashcards.id), eq(userContentProgress.contentType, "flashcard"), eq(userContentProgress.userId, userId)))
    .orderBy(asc(userContentProgress.nextReviewAt), asc(flashcards.id)).limit(limit);
  return rows;
}

export async function getUserProgress(userId: number) {
  const db = await getDb();
  if (!db) return { content: [], daily: [], attempts: [] };
  const [content, daily, attempts] = await Promise.all([
    db.select().from(userContentProgress).where(eq(userContentProgress.userId, userId)).orderBy(desc(userContentProgress.updatedAt)).limit(100),
    db.select().from(dailyProgress).where(eq(dailyProgress.userId, userId)).orderBy(desc(dailyProgress.progressDate)).limit(30),
    db.select().from(quizAttempts).where(eq(quizAttempts.userId, userId)).orderBy(desc(quizAttempts.completedAt)).limit(20),
  ]);
  return { content, daily, attempts };
}

export async function saveContentProgress(input: { userId: number; contentType: "fact" | "note" | "flashcard" | "chapter" | "topic" | "mcq"; contentId: number; status?: "new" | "in_progress" | "completed" | "needs_review"; known?: boolean; correct?: boolean }) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  const existing = await db.select().from(userContentProgress).where(and(eq(userContentProgress.userId, input.userId), eq(userContentProgress.contentType, input.contentType), eq(userContentProgress.contentId, input.contentId))).limit(1);
  const now = new Date();
  const current = existing[0];
  const values = {
    userId: input.userId, contentType: input.contentType, contentId: input.contentId,
    status: input.status ?? current?.status ?? "in_progress", known: input.known ?? current?.known ?? false,
    timesSeen: (current?.timesSeen ?? 0) + 1, correctCount: (current?.correctCount ?? 0) + (input.correct ? 1 : 0), incorrectCount: (current?.incorrectCount ?? 0) + (input.correct === false ? 1 : 0), lastSeenAt: now, nextReviewAt: input.known ? new Date(now.getTime() + 1000 * 60 * 60 * 24 * 3) : now,
  } as const;
  await db.insert(userContentProgress).values(values).onDuplicateKeyUpdate({ set: { status: values.status, known: values.known, timesSeen: values.timesSeen, correctCount: values.correctCount, incorrectCount: values.incorrectCount, lastSeenAt: now, nextReviewAt: values.nextReviewAt } });
  return values;
}

export async function getProfile(userId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const rows = await db.select().from(profiles).where(eq(profiles.userId, userId)).limit(1);
  return rows[0];
}
