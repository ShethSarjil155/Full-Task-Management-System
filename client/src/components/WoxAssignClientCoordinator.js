import React, { useState, useEffect } from "react";
import Sidebar from "./WoxSideBar";
import "./AdminAssignClientCoordinator.css";

const AdminAssignClientCoordinator = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentStatus, setCurrentStatus] = useState({});

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/allusers");
        const data = await response.json();
        const filteredUsers = data.filter(
          (user) =>
            user.email !== "leafwayadmin@gmail.com" &&
            user.email !== "woxadmin@gmail.com"
        );
        setUsers(filteredUsers);

        const status = filteredUsers.reduce((acc, user) => {
          acc[user._id] = { isClientCoordinator: user.isClientCoordinator };
          return acc;
        }, {});
        setCurrentStatus(status);
      } catch (error) {
        console.error("Failed to fetch users", error);
      }
    };

    fetchUsers();
  }, []);

  const handleClientCoordinatorStatusChange = async (userId) => {
    setLoading(true);
    const isClientCoordinator = !currentStatus[userId].isClientCoordinator;

    try {
      const response = await fetch(
        `http://localhost:5000/api/make-client-coordinator/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ isClientCoordinator }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const responseData = await response.json();
      alert(responseData.message);

      setCurrentStatus((prevStatus) => ({
        ...prevStatus,
        [userId]: { isClientCoordinator },
      }));
    } catch (error) {
      console.error("Failed to update client coordinator status", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="client-coordinator-container">
      <Sidebar />
      <div className="content">
        <h2>Assign or Remove Client Coordinator</h2>
        <table className="user-table">
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user.fname}</td>
                <td>{user.email}</td>
                <td>
                  <button
                    onClick={() =>
                      handleClientCoordinatorStatusChange(user._id)
                    }
                    disabled={loading}
                    className={
                      currentStatus[user._id].isClientCoordinator
                        ? "active"
                        : ""
                    }
                  >
                    {currentStatus[user._id].isClientCoordinator
                      ? "Remove Client Coordinator"
                      : "Make Client Coordinator"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminAssignClientCoordinator;
