import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BlobArt from './BlobArt';

function WeatherTemp() {
  const [weatherData, getWeatherData] = useState("");
  // const [timeData, getTimeData] = useState("");

  axios.defaults.baseURL = 'http://127.0.0.1:8000'

  const getWeather = async () => {

    axios.get("/weather/36.5/-116.93")
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
    <div className='Temp' style={
      { position: 'absolute'}}>
      <h1>Current temperature: {weatherData}°F</h1>
      <BlobArt weatherData = {weatherData} getWeatherData = {getWeatherData}/>
    </div>
  );
}

export const getWeather2 = async () => {

  axios.get("/weather/42.36/-71.06")
  .then((response) => {
    return response.data.hourly.temperature_2m[0]
  })
  .catch(error => console.log(error))
};

export const test = async () => {
  return Promise.resolve(50);
};

export default WeatherTemp;