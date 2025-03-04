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
  precipitation: number;
  cloudCover: number;
}

// Weather code to Vietnamese description mapping
const weatherDescriptions: { [key: number]: string } = {
  0: "Trời quang đãng",
  1: "Ít mây",
  2: "Mây rải rác",
  3: "Nhiều mây",
  45: "Sương mù",
  48: "Sương mù dày đặc",
  51: "Mưa phùn nhẹ",
  53: "Mưa phùn vừa",
  55: "Mưa phùn nặng",
  61: "Mưa nhỏ",
  63: "Mưa vừa",
  65: "Mưa to",
  80: "Mưa rào nhẹ",
  81: "Mưa rào vừa",
  82: "Mưa rào nặng",
  95: "Có dông"
};

router.get('/', async (req, res) => {
  try {
    // Make request to Open-Meteo API with detailed parameters
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${HUE_LAT}&longitude=${HUE_LON}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,cloud_cover,precipitation&timezone=Asia/Ho_Chi_Minh`
    );

    if (!response.ok) {
      console.error('Weather API error:', await response.text());
      throw new Error('Failed to fetch weather data');
    }

    const data = await response.json();
    const current = data.current;

    const weatherData: WeatherResponse = {
      temp: current.temperature_2m,
      description: weatherDescriptions[current.weather_code] || "Không xác định",
      humidity: current.relative_humidity_2m,
      windSpeed: Math.round(current.wind_speed_10m * 3.6), // Convert to km/h
      precipitation: current.precipitation,
      cloudCover: current.cloud_cover
    };

    // Cache response for 5 minutes
    res.setHeader('Cache-Control', 's-maxage=300');
    res.json(weatherData);
  } catch (error) {
    console.error('Error fetching weather data:', error);
    res.status(500).json({ 
      error: 'Không thể lấy dữ liệu thời tiết',
      details: error.message 
    });
  }
});

export default router;