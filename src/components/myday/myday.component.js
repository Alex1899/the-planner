import React, { useEffect, useState } from "react";
import { useTasksState } from "../../contexts/tasks.context";
import Message from "../empty-tasks-message/message.component";
import AddTask from "../add-task/add-task.component";
import Task from "../task-row/task-row.component";

import "./myday.styles.scss";
import RightClickMenu from "../context-menu/context-menu.component";
import Timer from "../timer/timer.component";

const MyDay = () => {
  const { taskData, deleteTask } = useTasksState();
  const [myday, setMyDay] = useState(taskData
    ? taskData.tasks.filter((task) => task.addedToMyDay)
    : [])


    useEffect(()=>{
      console.log("myday rendered")
    })

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
        <Timer myday={myday} setMyDay={()=>setMyDay([])} />
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
                  data: { text: task.text },
                  onClick: (_, data) => deleteTask(data.text),
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
