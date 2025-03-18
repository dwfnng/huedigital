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
    <Card className="cursor-pointer hover:bg-amber-50/30 transition-colors shadow-sm hover:shadow-md border-[#B5935A]" onClick={onClick}>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="p-2 bg-[#B5935A]/10 rounded-lg">
            <Icon className="h-6 w-6 text-[#B5935A]" />
          </div>
          <div>
            <h3 className="font-semibold mb-2 text-black">{title}</h3>
            <p className="text-sm text-gray-700">{description}</p>
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
          onClick={() => window.history.back()}
          className="mb-6 bg-[#B5935A] text-white hover:bg-[#A38147] px-4 py-2 rounded-md flex items-center gap-2 font-medium shadow-sm transition-colors"
        >
          ← Quay lại
        </button>
        <div className="bg-[url('/assets/images/hue-pattern-bg.png')] bg-opacity-10 rounded-lg p-6">
          {games[selectedGame as keyof typeof games].component}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-[#B5935A] text-black p-4 rounded-lg mb-6 shadow-md">
          <h1 className="text-2xl font-bold mb-2">Game giáo dục</h1>
          <p className="text-black/90">
            Khám phá lịch sử và văn hóa Huế qua các trò chơi tương tác
          </p>
        </div>

        <Tabs defaultValue="role-play" className="space-y-6">
          <TabsList className="w-full">
            <TabsTrigger value="role-play" className="flex-1 text-black font-medium">Nhập vai lịch sử</TabsTrigger>
            <TabsTrigger value="build" className="flex-1 text-black font-medium">Xây dựng 3D</TabsTrigger>
            <TabsTrigger value="treasure" className="flex-1 text-black font-medium">Truy tìm kho báu</TabsTrigger>
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

        <div className="mt-8 text-center p-4 bg-[#B5935A]/10 rounded-lg border border-[#B5935A]/30">
          <p className="text-black font-medium">🚧 Các trò chơi khác đang được phát triển và sẽ sớm ra mắt.</p>
          <p className="text-gray-700 text-sm mt-1">Hãy quay lại sau để trải nghiệm thêm nhiều trò chơi mới!</p>
        </div>
      </div>
    </div>
  );
}