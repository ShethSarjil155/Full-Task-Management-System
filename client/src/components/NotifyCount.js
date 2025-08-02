import React, { useState, useEffect } from "react";
import "./NotifyCount.css";

const NotificationBadge = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const fetchNotificationCount = async () => {
      try {
        const token = localStorage.getItem("usersdatatoken");
        const res = await fetch(
          "http://localhost:5000/api/notifications/count",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        const data = await res.json();
        setCount(data.unreadCount);
      } catch (error) {
        console.error("Error fetching notification count:", error);
      }
    };

    fetchNotificationCount();

    const interval = setInterval(fetchNotificationCount, 60000); // Refresh every minute

    return () => clearInterval(interval);
  }, []);

  return <div className="notification-badge">{count > 0 ? count : null}</div>;
};

export default NotificationBadge;
