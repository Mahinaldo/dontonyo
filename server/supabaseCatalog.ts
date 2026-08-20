type JsonRecord = Record<string, unknown>;

export type CatalogBook = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  subjectId: string;
};

export type CatalogChapter = {
  id: string;
  chapterNumber: number;
  title: string;
  slug: string;
  description: string | null;
  displayOrder: number;
};

export type CatalogTopic = {
  id: string;
  chapterId: string;
  title: string;
  slug: string;
  description: string | null;
  displayOrder: number;
};

type ContentNote = {
  id: string;
  title: string;
  content: string;
  sourcePage: number | null;
};

type ContentFact = {
  id: string;
  title: string | null;
  factText: string;
  explanation: string | null;
  sourcePage: number | null;
  confidence: "high" | "medium" | "low";
};

type ContentMcq = {
  id: string;
  question: string;
  correctOption: string;
  sourcePage: number | null;
  sourceQuestionNumber: string | null;
  confidence: "high" | "medium" | "low";
};

type McqOption = {
  id: string;
  mcqId: string;
  optionKey: string;
  optionText: string;
  displayOrder: number;
  isCorrect: boolean;
};

const supabaseUrl = () => {
  const value = process.env.SUPABASE_URL;
  if (!value) throw new Error("SUPABASE_URL is not configured");
  return value.replace(/\/$/, "");
};

const supabaseKey = () => {
  const value = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!value) throw new Error("SUPABASE_SERVICE_ROLE_KEY is not configured");
  return value;
};

function headers(extra?: HeadersInit): HeadersInit {
  const key = supabaseKey();
  return { apikey: key, Authorization: `Bearer ${key}`, ...extra };
}

async function getRows<T>(path: string): Promise<T[]> {
  const response = await fetch(`${supabaseUrl()}/rest/v1/${path}`, {
    headers: headers(),
  });
  if (!response.ok) {
    throw new Error(`Supabase catalog request failed (${response.status})`);
  }
  return (await response.json()) as T[];
}

async function writeRows<T>(path: string, body: unknown, method: "POST" | "PATCH" = "POST"): Promise<T[]> {
  const response = await fetch(`${supabaseUrl()}/rest/v1/${path}`, {
    method,
    headers: headers({ "Content-Type": "application/json", Prefer: "return=representation,resolution=merge-duplicates" }),
    body: JSON.stringify(body),
  });
  if (!response.ok) throw new Error(`Supabase learner-state request failed (${response.status})`);
  return (await response.json()) as T[];
}

async function getExactCount(path: string): Promise<number> {
  const response = await fetch(`${supabaseUrl()}/rest/v1/${path}`, {
    method: "HEAD",
    headers: headers({ Prefer: "count=exact" }),
  });
  if (!response.ok) {
    throw new Error(`Supabase count request failed (${response.status})`);
  }
  const range = response.headers.get("content-range");
  return Number(range?.split("/")[1] ?? 0);
}

function value<T>(row: JsonRecord, key: string): T {
  return row[key] as T;
}

function mapBook(row: JsonRecord): CatalogBook {
  return {
    id: value<string>(row, "id"),
    title: value<string>(row, "title"),
    slug: value<string>(row, "slug"),
    description: value<string | null>(row, "description"),
    subjectId: value<string>(row, "subject_id"),
  };
}

function mapChapter(row: JsonRecord): CatalogChapter {
  return {
    id: value<string>(row, "id"),
    chapterNumber: value<number>(row, "chapter_number"),
    title: value<string>(row, "title"),
    slug: value<string>(row, "slug"),
    description: value<string | null>(row, "description"),
    displayOrder: value<number>(row, "display_order"),
  };
}

function mapTopic(row: JsonRecord): CatalogTopic {
  return {
    id: value<string>(row, "id"),
    chapterId: value<string>(row, "chapter_id"),
    title: value<string>(row, "title"),
    slug: value<string>(row, "slug"),
    description: value<string | null>(row, "description"),
    displayOrder: value<number>(row, "display_order"),
  };
}

function mapNote(row: JsonRecord): ContentNote {
  return {
    id: value<string>(row, "id"),
    title: value<string>(row, "title"),
    content: value<string>(row, "content"),
    sourcePage: value<number | null>(row, "source_page"),
  };
}

