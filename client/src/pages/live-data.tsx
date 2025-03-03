
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Cloud, Thermometer, Users, Car, Calendar, Bell } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

function WeatherInfo() {
  const currentDate = new Date();
  const weatherData = {
    condition: "Có mây, thỉnh thoảng có mưa nhẹ",
    temperature: 28,
    humidity: 75,
    wind: "15 km/h",
    updated: `${currentDate.getHours()}:${String(currentDate.getMinutes()).padStart(2, '0')}`
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-2 bg-primary/10 rounded-full">
            <Cloud className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-medium">Thời tiết Huế</h3>
            <p className="text-sm text-muted-foreground">Cập nhật lúc {weatherData.updated}</p>
          </div>
        </div>
        <div className="flex items-center mb-4">
          <Thermometer className="h-8 w-8 mr-2 text-orange-500" />
          <span className="text-3xl font-bold">{weatherData.temperature}°C</span>
        </div>
        <div className="space-y-2">
          <div>
            <span className="text-muted-foreground">Tình trạng:</span>
            <span className="ml-2">{weatherData.condition}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Độ ẩm:</span>
            <span className="ml-2">{weatherData.humidity}%</span>
          </div>
          <div>
            <span className="text-muted-foreground">Gió:</span>
            <span className="ml-2">{weatherData.wind}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function VisitorInfo() {
  const currentDate = new Date();
  
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-2 bg-primary/10 rounded-full">
            <Users className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-medium">Lượng khách tham quan</h3>
            <p className="text-sm text-muted-foreground">
              {currentDate.getDate()}/{currentDate.getMonth() + 1}/{currentDate.getFullYear()}
            </p>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span>Đại Nội</span>
            <span className="font-medium">1250 khách</span>
          </div>
          <div className="flex justify-between items-center">
            <span>Lăng Tự Đức</span>
            <span className="font-medium">872 khách</span>
          </div>
          <div className="flex justify-between items-center">
            <span>Lăng Minh Mạng</span>
            <span className="font-medium">653 khách</span>
          </div>
          <div className="flex justify-between items-center">
            <span>Lăng Khải Định</span>
            <span className="font-medium">548 khách</span>
          </div>
          <div className="flex justify-between items-center">
            <span>Điện Thái Hòa</span>
            <span className="font-medium">980 khách</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function EventInfo() {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-2 bg-primary/10 rounded-full">
            <Calendar className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-medium">Sự kiện sắp diễn ra</h3>
            <p className="text-sm text-muted-foreground">Cập nhật mới nhất</p>
          </div>
        </div>
        <div className="space-y-4">
          <div className="border-l-4 border-primary pl-3 py-1">
            <h4 className="font-medium">Biểu diễn Nhã nhạc cung đình</h4>
            <p className="text-sm text-muted-foreground">Điện Duyệt Thị - 19:30, ngày {new Date().getDate() + 1}/{new Date().getMonth() + 1}</p>
          </div>
          <div className="border-l-4 border-orange-400 pl-3 py-1">
            <h4 className="font-medium">Trưng bày "Di sản Hán Nôm triều Nguyễn"</h4>
            <p className="text-sm text-muted-foreground">Bảo tàng Cổ vật Cung đình - 08:00-17:00, từ {new Date().getDate()}/{new Date().getMonth() + 1}</p>
          </div>
          <div className="border-l-4 border-blue-400 pl-3 py-1">
            <h4 className="font-medium">Hội thảo "Bảo tồn di sản Huế"</h4>
            <p className="text-sm text-muted-foreground">Trung tâm Festival Huế - 14:00, ngày {new Date().getDate() + 3}/{new Date().getMonth() + 1}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function TrafficInfo() {
  const currentDate = new Date();
  const minutes = Math.floor(Math.random() * 10) + 1;
  
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-2 bg-primary/10 rounded-full">
            <Car className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-medium">Tình hình giao thông</h3>
            <p className="text-sm text-muted-foreground">Cập nhật {minutes} phút trước</p>
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
          <div className="flex justify-between items-center">
            <span>Đường Hùng Vương</span>
            <span className="text-green-500">Thông thoáng</span>
          </div>
          <div className="flex justify-between items-center">
            <span>Đường Trần Hưng Đạo</span>
            <span className="text-green-500">Thông thoáng</span>
          </div>
          <div className="flex justify-between items-center">
            <span>Đường Đinh Tiên Hoàng</span>
            <span className="text-yellow-500">Hơi đông</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function EmergencyNotices() {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-2 bg-primary/10 rounded-full">
            <Bell className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-medium">Thông báo khẩn</h3>
            <p className="text-sm text-muted-foreground">Tin mới nhất</p>
          </div>
        </div>
        <div className="space-y-3">
          <div className="p-3 rounded-lg bg-green-50 border border-green-200">
            <p className="text-sm">Không có thông báo khẩn nào tại thời điểm hiện tại</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function LiveDataPage() {
  return (
    <div className="container mx-auto p-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-2">Dữ liệu thời gian thực</h1>
        <p className="text-muted-foreground mb-6">
          Thông tin cập nhật về thời tiết, sự kiện, mật độ du khách và giao thông tại Huế
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <WeatherInfo />
          <VisitorInfo />
          <EventInfo />
          <TrafficInfo />
          <EmergencyNotices />
        </div>
      </div>
    </div>
  );
}
