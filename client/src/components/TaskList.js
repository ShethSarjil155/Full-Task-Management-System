import React, { useEffect, useState } from "react";
import "./TasksAssignedToMe.css";

const TasksAssignedToMe = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [completedPreviews, setCompletedPreviews] = useState({});

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem("usersdatatoken");
        const response = await fetch(
          "http://localhost:5000/api/tasks-assigned-to-me",
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
        setTasks(data.tasksAssignedToTeammate || []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching tasks:", error.message);
        setError("Failed to load tasks. Please try again.");
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const handleStartTask = async (taskId) => {
    try {
      const token = localStorage.getItem("usersdatatoken");
      const response = await fetch(
        `http://localhost:5000/api/tasks/start/${taskId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to start task");
      }

      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === taskId ? { ...task, isStarted: true } : task
        )
      );

      alert("Task started successfully!");
    } catch (error) {
      console.error("Error starting task:", error.message);
      alert("Failed to start task. Please try again.");
    }
  };

  const handleFinishTask = async (taskId, completedCount) => {
    try {
      const token = localStorage.getItem("usersdatatoken");
      const response = await fetch(
        `http://localhost:5000/api/tasks/finish/${taskId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ completedCount }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to finish task");
      }

      const updatedTaskData = await response.json();
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === taskId ? updatedTaskData.task : task
        )
      );

      alert("Task progress saved successfully!");
    } catch (error) {
      console.error("Error finishing task:", error.message);
      alert("Failed to finish task. Please try again.");
    }
  };

  const handleInputChange = (taskId, value) => {
    setCompletedPreviews((prevState) => ({
      ...prevState,
      [taskId]: value,
    }));
  };

  if (loading) {
    return <p>Loading tasks...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="tasksList">
      <h2>Tasks Assigned to Me</h2>
      {tasks.length === 0 ? (
        <p className="noTasks">No tasks found.</p>
      ) : (
        <ul>
          {tasks.map((task) => (
            <li key={task._id} className="taskItem">
              <h3 className="taskName">Task Name: {task.taskName}</h3>
              <p className="taskCompany">
                Company Name: {task.companyId?.companyName}
              </p>
              <p className="taskPreview">Total Previews: {task.preview}</p>
              <p className="taskCompletedPreviews">
                Completed Previews: {task.completedPreviews}
              </p>
              <p className="taskRemainingPreviews">
                Remaining Previews: {task.remainingPreviews}
              </p>
              <p className="taskDate">
                Assigned on: {new Date(task.assignedAt).toLocaleString()}
              </p>
              {!task.isFinished ? (
                <div className="taskButtons">
                  {!task.isStarted && (
                    <button
                      onClick={() => handleStartTask(task._id)}
                      className="startButton"
                    >
                      Start
                    </button>
                  )}
                  {task.isStarted && (
                    <>
                      <input
                        type="number"
                        placeholder="Completed previews"
                        min="1"
                        max={task.remainingPreviews}
                        value={completedPreviews[task._id] || ""}
                        onChange={(e) =>
                          handleInputChange(task._id, parseInt(e.target.value))
                        }
                      />
                      <button
                        onClick={() =>
                          handleFinishTask(
                            task._id,
                            completedPreviews[task._id] || 0
                          )
                        }
                        className="finishButton"
                      >
                        Finish
                      </button>
                    </>
                  )}
                </div>
              ) : (
                <p className="taskCompleted">Task Completed</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TasksAssignedToMe;
