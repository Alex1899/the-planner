import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useStateValue } from "../../contexts/auth.context";
import { useTasksState } from "../../contexts/tasks.context";
import { addTaskToFirebase } from "../../firebase/firebase.utils";
import AlertDialog from "../alert-dialog/alert-dialog.component";
import "./add-task.styles.scss";

const AddTask = () => {
  const { addTask } = useTasksState();
  const {
    currentUser: { id },
  } = useStateValue();
  const history = useHistory();
  const [task, setTask] = useState({
    checked: false,
    text: "",
    category: "",
    addedToMyDay: history.location.pathname === "/" ? true : false,
  });
  const [alert, setAlert] = useState({ show: false, text: "" });

  const addUserTask = () => {
    if (!task.text) {
      setAlert({ show: true, text: "Task can not be empty" });
      return;
    }
    addTask(id,task);
   
    setTask({ ...task, text: "" });
  };

  const onChange = (e) => {
    setTask({ ...task, text: e.target.value });
  };

  const onEnterPress = (e) => {
    if (e.key === "Enter") {
      addTask(id,task);
      setTask({ ...task, text: "" });
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
      <img
        src="/assets/plus.svg"
        alt="add icon"
        onClick={() => addUserTask()}
      />
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

export default React.memo(AddTask);
