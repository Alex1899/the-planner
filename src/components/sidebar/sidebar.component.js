import React, { useState, useEffect, useRef } from "react";
import "./sidebar.styles.scss";
import SideBarOption from "../sidebar-option/sidebar-option.component";
// import { Avatar } from "react-bootstrap"
import { useHistory } from "react-router-dom";
import { useStateValue } from "../../contexts/auth.context";

const options = [
  { icon: "assets/sun-white.svg", label: "My Day", route: "/" },
  { icon: "assets/star.svg", label: "Important", route: "/important" },
  { icon: "assets/tasks.svg", label: "Tasks", route: "/all-tasks" },
  { icon: "assets/routine.svg", label: "Routine", route: "/routine" },
  { icon: "assets/calendar.svg", label: "Calendar", route: "/calendar" },
];

const Sidebar = () => {
  const [active, setActive] = useState("My Day");
  const { currentUser } = useStateValue();
  const [open, setOpen] = useState(false);
  const history = useHistory();
  const node = useRef();

  const handleOptionClick = (label, route) => {
    setActive(label);
    history.push(route);
  };
  const handleClickOutside = (e) => {
    if (node.current.contains(e.target)) {
      // inside click
      return;
    }
    // outside click
    setOpen(false);
  };
  useEffect(() => {
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <div className="sidebar">
      <>
        <div ref={node} className="user-info" onClick={() => setOpen(true)}>
          <img
            src={
              currentUser.photoURL ? currentUser.photoURL : "/assets/user.png"
            }
            className="rounded-circle"
            alt="user avatar"
            style={{ width: 50, height: 50, marginLeft: 10 }}
          />
          <div className="d-flex flex-column">
            <span>{currentUser.displayName}</span>
            <span style={{ fontSize: 12 }}>{currentUser.email}</span>
          </div>
        </div>
        {open && (
          <div className="dropdown">
            <p>Option 1</p>
            <p>Option 2</p>
            <p>Option 3</p>
          </div>
        )}
      </>

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
  );
};

export default Sidebar;
