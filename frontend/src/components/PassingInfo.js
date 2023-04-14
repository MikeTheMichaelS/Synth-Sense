import DisplayData from './DisplayData';
import React, { useState, useEffect, createContext } from 'react';
import Test from './Test';
import axios from 'axios';
import TestML5 from './TestML5';
import './PassingInfo.css';

export const MyContext = createContext();

function PassingInfo() {
  const [weatherData, setWeatherData] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [sunrise, setSunrise] = useState("");
  const [sunset, setSunset] = useState("");

  var today = new Date()
  const time = today.getHours() - 1

  //   console.log("time" + time)

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
        await axios.get(`/weather/${latitude}/${longitude * -1}`)
          .then((response) => {
            const currentweather = response.data.hourly.temperature_2m
            console.log("curr" + currentweather[time])
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
        await axios.get(`/daylight/${latitude}/${longitude * -1}`)
          .then((response) => {
            const sunrise_time_utc = response.data.results.sunrise
            const sunset_time_utc = response.data.results.sunset

            console.log("test: " + sunrise_time_utc.charAt(0))
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

  //   console.log(weatherData)

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

  //DATA DISPLAY
  const [isCircle1Active, setIsCircle1Active] = useState(false);
  const [isCircle2Active, setIsCircle2Active] = useState(false);
  const [isCircle3Active, setIsCircle3Active] = useState(false);

  // circle hover
  const handleHoverCircle1 = () => {
    if (isCircle1Active) {
      setIsCircle1Active(false);
    } else {
      setIsCircle1Active(true);
    }

    if (isCircle2Active) {
      setIsCircle2Active(false);
    }

    if (isCircle3Active) {
      setIsCircle3Active(false);
    }
  }

  const handleHoverCircle2 = () => {
    if (isCircle2Active) {
      setIsCircle2Active(false);
    } else {
      setIsCircle2Active(true);
    }

    if (isCircle1Active) {
      setIsCircle1Active(false);
    }

    if (isCircle3Active) {
      setIsCircle3Active(false);
    }
  }

  const handleHoverCircle3 = () => {
        if (isCircle3Active) {
      setIsCircle3Active(false);
    } else {
      setIsCircle3Active(true);
    }

    if (isCircle1Active) {
      setIsCircle1Active(false);
    }

    if (isCircle2Active) {
      setIsCircle2Active(false);
    }
  }

  // const handleLeaveCircle2 = () => {
  //   setIsHoveringCircle2(false);
  // }

  // const handleHoverCircle3 = () => {
  //   setIsHoveringCircle3(true);
  // }

  // const handleLeaveCircle3 = () => {
  //   setIsHoveringCircle3(false);
  // }


  return (
    <MyContext.Provider value={{ weatherData, sunrise, sunset, decibel, latitude, longitude }}>
      <div>
        {/* Display Data Circle */}
        <div style={{ position: 'relative', top: '10vh', left: '10vh' }}>
          <div
            className="circle1"
            onMouseEnter={handleHoverCircle1}
            // onMouseLeave={handleLeaveCircle1}
            style={{ position: 'absolute'}}
          />
          {isCircle1Active && <DisplayData/> }
        </div>

        {/* Development Credits */}
        <div style={{ position: 'relative', top: '30vh', left: '80vw' }}>
          <div
            className="circle2"
            onMouseEnter={handleHoverCircle2}
            // onMouseLeave={handleLeaveCircle2}
            style={{ position: 'absolute' }}
          />
          {isCircle2Active && (
            <p
              className="credits"
              style={{
                position: 'fixed',
                top: 0,
                left: '50%',
                transform: 'translateX(-50%)',
                margin: 0,
                whiteSpace: 'nowrap',
              }}
            >
              Jack Campbell | Selena Zheng | Mustafa Taibah | Micheal Sun
            </p>
          )}
      </div>


        
        {/* Third Circle */}
        <div style={{ position: 'relative', top: '75vh', left: '5vh' }}>
          <div
            className="circle3"
            onMouseEnter={handleHoverCircle3}
            // onMouseLeave={handleLeaveCircle3}
            style={{ position: 'absolute', zIndex: 1 }}
          />
          {isCircle3Active && (
            <p
              className="Pseudo"
              style={{ position: 'absolute', zIndex: 2, display: 'flex', flexDirection: 'column' }}>
              What do you think we should put here?<br />
            </p>
          )}
        </div>

        <Test />
        {/* <BlobArt /> */}
        {/* <TestML5 /> */}
      </div>
    </MyContext.Provider>
  );

}

export default PassingInfo;

