import React, { useEffect, useState } from "react";
import "./clientcoordinatorseetasks.css";

const ClientCoordinatorTasks = () => {
  const [tasks, setTasks] = useState([]); // Store tasks
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(""); // Error state

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem("usersdatatoken");
        const response = await fetch(
          "http://localhost:5000/api/tasks-for-client-coordinator",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`, // Pass the auth token
            },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch tasks");

        const data = await response.json();

        // Ensure tasks are an array before updating the state
        if (Array.isArray(data.tasksForClientCoordinator)) {
          setTasks(data.tasksForClientCoordinator);
        } else {
          console.error(
            "Invalid task data format:",
            data.tasksForClientCoordinator
          );
          setError("Unexpected response format.");
        }

        const pendingTasks = data.tasksForClientCoordinator.filter(
          (task) => task.status !== "completed" // or task.isFinished !== true
        );
        setTasks(pendingTasks); // Set tasks from response
      } catch (error) {
        console.error("Error fetching tasks:", error);
        setError("Error fetching tasks. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  // Handle task acceptance
  const handleAccept = async (taskId) => {
    try {
      const token = localStorage.getItem("usersdatatoken");
      const response = await fetch(
        `http://localhost:5000/api/client-coordinator-accept-task/${taskId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert(data.message);

        // Remove the task from the list (mark it as completed in the UI)
        setTasks(
          (prevTasks) => prevTasks.filter((task) => task._id !== taskId) // This removes the task locally
        );
      } else {
        alert("Failed to accept task.");
      }
    } catch (error) {
      console.error("Error accepting task:", error);
      alert("Error accepting task. Please try again.");
    }
  };

  // Handle task rejection
  const handleReject = async (taskId) => {
    try {
      const token = localStorage.getItem("usersdatatoken");
      const response = await fetch(
        `http://localhost:5000/api/client-coordinator-reject-task/${taskId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      if (response.ok) {
        alert(data.message);

        // Dynamically filter out the rejected task
        setTasks((prevTasks) =>
          prevTasks.filter((task) => task._id !== taskId)
        );
      } else {
        alert("Failed to reject task.");
      }
    } catch (error) {
      console.error("Error rejecting task:", error);
      alert("Error rejecting task. Please try again.");
    }
  };

  // Loading state
  if (loading) {
    return <p>Loading tasks...</p>;
  }

  // Error state
  if (error) {
    return <p>{error}</p>;
  }

  // Task rendering UI
  return (
    <div className="clientCoordinatorTasksContainer">
      <h1>Client Coordinator Tasks</h1>
      {tasks.length === 0 ? (
        <p className="noTasks">No tasks available.</p>
      ) : (
        <ul className="tasksList">
          {tasks.map((task) => (
            <li key={task._id} className="taskCard">
              <div className="taskDetails">
                <h3>Task Name: {task.taskName || "Unnamed Task"}</h3>
                <p>Company Name: {task.companyId?.companyName || "N/A"}</p>
                <p>Preview: {task.preview || "No Preview Available"}</p>
                <p>
                  Teammate Assigned: {task.teammateAssignedTo?.fname || "N/A"}
                </p>
                <p>Team Leader: {task.teamLeaderId?.fname || "N/A"}</p>
                <p>Assigned At: {new Date(task.assignedAt).toLocaleString()}</p>
              </div>
              <div className="taskActions">
                <button
                  onClick={() => handleAccept(task._id)}
                  className="taskButton taskAcceptButton"
                >
                  Accept
                </button>
                <button
                  onClick={() => handleReject(task._id)}
                  className="taskButton taskRejectButton"
                >
                  Reject
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ClientCoordinatorTasks;
