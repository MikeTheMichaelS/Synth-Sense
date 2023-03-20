import React, { useState, useEffect, useCallback} from 'react';
import axios from 'axios';
import BlobArt from './BlobArt';
import './EnviroInfo.css'
// import moment from 'moment-timezone';

function WeatherTemp() {
  const [weatherData, setWeatherData] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

  const [sunrise, setSunrise] = useState("");
  const [sunset, setSunset] = useState("");

  var today = new Date()
  const time = today.getHours()-1

  console.log("time" + time)

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          setLatitude(position.coords.latitude.toFixed(2));
          setLongitude(-position.coords.longitude.toFixed(2));
        },
        error => console.error(error)
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }, []);

  const getWeather = useCallback(async () => {
    axios.get(`/weather/${latitude}/${longitude}`)
      .then((response) => {
        const currentweather = response.data.hourly.temperature_2m
        console.log("curr"+currentweather[time])
        setWeatherData(currentweather[time])
      })
      .catch(error => console.log(error))
  }, [latitude, longitude]);

  useEffect(() => {
    getWeather();
  }, [getWeather]);

  const getDayLight = useCallback(async () => {
    axios.get(`/daylight/${latitude}/${longitude}`)
      .then((response) => {
        const sunrise_time_utc = response.data.results.sunrise
        const sunset_time_utc = response.data.results.sunset
        // convert sunrise and sunset times from UTC to Eastern Time
        // const sunrise_time = moment.utc(sunrise_time_utc).tz('America/New_York').format('h:mm A');
        // const sunset_time = moment.utc(sunset_time_utc).tz('America/New_York').format('h:mm A');
        // setting the state of the sunrise and sunset
        const newsunrise = (parseInt(sunrise_time_utc)+5).toString()
        console.log("sunrise "+newsunrise)
        console.log(sunrise_time_utc.charAt(0))
        setSunrise(sunrise_time_utc)
        setSunset(sunset_time_utc)
      })
      .catch(error => console.log(error))
  }, [latitude, longitude]);

  useEffect(() => {
    getDayLight();
  }, [getDayLight]);

  const baseURL = 'http://127.0.0.1:8000';
  axios.defaults.baseURL = baseURL;

  return (
    <div className='All' >
      <div className='Info' style={{ position: 'absolute'}}>
        <h1>Current temperature: {weatherData}°F</h1>
        <h1>Sunrise: {sunrise} UTC</h1>
        <h1>Sunset: {sunset} UTC</h1>       
      </div>
      <BlobArt weatherData={weatherData}/>
    </div>
  );
}

export default WeatherTemp;
