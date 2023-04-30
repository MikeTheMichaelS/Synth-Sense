import { useEffect, useRef, useContext} from 'react';
import { MyContext } from './PassingInfo';
import p5 from 'p5';
import * as ml5 from "ml5";
import './FontStuff.css';

function sqrt_cache (NUM_POINTS, p) {
  let p_sqrt = [];
  for (let i = NUM_POINTS; i > 0; i -= 2) {
    p_sqrt.push(p.sqrt(i / NUM_POINTS));
  }
  return p_sqrt;
}

function trig_cache (p) {
  let p_cos = [];
  let p_sin = [];
  for (let theta = 0; theta <= 360 + 2 * 36; theta += 36) {
    const radians = p.radians(theta);
    p_cos.push(p.cos(radians)); 
    p_sin.push(p.sin(radians));
  }
  return [p_cos, p_sin]
}

function Sketch(p, weatherRef, decibelRef, sunriseRef, sunsetRef) {
  // P5 variables
  let kMax;
  const STEP_SIZE = 0.03;
  const NUM_POINTS = 200;
  const RADIUS = 4;
  const INTERVAL = 0.2;
  const MAX_NOISE = 200;
  
  let size = 0;
  let [temp, sunrise, sunset] = [weatherRef.current, sunriseRef.current, sunsetRef.current];

  // PoseNet variables
  let video;
  let poseNet;
  let poses = [];
  let [posX, posY] = [p.width/2, p.height/2];
  let wposX, wposY;
  let [prevPosX, prevPosY] = [p.width/2, p.height/2];
  
  // Caches
  let p_sqrt = sqrt_cache(NUM_POINTS, p);
  let [p_cos, p_sin] = trig_cache(p);

  // Colors
  let yellow  = p.color(255, 168, 61, 12); //yellow
  let red = p.color(255, 71, 61, 12); //red
  let blue = p.color(66, 195, 255, 12); //blue

  // Ellipse trail-related variables
  let wristTrail = []; 
  let maxTrailLength = 40; 
  let ellipseSize = 10; 
  let trailColor1, trailColor2; 

  // Circle fill colors
  let currcolor;
  let [circleFill1, circleFill2, circleFill3] = 'none';

  function setupPoseNet() {
    video = p.createCapture(p.VIDEO);
    video.size(window.innerWidth, window.innerHeight);
    poseNet = ml5.poseNet(video, ml5.modelReady, {maxPose: 1 });
    poseNet.on('pose', function(results) {
        poses = results;
    });
  }

  p.setup = function () {
    p.createCanvas(window.innerWidth, window.innerHeight);
    p.angleMode(p.DEGREES);
    p.noFill();
    kMax = p.random(0.2, 1.0);
    p.noStroke();

    setupPoseNet();
    
    p.textAlign(p.CENTER, p.TOP);
    p.textSize(0.025 * p.width);
    p.textFont('BaiJamjuree');

    video.hide();
  };

  p.modelReady = function() {
    p.select('#status').html('Model Loaded');
  };

  function drawGradientTrail(wristTrail, trailColor1, trailColor2, ellipseSize) {
      // Draw gradient trail
      for (let i = 0; i < wristTrail.length; i++) {
        let currentPos = wristTrail[i];
        let gradientColor = p.lerpColor(trailColor1, trailColor2, i / (wristTrail.length));
        p.fill(gradientColor);
        p.noStroke();
        p.ellipse(currentPos.x, currentPos.y, ellipseSize, ellipseSize);
      }
  }

  // USELESS FUNCTION: JACK FIX THIS!!
  function updateKeypoints(positionX, positionY, wristPositionX, wristPositionY, i) {
    let pose = poses[i].pose;
    let noseKeypoint = pose.keypoints.find((keypoint) => keypoint.part === 'nose');
    if (noseKeypoint && noseKeypoint.score > 0.6) {
      [positionX, positionY] = [p.width - noseKeypoint.position.x, noseKeypoint.position.y];
    }
     
    let wristKeypoint = pose.keypoints[10]; // index 10 represents the wrist keypoint
    if (wristKeypoint.score > 0.4) {
       [wristPositionX, wristPositionY] = [p.width - wristKeypoint.position.x, wristKeypoint.position.y];
       wristTrail.push(p.createVector(wristPositionX, wristPositionY));
    }

     // Limit wristTrail array to maximum length
    if (wristTrail.length > maxTrailLength) {
      wristTrail.shift(); // Remove oldest position

      drawGradientTrail(wristTrail, trailColor1, trailColor2, ellipseSize);    
    }

    return [positionX, positionY, wristPositionX, wristPositionY]
  }

  // A function to draw ellipses over the detected keypoints
  p.drawKeypoints = function() {
    let [positionX, positionY] = [p.width/2, p.height/2]
    let [wristPositionX, wristPositionY] = [p.width/2, p.height/2]
    
    // Loop through all the poses detected
    for (let i = 0; i < poses.length; i++) {
      let pose = poses[i].pose;
      let noseKeypoint = pose.keypoints.find((keypoint) => keypoint.part === 'nose');
      if (noseKeypoint && noseKeypoint.score > 0.6) {
        [positionX, positionY] = [p.width - noseKeypoint.position.x, noseKeypoint.position.y];
      }
       
      let wristKeypoint = pose.keypoints[10]; // index 10 represents the wrist keypoint
      if (wristKeypoint.score > 0.4) {
         [wristPositionX, wristPositionY] = [p.width - wristKeypoint.position.x, wristKeypoint.position.y];
         wristTrail.push(p.createVector(wristPositionX, wristPositionY));
      }
  
       // Limit wristTrail array to maximum length
      if (wristTrail.length > maxTrailLength) {
        wristTrail.shift(); // Remove oldest position
        drawGradientTrail(wristTrail, trailColor1, trailColor2, ellipseSize);
      }
    }
    console.log(positionX,positionY)
    return [positionX, positionY, wristPositionX, wristPositionY];
  }

  function drawBlob(i) {
    p.noStroke();
    const k = kMax * p_sqrt[p_sqrt.length - ((300-i) / 2+1)];
    const blobSize = RADIUS + i * INTERVAL;
    let fillColor = getFillColor(temp);
    blob(
      blobSize + size,
      posX,
      posY,
      k,
      p.frameCount * STEP_SIZE - i * STEP_SIZE,
      MAX_NOISE,
      fillColor
    );
    return fillColor
  }

  p.draw = function () {
    p.background(360);

    // Smoothly transition between the old and new decibel values
    size += (decibelRef.current - size) * 0.15;
    temp = weatherRef.current;

    const keypoints = this.drawKeypoints();

    if (video) {
      [posX, posY] = [keypoints[0], keypoints[1]];
      [wposX, wposY] = [keypoints[2], keypoints[3]];
    }
    
    [prevPosX, prevPosY] = [posX, posY];

    let fillColor;
    for (let i = NUM_POINTS; i > 0; i -= 2) {
      fillColor = drawBlob(i);
    }
    currcolor = p.color(255 - p.red(fillColor), 255 - p.green(fillColor), 255 - p.blue(fillColor)); // (!! TENTATIVE CHANGE !!): moved currcolor assignment outside of FOR loop

    currcolor.setAlpha(100);
    
    trailColor1 = p.color(255, 255, 255); // Start color (white)
    trailColor2 = currcolor; // End color (blobcolor)

    const currentDate = new Date(); // DUPLICATE??
    const currentEDT = currentDate.toLocaleString('en-US', {
      timeZone: 'America/New_York',
      hour12: true,
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric'
    });

    drawellipses(currcolor, wposX, wposY, p.width, p.height);
    createCircle(circleFill1, 1, currcolor, 0.83, 0.3, 0.05)
    createCircle(circleFill2, 1, currcolor, 0.2, 0.4, 0.05)
    createCircle(circleFill3, 1, currcolor, 0.7, 0.7, 0.05)

    p.fill('black');
    p.text(`${currentEDT}`,  p.width*.915, p.height*.91)
  };

  function createCircle(circleFill1, weight, currcolor, x, y, size) {
    p.fill(circleFill1);
    p.strokeWeight(weight);
    p.stroke(currcolor);
    p.circle(p.width*x, p.height*y, p.width*size);
  }

  function drawellipses(color, xpoint, ypoint, sw, sh) {
    let [circle1, circle2, circle3] = [p.createVector(sw*0.83, sh*0.3), p.createVector(sw*0.2, sh*0.4), p.createVector(sw*0.7, sh*0.7)];
    let [distance1, distance2, distance3] = [p.dist(xpoint, ypoint, circle1.x, circle1.y), p.dist(xpoint, ypoint, circle2.x, circle2.y), p.dist(xpoint, ypoint, circle3.x, circle3.y)];
    console.log("distance1: " + distance1)

    const currentDate = new Date(); // DUPLICATE?
    const sunriseDate = new Date(`${currentDate.toLocaleDateString()} ${sunriseRef.current} UTC`); // combine current date with sunrise time in UTC
    const sunsetDate = new Date(`${currentDate.toLocaleDateString()} ${sunsetRef.current} UTC`); 
    
    const sunriseEDT = sunriseDate.toLocaleString('en-US', {
      timeZone: 'America/New_York',
      hour12: true,
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric'
    });
    
    const sunsetEDT = sunsetDate.toLocaleString('en-US', {
      timeZone: 'America/New_York',
      hour12: true,
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric'
    });

    const clear = p.color(255, 0, 0, 0);
    handleDistance1(distance1, sw, sunriseEDT, temp, sunsetEDT, p, color, clear);
    handleDistance2(distance2, sw, p, color, clear );
    handleDistance3(distance3, sw, decibelRef, p, color, clear);
  }

  function blob(size, xCenter, yCenter, k, t, noisiness, color) {
    p.fill(color);
    p.beginShape();
    let cosTheta;
    let sinTheta;
    let x, y;
    let r, r1, r2;
    
    for (let i = 0; i < p_cos.length; i++) {
      [cosTheta, sinTheta] = [p_cos[i], p_sin[i]];
      [r1, r2] = [cosTheta + 8, sinTheta + 8];
  
      r = size + p.noise(k * r1, k * r2, t) * noisiness;
  
      [x, y] = [xCenter + r * cosTheta, yCenter + r * sinTheta];
      [posX, posY] = [p.lerp(prevPosX, x, 0.2), p.lerp(prevPosY, y, 0.2)];
  
      p.curveVertex(x, y);
    }
    p.endShape();
  }

  function handleDistance1(distance1, sw, sunriseEDT, temp, sunsetEDT, p, color, clear) {
    // console.log("color " + color)
    if (distance1 <= sw * 0.05) {
      circleFill1 = color;
      circleFill2 = clear;
      circleFill3 = clear;
      p.fill("black");
      p.text(
        `${sunriseEDT ? `Sunrise: ${sunriseEDT}` : "Sunrise: loading..."} ` +
          " | " +
          `${temp ? `Current temperature: ${temp}°F` : "Current temperature: loading..."} ` +
          " | " +
          `${sunsetEDT ? `Sunset: ${sunsetEDT}` : "Sunset: loading..."} `,
        p.width / 2,
        10
      );
      console.log(sunrise, temp, sunset);
    } else {
      circleFill1 = clear;
    }
  }
  
  function handleDistance2(distance2, sw, p, color, clear) {
    if (distance2 <= sw * 0.05) {
      circleFill2 = color;
      circleFill1 = clear;
      circleFill3 = clear;
      p.fill("black");
      p.text(
        "Jack Campbell | Selena Zheng | Mustafa Taibah | Michael Sun",
        p.width / 2,
        10
      );
    } else {
      circleFill2 = clear;
    }
  }
  
  function handleDistance3(distance3, sw, decibelRef, p, color, clear) {
    if (distance3 <= sw * 0.05) {
      circleFill2 = clear;
      circleFill3 = color;
      circleFill1 = clear;
      p.fill("black");
      p.text(
        decibelRef.current ? `Decibel: ${decibelRef.current} dBs` : "Decibel: loading...",
        p.width / 2,
        10
      );
    } else {
      circleFill3 = clear;
    }
  }
  
  function lerpBlobColor(from, to, endtemp, starttemp) {
    let tempRange = endtemp-starttemp
    let tempRatio = (temp - starttemp)/(tempRange)     
    return (p.lerpColor(from,to,tempRatio))
  }

  function getFillColor(temp) {
    let fillColor;
    if (temp >= 100) {
      fillColor = red
    } 
    else if (temp < 100 && temp >= 50) {
      fillColor = lerpBlobColor(yellow, red, 100, 50);
    } 
    else if (temp < 50 && temp >= 0) { 
      fillColor = lerpBlobColor(blue, yellow, 50, 0);
    } 
    else {
      fillColor = blue
    }
    return fillColor
  } 
} //end sketch

function Test() {
  const p5ContainerRef = useRef();
  const { weatherData, decibel, sunrise, sunset } = useContext(MyContext);
  const decibelRef = useRef(decibel);
  const weatherRef = useRef(weatherData);
  const sunriseRef = useRef(sunrise);
  const sunsetRef = useRef(sunrise);

  useEffect(() => {
    const p5Instance = new p5((p) => 
      Sketch(p, weatherRef, decibelRef, sunriseRef, sunsetRef), p5ContainerRef.current);
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

  useEffect(() => {
    sunriseRef.current = sunrise;
    console.log("useEffect" + sunrise)
  }, [sunrise]);

  useEffect(() => {
    sunsetRef.current = sunset;
  }, [sunset]);

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