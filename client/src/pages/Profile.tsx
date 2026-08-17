import { Button } from "@/components/ui/button";
import { LogIn, LogOut, UserRound } from "lucide-react";
import { startLogin } from "@/const";
import { useAuth } from "@/_core/hooks/useAuth";

export default function Profile() {
  const { user, loading, isAuthenticated, logout } = useAuth();
  if (loading) return <div className="quiet-panel">Loading profile…</div>;
  if (!isAuthenticated) return <div className="mx-auto max-w-lg py-16 text-center"><div className="mx-auto grid size-14 place-items-center rounded-2xl bg-secondary"><UserRound className="size-6 text-secondary-foreground" /></div><h1 className="mt-6 page-title">Make your study portable.</h1><p className="mt-3 leading-7 text-muted-foreground">Sign in to keep your learning progress, flashcard state, and quiz history with you.</p><Button className="mt-6 gap-2" onClick={() => startLogin()}><LogIn className="size-4" /> Sign in with Manus</Button></div>;
  return <div className="space-y-8"><header><p className="eyebrow">Profile</p><h1 className="page-title">Your study space.</h1></header><section className="max-w-2xl rounded-2xl border border-border bg-card p-6"><div className="flex items-center gap-4"><div className="grid size-14 place-items-center rounded-2xl bg-primary text-xl font-semibold text-primary-foreground">{(user?.name?.[0] ?? "D").toUpperCase()}</div><div><h2 className="text-lg font-semibold">{user?.name ?? "Dontonyo learner"}</h2><p className="text-sm text-muted-foreground">{user?.email ?? "Signed in with Manus OAuth"}</p></div></div><div className="mt-8 border-t border-border pt-5"><p className="text-sm leading-6 text-muted-foreground">Profile preferences and daily goals will live here as the learning system grows. No fake settings are shown.</p><Button variant="outline" className="mt-5 gap-2" onClick={() => logout()}><LogOut className="size-4" /> Sign out</Button></div></section></div>;
}
