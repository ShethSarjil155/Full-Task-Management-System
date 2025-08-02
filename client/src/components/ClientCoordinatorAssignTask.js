import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ClientCoordinatorAssignTask.css"; // Create this CSS as needed

const ClientCoordinatorAssignTask = () => {
  const [companies, setCompanies] = useState([]);
  const [teamLeaders, setTeamLeaders] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [taskName, setTaskName] = useState("");
  const [preview, setPreview] = useState("");
  const [selectedTeamLeader, setSelectedTeamLeader] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    // Fetch companies
    const fetchCompanies = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/companies");
        const result = await response.json();

        if (result.success) {
          console.log(result.companies); // Should log companies here
          setCompanies(result.companies);
        } else {
          console.error("Failed to fetch companies");
        }
      } catch (error) {
        console.error("Error fetching companies:", error);
      }
    };

    // Fetch team leaders
    const fetchTeamLeaders = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/team-leaders");
        const data = await response.json();
        setTeamLeaders(data);
      } catch (error) {
        console.error("Error fetching team leaders:", error);
      }
    };

    fetchCompanies();
    fetchTeamLeaders();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedCompany || !taskName || !selectedTeamLeader) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      const token = localStorage.getItem("usersdatatoken");
      const response = await fetch("http://localhost:5000/api/assign-task", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          companyId: selectedCompany,
          taskName,
          preview,
          teamLeaderId: selectedTeamLeader,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to assign task");
      }

      alert("Task assigned successfully");
      navigate("/userdash");
    } catch (error) {
      console.error("Error assigning task:", error.message);
      alert(`Task assignment failed: ${error.message}`);
    }
  };

  return (
    <div className="clientCoordinator-assign-task-form-container">
      <form
        onSubmit={handleSubmit}
        className="clientCoordinator-assign-task-form"
      >
        <div className="clientCoordinator-form-group">
          <label>Company:</label>
          <select
            value={selectedCompany}
            onChange={(e) => setSelectedCompany(e.target.value)}
            required
          >
            <option value="">Select a company</option>
            {companies && companies.length > 0 ? (
              companies.map((company) => (
                <option key={company._id} value={company._id}>
                  {company.companyName}
                </option>
              ))
            ) : (
              <option disabled>No companies available</option>
            )}
          </select>
        </div>

        <div className="clientCoordinator-form-group">
          <label>Task Name:</label>
          <input
            type="text"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            required
          />
        </div>
        <div className="clientCoordinator-form-group">
          <label>Preview (Optional):</label>
          <textarea
            value={preview}
            onChange={(e) => setPreview(e.target.value)}
          ></textarea>
        </div>
        <div className="clientCoordinator-form-group">
          <label>Assign to (Team Leader):</label>
          <select
            value={selectedTeamLeader}
            onChange={(e) => setSelectedTeamLeader(e.target.value)}
            required
          >
            <option value="">Select a team leader</option>
            {teamLeaders.map((leader) => (
              <option key={leader._id} value={leader._id}>
                {leader.team} {/* Assuming the API provides team names */}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className="clientCoordinator-btn btn-primary">
          Assign Task
        </button>
      </form>
    </div>
  );
};

export default ClientCoordinatorAssignTask;
