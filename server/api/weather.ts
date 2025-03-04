import express from 'express';

const router = express.Router();

// Coordinates for Hue City
const HUE_LAT = 16.4637;
const HUE_LON = 107.5909;

interface WeatherResponse {
  temp: number;
  description: string;
  humidity: number;
  windSpeed: number;
}

// Weather code to description mapping
const weatherDescriptions: { [key: number]: string } = {
  0: "Trời quang",
  1: "Ít mây",
  2: "Mây rải rác",
  3: "Nhiều mây",
  45: "Sương mù",
  48: "Sương mù dày",
  51: "Mưa phùn nhẹ",
  53: "Mưa phùn",
  55: "Mưa phùn nặng",
  61: "Mưa nhỏ",
  63: "Mưa vừa",
  65: "Mưa to",
  80: "Mưa rào nhẹ",
  81: "Mưa rào vừa",
  82: "Mưa rào to",
  95: "Mưa dông",
};

router.get('/', async (req, res) => {
  try {
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${HUE_LAT}&longitude=${HUE_LON}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&timezone=Asia/Ho_Chi_Minh`
    );
    
    if (!response.ok) {
      throw new Error('Weather API request failed');
    }

    const data = await response.json();
    const current = data.current;

    const weatherData: WeatherResponse = {
      temp: current.temperature_2m,
      description: weatherDescriptions[current.weather_code] || "Không xác định",
      humidity: current.relative_humidity_2m,
      windSpeed: current.wind_speed_10m,
    };

    res.json(weatherData);
  } catch (error) {
    console.error('Error fetching weather data:', error);
    res.status(500).json({ error: 'Failed to fetch weather data' });
  }
});

export default router;
