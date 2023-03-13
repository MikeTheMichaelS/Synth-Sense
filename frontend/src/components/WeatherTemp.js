import React, { useState, useEffect } from 'react';
import axios from 'axios';

function WeatherTemp() {
  const [weatherData, getWeatherData] = useState("");
  // const [timeData, getTimeData] = useState("");

  axios.defaults.baseURL = 'http://127.0.0.1:8000'

  const getWeather = async () => {

    axios.get("/weather/40.71/74.00")
    .then((response) => {
      const currentweather = response.data.hourly.temperature_2m[0]
      // const currenttime = response.data.hourly.time[0]
      getWeatherData(currentweather)
      // getTimeData(currenttime)
    })
    .catch(error => console.log(error))
  };

  useEffect(() => {
    getWeather();
  }, []);

  return (
    <div className='Temp' style={{ position: 'absolute'}}>
      <h1>Current temperature: {weatherData}°F</h1>
      {/* <p>Last updated: {timeData}</p> */}
    </div>
  );
}

export default WeatherTemp;