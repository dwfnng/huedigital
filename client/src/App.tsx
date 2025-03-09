import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "wouter";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import {
  GraduationCap, MapPin, Users, MessageSquare,
  ChevronUp, Library, Gamepad2,
  MapPinned, Cloud, Ticket,
  MessageCircle, Upload, BookText
} from 'lucide-react';

// Pages
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
import ParticleBackground from "@/components/ParticleBackground";

// Optimized navigation structure
const navigationItems = {
  education: {
    icon: <GraduationCap className="h-4 w-4" />,
    label: "Giáo dục",
    description: "Khám phá và học hỏi về di sản văn hóa Huế",
    items: [
      {
        icon: <Library className="h-4 w-4" />,
        title: "Kho học liệu số",
        href: "/library",
        description: "Tài liệu đa phương tiện về văn hóa và lịch sử Huế",
      },
      {
        icon: <Gamepad2 className="h-4 w-4" />,
        title: "Game giáo dục",
        href: "/game",
        description: "Học qua các trò chơi tương tác",
      },
    ],
  },
  tourism: {
    icon: <MapPin className="h-4 w-4" />,
    label: "Du lịch",
    description: "Khám phá Huế qua công nghệ số",
    items: [
      {
        icon: <MapPinned className="h-4 w-4" />,
        title: "Bản đồ số",
        href: "/map",
        description: "Khám phá Huế qua bản đồ tương tác",
      },
      {
        icon: <Cloud className="h-4 w-4" />,
        title: "Dữ liệu thực",
        href: "/live-data",
        description: "Thông tin thời tiết và dữ liệu du lịch",
      },
      {
        icon: <Ticket className="h-4 w-4" />,
        title: "Đặt vé",
        href: "/ticket",
        description: "Mua vé tham quan các điểm di tích",
      },
    ],
  },
  community: {
    icon: <Users className="h-4 w-4" />,
    label: "Cộng đồng",
    description: "Tham gia và đóng góp cùng cộng đồng",
    items: [
      {
        icon: <BookText className="h-4 w-4" />,
        title: "Diễn đàn",
        href: "/forum",
        description: "Thảo luận và chia sẻ về văn hóa Huế",
      },
      {
        icon: <Upload className="h-4 w-4" />,
        title: "Đóng góp",
        href: "/contribute",
        description: "Đóng góp tài liệu và hình ảnh",
      },
    ],
  },
};

function MainNav() {
  const [, setLocation] = useLocation();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b">
      <nav className="container mx-auto">
        <div className="flex h-16 items-center px-4 justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
              Huế Digital
            </span>
          </Link>

          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              {Object.entries(navigationItems).map(([key, section]) => (
                <NavigationMenuItem key={key}>
                  <NavigationMenuTrigger className="h-9">
                    {section.icon}
                    <span className="ml-2">{section.label}</span>
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="w-[600px] p-6">
                      <div className="mb-4">
                        <p className="text-sm text-muted-foreground">{section.description}</p>
                      </div>
                      <div className="grid gap-4 md:grid-cols-2">
                        {section.items.map((item) => (
                          <Link key={item.href} href={item.href}>
                            <NavigationMenuLink asChild>
                              <a
                                className="block select-none space-y-1 rounded-md p-4 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                                onClick={(e) => {
                                  e.preventDefault();
                                  setLocation(item.href);
                                }}
                              >
                                <div className="flex items-center gap-2">
                                  {item.icon}
                                  <span className="text-sm font-medium leading-none">{item.title}</span>
                                </div>
                                <p className="line-clamp-2 text-sm leading-snug text-muted-foreground mt-2">
                                  {item.description}
                                </p>
                              </a>
                            </NavigationMenuLink>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>

          {/* Mobile Menu */}
          <Button
            variant="outline"
            size="icon"
            className="md:hidden"
            onClick={() => setLocation("/mobile-menu")}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
          </Button>
        </div>
      </nav>
    </header>
  );
}

function ChatButton() {
  const [, setLocation] = useLocation();

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      <Button
        variant="outline"
        size="icon"
        className="rounded-full shadow-lg hover:shadow-xl transition-all duration-200 bg-background/80 backdrop-blur-sm"
        onClick={() => setLocation("/chat")}
      >
        <MessageSquare className="h-5 w-5" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="rounded-full shadow-lg hover:shadow-xl transition-all duration-200 bg-background/80 backdrop-blur-sm"
        onClick={() => window.open('tel:+84234123456')}
      >
        <MessageCircle className="h-5 w-5" />
      </Button>
    </div>
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
        "fixed bottom-4 right-24 z-50 rounded-full transition-all duration-300 bg-background/80 backdrop-blur-sm",
        show ? "opacity-100" : "opacity-0 pointer-events-none"
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
      <div className="min-h-screen bg-background relative">
        <div className="absolute inset-0 z-0">
          <ParticleBackground />
          <div
            className="absolute inset-0 bg-[url('/images/hue-bg.jpg')] bg-cover bg-center opacity-10"
            style={{ backgroundBlendMode: 'overlay' }}
          />
        </div>
        <MainNav />
        <main className="relative z-10 pt-20 pb-6 fade-in container mx-auto px-4">
          <Router />
        </main>
        <BackToTop />
        <ChatButton />
      </div>
      <Toaster />
    </QueryClientProvider>
  );
}