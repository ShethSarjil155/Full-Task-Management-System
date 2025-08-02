import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./assigntaskform.css";

const AssignTaskForm = () => {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const [teammates, setTeammates] = useState([]);
  const [taskDetails, setTaskDetails] = useState({});
  const [splits, setSplits] = useState([]); // To hold the splits for multiple teammates
  const [totalPreview, setTotalPreview] = useState(0); // To store the total preview count

  useEffect(() => {
    const fetchTeammates = async () => {
      const token = localStorage.getItem("usersdatatoken");
      const response = await fetch("http://localhost:5000/api/teammates", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        console.error("Failed to fetch teammates");
        return;
      }
      const data = await response.json();
      setTeammates(data);
    };

    const fetchTaskDetails = async () => {
      const token = localStorage.getItem("usersdatatoken");
      const response = await fetch(
        `http://localhost:5000/api/fetchingtasks/${taskId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        console.error("Failed to fetch task details");
        return;
      }
      const data = await response.json();
      setTaskDetails(data);
      setTotalPreview(data.preview); // Set the total preview count from task details
    };

    if (taskId) {
      fetchTeammates();
      fetchTaskDetails();
    }
  }, [taskId]);

  const handleSplitChange = (index, value) => {
    setSplits((prevSplits) => {
      const updatedSplits = [...prevSplits];
      updatedSplits[index].count = value;
      return updatedSplits;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("usersdatatoken");

    const splitData = splits.map((split) => ({
      userId: split.userId,
      count: split.count,
      teamLeaderId: taskDetails.teamLeaderId, // Team leader assigning the task
      assignedBy: taskDetails.assignedBy, // Who is assigning the task
      assignedAt: new Date(), // Timestamp of when the task is assigned
    }));

    try {
      const response = await fetch(
        `http://localhost:5000/api/tasks/split/${taskId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ splits: splitData }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to split task");
      }

      const data = await response.json();
      alert(data.message); // Success alert

      // Update task details with new assigned previews
      setTaskDetails((prevDetails) => ({
        ...prevDetails,
        assignedPreviews: data.task.assignedPreviews, // Update task details with new assigned previews
      }));

      navigate("/userdash"); // Redirect to dashboard
    } catch (error) {
      console.error("Error splitting task:", error.message);
    }
  };

  const addSplitField = () => {
    // Check if previews exist
    if (taskDetails.preview > 0) {
      // Restrict based on total preview count only when previews exist
      const totalAssignedPreviews = splits.reduce(
        (sum, split) => sum + (split.count || 0),
        0
      );

      if (totalAssignedPreviews >= totalPreview) {
        alert("You cannot add more splits than the total preview count.");
        return;
      }
    }

    // Add a new split for a teammate
    setSplits([
      ...splits,
      { userId: "", count: taskDetails.preview > 0 ? 0 : null },
    ]);
  };

  const removeSplitField = (index) => {
    const updatedSplits = splits.filter((_, i) => i !== index);
    setSplits(updatedSplits);
  };

  return (
    // <form onSubmit={handleSubmit}>
    //   <h2>Assign Task</h2>
    //   <p>
    //     <strong>Company:</strong> {taskDetails.companyId?.companyName}
    //   </p>
    //   <p>
    //     <strong>Task:</strong> {taskDetails.taskName}
    //   </p>
    //   <p>
    //     <strong>Preview:</strong>{" "}
    //     {taskDetails.preview || "No Previews Available"}
    //   </p>

    //   <div>
    //     <h3>Assign Task to Teammates</h3>
    //     {splits.map((split, index) => (
    //       <div key={index}>
    //         <label>Select Teammate {index + 1}:</label>
    //         <select
    //           value={split.userId}
    //           onChange={(e) =>
    //             setSplits((prevSplits) => {
    //               const updatedSplits = [...prevSplits];
    //               updatedSplits[index].userId = e.target.value;
    //               return updatedSplits;
    //             })
    //           }
    //           required
    //         >
    //           <option value="">Select a teammate</option>
    //           {teammates.map((teammate) => (
    //             <option key={teammate._id} value={teammate._id}>
    //               {teammate.email}
    //             </option>
    //           ))}
    //         </select>

    //         {/* Show Preview Count input only if previews exist */}
    //         {taskDetails.preview > 0 && (
    //           <>
    //             <label>Preview Count:</label>
    //             <input
    //               type="number"
    //               value={split.count}
    //               onChange={(e) =>
    //                 handleSplitChange(index, parseInt(e.target.value))
    //               }
    //               min="1"
    //               max={totalPreview}
    //               required
    //             />
    //           </>
    //         )}

    //         <button type="button" onClick={() => removeSplitField(index)}>
    //           Remove Teammate
    //         </button>
    //       </div>
    //     ))}
    //     <button type="button" onClick={addSplitField}>
    //       Add Teammate
    //     </button>
    //   </div>

    //   {/* Show assigned previews if available */}
    //   {taskDetails.assignedPreviews &&
    //     taskDetails.assignedPreviews.length > 0 && (
    //       <div>
    //         <h3>Assigned Teammates:</h3>
    //         <ul>
    //           {taskDetails.assignedPreviews.map((preview, index) => (
    //             <li key={index}>
    //               {
    //                 teammates.find(
    //                   (teammate) => teammate._id === preview.userId
    //                 )?.email
    //               }
    //               - {preview.totalCount} previews
    //             </li>
    //           ))}
    //         </ul>
    //       </div>
    //     )}

    //   <button type="submit">Submit</button>
    // </form>
    <form className="assignTaskForm-container" onSubmit={handleSubmit}>
      <h2 className="assignTaskForm-heading">Assign Task</h2>
      <p className="assignTaskForm-company">
        <strong>Company:</strong> {taskDetails.companyId?.companyName}
      </p>
      <p className="assignTaskForm-task">
        <strong>Task:</strong> {taskDetails.taskName}
      </p>
      <p className="assignTaskForm-preview">
        <strong>Preview:</strong>{" "}
        {taskDetails.preview || "No Previews Available"}
      </p>

      <div className="assignTaskForm-assignSection">
        <h3 className="assignTaskForm-subHeading">Assign Task to Teammates</h3>
        {splits.map((split, index) => (
          <div key={index} className="assignTaskForm-splitContainer">
            <label className="assignTaskForm-label">
              Select Teammate {index + 1}:
            </label>
            <select
              className="assignTaskForm-select"
              value={split.userId}
              onChange={(e) =>
                setSplits((prevSplits) => {
                  const updatedSplits = [...prevSplits];
                  updatedSplits[index].userId = e.target.value;
                  return updatedSplits;
                })
              }
              required
            >
              <option value="">Select a teammate</option>
              {teammates.map((teammate) => (
                <option key={teammate._id} value={teammate._id}>
                  {teammate.email}
                </option>
              ))}
            </select>

            {taskDetails.preview > 0 && (
              <>
                <label className="assignTaskForm-label">Preview Count:</label>
                <input
                  className="assignTaskForm-input"
                  type="number"
                  value={split.count}
                  onChange={(e) =>
                    handleSplitChange(index, parseInt(e.target.value))
                  }
                  min="1"
                  max={totalPreview}
                  required
                />
              </>
            )}

            <button
              type="button"
              className="assignTaskForm-removeButton"
              onClick={() => removeSplitField(index)}
            >
              Remove Teammate
            </button>
          </div>
        ))}
        <button
          type="button"
          className="assignTaskForm-addButton"
          onClick={addSplitField}
        >
          Add Teammate
        </button>
      </div>

      {taskDetails.assignedPreviews &&
        taskDetails.assignedPreviews.length > 0 && (
          <div className="assignTaskForm-assignedSection">
            <h3 className="assignTaskForm-subHeading">Assigned Teammates:</h3>
            <ul className="assignTaskForm-assignedList">
              {taskDetails.assignedPreviews.map((preview, index) => (
                <li key={index} className="assignTaskForm-assignedItem">
                  {
                    teammates.find(
                      (teammate) => teammate._id === preview.userId
                    )?.email
                  }
                  - {preview.totalCount} previews
                </li>
              ))}
            </ul>
          </div>
        )}

      <button type="submit" className="assignTaskForm-submitButton">
        Submit
      </button>
    </form>
  );
};

export default AssignTaskForm;
