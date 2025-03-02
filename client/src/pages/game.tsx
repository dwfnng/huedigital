import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Crown, Building2, Map } from "lucide-react";

function GameCard({ icon: Icon, title, description }: { 
  icon: any; 
  title: string;
  description: string;
}) {
  return (
    <Card className="cursor-pointer hover:bg-accent transition-colors">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Icon className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold mb-2">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function GamePage() {
  return (
    <div className="container mx-auto p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-2">Game giáo dục</h1>
        <p className="text-muted-foreground mb-6">
          Khám phá lịch sử và văn hóa Huế qua các trò chơi tương tác
        </p>

        <Tabs defaultValue="role-play" className="space-y-6">
          <TabsList className="w-full">
            <TabsTrigger value="role-play" className="flex-1">Nhập vai lịch sử</TabsTrigger>
            <TabsTrigger value="build" className="flex-1">Xây dựng 3D</TabsTrigger>
            <TabsTrigger value="treasure" className="flex-1">Truy tìm kho báu</TabsTrigger>
          </TabsList>

          <TabsContent value="role-play" className="space-y-4">
            <GameCard
              icon={Crown}
              title="Nhập vai vua Gia Long"
              description="Đưa ra quyết định xây dựng kinh đô Huế với các lựa chọn về vị trí, phong thủy, kiến trúc."
            />
            <GameCard
              icon={Crown}
              title="Quan thần thời Minh Mạng"
              description="Giúp nhà vua xử lý một vụ án trong triều đình, áp dụng luật pháp thời Nguyễn."
            />
          </TabsContent>

          <TabsContent value="build" className="space-y-4">
            <GameCard
              icon={Building2}
              title="Điện Cần Chánh"
              description="Dựng lại Điện Cần Chánh bằng mô hình 3D và so sánh với kiến trúc gốc."
            />
            <GameCard
              icon={Building2}
              title="Hệ thống lăng tẩm"
              description="Thiết kế lại hệ thống lăng tẩm hoàng gia theo phong thủy chuẩn thời Nguyễn."
            />
          </TabsContent>

          <TabsContent value="treasure" className="space-y-4">
            <GameCard
              icon={Map}
              title="Mật thư của vua Tự Đức"
              description="Giải mã mật thư để tìm kiếm một bức sắc phong bị thất lạc."
            />
            <GameCard
              icon={Map}
              title="Kho báu Đại Nội"
              description="Lần theo dấu vết của một kho báu trong Đại Nội bằng cách giải các câu đố lịch sử."
            />
          </TabsContent>
        </Tabs>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>🚧 Các trò chơi đang được phát triển và sẽ sớm ra mắt.</p>
          <p>Hãy quay lại sau để trải nghiệm!</p>
        </div>
      </div>
    </div>
  );
}
