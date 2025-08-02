import React, { useEffect, useState } from "react";
import "./UserComplaints.css";
import { FaTrash, FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const UserComplaints = () => {
  const [complaints, setComplaints] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const token = localStorage.getItem("usersdatatoken");
        const response = await fetch(
          "http://localhost:5000/api/user-complaints",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch complaints");
        }

        const data = await response.json();
        setComplaints(data);
      } catch (error) {
        console.error("Error fetching complaints:", error.message);
      }
    };

    fetchComplaints();
  }, []);

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this complaint?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const token = localStorage.getItem("usersdatatoken");
      const response = await fetch(
        `http://localhost:5000/api/delete-complaint/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete complaint");
      }

      setComplaints(complaints.filter((complaint) => complaint._id !== id));
    } catch (error) {
      console.error("Error deleting complaint:", error.message);
    }
  };

  const userhomepage = () => {
    navigate("/wox-dashboard");
  };

  return (
    <div className="complaints-container">
      <div className="complaints-header">
        <FaArrowLeft className="back-arrow" onClick={userhomepage} />
        <h2 className="complaints-heading">My Complaints</h2>
      </div>
      <ul className="complaints-list">
        {complaints.map((complaint) => (
          <li key={complaint._id} className="complaint-card">
            <div className="complaint-content">
              <p className="complaint-text">
                <strong>Subject:</strong> {complaint.subject}
              </p>
              <p className="complaint-text">
                <strong>Complaint:</strong> {complaint.complaint}
              </p>
              <p className="complaint-time">
                <strong>Submitted at:</strong>{" "}
                {new Date(complaint.createdAt).toLocaleString()}
              </p>
              <p className={`complaint-status ${complaint.status}`}>
                <strong>Status:</strong> {complaint.status}
              </p>
            </div>
            <div className="delete-container">
              <FaTrash
                className="delete-icon"
                onClick={() => handleDelete(complaint._id)}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserComplaints;
