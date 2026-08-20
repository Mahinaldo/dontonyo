import { CheckCircle2, LogOut, Settings2, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";

export default function Profile() {
  const { user, loading, isAuthenticated, logout } = useAuth();
  const utils = trpc.useUtils();
  const profile = trpc.study.profile.useQuery(undefined, { enabled: isAuthenticated });
  const [displayName, setDisplayName] = useState("");
  const [dailyGoal, setDailyGoal] = useState(20);
  const save = trpc.student.onboard.useMutation({ onSuccess: () => { utils.study.profile.invalidate(); utils.student.dashboard.invalidate(); } });

  useEffect(() => {
    if (profile.data) {
      setDisplayName(profile.data.displayName);
      setDailyGoal(profile.data.dailyGoalMinutes);
    } else if (user?.name) {
      setDisplayName(user.name);
    }
  }, [profile.data, user?.name]);

  if (loading) return <div className="brutal-card p-8 font-bold">Opening your account…</div>;
  if (!isAuthenticated) return <div className="mx-auto max-w-2xl py-12 text-center"><div className="brutal-card bg-sky p-8"><UserRound className="mx-auto size-10"/><p className="eyebrow mt-5">Your account</p><h1 className="page-title mt-4 text-5xl">MAKE STUDY<br/>PORTABLE.</h1><p className="mx-auto mt-5 max-w-lg font-medium leading-7">Create an account to keep your study trail, review schedule, and practice history private to you.</p><Link href="/auth" className="brutal-button mt-7 px-5 py-3">Create or sign in</Link></div></div>;
  if (profile.isLoading) return <div className="brutal-card p-8 font-bold">Loading your study preferences…</div>;

  return <div className="mx-auto max-w-3xl space-y-8"><header><p className="eyebrow">Account / study setup</p><h1 className="page-title mt-3">YOUR STUDY<br/><span className="text-[#ed4f77]">CORNER.</span></h1></header><section className="brutal-card bg-mint p-6 sm:p-8"><div className="flex items-center gap-5"><div className="grid size-16 place-items-center border-2 border-black bg-pink text-2xl font-bold shadow-[4px_4px_0_#111]">{(user?.name?.[0] ?? "D").toUpperCase()}</div><div><p className="mono text-[10px]">SIGNED IN WITH SUPABASE</p><h2 className="mt-1 text-2xl font-bold tracking-[-.06em]">{user?.name ?? "Dontonyo learner"}</h2><p className="mt-1 text-sm font-medium">{user?.email ?? "Secure account session"}</p></div></div></section><form onSubmit={event => { event.preventDefault(); save.mutate({ displayName, dailyGoal }); }} className="brutal-card bg-card p-6 sm:p-8"><div className="flex items-center gap-2"><Settings2 className="size-5"/><h2 className="section-title">STUDY PREFERENCES</h2></div><p className="mt-3 max-w-xl font-medium leading-7 text-muted-foreground">These settings shape your own dashboard context. They do not create fictional study activity.</p><label className="mt-7 grid gap-2 text-sm font-bold">Your display name<input className="brutal-input" value={displayName} onChange={event => setDisplayName(event.target.value)} required minLength={2} maxLength={80}/></label><fieldset className="mt-7"><legend className="text-sm font-bold">Daily study target</legend><div className="mt-3 grid gap-3 sm:grid-cols-3">{[10, 20, 30].map(goal => <label key={goal} className={`cursor-pointer border-2 border-black p-4 shadow-[3px_3px_0_#111] ${dailyGoal === goal ? "bg-lemon" : "bg-background"}`}><input className="sr-only" type="radio" name="dailyGoal" checked={dailyGoal === goal} onChange={() => setDailyGoal(goal)}/><p className="text-2xl font-bold">{goal}</p><p className="mono text-[10px]">MINUTES / DAY</p></label>)}</div></fieldset>{save.error ? <p role="alert" className="mt-6 border-2 border-black bg-pink p-3 font-bold">{save.error.message}</p> : null}<button disabled={save.isPending} className="brutal-button mt-8 px-4 py-3">{save.isPending ? "Saving preferences…" : save.isSuccess ? "Preferences saved" : "Save preferences"}<CheckCircle2 className="size-4"/></button></form><button onClick={() => logout()} className="brutal-button brutal-button-light px-4 py-3"><LogOut className="size-4"/> Sign out</button></div>;
}
