import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import Home from "@/pages/home";
import Chat from "@/pages/chat";
import NotFound from "@/pages/not-found";
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from "@/components/ui/navigation-menu";
import { Link } from "wouter";
import { Library, MapPin, MessageSquare } from "lucide-react";

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