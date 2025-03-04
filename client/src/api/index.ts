export const fetchWeather = async () => {
  try {
    console.log('Fetching weather data...');
    const response = await fetch('/api/weather');
    if (!response.ok) {
      throw new Error(`Failed to fetch weather data: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    console.log('Weather data from API (complete):', JSON.stringify(data));
    return data;
  } catch (error) {
    console.error('Error in fetchWeather:', error);
    throw error;
  }
};