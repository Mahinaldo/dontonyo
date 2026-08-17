import { Button } from "@/components/ui/button";
import { ArrowLeft, Brain, Check, FileText, Lightbulb } from "lucide-react";
import { Link, useRoute } from "wouter";
import { trpc } from "@/lib/trpc";

export default function Topic() {
  const [, params] = useRoute("/learn/topic/:id");
  const topicId = Number(params?.id);
  const { data, isLoading, error } = trpc.catalog.topic.useQuery(
    { topicId },
    { enabled: Number.isFinite(topicId) }
  );
  const progress = trpc.learning.markProgress.useMutation();
  if (isLoading) return <div className="quiet-panel">Loading topic…</div>;
  if (error || !data)
    return (
      <div className="quiet-panel">This topic is unavailable right now.</div>
    );
  const { topic, notes, facts, mcqs } = data;
  return (
    <div className="space-y-8">
      <Link
        href="/learn"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Back to library
      </Link>
      <header className="max-w-3xl">
        <p className="eyebrow">Topic study</p>
        <h1 className="page-title">{topic.title}</h1>
        <p className="mt-3 text-muted-foreground">
          Read the structured source material, then reinforce it with related
          practice.
        </p>
        <Button
          className="mt-5 gap-2"
          onClick={() =>
            progress.mutate({
              contentType: "topic",
              contentId: topic.id,
              status: "completed",
            })
          }
        >
          <Check className="size-4" /> Mark topic complete
        </Button>
      </header>
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
              </article>
            ))
          ) : (
            <div className="quiet-panel">
              No notes are available for this topic yet.
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
                <p className="text-sm leading-7">{fact.factText}</p>
                {fact.sourcePage && (
                  <p className="mt-4 text-xs text-muted-foreground">
                    Source page {fact.sourcePage}
                  </p>
                )}
              </article>
            ))
          ) : (
            <div className="quiet-panel">
              No facts are available for this topic yet.
            </div>
          )}
        </div>
      </section>
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <Brain className="size-4 text-primary" />
          <h2 className="section-title">Related questions</h2>
        </div>
        {mcqs.length ? (
          <div className="space-y-3">
            {mcqs.map(mcq => (
              <div
                key={mcq.id}
                className="rounded-2xl border border-border bg-card p-5"
              >
                <p className="font-medium leading-7">{mcq.question}</p>
                <p className="mt-3 text-sm text-muted-foreground">
                  Confidence: {mcq.confidence}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="quiet-panel">
            Related MCQs will appear once this topic’s questions are imported.
          </div>
        )}
      </section>
    </div>
  );
}
