import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import Home from "@/pages/home";
import Chat from "@/pages/chat";
import MapPage from "@/pages/map";
import GamePage from "@/pages/game";
import LiveDataPage from "@/pages/live-data";
import TicketPage from "@/pages/ticket";
import NotFound from "@/pages/not-found";
import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from "@/components/ui/navigation-menu";
import { Link } from "wouter";
import { Library, MapPin, MessageSquare, Gamepad2, Activity, Ticket } from "lucide-react";
import { cn } from "@/lib/utils";

function MainNav() {
  return (
    <NavigationMenu className="bg-card border-b sticky top-0 z-50">
      <div className="container mx-auto flex h-16 items-center px-4">
        <NavigationMenuList className="gap-4">
          <NavigationMenuItem>
            <Link href="/">
              <NavigationMenuLink className="text-lg font-bold">
                Hue Digital
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href="/map">
              <NavigationMenuLink className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Bản đồ số
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href="/">
              <NavigationMenuLink className="flex items-center gap-2">
                <Library className="h-4 w-4" />
                Kho học liệu số
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href="/chat">
              <NavigationMenuLink className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Trò chuyện AI
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href="/game">
              <NavigationMenuLink className="flex items-center gap-2">
                <Gamepad2 className="h-4 w-4" />
                Game giáo dục
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href="/live-data">
              <NavigationMenuLink className="flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Dữ liệu thực
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href="/ticket">
              <NavigationMenuLink className="flex items-center gap-2">
                <Ticket className="h-4 w-4" />
                Đặt vé
              </NavigationMenuLink>
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
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-background">
        <MainNav />
        <main className="py-6">
          <Router />
        </main>
      </div>
      <Toaster />
    </QueryClientProvider>
  );
}