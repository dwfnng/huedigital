import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link } from "wouter";
import { MapPin, MessageSquare, Gamepad2, BookText, ChevronUp, Upload, Ticket, Library, BarChart2 } from 'lucide-react';
import Home from "@/pages/home";
import Chat from "@/pages/chat";
import MapPage from "@/pages/map";
import GamePage from "@/pages/game";
import ForumPage from "@/pages/forum";
import DigitalLibrary from "@/pages/DigitalLibrary"; 
import TicketPage from "@/pages/ticket";
import ContributePage from "@/pages/contribute";
import LiveDataPage from "@/pages/live-data";
import NotFound from "@/pages/not-found";
import { useState, useEffect } from "react";

function MainNav() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b">
      <nav className="container mx-auto">
        <div className="flex h-16 items-center px-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
              Huế Digital
            </span>
          </Link>

          {/* Main navigation - Reordered according to requirements */}
          <div className="flex items-center gap-1 ml-8 flex-wrap">
            <Link 
              href="/library" 
              className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-primary/10 transition-colors"
            >
              <Library className="h-4 w-4" />
              Kho học liệu
            </Link>

            <Link 
              href="/map" 
              className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-primary/10 transition-colors"
            >
              <MapPin className="h-4 w-4" />
              Bản đồ số
            </Link>

            <Link 
              href="/forum" 
              className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-primary/10 transition-colors"
            >
              <BookText className="h-4 w-4" />
              Diễn đàn
            </Link>

            <Link 
              href="/live-data" 
              className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-primary/10 transition-colors"
            >
              <BarChart2 className="h-4 w-4" />
              Dữ liệu thực
            </Link>

            <Link 
              href="/chat" 
              className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-primary/10 transition-colors"
            >
              <MessageSquare className="h-4 w-4" />
              Trò chuyện AI
            </Link>

            <Link 
              href="/game" 
              className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-primary/10 transition-colors"
            >
              <Gamepad2 className="h-4 w-4" />
              Game giáo dục
            </Link>

            <Link 
              href="/ticket" 
              className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-primary/10 transition-colors"
            >
              <Ticket className="h-4 w-4" />
              Đặt vé
            </Link>

            <Link 
              href="/contribute" 
              className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-primary/10 transition-colors"
            >
              <Upload className="h-4 w-4" />
              Đóng góp
            </Link>
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
      <Route path="/library" component={DigitalLibrary} /> 
      <Route path="/ticket" component={TicketPage} />
      <Route path="/contribute" component={ContributePage} />
      <Route path="/live-data" component={LiveDataPage} />
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