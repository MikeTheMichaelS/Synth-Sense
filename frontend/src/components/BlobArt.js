import { useEffect, useRef} from 'react';
import p5 from 'p5';

function sketch(p, weatherData, decibel) {
  let kMax; // maximal value for the parameter "k" of the blobs
  let step = 0.03; // difference in time between two consecutive blobs
  let n = 500; // total number of blobs
  let radius = 4; // radius of the base circle
  let inter = 0.2; // difference of base radii of two consecutive blobs
  let maxNoise = 300; // maximal value for the parameter "noisiness" for the blobs

  let temp = weatherData;
  console.log(temp)

    // p is a reference to the p5 instance this sketch is attached to
    p.setup = function() {
        p.createCanvas(window.innerWidth, window.innerHeight);
        // p.background(30);
        // p.circle(200, 200, 400);
        p.angleMode(p.DEGREES);
        p.noFill(2, 3, 4);
        // p.noLoop();
        kMax = p.random(0.2, 1.0);
        p.noStroke();
    }

    p.draw = function() {
      p.background(360);
      let t = p.frameCount/100;
      let start = n % 2 === 0 ? n - 1 : n;
      for (let i = start; i > 0; i -= 2){
          // if the temperature is above 100, the blob will be red
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

        let size = radius + i * inter;

        let k = kMax * p.sqrt(i/n);
        let noisiness = maxNoise * (0.8* i / n);
        blob(size, p.width/2, p.height/2, k, t - i * step, noisiness);
      }      
    }

    function blob(size, xCenter, yCenter, k, t, noisiness) {
      p.beginShape();
      let angleStep = 360 / 10;
      for (let theta = 0; theta <= 360 + 2 * angleStep; theta += angleStep) {
        let r1, r2;
        r1 = p.cos(theta)+8;
        r2 = p.sin(theta)+8; // +1 because it has to be positive for the function noise
        let r = size + p.noise(k * r1,  k * r2, t) * noisiness;
        let x = xCenter + r * p.cos(theta);
        let y = yCenter + r * p.sin(theta);
        p.curveVertex(x, y);
      }
      // p.circle(200, 200, 400);
      p.endShape();
    }

    function lerpBlobColor(from,to,endtemp,starttemp){
        let tempRange = endtemp-starttemp
        let tempRatio = (temp - starttemp)/tempRange     
      return (p.lerpColor(from,to,tempRatio))
    }

}

function BlobArt({weatherData, decibel}) {
    // create a reference to the container in which the p5 instance should place the canvas
    const p5ContainerRef = useRef();

    useEffect(() => {
      // On component creation, instantiate a p5 object with the sketch and container reference 
      const p5Instance = new p5((p) => sketch(p, weatherData, decibel), p5ContainerRef.current);

      // On component destruction, delete the p5 instance
      return () => {
        p5Instance.remove();
      };
    }, [weatherData,decibel]);

    return (  
      <div className="Art" ref={p5ContainerRef} style={{ width: "100%", height: "100%", justifyContent: 'center', alignItems:'center'}} />
    );
}

export default BlobArt;







