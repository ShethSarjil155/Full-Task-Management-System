import React, { useEffect, useState } from "react";
import "./AdminUserRequests.css";
import { useNavigate } from "react-router-dom";

const AdminUserRequests = () => {
  const [requests, setRequests] = useState([]);

  const navigate = useNavigate();

  const userrequestgraph = () => {
    navigate("/woxrequestsgraph");
  };

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/all-requests", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch requests");
        }

        const data = await response.json();
        setRequests(
          data.filter(
            (req) =>
              req.status === "approved by leader" ||
              req.status === "approved by admin" ||
              req.status === "rejected by admin"
          )
        );
      } catch (error) {
        console.error("Error fetching requests:", error.message);
      }
    };

    fetchRequests();
  }, []);

  const handleSolveRequest = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/solve-request/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to mark request as solved");
      }

      const result = await response.json();
      console.log("Solve request response:", result);

      setRequests((prevRequests) =>
        prevRequests.map((request) =>
          request._id === id ? { ...request, status: "Approved" } : request
        )
      );
    } catch (error) {
      console.error("Error marking request as solved:", error.message);
    }
  };

  const handleRejectRequest = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/reject-request/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to mark request as rejected");
      }

      const result = await response.json();
      console.log("Reject request response:", result);

      setRequests((prevRequests) =>
        prevRequests.map((request) =>
          request._id === id ? { ...request, status: "Rejected" } : request
        )
      );
    } catch (error) {
      console.error("Error marking request as rejected:", error.message);
    }
  };

  return (
    <div className="admin-requests-container">
      <button className="back-button" onClick={userrequestgraph}>
        &larr; Back
      </button>
      <div className="requests-content">
        <h2 className="complaints-heading">User Requests</h2>
        <table className="requests-table">
          <thead>
            <tr>
              <th>Username</th>
              <th>Subject</th>
              <th>Request</th>
              <th>Leader's Message</th> {/* New column for leader's message */}
              <th>Time</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((request) => (
              <tr key={request._id}>
                <td>{request.userId.fname}</td>
                <td>{request.subject}</td>
                <td className="wordbreaktd">{request.complaint}</td>
                <td>
                  {request.leaderMessage || "No message from leader"}
                </td>{" "}
                {/* Display leader's message */}
                <td>{new Date(request.createdAt).toLocaleString()}</td>
                <td>{request.status}</td>
                <td>
                  {request.status === "approved by leader" ? (
                    <>
                      <button
                        className="solve-button"
                        onClick={() => handleSolveRequest(request._id)}
                      >
                        Approve
                      </button>
                      <button
                        className="reject-button"
                        onClick={() => handleRejectRequest(request._id)}
                      >
                        Reject
                      </button>
                    </>
                  ) : request.status === "approved" ? (
                    <span>Request Approved</span>
                  ) : request.status === "rejected" ? (
                    <span>Request rejected</span>
                  ) : (
                    <span>Status unknown</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUserRequests;
