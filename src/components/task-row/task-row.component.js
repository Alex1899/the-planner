import React from "react";
import { useStateValue } from "../../contexts/tasks.context";
import "./task-row.styles.scss";

const Task = ({ task }) => {
  const { checked, text } = task;
  const { toggleTaskChecked } = useStateValue();

  const completeTask = () => {
    toggleTaskChecked("myday", text);
  };

  return (
    <div className="task-row" style={checked ? {opacity: 0.8} : undefined}>
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
