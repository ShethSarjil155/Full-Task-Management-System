// import React, { useState, useEffect } from "react";
// import "./ViewMessages.css";

// const ViewMessages = ({ userId }) => {
//   const [messages, setMessages] = useState([]);

//   useEffect(() => {
//     const fetchMessages = async () => {
//       try {
import React, { useState, useEffect } from "react";
import { FaTrash } from "react-icons/fa";
import "./ViewMessages.css";

const ViewMessages = ({ userId }) => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/${userId}/messages`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch messages");
        }
        const data = await response.json();
        // Sort messages to display the latest message at the top
        const sortedMessages = data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setMessages(sortedMessages);
      } catch (error) {
        console.error("Error fetching messages:", error.message);
      }
    };

    fetchMessages();
  }, [userId]);

  const handleDownload = (fileName) => {
    const downloadUrl = `http://localhost:5000/${fileName}`;
    window.open(downloadUrl, "_blank");
  };

  const handleDelete = async (messageId) => {
    if (window.confirm("Are you sure you want to delete this message?")) {
      try {
        const response = await fetch(
          `http://localhost:5000/api/messages/${messageId}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to delete message");
        }

        // Update messages state after successful deletion
        setMessages(messages.filter((msg) => msg._id !== messageId));
        console.log("Message deleted successfully");
      } catch (error) {
        console.error("Error deleting message:", error.message);
      }
    }
  };

  return (
    <div className="messages-container">
      <h2>Your Messages</h2>
      {messages.length === 0 ? (
        <p>No messages found</p>
      ) : (
        <div className="messages-list">
          {messages.map((msg) => (
            <div key={msg._id} className="message-card">
              <p>
                <strong>Message:</strong> {msg.message}
              </p>
              {msg.files && msg.files.length > 0 && (
                <p>
                  <strong>Files:</strong>{" "}
                  {msg.files.map((file, index) => (
                    <button key={index} onClick={() => handleDownload(file)}>
                      Download File {index + 1}
                    </button>
                  ))}
                </p>
              )}
              <p>
                <small>
                  <strong>Date:</strong>{" "}
                  {new Date(msg.createdAt).toLocaleString()}
                </small>
              </p>
              <button
                className="delete-icon"
                onClick={() => handleDelete(msg._id)}
              >
                <FaTrash />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ViewMessages;
