import React, { useState, useEffect } from "react";
import Sidebar from "../../components/sidebar/sidebar.component";
import { Switch, Route } from "react-router-dom";
import TaskCalendar from "../../components/calendar/calendar.component";
import "./home.styles.scss";
import MyDay from "../../components/myday/myday.component";
import Header from "../../components/header/header.component";
import { useMediaQuery } from "react-responsive";

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
    <div>
      {isTabletOrMobile && <Header showSidebar={showSidebar} onMenuClick={() => onMenuClick()} />}
      <div className="home">
        <Sidebar show={showSidebar} defaultStyle={!isTabletOrMobile} onMenuClick={isTabletOrMobile ? () => onMenuClick(): null}/>
        <Switch>
          <Route exact path={match.url} component={MyDay} />
          <Route path={`${match.url}calendar`} component={TaskCalendar} />
          {/* <Route path={`${match.url}/important`} component={ImportantTasks} />
        <Route path={`${match.url}/tasks`} component={AllTasks} />
        <Route path={`${match.url}/routine`} component={RoutineTasks} />
        */}
        </Switch>
      </div>
    </div>
  );
};

export default HomePage;
