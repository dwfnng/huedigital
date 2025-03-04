import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { BarChart2, CloudRain, Users, Car } from "lucide-react";

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

export default function LiveDataPage() {
  const { data: weather } = useQuery({
    queryKey: ["/api/weather"],
    refetchInterval: 300000 // Refetch every 5 minutes
  });

  const { data: visitors } = useQuery({
    queryKey: ["/api/visitors"],
    refetchInterval: 60000 // Refetch every minute
  });

  const { data: traffic } = useQuery({
    queryKey: ["/api/traffic"],
    refetchInterval: 60000
  });

  const { data: locationStats } = useQuery({
    queryKey: ["/api/locations/stats"],
    refetchInterval: 60000
  });

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
                {weather ? (
                  <div>
                    <p className="text-2xl font-semibold mb-2">
                      {Math.round(weather.temp)}°C
                    </p>
                    <p className="capitalize text-muted-foreground">
                      {weather.description}
                    </p>
                    <div className="mt-2 text-sm text-muted-foreground">
                      <p>Độ ẩm: {weather.humidity}%</p>
                      <p>Gió: {weather.windSpeed} km/h</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-muted-foreground">Đang cập nhật...</p>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Visitors Card */}
          <motion.div variants={item}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Lượng khách tham quan
                </CardTitle>
              </CardHeader>
              <CardContent>
                {visitors ? (
                  <div>
                    <p className="text-2xl font-semibold mb-2">
                      {visitors.count.toLocaleString()} khách
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Xu hướng: {visitors.trend === 'up' ? '↑ Tăng' : '↓ Giảm'}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Cập nhật lúc: {new Date(visitors.lastUpdated).toLocaleTimeString()}
                    </p>
                  </div>
                ) : (
                  <p className="text-muted-foreground">Đang cập nhật...</p>
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
                  <div>
                    <p className="text-2xl font-semibold mb-2 capitalize">
                      {traffic.level === 'low' ? 'Thông thoáng' :
                       traffic.level === 'medium' ? 'Bình thường' : 'Đông đúc'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Cập nhật lúc: {new Date(traffic.lastUpdated).toLocaleTimeString()}
                    </p>
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