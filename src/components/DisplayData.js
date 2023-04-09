import React, { useContext, useState } from 'react';
import './EnviroInfo.css'
import { MyContext } from './PassingInfo';

function DisplayData() {

  const {weatherData, sunrise, sunset, decibel, latitude, longitude} = useContext(MyContext)

  const [hidden, setHidden] = useState(false);

  const handleClick = () => {
    setHidden(true);
  }

  return (
      <div className='All' style={{position: 'absolute'}}>
        
        <div className={`Info ${hidden ? 'hidden' : ''}`} onClick={handleClick}>

          <p className='Currtemp'>
            {weatherData ? `Current temperature: ${weatherData}°F` : "Current temperature: loading..."}
          </p>

          <p className='Sunrise'>
            {sunrise ? `Sunrise: ${sunrise} UTC` : "Sunrise: loading..."}
          </p>

          <p className='Sunset'>
            {sunset ? `Sunset: ${sunset} UTC` : "Sunset: loading..."}
          </p>

          <p className='Decibel'>
            {decibel ? `Decibel Level: ${decibel} dBs` : "Decibel Level: loading..."} 
          </p>

          {/* <p className='Latitude'>
            {latitude ? `Latitude: ${latitude}` : "Latitude: loading..."}
          </p> */}

          {/* <p className='Longitude'>
            {longitude ? `Longitude: ${longitude}` : "Longitude: loading..."}
          </p> */}

        </div> 

        <div className={`hide ${hidden ? 'hidden' : ''}`} onClick={handleClick}>click to hide</div>
        
      </div>
  ); 
}

export default DisplayData;
