import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function publicContext(): TrpcContext {
  return {
    user: null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("protected learning routes", () => {
  it("protects progress overview", async () => {
    const caller = appRouter.createCaller(publicContext());
    await expect(caller.progress.overview()).rejects.toMatchObject({
      code: "UNAUTHORIZED",
    });
  });

  it("protects flashcard review state", async () => {
    const caller = appRouter.createCaller(publicContext());
    await expect(
      caller.learning.flashcards({ limit: 5 })
    ).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });

  it("protects quiz submission", async () => {
    const caller = appRouter.createCaller(publicContext());
    await expect(
      caller.practice.submit({
        questions: [{ mcqId: 1, selectedOption: null, isCorrect: false }],
      })
    ).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });

  it("protects the Supabase flashcard queue and learner progress", async () => {
    const caller = appRouter.createCaller(publicContext());
    await expect(caller.study.flashcards({ limit: 5 })).rejects.toMatchObject({ code: "UNAUTHORIZED" });
    await expect(caller.study.progress()).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });

  it("protects flashcard ratings and topic completion", async () => {
    const caller = appRouter.createCaller(publicContext());
    await expect(caller.study.reviewFlashcard({ flashcardId: "11111111-1111-4111-8111-111111111111", rating: "good" })).rejects.toMatchObject({ code: "UNAUTHORIZED" });
    await expect(caller.study.markTopic({ topicId: "22222222-2222-4222-8222-222222222222", status: "completed" })).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });
});
