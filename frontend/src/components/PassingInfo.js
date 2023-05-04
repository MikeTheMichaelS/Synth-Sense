// Import required packages and components
import React, { useState, useEffect, createContext, useRef, useCallback } from 'react';
import BlobArt from './BlobArt';
import axios from 'axios';

// Create context
export const MyContext = createContext();

function PassingInfo() {
  // React State Area
  const [weatherData, setWeatherData] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [sunrise, setSunrise] = useState("");
  const [sunset, setSunset] = useState("");

  // Cache configuration
  let cacheTTL = 1800000 // Cache Time To Live set to 30 minutes

  // Cache variable area
  const today = new Date();
  const time = today.getHours();
  const tempUpdateTime = useRef(null);
  const sunUpdateTime = useRef(null);
  const tempData = useRef(null);
  const sunriseData = useRef(null);
  const sunsetData = useRef(null);
  //CURRENT LOCATION: START using Geolocation API
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          setLatitude(position.coords.latitude.toFixed(2));
          setLongitude(position.coords.longitude.toFixed(2));
        },
        error => console.error(error)
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }, []);
  //CURRENT LOCATION: END


  //TEMPERATURE: START using Open Meteo API
  const getWeather = useCallback(async () => {
    await axios.get
      (
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m&temperature_unit=fahrenheit&forecast_days=1&timezone=EST`
      )
      .then((response) => {
        const currentweather = response.data.hourly.temperature_2m
        tempData.current = response.data.hourly.temperature_2m
        tempUpdateTime.current = Date.now();
        setWeatherData(currentweather[time])
      })
      .catch(error => console.log(error))
  }, [latitude, longitude, time]);

  // Update weather data if cache has expired
  useEffect(() => {
    if (tempUpdateTime.current == null || Date.now() - sunUpdateTime.current > cacheTTL) {
      if (latitude && longitude) {
        getWeather();
      }
    } else {
      const getWeather = () => {
        setWeatherData(tempData.current[time]);
      };
      getWeather();
    }
  }, [latitude, longitude, time, cacheTTL, getWeather, tempData, tempUpdateTime, sunUpdateTime]);
  //TEMPERATURE: END


  //SUNRISE SUNSET: START using Sunrise Sunset API
  const getDayLight = useCallback(async () => {
    await axios.get
      (
        `https://api.sunrise-sunset.org/json?date=today&lat=${latitude}&lng=${longitude}`
      )
      .then((response) => {
        const sunrise_time_utc = response.data.results.sunrise;
        const sunset_time_utc = response.data.results.sunset;
        sunriseData.current = response.data.results.sunrise;
        sunsetData.current = response.data.results.sunset;
        sunUpdateTime.current = Date.now()
        setSunrise(sunrise_time_utc)
        setSunset(sunset_time_utc)
      })
      .catch(error => console.log(error))
  }, [latitude, longitude]);

  // Update sunrise and sunset data if cache has expired
  useEffect(() => {
    if (sunUpdateTime.current == null || Date.now() - sunUpdateTime.current > cacheTTL) {
      if (latitude && longitude) {
        getDayLight();
      }
    } else {
      const getDayLight = () => {
        setSunrise(sunriseData.current);
        setSunset(sunsetData.current);
      }
      getDayLight();
    }
  }, [latitude, longitude, time, cacheTTL, getWeather, tempData, tempUpdateTime, sunUpdateTime, getDayLight, sunriseData, sunsetData]);
  //SUNRISE SUNSET: END


  //AUDIO: START using Web Audio API
  const [decibel, setDecibel] = useState(0);

  useEffect(() => {
    // Flag to determine if component is mounted
    let mounted = true;
    const constraints = { audio: true };

    // Request access to the user's microphone
    navigator.mediaDevices.getUserMedia(constraints)
      .then(stream => {
        const audioContext = new AudioContext();
        const source = audioContext.createMediaStreamSource(stream);
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 2048;
        source.connect(analyser);

        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Float32Array(bufferLength);

        const updateDecibel = () => {
          if (mounted) {
            analyser.getFloatTimeDomainData(dataArray);
            const rms = Math.sqrt(
              Array.from(dataArray).reduce((acc, val) => acc + val ** 2, 0) / bufferLength
            );
            const ref = 0.00002; // reference value for 0 dB SPL
            const newDecibel = 20 * Math.log10(rms / ref);
            setDecibel(newDecibel.toFixed(0));
          }
        };

        // Update decibel level every 300ms
        const intervalId = setInterval(updateDecibel, 300);

        // Clean up function for when the component is unmounted
        return () => {
          mounted = false;
          clearInterval(intervalId);
          audioContext.close();
          stream.getTracks().forEach(track => track.stop());
        };
      })
      .catch(error => {
        console.log(error);
      });
  }, []);
  //AUDIO: END

  // Return the provider with all the data as context values
  return (
    <MyContext.Provider value={{ weatherData, sunrise, sunset, decibel, latitude, longitude }}>
      <div>
        <BlobArt />
      </div>
    </MyContext.Provider >
  );

}

// Export the PassingInfo component
export default PassingInfo;

