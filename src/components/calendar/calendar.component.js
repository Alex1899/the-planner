import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "./calendar.styles.scss";
import Event from "./event.component";
import { useTasksState } from "../../contexts/tasks.context";
import { getAllUserEvents, getUserTasks } from "../../firebase/firebase.utils";
import { Spinner } from "react-bootstrap";
import { useStateValue } from "../../contexts/auth.context";

const localizer = momentLocalizer(moment);

const TaskCalendar = () => {
  const { taskData } = useTasksState();
  const {
    currentUser: { id },
  } = useStateValue();
  const [spinner, toggleSpinner] = useState(false);
  const [events, setEvents] = useState(null);

  useEffect(() => {
    console.log("calendar rendered");
    if (navigator.onLine) {
      if (!events) {
        console.log("inside useeffect");
        toggleSpinner((_) => true);
        getAllUserEvents(id)
          .then((res) => {
            setEvents((_) => res.events);
            toggleSpinner((_) => false);
          })
          .catch((e) => {
            console.log(e);
            toggleSpinner((_) => false);
          });
      }
    }
  }, [events, id]);

  return (
    <>
      {spinner ? (
        <Spinner
          animation="border"
          variant="dark"
          size="lg"
          className="m-auto"
        />
      ) : (
        <Calendar
          localizer={localizer}
          events={
            taskData && taskData.result
              ? events
                ? events.concat([
                    {
                      ...taskData.result.todayResult,
                      tasks: taskData.result.tasks,
                    },
                  ])
                : [
                    {
                      ...taskData.result.todayResult,
                      tasks: taskData.result.tasks,
                    },
                  ]
              : events
              ? events
              : []
          }
          views={["month"]}
          tooltipAccessor={(e) => ""}
          components={{
            event: Event,
          }}
          style={{ padding: 10, height: "90%" }}
        />
      )}
    </>
  );
};

export default TaskCalendar;
