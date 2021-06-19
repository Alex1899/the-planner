import React, { Component } from "react";
import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";
import "./context-menu.styles.scss";

const MENU_TYPE = "SIMPLE";

export default class RightClickMenu extends Component {
  handleClick = (e, data) => {
    console.log(data);
  };

  render() {
    return (
      <div>
        <ContextMenuTrigger id={MENU_TYPE} holdToDisplay={1000}>
          {this.props.children}
        </ContextMenuTrigger>
        <ContextMenu id={MENU_TYPE}>
          <MenuItem onClick={this.handleClick} data={{ item: "item 1" }}>
            Menu Item 1
          </MenuItem>
          <MenuItem onClick={this.handleClick} data={{ item: "item 2" }}>
            Menu Item 2
          </MenuItem>
          <MenuItem divider />
          <MenuItem onClick={this.handleClick} data={{ item: "item 3" }}>
            Menu Item 3
          </MenuItem>
        </ContextMenu>
      </div>
    );
  }
}
