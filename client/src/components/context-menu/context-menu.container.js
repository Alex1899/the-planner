import React from "react";
import { useStateValue } from "../../contexts/auth.context";
import { useTasksState } from "../../contexts/tasks.context";
import RightClickMenu from "./context-menu.component";

const ContextMenuContainer = ({ idx, task, children, hideMenu }) => {
  const { deleteTask, removeFromMyDay, addTaskToMyDay } = useTasksState();
  const {
    currentUser: { id },
  } = useStateValue();

  return (
    <>
      {!hideMenu ? (
        <RightClickMenu
          idx={idx}
          menuItems={[
            task.addedToMyDay
              ? {
                  label: "Remove from MyDay",
                  onClick: () => removeFromMyDay(id, task),
                  style: { color: "black" },
                }
              : {
                  label: "Add to MyDay",
                  onClick: () => addTaskToMyDay(id, task),
                  style: { color: "black" },
                },
            {
              label: "Delete",
              onClick: () => deleteTask(id, task),
              style: { color: "red" },
            },
          ]}
        >
          {children}
        </RightClickMenu>
      ) : (
        <React.Fragment>{children}</React.Fragment>
      )}
    </>
  );
};

export default ContextMenuContainer;
