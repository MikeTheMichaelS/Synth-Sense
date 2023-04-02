import { useEffect, useRef, useContext, useState} from 'react';
import { MyContext } from './PassingInfo';
import p5 from 'p5';
import * as ml5 from "ml5";

function Sketch(p, weatherRef, decibelRef) {
  let kMax;
  const step = 0.03;
  const n = 300;
  const radius = 4;
  const inter = 0.2;
  const maxNoise = 200;
  

  let size = 0;
  let temp = weatherRef.current

  let video;
  let poseNet;
  let poses = [];
  let posX = p.width/2
  let posY = p.height/2

  p.setup = function () {
    p.createCanvas(window.innerWidth, window.innerHeight);
    p.angleMode(p.DEGREES);
    p.noFill();
    kMax = p.random(0.2, 1.0);
    p.noStroke();

    video = p.createCapture(p.VIDEO);
    video.size(window.innerWidth, window.innerHeight);

    // Create a new poseNet method with a single detection
    poseNet = ml5.poseNet(video, ml5.modelReady);
    // This sets up an event that fills the global variable "poses"
    // with an array every time new poses are detected
    poseNet.on('pose', function(results) {
        poses = results;
    });
    // Hide the video element, and just show the canvas
    video.hide();
  };

  p.modelReady = function() {
    p.select('#status').html('Model Loaded');
  };
    // A function to draw ellipses over the detected keypoints
    p.drawKeypoints = function() {
        // Loop through all the poses detected
        for (let i = 0; i < poses.length; i++) {
            // For each pose detected, loop through all the keypoints
            let pose = poses[i].pose;
            for (let j = 0; j < pose.keypoints.length; j++) {
                // A keypoint is an object describing a body part (like rightArm or leftShoulder)
                let keypoint = pose.keypoints[j];
                // Only draw an ellipse is the pose probability is bigger than 0.2
                if (keypoint.score > 0.6) {
                    if (j === 0) { // if this is the nose keypoint
                        // p.fill(255, 0, 0);
                        p.noStroke();
                        posX = p.width - keypoint.position.x
                        posY = keypoint.position.y
                        // p.ellipse(posX, posY, 10, 10);
                    }
                }
            }
        }
        return [posX,posY];
    }

  p.draw = function () {
    p.background(360);

    // Smoothly transition between the old and new decibel values
    size += (decibelRef.current - size) * 0.15;

    temp = weatherRef.current;

    // this.drawKeypoints();
    // console.log(this.drawKeypoints()[0]);

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

    // console.log(this.keypoints)
      blob(
        blobSize + size,
        this.drawKeypoints()[0],
        this.drawKeypoints()[1],
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