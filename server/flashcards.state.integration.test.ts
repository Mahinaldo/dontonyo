import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function authenticatedContext(): TrpcContext {
  const now = new Date();
  return {
    user: {
      id: 1,
      openId: "integration-user",
      name: "Integration User",
      email: "integration@example.com",
      loginMethod: "test",
      role: "user",
      createdAt: now,
      updatedAt: now,
      lastSignedIn: now,
    },
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("flashcard review state", () => {
  it("persists unknown and known states with different review timing", async () => {
    const caller = appRouter.createCaller(authenticatedContext());
    const cards = await caller.learning.flashcards({ limit: 1 });
    const card = cards[0]?.card;
    expect(card).toBeTruthy();
    if (!card) return;

    const unknown = await caller.learning.markProgress({
      contentType: "flashcard",
      contentId: card.id,
      known: false,
      status: "needs_review",
    });
    expect(unknown.known).toBe(false);
    expect(unknown.status).toBe("needs_review");
    expect(unknown.timesSeen).toBeGreaterThan(0);

    const known = await caller.learning.markProgress({
      contentType: "flashcard",
      contentId: card.id,
      known: true,
      status: "completed",
    });
    expect(known.known).toBe(true);
    expect(known.status).toBe("completed");
    expect(known.timesSeen).toBeGreaterThan(unknown.timesSeen);
    expect(known.nextReviewAt.getTime()).toBeGreaterThan(Date.now());
  });
});
