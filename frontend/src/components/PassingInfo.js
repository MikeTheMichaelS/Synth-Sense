import React, { useState, useEffect, createContext } from 'react';
import BlobArt from './BlobArt';
import axios from 'axios';

export const MyContext = createContext();

function PassingInfo() {
  // React State Area
  const [weatherData, setWeatherData] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [sunrise, setSunrise] = useState("");
  const [sunset, setSunset] = useState("");

  // Config area
  let cacheTTL = 1800000

  // Cache variable area
  var today = new Date();
  const time = today.getHours() ;
  let tempUpdateTime;
  let sunUpdateTime;
  let tempData, sunriseData, sunsetData;

  //CURRENT LOCATION: START
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


  //TEMPERATURE: START
  const getWeather = async () => {
    await axios.get
      (
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m&temperature_unit=fahrenheit&forecast_days=1&timezone=EST`
      )
      .then((response) => {
        const currentweather = response.data.hourly.temperature_2m
        tempData = response.data.hourly.temperature_2m
        tempUpdateTime = Date.now();
        setWeatherData(currentweather[time])
      })
      .catch(error => console.log(error))
  };

  useEffect(() => {
    if (tempUpdateTime == null || Date.now() - sunUpdateTime > cacheTTL) {
      if (latitude && longitude) {
        getWeather();
      }
    } else {
      const getWeather = ()=>{
        setWeatherData(tempData[time]);
      };
      getWeather();
    }
  }, [latitude, longitude, time]);
  //TEMPERATURE: END


  //SUNRISE SUNSET: START
  const getDayLight = async () => {
    await axios.get
      (
        `https://api.sunrise-sunset.org/json?date=today&lat=${latitude}&lng=${longitude}`
      )
      .then((response) => {
        const sunrise_time_utc = response.data.results.sunrise;
        const sunset_time_utc = response.data.results.sunset;
        sunriseData = response.data.results.sunrise;
        sunsetData = response.data.results.sunset;
        sunUpdateTime = Date.now()
        setSunrise(sunrise_time_utc)
        setSunset(sunset_time_utc)
      })
      .catch(error => console.log(error))
  };

  useEffect(() => {
    if (sunUpdateTime == null || Date.now() - sunUpdateTime > cacheTTL) {
      if (latitude && longitude) {
        getDayLight();
      }
    } else {
      const getDayLight = () => {
        setSunrise(sunriseData);
        setSunset(sunsetData);
      }
      getDayLight();
    }
  }, [latitude, longitude]);
  //SUNRISE SUNSET: END


  //AUDIO: START
  const [decibel, setDecibel] = useState(0);

  useEffect(() => {

    let mounted = true;
    const constraints = { audio: true };

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

        const intervalId = setInterval(updateDecibel, 300);

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

  return (
    <MyContext.Provider value={{ weatherData, sunrise, sunset, decibel, latitude, longitude }}>
      <div>      
        <BlobArt />
      </div>
    </MyContext.Provider >
  );

}

export default PassingInfo;

