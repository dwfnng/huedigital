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
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from "@/components/ui/navigation-menu";
import { Link } from "wouter";
import { Library, MapPin, MessageSquare, Gamepad2, Activity, Ticket } from "lucide-react";

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

// Lazy load pages
const HomePage = lazy(() => import("@/pages/home"));
const MapPage = lazy(() => import("@/pages/map"));
const DigitalLibraryPage = lazy(() => import("@/pages/digital-library"));
const ChatPage = lazy(() => import("@/pages/chat"));
const ResourcesPage = lazy(() => import("@/pages/resources"));
const EducationalGamesPage = lazy(() => import("@/components/EducationalGames"));
const LiveDataPage = lazy(() => import("@/pages/live-data"));
const AboutPage = lazy(() => import("@/pages/about"));

export default function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <header className="border-b">
          <div className="container mx-auto flex h-16 items-center px-4">
            <Link to="/" className="flex items-center gap-2">
              <span className="text-xl font-bold text-primary">Hue Digital</span>
            </Link>
            
            <div className="hidden md:flex mx-6 items-center space-x-4 lg:space-x-6">
              <NavigationMenu className="hidden lg:flex">
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <Link to="/map">
                      <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                        <MapPin className="h-4 w-4 mr-2" />
                        <span>Bản đồ số</span>
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                  
                  <NavigationMenuItem>
                    <Link to="/library">
                      <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                        <Library className="h-4 w-4 mr-2" />
                        <span>Kho học liệu số</span>
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                  
                  <NavigationMenuItem>
                    <Link to="/chat">
                      <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                        <MessageSquare className="h-4 w-4 mr-2" />
                        <span>Trò chuyện AI</span>
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                  
                  <NavigationMenuItem>
                    <Link to="/games">
                      <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                        <Gamepad2 className="h-4 w-4 mr-2" />
                        <span>Game giáo dục</span>
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                  
                  <NavigationMenuItem>
                    <Link to="/live-data">
                      <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                        <BarChart3 className="h-4 w-4 mr-2" />
                        <span>Dữ liệu thực</span>
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </div>
            
            <div className="ml-auto flex items-center gap-2">
              <ModeToggle />
              
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="lg:hidden">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left">
                  <ScrollArea className="h-full">
                    <div className="px-1 py-4">
                      <h2 className="mb-4 text-lg font-semibold">Hue Digital</h2>
                      <div className="space-y-2">
                        <Link to="/" className="flex items-center gap-2 py-2">
                          <Home className="h-4 w-4" />
                          <span>Trang chủ</span>
                        </Link>
                        <Link to="/map" className="flex items-center gap-2 py-2">
                          <MapPin className="h-4 w-4" />
                          <span>Bản đồ số</span>
                        </Link>
                        <Link to="/library" className="flex items-center gap-2 py-2">
                          <Library className="h-4 w-4" />
                          <span>Kho học liệu số</span>
                        </Link>
                        <Link to="/chat" className="flex items-center gap-2 py-2">
                          <MessageSquare className="h-4 w-4" />
                          <span>Trò chuyện AI</span>
                        </Link>
                        <Link to="/games" className="flex items-center gap-2 py-2">
                          <Gamepad2 className="h-4 w-4" />
                          <span>Game giáo dục</span>
                        </Link>
                        <Link to="/live-data" className="flex items-center gap-2 py-2">
                          <BarChart3 className="h-4 w-4" />
                          <span>Dữ liệu thực</span>
                        </Link>
                        <Link to="/about" className="flex items-center gap-2 py-2">
                          <FileText className="h-4 w-4" />
                          <span>Về ứng dụng</span>
                        </Link>
                      </div>
                    </div>
                  </ScrollArea>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </header>
        
        <main className="flex-1">
          <Suspense fallback={<div className="container mx-auto p-4 flex items-center justify-center h-full">Đang tải...</div>}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/map" element={<MapPage />} />
              <Route path="/library" element={<DigitalLibraryPage />} />
              <Route path="/chat" element={<ChatPage />} />
              <Route path="/resources" element={<ResourcesPage />} />
              <Route path="/games" element={<EducationalGamesPage />} />
              <Route path="/live-data" element={<LiveDataPage />} />
              <Route path="/about" element={<AboutPage />} />
            </Routes>
          </Suspense>
        </main>
        
        <footer className="border-t py-4">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-sm text-muted-foreground">
                © {new Date().getFullYear()} Hue Digital. Bảo lưu mọi quyền.
              </div>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}
