import React, { useEffect, useState, useMemo } from "react";
import { useTasksState } from "../../contexts/tasks.context";
import AddTask from "../../components/add-task/add-task.component";
import "./myday.styles.scss";
import PageHeader from "../../components/page-header/page-header.component";
import DraggableList from "../../components/draggable-task/draggable-task.component";

const MyDay = () => {
  const { taskData, saveTimer } = useTasksState();
  let myday =
    taskData && taskData.tasks
      ? taskData.tasks.filter((task) => task.addedToMyDay)
      : [];

  useEffect(() => {
    if (myday.length < 1) {
      saveTimer(0);
    }
  }, [myday.length, saveTimer]);

  return (
    <div
      className="myday-container"
      style={{
        backgroundImage: `url(/assets/big-screen-bg.jpg)`,
      }}
    >
      <PageHeader title="My Day" myday={myday} />
      {/* tasks div */}
      <DraggableList tasks={myday} />

      <AddTask />
    </div>
  );
};

export default MyDay;
