import axios from 'axios';

// Constants
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes in milliseconds
const HUE_CITY_ID = 1580240; // City ID for Huế
const API_KEY = process.env.OPENWEATHERMAP_API_KEY;

// Cache structure
interface WeatherCache {
  data: WeatherResponseFull | null;
  timestamp: number;
}

let weatherCache: WeatherCache = {
  data: null,
  timestamp: 0
};

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

export async function getWeatherData(): Promise<WeatherResponseFull> {
  try {
    const now = Date.now();

    // Return cached data if still valid
    if (weatherCache.data && (now - weatherCache.timestamp) < CACHE_DURATION) {
      console.log("Returning cached weather data");
      return weatherCache.data;
    }

    console.log("Fetching new weather data...");
    const url = `https://api.openweathermap.org/data/2.5/weather?id=${HUE_CITY_ID}&units=metric&appid=${API_KEY}&lang=vi`;

    const response = await axios.get(url);
    const data = response.data as WeatherResponseFull;

    // Validate data
    if (!data || !data.main || !data.weather || data.weather.length === 0) {
      throw new Error("Received incomplete weather data from API");
    }

    // Update cache
    weatherCache = {
      data,
      timestamp: now
    };

    console.log("Weather data fetched and cached successfully");
    return data;
  } catch (error) {
    console.error("Error fetching weather data:", error);

    // If we have cached data, return it even if expired
    if (weatherCache.data) {
      console.log("Returning expired cached data due to error");
      return weatherCache.data;
    }

    throw new Error("Failed to fetch weather data and no cached data available");
  }
}

export async function fetchWeatherData() {
  return getWeatherData();
}