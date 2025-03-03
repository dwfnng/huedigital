import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from "@/components/ui/navigation-menu";
import { Link } from "wouter";
import { Library, MapPin, MessageSquare, Gamepad2, Activity, Ticket, Upload, BookText } from 'lucide-react';
import Home from "@/pages/home";
import Chat from "@/pages/chat";
import MapPage from "@/pages/map";
import GamePage from "@/pages/game";
import LiveDataPage from "@/pages/live-data";
import TicketPage from "@/pages/ticket";
import ForumPage from "@/pages/forum";
import ContributionsPage from "@/pages/contributions";
import NotFound from "@/pages/not-found";

function MainNav() {
  return (
    <NavigationMenu className="bg-gradient-to-r from-primary/5 via-background to-primary/5 backdrop-blur-sm border-b sticky top-0 z-50">
      <div className="container mx-auto flex h-16 items-center px-4">
        <NavigationMenuList className="gap-6">
          <NavigationMenuItem>
            <Link href="/" className="flex items-center gap-2">
              <div className="bg-primary/10 p-2 rounded-full">
                <Library className="h-5 w-5 text-primary" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
                Hue Digital
              </span>
            </Link>
          </NavigationMenuItem>

          <div className="h-6 w-px bg-border mx-2" /> {/* Divider */}

          <NavigationMenuItem>
            <Link 
              href="/map" 
              className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-primary/10 transition-colors"
            >
              <MapPin className="h-4 w-4" />
              Bản đồ số
            </Link>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <Link 
              href="/forum" 
              className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-primary/10 transition-colors"
            >
              <BookText className="h-4 w-4" />
              Diễn đàn
            </Link>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <Link 
              href="/contributions" 
              className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-primary/10 transition-colors"
            >
              <Upload className="h-4 w-4" />
              Đóng góp tư liệu
            </Link>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <Link 
              href="/" 
              className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-primary/10 transition-colors"
            >
              <Library className="h-4 w-4" />
              Kho học liệu số
            </Link>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <Link 
              href="/chat" 
              className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-primary/10 transition-colors"
            >
              <MessageSquare className="h-4 w-4" />
              Trò chuyện AI
            </Link>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <Link 
              href="/game" 
              className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-primary/10 transition-colors"
            >
              <Gamepad2 className="h-4 w-4" />
              Game giáo dục
            </Link>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <Link 
              href="/live-data" 
              className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-primary/10 transition-colors"
            >
              <Activity className="h-4 w-4" />
              Dữ liệu thực
            </Link>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <Link 
              href="/ticket" 
              className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-primary/10 transition-colors"
            >
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
      <div className="min-h-screen bg-background">
        <MainNav />
        <main className="py-6 fade-in">
          <Router />
        </main>
      </div>
      <Toaster />
    </QueryClientProvider>
  );
}