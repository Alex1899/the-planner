import React from "react";
import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";
import "./context-menu.styles.scss";

const MENU_TYPE = "SIMPLE";

const RightClickMenu = ({ idx, menuItems, children }) => {
  return (
    <div>
      <ContextMenuTrigger id={`${MENU_TYPE}-${idx}`} holdToDisplay={1000}>
        {children}
      </ContextMenuTrigger>
      <ContextMenu id={`${MENU_TYPE}-${idx}`}>
        {menuItems.length > 0 &&
          menuItems.map((menuItem, i) => (
            <MenuItem key={i} onClick={menuItem.onClick} data={menuItem.data}>
              <span style={menuItem.style}>{menuItem.label}</span>
            </MenuItem>
          ))}
      </ContextMenu>
    </div>
  );
};

export default RightClickMenu;
