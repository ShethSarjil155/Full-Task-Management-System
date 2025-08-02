import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./TeamLeaderSendMessageForm.css";

const TeamLeaderSendMessageForm = () => {
  const [teammates, setTeammates] = useState([]);
  const [selectedTeammates, setSelectedTeammates] = useState([]);
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTeammates = async () => {
      try {
        const token = localStorage.getItem("usersdatatoken");
        const response = await fetch(
          "http://localhost:5000/api/teamleader/teammates-emails",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();

        if (!Array.isArray(data)) {
          throw new Error("Expected an array of teammates");
        }

        setTeammates(data);
      } catch (error) {
        console.error("Error fetching teammates:", error);
      }
    };

    fetchTeammates();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("usersdatatoken");
    const formData = new FormData();
    formData.append("message", message);
    selectedTeammates.forEach((teammateId) => {
      formData.append("teammateIds[]", teammateId);
    });
    Array.from(files).forEach((file) => {
      formData.append("files[]", file);
    });

    try {
      const response = await fetch(
        "http://localhost:5000/api/teamleader-send-message",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      alert("Message sent successfully");

      navigate("/wox-dashboard");
    } catch (error) {
      console.error("Error sending message:", error.message);
    }
  };

  const handleTeammateSelection = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions).map(
      (option) => option.value
    );
    setSelectedTeammates(selectedOptions);
  };

  const handleFileChange = (e) => {
    setFiles(e.target.files);
  };

  return (
    <div className="tlsm">
      <div className="tlsmsendmessageform">
        <form onSubmit={handleSubmit} className="tlsmsend-message-form">
          <div className="tlsmform-group">
            <label>Teammates:</label>
            <select
              multiple
              value={selectedTeammates}
              onChange={handleTeammateSelection}
              className="tlsmform-control"
            >
              {teammates.map((teammate) => (
                <option key={teammate._id} value={teammate._id}>
                  {teammate.email}
                </option>
              ))}
            </select>
          </div>
          <div className="tlsmform-group">
            <label>Message:</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="tlsmform-control"
              placeholder="Type your message..."
            ></textarea>
          </div>
          <div className="tlsmform-group tlsminput-file-adminside">
            <label>Files:</label>
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              className="tlsmform-control-file"
            />
          </div>
          <button type="submit" className="btn btn-primary tlsmsendddd">
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
};

export default TeamLeaderSendMessageForm;
