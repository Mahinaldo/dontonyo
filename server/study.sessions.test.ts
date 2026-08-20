import { beforeEach, describe, expect, it, vi } from "vitest";
import type { User } from "../drizzle/schema";

const { completeMock, profileMock, progressMock, startMock, topicProgressMock } = vi.hoisted(() => ({
  completeMock: vi.fn(),
  profileMock: vi.fn(),
  progressMock: vi.fn(),
  startMock: vi.fn(),
  topicProgressMock: vi.fn(),
}));

vi.mock("./supabaseCatalog", async importOriginal => {
  const actual = await importOriginal<typeof import("./supabaseCatalog")>();
  return {
    ...actual,
    completeSupabaseStudySession: completeMock,
    getSupabaseLearnerProfile: profileMock,
    getSupabaseLearnerProgress: progressMock,
    saveSupabaseTopicProgress: topicProgressMock,
    startSupabaseStudySession: startMock,
  };
});

import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

const learner = { id: 42, openId: "cccccccc-cccc-4ccc-8ccc-cccccccccccc", name: "Amina", email: "amina@example.com" } as User;
const context = (): TrpcContext => ({ user: learner, req: {} as TrpcContext["req"], res: {} as TrpcContext["res"] });
const topicId = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
const sessionId = "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb";

describe("Supabase topic study sessions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("starts an explicit learner-owned session for a topic", async () => {
    startMock.mockResolvedValue({ id: sessionId, startedAt: "2026-08-20T10:00:00.000Z" });
    await expect(appRouter.createCaller(context()).study.startTopicSession({ topicId })).resolves.toMatchObject({ id: sessionId });
    expect(startMock).toHaveBeenCalledWith({ userId: learner.openId, topicId });
  });

  it("completes the session and updates the matching topic’s real study state", async () => {
    completeMock.mockResolvedValue({ id: sessionId, topicId, completedAt: "2026-08-20T10:12:00.000Z" });
    topicProgressMock.mockResolvedValue({});
    await expect(appRouter.createCaller(context()).study.completeTopicSession({ sessionId, sourceBlocksSeen: 12, recallCuesRevealed: true })).resolves.toMatchObject({ id: sessionId, topicId });
    expect(completeMock).toHaveBeenCalledWith({ userId: learner.openId, sessionId, sourceBlocksSeen: 12, recallCuesRevealed: true });
    expect(topicProgressMock).toHaveBeenCalledWith({ userId: learner.openId, topicId, status: "completed" });
  });
});
