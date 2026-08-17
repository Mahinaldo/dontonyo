import { Input } from "@/components/ui/input";
import { ArrowRight, BookOpen, Search } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useMemo, useState } from "react";
import { trpc } from "@/lib/trpc";

export default function Learn() {
  const [location] = useLocation();
  const searchParam = useMemo(
    () => new URLSearchParams(location.split("?")[1] ?? "").get("search") ?? "",
    [location]
  );
  const [query, setQuery] = useState(searchParam);
  const { data: book, isLoading: bookLoading } = trpc.catalog.gkBook.useQuery();
  const { data: chapters, isLoading: chaptersLoading } =
    trpc.catalog.chapters.useQuery(
      { bookId: book?.id ?? 0 },
      { enabled: Boolean(book?.id) }
    );
  const { data: results, isLoading: searchLoading } = trpc.search.gk.useQuery(
    { query, page: 1, pageSize: 20 },
    { enabled: query.trim().length > 0 }
  );
  return (
    <div className="space-y-8">
      <div className="max-w-2xl">
        <p className="eyebrow">Learn</p>
        <h1 className="page-title">The GK library</h1>
        <p className="mt-3 text-muted-foreground">
          Move through the source book as a connected set of chapters, topics,
          notes, facts, and questions.
        </p>
      </div>
      <form
        className="relative max-w-xl"
        onSubmit={event => event.preventDefault()}
      >
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={event => setQuery(event.target.value)}
          placeholder="Search the library in Bangla or English metadata"
          className="h-12 pl-10"
          aria-label="Search GK library"
        />
      </form>
      {query.trim() ? (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="section-title">Search results</h2>
            <span className="text-sm text-muted-foreground">
              Server-side search
            </span>
          </div>
          {searchLoading ? (
            <div className="quiet-panel">Searching the library…</div>
          ) : results?.items.length ? (
            <div className="space-y-2">
              {results.items.map(item => (
                <div
                  key={`${item.entityType}-${item.entityId}`}
                  className="rounded-2xl border border-border bg-card p-4"
                >
                  <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
                    {item.entityType}
                  </p>
                  <h3 className="mt-2 font-medium">
                    {item.title ?? "Untitled record"}
                  </h3>
                  <p className="mt-2 line-clamp-3 text-sm leading-6 text-muted-foreground">
                    {item.body}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="quiet-panel">
              No matching records yet. Try a different phrase.
            </div>
          )}
        </section>
      ) : (
        <section className="space-y-4">
          <div>
            <p className="eyebrow">Source book</p>
            <h2 className="section-title">
              {bookLoading
                ? "Loading library…"
                : (book?.title ?? "Jubayer’s GK")}
            </h2>
          </div>
          {chaptersLoading ? (
            <div className="quiet-panel">Preparing chapters…</div>
          ) : chapters?.length ? (
            <div className="grid gap-3 sm:grid-cols-2">
              {chapters.map(chapter => (
                <Link
                  key={chapter.id}
                  href={`/learn/chapter/${chapter.id}`}
                  className="group flex items-center justify-between rounded-2xl border border-border bg-card p-5 transition-colors hover:border-primary/40 hover:bg-accent/40"
                >
                  <div className="flex items-center gap-4">
                    <span className="grid size-10 place-items-center rounded-xl bg-secondary text-sm font-semibold text-secondary-foreground">
                      {String(chapter.chapterNumber).padStart(2, "0")}
                    </span>
                    <div>
                      <h3 className="font-medium group-hover:text-primary">
                        {chapter.title}
                      </h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Chapter {chapter.chapterNumber}
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
                </Link>
              ))}
            </div>
          ) : (
            <div className="quiet-panel flex items-start gap-3">
              <BookOpen className="mt-0.5 size-5 text-muted-foreground" />
              <div>
                <p className="font-medium">The library is being prepared</p>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  No chapters have been imported yet. The source-aware
                  extraction pipeline is ready to populate this space without
                  fake content.
                </p>
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
