import React, { useState, useEffect } from "react";
import { useTasksState } from "../../contexts/tasks.context";
import { calculateTimeLeft } from "../utils/utils";

const Timer = ({ myday, setMyDay }) => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  const { setTodayResult } = useTasksState();

  useEffect(() => {
    let timer;
    if (timeLeft) {
      timer = setTimeout(() => {
        let time = calculateTimeLeft();
        if (!time) {
          let notFinished = myday.some((task) => !task.checked);
          if (notFinished) {
            //TODO
            //update today's result to L
            setTodayResult("L");
          } else {
            //Win
            setTodayResult("W");
          }
        }
        setTimeLeft(time);
      }, 1000);
    } else {
      if (myday.length > 0) {
        setMyDay();
      }
    }
    return () => clearTimeout(timer);
  });
  return (
    <div className="timer">
      {timeLeft && (
        <>
          <h2>Time Left</h2>
          <p>
            {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
          </p>
        </>
      )}
    </div>
  );
};

export default Timer;
