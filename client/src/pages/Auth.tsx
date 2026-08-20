import { ArrowLeft, ArrowRight, KeyRound, Mail, ShieldCheck } from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "wouter";
import { supabase } from "@/lib/supabase";
import { trpc } from "@/lib/trpc";

type Mode = "sign-in" | "sign-up" | "forgot" | "reset";

const copy: Record<Mode, { eyebrow: string; title: string; description: string; submit: string }> = {
  "sign-in": { eyebrow: "Welcome back", title: "PICK UP WHERE\nYOU LEFT OFF.", description: "Sign in to continue your real study trail, review queue, and saved practice.", submit: "Sign in" },
  "sign-up": { eyebrow: "Start your study system", title: "MAKE GK\nSTICK.", description: "Create a Dontonyo account to build a personal review rhythm from source-linked material.", submit: "Create my account" },
  forgot: { eyebrow: "Account recovery", title: "RESET, THEN\nRETURN.", description: "We will send a secure password-reset link if this email has an account.", submit: "Send reset link" },
  reset: { eyebrow: "New password", title: "SECURE YOUR\nSTUDY SPACE.", description: "Choose a new password, then return to your learning plan.", submit: "Save new password" },
};

export default function Auth() {
  const [, setLocation] = useLocation();
  const utils = trpc.useUtils();
  const [mode, setMode] = useState<Mode>("sign-in");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const activeCopy = useMemo(() => copy[mode], [mode]);

  useEffect(() => {
    if (window.location.hash.includes("type=recovery")) setMode("reset");
  }, []);

  const finishSignIn = async () => {
    await utils.auth.me.invalidate();
    setLocation("/dashboard");
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setNotice("");
    if ((mode === "sign-up" || mode === "reset") && password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setPending(true);
    try {
      if (mode === "sign-in") {
        const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
        if (authError) throw authError;
        await finishSignIn();
        return;
      }
      if (mode === "sign-up") {
        const { data, error: authError } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: name }, emailRedirectTo: `${window.location.origin}/auth` },
        });
        if (authError) throw authError;
        if (data.session) {
          await finishSignIn();
          return;
        }
        setNotice("Check your email to confirm your account, then come back here to sign in.");
        setMode("sign-in");
        setPassword("");
        return;
      }
      if (mode === "forgot") {
        const { error: authError } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/auth` });
        if (authError) throw authError;
        setNotice("If an account exists for this email, a reset link is on its way.");
        return;
      }
      const { error: authError } = await supabase.auth.updateUser({ password });
      if (authError) throw authError;
      setNotice("Your password has been updated. You can now continue studying.");
      setMode("sign-in");
      setPassword("");
      setConfirmPassword("");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "We could not complete that request. Please try again.");
    } finally {
      setPending(false);
    }
  };

  return <div className="mx-auto grid max-w-5xl gap-0 py-4 lg:grid-cols-[1.08fr_.92fr] lg:py-12"><aside className="brutal-card bg-lilac p-7 sm:p-10"><Link href="/" className="inline-flex items-center gap-2 border-b-2 border-black pb-1 text-sm font-bold"><ArrowLeft className="size-4"/> Home</Link><p className="eyebrow mt-12">{activeCopy.eyebrow}</p><h1 className="page-title mt-4 whitespace-pre-line text-5xl sm:text-7xl">{activeCopy.title}</h1><p className="mt-6 max-w-md font-medium leading-7">{activeCopy.description}</p><div className="mt-12 grid gap-3 text-sm font-bold"><span className="flex items-center gap-3"><ShieldCheck className="size-5"/> Your study activity belongs to you</span><span className="flex items-center gap-3"><Mail className="size-5"/> Email confirmation and recovery supported</span></div></aside><section className="brutal-card border-t-0 bg-card p-7 sm:p-10 lg:border-l-0 lg:border-t-[3px]"><form className="space-y-5" onSubmit={submit}>{mode === "sign-up" ? <label className="grid gap-2 text-sm font-bold">Your name<input className="brutal-input" value={name} onChange={event=>setName(event.target.value)} required minLength={2} autoComplete="name" /></label> : null}{mode !== "reset" ? <label className="grid gap-2 text-sm font-bold">Email address<input className="brutal-input" type="email" value={email} onChange={event=>setEmail(event.target.value)} required autoComplete="email" /></label> : null}{mode !== "forgot" ? <label className="grid gap-2 text-sm font-bold">{mode === "reset" ? "New password" : "Password"}<input className="brutal-input" type="password" value={password} onChange={event=>setPassword(event.target.value)} required minLength={8} autoComplete={mode === "sign-in" ? "current-password" : "new-password"} /></label> : null}{(mode === "sign-up" || mode === "reset") ? <label className="grid gap-2 text-sm font-bold">Confirm password<input className="brutal-input" type="password" value={confirmPassword} onChange={event=>setConfirmPassword(event.target.value)} required minLength={8} autoComplete="new-password" /></label> : null}{error ? <p role="alert" className="border-2 border-black bg-pink p-3 text-sm font-bold">{error}</p> : null}{notice ? <p role="status" className="border-2 border-black bg-mint p-3 text-sm font-bold">{notice}</p> : null}<button className="brutal-button w-full justify-center px-5 py-3" disabled={pending}>{pending ? "Working…" : activeCopy.submit} <ArrowRight className="size-4"/></button></form><div className="mt-6 flex flex-wrap gap-x-4 gap-y-3 text-sm font-bold underline underline-offset-4">{mode === "sign-in" ? <><button onClick={()=>setMode("forgot")}>Forgot password?</button><button onClick={()=>setMode("sign-up")}>Create an account</button></> : <button onClick={()=>setMode("sign-in")}>Back to sign in</button>}</div><p className="mono mt-8 text-[10px] text-muted-foreground"><KeyRound className="mr-2 inline size-3"/>SECURED BY SUPABASE AUTH</p></section></div>;
}
