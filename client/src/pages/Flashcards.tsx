import { Button } from "@/components/ui/button";
import { Check, Eye, RotateCcw, X } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";
import { startLogin } from "@/const";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";

export default function Flashcards() {
  const { isAuthenticated, loading } = useAuth();
  const {
    data: cards,
    isLoading,
    refetch,
  } = trpc.learning.flashcards.useQuery(
    { limit: 12 },
    { enabled: isAuthenticated }
  );
  const mark = trpc.learning.markProgress.useMutation();
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  if (loading) return <div className="quiet-panel">Checking your session…</div>;
  if (!isAuthenticated)
    return (
      <div className="mx-auto max-w-lg py-16 text-center">
        <h1 className="page-title">
          Flashcards work best when they remember you.
        </h1>
        <p className="mt-3 leading-7 text-muted-foreground">
          Sign in to reveal, review, and carry known/unknown state across
          sessions.
        </p>
        <Button className="mt-6" onClick={() => startLogin()}>
          Sign in with Manus
        </Button>
      </div>
    );
  if (isLoading)
    return <div className="quiet-panel">Loading your review queue…</div>;
  const current = cards?.[index]?.card;
  if (!current)
    return (
      <div className="space-y-5">
        <Link href="/learn" className="text-sm text-muted-foreground">
          Back to library
        </Link>
        <div className="quiet-panel">
          Your review queue is empty. Study a chapter to create flashcards from
          real source content.
        </div>
      </div>
    );
  const next = (known: boolean) => {
    mark.mutate({
      contentType: "flashcard",
      contentId: current.id,
      known,
      status: known ? "completed" : "needs_review",
    });
    setRevealed(false);
    if (index + 1 < (cards?.length ?? 0)) setIndex(index + 1);
    else refetch().then(() => setIndex(0));
  };
  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <p className="eyebrow">Flashcards</p>
          <h1 className="page-title">Recall, then reinforce.</h1>
        </div>
        <span className="text-sm text-muted-foreground">
          {index + 1} / {cards?.length}
        </span>
      </div>
      <button
        type="button"
        onClick={() => setRevealed(value => !value)}
        className="min-h-[300px] w-full rounded-3xl border border-border bg-card p-8 text-left shadow-sm transition-colors hover:border-primary/40 sm:p-12"
      >
        <p className="eyebrow">{revealed ? "Answer" : "Prompt"}</p>
        <p className="mt-6 text-2xl font-medium leading-relaxed">
          {revealed ? current.backText : current.frontText}
        </p>
        {!revealed && (
          <span className="mt-10 inline-flex items-center gap-2 text-sm text-primary">
            <Eye className="size-4" /> Tap to reveal
          </span>
        )}
      </button>
      <div className="flex flex-wrap gap-3">
        {revealed && (
          <>
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => next(false)}
            >
              <X className="size-4" /> Review again
            </Button>
            <Button className="gap-2" onClick={() => next(true)}>
              <Check className="size-4" /> I know this
            </Button>
          </>
        )}
        <Button
          variant="ghost"
          className="gap-2"
          onClick={() => {
            setRevealed(false);
            setIndex(0);
            refetch();
          }}
        >
          <RotateCcw className="size-4" /> Restart
        </Button>
      </div>
    </div>
  );
}
