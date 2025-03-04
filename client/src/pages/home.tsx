import { motion } from "framer-motion";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Library, MapPin, MessageSquare, BarChart2, Upload, Gamepad2, Ticket, BookText, Globe, History, Building } from "lucide-react";
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
    icon: History,
    title: "Di sản UNESCO",
    description: "Quần thể di tích Cố đô Huế được UNESCO công nhận là Di sản Văn hóa Thế giới năm 1993"
  },
  {
    icon: Building,
    title: "Kinh thành Huế",
    description: "Được xây dựng từ năm 1805, là trung tâm chính trị của triều Nguyễn, với diện tích 520ha"
  },
  {
    icon: Globe,
    title: "Văn hóa độc đáo",
    description: "Nơi giao thoa của nghệ thuật cung đình và dân gian, từ ẩm thực đến âm nhạc truyền thống"
  }
];

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-3xl mx-auto mb-16"
      >
        <h1 className="text-4xl font-bold mb-4">
          Khám phá di sản văn hóa Huế
          <br />
          <span className="text-primary">trong thời đại số</span>
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          Nền tảng tương tác kỹ thuật số toàn diện giúp bạn tìm hiểu, khám phá và
          bảo tồn di sản văn hóa độc đáo của cố đô Huế
        </p>
        <div className="flex gap-4 justify-center">
          <Button asChild size="lg">
            <Link href="/library">Khám phá ngay</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/map">Xem bản đồ</Link>
          </Button>
        </div>
      </motion.div>

      {/* Introduction Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="max-w-4xl mx-auto mb-16 text-center"
      >
        <h2 className="text-3xl font-bold mb-6">Về Cố đô Huế</h2>
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
              <Card className="text-center">
                <CardContent className="pt-6">
                  <highlight.icon className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">{highlight.title}</h3>
                  <p className="text-sm text-muted-foreground">{highlight.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <feature.icon className="h-8 w-8 text-primary mb-2" />
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{feature.description}</p>
                <Button asChild variant="link" className="mt-4 p-0">
                  <Link href={feature.href}>Khám phá thêm →</Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Footer */}
      <footer className="border-t pt-8 mt-16">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">Về chúng tôi</h2>
          <p className="text-muted-foreground mb-6">
            Huế Digital được thành lập năm 2025 với sứ mệnh bảo tồn và phát huy giá trị
            di sản văn hóa Huế thông qua công nghệ số.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div>
              <h3 className="font-semibold mb-2">Người sáng lập</h3>
              <p>Phan Xuân Dương</p>
              <p>Nguyễn Thị Diệu Nghiêm</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Liên hệ</h3>
              <p>
                <a 
                  href="mailto:pxuanduong2703@gmail.com"
                  className="text-primary hover:underline"
                >
                  pxuanduong2703@gmail.com
                </a>
              </p>
              <p>
                <a 
                  href="https://www.facebook.com/duong.phan2703"
                  className="text-primary hover:underline inline-flex items-center gap-1"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <SiFacebook className="h-4 w-4" />
                  Facebook
                </a>
              </p>
            </div>
          </div>

          <div className="text-sm text-muted-foreground">
            <p>© 2025 Huế Digital. Bảo lưu mọi quyền.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}