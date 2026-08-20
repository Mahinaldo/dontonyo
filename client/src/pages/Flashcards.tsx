import { ArrowLeft, Check, Eye, Keyboard, RotateCcw, TimerReset } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";

const ratingCopy = {
  again: { label: "Again", hint: "Show again today", className: "bg-pink" },
  hard: { label: "Hard", hint: "Review tomorrow", className: "bg-orange" },
  good: { label: "Good", hint: "Bring back later", className: "bg-mint" },
  easy: { label: "Easy", hint: "Space it out", className: "bg-sky" },
} as const;

export default function Flashcards() {
  const { isAuthenticated, loading } = useAuth();
  const utils = trpc.useUtils();
  const queue = trpc.study.flashcards.useQuery({ limit: 12 }, { enabled: isAuthenticated });
  const review = trpc.study.reviewFlashcard.useMutation({ onSuccess: () => utils.study.flashcards.invalidate() });
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const cards = queue.data ?? [];
  const current = cards[index];

  useEffect(() => setIndex(currentIndex => Math.min(currentIndex, Math.max(0, cards.length - 1))), [cards.length]);
  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (!current || review.isPending) return;
      if (event.key === " " || event.key === "Enter") { event.preventDefault(); setRevealed(value => !value); }
      if (revealed && ["1", "2", "3", "4"].includes(event.key)) {
        const rating = (["again", "hard", "good", "easy"] as const)[Number(event.key) - 1];
        if (rating) rate(rating);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  });

  const rate = (rating: keyof typeof ratingCopy) => {
    if (!current || review.isPending) return;
    review.mutate({ flashcardId: current.id, rating }, {
      onSuccess: () => {
        setRevealed(false);
        setIndex(currentIndex => currentIndex + 1 < cards.length ? currentIndex + 1 : 0);
      },
    });
  };

  if (loading) return <div className="brutal-card p-8 font-bold">Checking your study space…</div>;
  if (!isAuthenticated) return <div className="mx-auto max-w-2xl py-12 text-center"><div className="brutal-card bg-lilac p-8"><TimerReset className="mx-auto size-10"/><p className="eyebrow mt-5">A review queue that remembers you</p><h1 className="page-title mt-4 text-5xl">RECALL. RATE.<br/>RETURN READY.</h1><p className="mx-auto mt-5 max-w-lg font-medium leading-7">Create an account to reveal source-backed cards, rate your recall, and carry a real spaced-review queue across sessions.</p><Link href="/auth" className="brutal-button mt-7 px-5 py-3">Create or sign in</Link></div></div>;
  if (queue.isLoading) return <div className="brutal-card p-8 font-bold">Building your source-card review set…</div>;
  if (!current) return <div className="mx-auto max-w-2xl space-y-5 py-10"><Link href="/learn" className="inline-flex items-center gap-2 border-b-2 border-black pb-1 text-sm font-bold"><ArrowLeft className="size-4"/> Library</Link><div className="brutal-card bg-mint p-8"><p className="eyebrow">No source cards are due</p><h1 className="page-title mt-4 text-5xl">YOU’RE CLEAR<br/>FOR NOW.</h1><p className="mt-5 max-w-xl font-medium leading-7">There are no flashcards available from the currently imported source set. Study a topic or return after your next scheduled review.</p><Link href="/learn" className="brutal-button mt-7 px-5 py-3">Browse study topics</Link></div></div>;

  return <div className="mx-auto max-w-3xl space-y-7"><header className="flex flex-wrap items-end justify-between gap-4"><div><p className="eyebrow">Active recall / real source cards</p><h1 className="page-title mt-3">DON’T JUST<br/><span className="text-[#ed4f77]">RE-READ.</span></h1></div><div className="border-2 border-black bg-lemon p-3 shadow-[3px_3px_0_#111]"><p className="mono text-[10px]">CARD {String(index + 1).padStart(2, "0")} / {String(cards.length).padStart(2, "0")}</p><p className="mt-1 text-sm font-bold">{current.review ? `${current.review.reviewCount} prior reviews` : "first encounter"}</p></div></header><div className="grid gap-4 sm:grid-cols-[1fr_auto]"><p className="mono text-[10px]">SOURCE TYPE / {current.sourceType.replace(/_/g, " ")}</p><p className="mono flex items-center gap-1 text-[10px]"><Keyboard className="size-3"/> SPACE REVEALS · 1–4 RATES</p></div><button type="button" onClick={() => setRevealed(value => !value)} className={`brutal-card min-h-[330px] w-full p-7 text-left transition-transform hover:-translate-y-0.5 sm:min-h-[380px] sm:p-12 ${revealed ? "bg-mint" : "bg-card"}`}><p className="eyebrow">{revealed ? "Answer / explanation" : "Prompt / recall before revealing"}</p><p className="bangla mt-8 text-2xl font-bold leading-[1.7] sm:text-3xl">{revealed ? current.backText : current.frontText}</p>{!revealed ? <span className="mt-12 inline-flex items-center gap-2 border-b-2 border-black pb-1 text-sm font-bold"><Eye className="size-4"/> Reveal answer</span> : <span className="mt-12 inline-flex items-center gap-2 border-b-2 border-black pb-1 text-sm font-bold"><Check className="size-4"/> Rate how it felt</span>}</button>{revealed ? <div className="grid gap-3 sm:grid-cols-4">{(Object.keys(ratingCopy) as Array<keyof typeof ratingCopy>).map((rating, ratingIndex) => <button key={rating} onClick={() => rate(rating)} disabled={review.isPending} className={`border-2 border-black ${ratingCopy[rating].className} p-4 text-left shadow-[3px_3px_0_#111] transition-transform active:translate-x-[2px] active:translate-y-[2px] disabled:opacity-60`}><span className="mono text-[10px]">{ratingIndex + 1}</span><p className="mt-6 font-bold">{ratingCopy[rating].label}</p><p className="mt-1 text-xs font-medium">{ratingCopy[rating].hint}</p></button>)}</div> : <div className="border-2 border-dashed border-black p-4 text-sm font-medium">Try to say or write the answer first. Then reveal the card and rate recall honestly—the schedule responds to your own rating.</div>}{review.error ? <p role="alert" className="border-2 border-black bg-pink p-3 font-bold">{review.error.message}</p> : null}<button onClick={() => { setIndex(0); setRevealed(false); queue.refetch(); }} className="brutal-button brutal-button-light px-4 py-3"><RotateCcw className="size-4"/> Refresh review set</button></div>;
}
