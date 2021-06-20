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
    Object.keys(tasksCopy).some((key) => {
      if (key === category) {
        tasksCopy[key] = updatedTasks;
        return true;
      }
      return false;
    });
    setUserTasks({ ...tasksCopy });
  };

  const addTaskToCategory = (category, task) => {
    let tasksCopy = taskData;
    Object.keys(tasksCopy).some((key) => {
      if (key === category) {
        tasksCopy[key].unshift(task);
        return true;
      }
      return false;
    });
    setUserTasks({ ...tasksCopy });
  };

  const toggleTaskChecked = (category, taskText) => {
    let tasksCopy = taskData;
    Object.keys(tasksCopy).some((key) => {
      if (key === category) {
        tasksCopy[key].some((task) => {
          if (task.text === taskText) {
            task.checked = !task.checked;
            return true;
          }
          return false;
        });
        return true;
      }
      return false;
    });
    setUserTasks({ ...tasksCopy });
  };

  const deleteTask = (category, taskToDelete) => {
    let tasksCopy = taskData;
    Object.keys(tasksCopy).some((key) => {
      if (key === category) {
        tasksCopy[key].some((task, i) => {
          if (task.text === taskToDelete) {
            tasksCopy[key].splice(i, 1)
            return true;
          }
          return false;
        });
        return true;
      }
      return false;
    });
    setUserTasks({ ...tasksCopy });
  };

  return (
    <Provider
      value={{
        taskData: taskData,
        setUserTasks: (tasks) => setUserTasks(tasks),
        updateTasksCategory: (category, updatedTasks) =>
          updateTasksCategory(category, updatedTasks),
        addTaskToCategory: (category, task) =>
          addTaskToCategory(category, task),
        toggleTaskChecked: (category, task) =>
          toggleTaskChecked(category, task),
        deleteTask: (category, taskToDelete) => deleteTask(category, taskToDelete)
      }}
    >
      {children}
    </Provider>
  );
};

const useStateValue = () => useContext(TaskContext);

export { TaskProvider, useStateValue };
