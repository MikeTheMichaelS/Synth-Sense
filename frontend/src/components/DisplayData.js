import React, { useContext } from 'react';
import './EnviroInfo.css'
import { MyContext } from '../App';

function DisplayData() {

  const {weatherData, sunrise, sunset, decibel, latitude, longitude} = useContext(MyContext)

  return (
      <div className='All' style={{position: 'absolute'}}>
        <div className='Info' >
          <p className='Currtemp'>
            {weatherData ? `Current temperature: ${weatherData}°F` : "Current temperature: loading..."}
          </p>
          <p className='Sunrise'>
            {sunrise ? `Sunrise: ${sunrise} UTC` : "Sunrise: loading..."}
          </p>
          <p className='Sunset'>
            {sunset ? `Sunset: ${sunset} UTC` : "Sunset: loading..."}
          </p>
          <p className='Decibel'>Decibel Level: {decibel} dBs </p>
          {/* <p className='lOCATION'>Lat: {latitude} Long: {longitude} </p> */}
        </div> 
        <div className='hide'>click to hide</div>
      </div>
  ); 
}

export default DisplayData;
