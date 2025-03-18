import { motion } from "framer-motion";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Library,
  MapPin,
  MessageSquare,
  BarChart2,
  Upload,
  Gamepad2,
  Ticket,
  BookText,
  Globe,
  History,
  Building,
  Crown,
  Landmark,
  Scroll,
  Music,
  Palette,
  Camera,
} from "lucide-react";
import { SiFacebook } from "react-icons/si";

const features = [
  {
    icon: Library,
    title: "Kho học liệu",
    description: "Truy cập kho tài liệu số hóa phong phú về di sản văn hóa Huế",
    href: "/library",
  },
  {
    icon: MapPin,
    title: "Bản đồ số",
    description: "Khám phá di tích lịch sử qua bản đồ tương tác",
    href: "/map",
  },
  {
    icon: BookText,
    title: "Diễn đàn",
    description: "Tham gia thảo luận và chia sẻ kiến thức về văn hóa Huế",
    href: "/forum",
  },
  {
    icon: BarChart2,
    title: "Dữ liệu thực",
    description: "Thông tin cập nhật về thời tiết và hoạt động du lịch",
    href: "/live-data",
  },
  {
    icon: MessageSquare,
    title: "Trò chuyện AI",
    description: "Tương tác với trí tuệ nhân tạo để tìm hiểu về Huế",
    href: "/chat",
  },
  {
    icon: Gamepad2,
    title: "Game giáo dục",
    description: "Học về văn hóa Huế qua các trò chơi tương tác",
    href: "/game",
  },
];

const highlights = [
  {
    icon: Crown,
    title: "Di sản UNESCO",
    description:
      "Quần thể di tích Cố đô Huế được UNESCO công nhận là Di sản Văn hóa Thế giới năm 1993",
  },
  {
    icon: Landmark,
    title: "Kinh thành Huế",
    description:
      "Được xây dựng từ năm 1805, là trung tâm chính trị của triều Nguyễn, với diện tích 520ha",
  },
  {
    icon: Globe,
    title: "Văn hóa độc đáo",
    description:
      "Nơi giao thoa của nghệ thuật cung đình và dân gian, từ ẩm thực đến âm nhạc truyền thống",
  },
];

