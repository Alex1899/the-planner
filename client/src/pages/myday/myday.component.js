import React, { useEffect } from "react";
import { useTasksState } from "../../contexts/tasks.context";
import AddTask from "../../components/add-task/add-task.component";
import axios from "axios";
import "./myday.styles.scss";
import PageHeader from "../../components/page-header/page-header.component";
import DraggableList from "../../components/draggable-task/draggable-task.component";

const MyDay = () => {
  const { taskData } = useTasksState();

  const myday =
    taskData && taskData.tasks.length > 0
      ? taskData.tasks.filter((task) => task.addedToMyDay)
      : [];

  const time = new Date();
  // time.setSeconds(
  //   24 * 60 * 60 -
  //     time.getHours() * 60 * 60 -
  //     time.getMonth() * 60 -
  //     time.getSeconds()
  // );

  time.setSeconds(60);
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
      <PageHeader title="My Day" myday={{ tasks: myday, time: time }} />
      {/* tasks div */}
      <DraggableList tasks={myday} />

      <AddTask />
    </div>
  );
};

export default MyDay;
