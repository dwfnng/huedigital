import { Card, CardContent } from "@/components/ui/card";
import { MapIcon } from "lucide-react";

export default function MapPage() {
  return (
    <div className="container mx-auto p-4">
      <div className="max-w-2xl mx-auto text-center">
        <div className="mb-8">
          <MapIcon className="h-16 w-16 mx-auto text-primary opacity-50" />
        </div>
        <h1 className="text-3xl font-bold mb-4">Bản đồ số đang được phát triển</h1>
        <p className="text-muted-foreground mb-4">
          Chúng tôi đang xây dựng tính năng Bản đồ số để giúp bạn khám phá các di tích lịch sử Cố đô Huế một cách trực quan nhất. Tính năng này sẽ sớm ra mắt trong thời gian tới.
        </p>
        <p className="text-muted-foreground">
          Trong thời gian chờ đợi, bạn có thể khám phá Kho học liệu số hoặc trò chuyện với AI để tìm hiểu thêm về lịch sử và văn hóa Huế.
        </p>
      </div>
    </div>
  );
}
