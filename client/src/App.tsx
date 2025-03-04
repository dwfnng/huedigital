import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link } from "wouter";
import { MapPin, MessageSquare, Gamepad2, BookText, ChevronUp, Ticket, Upload, Library } from 'lucide-react';
import Home from "@/pages/home";
import Chat from "@/pages/chat";
import MapPage from "@/pages/map";
import GamePage from "@/pages/game";
import ForumPage from "@/pages/forum";
import TicketPage from "@/pages/ticket";
import LibraryPage from "@/pages/library";
import ContributionsPage from "@/pages/contributions";
import NotFound from "@/pages/not-found";
import { useState, useEffect } from "react";

const MENU_ITEMS = [
  {
    group: "Khám phá",
    items: [
      { href: "/map", icon: MapPin, label: "Bản đồ số" },
      { href: "/ticket", icon: Ticket, label: "Đặt vé tham quan" },
      { href: "/chat", icon: MessageSquare, label: "Trò chuyện AI" }
    ]
  },
  {
    group: "Học liệu",
    items: [
      { href: "/library", icon: Library, label: "Kho học liệu số" },
      { href: "/game", icon: Gamepad2, label: "Game giáo dục" },
      { href: "/forum", icon: BookText, label: "Diễn đàn" }
    ]
  },
  {
    group: "Cộng đồng",
    items: [
      { href: "/contributions", icon: Upload, label: "Đóng góp tư liệu" }
    ]
  }
];

function MainNav() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b">
      <nav className="container mx-auto">
        <div className="flex h-16 items-center px-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 mr-8">
            <span className="text-xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
              Huế Digital
            </span>
          </Link>

          {/* Main navigation */}
          <div className="flex gap-8">
            {MENU_ITEMS.map((group) => (
              <div key={group.group} className="flex flex-col">
                <span className="text-xs text-muted-foreground mb-1">{group.group}</span>
                <div className="flex gap-1">
                  {group.items.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-primary/10 transition-colors"
                    >
                      <item.icon className="h-4 w-4" />
                      <span className="text-sm">{item.label}</span>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </nav>
    </header>
  );
}

function BackToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShow(window.scrollY > 200);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Button
      variant="outline"
      size="icon"
      className={cn(
        "fixed bottom-4 right-4 z-50 rounded-full opacity-0 transition-all duration-300",
        show && "opacity-100"
      )}
      onClick={scrollToTop}
    >
      <ChevronUp className="h-4 w-4" />
    </Button>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/chat" component={Chat} />
      <Route path="/map" component={MapPage} />
      <Route path="/game" component={GamePage} />
      <Route path="/forum" component={ForumPage} />
      <Route path="/ticket" component={TicketPage} />
      <Route path="/library" component={LibraryPage} />
      <Route path="/contributions" component={ContributionsPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-background">
        <MainNav />
        <main className="pt-20 pb-6 fade-in">
          <Router />
        </main>
        <BackToTop />
      </div>
      <Toaster />
    </QueryClientProvider>
  );
}