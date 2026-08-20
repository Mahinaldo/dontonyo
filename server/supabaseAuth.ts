type SupabaseAuthUser = {
  id: string;
  email: string | null;
  user_metadata?: Record<string, unknown>;
};

function authUrl() {
  const url = process.env.SUPABASE_URL;
  if (!url) throw new Error("SUPABASE_URL is not configured");
  return url.replace(/\/$/, "");
}

function publishableKey() {
  const key = process.env.VITE_SUPABASE_ANON_KEY;
  if (!key) throw new Error("VITE_SUPABASE_ANON_KEY is not configured");
  return key;
}

export async function getSupabaseUserFromAccessToken(accessToken: string) {
  const response = await fetch(`${authUrl()}/auth/v1/user`, {
    headers: {
      apikey: publishableKey(),
      Authorization: `Bearer ${accessToken}`,
    },
  });
  if (!response.ok) return null;
  const user = (await response.json()) as SupabaseAuthUser;
  if (!user.id) return null;
  return user;
}

export function getDisplayName(user: SupabaseAuthUser) {
  const metadataName = user.user_metadata?.full_name ?? user.user_metadata?.name;
  if (typeof metadataName === "string" && metadataName.trim()) return metadataName.trim();
  return user.email?.split("@")[0] ?? "Learner";
}
