import React from "react";
import { useStateValue } from "../../contexts/auth.context";
import { useTasksState } from "../../contexts/tasks.context";
import "./task-row.styles.scss";

const Task = ({ task }) => {
  const { checked, text, id } = task;
  const { toggleTaskChecked } = useTasksState();
  const { currentUser } = useStateValue();

  const completeTask = () => {
    toggleTaskChecked(currentUser.id, id);
  };

  return (
    <div className="task-row" style={checked ? { opacity: 0.8 } : undefined}>
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
      <span style={{ textDecoration: checked ? "line-through" : null }}>
        {text}
      </span>
    </div>
  );
};

export default Task;
