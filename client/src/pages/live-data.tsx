import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { BarChart2, CloudRain, Users, Car, Calendar } from "lucide-react";

// Animation variants
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

interface LocationStats {
  id: string;
  name: string;
  visitorCount: number;
  trafficLevel: string;
}

interface WeatherData {
  temp: number;
  humidity: number;
  description: string;
  windSpeed: number;
  icon: string;
  lastUpdated: string;
}

interface TrafficData {
  level: string;
  lastUpdated: string;
  routes: Array<{
    id: string;
    name: string;
    status: string;
    description: string;
  }>;
}

interface Event {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  location: string;
  description: string;
}

const defaultEvents: Event[] = [
  {
    id: 'mega-booming-2025',
    title: 'Đại nhạc hội "Huế – Mega Booming"',
    startDate: '2025-04-05',
    endDate: '2025-04-06',
    location: 'Quảng trường Ngọ Môn – Đại Nội Huế',
    description: 'Đại nhạc hội với sự tham gia của nhiều ca sĩ trẻ: Isaac, Anh Tú, Quân A.P, HurryKng, Wean, ManBo, Lyly, Xuân Định K.Y, Bạch Trà và MC Trần Thịnh, Phạm Anh Khoa, Ngọc Khuê cùng dàn nhạc truyền thống Huế. Đặc biệt có sự góp mặt của nghệ sĩ Nhật Bản – Akari Nakatani và ca sĩ Hàn Quốc Blue D cùng DJ Huy Ngô và Shumo AG.'
  }
];

