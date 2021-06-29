import React, { createContext, useContext, useState } from "react";
import {
  addTaskToFirebase,
  removeTaskFromFirebase,
  saveResultToFirebase,
  updateTaskInFirebase,
} from "../firebase/firebase.utils";
import { v4 as uuidv4 } from "uuid";

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

  const addTaskToMyDay = (userId, taskToAdd) => {
    let tasksCopy = taskData;
    tasksCopy.tasks.some((task) => {
      if (task.id === taskToAdd.id) {
        task.addedToMyDay = true;
        return true;
      }
      return false;
    });

    setUserTasks({ ...tasksCopy });
    updateTaskInFirebase(userId, {
      taskId: taskToAdd.id,
      fields: { addedToMyDay: true },
    })
      .then(() => console.log("task added to myday"))
      .catch((e) => console.log(e));
  };

  const toggleTaskChecked = (userId, taskId) => {
    let tasksCopy = taskData;
    let update = {};
    tasksCopy.tasks.some((task) => {
      if (task.id === taskId) {
        task.checked = !task.checked;
        update.fields = { checked: task.checked };
        update.taskId = task.id;
        return true;
      }
      return false;
    });

    updateTaskInFirebase(userId, update);

    setUserTasks({ ...tasksCopy });
  };

  const deleteTask = (userId, taskToDelete) => {
    let tasksCopy = taskData;
    tasksCopy.tasks.some((task, i) => {
      if (task.id === taskToDelete.id) {
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

  const removeFromMyDay = (userId, taskToRemove) => {
    let tasksCopy = taskData;
    tasksCopy.tasks.some((task, i) => {
      if (task.id === taskToRemove.id) {
        task.addedToMyDay = false;
        return true;
      }
      return false;
    });

    setUserTasks({ ...tasksCopy });
    updateTaskInFirebase(userId, {
      taskId: taskToRemove.id,
      fields: { addedToMyDay: false },
    })
      .then(() => console.log("task removed from myday"))
      .catch((e) => console.log(e));
  };

  return (
    <Provider
      value={{
        taskData: taskData,
        setUserTasks: (tasks) => setUserTasks(tasks),
        addTask: (userId, task) => addTask(userId, task),
        toggleTaskChecked: (userId, taskId) =>
          toggleTaskChecked(userId, taskId),
        deleteTask: (userId, taskToDelete) => deleteTask(userId, taskToDelete),
        setTodayResult: (id, result) => setTodayResult(id, result),
        clearMyDay: () => clearMyDay(),
        removeFromMyDay: (userId, taskToRemove) =>
          removeFromMyDay(userId, taskToRemove),
        addTaskToMyDay: (userId, taskToAdd) =>
          addTaskToMyDay(userId, taskToAdd),
      }}
    >
      {children}
    </Provider>
  );
};

const useTasksState = () => useContext(TaskContext);

export { TaskProvider, useTasksState };
