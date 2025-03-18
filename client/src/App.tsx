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
} from "@/components/ui/navigation-menu";
import {
  GraduationCap,
  MapPin,
  Users,
  MessageSquare,
  ChevronUp,
  Library,
  Gamepad2,
  MapPinned,
  Cloud,
  Ticket,
  MessageCircle,
  Upload,
  BookText,
  Crown,
  Utensils,
  Box,
} from "lucide-react";

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
import CulinaryPage from "@/pages/culinary";
import ExhibitionPage from "@/pages/exhibition-new";
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
      {
        icon: <Box className="h-4 w-4" />,
        title: "Triển lãm 3D/AR",
        href: "/exhibition",
        description:
          "Trải nghiệm di sản Huế qua mô hình 3D và công nghệ thực tế ảo tăng cường",
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
        title: "Đặt dịch vụ",
        href: "/ticket",
        description: "Đặt vé tham quan, quà lưu niệm và dịch vụ xe du lịch",
      },
      {
        icon: <Utensils className="h-4 w-4" />,
        title: "Ẩm thực Huế",
        href: "/culinary",
        description: "Khám phá ẩm thực đặc sắc và lịch sử ẩm thực Huế",
      },
    ],
  },
  contribute: {
    icon: <Upload className="h-4 w-4" />,
    label: "Đóng góp",
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
      {
        icon: <Users className="h-4 w-4" />,
        title: "Cộng đồng Facebook",
        href: "https://www.facebook.com/groups/618595794333990",
        description: "Tham gia nhóm cộng đồng trên Facebook",
        external: true,
      },
    ],
  },
};

