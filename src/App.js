import React, { useRef, useState } from "react";
import * as tf from "@tensorflow/tfjs";
import * as handpose from "@tensorflow-models/handpose";
import Webcam from "react-webcam";
import "./App.css";
import { drawHand } from "./utils";
import * as fp from "fingerpose";

import ThumbsDownGesture from "./gestures/ThumbsDown.js";
import MiddleFingerGesture from "./gestures/MiddleFinger.js";
import OKSignGesture from "./gestures/OKSign.js";
import PinchedFingerGesture from "./gestures/PinchedFinger.js";
import PinchedHandGesture from "./gestures/PinchedHand.js";
import RaisedHandGesture from "./gestures/RaisedHand.js";
import LoveYouGesture from "./gestures/LoveYou.js";
import RockOnGesture from "./gestures/RockOn.js";
import CallMeGesture from "./gestures/CallMe.js";
import PointUpGesture from "./gestures/PointUp.js";
import PointDownGesture from "./gestures/PointDown.js";
import PointRightGesture from "./gestures/PointRight.js";
import PointLeftGesture from "./gestures/PointLeft.js";
import RaisedFistGesture from "./gestures/RaisedFist.js";

import victory from "./img/victory.png";
import thumbs_up from "./img/thumbs_up.png";
import thumbs_down from "./img/thumbs_down.png";
import middle_finger from "./img/middle_finger.png";
import ok_sign from "./img/ok_sign.png";
import pinched_finger from "./img/pinched_finger.png";
import pinched_hand from "./img/pinched_hand.png";
import raised_hand from "./img/raised_hand.png";
import love_you from "./img/love_you.png";
import rock_on from "./img/rock_on.png";
import call_me from "./img/call_me.png";
import point_up from "./img/point_up.png";
import point_down from "./img/point_down.png";
import point_left from "./img/point_left.png";
import point_right from "./img/point_right.png";
import raised_fist from "./img/raised_fist.png";

function App() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [emoji, setEmoji] = useState(null);

  const gestureImages = {
    thumbs_up,
    victory,
    thumbs_down,
    middle_finger,
    ok_sign,
    pinched_finger,
    pinched_hand,
    raised_hand,
    love_you,
    rock_on,
    call_me,
    point_up,
    point_down,
    point_left,
    point_right,
    raised_fist,
  };

  const initializeHandpose = async () => {
    const model = await handpose.load();
    setInterval(() => detectGestures(model), 100);
  };

  const detectGestures = async (model) => {
    if (
      webcamRef.current &&
      webcamRef.current.video.readyState === 4
    ) {
      const video = webcamRef.current.video;
      const videoWidth = video.videoWidth;
      const videoHeight = video.videoHeight;

      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;
      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      const hands = await model.estimateHands(video);

      if (hands.length > 0) {
        const gestureEstimator = new fp.GestureEstimator([
          fp.Gestures.VictoryGesture,
          fp.Gestures.ThumbsUpGesture,
          ThumbsDownGesture,
          MiddleFingerGesture,
          OKSignGesture,
          PinchedFingerGesture,
          PinchedHandGesture,
          RaisedHandGesture,
          LoveYouGesture,
          RockOnGesture,
          CallMeGesture,
          PointRightGesture,
          PointUpGesture,
          PointLeftGesture,
          PointDownGesture,
          RaisedFistGesture,
        ]);

        const estimation = await gestureEstimator.estimate(
          hands[0].landmarks,
          8
        );

        if (estimation.gestures?.length > 0) {
          const scores = estimation.gestures.map((g) => g.score);
          const bestGesture = estimation.gestures[scores.indexOf(Math.max(...scores))];
          setEmoji(bestGesture.name);
        }
      }

      const ctx = canvasRef.current.getContext("2d");
      drawHand(hands, ctx);
    }
  };

  initializeHandpose();

  return (
    <div className="App">
      <header className="App-header">
      <h1 style={{ textAlign: "center", position:'absolute', bottom:575 }}>Hand Gesture Detector</h1>
      <p style={{textAlign:'center', justifyContent:'start', position:'absolute', bottom:10}}>Please wait a few moments for model to load...</p>
        
        <Webcam
          ref={webcamRef}
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            margin: "auto",
            textAlign: "center",
            zIndex: 9,
            width: 640,
            height: 480,
          }}
        />
        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            margin: "auto",
            textAlign: "center",
            zIndex: 9,
            width: 640,
            height: 480,
          }}
        />
        {emoji && (
          <img
            src={gestureImages[emoji]}
            alt={emoji}
            style={{
              position: "absolute",
              left: 1200,
              bottom: 300,
              margin: "auto",
              textAlign: "center",
              height: 100,
            }}
          />
        )}
      </header>
    </div>
  );
}

export default App;
