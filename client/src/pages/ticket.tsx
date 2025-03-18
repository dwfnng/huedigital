import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { motion } from "framer-motion";
import {
  Ticket,
  Gift,
  Star,
  ArrowUpRight,
  Info,
  Car,
  Calendar,
  Map,
  MapPin,
  Clock,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

function TicketCard({
  title,
  price,
  description,
  imageSrc,
}: {
  title: string;
  price: string;
  description: string;
  imageSrc: string;
}) {
  return (
    <motion.div variants={fadeIn} initial="hidden" animate="visible">
      <Card className="overflow-hidden transition-all hover:shadow-lg">
        <div className="relative h-48">
          <img
            src={imageSrc}
            alt={title}
            className="w-full h-full object-cover"
            onError={(e) => {
              const imgEl = e.currentTarget;
              imgEl.src = "/images/placeholder-ticket.jpg";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 p-4 text-white">
            <h3 className="text-lg font-semibold mb-1">{title}</h3>
            <p className="text-2xl font-bold">{price}</p>
          </div>
        </div>
        <CardContent className="p-4">
          <p className="text-sm text-muted-foreground mb-4">{description}</p>
          <Button
            className="w-full"
            onClick={() => {
              // Since we don't have a real booking system yet, show a message
              toast({
                title: "Thông báo",
                description: "Tính năng đặt vé sẽ sớm được ra mắt!",
                duration: 3000,
              });
            }}
          >
            <Ticket className="mr-2 h-4 w-4" />
            Đặt vé
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function SouvenirCard({
  name,
  price,
  image,
  description,
}: {
  name: string;
  price: string;
  image: string;
  description: string;
}) {
  return (
    <motion.div variants={fadeIn} initial="hidden" animate="visible">
      <Card className="overflow-hidden transition-all hover:shadow-lg">
        <div className="relative h-48">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover"
            onError={(e) => {
              const imgEl = e.currentTarget;
              imgEl.src = "/images/placeholder-souvenir.jpg";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 p-4 text-white">
            <p className="text-2xl font-bold">{price}</p>
          </div>
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold mb-2">{name}</h3>
          <p className="text-sm text-muted-foreground mb-4">{description}</p>
          <Button
            className="w-full"
            variant="secondary"
            onClick={() => {
              toast({
                title: "Thông báo",
                description: "Tính năng mua sắm sẽ sớm được ra mắt!",
                duration: 3000,
              });
            }}
          >
            <Gift className="mr-2 h-4 w-4" />
            Mua ngay
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Component cho card dịch vụ xe
function CarServiceCard({
  title,
  price,
  description,
  imageSrc,
  carType,
}: {
  title: string;
  price: string;
  description: string;
  imageSrc: string;
  carType: string;
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <motion.div variants={fadeIn} initial="hidden" animate="visible">
      <Card className="overflow-hidden transition-all hover:shadow-lg enhanced-card">
        <div className="relative h-48">
          <img
            src={imageSrc}
            alt={title}
            className="w-full h-full object-cover"
            onError={(e) => {
              const imgEl = e.currentTarget;
              imgEl.src = "/images/placeholder-car.jpg";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 p-4 text-white">
            <h3 className="text-lg font-semibold mb-1">{title}</h3>
            <p className="text-2xl font-bold">{price}</p>
          </div>
        </div>
        <CardContent className="p-4">
          <p className="text-sm text-muted-foreground mb-4">{description}</p>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full">
                <Car className="mr-2 h-4 w-4" />
                Đặt xe
              </Button>
            </DialogTrigger>
            <DialogContent className="dialog-gradient sm:max-w-[450px]">
              <DialogHeader className="dialog-header rounded-lg p-3 mb-3">
                <DialogTitle>Đặt xe {title}</DialogTitle>
                <DialogDescription>
                  Điền thông tin để đặt xe tham quan các điểm di tích tại Huế
                </DialogDescription>
              </DialogHeader>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setIsDialogOpen(false);
                  toast({
                    title: "Đặt xe thành công",
                    description:
                      "Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất!",
                    duration: 3000,
                  });
                }}
                className="space-y-4"
              >
                <div className="space-y-2 content-section rounded-lg p-4">
                  <Label htmlFor="fullname">Họ và tên</Label>
                  <Input
                    id="fullname"
                    required
                    placeholder="Nhập họ và tên..."
                    className="enhanced-input"
                  />
                </div>

                <div className="space-y-2 content-section rounded-lg p-4">
                  <Label htmlFor="phone">Số điện thoại</Label>
                  <Input
                    id="phone"
                    required
                    placeholder="Nhập số điện thoại..."
                    className="enhanced-input"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2 content-section rounded-lg p-4">
                    <Label htmlFor="pickup-date">Ngày đón</Label>
                    <div className="flex items-center">
                      <Input
                        id="pickup-date"
                        type="date"
                        required
                        className="enhanced-input"
                      />
                      <Calendar className="ml-2 h-5 w-5 text-amber-700" />
                    </div>
                  </div>

                  <div className="space-y-2 content-section rounded-lg p-4">
                    <Label htmlFor="pickup-time">Giờ đón</Label>
                    <div className="flex items-center">
                      <Input
                        id="pickup-time"
                        type="time"
                        required
                        className="enhanced-input"
                      />
                      <Clock className="ml-2 h-5 w-5 text-amber-700" />
                    </div>
                  </div>
                </div>

                <div className="space-y-2 content-section rounded-lg p-4">
                  <Label htmlFor="pickup-location">Địa điểm đón</Label>
                  <div className="flex items-center">
                    <Input
                      id="pickup-location"
                      required
                      placeholder="Nhập địa điểm đón..."
                      className="enhanced-input"
                    />
                    <MapPin className="ml-2 h-5 w-5 text-amber-700" />
                  </div>
                </div>

                <div className="space-y-2 content-section rounded-lg p-4">
                  <Label htmlFor="destinations">Các điểm đến</Label>
                  <div className="flex items-center">
                    <Input
                      id="destinations"
                      required
                      placeholder="Ví dụ: Đại Nội, Lăng Tự Đức, Chùa Thiên Mụ..."
                      className="enhanced-input"
                    />
                    <Map className="ml-2 h-5 w-5 text-amber-700" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Liệt kê các điểm di tích bạn muốn tham quan
                  </p>
                </div>

                <div className="flex justify-end gap-2 content-section rounded-lg p-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Hủy
                  </Button>
                  <Button type="submit" className="royal-button">
                    Xác nhận
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function TicketPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <div className="page-header mb-8">
          <div className="page-header-content">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <div className="bg-[#B5935A] text-black p-6 rounded-lg mb-6 shadow-md">
                <h1 className="text-3xl font-bold mb-3">Đặt vé & Dịch vụ</h1>
                <p className="text-black/90 max-w-2xl mx-auto">
                  Trải nghiệm văn hóa Huế qua các gói tham quan độc đáo, dịch vụ
                  xe và bộ sưu tập quà lưu niệm đặc trưng
                </p>
              </div>
            </motion.div>
          </div>
        </div>

        <motion.div
          className="bg-primary/5 rounded-lg p-6 mb-8 border"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-4">
            <Star className="h-6 w-6 text-primary" />
            <div>
              <h2 className="text-xl font-semibold mb-1">
                Chương trình thành viên
              </h2>
              <p className="text-sm text-muted-foreground">
                Tích điểm qua mỗi lần đặt vé để nhận ưu đãi hấp dẫn. Điểm tích
                lũy của bạn:{" "}
                <span className="font-semibold text-primary">100 điểm</span>
              </p>
            </div>
          </div>
        </motion.div>

        <Tabs defaultValue="tickets" className="space-y-8">
          <TabsList className="w-full border p-1">
            <TabsTrigger value="tickets" className="flex-1">
              <Ticket className="h-4 w-4 mr-2" />
              Vé tham quan
            </TabsTrigger>
            <TabsTrigger value="car" className="flex-1">
              <Car className="h-4 w-4 mr-2" />
              Dịch vụ xe
            </TabsTrigger>
            <TabsTrigger value="souvenirs" className="flex-1">
              <Gift className="h-4 w-4 mr-2" />
              Quà lưu niệm
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tickets" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <TicketCard
                title="Vé tham quan Đại Nội"
                price="200.000đ"
                description="Khám phá kiến trúc độc đáo của Hoàng thành Huế, nơi lưu giữ những giá trị lịch sử và văn hóa của triều Nguyễn"
                imageSrc="https://statics.vinpearl.com/dai-noi-hue-1_1690354434.jpg"
              />
              <TicketCard
                title="Vé tham quan Lăng Tự Đức"
                price="150.000đ"
                description="Chiêm ngưỡng quần thể kiến trúc tráng lệ của lăng Tự Đức, một trong những công trình đẹp nhất của kiến trúc cung đình Huế"
                imageSrc="https://disantrangan.vn/wp-content/uploads/2021/11/lang_tu_duc_hue-03.jpg"
              />
              <TicketCard
                title="Combo 3 điểm tham quan"
                price="400.000đ"
                description="Trọn gói tham quan Đại Nội, Lăng Tự Đức và Lăng Minh Mạng với giá ưu đãi"
                imageSrc="https://th.bing.com/th/id/OIP.SJk9D7DNvwWk_JwZLxgOmAHaFI?rs=1&pid=ImgDetMain"
              />
              <TicketCard
                title="Vé xem biểu diễn Nhã nhạc"
                price="300.000đ"
                description="Thưởng thức nghệ thuật Nhã nhạc cung đình Huế - Di sản văn hóa phi vật thể của nhân loại"
                imageSrc="https://th.bing.com/th/id/OIP.DQTzlP7Qv6QmD_ofCj9mhQHaE8?rs=1&pid=ImgDetMain"
              />
            </div>
          </TabsContent>

          <TabsContent value="car" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <CarServiceCard
                title="Xe 4 chỗ"
                price="600.000đ/ngày"
                description="Xe 4 chỗ tiêu chuẩn, phù hợp cho cặp đôi hoặc gia đình nhỏ tham quan các điểm di tích lịch sử Huế"
                imageSrc="https://th.bing.com/th/id/OIP.v8Xd-woTBpkgD1jC7sD6eAHaEZ?rs=1&pid=ImgDetMain"
                carType="sedan"
              />
              <CarServiceCard
                title="Xe 7 chỗ"
                price="800.000đ/ngày"
                description="Xe 7 chỗ rộng rãi, phù hợp cho gia đình hoặc nhóm bạn tham quan trọn vẹn di sản Huế"
                imageSrc="https://th.bing.com/th/id/OIP.ZomjjAN_itLOAzieCQXLsgHaE8?rs=1&pid=ImgDetMain"
                carType="suv"
              />
              <CarServiceCard
                title="Xe 16 chỗ"
                price="1.200.000đ/ngày"
                description="Xe 16 chỗ tiện nghi, lý tưởng cho đoàn khách tham quan di tích Huế"
                imageSrc="https://th.bing.com/th/id/OIP.5AHlC0LFxP0bL7li_ltFEwHaEK?rs=1&pid=ImgDetMain"
                carType="minibus"
              />
              <CarServiceCard
                title="Xe đặc biệt (Xe ngựa)"
                price="450.000đ/2 giờ"
                description="Trải nghiệm tham quan Huế bằng xe ngựa truyền thống, mang đến cảm giác hoài cổ và thư thái"
                imageSrc="https://th.bing.com/th/id/OIP.ru55yIQRvpm0SKG2i3hvYQHaEr?rs=1&pid=ImgDetMain"
                carType="horse"
              />
            </div>
          </TabsContent>

          <TabsContent value="souvenirs" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <SouvenirCard
                name="Nón lá Huế thêu hoa"
                price="120.000đ"
                image="https://madebymaries.com/wp-content/uploads/2021/10/6-2.jpg"
                description="Nón lá truyền thống Huế với họa tiết hoa văn thêu tay tinh xảo"
              />
              <SouvenirCard
                name="Tranh thủy mặc Huế"
                price="250.000đ"
                image="https://th.bing.com/th/id/OIP.3UC4Rb91wcZj2hSdIF_ohwHaEK?rs=1&pid=ImgDetMain"
                description="Tranh thủy mặc vẽ cảnh Huế, thể hiện nét đẹp trầm mặc của Cố đô"
              />
              <SouvenirCard
                name="Áo dài truyền thống"
                price="850.000đ"
                image="https://th.bing.com/th/id/OIP.21w3HodtpyqBx3i5m2ST6QHaLH?rs=1&pid=ImgDetMain"
                description="Áo dài may thủ công với chất liệu lụa cao cấp và họa tiết truyền thống"
              />
              <SouvenirCard
                name="Trầm hương Huế"
                price="180.000đ"
                image="https://vn-test-11.slatic.net/shop/678c0c37a404e2bfff06181065820513.png"
                description="Trầm hương nguyên chất từ rừng Trường Sơn, được chế tác thủ công"
              />
              <SouvenirCard
                name="Mứt Huế truyền thống"
                price="150.000đ"
                image="https://th.bing.com/th/id/R.3ed9c88d734517e49cdcec87d3077f02?rik=88roNnDPw%2bgbXA&pid=ImgRaw&r=0"
                description="Bộ sưu tập các loại mứt đặc sản Huế, đóng gói sang trọng"
              />
              <SouvenirCard
                name="Đồ gốm Phước Tích"
                price="280.000đ"
                image="https://media-cdn-v2.laodong.vn/Storage/NewsPortal/2023/3/19/1159295/Hue-94.jpg"
                description="Sản phẩm gốm từ làng nghề truyền thống Phước Tích"
              />
            </div>
          </TabsContent>
        </Tabs>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
          <motion.div
            className="p-6 bg-card rounded-lg border"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-start gap-4">
              <Info className="h-5 w-5 text-primary mt-1" />
              <div>
                <h3 className="font-semibold mb-2">Lưu ý khi đặt vé</h3>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>
                    • Vé có giá trị trong ngày, vui lòng đặt vé trước ít nhất 1
                    ngày
                  </li>
                  <li>• Trẻ em dưới 7 tuổi được miễn phí vé vào cổng</li>
                  <li>
                    • Đặt vé theo nhóm (trên 20 người) sẽ được giảm 10% tổng giá
                    trị
                  </li>
                  <li>
                    • Quý khách có thể đổi hoặc hủy vé trước 24 giờ so với giờ
                    tham quan
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="p-6 bg-card rounded-lg border"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <div className="flex items-start gap-4">
              <Car className="h-5 w-5 text-primary mt-1" />
              <div>
                <h3 className="font-semibold mb-2">Thông tin dịch vụ xe</h3>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>
                    • Xe được bảo dưỡng thường xuyên và sạch sẽ, đảm bảo an toàn
                    cho hành khách
                  </li>
                  <li>
                    • Tài xế am hiểu lịch sử văn hóa Huế, có thể hỗ trợ thông
                    tin tham quan
                  </li>
                  <li>
                    • Giá đã bao gồm xăng dầu, chi phí cầu đường và bảo hiểm du
                    lịch
                  </li>
                  <li>
                    • Quý khách nên đặt xe trước ít nhất 1 ngày để đảm bảo xe
                    sẵn sàng
                  </li>
                  <li>
                    • Có thể tùy chỉnh lộ trình tham quan theo yêu cầu của quý
                    khách
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
