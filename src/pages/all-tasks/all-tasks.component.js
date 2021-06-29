import React, { useState, useEffect } from "react";
import { useStateValue } from "../../contexts/auth.context";
import { useTasksState } from "../../contexts/tasks.context";
import { getUserTasks } from "../../firebase/firebase.utils";
import { Spinner } from "react-bootstrap";
import ContextMenuContainer from "../../components/context-menu/context-menu.container";
import Task from "../../components/task-row/task-row.component";
import Message from "../../components/empty-tasks-message/message.component";
import AddTask from "../../components/add-task/add-task.component";
import "./all-tasks.styles.scss"
const AllTasks = () => {
  const {
    currentUser: { id },
  } = useStateValue();
  const [tasks, setTasks] = useState([]);
  const { taskData } = useTasksState();
  const [spinner, toggleSpinner] = useState(false);

  useEffect(() => {
      console.log("AllTasks rendered")
    if (taskData && taskData.tasks) {
      setTasks([...taskData.tasks]);
    } else {
      if (navigator.onLine) {
          console.log("tasks fetching from firebase...")
        toggleSpinner((_) => true);
        getUserTasks(id)
          .then((res) => {
            setTasks([...res.tasks]);
            toggleSpinner((_) => false);
          })
          .catch((e) => {
            console.log(e);
            toggleSpinner((_) => false);
          });
      }
    }
  }, [id, taskData]);
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
        <div
          className="myday-container"
          style={{
            backgroundImage: `url(/assets/myday-image.jpg)`,
          }}
        >
          <header>
            <div className="header-div">
              <img src="/assets/tasks.svg" alt="tasks" width={30} />
              <p>Tasks</p>
            </div>
          </header>

          {/* tasks div */}
          <div
            className="tasks-list"
            style={
              tasks.length < 1
                ? { alignItems: "center", justifyContent: "center" }
                : undefined
            }
          >
            {tasks.length > 0 ? (
              tasks.map((task, i) => (
                <ContextMenuContainer key={i} idx={i} task={task}>
                  <Task task={task} />
                </ContextMenuContainer>
              ))
            ) : (
              <Message />
            )}
          </div>

          <AddTask />
        </div>
      )}
    </>
  );
};

export default AllTasks;
