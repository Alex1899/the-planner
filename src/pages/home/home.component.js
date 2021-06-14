import React from "react";
import Sidebar from "../../components/sidebar/sidebar.component";
import MyDay from "../../components/myday/myday.component";
import { Switch, Route } from "react-router-dom";

const HomePage = ({ match }) => {
  return (
    <div className="d-flex">
      <Sidebar />
      <Switch>
        <Route exact path={match.url} component={MyDay} />
        {/* <Route path={`${match.url}/important`} component={ImportantTasks} />
        <Route path={`${match.url}/tasks`} component={AllTasks} />
        <Route path={`${match.url}/routine`} component={RoutineTasks} />
        <Route path={`${match.url}/calendar`} component={Calendar} /> */}
      </Switch>
    </div>
  );
};

export default HomePage;
