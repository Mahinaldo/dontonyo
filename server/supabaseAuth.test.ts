import { afterEach, describe, expect, it, vi } from "vitest";
import { getDisplayName, getSupabaseUserFromAccessToken } from "./supabaseAuth";

describe("Supabase session resolver", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("returns the authenticated Supabase user only when the token endpoint accepts it", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({
        id: "b5e17e4f-4e42-4cf9-a6db-0a9d4d182e9e",
        email: "learner@example.com",
        user_metadata: { full_name: "Amina Rahman" },
      }), { status: 200 })
    );
    vi.stubGlobal("fetch", fetchMock);

    await expect(getSupabaseUserFromAccessToken("access-token")).resolves.toMatchObject({
      email: "learner@example.com",
      user_metadata: { full_name: "Amina Rahman" },
    });
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining("/auth/v1/user"),
      expect.objectContaining({ headers: expect.objectContaining({ Authorization: "Bearer access-token" }) })
    );
  });

  it("returns no user for an invalid or expired token", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(null, { status: 401 })));
    await expect(getSupabaseUserFromAccessToken("expired-token")).resolves.toBeNull();
  });

  it("uses a profile name when available and an email fallback otherwise", () => {
    expect(getDisplayName({ id: "one", email: "amina@example.com", user_metadata: { full_name: "Amina Rahman" } })).toBe("Amina Rahman");
    expect(getDisplayName({ id: "two", email: "amina@example.com" })).toBe("amina");
  });
});
