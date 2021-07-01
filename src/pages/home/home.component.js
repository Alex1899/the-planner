import React, { useState, useEffect } from "react";
import Sidebar from "../../components/sidebar/sidebar.component";
import { Switch, Route } from "react-router-dom";
import TaskCalendar from "../../components/calendar/calendar.component";
import "./home.styles.scss";
import MyDay from "../myday/myday.component";
import Header from "../../components/header/header.component";
import { useMediaQuery } from "react-responsive";
import AllTasks from "../all-tasks/all-tasks.component";

const HomePage = ({ match }) => {
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1224px)" });
  const [showSidebar, toggleSidebar] = useState(!isTabletOrMobile);

  useEffect(() => {
    toggleSidebar(!isTabletOrMobile);
    console.log("home rendered")
  }, [isTabletOrMobile]);

  const onMenuClick = () => {
    toggleSidebar((old) => !old)
  }

  return (
    <div className="home-container">
      {isTabletOrMobile && <Header showSidebar={showSidebar} onMenuClick={() => onMenuClick()} />}
      <div className="home-div" style={{height: isTabletOrMobile ? "calc(100% - 50px)" : "100%" }}>
        <Sidebar show={showSidebar} defaultStyle={!isTabletOrMobile} onMenuClick={isTabletOrMobile ? () => onMenuClick(): null}/>
        <Switch>
          <Route exact path={match.url} component={MyDay} />
          <Route path={`${match.url}tasks`} component={AllTasks} />
          <Route path={`${match.url}calendar`} component={TaskCalendar} />
          {/* <Route path={`${match.url}/important`} component={ImportantTasks} />
       
        <Route path={`${match.url}/routine`} component={RoutineTasks} />
        */}
        </Switch>
      </div>
    </div>
  );
};

export default HomePage;
