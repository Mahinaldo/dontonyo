import { TRPCError } from "@trpc/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { TrpcContext } from "./_core/context";

const { answerKeyMock, getDbMock, getUserProgressMock } = vi.hoisted(() => ({
  answerKeyMock: vi.fn(),
  getDbMock: vi.fn(),
  getUserProgressMock: vi.fn(),
}));

vi.mock("./db", async importOriginal => {
  const actual = await importOriginal<typeof import("./db")>();
  return { ...actual, getDb: getDbMock, getUserProgress: getUserProgressMock };
});

vi.mock("./supabaseCatalog", async importOriginal => {
  const actual = await importOriginal<typeof import("./supabaseCatalog")>();
  return { ...actual, getSupabasePracticeAnswerKey: answerKeyMock };
});

import { appRouter } from "./routers";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createContext(user: AuthenticatedUser | null): TrpcContext {
  return {
    user,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

const learner: AuthenticatedUser = {
  id: 42,
  openId: "learner-42",
  email: "learner@example.com",
  name: "Learner",
  loginMethod: "manus",
  role: "user",
  createdAt: new Date(),
  updatedAt: new Date(),
  lastSignedIn: new Date(),
};

describe("gk.submitPractice", () => {
  const questionId = "11111111-1111-4111-8111-111111111111";

  beforeEach(() => {
    getDbMock.mockReset();
    answerKeyMock.mockReset();
    getUserProgressMock.mockReset();
  });

  it("requires an authenticated learner before an attempt can be written", async () => {
    const caller = appRouter.createCaller(createContext(null));

    await expect(
      caller.gk.submitPractice({ questions: [{ mcqId: questionId, selectedOption: "B" }] })
    ).rejects.toMatchObject<Partial<TRPCError>>({ code: "UNAUTHORIZED" });
    expect(getDbMock).not.toHaveBeenCalled();
  });

  it("rejects duplicate question identifiers before any protected records are written", async () => {
    const caller = appRouter.createCaller(createContext(learner));

    await expect(
      caller.gk.submitPractice({
        questions: [
          { mcqId: questionId, selectedOption: "A" },
          { mcqId: questionId, selectedOption: "B" },
        ],
      })
    ).rejects.toMatchObject<Partial<TRPCError>>({ code: "BAD_REQUEST" });
    expect(getDbMock).not.toHaveBeenCalled();
  });

  it("writes an aggregate score, UUID answer detail, and daily progress for the signed-in learner", async () => {
    const attemptValues = vi.fn().mockReturnValue({
      $returningId: vi.fn().mockResolvedValue([{ id: 913 }]),
    });
    const detailValues = vi.fn().mockResolvedValue(undefined);
    const dailyUpdate = vi.fn().mockResolvedValue(undefined);
    const dailyValues = vi.fn().mockReturnValue({ onDuplicateKeyUpdate: dailyUpdate });
    const insert = vi
      .fn()
      .mockReturnValueOnce({ values: attemptValues })
      .mockReturnValueOnce({ values: detailValues })
      .mockReturnValueOnce({ values: dailyValues });
    getDbMock.mockResolvedValue({ insert });
    answerKeyMock.mockResolvedValue([{ id: questionId, correctOption: "B" }]);

    const result = await appRouter
      .createCaller(createContext(learner))
      .gk.submitPractice({ questions: [{ mcqId: questionId, selectedOption: "B" }] });

    expect(insert).toHaveBeenCalledTimes(3);
    expect(attemptValues).toHaveBeenCalledWith({
      userId: 42,
      quizType: "supabase-gk-practice",
      totalQuestions: 1,
      correctAnswers: 1,
    });
    expect(detailValues).toHaveBeenCalledWith([
      {
        attemptId: 913,
        externalMcqId: questionId,
        selectedOption: "B",
        correctOption: "B",
        isCorrect: true,
      },
    ]);
    expect(dailyValues).toHaveBeenCalledWith(expect.objectContaining({
      userId: 42,
      completedActivities: 1,
      quizCount: 1,
      xp: 1,
      isComplete: false,
    }));
    expect(dailyUpdate).toHaveBeenCalledTimes(1);
    expect(result).toEqual({ attemptId: 913, totalQuestions: 1, correctAnswers: 1 });

    getUserProgressMock.mockResolvedValue({
      content: [],
      daily: [{ isComplete: false }],
      attempts: [{ id: 913, userId: 42, totalQuestions: 1, correctAnswers: 1 }],
    });
    await expect(
      appRouter.createCaller(createContext(learner)).progress.overview()
    ).resolves.toMatchObject({
      attempts: [{ id: 913, userId: 42, totalQuestions: 1, correctAnswers: 1 }],
    });
  });
});