const culturalElements = [
  {
    icon: Scroll,
    title: "Mỹ thuật cung đình",
    description: "Nghệ thuật trang trí, chạm khắc, kiến trúc cung đình đặc sắc",
  },
  {
    icon: Music,
    title: "Nhã nhạc cung đình",
    description: "Di sản văn hóa phi vật thể được UNESCO công nhận năm 2003",
  },
  {
    icon: Palette,
    title: "Nghề thủ công truyền thống",
    description: "Các nghề thủ công tinh xảo được lưu truyền qua nhiều thế hệ",
  },
  {
    icon: Camera,
    title: "Di tích lăng tẩm",
    description:
      "Các công trình kiến trúc độc đáo mang đậm dấu ấn văn hóa và lịch sử",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section with imperial theme inspired by the reference image */}
      <div className="relative bg-[#F5E1A4] bg-[url('/bg-pattern.jpg')] bg-cover bg-center bg-opacity-50 overflow-hidden">
        {/* Imperial decorative corners */}
        <div className="absolute top-0 left-0 w-32 h-32 opacity-90">
          <svg
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full"
          >
            <path
              d="M0,0 L70,0 C50,15 35,35 30,70 L0,70 Z"
              fill="#8D6A3F"
              fillOpacity="0.15"
            />
            <path
              d="M0,0 L50,0 C40,20 20,40 15,50 L0,50 Z"
              fill="#8D6A3F"
              fillOpacity="0.25"
            />
            <circle cx="15" cy="15" r="6" fill="#9F8054" />
            <path d="M15,15 L40,5 L45,25 Z" fill="#B5935A" fillOpacity="0.5" />
          </svg>
        </div>
        <div className="absolute top-0 right-0 w-32 h-32 opacity-90 transform scale-x-[-1]">
          <svg
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full"
          >
            <path
              d="M0,0 L70,0 C50,15 35,35 30,70 L0,70 Z"
              fill="#8D6A3F"
              fillOpacity="0.15"
            />
            <path
              d="M0,0 L50,0 C40,20 20,40 15,50 L0,50 Z"
              fill="#8D6A3F"
              fillOpacity="0.25"
            />
            <circle cx="15" cy="15" r="6" fill="#9F8054" />
            <path d="M15,15 L40,5 L45,25 Z" fill="#B5935A" fillOpacity="0.5" />
          </svg>
        </div>
        <div className="absolute bottom-0 left-0 w-32 h-32 opacity-90 transform scale-y-[-1]">
          <svg
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full"
          >
            <path
              d="M0,0 L70,0 C50,15 35,35 30,70 L0,70 Z"
              fill="#8D6A3F"
              fillOpacity="0.15"
            />
            <path
              d="M0,0 L50,0 C40,20 20,40 15,50 L0,50 Z"
              fill="#8D6A3F"
              fillOpacity="0.25"
            />
            <circle cx="15" cy="15" r="6" fill="#9F8054" />
            <path d="M15,15 L40,5 L45,25 Z" fill="#B5935A" fillOpacity="0.5" />
          </svg>
        </div>
        <div className="absolute bottom-0 right-0 w-32 h-32 opacity-90 transform scale-x-[-1] scale-y-[-1]">
          <svg
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full"
          >
            <path
              d="M0,0 L70,0 C50,15 35,35 30,70 L0,70 Z"
              fill="#8D6A3F"
              fillOpacity="0.15"
            />
            <path
              d="M0,0 L50,0 C40,20 20,40 15,50 L0,50 Z"
              fill="#8D6A3F"
              fillOpacity="0.25"
            />
            <circle cx="15" cy="15" r="6" fill="#9F8054" />
            <path d="M15,15 L40,5 L45,25 Z" fill="#B5935A" fillOpacity="0.5" />
          </svg>
        </div>

        {/* Background patterns */}
        <div className="absolute inset-0 dragon-pattern opacity-20"></div>
        <div className="absolute inset-0 lotus-pattern opacity-30"></div>

        {/* Main hero content */}
        <div className="container mx-auto px-4 py-16 pt-24 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-block mb-8">
              <div className="p-2 border-2 border-[#8D6A3F] rounded-full royal-gradient shadow-lg">
                <div className="w-24 h-24 mx-auto rounded-full flex items-center justify-center bg-[#F5E1A4] p-2">
                  <img
                    src="https://i.postimg.cc/YSzbWv3P/Screenshot-17-3-2025-22521-chatgpt-com-removebg-preview.png"
                    alt="Huế Digital"
                    className="h-16 w-16"
                    onError={(e) => {
                      e.currentTarget.src = "";
                      e.currentTarget.style.display = "none";
                      document.getElementById("fallback-logo")!.style.display =
                        "block";
                    }}
                  />
                  <div
                    id="fallback-logo"
                    style={{ display: "none" }}
                    className="h-16 w-16 flex items-center justify-center"
                  >
                    <Crown className="h-16 w-16 text-[#8D6A3F]" />
                  </div>
                </div>
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight text-[#6B2B2B]">
              HUẾ DIGITAL
              <div className="w-full h-1 my-2 bg-gradient-to-r from-transparent via-[#9F8054] to-transparent"></div>
              <span className="text-3xl md:text-4xl block mt-2 text-[#8D6A3F]">
                Di sản văn hóa cố đô
              </span>
            </h1>

            <p className="text-xl text-[#6D4C41] mb-8 max-w-2xl mx-auto">
              Nền tảng tương tác kỹ thuật số toàn diện giúp bạn tìm hiểu, khám
              phá và bảo tồn di sản văn hóa độc đáo của cố đô Huế
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="royal-gradient text-white hover:opacity-90 imperial-border hover:shadow-[0_0_20px_rgba(181,147,90,0.4)] transition-all duration-300"
              >
                <Link href="/library">Khám phá ngay</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-[#8D6A3F] hover:border-[#8D6A3F] hover:bg-[#8D6A3F]/5 text-[#6B2B2B]"
              >
                <Link href="/map">Xem bản đồ</Link>
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Wave decorative element */}
        <div className="absolute -bottom-1 left-0 right-0">
          <svg
            viewBox="0 0 1440 120"
            xmlns="http://www.w3.org/2000/svg"
            className="fill-background w-full"
          >
            <path d="M0,64 C288,89.3 576,97.3 864,88 C1152,78.7 1296,53.3 1440,12L1440,120L0,120Z" />
          </svg>
        </div>
      </div>

      {/* Introduction Section with imperial pattern */}
      <div className="bg-background relative">
        <div className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-3xl font-bold mb-6 gold-gradient bg-clip-text text-transparent inline-block">
              Về Cố đô Huế
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Huế - kinh đô cuối cùng của Việt Nam dưới triều Nguyễn
              (1802-1945), là một trong những trung tâm văn hóa, giáo dục và du
              lịch lớn của Việt Nam. Thành phố nằm bên dòng sông Hương thơ mộng,
              với hệ thống di tích lịch sử, văn hóa phong phú và đa dạng.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              {highlights.map((highlight, index) => (
                <motion.div
                  key={highlight.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  <Card className="imperial-card h-full">
                    <CardContent className="pt-6">
                      <div className="w-16 h-16 mx-auto mb-4 royal-gradient rounded-full flex items-center justify-center">
                        <highlight.icon className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="font-semibold mb-2 text-lg">
                        {highlight.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {highlight.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Cultural Elements Section with wooden background */}
      <div className="bg-[#FBF7EF] relative py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-10 text-center wooden-gradient bg-clip-text text-transparent">
            Di sản văn hóa đặc sắc
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {culturalElements.map((element, index) => (
              <motion.div
                key={element.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className="hover-scale"
              >
                <div className="bg-white rounded-lg p-6 shadow-md border border-[#D4AF37]/10 h-full flex flex-col items-center text-center">
                  <div className="w-14 h-14 wooden-gradient rounded-full flex items-center justify-center mb-4">
                    <element.icon className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="font-medium mb-2 text-[#8B4513]">
                    {element.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {element.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Decorative element */}
        <div className="absolute bottom-0 left-0 w-full">
          <svg
            viewBox="0 0 1920 150"
            xmlns="http://www.w3.org/2000/svg"
            className="fill-background"
          >
            <path d="M0,150 L1920,150 L1920,75 C1653,107 1352,40 1215,25 C1000,0 818,72 600,75 C382,78 250,22 0,91 L0,150 Z" />
          </svg>
        </div>
      </div>

      {/* Features Grid with imperial pattern background */}
      <div className="relative bg-background py-16">
        <div className="absolute inset-0 dragon-pattern opacity-10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <h2 className="text-3xl font-bold mb-10 text-center gold-gradient bg-clip-text text-transparent">
            Khám phá nền tảng
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="imperial-card hover-scale h-full">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 royal-gradient rounded-full flex items-center justify-center flex-shrink-0">
                        <feature.icon className="h-5 w-5 text-white" />
                      </div>
                      <CardTitle>{feature.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      {feature.description}
                    </p>
                    <Button
                      asChild
                      variant="link"
                      className="p-0 text-[#D4AF37] hover:text-[#BF953F] font-medium"
                    >
                      <Link href={feature.href}>Khám phá thêm →</Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="royal-gradient text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Tham gia vào hành trình khám phá
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Đóng góp vào việc bảo tồn và phát huy di sản văn hóa Huế thông qua
            nền tảng kỹ thuật số
          </p>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 hover:border-white/30 royal-shadow"
          >
            <Link href="/contribute">Đóng góp ngay</Link>
          </Button>
        </div>
      </div>

      {/* Footer with imperial decoration */}
      <footer className="bg-[#FBF7EF] pt-16 pb-8 relative">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block mb-6">
              <div className="w-16 h-16 mx-auto royal-gradient rounded-full flex items-center justify-center">
                <Crown className="h-8 w-8 text-white" />
              </div>
            </div>

            <h2 className="text-2xl font-bold mb-4 wooden-gradient bg-clip-text text-transparent">
              Về chúng tôi
            </h2>
            <p className="text-muted-foreground mb-6">
              Huế Digital được thành lập năm 2025 với sứ mệnh bảo tồn và phát
              huy giá trị di sản văn hóa Huế thông qua công nghệ số.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div className="bg-white p-4 rounded-lg border border-[#D4AF37]/20">
                <h3 className="font-semibold mb-2 text-[#8B4513]">
                  Người sáng lập
                </h3>
                <p>Phan Xuân Dương</p>
                <p>Nguyễn Thị Diệu Nghiêm</p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-[#D4AF37]/20">
                <h3 className="font-semibold mb-2 text-[#8B4513]">Liên hệ</h3>
                <p>
                  <a
                    href="mailto:pxuanduong2703@gmail.com"
                    className="text-[#D4AF37] hover:underline hover:text-[#BF953F]"
                  >
                    pxuanduong2703@gmail.com
                  </a>
                </p>
                <p>
                  <a
                    href="https://www.facebook.com/duong.phan2703"
                    className="text-[#D4AF37] hover:underline hover:text-[#BF953F] inline-flex items-center gap-1"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <SiFacebook className="h-4 w-4" />
                    Facebook
                  </a>
                </p>
              </div>
            </div>

            <div className="text-sm text-[#8B4513]/70 pt-6 border-t border-[#D4AF37]/20">
              <p>© 2025 Huế Digital. Bảo lưu mọi quyền.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
