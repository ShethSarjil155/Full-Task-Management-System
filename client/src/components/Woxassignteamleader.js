import React, { useState, useEffect } from "react";
import Sidebar from "./WoxSideBar";
import "./AdminAssignTeamLeader.css";

const AdminAssignTeamLeader = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentStatus, setCurrentStatus] = useState({});
  const [selectedTeams, setSelectedTeams] = useState({});

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
          acc[user._id] = { isTeamLeader: user.isTeamLeader, team: user.team };
          return acc;
        }, {});
        setCurrentStatus(status);

        // Initialize selectedTeams with the current team if the user is a team leader
        const initialSelectedTeams = filteredUsers.reduce((acc, user) => {
          if (user.isTeamLeader) {
            acc[user._id] = user.team;
          }
          return acc;
        }, {});
        setSelectedTeams(initialSelectedTeams);
      } catch (error) {
        console.error("Failed to fetch users", error);
      }
    };

    fetchUsers();
  }, []);

  const handleTeamChange = (userId, team) => {
    setSelectedTeams((prev) => ({ ...prev, [userId]: team }));
  };

  const handleTeamLeaderStatusChange = async (userId) => {
    setLoading(true);
    const isTeamLeader = !currentStatus[userId].isTeamLeader;
    const selectedTeam = selectedTeams[userId];

    if (isTeamLeader && !selectedTeam) {
      alert("Please select a team before making this user a Team Leader.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/make-team-leader/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ isTeamLeader, team: selectedTeam }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const responseData = await response.json();
      alert(responseData.message);

      setCurrentStatus((prevStatus) => ({
        ...prevStatus,
        [userId]: { isTeamLeader, team: selectedTeam },
      }));

      // Update selectedTeams when a user is no longer a team leader
      if (!isTeamLeader) {
        setSelectedTeams((prev) => {
          const newTeams = { ...prev };
          delete newTeams[userId];
          return newTeams;
        });
      }
    } catch (error) {
      console.error("Failed to update team leader status", error);
    } finally {
      setLoading(false);
    }
  };

  const teams = [
    "VFX",
    "Design",
    "PhotoShop",
    "UI/UX",
    "Developing",
    "Social Media",
    "Digital Marketing",
  ];

  return (
    <div className="team-container">
      <Sidebar />
      <div className="content">
        <h2>Assign or Remove Team Leader</h2>
        <table className="user-table">
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Team</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user.fname}</td>
                <td>{user.email}</td>
                <td>
                  <select
                    value={selectedTeams[user._id] || ""}
                    onChange={(e) => handleTeamChange(user._id, e.target.value)}
                    disabled={currentStatus[user._id].isTeamLeader}
                  >
                    <option value="">Select a team</option>
                    {teams.map((team) => (
                      <option key={team} value={team}>
                        {team}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <button
                    onClick={() => handleTeamLeaderStatusChange(user._id)}
                    disabled={
                      loading ||
                      (currentStatus[user._id].isTeamLeader &&
                        !selectedTeams[user._id])
                    }
                    className={
                      currentStatus[user._id].isTeamLeader ? "active" : ""
                    }
                  >
                    {currentStatus[user._id].isTeamLeader
                      ? `Remove Team Leader (${currentStatus[user._id].team})`
                      : "Make Team Leader"}
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

export default AdminAssignTeamLeader;
