import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, BookOpen, Search, Sparkles } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";
import { startLogin } from "@/const";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";

export default function Home() {
  const { isAuthenticated, loading } = useAuth();
  const { data: book } = trpc.catalog.gkBook.useQuery();
  const [query, setQuery] = useState("");
  return <div className="space-y-10">
    <section className="grid gap-8 rounded-3xl border border-border bg-card p-6 shadow-sm sm:grid-cols-[1.2fr_.8fr] sm:p-10">
      <div className="flex flex-col justify-center gap-5">
        <div className="flex items-center gap-2 text-sm font-medium text-primary"><Sparkles className="size-4" /> Study with intention</div>
        <h1 className="max-w-xl text-4xl font-semibold leading-tight tracking-[-0.04em] sm:text-6xl">Your next right answer starts with one clear page.</h1>
        <p className="max-w-lg text-base leading-7 text-muted-foreground sm:text-lg">A focused study companion for Bangladesh university admission preparation—structured notes, meaningful practice, and progress you can trust.</p>
        <div className="flex flex-wrap gap-3">
          <Link href="/learn"><Button size="lg" className="gap-2">Open GK library <ArrowRight className="size-4" /></Button></Link>
          {!loading && !isAuthenticated && <Button size="lg" variant="outline" onClick={() => startLogin()}>Sign in to track progress</Button>}
        </div>
      </div>
      <div className="relative overflow-hidden rounded-2xl bg-primary p-6 text-primary-foreground sm:p-8">
        <div className="absolute -right-10 -top-12 size-40 rounded-full border-[18px] border-primary-foreground/10" />
        <div className="relative flex h-full flex-col justify-between gap-12">
          <div><BookOpen className="mb-7 size-8" strokeWidth={1.6} /><p className="text-sm text-primary-foreground/70">Start here</p><h2 className="mt-2 text-2xl font-semibold">General Knowledge</h2><p className="mt-3 text-sm leading-6 text-primary-foreground/75">{book?.title ?? "Jubayer’s GK"} is being organized into chapters, topics, facts, and practice.</p></div>
          <Link href="/learn" className="inline-flex w-fit items-center gap-2 text-sm font-medium underline underline-offset-4">Browse the library <ArrowRight className="size-4" /></Link>
        </div>
      </div>
    </section>
    <section className="space-y-4">
      <div className="flex items-end justify-between gap-4"><div><p className="eyebrow">Find your thread</p><h2 className="section-title">Search the knowledge library</h2></div><Link href="/learn" className="hidden text-sm font-medium text-primary sm:block">View all chapters <ArrowRight className="ml-1 inline size-4" /></Link></div>
      <form className="relative max-w-2xl" onSubmit={event => { event.preventDefault(); if (query.trim()) window.location.href = `/learn?search=${encodeURIComponent(query.trim())}`; }}><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search Bangla questions, facts, or topics" className="h-12 pl-10" aria-label="Search knowledge library" /></form>
      <div className="grid gap-3 pt-2 sm:grid-cols-3"><div className="quiet-panel"><p className="metric">Structured</p><p className="text-sm text-muted-foreground">A digital book experience, not a PDF viewer.</p></div><div className="quiet-panel"><p className="metric">Practice-ready</p><p className="text-sm text-muted-foreground">MCQs connected to the material you study.</p></div><div className="quiet-panel"><p className="metric">Your pace</p><p className="text-sm text-muted-foreground">Progress stays private to your account.</p></div></div>
    </section>
  </div>;
}
