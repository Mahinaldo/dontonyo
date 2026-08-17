import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import {
  BookOpen,
  Brain,
  Home as HomeIcon,
  LineChart,
  UserRound,
} from "lucide-react";
import { Link, Route, Switch, useLocation } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Learn from "./pages/Learn";
import Practice from "./pages/Practice";
import Progress from "./pages/Progress";
import Profile from "./pages/Profile";
import Topic from "./pages/Topic";
import Chapter from "./pages/Chapter";
import Flashcards from "./pages/Flashcards";
import NotFound from "./pages/NotFound";

const navItems = [
  { label: "Home", href: "/", icon: HomeIcon },
  { label: "Learn", href: "/learn", icon: BookOpen },
  { label: "Practice", href: "/practice", icon: Brain },
  { label: "Progress", href: "/progress", icon: LineChart },
  { label: "Profile", href: "/profile", icon: UserRound },
];

function AppShell({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-30 border-b border-border/70 bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link
            href="/"
            className="flex items-center gap-2.5 font-semibold tracking-tight"
          >
            <span className="grid size-8 place-items-center rounded-xl bg-primary text-primary-foreground shadow-sm">
              D
            </span>
            <span>Dontonyo</span>
          </Link>
          <nav
            className="hidden items-center gap-1 sm:flex"
            aria-label="Primary navigation"
          >
            {navItems.map(item => {
              const active =
                item.href === "/"
                  ? location === "/"
                  : location.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-lg px-3 py-2 text-sm transition-colors ${active ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"}`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div
            className="hidden size-8 rounded-full border border-border bg-muted sm:block"
            aria-hidden="true"
          />
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 pb-24 pt-8 sm:px-6 sm:pb-10">
        {children}
      </main>
      <nav
        className="fixed inset-x-0 bottom-0 z-30 border-t border-border/80 bg-background/95 px-2 py-2 backdrop-blur sm:hidden"
        aria-label="Mobile navigation"
      >
        <div className="mx-auto grid max-w-md grid-cols-5 gap-1">
          {navItems.map(item => {
            const active =
              item.href === "/"
                ? location === "/"
                : location.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-1 rounded-xl py-1.5 text-[11px] transition-colors ${active ? "text-primary" : "text-muted-foreground"}`}
              >
                <Icon className="size-5" strokeWidth={active ? 2.4 : 1.8} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

function Router() {
  return (
    <AppShell>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/learn" component={Learn} />
        <Route path="/learn/chapter/:id" component={Chapter} />
        <Route path="/learn/topic/:id" component={Topic} />
        <Route path="/learn/flashcards" component={Flashcards} />
        <Route path="/practice" component={Practice} />
        <Route path="/progress" component={Progress} />
        <Route path="/profile" component={Profile} />
        <Route path="/404" component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    </AppShell>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
