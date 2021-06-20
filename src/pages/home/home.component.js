import React from "react";
import Sidebar from "../../components/sidebar/sidebar.component";
import MyDay from "../../components/myday/myday.component";
import { Switch, Route } from "react-router-dom";
import TaskCalendar from "../../components/calendar/calendar.component";
import "./home.styles.scss"

const HomePage = ({ match }) => {
  return (
    <div className="home">
      <Sidebar />
      <Switch>
        <Route exact path={match.url} component={MyDay} />
        <Route path={`${match.url}calendar`} component={TaskCalendar} /> 
        {/* <Route path={`${match.url}/important`} component={ImportantTasks} />
        <Route path={`${match.url}/tasks`} component={AllTasks} />
        <Route path={`${match.url}/routine`} component={RoutineTasks} />
        */}
      </Switch>
    </div>
  );
};

export default HomePage;
