import React from "react";
import "./event.styles.scss";

const Event = ({ event }) => (
  <span
    className="event-slot"
    style={{
      color: event.title === "W" ? "green" : "red",
    }}
  >
    {event.title}
  </span>
);

export default Event;
