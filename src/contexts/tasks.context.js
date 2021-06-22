import React, { createContext, useContext, useState } from "react";
import {
  addTaskToFirebase,
  removeTaskFromFirebase,
} from "../firebase/firebase.utils";

const TaskContext = createContext();
const { Provider } = TaskContext;

const TaskProvider = ({ children }) => {
  const tasks = localStorage.getItem("tasks");
  const [taskData, setTaskData] = useState(tasks ? JSON.parse(tasks) : null);

  const setUserTasks = (tasks) => {
    if (tasks) {
      localStorage.setItem("tasks", JSON.stringify(tasks));
    }
    setTaskData((_) => tasks);
  };

  // const updateTasksCategory = (category, updatedTasks) => {
  //   let tasksCopy = taskData;
  //   Object.keys(tasksCopy).some((key) => {
  //     if (key === category) {
  //       tasksCopy[key] = updatedTasks;
  //       return true;
  //     }
  //     return false;
  //   });
  //   setUserTasks({ ...tasksCopy });
  // };

  const addTask = (userId, task) => {
    console.log("userId", userId);
    console.log("task added", task);
    setUserTasks({ ...taskData, tasks: [task, ...taskData.tasks] });
    addTaskToFirebase(userId, task)
      .then(() => console.log("task added to firebase"))
      .catch((e) => console.log(e));
  };

  // const addTaskToMyDay = (task) => {
  //   let tasksCopy = taskData;
  //   Object.keys(tasksCopy).some((key) => {
  //     if (key === category) {
  //       tasksCopy[key].unshift(task);
  //       return true;
  //     }
  //     return false;
  //   });
  //   setUserTasks({ ...tasksCopy });
  // };

  const toggleTaskChecked = (taskText) => {
    let tasksCopy = taskData;

    tasksCopy.tasks.some((task) => {
      if (task.text === taskText) {
        task.checked = !task.checked;
        return true;
      }
      return false;
    });

    setUserTasks({ ...tasksCopy });
  };

  const deleteTask = (userId, taskToDelete) => {
    let tasksCopy = taskData;
    tasksCopy.tasks.some((task, i) => {
      if (task.text === taskToDelete.text) {
        tasksCopy.tasks.splice(i, 1);
        return true;
      }
      return false;
    });

    setUserTasks({ ...tasksCopy });
    removeTaskFromFirebase(userId, taskToDelete)
      .then(() => console.log("task deleted from firebase"))
      .catch((e) => console.log(e));
  };

  const setTodayResult = (todayResult) => {
    setUserTasks({ ...taskData, todayResult });
  };

  const clearMyDay = () => {
    let newTasks = taskData.tasks.forEach((task) => {
      if (task.addedToMyDay) {
        task.addedToMyDay = false;
      }
    });
    setUserTasks({ ...taskData, tasks: [...newTasks] });
  };

  return (
    <Provider
      value={{
        taskData: taskData,
        setUserTasks: (tasks) => setUserTasks(tasks),

        addTask: (userId, task) => addTask(userId, task),
        toggleTaskChecked: (task) => toggleTaskChecked(task),
        deleteTask: (userId, taskToDelete) => deleteTask(userId, taskToDelete),
        setTodayResult: (result) => setTodayResult(result),
        clearMyDay: () => clearMyDay(),
      }}
    >
      {children}
    </Provider>
  );
};

const useTasksState = () => useContext(TaskContext);

export { TaskProvider, useTasksState };
