export const fetchWeather = async () => {
  const response = await fetch('/api/weather');
  if (!response.ok) {
    throw new Error('Failed to fetch weather data');
  }
  const data = await response.json();
  console.log('Weather data from API:', data);
  return data;
};