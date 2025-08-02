import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./TeamLeaderTasks.css"; // Make sure this CSS file exists

const TeamLeaderTasks = () => {
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem("usersdatatoken");
        const response = await fetch(
          `http://localhost:5000/api/client-team-tasks`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch tasks");
        }

        const data = await response.json();

        // Filter out tasks that have already been assigned to teammates
        const unassignedTasks = data.filter((task) => !task.assignedTo);
        setTasks(unassignedTasks);
      } catch (error) {
        console.error("Error fetching tasks:", error.message);
      }
    };

    fetchTasks();
  }, []);

  const handleAssign = (taskId) => {
    navigate(`/tltoteammates/${taskId}`); // Navigate to the assign task form with the taskId
  };

  return (
    <div className="teamleader-tasks-container">
      <h2>Your Assigned Tasks</h2>
      {tasks.length === 0 ? (
        <p>No tasks assigned yet</p>
      ) : (
        <div className="teamleader-tasks-list">
          {tasks.map((task) => (
            <div key={task._id} className="teamleader-task-card">
              <p>
                <strong>Company:</strong> {task.companyId.companyName}
              </p>
              <p>
                <strong>Task:</strong> {task.taskName}
              </p>
              {task.preview && (
                <p>
                  <strong>Preview:</strong> {task.preview}
                </p>
              )}
              <p>
                <small>
                  <strong>Assigned At:</strong>{" "}
                  {new Date(task.assignedAt).toLocaleString()}
                </small>
              </p>
              <button onClick={() => handleAssign(task._id)}>Assign</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TeamLeaderTasks;
