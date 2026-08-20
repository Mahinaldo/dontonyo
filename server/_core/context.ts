import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { User } from "../../drizzle/schema";
import { getUserByOpenId, upsertUser } from "../db";
import { getDisplayName, getSupabaseUserFromAccessToken } from "../supabaseAuth";

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: User | null;
};

export async function createContext(
  opts: CreateExpressContextOptions
): Promise<TrpcContext> {
  let user: User | null = null;

  const authorization = opts.req.headers.authorization;
  const accessToken = authorization?.startsWith("Bearer ")
    ? authorization.slice("Bearer ".length)
    : null;
  if (accessToken) {
    try {
      const supabaseUser = await getSupabaseUserFromAccessToken(accessToken);
      if (supabaseUser) {
        await upsertUser({
          openId: supabaseUser.id,
          email: supabaseUser.email,
          name: getDisplayName(supabaseUser),
          loginMethod: "supabase",
          lastSignedIn: new Date(),
        });
        user = await getUserByOpenId(supabaseUser.id) ?? null;
      }
    } catch {
      user = null;
    }
  }

  return {
    req: opts.req,
    res: opts.res,
    user,
  };
}
