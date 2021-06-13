import React, {useState} from "react";
import "./sidebar.styles.scss";
import SideBarOption from "../sidebar-option/sidebar-option.component";

const options = [
  { icon: "assets/sun-white.svg", label: "My Day" },
  { icon: "assets/star.svg", label: "Important" },
  { icon: "assets/tasks.svg", label: "Tasks" },
  { icon: "assets/routine.svg", label: "Routine" },
  { icon: "assets/calendar.svg", label: "Calendar" },
];

const Sidebar = () => {
  const [active, setActive] = useState("My Day")


  return (
    <div className="sidebar">
      {options.map(({ icon, label }, idx) => (
        <SideBarOption active={active === label ? true: false} key={idx} icon={icon} label={label} onClick={() => setActive(label)} />
      ))}
    </div>
  );
};

export default Sidebar;
