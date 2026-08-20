import { describe, expect, it } from "vitest";

describe("Supabase educational-content connection", () => {
  it("authenticates server-side and can read the imported subjects table", async () => {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

    expect(url).toMatch(/^https:\/\/.+\.supabase\.co$/);
    expect(key).toBeTruthy();

    const response = await fetch(
      `${url}/rest/v1/subjects?select=id,slug&order=id.asc&limit=1`,
      {
        headers: {
          apikey: key!,
          Authorization: `Bearer ${key!}`,
        },
      }
    );

    expect(response.ok).toBe(true);
    const payload: unknown = await response.json();
    expect(Array.isArray(payload)).toBe(true);
    expect(payload).not.toHaveLength(0);
  });
});
