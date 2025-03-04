
import TreasureHuntAnswers from "@/components/games/TreasureHuntAnswers";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function GameAnswers() {
  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="mb-4">
        <Link 
          to="/game" 
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Quay lại trò chơi
        </Link>
      </div>
      
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Đáp án Trò Chơi Di Sản Huế</h1>
        <p className="text-muted-foreground">
          Tham khảo đáp án cho các trò chơi giáo dục về di sản văn hóa Huế
        </p>
      </div>
      
      <TreasureHuntAnswers />
      
      <Card className="mt-6">
        <CardContent className="p-4">
          <p className="text-sm text-muted-foreground">
            Lưu ý: Việc tham khảo đáp án chỉ nên được thực hiện sau khi đã cố gắng giải các câu đố. 
            Giá trị của trò chơi nằm ở quá trình tìm hiểu và khám phá lịch sử văn hóa Huế.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