function mapFact(row: JsonRecord): ContentFact {
  return {
    id: value<string>(row, "id"),
    title: value<string | null>(row, "title"),
    factText: value<string>(row, "fact_text"),
    explanation: value<string | null>(row, "explanation"),
    sourcePage: value<number | null>(row, "source_page"),
    confidence: value<ContentFact["confidence"]>(row, "confidence"),
  };
}

function mapMcq(row: JsonRecord): ContentMcq {
  return {
    id: value<string>(row, "id"),
    question: value<string>(row, "question"),
    correctOption: value<string>(row, "correct_option"),
    sourcePage: value<number | null>(row, "source_page"),
    sourceQuestionNumber: value<string | null>(row, "source_question_number"),
    confidence: value<ContentMcq["confidence"]>(row, "confidence"),
  };
}

function mapOption(row: JsonRecord): McqOption {
  return {
    id: value<string>(row, "id"),
    mcqId: value<string>(row, "mcq_id"),
    optionKey: value<string>(row, "option_key"),
    optionText: value<string>(row, "option_text"),
    displayOrder: value<number>(row, "display_order"),
    isCorrect: value<boolean>(row, "is_correct"),
  };
}

export async function getSupabaseGkBook(): Promise<CatalogBook | null> {
  const rows = await getRows<JsonRecord>(
    "books?select=id,title,slug,description,subject_id&slug=eq.jubayers-gk&limit=1"
  );
  return rows[0] ? mapBook(rows[0]) : null;
}

export async function listSupabaseChapters(bookId: string): Promise<CatalogChapter[]> {
  const params = new URLSearchParams({
    select: "id,chapter_number,title,slug,description,display_order",
    book_id: `eq.${bookId}`,
    order: "display_order.asc,chapter_number.asc",
  });
  const rows = await getRows<JsonRecord>(`chapters?${params.toString()}`);
  return rows.map(mapChapter);
}

export async function getGkDashboard() {
  const book = await getSupabaseGkBook();
  if (!book) return null;
  const [chapters, topics, factCount, noteCount, mcqCount, flashcardCount] =
    await Promise.all([
      listSupabaseChapters(book.id),
      getExactCount("topics?select=id"),
      getExactCount(`gk_facts?book_id=eq.${book.id}&select=id`),
      getExactCount(`gk_notes?book_id=eq.${book.id}&select=id`),
      getExactCount(`gk_mcqs?book_id=eq.${book.id}&select=id`),
      getExactCount(`flashcards?book_id=eq.${book.id}&select=id`),
    ]);
  return {
    book,
    featuredChapters: chapters.slice(0, 6),
    stats: {
      chapters: chapters.length,
      topics,
      facts: factCount,
      notes: noteCount,
      mcqs: mcqCount,
      flashcards: flashcardCount,
    },
  };
}

export async function getSupabaseLibrary(page: number, pageSize: number) {
  const book = await getSupabaseGkBook();
  if (!book) return null;
  const start = (page - 1) * pageSize;
  const end = start + pageSize - 1;
  const params = new URLSearchParams({
    select: "id,chapter_number,title,slug,description,display_order",
    book_id: `eq.${book.id}`,
    order: "display_order.asc,chapter_number.asc",
  });
  const [rows, total] = await Promise.all([
    getRows<JsonRecord>(`chapters?${params.toString()}&offset=${start}&limit=${pageSize}`),
    getExactCount(`chapters?book_id=eq.${book.id}&select=id`),
  ]);
  return {
    book,
    items: rows.map(mapChapter),
    page,
    pageSize,
    hasMore: end + 1 < total,
    total,
  };
}

