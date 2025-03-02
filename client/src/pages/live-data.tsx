import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Cloud, 
  Calendar, 
  Users, 
  Car,
  CloudRain,
  CloudSun,
  Sun
} from "lucide-react";

function WeatherCard() {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary/10 rounded-full">
            <CloudSun className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="font-medium mb-1">Thời tiết Huế</h3>
            <p className="text-2xl font-semibold">27°C</p>
            <p className="text-sm text-muted-foreground">Nhiều mây, độ ẩm 80%</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function EventList() {
  const events = [
    {
      name: "Festival Huế 2024",
      date: "15/06 - 20/06",
      location: "Quảng trường Ngọ Môn"
    },
    {
      name: "Triển lãm Di sản văn hóa Huế",
      date: "10/06 - 30/06",
      location: "Bảo tàng Mỹ thuật Huế"
    }
  ];

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-2 bg-primary/10 rounded-full">
            <Calendar className="h-5 w-5 text-primary" />
          </div>
          <h3 className="font-medium">Sự kiện sắp diễn ra</h3>
        </div>
        <ScrollArea className="h-[200px]">
          <div className="space-y-4">
            {events.map((event, index) => (
              <div key={index} className="border-b pb-4 last:border-0">
                <h4 className="font-medium">{event.name}</h4>
                <p className="text-sm text-muted-foreground">
                  {event.date} | {event.location}
                </p>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

function VisitorStats() {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-2 bg-primary/10 rounded-full">
            <Users className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-medium">Mật độ du khách</h3>
            <p className="text-sm text-muted-foreground">Cập nhật 5 phút trước</p>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span>Đại Nội</span>
            <span className="text-orange-500">Đông</span>
          </div>
          <div className="flex justify-between items-center">
            <span>Chùa Thiên Mụ</span>
            <span className="text-green-500">Bình thường</span>
          </div>
          <div className="flex justify-between items-center">
            <span>Lăng Tự Đức</span>
            <span className="text-green-500">Bình thường</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function TrafficInfo() {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-2 bg-primary/10 rounded-full">
            <Car className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-medium">Tình hình giao thông</h3>
            <p className="text-sm text-muted-foreground">Cập nhật 2 phút trước</p>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span>Cầu Trường Tiền</span>
            <span className="text-green-500">Thông thoáng</span>
          </div>
          <div className="flex justify-between items-center">
            <span>Đường Lê Lợi</span>
            <span className="text-orange-500">Khá đông</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function LiveDataPage() {
  return (
    <div className="container mx-auto p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-2">Dữ liệu thời gian thực</h1>
        <p className="text-muted-foreground mb-6">
          Thông tin cập nhật về thời tiết, sự kiện, mật độ du khách và giao thông tại Huế
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <WeatherCard />
          <EventList />
          <VisitorStats />
          <TrafficInfo />
        </div>
      </div>
    </div>
  );
}
