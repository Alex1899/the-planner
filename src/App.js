import React, { useState, useEffect } from "react";
import "./App.css";
import { Switch, Route } from "react-router-dom";
import HomePage from "./pages/home/home.component";
import SignInAndSignUpPage from "./pages/sign-in-sign-up/sign-in-sign-up.component";
import { useStateValue } from "./contexts/auth.context";
import { useTasksState } from "./contexts/tasks.context";

import { Spinner } from "react-bootstrap";
import { getCurrentUser, getUserTasks } from "./firebase/firebase.utils";

function App() {
  const { setUser, currentUser } = useStateValue();
  const { taskData } = useTasksState();
  const [showSpinner, toggleShowSpinner] = useState(false);
  const { setUserTasks } = useTasksState();

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
    <div className="d-flex" style={{ height: "100vh" }}>
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
