// import React from "react";
// import "./clientdashboard.css";
// import { FaUsers, FaSignInAlt, FaEnvelope, FaSignOutAlt } from "react-icons/fa";
// import Logo from "./Images/Leaf way Logo White.png"; // Assuming you have a logo.png file in the same directory
// import { useNavigate } from "react-router-dom";

// const ClientDashboard = () => {
//   const navigate = useNavigate();
//   const logout = (e) => {
//     e.preventDefault();
//     if (window.confirm("Are you sure you want to logout?")) {
//       // Perform logout action here
//       navigate("/login");
//       console.log("User logged out");
//     }
//   };
//   const users = () => {
//     navigate("/clientusers");
//   };

//   return (
//     <div className="client-container">
//       <aside className="client-sidebar">
//         <div className="client-sidebar-header">
//           {/* <img src={Logo} alt="Acme Inc Logo" className="client-logo" /> */}
//           <h2>LeafWay InfoTech</h2>
//         </div>
//         <nav className="client-sidebar-nav">
//           <ul>
//             <li>
//               <a href="#" onClick={users}>
//                 <FaUsers /> All Users
//               </a>
//             </li>
//             <li>
//               <a href="#">
//                 <FaSignInAlt /> Login History
//               </a>
//             </li>
//             <li>
//               <a href="#">
//                 <FaEnvelope /> Send Message
//               </a>
//             </li>
//             <li>
//               <a href="#" onClick={logout}>
//                 <FaSignOutAlt /> Logout
//               </a>
//             </li>
//           </ul>
//         </nav>
//       </aside>
//       <main className="client-main-content">
//         <div className="client-stats">
//           <div className="client-stat-item">
//             <h3>Total Users</h3>
//             <p>1,234</p>
//           </div>
//           <div className="client-stat-item">
//             <h3>Active Users</h3>
//             <p>987</p>
//           </div>
//           <div className="client-stat-item">
//             <h3>New Users</h3>
//             <p>123</p>
//           </div>
//           <div className="client-stat-item">
//             <h3>Pending Users</h3>
//             <p>45</p>
//           </div>
//         </div>
//         <div className="client-recent-activity">
//           <h3>Recent Activity</h3>
//           <table>
//             <thead>
//               <tr>
//                 <th>User</th>
//                 <th>Action</th>
//                 <th>Time</th>
//               </tr>
//             </thead>
//             <tbody>
//               <tr>
//                 <td>John Doe</td>
//                 <td>Logged in</td>
//                 <td>2 hours ago</td>
//               </tr>
//             </tbody>
//           </table>
//         </div>
//       </main>
//     </div>
//   );
// };

// export default ClientDashboard;

// import React, { useState, useEffect } from "react";
// import "./clientdashboard.css";
// import { FaUsers, FaSignInAlt, FaEnvelope, FaSignOutAlt } from "react-icons/fa";
// import Logo from "./Images/Leaf way Logo White.png";
// import { useNavigate } from "react-router-dom";

// const ClientDashboard = () => {
//   const [list, setList] = useState([]);
//   const navigate = useNavigate();

//   const getData = async () => {
//     try {
//       const res = await fetch("http://localhost:5000/api/allusers", {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//         },
//       });

//       if (!res.ok) {
//         throw new Error("Failed to fetch user data");
//       }

//       const data = await res.json();

//       // Filter out users with fname as 'admin' and specific email
//       const filteredUsers = data.filter(
//         (user) =>
//           user.fname !== "admin" && user.email !== "leafwayclient@gmail.com"
//       );

//       setList(filteredUsers);
//     } catch (error) {
//       console.error("Error fetching user data:", error.message);
//     }
//   };

//   useEffect(() => {
//     getData();
//   }, []);

//   const logout = (e) => {
//     e.preventDefault();
//     if (window.confirm("Are you sure you want to logout?")) {
//       navigate("/login");
//       console.log("User logged out");
//     }
//   };

//   const users = (e) => {
//     navigate("/clientusers");
//   };

//   return (
//     <div className="client-container">
//       <aside className="client-sidebar">
//         <div className="client-sidebar-header">
//           <img src={Logo} alt="Acme Inc Logo" className="client-logo" />
//           <h2>LeafWay InfoTech</h2>
//         </div>
//         <nav className="client-sidebar-nav">
//           <ul>
//             <li>
//               <a href="#" onClick={users}>
//                 <FaUsers /> All Users
//               </a>
//             </li>
//             <li>
//               <a href="#">
//                 <FaSignInAlt /> Login History
//               </a>
//             </li>
//             <li>
//               <a href="#">
//                 <FaEnvelope /> Send Message
//               </a>
//             </li>
//             <li>
//               <a href="#" onClick={logout}>
//                 <FaSignOutAlt /> Logout
//               </a>
//             </li>
//           </ul>
//         </nav>
//       </aside>
//     </div>
//   );
// };

// export default ClientDashboard;

import React, { useState, useEffect } from "react";
import "./clientdashboard.css";
import { FaUsers, FaSignInAlt, FaEnvelope, FaSignOutAlt } from "react-icons/fa";
import Logo from "./Images/Leaf way Logo White.png";
import { useNavigate } from "react-router-dom";

const ClientDashboard = () => {
  const [list, setList] = useState([]);
  const navigate = useNavigate();

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

      // Filter out users with fname as 'admin' and specific email
      const filteredUsers = data.filter(
        (user) =>
          user.fname !== "admin" && user.email !== "leafwayclient@gmail.com"
      );

      setList(filteredUsers);
    } catch (error) {
      console.error("Error fetching user data:", error.message);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const logout = (e) => {
    e.preventDefault();
    if (window.confirm("Are you sure you want to logout?")) {
      navigate("/login");
      console.log("User logged out");
    }
  };

  const users = (e) => {
    navigate("/clientusers");
  };

  const loginhistory = (e) => {
    navigate("/clientusershistory");
  };
  const sendmessage = (e) => {
    navigate("/clientsendmessage");
  };

  return (
    <div className="client-container">
      <aside className="client-sidebar">
        <div className="client-sidebar-content">
          <div className="client-sidebar-header">
            <img src={Logo} alt="Acme Inc Logo" className="client-logo" />
            <h2>Client Panel</h2>
          </div>
          <nav className="client-sidebar-nav">
            <ul>
              <li>
                <a href="#" onClick={users}>
                  <FaUsers /> All Users
                </a>
              </li>
              <li>
                <a href="#" onClick={loginhistory}>
                  <FaSignInAlt /> Login History
                </a>
              </li>
              <li>
                <a href="#" onClick={sendmessage}>
                  <FaEnvelope /> Send Message
                </a>
              </li>

              <li>
                <a href="#" onClick={logout}>
                  <FaSignOutAlt /> Logout
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </aside>
    </div>
  );
};

export default ClientDashboard;
