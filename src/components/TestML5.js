import React, {useRef, useEffect} from "react";
import p5 from 'p5';
import * as ml5 from "ml5";

function sketch(p){
    let video;
    let poseNet;
    let poses = [];
    let maxPoses = 1;

    p.setup = function() {
        p.createCanvas(window.innerWidth, window.innerHeight);
        video = p.createCapture(p.VIDEO);
        video.size(window.innerWidth, window.innerHeight);

        // Create a new poseNet method with a single detection
        poseNet = ml5.poseNet(video, ml5.modelReady, maxPoses);
        // This sets up an event that fills the global variable "poses"
        // with an array every time new poses are detected
        poseNet.on('pose', function(results) {
            poses = results;
        });
        // Hide the video element, and just show the canvas
        video.hide();
    }

    p.modelReady = function() {
        p.select('#status').html('Model Loaded');
    }

    p.draw = function() {
        // p.image(video, 0, 0, 640, 480);
        p.background(255)

        // We can call both functions to draw all keypoints and the skeletons
        this.drawKeypoints();
        // this.drawSkeleton();
    }

    // A function to draw ellipses over the detected keypoints
    p.drawKeypoints = function() {
        // Loop through all the poses detected
        for (let i = 0; i < poses.length; i++) {
            // For each pose detected, loop through all the keypoints
            let pose = poses[i].pose;
            for (let j = 0; j < pose.keypoints.length; j++) {
                // A keypoint is an object describing a body part (like rightArm or leftShoulder)
                let keypoint = pose.keypoints[j];
                // Only draw an ellipse if the keypoint is the nose and the pose probability is bigger than 0.5
                if (keypoint.part === 'nose' && keypoint.score > 0.5) {
                    p.fill(255, 0, 0);
                    p.noStroke();
                    p.ellipse(keypoint.position.x, keypoint.position.y, 10, 10);
                    return [keypoint.position.x, keypoint.position.y];
                }
            }
        }
    }
}

function TestML5() {
    const p5ContainerRef = useRef();

    useEffect(() => {
        const p5Instance = new p5((p) => sketch(p), p5ContainerRef.current);
    
        return () => {
          p5Instance.remove();
        };
      }, []);

    return (
        <div className="ML5" ref={p5ContainerRef} style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }} />
    );
}

export default TestML5;