import React from "react";
import { OverlayTrigger, Popover } from "react-bootstrap";
import "./event.styles.scss";

const Event = ({ event }) => (
  <OverlayTrigger
    trigger="click"
    // placement={placement}
    overlay={
      <Popover>
        {/* <Popover.Title as="h3">{`Popover ${placement}`}</Popover.Title> */}
        <Popover.Content>
          {event.tasks.map((task) => (
            <div className="d-flex align-items-center pb-2">
              <span style={{ textDecoration: task.checked ? "line-through" : null , paddingBottom: 2}}>{task.text}</span>
              <img
                src={
                  task.checked
                    ? "/assets/completed.svg"
                    : "/assets/multiply.svg"
                }
                alt="checked"
                style={{
                  color: task.checked ? "green" : "red",
                  width: 15,
                  marginLeft: 10,
                }}
              />
            </div>
          ))}
        </Popover.Content>
      </Popover>
    }
  >
    <div
      className="event-slot"
      style={{
        color: event.title === "W" ? "green" : "red",
        textAlign: "center",
      }}
    >
      {event.title}
    </div>
  </OverlayTrigger>
);

export default Event;