export async function getSupabaseChapter(chapterId: string) {
  const rows = await getRows<JsonRecord>(
    `chapters?select=id,book_id,chapter_number,title,slug,description,display_order&id=eq.${chapterId}&limit=1`
  );
  const row = rows[0];
  if (!row) return null;
  const chapter = mapChapter(row);
  const [topicRows, noteRows, factRows, mcqCount] = await Promise.all([
    getRows<JsonRecord>(
      `topics?select=id,chapter_id,title,slug,description,display_order&chapter_id=eq.${chapterId}&order=display_order.asc&limit=100`
    ),
    getRows<JsonRecord>(
      `gk_notes?select=id,title,content,source_page&chapter_id=eq.${chapterId}&order=display_order.asc&limit=8`
    ),
    getRows<JsonRecord>(
      `gk_facts?select=id,title,fact_text,explanation,source_page,confidence&chapter_id=eq.${chapterId}&order=id.asc&limit=12`
    ),
    getExactCount(`gk_mcqs?chapter_id=eq.${chapterId}&select=id`),
  ]);
  return {
    chapter,
    topics: topicRows.map(mapTopic),
    notes: noteRows.map(mapNote),
    facts: factRows.map(mapFact),
    mcqCount,
  };
}

export async function getSupabaseTopic(topicId: string) {
  const rows = await getRows<JsonRecord>(
    `topics?select=id,chapter_id,title,slug,description,display_order&id=eq.${topicId}&limit=1`
  );
  const row = rows[0];
  if (!row) return null;
  const topic = mapTopic(row);
  const [noteRows, factRows, mcqRows] = await Promise.all([
    getRows<JsonRecord>(
      `gk_notes?select=id,title,content,source_page&topic_id=eq.${topicId}&order=display_order.asc&limit=12`
    ),
    getRows<JsonRecord>(
      `gk_facts?select=id,title,fact_text,explanation,source_page,confidence&topic_id=eq.${topicId}&order=id.asc&limit=18`
    ),
    getRows<JsonRecord>(
      `gk_mcqs?select=id,question,correct_option,source_page,source_question_number,confidence&topic_id=eq.${topicId}&order=id.asc&limit=10`
    ),
  ]);
  return {
    topic,
    notes: noteRows.map(mapNote),
    facts: factRows.map(mapFact),
    mcqs: mcqRows.map(mapMcq),
  };
}

export async function searchSupabaseGk(query: string, page: number, pageSize: number) {
  const clean = query.trim().replace(/[(),]/g, " ");
  if (!clean) return { items: [], page, pageSize, hasMore: false };
  const start = (page - 1) * pageSize;
  const params = new URLSearchParams({
    select: "id,entity_type,entity_id,title,body,english_metadata",
    or: `(title.ilike.*${clean}*,body.ilike.*${clean}*,english_metadata.ilike.*${clean}*)`,
    order: "id.asc",
    offset: String(start),
    limit: String(pageSize + 1),
  });
  const rows = await getRows<JsonRecord>(`search_documents?${params.toString()}`);
  return {
    items: rows.slice(0, pageSize).map(row => ({
      id: value<string>(row, "id"),
      entityType: value<string>(row, "entity_type"),
      entityId: value<string>(row, "entity_id"),
      title: value<string | null>(row, "title"),
      body: value<string>(row, "body"),
      englishMetadata: value<string | null>(row, "english_metadata"),
    })),
    page,
    pageSize,
    hasMore: rows.length > pageSize,
  };
}

export async function getSupabasePracticeQuestions(limit: number, chapterId?: string) {
  const book = await getSupabaseGkBook();
  if (!book) return [];
  const total = await getExactCount(
    `gk_mcqs?book_id=eq.${book.id}${chapterId ? `&chapter_id=eq.${chapterId}` : ""}&select=id`
  );
  if (!total) return [];
  const dailyOffset = Math.floor(Date.now() / 86_400_000) % Math.max(1, total - limit + 1);
  const params = new URLSearchParams({
    select: "id,question,correct_option,source_page,source_question_number,confidence",
    book_id: `eq.${book.id}`,
    order: "id.asc",
    offset: String(dailyOffset),
    limit: String(limit),
  });
  if (chapterId) params.set("chapter_id", `eq.${chapterId}`);
  const questionRows = await getRows<JsonRecord>(`gk_mcqs?${params.toString()}`);
  const questions = questionRows.map(mapMcq);
  if (!questions.length) return [];
  const ids = questions.map(question => question.id).join(",");
  const optionRows = await getRows<JsonRecord>(
    `gk_mcq_options?select=id,mcq_id,option_key,option_text,display_order,is_correct&mcq_id=in.(${ids})&order=display_order.asc`
  );
  const options = optionRows.map(mapOption);
  return questions.map(question => ({
    ...question,
    options: options.filter(option => option.mcqId === question.id),
  }));
}

