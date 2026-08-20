import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import {
  BookOpen,
  Brain,
  GraduationCap,
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
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Onboarding from "./pages/Onboarding";
import { useAuth } from "@/_core/hooks/useAuth";

const navItems = [
  { label: "Home", href: "/", icon: HomeIcon },
  { label: "Learn", href: "/learn", icon: BookOpen },
  { label: "Practice", href: "/practice", icon: Brain },
  { label: "Progress", href: "/progress", icon: LineChart },
  { label: "Profile", href: "/profile", icon: UserRound },
];

function AppShell({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { user, isAuthenticated, loading } = useAuth();
  return (
    <div className="min-h-screen overflow-x-hidden bg-background text-foreground">
      <div className="border-b-2 border-black bg-lemon px-4 py-2 text-center text-[10px] font-bold tracking-[.13em] sm:text-xs">
        GK LIBRARY IS LIVE — BUILT FOR BANGLADESH ADMISSION PREP
      </div>
      <header className="sticky top-0 z-30 border-b-[3px] border-black bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="flex items-center gap-2.5 font-bold tracking-[-.045em]"
          >
            <span className="grid size-10 place-items-center border-2 border-black bg-pink text-xl leading-none shadow-[3px_3px_0_#111]">
              D
            </span>
            <span className="text-xl">dontonyo</span>
          </Link>
          <nav
            className="hidden items-center gap-1 lg:flex"
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
                  className={`border-2 border-transparent px-3 py-2 text-sm font-bold transition-colors ${active ? "border-black bg-mint shadow-[3px_3px_0_#111]" : "hover:border-black hover:bg-card"}`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          {!loading && (isAuthenticated ? (
            <Link href="/profile" className="hidden items-center gap-2 border-2 border-black bg-card px-3 py-2 text-sm font-bold shadow-[3px_3px_0_#111] sm:flex">
              <span className="grid size-5 place-items-center rounded-full bg-lilac text-[10px]">{user?.name?.slice(0, 1).toUpperCase() ?? "U"}</span>
              <span className="max-w-24 truncate">{user?.name ?? "Profile"}</span>
            </Link>
          ) : <Link href="/auth" className="brutal-button hidden px-4 py-2 text-sm sm:inline-flex">Sign in</Link>)}
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 pb-28 pt-6 sm:px-6 sm:pb-12 lg:px-8 lg:pt-10">
        {children}
      </main>
      <nav
        className="fixed inset-x-0 bottom-0 z-30 border-t-[3px] border-black bg-card px-2 py-2 lg:hidden"
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
                  className={`flex flex-col items-center gap-1 border-2 border-transparent py-1.5 text-[10px] font-bold transition-colors ${active ? "border-black bg-lemon text-foreground" : "text-muted-foreground"}`}
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
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/welcome" component={Onboarding} />
        <Route path="/auth" component={Auth} />
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
