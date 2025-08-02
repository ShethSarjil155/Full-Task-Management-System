import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";
import "./TaskForm.css";
import { LoginContext } from "./ContextProvider/Context";

const TaskForm = () => {
  const { logindata } = useContext(LoginContext);
  const [taskName, setTaskName] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [taskNameError, setTaskNameError] = useState("");
  const [startTimeError, setStartTimeError] = useState("");
  const [endTimeError, setEndTimeError] = useState("");
  const navigate = useNavigate();

  const validateForm = () => {
    let isValid = true;
    if (!taskName) {
      setTaskNameError("Task Name is required.");
      isValid = false;
    } else {
      setTaskNameError("");
    }

    if (!startTime) {
      setStartTimeError("Start Time is required.");
      isValid = false;
    } else {
      setStartTimeError("");
    }

    if (!endTime) {
      setEndTimeError("End Time is required.");
      isValid = false;
    } else if (new Date(startTime) >= new Date(endTime)) {
      setEndTimeError("End Time must be after Start Time.");
      isValid = false;
    } else {
      setEndTimeError("");
    }

    return isValid;
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const token = localStorage.getItem("usersdatatoken");

      const response = await fetch("http://localhost:5000/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          taskName,
          startTime: new Date(startTime).toISOString(),
          endTime: new Date(endTime).toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      alert("Task added successfully!");
      navigate("/tasklist");
    } catch (error) {
      console.error("Error adding task:", error);
      alert("An error occurred while adding the task.");
    }
  };

  return (
    <div>
      <div className="taskmain-container-bg">
        <div className="task-form-container">
          <h2>Add Task</h2>
          <form onSubmit={handleAddTask}>
            <div className="form-group-user">
              <label>Task Name:</label>
              <input
                type="text"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                placeholder="Enter Your Task"
              />
              {taskNameError && <p className="error-text">{taskNameError}</p>}
            </div>
            <div className="form-group-user">
              <label>Start Time:</label>
              <Datetime
                value={startTime}
                onChange={(date) => setStartTime(date)}
                inputProps={{ placeholder: "Select Start Time" }}
              />
              {startTimeError && <p className="error-text">{startTimeError}</p>}
            </div>
            <div className="form-group-user">
              <label>End Time:</label>
              <Datetime
                value={endTime}
                onChange={(date) => setEndTime(date)}
                inputProps={{ placeholder: "Select End Time" }}
              />
              {endTimeError && <p className="error-text">{endTimeError}</p>}
            </div>

            <button className="task-add" type="submit">
              Add Task
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TaskForm;
