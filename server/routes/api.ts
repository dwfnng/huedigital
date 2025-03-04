
import { Router } from 'express';
import { fetchWeatherData } from '../services/weatherService';

const router = Router();

// Weather endpoint - uses real OpenWeatherMap API data
router.get('/weather', async (req, res) => {
  try {
    const weatherData = await fetchWeatherData();
    res.json(weatherData);
  } catch (error) {
    console.error('Weather API error:', error);
    res.status(500).json({ error: 'Failed to fetch weather data' });
  }
});

// Traffic data endpoint - simulated
router.get('/traffic', (req, res) => {
  const levels = ['low', 'medium', 'high'];
  const level = levels[Math.floor(Math.random() * levels.length)];
  
  res.json({
    level,
    lastUpdated: new Date().toISOString()
  });
});

// Visitor count endpoint - simulated
router.get('/visitors', (req, res) => {
  const trends = ['up', 'down', 'stable'];
  const trend = trends[Math.floor(Math.random() * trends.length)];
  
  res.json({
    count: 1000 + Math.floor(Math.random() * 200),
    trend,
    lastUpdated: new Date().toISOString()
  });
});

// Location stats endpoint - simulated
router.get('/locations/stats', (req, res) => {
  const locations = [
    {
      id: 'dai-noi',
      name: 'Đại Nội Huế',
      visitorCount: 226 + Math.floor(Math.random() * 50),
      trafficLevel: Math.random() > 0.5 ? 'high' : 'medium'
    },
    {
      id: 'ky-dai',
      name: 'Kỳ Đài',
      visitorCount: 169 + Math.floor(Math.random() * 100),
      trafficLevel: Math.random() > 0.7 ? 'medium' : 'low'
    },
    {
      id: 'thien-mu',
      name: 'Chùa Thiên Mụ',
      visitorCount: 120 + Math.floor(Math.random() * 80),
      trafficLevel: Math.random() > 0.6 ? 'medium' : 'low'
    },
    {
      id: 'quoc-tu-giam',
      name: 'Quốc Tử Giám',
      visitorCount: 90 + Math.floor(Math.random() * 40),
      trafficLevel: 'low'
    }
  ];
  
  res.json(locations);
});

export default router;
