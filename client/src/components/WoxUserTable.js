import React, { useState, useEffect } from "react";
import "./WoxUserTable.css";

function UserTable() {
  const [list, setList] = useState([]);

  const getData = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/allusers", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch user data");
      }

      const data = await res.json();

      // Filter out users with fname as 'admin'
      const filteredUsers = data.filter((user) => user.fname !== "admin");

      setList(filteredUsers);
    } catch (error) {
      console.error("Error fetching user data:", error.message);
    }
  };

  const handleBlock = async (email) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/blocked/${email}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to block user");
      } else {
        window.location.reload();
      }
    } catch (error) {
      console.error("Error blocking user:", error.message);
    }
  };

  const handleUnblock = async (email) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/unblocked/${email}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to unblock user");
      } else {
        window.location.reload();
      }
    } catch (error) {
      console.error("Error unblocking user:", error.message);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="wox-user-table">
      <div className="wox-table-header">
        <div className="wox-table-cell">Name</div>
        <div className="wox-table-cell">Email</div>
        <div className="wox-table-cell">Date Created</div>
        <div className="wox-table-cell">Actions</div>
      </div>
      {list.map((item, index) => (
        <div className="wox-table-row" key={index}>
          <div className="wox-table-cell">{item.fname}</div>
          <div className="wox-table-cell">{item.email}</div>
          <div className="wox-table-cell">{item.dateCreated}</div>
          <div className="wox-table-cell">
            {item.isBlocked === "y" ? (
              <button
                className="wox-b-button"
                onClick={() => handleUnblock(item.email)}
              >
                Unblock
              </button>
            ) : (
              <button
                className="wox-unb-button"
                onClick={() => handleBlock(item.email)}
              >
                Block
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default UserTable;
