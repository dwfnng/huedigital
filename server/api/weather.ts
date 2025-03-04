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

// Mock data for fallback
const mockWeather: WeatherResponse = {
  temp: 25,
  description: "Nhiều mây",
  humidity: 80,
  windSpeed: 10
};

// Simplified weather descriptions
const getWeatherDescription = (code: number): string => {
  if (code === 0) return "Trời quang đãng";
  if (code <= 2) return "Ít mây";
  if (code <= 3) return "Nhiều mây";
  if (code <= 48) return "Sương mù";
  if (code <= 55) return "Mưa phùn";
  if (code <= 65) return "Mưa";
  if (code <= 82) return "Mưa rào";
  if (code >= 95) return "Có dông";
  return "Không xác định";
};

router.get('/', async (req, res) => {
  try {
    console.log('Đang lấy dữ liệu thời tiết cho Huế...');

    // Simplified API URL with essential parameters only
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${HUE_LAT}&longitude=${HUE_LON}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&timezone=Asia/Ho_Chi_Minh`;

    const response = await fetch(url);

    if (!response.ok) {
      console.log('API không phản hồi, sử dụng dữ liệu dự phòng');
      return res.json(mockWeather);
    }

    const data = await response.json();

    if (!data.current) {
      console.log('Không có dữ liệu hiện tại, sử dụng dữ liệu dự phòng');
      return res.json(mockWeather);
    }

    const weatherData: WeatherResponse = {
      temp: Math.round(data.current.temperature_2m),
      description: getWeatherDescription(data.current.weather_code),
      humidity: Math.round(data.current.relative_humidity_2m),
      windSpeed: Math.round(data.current.wind_speed_10m * 3.6) // Convert to km/h
    };

    console.log('Dữ liệu thời tiết:', weatherData);
    res.json(weatherData);

  } catch (error) {
    console.error('Lỗi lấy dữ liệu thời tiết:', error);
    res.json(mockWeather); // Return mock data on error
  }
});

export default router;