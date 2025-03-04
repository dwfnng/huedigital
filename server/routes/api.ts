router.get('/weather', async (req, res) => {
  try {
    const data = await getWeatherData();
    // Ghi log đầy đủ dữ liệu để debug
    console.log("Weather data being sent to client:", JSON.stringify(data));
    // Trả về dữ liệu đầy đủ từ API
    res.json(data);
  } catch (error) {
    console.error('Error fetching weather data:', error);
    res.status(500).json({ error: 'Failed to fetch weather data' });
  }
});