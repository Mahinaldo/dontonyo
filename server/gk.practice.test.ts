import { TRPCError } from "@trpc/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { TrpcContext } from "./_core/context";

const { answerKeyMock, getDbMock, getLearnerProgressMock, getUserProgressMock, savePracticeAttemptMock } = vi.hoisted(() => ({
  answerKeyMock: vi.fn(),
  getDbMock: vi.fn(),
  getLearnerProgressMock: vi.fn(),
  getUserProgressMock: vi.fn(),
  savePracticeAttemptMock: vi.fn(),
}));

vi.mock("./db", async importOriginal => {
  const actual = await importOriginal<typeof import("./db")>();
  return { ...actual, getDb: getDbMock, getUserProgress: getUserProgressMock };
});

vi.mock("./supabaseCatalog", async importOriginal => {
  const actual = await importOriginal<typeof import("./supabaseCatalog")>();
  return {
    ...actual,
    getSupabaseLearnerProgress: getLearnerProgressMock,
    getSupabasePracticeAnswerKey: answerKeyMock,
    saveSupabasePracticeAttempt: savePracticeAttemptMock,
  };
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
    getLearnerProgressMock.mockReset();
    savePracticeAttemptMock.mockReset();
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

  it("writes verified UUID answer detail to the signed-in learner’s Supabase study record", async () => {
    answerKeyMock.mockResolvedValue([{ id: questionId, correctOption: "B" }]);
    savePracticeAttemptMock.mockResolvedValue({ attemptId: "a0a01010-1010-4010-8010-101010101010", totalQuestions: 1, correctAnswers: 1 });

    const result = await appRouter
      .createCaller(createContext(learner))
      .gk.submitPractice({ questions: [{ mcqId: questionId, selectedOption: "B" }] });

    expect(savePracticeAttemptMock).toHaveBeenCalledWith({
      userId: "learner-42",
      questions: [{ mcqId: questionId, selectedOption: "B", correctOption: "B", isCorrect: true }],
    });
    expect(result).toEqual({ attemptId: "a0a01010-1010-4010-8010-101010101010", totalQuestions: 1, correctAnswers: 1 });

    getLearnerProgressMock.mockResolvedValue({
      topics: [], reviews: [],
      attempts: [{ id: "a0a01010-1010-4010-8010-101010101010", totalQuestions: 1, correctAnswers: 1, completedAt: "2026-08-20T00:00:00.000Z" }],
    });
    await expect(
      appRouter.createCaller(createContext(learner)).study.progress()
    ).resolves.toMatchObject({
      attempts: [{ id: "a0a01010-1010-4010-8010-101010101010", totalQuestions: 1, correctAnswers: 1 }],
    });
  });
});
