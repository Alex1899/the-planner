import React, { createContext, useContext, useState } from "react";
import {
  addTaskToFirebase,
  removeTaskFromFirebase,
  saveResultToFirebase,
  updateTaskInFirebase,
} from "../firebase/firebase.utils";
import { v4 as uuidv4 } from "uuid";
import axios from "axios"

const TaskContext = createContext();
const { Provider } = TaskContext;

const TaskProvider = ({ children }) => {
  const tasks = localStorage.getItem("tasks");
  const [taskData, setTaskData] = useState(tasks ? JSON.parse(tasks) : null);

  const setUserTasks = (tasks) => {
    console.log("updating taskdata with:", tasks);
    if (tasks) {
      localStorage.setItem("tasks", JSON.stringify(tasks));
    }
    setTaskData((_) => ({ ...tasks }));
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
    if(update.addedToMyDay){
      axios
      .get(`/.netlify/functions/startTimer?id=${userId}`)
      .then((res) => console.log(res));
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
      ...taskData,
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

  const removeFromMyDay = (userId, taskId) => {
    let tasksCopy = taskData;
    tasksCopy.tasks.some((task, i) => {
      if (task.id === taskId) {
        task.addedToMyDay = false;
        return true;
      }
      return false;
    });

    setUserTasks({ ...tasksCopy });
    updateTaskInFirebase(userId, {
      taskId,
      fields: { addedToMyDay: false },
    })
      .then(() => console.log("task removed from myday"))
      .catch((e) => console.log(e));
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
      }}
    >
      {children}
    </Provider>
  );
};

const useTasksState = () => useContext(TaskContext);

export { TaskProvider, useTasksState };
