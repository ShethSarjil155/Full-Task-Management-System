import React, { useEffect, useState } from "react";
import "./TeamLeaderRequests.css";
import { useNavigate } from "react-router-dom";

const TeamLeaderRequests = () => {
  const [requests, setRequests] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const token = localStorage.getItem("usersdatatoken");
        const response = await fetch(
          "http://localhost:5000/api/team-requests",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch requests");
        }

        const data = await response.json();
        setRequests(data);
      } catch (error) {
        console.error("Error fetching requests:", error.message);
      }
    };

    fetchRequests();
  }, []);

  const handleApproval = async (id, action) => {
    try {
      const message = selectedMessage[id]; // Get the selected message for this request
      const token = localStorage.getItem("usersdatatoken");
      const response = await fetch(
        `http://localhost:5000/api/leader-approve-request/${id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ action, message }),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to ${action} request`);
      }

      setRequests((prevRequests) =>
        prevRequests.filter((request) => request._id !== id)
      );
    } catch (error) {
      console.error(`Error ${action}ing request:`, error.message);
    }
  };

  const handleDropdownChange = (id, value) => {
    setSelectedMessage((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  return (
    <div className="leader-requests-container">
      <h2>Team Leader Requests</h2>
      <table className="leader-requests-table">
        <thead>
          <tr>
            <th>Username</th>
            <th>Subject</th>
            <th>Request</th>
            <th>Time</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((request) => (
            <tr key={request._id}>
              <td>{request.userId.fname}</td>
              <td>{request.subject}</td>
              <td>{request.complaint}</td>
              <td>{new Date(request.createdAt).toLocaleString()}</td>
              <td>
                <select
                  onChange={(e) =>
                    handleDropdownChange(request._id, e.target.value)
                  }
                  value={selectedMessage[request._id] || ""}
                >
                  <option value="">Select an option</option>
                  <option value="We have work but we can give leave">
                    We have work but we can give leave
                  </option>
                  <option value="We can give leave, we don't have work">
                    We can give leave, we don't have work
                  </option>
                </select>
                <button onClick={() => handleApproval(request._id, "approve")}>
                  Approve
                </button>
                <button onClick={() => handleApproval(request._id, "reject")}>
                  Reject
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TeamLeaderRequests;
