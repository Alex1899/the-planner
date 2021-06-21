import React, { createContext, useContext, useState } from "react";

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

  const addTask = (task) => {
    console.log("task added", task);
    setUserTasks({ ...taskData, tasks: [task, ...taskData.tasks] });
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

  const deleteTask = (taskToDelete) => {
    let tasksCopy = taskData;
    tasksCopy.tasks.some((task, i) => {
      if (task.text === taskToDelete) {
        tasksCopy.tasks.splice(i, 1);
        return true;
      }
      return false;
    });

    setUserTasks({ ...tasksCopy });
  };

  const setTodayResult = (todayResult) => {
    setUserTasks({ ...taskData, todayResult });
  };

  return (
    <Provider
      value={{
        taskData: taskData,
        setUserTasks: (tasks) => setUserTasks(tasks),

        addTask: (task) => addTask(task),
        toggleTaskChecked: (task) => toggleTaskChecked(task),
        deleteTask: (taskToDelete) => deleteTask(taskToDelete),
        setTodayResult: (result) => setTodayResult(result),
      }}
    >
      {children}
    </Provider>
  );
};

const useTasksState = () => useContext(TaskContext);

export { TaskProvider, useTasksState };
