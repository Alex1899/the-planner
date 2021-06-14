import React, { createContext, useContext, useState } from "react";

const TaskContext = createContext();
const { Provider } = TaskContext;

const TaskProvider = ({ children }) => {
  const tasks = localStorage.getItem("tasks");
  const [taskData, setTaskData] = useState(
    tasks
      ? JSON.parse(tasks)
      : {
          myday: [],
          important: [],
          allTasks: [],
          routine: [],
        }
  );

  const setUserTasks = (tasks) => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
    setTaskData({ ...tasks });
  };

  const updateTasksCategory = (category, updatedTasks) => {
    let tasksCopy = taskData;
    Object.keys(tasksCopy).forEach((key) => {
      if (key === category) {
        tasksCopy[key] = updatedTasks;
        return;
      }
    });
    setUserTasks(tasksCopy);
  };

  return (
    <Provider
      value={{
        taskData: taskData,
        setUserTasks: (tasks) => setUserTasks(tasks),
        updateTasksCategory: (category, updatedTasks) =>
          updateTasksCategory(category, updatedTasks),
      }}
    >
      {children}
    </Provider>
  );
};

const useStateValue = () => useContext(TaskContext)

export { TaskProvider, useStateValue}