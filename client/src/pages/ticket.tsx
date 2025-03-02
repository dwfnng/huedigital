import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Ticket, Gift, Star, ArrowUpRight } from "lucide-react";

function TicketCard({ title, price, description, url }: {
  title: string;
  price: string;
  description: string;
  url: string;
}) {
  return (
    <Card className="cursor-pointer hover:bg-accent transition-colors">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Ticket className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold mb-1">{title}</h3>
            <p className="text-sm text-muted-foreground mb-2">{description}</p>
            <p className="text-lg font-semibold text-primary">{price}</p>
          </div>
          <Button asChild>
            <a href={url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
              Đặt vé 
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function SouvenirCard({ name, price, image, url }: {
  name: string;
  price: string;
  image: string;
  url: string;
}) {
  return (
    <Card className="cursor-pointer hover:bg-accent transition-colors">
      <CardContent className="p-4">
        <img 
          src={image} 
          alt={name} 
          className="w-full h-48 object-cover rounded-lg mb-4"
        />
        <h3 className="font-semibold mb-1">{name}</h3>
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold text-primary">{price}</p>
          <Button variant="outline" size="sm" asChild>
            <a href={url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
              <Gift className="h-4 w-4" />
              Mua ngay
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function TicketPage() {
  return (
    <div className="container mx-auto p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-2">Đặt vé & Quà lưu niệm</h1>
        <p className="text-muted-foreground mb-6">
          Đặt vé tham quan trực tuyến, tích điểm đổi ưu đãi và mua sắm quà lưu niệm đặc trưng Huế
        </p>

        <div className="bg-primary/5 rounded-lg p-4 mb-6 flex items-center gap-3">
          <Star className="h-5 w-5 text-primary" />
          <div>
            <p className="font-medium">Điểm tích lũy của bạn: 100 điểm</p>
            <p className="text-sm text-muted-foreground">
              Tích điểm qua mỗi lần đặt vé để nhận ưu đãi hấp dẫn
            </p>
          </div>
        </div>

        <Tabs defaultValue="tickets" className="space-y-6">
          <TabsList className="w-full">
            <TabsTrigger value="tickets" className="flex-1">Vé tham quan</TabsTrigger>
            <TabsTrigger value="souvenirs" className="flex-1">Quà lưu niệm</TabsTrigger>
          </TabsList>

          <TabsContent value="tickets" className="space-y-4">
            <TicketCard
              title="Vé tham quan Đại Nội"
              price="200.000đ"
              description="Thăm quan Hoàng thành Huế và các công trình trong Đại Nội"
              url="https://huetourism.gov.vn/vi/dat-ve"
            />
            <TicketCard
              title="Vé tham quan Lăng Tự Đức"
              price="150.000đ"
              description="Khám phá kiến trúc độc đáo của lăng Tự Đức"
              url="https://huetourism.gov.vn/vi/dat-ve"
            />
            <TicketCard
              title="Combo 3 điểm tham quan"
              price="400.000đ"
              description="Đại Nội + Lăng Tự Đức + Lăng Minh Mạng"
              url="https://huetourism.gov.vn/vi/dat-ve"
            />
          </TabsContent>

          <TabsContent value="souvenirs" className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SouvenirCard
              name="Nón lá Huế thêu hoa"
              price="120.000đ"
              image="/attached_assets/pexels-karen-w-lim-415441-1089318.jpg"
              url="https://ochucdotcom.myharavan.com/collections/non-la"
            />
            <SouvenirCard
              name="Tranh thủy mặc Huế"
              price="250.000đ"
              image="/attached_assets/pexels-uyen-bui-205258074-11937353.jpg"
              url="https://huecraft.com.vn/collections/tranh-thuy-mac"
            />
            <SouvenirCard
              name="Áo dài truyền thống"
              price="850.000đ"
              image="/attached_assets/pexels-th-vinh-flute-822138648-21011475.jpg"
              url="https://huefashion.vn/ao-dai-truyen-thong"
            />
            <SouvenirCard
              name="Trầm hương Huế"
              price="180.000đ"
              image="/attached_assets/pexels-vietnam-photographer-27418892.jpg"
              url="https://tramhuonghue.com.vn"
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}