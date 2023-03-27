import DisplayData from './components/DisplayData';
import BlobArt from './components/BlobArt';
import React, { useState, useEffect, createContext } from 'react';
import Test from './components/Test';
import axios from 'axios';

export const MyContext = createContext();

function App() {
  const [weatherData, setWeatherData] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [sunrise, setSunrise] = useState("");
  const [sunset, setSunset] = useState("");

  var today = new Date()
  const time = today.getHours()-1

  console.log("time" + time)

//CURRENT LOCATION
  useEffect(() => {
    if (navigator.geolocation) {
      console.log('Getting current position...')
      navigator.geolocation.getCurrentPosition(
        position => {
          console.log('Position retrieved:', position)
          setLatitude(position.coords.latitude.toFixed(2));
          setLongitude(position.coords.longitude.toFixed(2));
        },
        error => console.error(error)
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }, []);

//TEMPERATURE
  useEffect(() => {
    if (latitude && longitude) {
      const getWeather = async () => {
        await axios.get(`/weather/${latitude}/${longitude*-1}`)
          .then((response) => {
            const currentweather = response.data.hourly.temperature_2m
            console.log("curr"+currentweather[time])
            setWeatherData(currentweather[time])
          })
          .catch(error => console.log(error))
      };
      getWeather();
    }
  }, [latitude, longitude, time]);

//SUNRISE SUNSET
  useEffect(() => {
    if (latitude && longitude) {
      const getDayLight = async () => {
        await axios.get(`/daylight/${latitude}/${longitude*-1}`)
          .then((response) => {
            const sunrise_time_utc = response.data.results.sunrise
            const sunset_time_utc = response.data.results.sunset

            console.log("test: "+ sunrise_time_utc.charAt(0))
            // convert sunrise and sunset times from UTC to Eastern Time
            // const sunrise_time = moment.utc(sunrise_time_utc).tz('America/New_York').format('h:mm A');
            // const sunset_time = moment.utc(sunset_time_utc).tz('America/New_York').format('h:mm A');
            // setting the state of the sunrise and sunset
            // const newsunrise = (parseInt(sunrise_time_utc.charAt(0))+5).toString() + sunrise_time_utc.substring(1)
            // const newsunset = (parseInt(sunset_time_utc.charAt(0))+5).toString() + sunset_time_utc.substring(1)
            setSunrise(sunrise_time_utc)
            setSunset(sunset_time_utc)
          })
          .catch(error => console.log(error))
      };
      getDayLight();
    }
  }, [latitude, longitude]);

  const baseURL = 'http://127.0.0.1:8000';
  axios.defaults.baseURL = baseURL;

  console.log(weatherData)

  //AUDIO 
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

  return (
    <MyContext.Provider value={{ weatherData, sunrise, sunset, decibel, latitude, longitude}}>
      <div>
        <DisplayData />
        <Test />
        {/* <BlobArt /> */}
      </div>
    </MyContext.Provider>
  );
  
}

export default App;

