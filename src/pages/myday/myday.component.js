import React, { useEffect, useState } from "react";
import { useTasksState } from "../../contexts/tasks.context";
import Message from "../../components/empty-tasks-message/message.component";
import AddTask from "../../components/add-task/add-task.component";
import Task from "../../components/task-row/task-row.component";
import ContextMenuContainer from "../../components/context-menu/context-menu.container";
import Timer from "../../components/timer/timer.component";
import { useStateValue } from "../../contexts/auth.context";
import "./myday.styles.scss";
import PageHeader from "../../components/page-header/page-header.component";

const MyDay = () => {
  const { taskData } = useTasksState();
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
      style={{
        backgroundImage: `url(/assets/big-screen-bg.jpg)`,
      }}
    >
      <PageHeader title="My Day" myday={{tasks: myday, time: time}}/>

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
  );
};

export default MyDay;
