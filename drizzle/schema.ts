import {
  boolean,
  index,
  int,
  json,
  mysqlEnum,
  mysqlTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export const subjects = mysqlTable(
  "subjects",
  {
    id: int("id").autoincrement().primaryKey(),
    name: varchar("name", { length: 120 }).notNull(),
    slug: varchar("slug", { length: 120 }).notNull(),
    description: text("description"),
    displayOrder: int("displayOrder").notNull().default(0),
    isActive: boolean("isActive").notNull().default(true),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  table => ({ slugUnique: uniqueIndex("subjects_slug_unique").on(table.slug) })
);

export const books = mysqlTable(
  "books",
  {
    id: int("id").autoincrement().primaryKey(),
    subjectId: int("subjectId")
      .notNull()
      .references(() => subjects.id),
    title: varchar("title", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 160 }).notNull(),
    description: text("description"),
    sourceType: varchar("sourceType", { length: 80 })
      .notNull()
      .default("source-book"),
    displayOrder: int("displayOrder").notNull().default(0),
    isActive: boolean("isActive").notNull().default(true),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  table => ({
    slugUnique: uniqueIndex("books_slug_unique").on(table.slug),
    subjectIdx: index("books_subject_idx").on(table.subjectId),
  })
);

export const chapters = mysqlTable(
  "chapters",
  {
    id: int("id").autoincrement().primaryKey(),
    bookId: int("bookId")
      .notNull()
      .references(() => books.id),
    chapterNumber: int("chapterNumber").notNull(),
    title: varchar("title", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 160 }).notNull(),
    description: text("description"),
    displayOrder: int("displayOrder").notNull().default(0),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  table => ({
    bookNumberUnique: uniqueIndex("chapters_book_number_unique").on(
      table.bookId,
      table.chapterNumber
    ),
    bookSlugUnique: uniqueIndex("chapters_book_slug_unique").on(
      table.bookId,
      table.slug
    ),
  })
);

export const topics = mysqlTable(
  "topics",
  {
    id: int("id").autoincrement().primaryKey(),
    chapterId: int("chapterId")
      .notNull()
      .references(() => chapters.id),
    title: varchar("title", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 160 }).notNull(),
    description: text("description"),
    displayOrder: int("displayOrder").notNull().default(0),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  table => ({
    chapterSlugUnique: uniqueIndex("topics_chapter_slug_unique").on(
      table.chapterId,
      table.slug
    ),
    chapterIdx: index("topics_chapter_idx").on(table.chapterId),
  })
);

export const gkFacts = mysqlTable(
  "gkFacts",
  {
    id: int("id").autoincrement().primaryKey(),
    bookId: int("bookId")
      .notNull()
      .references(() => books.id),
    chapterId: int("chapterId")
      .notNull()
      .references(() => chapters.id),
    topicId: int("topicId").references(() => topics.id),
    title: varchar("title", { length: 255 }),
    factText: text("factText").notNull(),
    explanation: text("explanation"),
    sourcePage: int("sourcePage"),
    sourceSection: varchar("sourceSection", { length: 255 }),
    confidence: mysqlEnum("confidence", ["high", "medium", "low"])
      .notNull()
      .default("medium"),
    idempotencyKey: varchar("idempotencyKey", { length: 64 }).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  table => ({
    keyUnique: uniqueIndex("gk_facts_idempotency_unique").on(
      table.idempotencyKey
    ),
    searchIdx: index("gk_facts_search_idx").on(table.chapterId, table.topicId),
    bookIdx: index("gk_facts_book_idx").on(table.bookId),
  })
);

export const gkNotes = mysqlTable(
  "gkNotes",
  {
    id: int("id").autoincrement().primaryKey(),
    bookId: int("bookId")
      .notNull()
      .references(() => books.id),
    chapterId: int("chapterId")
      .notNull()
      .references(() => chapters.id),
    topicId: int("topicId").references(() => topics.id),
    title: varchar("title", { length: 255 }).notNull(),
    content: text("content").notNull(),
    sourcePage: int("sourcePage"),
    displayOrder: int("displayOrder").notNull().default(0),
    confidence: mysqlEnum("confidence", ["high", "medium", "low"])
      .notNull()
      .default("medium"),
    idempotencyKey: varchar("idempotencyKey", { length: 64 }).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  table => ({
    keyUnique: uniqueIndex("gk_notes_idempotency_unique").on(
      table.idempotencyKey
    ),
    chapterIdx: index("gk_notes_chapter_idx").on(
      table.chapterId,
      table.topicId
    ),
  })
);

export const gkMcqs = mysqlTable(
  "gkMcqs",
  {
    id: int("id").autoincrement().primaryKey(),
    bookId: int("bookId")
      .notNull()
      .references(() => books.id),
    chapterId: int("chapterId")
      .notNull()
      .references(() => chapters.id),
    topicId: int("topicId").references(() => topics.id),
    question: text("question").notNull(),
    correctOption: varchar("correctOption", { length: 8 }),
    explanation: text("explanation"),
    sourcePage: int("sourcePage"),
    sourceQuestionNumber: varchar("sourceQuestionNumber", { length: 32 }),
    difficulty: mysqlEnum("difficulty", ["easy", "medium", "hard"]),
    confidence: mysqlEnum("confidence", ["high", "medium", "low"])
      .notNull()
      .default("medium"),
    sourceHash: varchar("sourceHash", { length: 64 }).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  table => ({
    sourceHashUnique: uniqueIndex("gk_mcqs_source_hash_unique").on(
      table.sourceHash
    ),
    chapterIdx: index("gk_mcqs_chapter_idx").on(table.chapterId, table.topicId),
    pageIdx: index("gk_mcqs_source_page_idx").on(table.sourcePage),
  })
);

export const gkMcqOptions = mysqlTable(
  "gkMcqOptions",
  {
    id: int("id").autoincrement().primaryKey(),
    mcqId: int("mcqId")
      .notNull()
      .references(() => gkMcqs.id),
    optionKey: varchar("optionKey", { length: 8 }).notNull(),
    optionText: text("optionText").notNull(),
    displayOrder: int("displayOrder").notNull().default(0),
    isCorrect: boolean("isCorrect").notNull().default(false),
  },
  table => ({
    mcqKeyUnique: uniqueIndex("gk_mcq_options_key_unique").on(
      table.mcqId,
      table.optionKey
    ),
    mcqIdx: index("gk_mcq_options_mcq_idx").on(table.mcqId),
  })
);

export const examSources = mysqlTable(
  "examSources",
  {
    id: int("id").autoincrement().primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    institution: varchar("institution", { length: 255 }),
    examType: varchar("examType", { length: 120 }),
    description: text("description"),
  },
  table => ({
    nameUnique: uniqueIndex("exam_sources_name_unique").on(table.name),
  })
);

export const gkMcqSources = mysqlTable(
  "gkMcqSources",
  {
    mcqId: int("mcqId")
      .notNull()
      .references(() => gkMcqs.id),
    examSourceId: int("examSourceId")
      .notNull()
      .references(() => examSources.id),
    year: int("year"),
    session: varchar("session", { length: 80 }),
    sourceText: text("sourceText"),
  },
  table => ({
    pk: primaryKey({ columns: [table.mcqId, table.examSourceId] }),
    examIdx: index("gk_mcq_sources_exam_idx").on(
      table.examSourceId,
      table.year
    ),
  })
);

export const flashcards = mysqlTable(
  "flashcards",
  {
    id: int("id").autoincrement().primaryKey(),
    subjectId: int("subjectId")
      .notNull()
      .references(() => subjects.id),
    bookId: int("bookId")
      .notNull()
      .references(() => books.id),
    chapterId: int("chapterId")
      .notNull()
      .references(() => chapters.id),
    topicId: int("topicId").references(() => topics.id),
    frontText: text("frontText").notNull(),
    backText: text("backText").notNull(),
    sourceType: varchar("sourceType", { length: 32 }).notNull(),
    sourceId: int("sourceId").notNull(),
    sourceKey: varchar("sourceKey", { length: 96 }).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  table => ({
    sourceUnique: uniqueIndex("flashcards_source_unique").on(
      table.sourceType,
      table.sourceId
    ),
    chapterIdx: index("flashcards_chapter_idx").on(
      table.chapterId,
      table.topicId
    ),
  })
);

export const profiles = mysqlTable("profiles", {
  userId: int("userId")
    .primaryKey()
    .references(() => users.id),
  displayName: varchar("displayName", { length: 160 }),
  avatarUrl: varchar("avatarUrl", { length: 500 }),
  onboardingComplete: boolean("onboardingComplete").notNull().default(false),
  selectedBookId: int("selectedBookId").references(() => books.id),
  dailyGoal: int("dailyGoal").notNull().default(10),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const userContentProgress = mysqlTable(
  "userContentProgress",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId")
      .notNull()
      .references(() => users.id),
    contentType: mysqlEnum("contentType", [
      "fact",
      "note",
      "flashcard",
      "chapter",
      "topic",
      "mcq",
    ]).notNull(),
    contentId: int("contentId").notNull(),
    status: mysqlEnum("status", [
      "new",
      "in_progress",
      "completed",
      "needs_review",
    ])
      .notNull()
      .default("new"),
    known: boolean("known").notNull().default(false),
    timesSeen: int("timesSeen").notNull().default(0),
    correctCount: int("correctCount").notNull().default(0),
    incorrectCount: int("incorrectCount").notNull().default(0),
    lastSeenAt: timestamp("lastSeenAt"),
    nextReviewAt: timestamp("nextReviewAt"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  table => ({
    userContentUnique: uniqueIndex("user_content_progress_unique").on(
      table.userId,
      table.contentType,
      table.contentId
    ),
    userIdx: index("user_content_progress_user_idx").on(
      table.userId,
      table.status,
      table.nextReviewAt
    ),
  })
);

export const dailyProgress = mysqlTable(
  "dailyProgress",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId")
      .notNull()
      .references(() => users.id),
    progressDate: varchar("progressDate", { length: 10 }).notNull(),
    goal: int("goal").notNull().default(10),
    completedActivities: int("completedActivities").notNull().default(0),
    quizCount: int("quizCount").notNull().default(0),
    learningCount: int("learningCount").notNull().default(0),
    xp: int("xp").notNull().default(0),
    isComplete: boolean("isComplete").notNull().default(false),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  table => ({
    userDateUnique: uniqueIndex("daily_progress_user_date_unique").on(
      table.userId,
      table.progressDate
    ),
    userDateIdx: index("daily_progress_user_date_idx").on(
      table.userId,
      table.progressDate
    ),
  })
);

export const quizAttempts = mysqlTable(
  "quizAttempts",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId")
      .notNull()
      .references(() => users.id),
    quizType: varchar("quizType", { length: 40 }).notNull(),
    bookId: int("bookId").references(() => books.id),
    chapterId: int("chapterId").references(() => chapters.id),
    topicId: int("topicId").references(() => topics.id),
    totalQuestions: int("totalQuestions").notNull(),
    correctAnswers: int("correctAnswers").notNull().default(0),
    completedAt: timestamp("completedAt").defaultNow().notNull(),
  },
  table => ({
    userCompletedIdx: index("quiz_attempts_user_completed_idx").on(
      table.userId,
      table.completedAt
    ),
  })
);

export const quizAttemptQuestions = mysqlTable(
  "quizAttemptQuestions",
  {
    attemptId: int("attemptId")
      .notNull()
      .references(() => quizAttempts.id),
    mcqId: int("mcqId")
      .notNull()
      .references(() => gkMcqs.id),
    selectedOption: varchar("selectedOption", { length: 8 }),
    isCorrect: boolean("isCorrect").notNull().default(false),
  },
  table => ({ pk: primaryKey({ columns: [table.attemptId, table.mcqId] }) })
);

export const supabasePracticeAttemptQuestions = mysqlTable(
  "supabasePracticeAttemptQuestions",
  {
    id: int("id").autoincrement().primaryKey(),
    attemptId: int("attemptId")
      .notNull()
      .references(() => quizAttempts.id),
    externalMcqId: varchar("externalMcqId", { length: 36 }).notNull(),
    selectedOption: varchar("selectedOption", { length: 8 }).notNull(),
    correctOption: varchar("correctOption", { length: 8 }).notNull(),
    isCorrect: boolean("isCorrect").notNull().default(false),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  table => ({
    attemptQuestionUnique: uniqueIndex("supabase_practice_attempt_question_unique").on(
      table.attemptId,
      table.externalMcqId
    ),
    attemptIdx: index("supabase_practice_attempt_idx").on(table.attemptId),
  })
);

export const searchDocuments = mysqlTable(
  "searchDocuments",
  {
    id: int("id").autoincrement().primaryKey(),
    entityType: varchar("entityType", { length: 32 }).notNull(),
    entityId: int("entityId").notNull(),
    title: text("title"),
    body: text("body").notNull(),
    englishMetadata: text("englishMetadata"),
    searchText: text("searchText").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  table => ({
    entityUnique: uniqueIndex("search_documents_entity_unique").on(
      table.entityType,
      table.entityId
    ),
    entityIdx: index("search_documents_entity_idx").on(
      table.entityType,
      table.entityId
    ),
  })
);

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type Subject = typeof subjects.$inferSelect;
export type Book = typeof books.$inferSelect;
export type Chapter = typeof chapters.$inferSelect;
export type Topic = typeof topics.$inferSelect;
export type GkFact = typeof gkFacts.$inferSelect;
export type GkNote = typeof gkNotes.$inferSelect;
export type GkMcq = typeof gkMcqs.$inferSelect;
export type Flashcard = typeof flashcards.$inferSelect;
