import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { Suspense, lazy } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ModeToggle } from "@/components/mode-toggle";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  MapPin,
  Search,
  Menu,
  Library,
  MessageSquare,
  Gamepad2,
  BarChart3,
  Home,
  FileText
} from "lucide-react";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { queryClient } from "@/lib/query-client";

// Lazy load pages
const HomePage = lazy(() => import("@/pages/home"));
const MapPage = lazy(() => import("@/pages/map"));
const DigitalLibraryPage = lazy(() => import("@/pages/digital-library"));
const ChatPage = lazy(() => import("@/pages/chat"));
const ResourcesPage = lazy(() => import("@/pages/resources"));
const EducationalGamesPage = lazy(() => import("@/components/EducationalGames"));
const LiveDataPage = lazy(() => import("@/pages/live-data"));
const AboutPage = lazy(() => import("@/pages/about"));
const TicketPage = lazy(() => import("@/pages/ticket"));
const GamePage = lazy(() => import("@/pages/game"));
const NotFound = lazy(() => import("@/pages/not-found"));

function MainNav() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Item One</NavigationMenuTrigger>
          <NavigationMenuContent>
            <NavigationMenuLink>Link</NavigationMenuLink>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/chat" element={<ChatPage />} />
      <Route path="/map" element={<MapPage />} />
      <Route path="/game" element={<GamePage />} />
      <Route path="/live-data" element={<LiveDataPage />} />
      <Route path="/ticket" element={<TicketPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-background">
          <MainNav />
          <main className="py-6">
            <Suspense fallback={<div>Loading...</div>}>
              <AppRouter />
            </Suspense>
          </main>
        </div>
        <Toaster />
      </Router>
    </QueryClientProvider>
  );
}