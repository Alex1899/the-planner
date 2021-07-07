import React, { useState, useEffect } from "react";
import "./App.css";
import { Switch, Route } from "react-router-dom";
import HomePage from "./pages/home/home.component";
import SignInAndSignUpPage from "./pages/sign-in-sign-up/sign-in-sign-up.component";
import { useStateValue } from "./contexts/auth.context";
import { useTasksState } from "./contexts/tasks.context";
import { Toast } from "react-bootstrap";
import { Spinner } from "react-bootstrap";
import {
  checkLocalTasksAndUpdate,
  getCurrentUser,
  getToken,
  getUserTasks,
  onMessageListener,
} from "./firebase/firebase.utils";

function App() {
  const { setUser, currentUser } = useStateValue();
  const { taskData } = useTasksState();
  const [showSpinner, toggleShowSpinner] = useState(false);
  const { setUserTasks } = useTasksState();
  const [notification, setNotification] = useState({ title: "", body: "" });
  const [tasksFetched, setTasksFetched] = useState(false);
  const [show, setShow] = useState(false);

  useEffect(() => {
    currentUser && navigator.onLine && getToken(currentUser.id);
  }, [currentUser]);

  onMessageListener()
    .then((payload) => {
      setShow(true);
      console.log("onmessageListener fired");
      setNotification({
        title: payload.notification.title,
        body: payload.notification.body,
      });
      console.log(payload);
    })
    .catch((err) => console.log("failed: ", err));

  useEffect(() => {
    console.log("app rendered");
    if (!currentUser) {
      toggleShowSpinner(true);
      getCurrentUser()
        .then((res) => {
          console.log("fetched user", res);
          setUser(res);
          toggleShowSpinner(false);
        })
        .catch((e) => {
          console.log(e);
          toggleShowSpinner(false);
        });
    }
  }, [setUser, currentUser]);

  useEffect(() => {
    if (currentUser && !tasksFetched && navigator.onLine) {
      (async () => {
        if (taskData && taskData.tasks.length > 0) {
          console.log("checking local tasks if update is needed");
          await checkLocalTasksAndUpdate(currentUser.id, taskData.tasks);
        }

        getUserTasks(currentUser.id)
          .then((tasks) => {
            if (tasks.tasks.length > 0) {
              console.log("updating tasks from server");
              setTasksFetched((t) => !t);
              setUserTasks({...taskData, tasks: tasks.tasks});
            } else {
              setTasksFetched((t) => !t);
            }
          })
          .catch((e) => {
            console.log(e);
            setTasksFetched((t) => !t);
          });
      })();
    }
  }, [currentUser, setUserTasks, taskData, tasksFetched]);

  return (
    <div className="d-flex">
      <Toast
        onClose={() => setShow(false)}
        show={show}
        delay={3000}
        autohide
        animation
        style={{
          position: "absolute",
          top: 20,
          right: 20,
          minWidth: 200,
        }}
      >
        <Toast.Header>
          <img src="/assets/sun-white.svg" className="rounded mr-2" alt="" />
          <strong className="mr-auto">{notification.title}</strong>
          <small>just now</small>
        </Toast.Header>
        <Toast.Body>{notification.body}</Toast.Body>
      </Toast>
      {showSpinner ? (
        <Spinner
          animation="border"
          variant="dark"
          size="lg  "
          className="m-auto"
        />
      ) : (
        <Switch>
          <Route
            path="/"
            render={({ match }) =>
              currentUser ? <HomePage match={match} /> : <SignInAndSignUpPage />
            }
          />
        </Switch>
      )}
    </div>
  );
}

export default App;
