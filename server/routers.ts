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
  saveLearnerProfile,
} from "./db";
import {
  getGkDashboard,
  getSupabaseChapter,
  getSupabaseLearnerProgress,
  getSupabaseLearnerProfile,
  getSupabaseLibrary,
  getSupabasePracticeAnswerKey,
  getSupabasePracticeQuestions,
  getSupabaseStudyFlashcards,
  getSupabaseTopic,
  saveSupabaseFlashcardReview,
  saveSupabaseLearnerProfile,
  saveSupabasePracticeAttempt,
  saveSupabaseTopicProgress,
  searchSupabaseGk,
} from "./supabaseCatalog";
import { systemRouter } from "./_core/systemRouter";

const pageInput = z.object({
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).max(50).default(20),
});

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
    chapters: publicProcedure
      .input(z.object({ bookId: z.number().int().positive() }))
      .query(({ input }) => listChapters(input.bookId)),
    chapter: publicProcedure
      .input(z.object({ chapterId: z.number().int().positive() }))
      .query(({ input }) => getChapter(input.chapterId)),
    topic: publicProcedure
      .input(z.object({ topicId: z.number().int().positive() }))
      .query(({ input }) => getTopic(input.topicId)),
  }),
  search: router({
    gk: publicProcedure
      .input(
        z.object({
          query: z.string().trim().min(1).max(120),
          ...pageInput.shape,
        })
      )
      .query(({ input }) => searchGk(input.query, input.page, input.pageSize)),
  }),
  gk: router({
    dashboard: publicProcedure.query(() => getGkDashboard()),
    library: publicProcedure
      .input(pageInput)
      .query(({ input }) => getSupabaseLibrary(input.page, input.pageSize)),
    chapter: publicProcedure
      .input(z.object({ chapterId: z.string().uuid() }))
      .query(({ input }) => getSupabaseChapter(input.chapterId)),
    topic: publicProcedure
      .input(z.object({ topicId: z.string().uuid() }))
      .query(({ input }) => getSupabaseTopic(input.topicId)),
    search: publicProcedure
      .input(
        z.object({
          query: z.string().trim().min(1).max(120),
          ...pageInput.shape,
        })
      )
      .query(({ input }) => searchSupabaseGk(input.query, input.page, input.pageSize)),
    practice: publicProcedure
      .input(
        z.object({
          limit: z.number().int().min(1).max(20).default(8),
          chapterId: z.string().uuid().optional(),
        })
      )
      .query(({ input }) => getSupabasePracticeQuestions(input.limit, input.chapterId)),
    submitPractice: protectedProcedure
      .input(
        z.object({
          questions: z
            .array(
              z.object({
                mcqId: z.string().uuid(),
                selectedOption: z.string().trim().min(1).max(8),
              })
            )
            .min(1)
            .max(20)
            .refine(
              questions => new Set(questions.map(question => question.mcqId)).size === questions.length,
              "Questions must be unique"
            ),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const answerKey = await getSupabasePracticeAnswerKey(
          input.questions.map(question => question.mcqId)
        );
        if (answerKey.length !== input.questions.length) {
          throw new TRPCError({ code: "BAD_REQUEST", message: "Question set is unavailable" });
        }
        const answers = new Map(answerKey.map(item => [item.id, item.correctOption]));
        const details = input.questions.map(question => {
          const correctOption = answers.get(question.mcqId);
          if (!correctOption) throw new TRPCError({ code: "BAD_REQUEST", message: "Question set is unavailable" });
          return { ...question, correctOption, isCorrect: question.selectedOption === correctOption };
        });
        const totalQuestions = details.length;
        const correctAnswers = details.filter(question => question.isCorrect).length;
        return saveSupabasePracticeAttempt({ userId: ctx.user.openId, questions: details });
      }),
  }),
  practice: router({
    questions: publicProcedure
      .input(
        z.object({
          limit: z.number().int().min(1).max(20).default(10),
          chapterId: z.number().int().positive().optional(),
        })
      )
      .query(({ input }) => getPracticeQuestions(input.limit, input.chapterId)),
    submit: protectedProcedure
      .input(
        z.object({
          questions: z
            .array(
              z.object({
                mcqId: z.number().int().positive(),
                selectedOption: z.string().max(8).nullable(),
                isCorrect: z.boolean(),
              })
            )
            .min(1)
            .max(50),
          quizType: z.string().max(40).default("practice"),
          bookId: z.number().int().positive().optional(),
          chapterId: z.number().int().positive().optional(),
          topicId: z.number().int().positive().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const userId = ctx.user.id;
        const { getDb } = await import("./db");
        const { quizAttempts, quizAttemptQuestions } = await import(
          "../drizzle/schema"
        );
        const db = await getDb();
        if (!db)
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Database unavailable",
          });
        const correctAnswers = input.questions.filter(
          question => question.isCorrect
        ).length;
        const attempt = await db
          .insert(quizAttempts)
          .values({
            userId,
            quizType: input.quizType,
            bookId: input.bookId,
            chapterId: input.chapterId,
            topicId: input.topicId,
            totalQuestions: input.questions.length,
            correctAnswers,
          })
          .$returningId();
        const attemptId = attempt[0]?.id;
        if (!attemptId)
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Could not save quiz attempt",
          });
        await db
          .insert(quizAttemptQuestions)
          .values(
            input.questions.map(question => ({ attemptId, ...question }))
          );
        await Promise.all(
          input.questions.map(question =>
            saveContentProgress({
              userId,
              contentType: "mcq",
              contentId: question.mcqId,
              correct: question.isCorrect,
              status: question.isCorrect ? "completed" : "needs_review",
            })
          )
        );
        return {
          attemptId,
          correctAnswers,
          totalQuestions: input.questions.length,
        };
      }),
  }),
  learning: router({
    flashcards: protectedProcedure
      .input(z.object({ limit: z.number().int().min(1).max(30).default(12) }))
      .query(({ input, ctx }) => getFlashcards(ctx.user.id, input.limit)),
    markProgress: protectedProcedure
      .input(
        z.object({
          contentType: z.enum([
            "fact",
            "note",
            "flashcard",
            "chapter",
            "topic",
            "mcq",
          ]),
          contentId: z.number().int().positive(),
          status: z
            .enum(["new", "in_progress", "completed", "needs_review"])
            .optional(),
          known: z.boolean().optional(),
          correct: z.boolean().optional(),
        })
      )
      .mutation(({ input, ctx }) =>
        saveContentProgress({ userId: ctx.user.id, ...input })
      ),
  }),
  progress: router({
    overview: protectedProcedure.query(({ ctx }) =>
      getUserProgress(ctx.user.id)
    ),
    profile: protectedProcedure.query(({ ctx }) => getProfile(ctx.user.id)),
  }),
  study: router({
    progress: protectedProcedure.query(({ ctx }) => getSupabaseLearnerProgress(ctx.user.openId)),
    profile: protectedProcedure.query(({ ctx }) => getSupabaseLearnerProfile(ctx.user.openId)),
    flashcards: protectedProcedure
      .input(z.object({ limit: z.number().int().min(1).max(24).default(12) }))
      .query(({ ctx, input }) => getSupabaseStudyFlashcards(ctx.user.openId, input.limit)),
    reviewFlashcard: protectedProcedure
      .input(z.object({ flashcardId: z.string().uuid(), rating: z.enum(["again", "hard", "good", "easy"]) }))
      .mutation(({ ctx, input }) => saveSupabaseFlashcardReview({ userId: ctx.user.openId, ...input })),
    markTopic: protectedProcedure
      .input(z.object({ topicId: z.string().uuid(), status: z.enum(["in_progress", "completed", "needs_review"]) }))
      .mutation(({ ctx, input }) => saveSupabaseTopicProgress({ userId: ctx.user.openId, ...input })),
  }),
  student: router({
    dashboard: protectedProcedure.query(async ({ ctx }) => {
      const [profile, progress, catalog] = await Promise.all([
        getSupabaseLearnerProfile(ctx.user.openId),
        getSupabaseLearnerProgress(ctx.user.openId),
        getGkDashboard(),
      ]);
      return { profile, progress, catalog };
    }),
    onboard: protectedProcedure
      .input(
        z.object({
          displayName: z.string().trim().min(2).max(80),
          dailyGoal: z.number().int().min(5).max(60),
        })
      )
      .mutation(({ ctx, input }) =>
        saveSupabaseLearnerProfile({ userId: ctx.user.openId, displayName: input.displayName, dailyGoalMinutes: input.dailyGoal })
      ),
  }),
});

export type AppRouter = typeof appRouter;
