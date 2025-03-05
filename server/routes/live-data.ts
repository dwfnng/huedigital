import express from "express";
import { storage } from "../storage";
import { fetchWeatherData } from "../services/weatherService";

const router = express.Router();

// Weather data endpoint
router.get("/api/weather", async (_req, res) => {
  try {
    const weatherData = await fetchWeatherData();

    // Format the weather data for frontend
    const formattedWeather = {
      temp: weatherData.main.temp,
      humidity: weatherData.main.humidity,
      description: weatherData.weather[0].description,
      windSpeed: weatherData.wind.speed,
      icon: weatherData.weather[0].icon,
      lastUpdated: new Date(weatherData.dt * 1000).toISOString()
    };

    res.json(formattedWeather);
  } catch (error) {
    console.error("Weather API error:", error);
    res.status(503).json({ 
      error: "Không thể lấy dữ liệu thời tiết",
      message: "Vui lòng thử lại sau"
    });
  }
});

// Traffic data endpoint - enhanced with more details
router.get("/api/traffic", async (_req, res) => {
  const trafficData = {
    level: "medium" as const,
    lastUpdated: new Date().toISOString(),
    routes: [
      {
        id: "route-1",
        name: "Đường Lê Duẩn",
        status: "high",
        description: "Đông đúc do giờ cao điểm"
      },
      {
        id: "route-2",
        name: "Đường Hùng Vương",
        status: "medium",
        description: "Lưu thông bình thường"
      },
      {
        id: "route-3",
        name: "Cầu Trường Tiền",
        status: "low",
        description: "Thông thoáng"
      }
    ]
  };
  res.json(trafficData);
});

// Visitor data endpoint
router.get("/api/visitors", async (_req, res) => {
  const visitorData = {
    count: Math.floor(Math.random() * 1000) + 500,
    trend: "up" as const,
    lastUpdated: new Date().toISOString()
  };
  res.json(visitorData);
});

// Events endpoint
router.get("/api/events", async (_req, res) => {
  const events = [
    {
      id: "evt-1",
      title: "Festival Huế 2024",
      startDate: "2024-04-01",
      endDate: "2024-04-07",
      location: "Đại Nội",
      description: "Lễ hội văn hóa nghệ thuật quốc tế"
    },
    {
      id: "evt-2",
      title: "Triển lãm Nghệ thuật Cung đình",
      startDate: "2024-03-15",
      endDate: "2024-03-20",
      location: "Bảo tàng Mỹ thuật Huế",
      description: "Trưng bày các tác phẩm nghệ thuật thời Nguyễn"
    }
  ];
  res.json(events);
});

// Location stats endpoint
router.get("/api/locations/stats", async (_req, res) => {
  try {
    const locations = await storage.getAllLocations();
    const popularLocations = locations.slice(0, 5).map(location => ({
      id: location.id,
      name: location.name,
      visitorCount: Math.floor(Math.random() * 200) + 100,
      trafficLevel: ["low", "medium", "high"][Math.floor(Math.random() * 3)] as "low" | "medium" | "high"
    }));
    res.json(popularLocations);
  } catch (error) {
    console.error("Error fetching location stats:", error);
    res.status(500).json({ message: "Error fetching location stats" });
  }
});

export default router;