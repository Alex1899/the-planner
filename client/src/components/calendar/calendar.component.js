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
  const [events, setEvents] = useState([]);
  const [eventsFetched, setEventsFetched] = useState(false)

  useEffect(() => {
    console.log("calendar rendered");
    if (navigator.onLine && !eventsFetched) {
      if (events.length < 1) {
        console.log("inside useeffect");
        toggleSpinner((_) => true);
        getAllUserEvents(id)
          .then((res) => {
            console.log(res);
            setEventsFetched((o) => !o)
            setEvents([...res.events]);
            toggleSpinner((_) => false);
            
          })
          .catch((e) => {
            console.log(e);
            setEventsFetched((o) => !o)
            toggleSpinner((_) => false);
          });
      }
    }
  }, [events, id, eventsFetched]);

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
              ? events.concat([
                  {
                    ...taskData.result.todayResult,
                    tasks: taskData.result.tasks,
                  },
                ])
              : events
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
