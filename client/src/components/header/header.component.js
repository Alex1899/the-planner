import React from "react";
import { useStateValue } from "../../contexts/auth.context";
import "./header.styles.scss";

const Header = ({ showSidebar, onMenuClick }) => {
  const {
    currentUser: { displayName },
  } = useStateValue();
  return (
    <div className="header">
      <img src={showSidebar ? "/assets/left-arrow.svg": "/assets/menu.svg"} alt="menu icon" onClick={() => onMenuClick()}/>
      <span>Hello, {displayName}!</span>
    </div>
  );
};

export default Header;
