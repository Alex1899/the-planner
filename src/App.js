import React from "react";
import "./App.css";
import Sidebar from "./components/sidebar/sidebar.component";
import { Switch, Route } from "react-router-dom";
import HomePage from "./pages/home/home.component";
import SignInAndSignUpPage  from "./pages/sign-in-sign-up/sign-in-sign-up.component"
import { useStateValue } from "./contexts/auth.context";

function App() {
  const { currentUser } = useStateValue()
  
  return (
   <Switch> 
     <Route exact path="/" render={({match}) => currentUser ?  <HomePage match={match} /> : <SignInAndSignUpPage />}/>
   </Switch>
  );
}

export default App;
