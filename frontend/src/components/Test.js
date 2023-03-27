import { useEffect, useRef, useContext } from 'react';
import { MyContext } from '../App';
import p5 from 'p5';

function Sketch(p, weatherRef, decibelRef) {
  let kMax;
  const step = 0.03;
  const n = 300;
  const radius = 4;
  const inter = 0.2;
  const maxNoise = 200;

  let size = 0;
  let temp = weatherRef.current

  p.setup = function () {
    p.createCanvas(window.innerWidth, window.innerHeight);
    p.angleMode(p.DEGREES);
    p.noFill();
    kMax = p.random(0.2, 1.0);
    p.noStroke();
  };

  p.draw = function () {
    p.background(360);

    // Smoothly transition between the old and new decibel values
    size += (decibelRef.current - size) * 0.15;

    temp = weatherRef.current;

    for (let i = n; i > 0; i -= 2) {
      const k = kMax * p.sqrt(i / n);
      const blobSize = radius + i * inter;
      if (temp >= 100) {
        p.fill(255,71,61,12)
      } 
      else if (temp < 100 && temp >= 50) {
        let lowerbound = p.color(255, 168, 61, 12) //yellow
        let upperbound = p.color(255,71,61,12) //red
        p.fill(lerpBlobColor(lowerbound,upperbound,100, 50))
      } 
      else if (temp < 50 && temp >= 0) { 
        let upperbound = p.color(255, 168, 61, 12) //yellow
        let lowerbound = p.color(66,195,255,12) //blue
        p.fill(lerpBlobColor(lowerbound,upperbound,50, 0))
      } 
      else {
        p.fill(66,195,255,12);
      }
      blob(
        blobSize + size,
        p.width / 2,
        p.height / 2,
        k,
        p.frameCount * step - i * step,
        maxNoise
      );
    }
  };

  function blob(size, xCenter, yCenter, k, t, noisiness) {
    p.beginShape();
    const angleStep = 360 / 10;
    for (let theta = 0; theta <= 360 + 2 * angleStep; theta += angleStep) {
      let r1, r2;
      r1 = p.cos(theta) + 8;
      r2 = p.sin(theta) + 8;
      const r =
        size +
        p.noise(k * r1, k * r2, t) *
          noisiness;
      const x = xCenter + r * p.cos(theta);
      const y = yCenter + r * p.sin(theta);
      p.curveVertex(x, y);
    }
    p.endShape();
  }

  function lerpBlobColor(from,to,endtemp,starttemp){
    let tempRange = endtemp-starttemp
    let tempRatio = (temp - starttemp)/tempRange     
  return (p.lerpColor(from,to,tempRatio))
}
}

function Test() {
  const p5ContainerRef = useRef();
  const { weatherData, decibel } = useContext(MyContext);
  const decibelRef = useRef(decibel);

//   const memoizedWeatherData = useMemo(() => {
//     return JSON.stringify(weatherData);
//   }, [weatherData]);

  const weatherRef = useRef(weatherData);

  useEffect(() => {
    const p5Instance = new p5((p) => Sketch(p, weatherRef, decibelRef), p5ContainerRef.current);
    return () => {
      p5Instance.remove();
    };
  }, []);

  useEffect(() => {
    decibelRef.current = decibel;
  }, [decibel]);

  useEffect(() => {
    weatherRef.current = weatherData;
  }, [weatherData]);

  return (
    <div>
      <div
        className="Art"
        ref={p5ContainerRef}
        style={{
          width: '100%',
          height: '100%',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      />
    </div>
  );
}

export default Test;