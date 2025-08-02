// Notifications.js
import React, { useState, useEffect } from "react";
import NotificationBadge from "./NotifyCount"; // Adjust the import path as necessary
import "./Notifications.css"; // Import the CSS file

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem("usersdatatoken");
        const res = await fetch("http://localhost:5000/api/notifications", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setNotifications(data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    const markNotificationsAsRead = async () => {
      try {
        const token = localStorage.getItem("usersdatatoken");
        await fetch("http://localhost:5000/api/notifications/mark-as-read", {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
      } catch (error) {
        console.error("Error marking notifications as read:", error);
      }
    };

    fetchNotifications();
    markNotificationsAsRead();
  }, []);

  return (
    <div className="notifications-container">
      <header>
        <h2>Notifications</h2>
        <NotificationBadge />
      </header>
      <div>
        {notifications.length === 0 ? (
          <p>No notifications available.</p>
        ) : (
          notifications.map((notification) => (
            <div key={notification._id} className="notification">
              <p>{notification.message}</p>
              <p>
                <small>
                  {new Date(notification.createdAt).toLocaleString()}
                </small>
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Notifications;
