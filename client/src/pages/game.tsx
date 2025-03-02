import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Crown, Building2, Map } from "lucide-react";
import RolePlayGame from "@/components/games/RolePlayGame";

function GameCard({ icon: Icon, title, description, onClick }: { 
  icon: any; 
  title: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <Card className="cursor-pointer hover:bg-accent transition-colors" onClick={onClick}>
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
  const [selectedGame, setSelectedGame] = useState<string | null>(null);

  const games = {
    role_play: {
      title: "Nhập vai vua Gia Long",
      description: "Đưa ra quyết định xây dựng kinh đô Huế với các lựa chọn về vị trí, phong thủy, kiến trúc.",
      component: <RolePlayGame />
    },
    minister: {
      title: "Quan thần thời Minh Mạng",
      description: "Giúp nhà vua xử lý một vụ án trong triều đình, áp dụng luật pháp thời Nguyễn.",
      component: <div className="text-center p-8 text-muted-foreground">Trò chơi đang được phát triển...</div>
    }
  };

  if (selectedGame && games[selectedGame as keyof typeof games]) {
    return (
      <div className="container mx-auto p-4">
        <button 
          onClick={() => setSelectedGame(null)}
          className="mb-6 text-primary hover:underline flex items-center gap-2"
        >
          ← Quay lại danh sách
        </button>
        {games[selectedGame as keyof typeof games].component}
      </div>
    );
  }

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
              onClick={() => setSelectedGame('role_play')}
            />
            <GameCard
              icon={Crown}
              title="Quan thần thời Minh Mạng"
              description="Giúp nhà vua xử lý một vụ án trong triều đình, áp dụng luật pháp thời Nguyễn."
              onClick={() => setSelectedGame('minister')}
            />
          </TabsContent>

          <TabsContent value="build" className="space-y-4">
            <GameCard
              icon={Building2}
              title="Điện Cần Chánh"
              description="Dựng lại Điện Cần Chánh bằng mô hình 3D và so sánh với kiến trúc gốc."
              onClick={() => {}}
            />
            <GameCard
              icon={Building2}
              title="Hệ thống lăng tẩm"
              description="Thiết kế lại hệ thống lăng tẩm hoàng gia theo phong thủy chuẩn thời Nguyễn."
              onClick={() => {}}
            />
          </TabsContent>

          <TabsContent value="treasure" className="space-y-4">
            <GameCard
              icon={Map}
              title="Mật thư của vua Tự Đức"
              description="Giải mã mật thư để tìm kiếm một bức sắc phong bị thất lạc."
              onClick={() => {}}
            />
            <GameCard
              icon={Map}
              title="Kho báu Đại Nội"
              description="Lần theo dấu vết của một kho báu trong Đại Nội bằng cách giải các câu đố lịch sử."
              onClick={() => {}}
            />
          </TabsContent>
        </Tabs>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>🚧 Các trò chơi khác đang được phát triển và sẽ sớm ra mắt.</p>
          <p>Hãy quay lại sau để trải nghiệm thêm nhiều trò chơi mới!</p>
        </div>
      </div>
    </div>
  );
}