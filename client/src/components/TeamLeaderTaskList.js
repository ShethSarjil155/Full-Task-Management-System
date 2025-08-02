import React, { useEffect, useState } from "react";
import "./TasksForLeader.css"; // Assuming you have some CSS for styling

const TasksForLeader = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch tasks from the backend when the component mounts
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem("usersdatatoken");
        const response = await fetch(
          "http://localhost:5000/api/tasks-for-leader",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`, // Using token-based authentication
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch tasks");
        }

        const data = await response.json();
        console.log(data);
        setTasks(data.tasksForLeader); // Set the tasks in state
        setLoading(false);
      } catch (error) {
        console.error("Error fetching tasks:", error.message);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchTasks();
  }, []); // Runs once on mount

  // Handle task acceptance
  const handleAcceptTask = async (taskId, clientCoordinatorId) => {
    try {
      const token = localStorage.getItem("usersdatatoken");
      const response = await fetch(
        `http://localhost:5000/api/accept-task/${taskId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to accept task");
      }

      // Update the task list
      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId));

      alert("Task accepted successfully!");
    } catch (error) {
      console.error("Error accepting task:", error.message);
      alert("Failed to accept task");
    }
  };

  // Handle task rejection
  const handleRejectTask = async (taskId) => {
    try {
      const token = localStorage.getItem("usersdatatoken");
      const response = await fetch(
        `http://localhost:5000/api/reject-task/${taskId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to reject task");
      }

      // Update the task list
      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId));

      alert("Task rejected successfully!");
    } catch (error) {
      console.error("Error rejecting task:", error.message);
      alert("Failed to reject task");
    }
  };

  // Loading and error handling UI
  if (loading) {
    return <p>Loading tasks...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  // Task rendering UI
  return (
    <div className="tasksForLeaderList">
      <h2>Tasks Sent to Me</h2>
      {tasks.length === 0 ? (
        <p>No tasks found.</p>
      ) : (
        <ul>
          {tasks.map((task) => (
            <li key={task._id} className="tasksForLeaderItem">
              <div className="tasksForLeaderDetails">
                <h3 className="tasksForLeaderName">
                  Task Name: {task.taskName}
                </h3>
                <p className="tasksForLeaderPreview">Preview: {task.preview}</p>
                <p className="tasksForLeaderCompany">
                  Company: {task.companyId?.companyName}
                </p>
                <p className="tasksForLeaderDate">
                  Assigned by: {task.assignedBy?.fname} on{" "}
                  {new Date(task.assignedAt).toLocaleString()}
                </p>
                <p className="tasksForLeaderTeammate">
                  Teammate Assigned: {task.teammateAssignedTo?.fname}
                </p>
                <p className="tasksForLeaderStatus">
                  Status: {task.isFinished ? "Completed" : "Pending"}
                </p>
              </div>
              <div className="tasksForLeaderButtons">
                <button
                  onClick={() => handleAcceptTask(task._id)}
                  className="tasksForLeaderAcceptButton"
                >
                  Accept
                </button>
                <button
                  onClick={() => handleRejectTask(task._id)}
                  className="tasksForLeaderRejectButton"
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

export default TasksForLeader;
