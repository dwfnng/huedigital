import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Crown, Building2, Map, Scale } from "lucide-react";
import RolePlayGame from "@/components/games/RolePlayGame";
import BuildingGame from "@/components/games/BuildingGame";
import TreasureHuntGame from "@/components/games/TreasureHuntGame";
import MinisterGame from "@/components/games/MinisterGame";

function GameCard({ icon: Icon, title, description, onClick }: { 
  icon: any; 
  title: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <Card className="cursor-pointer hover:bg-cyan-50 transition-colors shadow-sm hover:shadow-md" onClick={onClick}>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="p-2 bg-cyan-500/10 rounded-lg">
            <Icon className="h-6 w-6 text-cyan-700" />
          </div>
          <div>
            <h3 className="font-semibold mb-2 text-cyan-900">{title}</h3>
            <p className="text-sm text-cyan-700/80">{description}</p>
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
      component: <MinisterGame />
    },
    building: {
      title: "Điện Cần Chánh",
      description: "Dựng lại Điện Cần Chánh bằng mô hình 3D và so sánh với kiến trúc gốc. Tìm hiểu về nghệ thuật kiến trúc cung đình Huế.",
      component: <BuildingGame />
    },
    treasure: {
      title: "Mật thư của vua Tự Đức",
      description: "Giải mã các câu đố lịch sử để tìm kiếm bảo vật hoàng cung. Khám phá những bí mật thú vị về Cố đô Huế.",
      component: <TreasureHuntGame />
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
        <div className="page-header">
          <div className="page-header-content">
            <h1>Game giáo dục</h1>
            <p className="text-muted-foreground">
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
              icon={Scale}
              title="Quan thần thời Minh Mạng"
              description="Giúp nhà vua xử lý một vụ án trong triều đình, áp dụng luật pháp thời Nguyễn."
              onClick={() => setSelectedGame('minister')}
            />
          </TabsContent>

          <TabsContent value="build" className="space-y-4">
            <GameCard
              icon={Building2}
              title="Điện Cần Chánh"
              description="Dựng lại Điện Cần Chánh bằng mô hình 3D và so sánh với kiến trúc gốc. Tìm hiểu về nghệ thuật kiến trúc cung đình Huế."
              onClick={() => setSelectedGame('building')}
            />
          </TabsContent>

          <TabsContent value="treasure" className="space-y-4">
            <GameCard
              icon={Map}
              title="Mật thư của vua Tự Đức"
              description="Giải mã các câu đố lịch sử để tìm kiếm bảo vật hoàng cung. Khám phá những bí mật thú vị về Cố đô Huế."
              onClick={() => setSelectedGame('treasure')}
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