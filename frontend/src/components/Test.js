import { useEffect, useRef, useContext} from 'react';
import { MyContext } from './PassingInfo';
import p5 from 'p5';
import * as ml5 from "ml5";
import './FontStuff.css';

function Sketch(p, weatherRef, decibelRef, sunriseRef, sunsetRef) {
  let kMax;
  const step = 0.03;
  const n = 300;
  const radius = 4;
  const inter = 0.2;
  const maxNoise = 200;
  
  let size = 0;
  let temp = weatherRef.current
  let sunrise = sunriseRef.current
  let sunset = sunsetRef.current

  // poseNet variables
  let video;
  let poseNet;
  // let handpose;
  let poses = [];
  // let predictions = [];
  let posX = p.width/2
  let posY = p.height/2
  let wposX 
  let wposY 
  let prevPosX = p.width/2;
  let prevPosY = p.height/2;

  let currcolor;
  
  // sqrt cache
  let p_sqrt = [];
  for (let i = n; i > 0; i -= 2) {
    p_sqrt.push(p.sqrt(i / n));
  }

  // cos and sin cache
  let p_cos = [];
  let p_sin = [];
  for (let theta = 0; theta <= 360 + 2 * 36; theta += 36) {
    const radians = p.radians(theta);
    p_cos.push(p.cos(radians)); 
    p_sin.push(p.sin(radians));
  }

  // colors
  let yellow  = p.color(255, 168, 61, 12); //yellow
  let red = p.color(255,71,61,12); //red
  let blue = p.color(66,195,255,12); //blue

  let wristTrail = []; // Array to store wrist positions for ellipse trail
  let maxTrailLength = 40; // Maximum number of wrist positions to store
  let ellipseSize = 10; // Size of ellipses in the trail
  let trailColor1, trailColor2; // Colors for ellipse trail

  let circleFill = 'none';
  let circleFill2 = 'none';
  let circleFill3 = 'none';

  p.setup = function () {
    p.createCanvas(window.innerWidth, window.innerHeight);
    p.angleMode(p.DEGREES);
    p.noFill();
    kMax = p.random(0.2, 1.0);
    p.noStroke();

    video = p.createCapture(p.VIDEO);
    video.size(window.innerWidth, window.innerHeight);
    // Create a new poseNet method with a single detection
    poseNet = ml5.poseNet(video, ml5.modelReady, {maxPose: 1 });
    // This sets up an event that fills the global variable "poses"
    // with an array every time new poses are detected
    poseNet.on('pose', function(results) {
        poses = results;
    });

    trailColor1 = p.color(255, 255, 255); // Start color (black)
    trailColor2 = p.color(0, 0, 0); // End color (white)
    
    p.textAlign(p.CENTER, p.TOP);
    p.textSize(0.02 * p.width);
    p.textFont('BaiJamjuree');

    video.hide();
  };

  p.modelReady = function() {
    p.select('#status').html('Model Loaded');
  };

  // A function to draw ellipses over the detected keypoints
  p.drawKeypoints = function() {
    let [positionX, positionY] = [p.width/2, p.height/2]
    let [wristPositionX, wristPositionY] = [p.width/2, p.height/2]
    
    // Loop through all the poses detected
    for (let i = 0; i < poses.length; i++) {
      // For each pose detected, loop through all the keypoints
      let pose = poses[i].pose;
      // Get the nose keypoint
      let noseKeypoint = pose.keypoints.find((keypoint) => keypoint.part === 'nose');
      // Only draw an ellipse if the nose keypoint is detected with a score greater than 0.6
      if (noseKeypoint && noseKeypoint.score > 0.6) {
        // Update the positionX and positionY with the nose keypoint's position
        [positionX, positionY] = [p.width - noseKeypoint.position.x, noseKeypoint.position.y];
      }
      let wristKeypoint = pose.keypoints[10]; // index 10 represents the wrist keypoint
      if (wristKeypoint.score > 0.4) {
        [wristPositionX, wristPositionY] = [p.width - wristKeypoint.position.x, wristKeypoint.position.y];
        wristTrail.push(p.createVector(wristPositionX, wristPositionY));
        // Move the mouse cursor to the wrist position
        // let mouseXPos = p.map(wristPositionX, 0, p.width, 0, p.windowWidth);
        // let mouseYPos = p.map(wristPositionY, 0, p.height, 0, p.windowHeight);
        // p.mouseX = mouseXPos;
        // p.mouseY = mouseYPos;
      }
      // Limit wristTrail array to maximum length
      if (wristTrail.length > maxTrailLength) {
        wristTrail.shift(); // Remove oldest position
        // Draw gradient trail
        for (let i = 0; i < wristTrail.length; i++) {
          let currentPos = wristTrail[i];
          let gradientColor = p.lerpColor(trailColor1, trailColor2, i / (wristTrail.length));
          p.fill(gradientColor);
          p.noStroke();
          p.ellipse(currentPos.x, currentPos.y, ellipseSize, ellipseSize);
        }
      }
    }
    return [positionX, positionY, wristPositionX, wristPositionY];
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

    for (let i = n; i > 0; i -= 2) {
      p.noStroke();
      const k = kMax * p_sqrt[p_sqrt.length - ((300-i) / 2+1)];
      const blobSize = radius + i * inter;
      let fillColor
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

      blob(
        blobSize + size,
        posX,
        posY,
        k,
        p.frameCount * step - i * step,
        maxNoise,
        fillColor
      );

      currcolor = fillColor
    }

    currcolor.setAlpha(150);

    drawellipses(currcolor, wposX, wposY, p.width, p.height);
    p.fill(circleFill);
    p.strokeWeight(1);
    p.stroke(currcolor);
    p.circle(p.width*0.85, p.height*0.3, p.width*0.05);

    p.fill(circleFill2);
    p.strokeWeight(1);
    p.stroke(currcolor);
    p.circle(p.width*0.2, p.height*0.4, p.width*0.05);

    p.fill(circleFill3);
    p.strokeWeight(1);
    p.stroke(currcolor);
    p.circle(p.width*0.7, p.height*0.7, p.width*0.05);
  };

  function drawellipses(color, xpoint, ypoint, sw, sh){
    let circle1 = p.createVector(sw*0.85, sh*0.3);
    let distance = p.dist(xpoint, ypoint, circle1.x, circle1.y);
    let circle2 = p.createVector(sw*0.2, sh*0.4);
    let distance2 = p.dist(xpoint, ypoint, circle2.x, circle2.y);
    let circle3 = p.createVector(sw*0.7, sh*0.7);
    let distance3 = p.dist(xpoint, ypoint, circle3.x, circle3.y);

    const clear = p.color(255, 0, 0, 0);
    if (distance <= sw*0.05) {
      circleFill = color;
      circleFill2 = clear
      circleFill3 = clear
      p.fill('black');
      // p.text("Hello World!", p.width/2, 10);
      p.text(temp ? `Current temperature: ${temp}°F` : "Current temperature: loading..." , p.width/2, 10);
    } else {
      circleFill = clear
    }
    
    if (distance2 <= sw*0.05) {
      circleFill2 = color;
      circleFill = clear
      circleFill3 = clear
      p.fill('black');
      // p.text("Hello World!", p.width/2, 10);
      p.text("Jack Campbell | Selena Zheng | Mustafa Taibah | Michael Sun" , p.width/2, 10);
    } else {
      circleFill2 = clear
    }
    
    if (distance3 <= sw*0.05) {
      circleFill2 = clear  
      circleFill3 = color;
      circleFill = clear
      p.fill('black');
      // p.text("Hello World!", p.width/2, 10);
      p.text(decibelRef.current ? `Decibel: ${decibelRef.current} dBs` : "Decibel: loading..." , p.width/2, 10);
    } else {
      circleFill3 = clear
    }
    
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

  function lerpBlobColor(from, to, endtemp, starttemp){
    let tempRange = endtemp-starttemp
    let tempRatio = (temp - starttemp)/(tempRange)     
    return (p.lerpColor(from,to,tempRatio))
  }
}

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