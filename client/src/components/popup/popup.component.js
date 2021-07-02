import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { useStateValue } from "../../contexts/auth.context";
import { useTasksState } from "../../contexts/tasks.context";
import "./popup.styles.scss";

const TaskPopup = ({ open, onClose, task, onTaskClick }) => {
  const [disabled, setDisabled] = useState(true);
  const [editText, setEditText] = useState(task.text);
  const { updateSpecificTask, deleteTask } = useTasksState();
  const {
    currentUser: { id },
  } = useStateValue();

  const onChange = (e) => {
    setEditText(e.target.value);
  };

  const onTaskTextEdit = () => {
    if (editText === task.text) {
      return;
    }
    updateSpecificTask(id, { taskId: task.id, update: { text: editText } });
  };
  const onPopupClose = () => {
    if (!disabled) {
      setDisabled((d) => !d);
    }
    onTaskTextEdit();
    onClose();
  };

  const onDisableClick = () => {
    if (disabled) {
      setDisabled((d) => !d);
    }
  };

  return (
    <Modal
      show={open}
      onHide={() => onPopupClose()}
      centered
      aria-labelledby="contained-modal-title-vcenter"
    >
      <Modal.Header>
        <Modal.Title id="contained-modal-title-vcenter">
          <div className="d-flex align-items-center">
            <img
              className="check-icon"
              src={
                task.checked ? "/assets/checked.svg" : "/assets/unchecked.svg"
              }
              alt="check"
              onMouseOver={(e) => (e.currentTarget.src = "/assets/checked.svg")}
              onMouseOut={(e) =>
                (e.currentTarget.src = task.checked
                  ? "/assets/checked.svg"
                  : "/assets/unchecked.svg")
              }
              onClick={onTaskClick}
            />
            <div
              className="d-flex align-items-center"
              onClick={() => onDisableClick()}
            >
              {/* task */}
              <input
                className="modal-input"
                value={editText}
                style={
                  task.checked && disabled
                    ? { textDecoration: "line-through", opacity: 0.7 }
                    : undefined
                }
                disabled={disabled}
                onChange={onChange}
              />

              {!disabled && (
                <img
                  className="edit-img"
                  src="/assets/edit.svg"
                  alt="edit"
                  onClick={() => onTaskTextEdit()}
                />
              )}
            </div>
          </div>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div>
          <div
            className="modal-option"
            onClick={
              task.addedToMyDay
                ? () =>
                    updateSpecificTask(id, {
                      taskId: task.id,
                      update: { addedToMyDay: false },
                    })
                : () =>
                    updateSpecificTask(id, {
                      taskId: task.id,
                      update: { addedToMyDay: true },
                    })
            }
          >
            <img src="/assets/sun-white.svg" alt="myday" />
            <span>
              {task.addedToMyDay ? "Remove from MyDay" : "Add to MyDay"}
            </span>
          </div>

          <div className="modal-option" onClick={() => deleteTask(id, task.id)}>
            <img src="/assets/delete.svg" alt="remove" />
            <span>Delete task</span>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="dark" onClick={() => onPopupClose()}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default TaskPopup;