function MainNav() {
  const [, setLocation] = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#F5E1A4]/95 backdrop-blur-md shadow-md border-b border-[#8D6A3F]/30"
          : "bg-transparent"
      }`}
    >
      {/* Imperial decorative header patterns */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#8D6A3F] via-[#C49A44] to-[#8D6A3F]"></div>

      <nav className="container mx-auto">
        <div className="flex h-16 items-center px-4">
          <Link href="/" className="flex items-center gap-2 group relative">
            <div className="w-10 h-10 royal-gradient rounded-full flex items-center justify-center transition-all duration-300 group-hover:shadow-[0_0_15px_rgba(196,154,68,0.5)]">
              <img
                src="https://i.postimg.cc/YSzbWv3P/Screenshot-17-3-2025-22521-chatgpt-com-removebg-preview.png"
                alt="Huế Digital"
                className="h-7 w-7 transition-transform duration-300 group-hover:scale-110"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-[#6B2B2B] transition-colors duration-300 group-hover:text-[#9F8054]">
                Huế Digital
              </span>
              <span className="text-xs text-[#8D6A3F] -mt-1">
                Di sản trong tay bạn
              </span>
            </div>

            {/* Decorative hover effect */}
            <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#C49A44] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
          </Link>

          <NavigationMenu className="ml-8 hidden md:block">
            <NavigationMenuList className="gap-1">
              {Object.entries(navigationItems).map(([key, section]) => (
                <NavigationMenuItem key={key}>
                  <NavigationMenuTrigger
                    className="h-10 px-4 font-medium hover:text-[#6B2B2B] data-[state=open]:text-[#6B2B2B] transition-all
                             data-[state=open]:bg-[#C49A44]/10 hover:bg-[#C49A44]/5 rounded-md group"
                  >
                    <div className="flex items-center gap-2 relative">
                      <div className="text-[#8D6A3F] group-hover:text-[#6B2B2B] group-data-[state=open]:text-[#6B2B2B] transition-colors">
                        {section.icon}
                      </div>
                      <span className="transition-all">{section.label}</span>

                      {/* Decorative underline that shows on hover */}
                      <div
                        className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#8D6A3F] transform scale-x-0
                                      group-hover:scale-x-100 group-data-[state=open]:scale-x-100
                                      transition-transform duration-300 origin-left"
                      ></div>
                    </div>
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="w-[500px] p-5 bg-[#F5E1A4]/95 backdrop-blur-md border border-[#8D6A3F]/20 rounded-lg shadow-lg">
                      <div className="mb-4 pb-3 border-b border-[#8D6A3F]/20">
                        <h4 className="text-[#6B2B2B] font-medium">
                          {section.label}
                        </h4>
                        <p className="text-sm text-[#6D4C41]">
                          {section.description}
                        </p>
                      </div>
                      <div className="grid gap-3 md:grid-cols-2">
                        {section.items.map((item, idx) => (
                          item.external ? (
                            <a 
                              key={item.href} 
                              href={item.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none
                                        transition-all hover:bg-[#8D6A3F]/10 hover:border-[#8D6A3F]/20
                                        hover:shadow-md hover:text-[#6B2B2B] imperial-card group animate-fade-in"
                              style={{ animationDelay: `${idx * 50}ms` }}
                            >
                              <div className="flex items-center gap-2">
                                <div
                                  className="w-8 h-8 rounded-full bg-[#C49A44]/10 flex items-center justify-center
                                             group-hover:bg-[#8D6A3F]/20 transition-colors"
                                >
                                  <div className="text-[#8D6A3F] group-hover:text-[#6B2B2B] transition-colors">
                                    {item.icon}
                                  </div>
                                </div>
                                <span className="text-sm font-medium leading-none group-hover:text-[#6B2B2B]">
                                  {item.title}
                                </span>
                              </div>
                              <p className="line-clamp-2 text-sm leading-snug text-[#6D4C41] mt-2 group-hover:text-[#6D4C41]/90">
                                {item.description}
                              </p>
                            </a>
                          ) : (
                            <Link key={item.href} href={item.href}>
                              <NavigationMenuLink asChild>
                                <a
                                  className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none
                                              transition-all hover:bg-[#8D6A3F]/10 hover:border-[#8D6A3F]/20
                                              hover:shadow-md hover:text-[#6B2B2B] imperial-card group animate-fade-in"
                                  style={{ animationDelay: `${idx * 50}ms` }}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    setLocation(item.href);
                                  }}
                                >
                                  <div className="flex items-center gap-2">
                                    <div
                                      className="w-8 h-8 rounded-full bg-[#C49A44]/10 flex items-center justify-center
                                                   group-hover:bg-[#8D6A3F]/20 transition-colors"
                                    >
                                      <div className="text-[#8D6A3F] group-hover:text-[#6B2B2B] transition-colors">
                                        {item.icon}
                                      </div>
                                    </div>
                                    <span className="text-sm font-medium leading-none group-hover:text-[#6B2B2B]">
                                      {item.title}
                                    </span>
                                  </div>
                                  <p className="line-clamp-2 text-sm leading-snug text-[#6D4C41] mt-2 group-hover:text-[#6D4C41]/90">
                                    {item.description}
                                  </p>
                                </a>
                              </NavigationMenuLink>
                            </Link>
                          )
                        ))}
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>

          <div className="ml-auto flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              className="text-[#8D6A3F] hover:text-[#6B2B2B] hover:bg-[#C49A44]/10 hidden sm:flex transition-all"
              onClick={() => setLocation("/contribute")}
            >
              <Upload className="h-4 w-4 mr-1.5" />
              Đóng góp
            </Button>
            <Button
              size="sm"
              className="royal-gradient text-white hover:opacity-90 transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5"
              onClick={() => setLocation("/library")}
            >
              <Library className="h-4 w-4 mr-1.5" />
              Khám phá
            </Button>
          </div>
        </div>
      </nav>

      {/* Decorative element - imperial pattern line */}
      <div className="relative h-1">
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#8D6A3F]/30 to-transparent"></div>
        <div className="absolute bottom-0 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-transparent via-[#6B2B2B]/20 to-transparent"></div>
      </div>
    </header>
  );
}

function ChatButton() {
  const [, setLocation] = useLocation();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div
        className={`absolute inset-0 bg-[#8D6A3F]/10 rounded-full transition-all duration-500 ease-in-out ${
          isHovered ? "scale-[2.5] opacity-100" : "scale-0 opacity-0"
        }`}
      />
      <Button
        variant="outline"
        size="icon"
        className="rounded-full bg-background-soft backdrop-blur-sm border-[#8D6A3F]/30 shadow-lg
                 hover:border-[#8D6A3F] hover:bg-background hover:-translate-y-1
                 transition-all duration-300 w-12 h-12 group"
        onClick={() => setLocation("/chat")}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="absolute inset-0 rounded-full royal-gradient opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
        <div className="relative h-full w-full flex items-center justify-center">
          <div className="absolute w-8 h-8 rounded-full bg-[#8D6A3F]/10 animate-ping opacity-70"></div>
          <MessageSquare className="h-5 w-5 text-[#8D6A3F] relative z-10 group-hover:text-[#6B2B2B] transition-colors" />
        </div>
      </Button>
    </div>
  );
}

function BackToTop() {
  const [show, setShow] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShow(window.scrollY > 200);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="fixed bottom-6 right-24 z-50">
      <div
        className={`absolute inset-0 bg-[#C49A44]/10 rounded-full transition-all duration-500 ease-in-out ${
          isHovered ? "scale-[2.5] opacity-100" : "scale-0 opacity-0"
        }`}
      />

      <Button
        variant="outline"
        size="icon"
        className={cn(
          "rounded-full bg-[#F5E1A4]/90 backdrop-blur-sm border-[#8D6A3F]/30 shadow-lg hover:border-[#8D6A3F] hover:bg-[#F5E1A4] hover:-translate-y-1 transition-all duration-500 w-12 h-12 group",
          show
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-10 pointer-events-none",
        )}
        onClick={scrollToTop}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="absolute inset-0 rounded-full royal-gradient opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
        <ChevronUp className="h-5 w-5 text-[#8D6A3F] group-hover:text-[#6B2B2B] transition-colors" />

        {/* Small animated arrow to hint at scroll action */}
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-1 h-3 bg-[#8D6A3F] rounded-full animate-bounce"></div>
        </div>
      </Button>
    </div>
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
      <Route path="/culinary" component={CulinaryPage} />
      <Route path="/exhibition" component={ExhibitionPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen">
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