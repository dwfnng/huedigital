
import axios from 'axios';

const API_KEY = process.env.OPENWEATHER_API_KEY || "ef0b0973b783e0614ac87612ec04344b";
const CITY = 'Hue,vn';

interface WeatherResponseFull {
  coord: {
    lon: number;
    lat: number;
  };
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  base: string;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
    sea_level?: number;
    grnd_level?: number;
  };
  visibility: number;
  wind: {
    speed: number;
    deg: number;
    gust?: number;
  };
  clouds: {
    all: number;
  };
  rain?: {
    '1h'?: number;
    '3h'?: number;
  };
  snow?: {
    '1h'?: number;
    '3h'?: number;
  };
  dt: number;
  sys: {
    type?: number;
    id?: number;
    country: string;
    sunrise: number;
    sunset: number;
  };
  timezone: number;
  id: number;
  name: string;
  cod: number;
}

export async function getWeatherData() {
  try {
    console.log("Fetching new weather data...");
    const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${CITY}&units=metric&appid=${API_KEY}`);
    const data = response.data as WeatherResponseFull;
    
    // Kiểm tra dữ liệu nhận được
    if (!data || !data.main || !data.weather || data.weather.length === 0) {
      console.error("Received incomplete weather data:", data);
      throw new Error("Received incomplete weather data from API");
    }
    
    console.log("Weather data received:", JSON.stringify(data));
    
    // Trả về dữ liệu đầy đủ từ API
    return data;
  } catch (error) {
    console.error("Error fetching weather data:", error);
    throw error;
  }
}
