import React from "react";
import { useTasksState } from "../../contexts/tasks.context";
import { useTimer } from "react-timer-hook";
import TimerStyled from "./timer.styled";
import { tasksNotFinished } from "../utils/utils";

const Timer = ({ expiryTimestamp, myday }) => {
  const { clearMyDay, setTodayResult } = useTasksState();

  const { seconds, minutes, hours } = useTimer({
    expiryTimestamp,
    onExpire: () => {
      if(tasksNotFinished(myday)){
        setTodayResult("L")
      }else{
        setTodayResult("W")
      }
      clearMyDay()
    },
  });

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      {myday.length > 0 && (
        <>
          <h2 className="mr-3">Time Left: </h2>
          <TimerStyled seconds={seconds} minutes={minutes} hours={hours} />
        </>
      )}
    </div>
  );
};

export default Timer;
