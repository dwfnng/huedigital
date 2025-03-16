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
  MessageCircle, Upload, BookText,
  Crown
} from 'lucide-react';

// Pages
import Home from "@/pages/home";
import Chat from "@/pages/chat";
import MapPage from "@/pages/Map";
import GamePage from "@/pages/game";
import ForumPage from "@/pages/forum";
import DigitalLibrary from "@/pages/DigitalLibrary";
import TicketPage from "@/pages/ticket";
import ContributePage from "@/pages/contribute";
import LiveDataPage from "@/pages/live-data";
import NotFound from "@/pages/not-found";
import { useState, useEffect } from "react";

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
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md shadow-sm border-b border-[#B5935A]/15">
      <nav className="container mx-auto">
        <div className="flex h-16 items-center px-4">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 royal-gradient rounded-full flex items-center justify-center transition-all duration-300 group-hover:shadow-[0_0_10px_rgba(181,147,90,0.3)]">
              <Crown className="h-4 w-4 text-white" />
            </div>
            <span className="text-xl font-bold text-[#B5935A] transition-colors duration-300 group-hover:text-[#9F8054]">
              Huế Digital
            </span>
          </Link>

          <NavigationMenu className="ml-8 hidden md:block">
            <NavigationMenuList>
              {Object.entries(navigationItems).map(([key, section]) => (
                <NavigationMenuItem key={key}>
                  <NavigationMenuTrigger className="h-9 hover:text-[#B5935A] data-[state=open]:text-[#B5935A] transition-colors">
                    {section.icon}
                    <span className="ml-2">{section.label}</span>
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="w-[500px] p-4 bg-background/95 backdrop-blur-md border border-[#B5935A]/15 rounded-lg shadow-md">
                      <div className="mb-3">
                        <p className="text-sm text-muted-foreground">{section.description}</p>
                      </div>
                      <div className="grid gap-3 md:grid-cols-2">
                        {section.items.map((item) => (
                          <Link key={item.href} href={item.href}>
                            <NavigationMenuLink asChild>
                              <a
                                className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-all hover:bg-[#B5935A]/5 hover:border-[#B5935A]/15 hover:shadow-sm hover:text-[#B5935A]"
                                onClick={(e) => {
                                  e.preventDefault();
                                  setLocation(item.href);
                                }}
                              >
                                <div className="flex items-center gap-2">
                                  <div className="text-[#B5935A]">{item.icon}</div>
                                  <span className="text-sm font-medium leading-none">{item.title}</span>
                                </div>
                                <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
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
          
          <div className="ml-auto flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm"
              className="text-[#B5935A] hover:text-[#9F8054] hover:bg-[#B5935A]/5 hidden sm:flex"
              onClick={() => setLocation("/contribute")}
            >
              <Upload className="h-4 w-4 mr-1" />
              Đóng góp
            </Button>
            <Button 
              size="sm"
              className="royal-gradient text-white hover:opacity-90 transition-all duration-300"
              onClick={() => setLocation("/library")}
            >
              Khám phá
            </Button>
          </div>
        </div>
      </nav>
      
      {/* Decorative element - thin gold line */}
      <div className="h-0.5 bg-gradient-to-r from-transparent via-[#B5935A]/25 to-transparent"></div>
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
        className="rounded-full royal-shadow border-[#B5935A]/20 bg-background/80 backdrop-blur-sm hover:border-[#B5935A]/40 hover:bg-[#B5935A]/5 transition-all duration-300 soft-glow"
        onClick={() => setLocation("/chat")}
      >
        <MessageSquare className="h-5 w-5 text-[#B5935A]" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="rounded-full royal-shadow border-[#B5935A]/20 bg-background/80 backdrop-blur-sm hover:border-[#B5935A]/40 hover:bg-[#B5935A]/5 transition-all duration-300 soft-glow"
        onClick={() => window.open('tel:+84234123456')}
      >
        <MessageCircle className="h-5 w-5 text-[#B5935A]" />
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
        "fixed bottom-4 right-24 z-50 rounded-full royal-shadow border-[#B5935A]/20 bg-background/80 backdrop-blur-sm hover:border-[#B5935A]/40 hover:bg-[#B5935A]/5 transition-all duration-300 soft-glow",
        show ? "opacity-100" : "opacity-0 pointer-events-none"
      )}
      onClick={scrollToTop}
    >
      <ChevronUp className="h-4 w-4 text-[#B5935A]" />
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
        <ChatButton />
      </div>
      <Toaster />
    </QueryClientProvider>
  );
}