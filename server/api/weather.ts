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

// Simple weather code mapping
const getWeatherDescription = (code: number): string => {
  // WMO Weather interpretation codes (WW)
  // https://open-meteo.com/en/docs
  switch (true) {
    case code === 0: return "Trời quang đãng";
    case code <= 2: return "Ít mây";
    case code <= 3: return "Nhiều mây";
    case code <= 48: return "Sương mù";
    case code <= 55: return "Mưa phùn";
    case code <= 65: return "Mưa";
    case code <= 82: return "Mưa rào";
    case code >= 95: return "Có dông";
    default: return "Không xác định";
  }
};

router.get('/', async (req, res) => {
  try {
    console.log('Đang lấy dữ liệu thời tiết cho Huế...');

    // Using Open-Meteo API with detailed parameters
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${HUE_LAT}&longitude=${HUE_LON}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&timezone=Asia/Ho_Chi_Minh`;
    console.log('API URL:', url);

    const response = await fetch(url);
    console.log('API Status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', errorText);
      throw new Error(`Open-Meteo API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('Raw weather data:', data);

    if (!data.current) {
      throw new Error('Không có dữ liệu thời tiết hiện tại');
    }

    const weatherData: WeatherResponse = {
      temp: Math.round(data.current.temperature_2m),
      description: getWeatherDescription(data.current.weather_code),
      humidity: Math.round(data.current.relative_humidity_2m),
      windSpeed: Math.round(data.current.wind_speed_10m * 3.6) // Convert to km/h
    };

    console.log('Processed weather data:', weatherData);
    res.json(weatherData);

  } catch (error) {
    console.error('Lỗi lấy dữ liệu thời tiết:', error);
    res.status(500).json({ 
      error: 'Không thể lấy dữ liệu thời tiết',
      details: error instanceof Error ? error.message : 'Lỗi không xác định'
    });
  }
});

export default router;