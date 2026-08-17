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

describe("source-backed flashcards", () => {
  it("returns imported representative records through the protected procedure", async () => {
    const caller = appRouter.createCaller(authenticatedContext());
    const cards = await caller.learning.flashcards({ limit: 3 });
    expect(cards.length).toBeGreaterThan(0);
    expect(cards[0]?.card.frontText.length).toBeGreaterThan(0);
    expect(cards[0]?.card.backText.length).toBeGreaterThan(0);
  });
});
