import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  FileText,
  Lightbulb,
} from "lucide-react";
import { Link, useRoute } from "wouter";
import { trpc } from "@/lib/trpc";

export default function Chapter() {
  const [, params] = useRoute("/learn/chapter/:id");
  const chapterId = Number(params?.id);
  const { data, isLoading, error } = trpc.catalog.chapter.useQuery(
    { chapterId },
    { enabled: Number.isFinite(chapterId) }
  );
  const progress = trpc.learning.markProgress.useMutation();
  if (isLoading) return <div className="quiet-panel">Loading chapter…</div>;
  if (error || !data)
    return (
      <div className="quiet-panel">This chapter is unavailable right now.</div>
    );
  const { chapter, topics, notes, facts } = data;
  return (
    <div className="space-y-8">
      <Link
        href="/learn"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Back to library
      </Link>
      <header className="max-w-3xl">
        <p className="eyebrow">Chapter {chapter.chapterNumber}</p>
        <h1 className="page-title">{chapter.title}</h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          {chapter.description ??
            "A structured place to learn the source material at your pace."}
        </p>
        <Button
          className="mt-5 gap-2"
          onClick={() =>
            progress.mutate({
              contentType: "chapter",
              contentId: chapter.id,
              status: "in_progress",
            })
          }
        >
          <CheckCircle2 className="size-4" /> Mark chapter in progress
        </Button>
      </header>
      <section className="space-y-4">
        <div>
          <p className="eyebrow">Explore</p>
          <h2 className="section-title">Topics</h2>
        </div>
        {topics.length ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {topics.map(topic => (
              <Link
                key={topic.id}
                href={`/learn/topic/${topic.id}`}
                className="group flex items-center justify-between rounded-2xl border border-border bg-card p-5 hover:border-primary/40"
              >
                <div>
                  <h3 className="font-medium group-hover:text-primary">
                    {topic.title}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Open topic study
                  </p>
                </div>
                <ArrowRight className="size-4 text-muted-foreground group-hover:translate-x-1" />
              </Link>
            ))}
          </div>
        ) : (
          <div className="quiet-panel">
            Topics will appear here as the source book is classified.
          </div>
        )}
      </section>
      <section className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <FileText className="size-4 text-primary" />
            <h2 className="section-title">Notes</h2>
          </div>
          {notes.length ? (
            notes.map(note => (
              <article
                key={note.id}
                className="rounded-2xl border border-border bg-card p-5"
              >
                <h3 className="font-medium">{note.title}</h3>
                <p className="mt-3 whitespace-pre-line text-sm leading-7 text-muted-foreground">
                  {note.content}
                </p>
                {note.sourcePage && (
                  <p className="mt-4 text-xs text-muted-foreground">
                    Source page {note.sourcePage}
                  </p>
                )}
              </article>
            ))
          ) : (
            <div className="quiet-panel">
              No notes have been imported for this chapter yet.
            </div>
          )}
        </div>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Lightbulb className="size-4 text-primary" />
            <h2 className="section-title">Key facts</h2>
          </div>
          {facts.length ? (
            facts.map(fact => (
              <article
                key={fact.id}
                className="rounded-2xl border border-border bg-card p-5"
              >
                <h3 className="font-medium">{fact.title ?? "Key fact"}</h3>
                <p className="mt-3 text-sm leading-7">{fact.factText}</p>
                {fact.explanation && (
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {fact.explanation}
                  </p>
                )}
              </article>
            ))
          ) : (
            <div className="quiet-panel">
              No facts have been imported for this chapter yet.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
