import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Cloud, Users, Car, Clock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface WeatherData {
  main: {
    temp: number;
    humidity: number;
    pressure: number;
  };
  weather: {
    description: string;
    icon: string;
  }[];
  wind: {
    speed: number;
  };
}

interface TrafficData {
  level: "low" | "medium" | "high";
  lastUpdated: string;
}

interface VisitorData {
  count: number;
  trend: "up" | "down" | "stable";
  lastUpdated: string;
}

interface LocationStats {
  id: string;
  name: string;
  visitorCount: number;
  trafficLevel: "low" | "medium" | "high";
}

export default function LiveData() {
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Weather data query
  const { data: weather } = useQuery<WeatherData>({
    queryKey: ["/api/weather"],
    refetchInterval: 900000, // Refetch every 15 minutes
  });

  // Traffic data query
  const { data: traffic } = useQuery<TrafficData>({
    queryKey: ["/api/traffic"],
    refetchInterval: 300000, // Refetch every 5 minutes
  });

  // Visitor data query
  const { data: visitors } = useQuery<VisitorData>({
    queryKey: ["/api/visitors"],
    refetchInterval: 60000, // Refetch every minute
  });

  // Popular locations query
  const { data: popularLocations = [] } = useQuery<LocationStats[]>({
    queryKey: ["/api/locations/stats"],
    refetchInterval: 300000, // Refetch every 5 minutes
  });

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('vi-VN', { 
      hour: '2-digit',
      minute: '2-digit',
      hour12: false 
    });
  };

  return (
    <Card className="w-full bg-background/95 backdrop-blur-sm">
      <CardContent className="p-4">
        <div className="text-center mb-4">
          <p className="text-2xl font-bold">{formatTime(currentTime)}</p>
          <p className="text-sm text-muted-foreground">
            {currentTime.toLocaleDateString('vi-VN', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Weather */}
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Cloud className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">Thời tiết</h3>
                {weather ? (
                  <div className="text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      {weather?.weather?.[0]?.icon && (
                        <img 
                          src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} 
                          alt="Weather icon" 
                          className="w-12 h-12"
                        />
                      )}
                      <div>
                        <h3 className="text-lg font-medium">{weather?.main?.temp !== undefined ? Math.round(weather.main.temp) : '?'}°C</h3>
                        <p className="text-sm text-muted-foreground capitalize">{weather?.weather?.[0]?.description || 'Không có dữ liệu'}</p>
                        <div className="text-xs text-muted-foreground mt-1">
                          <p>Độ ẩm: {weather?.main?.humidity !== undefined ? `${weather.main.humidity}%` : 'N/A'}</p>
                          <p>Gió: {weather?.wind?.speed !== undefined ? `${weather.wind.speed} m/s` : 'N/A'}</p>
                          <p>Áp suất: {weather?.main?.pressure !== undefined ? `${weather.main.pressure} hPa` : 'N/A'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">Đang cập nhật...</p>
                )}
              </div>
            </CardContent>ontent>
          </Card>

          {/* Visitors */}
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">Lượng khách</h3>
                {visitors ? (
                  <div className="text-sm text-muted-foreground">
                    <p>{visitors.count.toLocaleString()} khách</p>
                    <p className="text-xs">
                      {visitors.trend === "up" ? "↑ Tăng" : 
                       visitors.trend === "down" ? "↓ Giảm" : "→ Ổn định"}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">Đang cập nhật...</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Traffic */}
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Car className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">Giao thông</h3>
                {traffic ? (
                  <div className="text-sm text-muted-foreground">
                    <p>
                      {traffic.level === "low" ? "Thông thoáng" :
                       traffic.level === "medium" ? "Bình thường" : "Đông đúc"}
                    </p>
                    <p className="text-xs">
                      Cập nhật: {new Date(traffic.lastUpdated).toLocaleTimeString()}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">Đang cập nhật...</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <h3 className="font-medium flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Điểm tham quan đông khách
          </h3>
          <ScrollArea className="h-[200px]">
            <div className="space-y-2">
              {popularLocations.map(location => (
                <Card key={location.id}>
                  <CardContent className="p-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{location.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {location.visitorCount} khách
                        </p>
                      </div>
                      <div className="text-sm">
                        {location.trafficLevel === "low" ? "🟢" :
                         location.trafficLevel === "medium" ? "🟡" : "🔴"}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
}