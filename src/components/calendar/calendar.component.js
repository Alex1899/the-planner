import React, { useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "./calendar.styles.scss";
import Event from "./event.component";

const localizer = momentLocalizer(moment);

const TaskCalendar = () => {
  return (
    <Calendar
      localizer={localizer}
      events={[
        {
          id: 0,
          title: "W",
          start: new Date(),
          end: new Date(),
        },
      ]}
      views={["month"]}
      components={{
        event: Event,
      }}
      style={{ padding: 10 }}
    />
  );
};

export default TaskCalendar;
