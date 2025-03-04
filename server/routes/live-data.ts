import express from "express";
import { storage } from "../storage";
import { z } from "zod";
import fetch from "node-fetch";

const router = express.Router();

// Constants
const WEATHER_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const TRAFFIC_UPDATE_INTERVAL = 15 * 60 * 1000; // 15 minutes
const HUE_COORDINATES = { lat: 16.4637, lon: 107.5909 };

// Cache storage
let weatherCache = {
  data: null,
  timestamp: 0
};

// Weather data endpoint
router.get("/api/weather", async (_req, res) => {
  try {
    const now = Date.now();

    // Return cached data if still valid
    if (weatherCache.data && (now - weatherCache.timestamp) < WEATHER_CACHE_DURATION) {
      return res.json(weatherCache.data);
    }

    // Fetch new weather data
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${HUE_COORDINATES.lat}&lon=${HUE_COORDINATES.lon}&units=metric&appid=${process.env.OPENWEATHER_API_KEY}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch weather data");
    }

    const data = await response.json();

    const weatherData = {
      temperature: Math.round(data.main.temp),
      description: data.weather[0].description,
      humidity: data.main.humidity,
      windSpeed: Math.round(data.wind.speed * 3.6), // Convert m/s to km/h
      lastUpdated: new Date().toISOString()
    };

    // Update cache
    weatherCache = {
      data: weatherData,
      timestamp: now
    };

    res.json(weatherData);
  } catch (error) {
    console.error("Error fetching weather data:", error);
    res.status(500).json({ message: "Error fetching weather data" });
  }
});

// Traffic data endpoint
router.get("/api/traffic", async (_req, res) => {
  try {
    const trafficData = {
      level: "medium" as const,
      lastUpdated: new Date().toISOString()
    };
    res.json(trafficData);
  } catch (error) {
    console.error("Error fetching traffic data:", error);
    res.status(500).json({ message: "Error fetching traffic data" });
  }
});

// Visitor data endpoint
router.get("/api/visitors", async (_req, res) => {
  try {
    const visitorData = {
      count: Math.floor(Math.random() * 1000) + 500, // Simulated data
      trend: "up" as const,
      lastUpdated: new Date().toISOString()
    };
    res.json(visitorData);
  } catch (error) {
    console.error("Error fetching visitor data:", error);
    res.status(500).json({ message: "Error fetching visitor data" });
  }
});

// Popular locations stats
router.get("/api/locations/stats", async (_req, res) => {
  try {
    const locations = await storage.getAllLocations();
    const popularLocations = locations.slice(0, 5).map(location => ({
      id: location.id,
      name: location.name,
      visitorCount: Math.floor(Math.random() * 200) + 100, // Simulated data
      trafficLevel: ["low", "medium", "high"][Math.floor(Math.random() * 3)] as const
    }));
    res.json(popularLocations);
  } catch (error) {
    console.error("Error fetching location stats:", error);
    res.status(500).json({ message: "Error fetching location stats" });
  }
});

// API để cập nhật dữ liệu thời gian thực (cần authentication trong môi trường thực tế)
router.post("/api/live-data", async (req, res) => {
  try {
    const { type, data } = req.body;
    
    // Trong thực tế, bạn sẽ lưu dữ liệu này vào database
    // await storage.updateLiveData(type, data);
    
    res.status(200).json({ message: `${type} data updated successfully` });
  } catch (error) {
    console.error("Error updating live data:", error);
    res.status(500).json({ message: "Error updating live data" });
  }
});

export default router;