import React, { useState, useEffect } from "react";
import Sidebar from "./SideBar"; // Assuming you have a Sidebar component
import "./TeamMembers.css"; // Create a CSS file for styling

const TeamMembers = () => {
  const [teammates, setTeammates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeammates = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/teammates", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("usersdatatoken")}`, // Assuming you're using JWT for authentication
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setTeammates(data);
      } catch (error) {
        console.error("Failed to fetch teammates", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeammates();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="team-container">
      {/* <Sidebar /> */}
      <div className="team-content">
        <h2>Your Team Members</h2>
        <table className="team-table">
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {teammates.map((teammate) => (
              <tr key={teammate._id}>
                <td>{teammate.fname}</td>
                <td>{teammate.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TeamMembers;
