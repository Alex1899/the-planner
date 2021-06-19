import React, { useState } from "react";
import { useStateValue } from "../../contexts/tasks.context";
import AlertDialog from "../alert-dialog/alert-dialog.component";
import "./add-task.styles.scss";

const AddTask = () => {
  const { addTaskToCategory } = useStateValue();
  const [task, setTask] = useState({ checked: false, text: "" });
  const [alert, setAlert] = useState({ show: false, text: "" });

  const addTask = () => {
    if (!task.text) {
      setAlert({ show: true, text: "Task can not be empty" });
      return;
    }
    addTaskToCategory("myday", task);
    setTask({ ...task, text: "" });
  };

  const onChange = (e) => {
    setTask({ ...task, text: e.target.value });
  };

  const onEnterPress = (e) => {
    if (e.key === "Enter") {
      addTask();
    }
  };

  return (
    <div className="add-task">
      {alert.show && (
        <AlertDialog
          show={alert.show}
          handleClose={() => setAlert({ ...alert, show: !alert.show })}
          text={alert.text}
        />
      )}
      <img src="/assets/plus.svg" alt="add icon" onClick={() => addTask()} />
      <input
        type="text"
        placeholder="Add a task"
        value={task.text}
        onChange={onChange}
        onKeyPress={onEnterPress}
      />
    </div>
  );
};

export default AddTask;
