import React, { useState } from "react";
import "./RequestForm.css";
import { useNavigate } from "react-router-dom";

const RequestForm = () => {
  const [subject, setSubject] = useState("");
  const [complaint, setComplaint] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("usersdatatoken");
      const response = await fetch(
        "http://localhost:5000/api/submit-complaint",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ subject, complaint }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to submit complaint");
      }

      const data = await response.json();
      alert(data.message);
      setSubject("");
      setComplaint("");
      navigate("/wox-user-requests");
    } catch (error) {
      console.error("Error submitting complaint:", error.message);
      alert("Failed to submit complaint");
    }
  };

  return (
    <div className="request-body">
      <div className="request-container">
        <div className="request-form-container">
          <h2>REQUEST FORM</h2>
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <input
                type="text"
                placeholder="Subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <textarea
                placeholder="Enter Your Request"
                value={complaint}
                onChange={(e) => setComplaint(e.target.value)}
                required
              ></textarea>
            </div>
            <button type="submit" className="req-btn">
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RequestForm;
