import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from "@/components/ui/navigation-menu";
import { Link } from "wouter";
import { Library, MapPin, MessageSquare, Gamepad2, Activity, Ticket, Upload, BookText } from 'lucide-react';
import ParticleBackground from "@/components/ParticleBackground";
import Home from "@/pages/home";
import Chat from "@/pages/chat";
import MapPage from "@/pages/Map";
import GamePage from "@/pages/game";
import LiveDataPage from "@/pages/live-data";
import TicketPage from "@/pages/ticket";
import ForumPage from "@/pages/forum";
import ContributionsPage from "@/pages/contributions";
import NotFound from "@/pages/not-found";

function MainNav() {
  return (
    <NavigationMenu className="bg-card/80 backdrop-blur-sm border-b sticky top-0 z-50 transition-all duration-300">
      <div className="container mx-auto flex h-16 items-center px-4">
        <NavigationMenuList className="gap-4">
          <NavigationMenuItem>
            <Link href="/" className="text-lg font-bold hover:text-primary transition-colors">
              Hue Digital
            </Link>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <Link href="/map" className="flex items-center gap-2 transition-all duration-300 hover:text-primary hover:translate-y-[-2px]">
              <MapPin className="h-4 w-4" />
              Bản đồ số
            </Link>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <Link href="/forum" className="flex items-center gap-2 transition-all duration-300 hover:text-primary hover:translate-y-[-2px]">
              <BookText className="h-4 w-4" />
              Diễn đàn
            </Link>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <Link href="/contributions" className="flex items-center gap-2 transition-all duration-300 hover:text-primary hover:translate-y-[-2px]">
              <Upload className="h-4 w-4" />
              Đóng góp tư liệu
            </Link>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <Link href="/" className="flex items-center gap-2 transition-all duration-300 hover:text-primary hover:translate-y-[-2px]">
              <Library className="h-4 w-4" />
              Kho học liệu số
            </Link>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <Link href="/chat" className="flex items-center gap-2 transition-all duration-300 hover:text-primary hover:translate-y-[-2px]">
              <MessageSquare className="h-4 w-4" />
              Trò chuyện AI
            </Link>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <Link href="/game" className="flex items-center gap-2 transition-all duration-300 hover:text-primary hover:translate-y-[-2px]">
              <Gamepad2 className="h-4 w-4" />
              Game giáo dục
            </Link>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <Link href="/live-data" className="flex items-center gap-2 transition-all duration-300 hover:text-primary hover:translate-y-[-2px]">
              <Activity className="h-4 w-4" />
              Dữ liệu thực
            </Link>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <Link href="/ticket" className="flex items-center gap-2 transition-all duration-300 hover:text-primary hover:translate-y-[-2px]">
              <Ticket className="h-4 w-4" />
              Đặt vé
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </div>
    </NavigationMenu>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/chat" component={Chat} />
      <Route path="/map" component={MapPage} />
      <Route path="/game" component={GamePage} />
      <Route path="/live-data" component={LiveDataPage} />
      <Route path="/ticket" component={TicketPage} />
      <Route path="/forum" component={ForumPage} />
      <Route path="/contributions" component={ContributionsPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-background relative">
        <ParticleBackground />
        <MainNav />
        <main className="py-6 relative">
          <Router />
        </main>
      </div>
      <Toaster />
    </QueryClientProvider>
  );
}