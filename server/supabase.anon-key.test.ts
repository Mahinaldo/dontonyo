import { describe, expect, it } from "vitest";

describe("Supabase browser authentication configuration", () => {
  it("accepts the configured publishable key at the project auth settings endpoint", async () => {
    const url = process.env.SUPABASE_URL;
    const browserUrl = process.env.VITE_SUPABASE_URL;
    const key = process.env.VITE_SUPABASE_ANON_KEY;

    expect(url).toMatch(/^https:\/\//);
    expect(browserUrl).toBe(url);
    expect(key).toBeTruthy();

    const response = await fetch(`${browserUrl}/auth/v1/settings`, {
      headers: { apikey: key! },
    });

    expect(response.ok).toBe(true);
    await expect(response.json()).resolves.toBeTypeOf("object");
  });
});
