import { COOKIE_NAME } from "@shared/const";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { getSessionCookieOptions } from "./_core/cookies";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import {
  getChapter,
  getFlashcards,
  getGkBook,
  getPracticeQuestions,
  getProfile,
  getTopic,
  getUserProgress,
  listChapters,
  listSubjects,
  saveContentProgress,
  searchGk,
} from "./db";
import { systemRouter } from "./_core/systemRouter";

const pageInput = z.object({ page: z.number().int().min(1).default(1), pageSize: z.number().int().min(1).max(50).default(20) });

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  catalog: router({
    subjects: publicProcedure.query(() => listSubjects()),
    gkBook: publicProcedure.query(() => getGkBook()),
    chapters: publicProcedure.input(z.object({ bookId: z.number().int().positive() })).query(({ input }) => listChapters(input.bookId)),
    chapter: publicProcedure.input(z.object({ chapterId: z.number().int().positive() })).query(({ input }) => getChapter(input.chapterId)),
    topic: publicProcedure.input(z.object({ topicId: z.number().int().positive() })).query(({ input }) => getTopic(input.topicId)),
  }),
  search: router({
    gk: publicProcedure.input(z.object({ query: z.string().trim().min(1).max(120), ...pageInput.shape })).query(({ input }) => searchGk(input.query, input.page, input.pageSize)),
  }),
  practice: router({
    questions: publicProcedure.input(z.object({ limit: z.number().int().min(1).max(20).default(10), chapterId: z.number().int().positive().optional() })).query(({ input }) => getPracticeQuestions(input.limit, input.chapterId)),
    submit: protectedProcedure.input(z.object({ questions: z.array(z.object({ mcqId: z.number().int().positive(), selectedOption: z.string().max(8).nullable(), isCorrect: z.boolean() })).min(1).max(50), quizType: z.string().max(40).default("practice"), bookId: z.number().int().positive().optional(), chapterId: z.number().int().positive().optional(), topicId: z.number().int().positive().optional() })).mutation(async ({ input, ctx }) => {
      const userId = ctx.user.id;
      const { getDb } = await import("./db");
      const { quizAttempts, quizAttemptQuestions } = await import("../drizzle/schema");
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });
      const correctAnswers = input.questions.filter(question => question.isCorrect).length;
      const attempt = await db.insert(quizAttempts).values({ userId, quizType: input.quizType, bookId: input.bookId, chapterId: input.chapterId, topicId: input.topicId, totalQuestions: input.questions.length, correctAnswers }).$returningId();
      const attemptId = attempt[0]?.id;
      if (!attemptId) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Could not save quiz attempt" });
      await db.insert(quizAttemptQuestions).values(input.questions.map(question => ({ attemptId, ...question })));
      await Promise.all(input.questions.map(question => saveContentProgress({ userId, contentType: "mcq", contentId: question.mcqId, correct: question.isCorrect, status: question.isCorrect ? "completed" : "needs_review" })));
      return { attemptId, correctAnswers, totalQuestions: input.questions.length };
    }),
  }),
  learning: router({
    flashcards: protectedProcedure.input(z.object({ limit: z.number().int().min(1).max(30).default(12) })).query(({ input, ctx }) => getFlashcards(ctx.user.id, input.limit)),
    markProgress: protectedProcedure.input(z.object({ contentType: z.enum(["fact", "note", "flashcard", "chapter", "topic", "mcq"]), contentId: z.number().int().positive(), status: z.enum(["new", "in_progress", "completed", "needs_review"]).optional(), known: z.boolean().optional(), correct: z.boolean().optional() })).mutation(({ input, ctx }) => saveContentProgress({ userId: ctx.user.id, ...input })),
  }),
  progress: router({
    overview: protectedProcedure.query(({ ctx }) => getUserProgress(ctx.user.id)),
    profile: protectedProcedure.query(({ ctx }) => getProfile(ctx.user.id)),
  }),
});

export type AppRouter = typeof appRouter;
