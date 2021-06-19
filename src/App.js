import React, { useState, useEffect } from "react";
import "./App.css";
import Sidebar from "./components/sidebar/sidebar.component";
import { Switch, Route } from "react-router-dom";
import HomePage from "./pages/home/home.component";
import SignInAndSignUpPage from "./pages/sign-in-sign-up/sign-in-sign-up.component";
import { useStateValue } from "./contexts/auth.context";
import { Spinner } from "react-bootstrap";
import { getCurrentUser } from "./firebase/firebase.utils";

function App() {
  const { setCurrentUser, currentUser } = useStateValue();
  const [showSpinner, toggleShowSpinner] = useState(true);

  useEffect(() => {
    if (showSpinner && !currentUser) {
      getCurrentUser()
        .then((user) => {
          console.log("fetched user", user);
          setCurrentUser(user);
          toggleShowSpinner(false);
        })
        .catch((e) => {
          console.log(e);
          toggleShowSpinner(false);
        });
    }
  }, [setCurrentUser, showSpinner, currentUser]);

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
            exact
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
