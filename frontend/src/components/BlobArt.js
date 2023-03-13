import { useEffect, useRef} from 'react';
import p5 from 'p5';

function sketch(p, weatherData) {
  let kMax; // maximal value for the parameter "k" of the blobs
  let step = 0.03; // difference in time between two consecutive blobs
  let n = 80; // total number of blobs
  let radius = 8; // radius of the base circle
  let inter = 0.1; // difference of base radii of two consecutive blobs
  let maxNoise = 300; // maximal value for the parameter "noisiness" for the blobs

  let temp = weatherData;
  console.log(temp)

  // let temp = 0

    // p is a reference to the p5 instance this sketch is attached to
    p.setup = function() {
        p.createCanvas(window.innerWidth, window.innerHeight);
        p.background(30);
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
      for (let i = n; i > 0; i--) {
        // let alpha = 1 - (i / n);
        // p.fill((alpha/2 + 0.75)%1, 174, 255, 9);
          if (temp > 80) {
            p.fill(253, 94, 83, 9);
          } else if (temp > 60) {
            p.fill(255, 153, 0, 9);
          } else if (temp > 40) {
            p.fill(0, 128, 128, 9);
          } else {
            p.fill(173, 216, 230, 9);
          }

        //fill(255,204,0)
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


}

function BlobArt({weatherData}) {
    // create a reference to the container in which the p5 instance should place the canvas
    const p5ContainerRef = useRef();

    useEffect(() => {
      // On component creation, instantiate a p5 object with the sketch and container reference 
      const p5Instance = new p5((p) => sketch(p, weatherData), p5ContainerRef.current);

      // On component destruction, delete the p5 instance
      return () => {
        p5Instance.remove();
      };
    }, [weatherData]);

    return (  
      <div className="Art" ref={p5ContainerRef} style={{ width: "100%", height: "100%", justifyContent: 'center', alignItems:'center'}} />
    );
}

export default BlobArt;
