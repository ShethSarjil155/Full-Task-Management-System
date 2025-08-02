// import React from "react";
// import "./clientuserlist.css";
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
//               <a href="#">
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
// import "./clientuserlist.css";
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

//       // Filter out users with fname as 'admin'
//       const filteredUsers = data.filter((user) => user.fname !== "admin");

//       setList(filteredUsers);
//     } catch (error) {
//       console.error("Error fetching user data:", error.message);
//     }
//   };

//   const handleBlock = async (email) => {
//     try {
//       const response = await fetch(
//         `http://localhost:5000/api/blocked/${email}`,
//         {
//           method: "PUT",
//           headers: {
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       if (!response.ok) {
//         throw new Error("Failed to block user");
//       } else {
//         window.location.reload();
//       }
//     } catch (error) {
//       console.error("Error blocking user:", error.message);
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
//               <a href="#">
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
//         <div className="user-table">
//           <div className="table-header">
//             <div className="table-cell">Name</div>
//             <div className="table-cell">Email</div>
//             <div className="table-cell">Date Created</div>
//           </div>
//           {list.map((item, index) => (
//             <div className="table-row" key={index}>
//               <div className="table-cell">{item.fname}</div>
//               <div className="table-cell">{item.email}</div>
//               <div className="table-cell">{item.dateCreated}</div>
//             </div>
//           ))}
//         </div>
//       </main>
//     </div>
//   );
// };

// export default ClientDashboard;

// import React, { useState, useEffect } from "react";
// import "./clientuserlist.css";
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
//               <a href="#">
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
//         <h2 className="client-main-title">User Details</h2>
//         <div className="user-table">
//           <table>
//             <thead>
//               <tr>
//                 <th>Name</th>
//                 <th>Email</th>
//                 <th>Date Created</th>
//               </tr>
//             </thead>
//             <tbody>
//               {list.map((item, index) => (
//                 <tr key={index}>
//                   <td>{item.fname}</td>
//                   <td>{item.email}</td>
//                   <td>{item.dateCreated}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </main>
//     </div>
//   );
// };

// export default ClientDashboard;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ClientSidebar from "./ClientDahboard";
import "./clientuserlist.css"; // CSS for user list

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

  const handleLogout = (e) => {
    e.preventDefault();
    if (window.confirm("Are you sure you want to logout?")) {
      navigate("/login");
      console.log("User logged out");
    }
  };

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <div className="client-container">
      <ClientSidebar onLogout={handleLogout} onNavigate={handleNavigate} />
      <main className="client-main-content">
        <h2 className="client-main-title">User Details</h2>
        <div className="user-table">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Date Created</th>
              </tr>
            </thead>
            <tbody>
              {list.map((item, index) => (
                <tr key={index}>
                  <td>{item.fname}</td>
                  <td>{item.email}</td>
                  <td>{item.dateCreated}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default ClientDashboard;
