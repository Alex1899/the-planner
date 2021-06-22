import React, { useEffect, useState } from "react";
import { useTasksState } from "../../contexts/tasks.context";
import Message from "../empty-tasks-message/message.component";
import AddTask from "../add-task/add-task.component";
import Task from "../task-row/task-row.component";

import "./myday.styles.scss";
import RightClickMenu from "../context-menu/context-menu.component";
import Timer from "../timer/timer.component";
import { useStateValue } from "../../contexts/auth.context";

const MyDay = () => {
  const { taskData, deleteTask } = useTasksState();
  const {
    currentUser: { id },
  } = useStateValue();
  const myday =
    taskData && taskData.tasks.length > 0
      ? taskData.tasks.filter((task) => task.addedToMyDay)
      : [];
  const time = new Date();
  time.setSeconds(
    24 * 60 * 60 -
      time.getHours() * 60 * 60 -
      time.getMonth() * 60 -
      time.getSeconds()
  );

  useEffect(() => {
    console.log("myday rendered");
  });

  return (
    <div
      className="myday-container"
      style={{ backgroundImage: "url(/assets/myday-image.jpg)" }}
    >
      <header>
        <div className="today">
          <h2>My Day</h2>
          <p className="date">{new Date().toDateString()}</p>
        </div>
        <Timer expiryTimestamp={time} myday={myday} />
      </header>

      {/* tasks div */}
      <div
        className="tasks-list"
        style={
          myday.length < 1
            ? { alignItems: "center", justifyContent: "center" }
            : undefined
        }
      >
        {myday.length > 0 ? (
          myday.map((task, i) => (
            <RightClickMenu
              key={i}
              idx={i}
              menuItems={[
                {
                  label: "Delete",
                  onClick: () => deleteTask(id, task),
                  style: { color: "red", fontWeight: "bold" },
                },
              ]}
            >
              <Task task={task} />
            </RightClickMenu>
          ))
        ) : (
          <Message />
        )}
      </div>

      <AddTask />
    </div>
  );
};

export default MyDay;
