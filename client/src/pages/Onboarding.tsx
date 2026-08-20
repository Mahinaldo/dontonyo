import { ArrowRight, CheckCircle2, Clock3, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";

const goals = [10, 20, 30] as const;

export default function Onboarding() {
  const [, setLocation] = useLocation();
  const { user, isAuthenticated, loading } = useAuth();
  const profile = trpc.study.profile.useQuery(undefined, { enabled: isAuthenticated });
  const complete = trpc.student.onboard.useMutation({ onSuccess: () => setLocation("/dashboard") });
  const [name, setName] = useState("");
  const [goal, setGoal] = useState<number>(20);

  useEffect(() => {
    if (user?.name && !name) setName(user.name);
  }, [name, user?.name]);
  useEffect(() => {
    if (profile.data?.onboardingComplete) setLocation("/dashboard");
  }, [profile.data?.onboardingComplete, setLocation]);
  useEffect(() => {
    if (!loading && !isAuthenticated) setLocation("/auth");
  }, [isAuthenticated, loading, setLocation]);

  if (loading || profile.isLoading) return <div className="brutal-card p-8 font-bold">Preparing your study space…</div>;
  return <div className="mx-auto max-w-3xl space-y-7 py-4 sm:py-10"><header><p className="eyebrow">First setup / about two minutes</p><h1 className="page-title mt-3">BUILD A PLAN<br/>YOU’LL <span className="text-[#ed4f77]">USE.</span></h1><p className="mt-4 max-w-xl font-medium leading-7 text-muted-foreground">Choose a realistic daily target. Dontonyo will use it to frame your review queue and give your actual study activity context.</p></header><form onSubmit={event=>{event.preventDefault();complete.mutate({displayName:name,dailyGoal:goal});}} className="brutal-card bg-card p-6 sm:p-8"><label className="grid gap-2 font-bold">What should we call you?<input className="brutal-input" value={name} onChange={event=>setName(event.target.value)} minLength={2} maxLength={80} required autoComplete="name" /></label><fieldset className="mt-8"><legend className="font-bold">Your focused daily study target</legend><div className="mt-4 grid gap-3 sm:grid-cols-3">{goals.map(minutes=><label key={minutes} className={`cursor-pointer border-2 border-black p-4 shadow-[3px_3px_0_#111] ${goal===minutes?"bg-mint":"bg-background"}`}><input className="sr-only" type="radio" name="goal" checked={goal===minutes} onChange={()=>setGoal(minutes)} /><Clock3 className="size-5"/><p className="mt-6 text-3xl font-bold tracking-[-.08em]">{minutes}</p><p className="mono mt-1 text-[10px]">MINUTES / DAY</p></label>)}</div></fieldset><div className="mt-8 grid gap-3 border-t-2 border-black pt-6 text-sm font-bold"><span className="flex items-center gap-3"><CheckCircle2 className="size-5"/> Your goals can change later.</span><span className="flex items-center gap-3"><Sparkles className="size-5"/> No fictional baseline or forced daily streak.</span></div>{complete.error?<p role="alert" className="mt-6 border-2 border-black bg-pink p-3 font-bold">{complete.error.message}</p>:null}<button className="brutal-button mt-8 px-5 py-3" disabled={complete.isPending}>{complete.isPending?"Saving your plan…":"Open my study dashboard"}<ArrowRight className="size-4"/></button></form></div>;
}
