import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import Home from "@/pages/home";
import NotFound from "@/pages/not-found";
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from "@/components/ui/navigation-menu";
import { Link } from "wouter";

function MainNav() {
  return (
    <NavigationMenu className="bg-card border-b">
      <div className="container mx-auto flex h-16 items-center px-4">
        <NavigationMenuList>
          <NavigationMenuItem>
            <Link href="/">
              <NavigationMenuLink className="text-lg font-bold">
                Hue Digital
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href="/map">
              <NavigationMenuLink>
                Bản đồ số
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href="/">
              <NavigationMenuLink>
                Kho học liệu số
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
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-background">
        <MainNav />
        <Router />
      </div>
      <Toaster />
    </QueryClientProvider>
  );
}