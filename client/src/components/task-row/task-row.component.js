import React, { useState, useEffect } from "react";
import { useStateValue } from "../../contexts/auth.context";
import { useTasksState } from "../../contexts/tasks.context";
import TaskPopup from "../popup/popup.component";

import "./task-row.styles.scss";

const Task = ({ task, provided, style }) => {
  const { checked, text, id } = task;
  const { updateSpecificTask } = useTasksState();
  const { currentUser } = useStateValue();
  const [popup, setPopup] = useState({ show: false });

  const completeTask = () => {
    updateSpecificTask(currentUser.id, {
      taskId: id,
      update: { checked: !checked },
    });
  };
  
  return (
    <>
      <div
        ref={provided.innerRef}
        className="task-row"
        style={{ ...style, opacity: checked ? "0.8" : undefined }}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
      >
        {/* icon */}
        <img
          className="check-icon"
          src={checked ? "/assets/checked.svg" : "/assets/unchecked.svg"}
          alt="check"
          onMouseOver={(e) => (e.currentTarget.src = "/assets/checked.svg")}
          onMouseOut={(e) =>
            (e.currentTarget.src = checked
              ? "/assets/checked.svg"
              : "/assets/unchecked.svg")
          }
          onClick={() => completeTask()}
        />

        {/* task */}
        <span
          style={{ textDecoration: checked ? "line-through" : null }}
          onClick={() => setPopup({ show: true })}
        >
          {text}
        </span>
      </div>
      <TaskPopup
        open={popup.show}
        onClose={() => setPopup((s) => ({ show: !popup.show }))}
        task={task}
        onTaskClick={() => completeTask()}
      />
    </>
  );
};

export default Task;
