import React, { useState, useEffect } from "react";
import "./AdminTaskList.css";
import Sidebar from "./SideBar"; // Ensure the Sidebar import path is correct

const AdminTaskList = () => {
  const [tasks, setTasks] = useState([]);

  // Fetch tasks for the admin
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/admin/tasks", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch tasks");
        }

        const data = await response.json();
        setTasks(data);
      } catch (error) {
        console.error("Error fetching tasks:", error.message);
        alert("Failed to load tasks.");
      }
    };

    fetchTasks();
  }, []);

  // Handle task completion by admin
  const handleAdminDone = async (taskId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/tasks/${taskId}/admin-done`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete task");
      }

      // Fetch updated tasks after task is deleted
      setTasks(tasks.filter((task) => task._id !== taskId));
      alert("Task has been completed and removed from the list.");
    } catch (error) {
      console.error("Error deleting task:", error.message);
      alert("Failed to delete task.");
    }
  };

  return (
    <div className="admin-task-list-container">
      <Sidebar />
      <div className="task-list-content">
        <h2>All User Tasks</h2>
        {tasks.length === 0 ? (
          <p>No tasks available.</p>
        ) : (
          <ul>
            {tasks.map((task) => (
              <li key={task._id} className="task-item">
                <div>
                  <strong>Username:</strong> {task.userId.fname}
                </div>
                <div>
                  <strong>Task:</strong> {task.taskName}
                </div>
                <div>
                  <strong>Status:</strong>{" "}
                  {task.status === "Completed"
                    ? "Completed"
                    : task.status === "SentToAdmin"
                    ? "Sent to Admin"
                    : "Pending"}
                </div>
                <div>
                  <button onClick={() => handleAdminDone(task._id)}>
                    {task.status === "Completed"
                      ? "Task Already Done"
                      : "Mark as Done"}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AdminTaskList;
