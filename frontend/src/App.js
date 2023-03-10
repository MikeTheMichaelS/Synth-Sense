import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [weatherData, setWeatherData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get('/weather/42.36/-71.06');
      setWeatherData(response.data);
    };
    fetchData();
  }, []);

  return (
    <div className="App">
      {weatherData ? (
        <>
          <h1>Current temperature: {weatherData.temperature_2m[0].value}°F</h1>
          <p>Last updated: {weatherData.temperature_2m[0].date}</p>
        </>
      ) : (
        <p>Loading weather data...</p>
      )}
    </div>
  );
}

export default App;
