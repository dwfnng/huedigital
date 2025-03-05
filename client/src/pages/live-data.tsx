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
    refetchInterval: 60000
  });

  const { data: events } = useQuery<Event[]>({
    queryKey: ["/api/events"],
    refetchInterval: 300000
  });

  const { data: locationStats } = useQuery({
    queryKey: ["/api/locations/stats"],
    refetchInterval: 60000
  });

  const getTrafficStatusIcon = (status: string) => {
    switch (status) {
      case 'high': return <span className="flex items-center text-red-500">● Đông đúc</span>;
      case 'medium': return <span className="flex items-center text-yellow-500">● Bình thường</span>;
      case 'low': return <span className="flex items-center text-green-500">● Thông thoáng</span>;
      default: return <span className="text-muted-foreground">○ Không xác định</span>;
    }
  };

  return (
    <div className="container mx-auto p-4">
      <motion.div 
        className="max-w-5xl mx-auto"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={item} className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Dữ liệu thời gian thực</h1>
          <p className="text-muted-foreground">
            Thông tin cập nhật về thời tiết, lượng khách tham quan và tình hình giao thông tại các điểm di tích Huế
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Weather Card */}
          <motion.div variants={item}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CloudRain className="h-5 w-5 text-primary" />
                  Thời tiết
                </CardTitle>
              </CardHeader>
              <CardContent>
                {weather && !weatherError ? (
                  <div>
                    <div className="flex items-center gap-4">
                      <img 
                        src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
                        alt={weather.description}
                        className="w-16 h-16"
                      />
                      <div>
                        <p className="text-2xl font-semibold">
                          {Math.round(weather.temp)}°C
                        </p>
                        <p className="capitalize text-muted-foreground">
                          {weather.description}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                      <p>Độ ẩm: {weather.humidity}%</p>
                      <p>Gió: {Math.round(weather.windSpeed * 3.6)} km/h</p>
                      <p className="text-xs">
                        Cập nhật: {new Date(weather.lastUpdated).toLocaleTimeString('vi-VN')}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-muted-foreground">
                    {weatherError ? "Không thể lấy dữ liệu thời tiết" : "Đang cập nhật..."}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Traffic Card */}
          <motion.div variants={item}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Car className="h-5 w-5 text-primary" />
                  Tình hình giao thông
                </CardTitle>
              </CardHeader>
              <CardContent>
                {traffic ? (
                  <div className="space-y-4">
                    {traffic.routes.map(route => (
                      <div key={route.id} className="border-b pb-3 last:border-0 last:pb-0">
                        <div className="flex justify-between items-center mb-1">
                          <h3 className="font-medium">{route.name}</h3>
                          {getTrafficStatusIcon(route.status)}
                        </div>
                        <p className="text-sm text-muted-foreground">{route.description}</p>
                      </div>
                    ))}
                    <p className="text-xs text-muted-foreground mt-2">
                      Cập nhật lúc: {new Date(traffic.lastUpdated).toLocaleTimeString('vi-VN')}
                    </p>
                  </div>
                ) : (
                  <p className="text-muted-foreground">Đang cập nhật...</p>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Events Card */}
          <motion.div variants={item}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Sự kiện sắp diễn ra
                </CardTitle>
              </CardHeader>
              <CardContent>
                {events ? (
                  <div className="space-y-4">
                    {events.map(event => (
                      <div key={event.id} className="border-b pb-3 last:border-0 last:pb-0">
                        <h3 className="font-medium">{event.title}</h3>
                        <div className="text-sm text-muted-foreground mt-1">
                          <p>Địa điểm: {event.location}</p>
                          <p>Thời gian: {new Date(event.startDate).toLocaleDateString('vi-VN')} - {new Date(event.endDate).toLocaleDateString('vi-VN')}</p>
                          <p className="mt-1">{event.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">Đang cập nhật...</p>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Location Stats Card */}
          <motion.div variants={item}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart2 className="h-5 w-5 text-primary" />
                  Thống kê theo điểm
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {locationStats ? (
                    locationStats.map((location) => (
                      <div key={location.id} className="flex justify-between items-center">
                        <span>{location.name}</span>
                        <span className="font-semibold">
                          {location.visitorCount} khách
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground">Đang cập nhật...</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}