
import axios from 'axios';

// Interface cho dữ liệu thời tiết đầy đủ
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

// Đặt API key trong biến môi trường hoặc sử dụng một key mặc định cho demo
// Lưu ý: Bạn nên đặt API key thực trong biến môi trường OPENWEATHER_API_KEY
const API_KEY = process.env.OPENWEATHER_API_KEY || "YOUR_API_KEY_HERE";
const CITY = 'Hue,vn';

// Fetch weather data from OpenWeatherMap API
export const fetchWeatherData = async () => {
  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${CITY}&units=metric&appid=${API_KEY}&lang=vi`;
    console.log(`Fetching weather data from: ${url}`);
    
    const response = await axios.get(url);
    console.log('Weather data received:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    
    // Trả về dữ liệu mẫu khi gặp lỗi để tránh crash ứng dụng
    if (process.env.NODE_ENV !== 'production') {
      console.log('Returning mock data for development');
      return getMockWeatherData();
    }
    
    throw error;
  }
};

// Hàm này cung cấp dữ liệu mẫu khi API thực không hoạt động
function getMockWeatherData(): WeatherResponseFull {
  return {
    coord: { lon: 107.59, lat: 16.46 },
    weather: [
      {
        id: 800,
        main: "Clear",
        description: "bầu trời quang đãng",
        icon: "01d"
      }
    ],
    base: "stations",
    main: {
      temp: 29.5,
      feels_like: 32.1,
      temp_min: 29.5,
      temp_max: 29.5,
      pressure: 1011,
      humidity: 70
    },
    visibility: 10000,
    wind: {
      speed: 2.06,
      deg: 130
    },
    clouds: {
      all: 0
    },
    dt: Date.now() / 1000,
    sys: {
      type: 1,
      id: 9308,
      country: "VN",
      sunrise: 1646211722,
      sunset: 1646254329
    },
    timezone: 25200,
    id: 1580240,
    name: "Huế",
    cod: 200
  };
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
    
    // Trả về dữ liệu mẫu khi gặp lỗi
    if (process.env.NODE_ENV !== 'production') {
      return getMockWeatherData();
    }
    
    throw error;
  }
}
