import React from "react";
import "./sidebar-option.styles.scss";

const SideBarOption = ({ active, icon, label, onClick }) => {
  return (
    <div className={`option${active ? " active" : ""}`} onClick={onClick}>
      <img src={icon} alt="option icon" />
      <span>{label}</span>
    </div>
  );
};

export default SideBarOption;
