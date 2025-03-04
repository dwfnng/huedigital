import { Card } from "@/components/ui/card";
import LiveData from "@/components/LiveData"; // Fixed import

export default function LiveDataPage() {
  return (
    <div className="container mx-auto p-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-2">Dữ liệu thời gian thực</h1>
        <p className="text-muted-foreground mb-6">
          Thông tin cập nhật về thời tiết, sự kiện, mật độ du khách và giao thông tại Huế
        </p>

        <LiveData />
      </div>
    </div>
  );
}