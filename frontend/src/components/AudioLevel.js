import React, { useState, useEffect } from 'react';
import BlobArt from './BlobArt';

function AudioLevel() {
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
    <div className='Decibels'>
      <h1>Decibel Level: {decibel} dBs </h1>
      <BlobArt decibel = {decibel} setDecibel = {setDecibel}/>
    </div>
  );
}

export default AudioLevel;
