import React from "react";
import { useTasksState } from "../../contexts/tasks.context";
import { useTimer } from "react-timer-hook";
import TimerStyled from "./timer.styled";
import { tasksNotFinished } from "../utils/utils";
import { useStateValue } from "../../contexts/auth.context";
import "./timer.styles.scss";
const Timer = ({ expiryTimestamp, myday }) => {
  const {
    currentUser: { id },
  } = useStateValue();
  const { clearMyDay, setTodayResult } = useTasksState();

  const { seconds, minutes, hours } = useTimer({
    expiryTimestamp,
    onExpire: () => {
      let result = {
        id: Date.now(),
        title: "",
        start: new Date(),
        end: new Date(),
      };

      if (tasksNotFinished(myday)) {
        setTodayResult(id, {
          todayResult: { ...result, title: "L" },
          tasks: myday,
        });
      } else {
        setTodayResult(id, {
          todayResult: { ...result, title: "W" },
          tasks: myday,
        });
      }
      clearMyDay();
    },
  });

  return (
    <div className="timer">
      {myday.length > 0 && (
        <TimerStyled seconds={seconds} minutes={minutes} hours={hours} />
      )}
    </div>
  );
};

export default Timer;
