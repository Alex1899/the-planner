import React from "react";
import { useTasksState } from "../../contexts/tasks.context";
import Timer from "../timer/timer.component";
import "./page-header.styles.scss";

const PageHeader = ({ title, myday }) => {
  const {taskData} = useTasksState()

  return (
    <header>
      <div className="today">
        {title === "My Day" ? (
          <>
            <p className="title">{title}</p>
            <p className="date">{new Date().toDateString()}</p>
          </>
        ) : (
          <div className="d-flex align-items-center">
            <img
              style={{ marginRight: 10 }}
              src={`/assets/${title.toLowerCase()}.svg`}
              alt="icon"
            />
            <p className="title">{title}</p>
          </div>
        )}
      </div>
      {myday && myday.length > 0 && taskData.expiryTime && (
        <Timer expiryTimestamp={taskData.expiryTime} myday={myday} />
      )}
    </header>
  );
};

export default PageHeader;