export async function getSupabasePracticeAnswerKey(questionIds: string[]) {
  const uniqueIds = Array.from(new Set(questionIds));
  if (!uniqueIds.length) return [];
  const params = new URLSearchParams({
    select: "id,correct_option",
    id: `in.(${uniqueIds.join(",")})`,
  });
  const rows = await getRows<JsonRecord>(`gk_mcqs?${params.toString()}`);
  return rows.map(row => ({
    id: value<string>(row, "id"),
    correctOption: value<string>(row, "correct_option"),
  }));
}

type StudyFlashcard = {
  id: string;
  frontText: string;
  backText: string;
  topicId: string | null;
  sourceType: string;
  review: { dueAt: string; ease: number; intervalDays: number; reviewCount: number } | null;
};

export async function getSupabaseStudyFlashcards(userId: string, limit: number): Promise<StudyFlashcard[]> {
  const reviewParams = new URLSearchParams({
    select: "flashcard_id,due_at,ease,interval_days,review_count",
    user_id: `eq.${userId}`,
    order: "due_at.asc",
    limit: String(limit),
  });
  const reviewRows = await getRows<JsonRecord>(`learner_flashcard_reviews?${reviewParams.toString()}`);
  const reviewByCard = new Map(reviewRows.map(row => [value<string>(row, "flashcard_id"), {
    dueAt: value<string>(row, "due_at"),
    ease: value<number>(row, "ease"),
    intervalDays: value<number>(row, "interval_days"),
    reviewCount: value<number>(row, "review_count"),
  }]));
  const reviewedIds = Array.from(reviewByCard.keys());
  const dueIds = reviewRows.filter(row => new Date(value<string>(row, "due_at")).getTime() <= Date.now()).map(row => value<string>(row, "flashcard_id"));
  const requestedIds = dueIds.length ? dueIds : reviewedIds;
  const cardRows = requestedIds.length ? await getRows<JsonRecord>(`flashcards?select=id,front_text,back_text,topic_id,source_type&id=in.(${requestedIds.join(",")})&limit=${limit}`) : [];
  const needed = Math.max(0, limit - cardRows.length);
  const freshRows = needed ? await getRows<JsonRecord>(`flashcards?select=id,front_text,back_text,topic_id,source_type&order=created_at.desc&limit=${Math.max(limit * 2, needed)}`) : [];
  const combined = [...cardRows, ...freshRows.filter(row => !reviewByCard.has(value<string>(row, "id")))].slice(0, limit);
  return combined.map(row => {
    const id = value<string>(row, "id");
    return {
      id,
      frontText: value<string>(row, "front_text"),
      backText: value<string>(row, "back_text"),
      topicId: value<string | null>(row, "topic_id"),
      sourceType: value<string>(row, "source_type"),
      review: reviewByCard.get(id) ?? null,
    };
  });
}

export async function saveSupabaseFlashcardReview(input: { userId: string; flashcardId: string; rating: "again" | "hard" | "good" | "easy" }) {
  const existing = await getRows<JsonRecord>(`learner_flashcard_reviews?select=ease,interval_days,review_count&user_id=eq.${input.userId}&flashcard_id=eq.${input.flashcardId}&limit=1`);
  const previous = existing[0];
  const currentInterval = previous ? value<number>(previous, "interval_days") : 0;
  const intervals = { again: 0, hard: Math.max(1, currentInterval || 1), good: Math.max(1, currentInterval ? currentInterval * 2 : 1), easy: Math.max(3, currentInterval ? currentInterval * 3 : 3) } as const;
  const eases = { again: 0, hard: 1, good: 2, easy: 3 } as const;
  const intervalDays = intervals[input.rating];
  const now = new Date();
  const rows = await writeRows<JsonRecord>("learner_flashcard_reviews?on_conflict=user_id,flashcard_id", {
    user_id: input.userId,
    flashcard_id: input.flashcardId,
    ease: eases[input.rating],
    interval_days: intervalDays,
    due_at: new Date(now.getTime() + intervalDays * 86_400_000).toISOString(),
    last_reviewed_at: now.toISOString(),
    review_count: (previous ? value<number>(previous, "review_count") : 0) + 1,
  });
  return rows[0] ?? null;
}

