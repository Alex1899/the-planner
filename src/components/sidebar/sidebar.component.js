import React, { useState } from "react";
import { ButtonGroup, Dropdown } from "react-bootstrap";
import "./sidebar.styles.scss";
import SideBarOption from "../sidebar-option/sidebar-option.component";
// import { Avatar } from "react-bootstrap"
import { useHistory } from "react-router-dom";
import { useStateValue } from "../../contexts/auth.context";
import { Offline } from "react-detect-offline";

const options = [
  { icon: "assets/sun-white.svg", label: "My Day", route: "/" },
  { icon: "assets/star.svg", label: "Important", route: "/important" },
  { icon: "assets/tasks.svg", label: "Tasks", route: "/tasks" },
  { icon: "assets/routine.svg", label: "Routine", route: "/routine" },
  { icon: "assets/calendar.svg", label: "Calendar", route: "/calendar" },
];

const activeMap = {
  "/": "My Day",
  "/important": "Important",
  "/tasks": "Tasks",
  "/routine": "Routine",
  "/calendar": "Calendar",
};

const Sidebar = ({ show, defaultStyle, onMenuClick }) => {
  const { currentUser, logout } = useStateValue();
  const history = useHistory();
  const [active, setActive] = useState(activeMap[history.location.pathname]);

  const handleOptionClick = (label, route) => {
    setActive(label);
    history.push(route);
    onMenuClick && onMenuClick();
  };

  return (
    <div
      className={`sidebar-wrapper ${show ? "show-sidebar" : "hide-sidebar"}`}
      style={{ zIndex: defaultStyle ? "unset" : 99 }}
    >
      <div className="sidebar">
        <Dropdown as={ButtonGroup}>
          <div className="user-info">
            <img
              src={
                currentUser.photoURL ? currentUser.photoURL : "/assets/user.png"
              }
              className="rounded-circle"
              alt="user avatar"
              style={{ width: 50, height: 50, marginLeft: 10 }}
            />
            <div className="d-flex flex-column align-items-start">
              <span>{currentUser.displayName}</span>
              <span style={{ fontSize: 12 }}>{currentUser.email}</span>

              <Offline>
                <img src="/assets/no-wifi.svg" alt="offline icon" />
                <span style={{ fontSize: 12, marginLeft: 5 }}>Offline</span>
              </Offline>
            </div>
          </div>

          <Dropdown.Toggle split id="dropdown-split-basic">
            <img src="/assets/settings.svg" alt="settings" />
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item onClick={() => logout()}>Log out</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>

        {options.map(({ icon, label, route }, idx) => (
          <SideBarOption
            active={active === label ? true : false}
            key={idx}
            icon={icon}
            label={label}
            onClick={() => handleOptionClick(label, route)}
          />
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
