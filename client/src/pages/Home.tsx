import { ArrowRight, BookOpen, Brain, Search, Sparkles, Layers3, LibraryBig } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";

export default function Home() {
  const { isAuthenticated, loading } = useAuth();
  const { data, isLoading } = trpc.gk.dashboard.useQuery();
  const [query, setQuery] = useState("");
  const [, setLocation] = useLocation();
  return (
    <div className="space-y-12 lg:space-y-16">
      <section className="grid gap-0 lg:grid-cols-[1.06fr_.94fr]">
        <div className="brutal-card relative z-10 overflow-hidden p-6 sm:p-9 lg:p-12">
          <div className="absolute right-5 top-5 h-16 w-16 border-2 border-black bg-lemon tape" aria-hidden="true" />
          <div className="relative flex flex-col justify-center gap-6">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.14em]">
              <span className="grid size-7 place-items-center border-2 border-black bg-mint"><Sparkles className="size-4" /></span>
              Bangladesh admission prep, rethought
            </div>
            <h1 className="page-title max-w-2xl">STUDY<br /><span className="text-[#ed4f77]">LOUD.</span><br />REMEMBER MORE.</h1>
            <p className="max-w-xl text-base font-medium leading-7 text-muted-foreground sm:text-lg">
              Dontonyo turns serious GK material into a bold, searchable study system — one chapter, fact, and question at a time.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/learn" className="brutal-button px-5 py-3 text-sm">Explore the GK library <ArrowRight className="size-4" /></Link>
              {!loading && !isAuthenticated && <Link href="/auth" className="brutal-button brutal-button-light px-5 py-3 text-sm">Build my study plan <ArrowRight className="size-4" /></Link>}
              {!loading && isAuthenticated && <Link href="/dashboard" className="brutal-button brutal-button-light px-5 py-3 text-sm">Open my study dashboard <ArrowRight className="size-4" /></Link>}
            </div>
            <p className="mono text-[10px] font-medium uppercase tracking-[.12em] text-muted-foreground">No PDFs. No filler. Just useful study material.</p>
          </div>
        </div>
        <div className="relative -mt-1 border-[3px] border-black bg-[#101010] p-5 text-white lg:mt-8 lg:-ml-1 lg:p-8">
          <div className="absolute inset-0 dot-grid opacity-20" aria-hidden="true" />
          <div className="relative grid h-full gap-4 sm:grid-cols-[1fr_.8fr] lg:grid-cols-1">
            <div className="border-2 border-black bg-pink p-5 text-black shadow-[5px_5px_0_#fff]">
              <div className="mb-7 flex items-center justify-between"><BookOpen className="size-7" /><span className="mono text-[10px]">001 / START HERE</span></div>
              <p className="eyebrow">The living GK library</p>
              <h2 className="mt-2 text-3xl font-bold tracking-[-.06em]">{data?.book.title ?? "Jubayer’s GK"}</h2>
              <p className="mt-3 text-sm font-medium leading-6">Your structured companion for facts, chapter notes, source-linked MCQs and revision.</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <StatChip label="facts" value={data?.stats.facts} color="bg-mint" />
              <StatChip label="mcqs" value={data?.stats.mcqs} color="bg-lemon" />
              <StatChip label="chapters" value={data?.stats.chapters} color="bg-sky" />
              <StatChip label="flashcards" value={data?.stats.flashcards} color="bg-lilac" />
            </div>
          </div>
        </div>
      </section>
      <section className="grid gap-8 lg:grid-cols-[.75fr_1.25fr] lg:items-start">
        <div>
          <p className="eyebrow">Find the exact thing</p>
          <h2 className="section-title mt-2">SEARCH THE<br />KNOWLEDGE STACK.</h2>
          <p className="mt-4 max-w-sm font-medium leading-7 text-muted-foreground">Search Bangla facts, question language, and English source metadata without loading thousands of records into your phone.</p>
        </div>
        <div className="brutal-card bg-card p-4 sm:p-6">
          <form onSubmit={event => { event.preventDefault(); if (query.trim()) setLocation(`/learn?search=${encodeURIComponent(query.trim())}`); }}>
            <label className="mono mb-3 block text-[10px] font-medium uppercase tracking-[.12em]">Search anywhere in GK</label>
            <div className="flex gap-3"><div className="relative min-w-0 flex-1"><Search className="absolute left-3 top-1/2 size-5 -translate-y-1/2" /><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Try: বাংলাদেশ, Nobel, নদী..." className="brutal-input pl-11" aria-label="Search the GK library" /></div><button className="brutal-button px-4 sm:px-6" type="submit">Go</button></div>
          </form>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <MiniPromise icon={LibraryBig} text="Browse real chapters" color="bg-sky" />
            <MiniPromise icon={Layers3} text="Study source-linked notes" color="bg-mint" />
            <MiniPromise icon={Brain} text="Practice complete MCQs" color="bg-lemon" />
          </div>
        </div>
      </section>
      <section>
        <div className="mb-5 flex items-end justify-between gap-4"><div><p className="eyebrow">Open a door</p><h2 className="section-title mt-2">START WITH A CHAPTER.</h2></div><Link href="/learn" className="brutal-button brutal-button-light px-3 py-2 text-xs">All chapters <ArrowRight className="size-4" /></Link></div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {(data?.featuredChapters ?? Array.from({ length: 6 })).map((chapter, index) => chapter ? <Link key={chapter.id} href={`/learn/chapter/${chapter.id}`} className="brutal-card-sm hover-lift block p-5"><div className={`mb-7 flex size-11 items-center justify-center border-2 border-black text-sm font-bold ${["bg-lemon","bg-mint","bg-pink","bg-lilac","bg-sky","bg-orange"][index]}`}><span>{String(chapter.chapterNumber).padStart(2,"0")}</span></div><h3 className="bangla text-xl font-bold leading-tight">{chapter.title}</h3><p className="mt-3 line-clamp-2 text-sm font-medium text-muted-foreground">{chapter.description ?? "Explore source-derived topics, notes, facts and practice."}</p><span className="mt-6 inline-flex items-center gap-1 text-xs font-bold uppercase tracking-[.08em]">Open chapter <ArrowRight className="size-4" /></span></Link> : <div key={index} className="h-48 animate-pulse border-2 border-black bg-muted" />)}
        </div>
      </section>
    </div>
  );
}

function StatChip({ label, value, color }: { label: string; value?: number; color: string }) {
  return <div className={`border-2 border-black ${color} p-3 text-black`}><p className="mono text-[9px] font-medium uppercase">{label}</p><p className="mt-2 text-2xl font-bold tracking-[-.08em]">{value?.toLocaleString() ?? "—"}</p></div>;
}

function MiniPromise({ icon: Icon, text, color }: { icon: typeof Brain; text: string; color: string }) {
  return <div className={`flex items-center gap-3 border-2 border-black ${color} p-3`}><Icon className="size-5 shrink-0" /><p className="text-sm font-bold leading-tight">{text}</p></div>;
}