export async function saveSupabaseTopicProgress(input: { userId: string; topicId: string; status: "in_progress" | "completed" | "needs_review" }) {
  const rows = await writeRows<JsonRecord>("learner_topic_progress?on_conflict=user_id,topic_id", {
    user_id: input.userId,
    topic_id: input.topicId,
    status: input.status,
    completed_at: input.status === "completed" ? new Date().toISOString() : null,
    updated_at: new Date().toISOString(),
  });
  return rows[0] ?? null;
}

export async function saveSupabasePracticeAttempt(input: { userId: string; questions: Array<{ mcqId: string; selectedOption: string; correctOption: string; isCorrect: boolean }> }) {
  const correctAnswers = input.questions.filter(question => question.isCorrect).length;
  const attempts = await writeRows<JsonRecord>("learner_practice_attempts", {
    user_id: input.userId,
    total_questions: input.questions.length,
    correct_answers: correctAnswers,
  });
  const attempt = attempts[0];
  if (!attempt) throw new Error("Supabase did not return the saved practice attempt");
  const attemptId = value<string>(attempt, "id");
  await writeRows<JsonRecord>("learner_practice_responses", input.questions.map(question => ({
    attempt_id: attemptId,
    mcq_id: question.mcqId,
    selected_option: question.selectedOption,
    correct_option: question.correctOption,
    is_correct: question.isCorrect,
  })));
  return { attemptId, totalQuestions: input.questions.length, correctAnswers };
}

export async function getSupabaseLearnerProgress(userId: string) {
  const [topicRows, attemptRows, reviewRows] = await Promise.all([
    getRows<JsonRecord>(`learner_topic_progress?select=topic_id,status,completed_at,updated_at&user_id=eq.${userId}&order=updated_at.desc&limit=100`),
    getRows<JsonRecord>(`learner_practice_attempts?select=id,total_questions,correct_answers,completed_at&user_id=eq.${userId}&order=completed_at.desc&limit=30`),
    getRows<JsonRecord>(`learner_flashcard_reviews?select=flashcard_id,due_at,last_reviewed_at,review_count&user_id=eq.${userId}&order=due_at.asc&limit=100`),
  ]);
  return {
    topics: topicRows.map(row => ({ topicId: value<string>(row, "topic_id"), status: value<string>(row, "status"), completedAt: value<string | null>(row, "completed_at") })),
    attempts: attemptRows.map(row => ({ id: value<string>(row, "id"), totalQuestions: value<number>(row, "total_questions"), correctAnswers: value<number>(row, "correct_answers"), completedAt: value<string>(row, "completed_at") })),
    reviews: reviewRows.map(row => ({ flashcardId: value<string>(row, "flashcard_id"), dueAt: value<string>(row, "due_at"), lastReviewedAt: value<string | null>(row, "last_reviewed_at"), reviewCount: value<number>(row, "review_count") })),
  };
}

export async function getSupabaseLearnerProfile(userId: string) {
  const rows = await getRows<JsonRecord>(`learner_profiles?select=user_id,display_name,daily_goal_minutes,onboarding_complete&user_id=eq.${userId}&limit=1`);
  const row = rows[0];
  if (!row) return null;
  return {
    userId: value<string>(row, "user_id"),
    displayName: value<string>(row, "display_name"),
    dailyGoalMinutes: value<number>(row, "daily_goal_minutes"),
    onboardingComplete: value<boolean>(row, "onboarding_complete"),
  };
}

export async function saveSupabaseLearnerProfile(input: { userId: string; displayName: string; dailyGoalMinutes: number }) {
  await writeRows<JsonRecord>("learner_profiles?on_conflict=user_id", {
    user_id: input.userId,
    display_name: input.displayName,
    daily_goal_minutes: input.dailyGoalMinutes,
    onboarding_complete: true,
    updated_at: new Date().toISOString(),
  });
  return getSupabaseLearnerProfile(input.userId);
}
