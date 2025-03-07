import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { Ticket, Gift, Star, ArrowUpRight, Info } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
};

function TicketCard({ title, price, description, imageSrc }: {
  title: string;
  price: string;
  description: string;
  imageSrc: string;
}) {
  return (
    <motion.div
      variants={fadeIn}
      initial="hidden"
      animate="visible"
    >
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
          <Button className="w-full" onClick={() => {
            // Since we don't have a real booking system yet, show a message
            toast({
              title: "Thông báo",
              description: "Tính năng đặt vé sẽ sớm được ra mắt!",
              duration: 3000
            });
          }}>
            <Ticket className="mr-2 h-4 w-4" />
            Đặt vé
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function SouvenirCard({ name, price, image, description }: {
  name: string;
  price: string;
  image: string;
  description: string;
}) {
  return (
    <motion.div
      variants={fadeIn}
      initial="hidden"
      animate="visible"
    >
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
          <Button className="w-full" variant="secondary" onClick={() => {
            toast({
              title: "Thông báo",
              description: "Tính năng mua sắm sẽ sớm được ra mắt!",
              duration: 3000
            });
          }}>
            <Gift className="mr-2 h-4 w-4" />
            Mua ngay
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function TicketPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold mb-3">Đặt vé & Quà lưu niệm</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Trải nghiệm văn hóa Huế qua các gói tham quan độc đáo và bộ sưu tập quà lưu niệm đặc trưng
          </p>
        </motion.div>

        <motion.div 
          className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg p-6 mb-8"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/20 rounded-full">
              <Star className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-1">Chương trình thành viên</h2>
              <p className="text-sm text-muted-foreground">
                Tích điểm qua mỗi lần đặt vé để nhận ưu đãi hấp dẫn. Điểm tích lũy của bạn: <span className="font-semibold text-primary">100 điểm</span>
              </p>
            </div>
          </div>
        </motion.div>

        <Tabs defaultValue="tickets" className="space-y-8">
          <TabsList className="w-full">
            <TabsTrigger value="tickets" className="flex-1">Vé tham quan</TabsTrigger>
            <TabsTrigger value="souvenirs" className="flex-1">Quà lưu niệm</TabsTrigger>
          </TabsList>

          <TabsContent value="tickets" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <TicketCard
                title="Vé tham quan Đại Nội"
                price="200.000đ"
                description="Khám phá kiến trúc độc đáo của Hoàng thành Huế, nơi lưu giữ những giá trị lịch sử và văn hóa của triều Nguyễn"
                imageSrc="/images/tickets/dai-noi.jpg"
              />
              <TicketCard
                title="Vé tham quan Lăng Tự Đức"
                price="150.000đ"
                description="Chiêm ngưỡng quần thể kiến trúc tráng lệ của lăng Tự Đức, một trong những công trình đẹp nhất của kiến trúc cung đình Huế"
                imageSrc="/images/tickets/lang-tu-duc.jpg"
              />
              <TicketCard
                title="Combo 3 điểm tham quan"
                price="400.000đ"
                description="Trọn gói tham quan Đại Nội, Lăng Tự Đức và Lăng Minh Mạng với giá ưu đãi"
                imageSrc="/images/tickets/combo.jpg"
              />
              <TicketCard
                title="Vé xem biểu diễn Nhã nhạc"
                price="300.000đ"
                description="Thưởng thức nghệ thuật Nhã nhạc cung đình Huế - Di sản văn hóa phi vật thể của nhân loại"
                imageSrc="/images/tickets/nha-nhac.jpg"
              />
            </div>
          </TabsContent>

          <TabsContent value="souvenirs" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <SouvenirCard
                name="Nón lá Huế thêu hoa"
                price="120.000đ"
                image="/images/souvenirs/non-la.jpg"
                description="Nón lá truyền thống Huế với họa tiết hoa văn thêu tay tinh xảo"
              />
              <SouvenirCard
                name="Tranh thủy mặc Huế"
                price="250.000đ"
                image="/images/souvenirs/tranh-thuy-mac.jpg"
                description="Tranh thủy mặc vẽ cảnh Huế, thể hiện nét đẹp trầm mặc của Cố đô"
              />
              <SouvenirCard
                name="Áo dài truyền thống"
                price="850.000đ"
                image="/images/souvenirs/ao-dai.jpg"
                description="Áo dài may thủ công với chất liệu lụa cao cấp và họa tiết truyền thống"
              />
              <SouvenirCard
                name="Trầm hương Huế"
                price="180.000đ"
                image="/images/souvenirs/tram-huong.jpg"
                description="Trầm hương nguyên chất từ rừng Trường Sơn, được chế tác thủ công"
              />
              <SouvenirCard
                name="Mứt Huế truyền thống"
                price="150.000đ"
                image="/c"
                description="Bộ sưu tập các loại mứt đặc sản Huế, đóng gói sang trọng"
              />
              <SouvenirCard
                name="Đồ gốm Phước Tích"
                price="280.000đ"
                image="/images/souvenirs/gom.jpg"
                description="Sản phẩm gốm từ làng nghề truyền thống Phước Tích"
              />
            </div>
          </TabsContent>
        </Tabs>

        <motion.div
          className="mt-12 p-6 bg-card rounded-lg border"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-start gap-4">
            <Info className="h-5 w-5 text-primary mt-1" />
            <div>
              <h3 className="font-semibold mb-2">Lưu ý khi đặt vé</h3>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• Vé có giá trị trong ngày, vui lòng đặt vé trước ít nhất 1 ngày</li>
                <li>• Trẻ em dưới 7 tuổi được miễn phí vé vào cổng</li>
                <li>• Đặt vé theo nhóm (trên 20 người) sẽ được giảm 10% tổng giá trị</li>
                <li>• Quý khách có thể đổi hoặc hủy vé trước 24 giờ so với giờ tham quan</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}