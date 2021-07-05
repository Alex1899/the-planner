import React, { createContext, useContext, useState } from "react";
import {
  addTaskToFirebase,
  removeTaskFromFirebase,
  saveResultToFirebase,
  updateTaskInFirebase,
} from "../firebase/firebase.utils";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";

const TaskContext = createContext();
const { Provider } = TaskContext;

const TaskProvider = ({ children }) => {
  const tasks = localStorage.getItem("tasks");
  const [taskData, setTaskData] = useState(tasks ? JSON.parse(tasks) : null);

  const setUserTasks = (tasks) => {
    let newState = { ...tasks };
    localStorage.setItem("tasks", JSON.stringify(newState));
    setTaskData(() => newState);
  };

  const addTask = (userId, task) => {
    task.id = uuidv4();

    let newTaskData = {
      ...taskData,
      tasks: [task, ...taskData.tasks],
    };
    if (newTaskData.todayResult) {
      delete newTaskData["todayResult"];
    }

    setUserTasks(newTaskData);
    addTaskToFirebase(userId, task)
      .then(() => console.log("task added to firebase"))
      .catch((e) => console.log(e));
  };

  const updateSpecificTask = (userId, { taskId, update }) => {
    if (update.addedToMyDay) {
      axios
        .get(`/.netlify/functions/startTimer?id=${userId}`)
        .then((res) => console.log(res))
        .catch((e) => console.log(e));
    }

    let tasksCopy = taskData;
    tasksCopy.tasks.some((task) => {
      if (task.id === taskId) {
        Object.keys(update).forEach((key) => {
          task[key] = update[key];
        });
        return true;
      }
      return false;
    });

    updateTaskInFirebase(userId, { taskId, fields: update });

    setUserTasks({ ...tasksCopy });
  };

  const setExpiryTime = (time) => {
    console.log("updating expiry time in context");
    let newTaskData = { ...taskData, expiryTime: time };
    setUserTasks(newTaskData);
  };

  const updateUserTasks = (reorderedMyDayList) => {
    let tasksToFilter = reorderedMyDayList.map((task) => task.id);
    let tasks = taskData.tasks.filter(
      (task) => !tasksToFilter.includes(task.id)
    );

    setUserTasks({ ...taskData, tasks: reorderedMyDayList.concat(tasks) });
  };

  const deleteTask = (userId, taskId) => {
    let tasksCopy = taskData;
    tasksCopy.tasks.some((task, i) => {
      if (task.id === taskId) {
        tasksCopy.tasks.splice(i, 1);
        return true;
      }
      return false;
    });

    setUserTasks({ ...tasksCopy });
    removeTaskFromFirebase(userId, taskId)
      .then(() => console.log("task deleted from firebase"))
      .catch((e) => console.log(e));
  };

  const setTodayResult = (userId, { todayResult, tasks }) => {
    console.log("tasks", tasks);
    // add to firebase
    saveResultToFirebase(userId, { todayResult, tasks })
      .then(() => {
        console.log("result added to firebase");
        tasks.forEach(async (task) => {
          await updateTaskInFirebase(userId, {
            taskId: task.id,
            fields: { addedToMyDay: false },
          });
        });
      })
      .catch((e) => console.log(e));

    let newTasks = clearMyDay();
    setUserTasks({
      tasks: newTasks,
      result: { todayResult, tasks },
    });
  };

  const clearMyDay = () => {
    let newTasks = taskData.tasks;
    newTasks.forEach((task) => {
      if (task.addedToMyDay) {
        task.addedToMyDay = false;
      }
    });
    return newTasks;
  };

  return (
    <Provider
      value={{
        taskData,
        setUserTasks,
        addTask,
        updateSpecificTask,
        deleteTask,
        setTodayResult,
        clearMyDay,
        updateUserTasks,
        setExpiryTime,
      }}
    >
      {children}
    </Provider>
  );
};

const useTasksState = () => useContext(TaskContext);

export { TaskProvider, useTasksState };
