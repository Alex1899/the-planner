import React, { useState, useEffect } from "react";
import { useTasksState } from "../../contexts/tasks.context";
import { useTimer } from "react-timer-hook";
import TimerStyled from "./timer.styled";
import { tasksNotFinished } from "../utils/utils";
import { useStateValue } from "../../contexts/auth.context";
import "./timer.styles.scss";
import { notifyUser } from "../../firebase/firebase.utils";

const Timer = ({ expiryTimestamp, myday }) => {
  const {
    currentUser: { id, displayName },
  } = useStateValue();
  const { clearMyDay, setTodayResult } = useTasksState();

  const setResultIfOffline = () => {
    if (!navigator.onLine) {
      let date = new Date();
      let yesterday = new Date().setDate(date.getDate() - 1);

      let result = {
        id: Date.now(),
        title: tasksNotFinished(myday) ? "L" : "W",
        start: yesterday,
        end: yesterday,
      };

      setTodayResult(id, { todayResult: result, tasks: myday });
    }
    clearMyDay();
    console.log("myday cleared")
  };

  const { seconds, minutes, hours } = useTimer({
    expiryTimestamp,
    onExpire: () => setResultIfOffline(),
  });

  useEffect(() => {
    if (hours === 1 && seconds === 59) {
      let message = `Hey, ${displayName}! You have less than 1 hour left to crush your tasks and get that juicy WIN! GET AFTER IT`;
      notifyUser(id, message);
      console.log("message sent");
    }
  }, [hours, displayName, id, seconds]);

  return (
    <div className="timer">
      {myday.length > 0 && (
        <TimerStyled seconds={seconds} minutes={minutes} hours={hours} />
      )}
    </div>
  );
};

export default Timer;