export default function LiveDataPage() {
  const { data: weather, isError: weatherError } = useQuery<WeatherData>({
    queryKey: ["/api/weather"],
    refetchInterval: 300000 // Refetch every 5 minutes
  });

  const { data: visitors } = useQuery({
    queryKey: ["/api/visitors"],
    refetchInterval: 60000
  });

  const { data: traffic } = useQuery<TrafficData>({
    queryKey: ["/api/traffic"],
    refetchInterval: 30000 // Refresh every 30 seconds
  });

  const { data: events = defaultEvents } = useQuery<Event[]>({
    queryKey: ["/api/events"],
    refetchInterval: 300000
  });

  const { data: locationStats = [] } = useQuery<LocationStats[]>({
    queryKey: ["/api/locations/stats"],
    refetchInterval: 30000 // Refresh every 30 seconds
  });

  const getTrafficStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'high': return <span className="flex items-center text-red-500">● Đông đúc</span>;
      case 'medium': return <span className="flex items-center text-yellow-500">● Bình thường</span>;
      case 'low': return <span className="flex items-center text-green-500">● Thông thoáng</span>;
      default: return <span className="text-muted-foreground">○ Không xác định</span>;
    }
  };

  return (
    <div className="container mx-auto p-4 relative">
      {/* Họa tiết nền */}
      <div className="absolute inset-0 bg-[url('/imperial-pattern.svg')] bg-repeat opacity-5 pointer-events-none"></div>
      <div className="absolute top-0 left-0 w-32 h-32 bg-[url('/corner-decoration.svg')] bg-no-repeat opacity-10 pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-32 h-32 bg-[url('/corner-decoration.svg')] bg-no-repeat transform scale-x-[-1] opacity-10 pointer-events-none"></div>
      
      <motion.div
        className="max-w-5xl mx-auto relative z-10"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={item} className="mb-8">
          <div className="bg-[#B5935A] text-black p-4 rounded-lg mb-6 shadow-md">
            <h1 className="text-3xl font-bold mb-2 flex items-center">
              <BarChart2 className="h-7 w-7 mr-2" />
              Dữ liệu thời gian thực
            </h1>
            <p className="text-black/90">
              Thông tin cập nhật về thời tiết, lượng khách tham quan và tình hình giao thông tại các điểm di tích Huế
            </p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Weather Card */}
          <motion.div variants={item}>
            <Card className="border border-[#B5935A]/30 shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="bg-gradient-to-r from-[#B5935A]/10 to-[#B5935A]/20 rounded-t-lg border-b border-[#B5935A]/10">
                <CardTitle className="flex items-center gap-2 text-[#B5935A]">
                  <CloudRain className="h-5 w-5 text-[#B5935A]" />
                  Thời tiết
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                {weather && !weatherError ? (
                  <div>
                    <div className="flex items-center gap-4">
                      <img
                        src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
                        alt={weather.description}
                        className="w-16 h-16"
                      />
                      <div>
                        <p className="text-2xl font-semibold text-[#B5935A]">
                          {Math.round(weather.temp)}°C
                        </p>
                        <p className="capitalize text-[#B5935A]/70">
                          {weather.description}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 space-y-2 text-sm text-[#B5935A]/80">
                      <p>Độ ẩm: {weather.humidity}%</p>
                      <p>Gió: {Math.round(weather.windSpeed * 3.6)} km/h</p>
                      <p className="text-xs">
                        Cập nhật: {new Date(weather.lastUpdated).toLocaleTimeString('vi-VN')}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-[#B5935A]/70">
                    {weatherError ? "Không thể lấy dữ liệu thời tiết" : "Đang cập nhật..."}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Traffic Card */}
          <motion.div variants={item}>
            <Card className="border border-[#B5935A]/30 shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="bg-gradient-to-r from-[#B5935A]/10 to-[#B5935A]/20 rounded-t-lg border-b border-[#B5935A]/10">
                <CardTitle className="flex items-center gap-2 text-[#B5935A]">
                  <Car className="h-5 w-5 text-[#B5935A]" />
                  Tình hình giao thông
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                {traffic ? (
                  <div className="space-y-4">
                    {traffic.routes.map(route => (
                      <div key={route.id} className="border-b border-[#7B2B2B]/10 pb-3 last:border-0 last:pb-0">
                        <div className="flex justify-between items-center mb-1">
                          <h3 className="font-medium text-[#7B2B2B]">{route.name}</h3>
                          {getTrafficStatusIcon(route.status)}
                        </div>
                        <p className="text-sm text-[#7B2B2B]/70">{route.description}</p>
                      </div>
                    ))}
                    <p className="text-xs text-[#7B2B2B]/70 mt-2">
                      Cập nhật lúc: {new Date(traffic.lastUpdated).toLocaleTimeString('vi-VN')}
                    </p>
                  </div>
                ) : (
                  <div className="animate-pulse space-y-4">
                    <div className="h-4 bg-[#7B2B2B]/10 rounded w-3/4"></div>
                    <div className="h-4 bg-[#7B2B2B]/10 rounded w-1/2"></div>
                    <div className="h-4 bg-[#7B2B2B]/10 rounded w-2/3"></div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Events Card */}
          <motion.div variants={item}>
            <Card className="border border-[#B5935A]/30 shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="bg-gradient-to-r from-[#B5935A]/10 to-[#B5935A]/20 rounded-t-lg border-b border-[#B5935A]/10">
                <CardTitle className="flex items-center gap-2 text-[#B5935A]">
                  <Calendar className="h-5 w-5 text-[#B5935A]" />
                  Sự kiện sắp diễn ra
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                {events ? (
                  <div className="space-y-4">
                    {events.map(event => (
                      <div key={event.id} className="border-b border-[#7B2B2B]/10 pb-3 last:border-0 last:pb-0">
                        <h3 className="font-medium text-[#7B2B2B]">{event.title}</h3>
                        <div className="text-sm text-[#7B2B2B]/70 mt-1">
                          <p>Địa điểm: {event.location}</p>
                          <p>Thời gian: {new Date(event.startDate).toLocaleDateString('vi-VN')} - {new Date(event.endDate).toLocaleDateString('vi-VN')}</p>
                          <p className="mt-1">{event.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[#7B2B2B]/70">Đang cập nhật...</p>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Location Stats Card */}
          <motion.div variants={item}>
            <Card className="border border-[#B5935A]/30 shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="bg-gradient-to-r from-[#B5935A]/10 to-[#B5935A]/20 rounded-t-lg border-b border-[#B5935A]/10">
                <CardTitle className="flex items-center gap-2 text-[#B5935A]">
                  <BarChart2 className="h-5 w-5 text-[#B5935A]" />
                  Thống kê theo điểm
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                {locationStats.length > 0 ? (
                  <div className="space-y-4">
                    {locationStats.map((location) => (
                      <div key={location.id} className="flex justify-between items-center border-b border-[#7B2B2B]/10 pb-3 last:border-0 last:pb-0">
                        <div>
                          <span className="font-medium text-[#7B2B2B]">{location.name}</span>
                          <div className="text-sm">
                            {getTrafficStatusIcon(location.trafficLevel)}
                          </div>
                        </div>
                        <span className="font-semibold text-[#7B2B2B]">
                          {location.visitorCount.toLocaleString('vi-VN')} khách
                        </span>
                      </div>
                    ))}
                    <p className="text-xs text-[#7B2B2B]/70 mt-4">
                      Cập nhật tự động mỗi 30 giây
                    </p>
                  </div>
                ) : (
                  <div className="animate-pulse space-y-4">
                    <div className="h-4 bg-[#7B2B2B]/10 rounded w-3/4"></div>
                    <div className="h-4 bg-[#7B2B2B]/10 rounded w-1/2"></div>
                    <div className="h-4 bg-[#7B2B2B]/10 rounded w-2/3"></div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}