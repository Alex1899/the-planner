import React, { useState, useEffect } from "react";
import "./App.css";
import { Switch, Route } from "react-router-dom";
import HomePage from "./pages/home/home.component";
import SignInAndSignUpPage from "./pages/sign-in-sign-up/sign-in-sign-up.component";
import { useStateValue } from "./contexts/auth.context";
import { useTasksState } from "./contexts/tasks.context";
import {Toast} from 'react-bootstrap';
import { Spinner } from "react-bootstrap";
import { getCurrentUser, getToken, getUserTasks,  onMessageListener } from "./firebase/firebase.utils";

function App() {

  const { setUser, currentUser } = useStateValue();
  const { taskData } = useTasksState();
  const [showSpinner, toggleShowSpinner] = useState(false);
  const { setUserTasks } = useTasksState();
  const [notification, setNotification] = useState({title: '', body: ''});

  const [show, setShow] = useState(false);
  
  useEffect(() => {
    console.log("getting token in useeffect")
    getToken(currentUser.id)
  }, [currentUser])

  onMessageListener().then(payload => {
    setShow(true);
    console.log("onmessageListener fired")
    setNotification({title: payload.notification.title, body: payload.notification.body})
    console.log(payload);
  }).catch(err => console.log('failed: ', err));

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
    console.log("task fetching useEffect run from App")
    if (currentUser && !taskData) {
      (async () => {
        let tasks = await getUserTasks(currentUser.id);
        console.log("tasks fetched from firebase from App", tasks)
        setUserTasks(tasks);
      })();
    }
  }, [currentUser, setUserTasks, taskData]);

  return (
    <div className="d-flex">

      <Toast onClose={() => setShow(false)} show={show} delay={3000} autohide animation style={{
          position: 'absolute',
          top: 20,
          right: 20,
          minWidth: 200
        }}>
          <Toast.Header>
            <img
              src="/assets/sun-white.svg"
              className="rounded mr-2"
              alt=""
            />
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
