import { motion } from "framer-motion";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Library, MapPin, MessageSquare, BarChart2, Upload, Gamepad2, 
  Ticket, BookText, Globe, History, Building, Crown, 
  Landmark, Scroll, Music, Palette, Camera
} from "lucide-react";
import { SiFacebook } from "react-icons/si";

const features = [
  {
    icon: Library,
    title: "Kho học liệu",
    description: "Truy cập kho tài liệu số hóa phong phú về di sản văn hóa Huế",
    href: "/library"
  },
  {
    icon: MapPin,
    title: "Bản đồ số",
    description: "Khám phá di tích lịch sử qua bản đồ tương tác",
    href: "/map"
  },
  {
    icon: BookText,
    title: "Diễn đàn",
    description: "Tham gia thảo luận và chia sẻ kiến thức về văn hóa Huế",
    href: "/forum"
  },
  {
    icon: BarChart2,
    title: "Dữ liệu thực",
    description: "Thông tin cập nhật về thời tiết và hoạt động du lịch",
    href: "/live-data"
  },
  {
    icon: MessageSquare,
    title: "Trò chuyện AI",
    description: "Tương tác với trí tuệ nhân tạo để tìm hiểu về Huế",
    href: "/chat"
  },
  {
    icon: Gamepad2,
    title: "Game giáo dục",
    description: "Học về văn hóa Huế qua các trò chơi tương tác",
    href: "/game"
  }
];

const highlights = [
  {
    icon: Crown,
    title: "Di sản UNESCO",
    description: "Quần thể di tích Cố đô Huế được UNESCO công nhận là Di sản Văn hóa Thế giới năm 1993"
  },
  {
    icon: Landmark,
    title: "Kinh thành Huế",
    description: "Được xây dựng từ năm 1805, là trung tâm chính trị của triều Nguyễn, với diện tích 520ha"
  },
  {
    icon: Globe,
    title: "Văn hóa độc đáo",
    description: "Nơi giao thoa của nghệ thuật cung đình và dân gian, từ ẩm thực đến âm nhạc truyền thống"
  }
];

const culturalElements = [
  {
    icon: Scroll,
    title: "Mỹ thuật cung đình",
    description: "Nghệ thuật trang trí, chạm khắc, kiến trúc cung đình đặc sắc"
  },
  {
    icon: Music,
    title: "Nhã nhạc cung đình",
    description: "Di sản văn hóa phi vật thể được UNESCO công nhận năm 2003"
  },
  {
    icon: Palette,
    title: "Nghề thủ công truyền thống",
    description: "Các nghề thủ công tinh xảo được lưu truyền qua nhiều thế hệ"
  },
  {
    icon: Camera,
    title: "Di tích lăng tẩm",
    description: "Các công trình kiến trúc độc đáo mang đậm dấu ấn văn hóa và lịch sử"
  }
];

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section with gold gradient overlay and pattern */}
      <div className="relative bg-gradient-to-b from-[#F9F5E7] to-background overflow-hidden">
        <div className="absolute inset-0 dragon-pattern opacity-20"></div>
        <div className="container mx-auto px-4 py-16 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-block mb-6">
              <div className="flex items-center justify-center w-20 h-20 mx-auto rounded-full royal-gradient p-0.5">
                <div className="flex items-center justify-center w-full h-full bg-white/90 rounded-full">
                  <Crown className="h-10 w-10 text-[#D4AF37]" />
                </div>
              </div>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Khám phá di sản văn hóa Huế
              <br />
              <span className="gold-gradient bg-clip-text text-transparent">trong thời đại số</span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8">
              Nền tảng tương tác kỹ thuật số toàn diện giúp bạn tìm hiểu, khám phá và
              bảo tồn di sản văn hóa độc đáo của cố đô Huế
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                asChild 
                size="lg" 
                className="royal-gradient text-white hover:opacity-90 imperial-border hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all duration-300"
              >
                <Link href="/library">Khám phá ngay</Link>
              </Button>
              <Button 
                asChild 
                variant="outline" 
                size="lg"
                className="border-[#D4AF37]/50 hover:border-[#D4AF37] hover:bg-[#D4AF37]/5"
              >
                <Link href="/map">Xem bản đồ</Link>
              </Button>
            </div>
          </motion.div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute -bottom-4 left-0 right-0 h-16 bg-gradient-to-b from-transparent to-background z-10"></div>
        <div className="absolute bottom-0 left-0 w-full">
          <svg viewBox="0 0 1920 250" xmlns="http://www.w3.org/2000/svg" className="fill-[#D4AF37]/10">
            <path d="M1920 250H0V0s126.707 78.536 349.975 80.05c177.852 1.203 362.805-63.874 553.803-63.874 290.517 0 383.458 57.712 603.992 61.408 220.527 3.696 412.23-71.408 412.23-71.408V250z" />
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
              Huế - kinh đô cuối cùng của Việt Nam dưới triều Nguyễn (1802-1945), là một trong những trung tâm 
              văn hóa, giáo dục và du lịch lớn của Việt Nam. Thành phố nằm bên dòng sông Hương thơ mộng, 
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
                      <h3 className="font-semibold mb-2 text-lg">{highlight.title}</h3>
                      <p className="text-sm text-muted-foreground">{highlight.description}</p>
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
                  <h3 className="font-medium mb-2 text-[#8B4513]">{element.title}</h3>
                  <p className="text-sm text-muted-foreground">{element.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        
        {/* Decorative element */}
        <div className="absolute bottom-0 left-0 w-full">
          <svg viewBox="0 0 1920 150" xmlns="http://www.w3.org/2000/svg" className="fill-background">
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
                    <p className="text-muted-foreground mb-4">{feature.description}</p>
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
          <h2 className="text-3xl font-bold mb-6">Tham gia vào hành trình khám phá</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Đóng góp vào việc bảo tồn và phát huy di sản văn hóa Huế thông qua nền tảng kỹ thuật số
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
            
            <h2 className="text-2xl font-bold mb-4 wooden-gradient bg-clip-text text-transparent">Về chúng tôi</h2>
            <p className="text-muted-foreground mb-6">
              Huế Digital được thành lập năm 2025 với sứ mệnh bảo tồn và phát huy giá trị
              di sản văn hóa Huế thông qua công nghệ số.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div className="bg-white p-4 rounded-lg border border-[#D4AF37]/20">
                <h3 className="font-semibold mb-2 text-[#8B4513]">Người sáng lập</h3>
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