import React, { useState, useEffect } from "react";
import "./SendMessageForm.css";
import { useNavigate } from "react-router-dom";

const SendMessageForm = () => {
  const [users, setUsers] = useState([]);
  const [userId, setUserId] = useState("");
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await fetch("http://localhost:5000/api/allusers");
      const data = await response.json();
      // Filter out the admin user
      const filteredUsers = data.filter(
        (user) =>
          user.email !== "leafwayadmin@gmail.com" &&
          user.email !== "woxadmin@gmail.com"
      );
      setUsers(filteredUsers);
    };

    fetchUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("userId", userId);
    formData.append("message", message);
    if (file) {
      formData.append("file", file);
    }

    try {
      const response = await fetch("http://localhost:5000/api/send-message", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      alert("Message sent successfully");
      navigate("/admin");
    } catch (error) {
      console.error("Error sending message:", error.message);
    }
  };

  return (
    <div className="sendmessageform">
      <form onSubmit={handleSubmit} className="send-message-form">
        <div className="form-group">
          <label>User Email:</label>
          <select
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            className="form-control"
          >
            <option value="">Select a user</option>
            {users.map((user) => (
              <option key={user._id} value={user._id}>
                {user.email}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Message:</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="form-control"
          ></textarea>
        </div>
        <div className="form-group">
          <label>File:</label>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            className="form-control-file file"
          />
        </div>
        <button type="submit" className="btn btn-primary sendddd">
          Send Message
        </button>
      </form>
    </div>
  );
};

export default SendMessageForm;
