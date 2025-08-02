// import React, { useContext, useEffect, useState } from "react";
// import { FiEdit2, FiTrash2, FiPlus } from "react-icons/fi";
// import { MdPushPin } from "react-icons/md";
// import { IoMdLogIn } from "react-icons/io";
// import { FaRegRegistered } from "react-icons/fa";
// import { TbLogout2 } from "react-icons/tb";
// import { BiMessageSquareDetail, BiTask } from "react-icons/bi";
// import { BsCardList } from "react-icons/bs";
// import { HiOutlineBell } from "react-icons/hi";
// import "./woxdash.css"; // Wox-specific CSS
// import { NavLink, useNavigate } from "react-router-dom";
// import { LoginContext } from "./ContextProvider/Context";
// import woxLogo from "./Images/woxlogo.png";
// import NotificationBadge from "./NotifyCount";
// import { RiTeamFill } from "react-icons/ri";
// import { MdAssignmentAdd } from "react-icons/md";
// import { GoVerified } from "react-icons/go";
// import { VscGitPullRequestNewChanges } from "react-icons/vsc";
// import { BsSend } from "react-icons/bs";
// import { FaTasks } from "react-icons/fa";
// import { CiViewList } from "react-icons/ci";

// const WoxDashboard = () => {
//   const { logindata, setLoginData } = useContext(LoginContext);
//   const navigate = useNavigate();
//   const [list, setList] = useState([]);
//   const [searchQuery, setSearchQuery] = useState("");

//   const handleSearchChange = (event) => {
//     setSearchQuery(event.target.value);
//   };

//   const filteredNotes = list.filter((note) =>
//     note.title.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   const fetchNotes = async () => {
//     try {
//       const token = localStorage.getItem("usersdatatoken");
//       const res = await fetch("http://localhost:5000/api/getnotes", {
//         method: "GET",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       });

//       if (!res.ok) {
//         throw new Error("Failed to fetch notes");
//       }

//       const data = await res.json();
//       setList(data);
//     } catch (error) {
//       console.error("Error fetching notes:", error.message);
//     }
//   };

//   const logout = async () => {
//     try {
//       const token = localStorage.getItem("usersdatatoken");
//       await fetch("http://localhost:5000/api/logout", {
//         method: "GET",
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//         credentials: "include",
//       });
//       localStorage.removeItem("usersdatatoken");
//       setLoginData(null);
//       navigate("/login");
//     } catch (error) {
//       console.error("Logout error:", error.message);
//     }
//   };

//   useEffect(() => {
//     if (logindata) fetchNotes();
//   }, [logindata]);

//   const goLogin = () => {
//     navigate("/login");
//   };

//   const goRegister = () => {
//     navigate("/register");
//   };

//   const requestform = () => {
//     navigate("/request");
//   };

//   const ownrequest = () => {
//     navigate("/ownrequest");
//   };
//   const messages = () => {
//     navigate("/viewmessage");
//   };
//   const taskform = () => {
//     navigate("/taskform");
//   };
//   const tasklists = () => {
//     navigate("/tasklist");
//   };
//   const notification = () => {
//     navigate("/notification");
//   };
//   const team = () => {
//     navigate("/team-members");
//   };

//   return (
//     <div className="wox-dashboard-container">
//       <header className="wox-header">
//         <div className="wox-logo-img-userside">
//           <img src={woxLogo} alt="Wox Logo" />
//         </div>
//         <div className="wox-auth-buttons">
//           {logindata ? (
//             <button onClick={logout}>
//               <TbLogout2 />
//               <span>Logout</span>
//             </button>
//           ) : (
//             <>
//               <button onClick={() => navigate("/login")}>
//                 <IoMdLogIn />
//                 <span>Login</span>
//               </button>
//               <button onClick={() => navigate("/register")}>
//                 <FaRegRegistered />
//                 <span>Register</span>
//               </button>
//             </>
//           )}
//         </div>
//       </header>
//       <div className="wox-main-content">
//         <aside className="wox-sidebar">
//           <NavLink to="/addnotes" className="wox-sidebar-link">
//             <FiPlus />
//             <span>Add Note</span>
//           </NavLink>
//           <NavLink to="/request" className="wox-sidebar-link">
//             <BiMessageSquareDetail />
//             <span>Request Form</span>
//           </NavLink>
//           <NavLink to="/ownrequest" className="wox-sidebar-link">
//             <BsCardList />
//             <span>Requests</span>
//           </NavLink>
//           <NavLink to="/notification" className="wox-sidebar-link">
//             <HiOutlineBell />
//             <NotificationBadge />
//             <span>Notification</span>
//           </NavLink>
//           <NavLink to="/viewmessage" className="wox-sidebar-link">
//             <BiMessageSquareDetail />
//             <span>Messages</span>
//           </NavLink>
//           {logindata?.isTeamLeader && (
//             <>
//               <NavLink to="/team-members" className="wox-sidebar-link">
//                 <RiTeamFill />
//                 <span>Team Members</span>
//               </NavLink>
//               <NavLink to="/team-members-request" className="wox-sidebar-link">
//                 <VscGitPullRequestNewChanges />
//                 <span>Team Requests</span>
//               </NavLink>
//               <NavLink
//                 to="/team-leader-send-message"
//                 className="wox-sidebar-link"
//               >
//                 <BsSend />
//                 <span>Send Message</span>
//               </NavLink>
//               <NavLink to="/tltasklist" className="wox-sidebar-link">
//                 <FaTasks />
//                 <span>Members Tasks</span>
//               </NavLink>
//               <NavLink to="/viewclientmessage" className="wox-sidebar-link">
//                 <CiViewList />
//                 <span>Client Messages</span>
//               </NavLink>
//             </>
//           )}
//           {logindata?.isClientCoordinator && (
//             <>
//               <NavLink to="/cordinatortoleader" className="wox-sidebar-link">
//                 <MdAssignmentAdd />
//                 <span>Assign Task</span>
//               </NavLink>
//               <NavLink to="/clientcoseeaccepttask" className="wox-sidebar-link">
//                 <GoVerified />
//                 <span>Completed Task</span>
//               </NavLink>
//             </>
//           )}
//           <NavLink to="/tasklist" className="wox-sidebar-link">
//             <BiTask />
//             <span>Task Lists</span>
//           </NavLink>
//         </aside>
//         <div className="wox-notes-list">
//           <h2>Welcome {logindata ? logindata.fname : "Guest"}!</h2>
//           <div className="wox-search-bar">
//             <input
//               type="text"
//               placeholder="Search notes..."
//               value={searchQuery}
//               onChange={handleSearchChange}
//             />
//           </div>
//           <div className="wox-notes-container">
//             {filteredNotes.map((note) => (
//               <div key={note._id} className="wox-note-card">
//                 <h3>{note.title}</h3>
//                 <p>{note.content}</p>
//                 <div className="wox-note-actions">
//                   <button>
//                     <FiTrash2 />
//                   </button>
//                   <button>
//                     <FiEdit2 />
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default WoxDashboard;

import React, { useContext, useEffect, useState } from "react";
import { FiEdit2, FiTrash2, FiPlus } from "react-icons/fi";
import { MdPushPin } from "react-icons/md";
import { IoMdLogIn } from "react-icons/io";
import { FaRegRegistered } from "react-icons/fa";
import { TbLogout2 } from "react-icons/tb";
import { BiMessageSquareDetail, BiTask } from "react-icons/bi";
import { BsCardList } from "react-icons/bs";
import { HiOutlineBell } from "react-icons/hi";
import { RiTeamFill } from "react-icons/ri";
import { MdAssignmentAdd } from "react-icons/md";
import { GoVerified } from "react-icons/go";
import { VscGitPullRequestNewChanges } from "react-icons/vsc";
import { BsSend } from "react-icons/bs";
import { FaTasks } from "react-icons/fa";
import { CiViewList } from "react-icons/ci";
import "./woxdash.css"; // Wox-specific CSS
import { NavLink, useNavigate } from "react-router-dom";
import { LoginContext } from "./ContextProvider/Context";
import woxLogo from "./Images/woxlogo.png";
import NotificationBadge from "./NotifyCount";

const WoxDashboard = () => {
  const { logindata, setLoginData } = useContext(LoginContext);
  const navigate = useNavigate();
  const [list, setList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredNotes = list.filter((note) =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const fetchNotes = async () => {
    try {
      const token = localStorage.getItem("usersdatatoken");
      const res = await fetch("http://localhost:5000/api/getnotes", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch notes");
      }

      const data = await res.json();

      const updatedList = data.map((note) => {
        const storedNote = JSON.parse(localStorage.getItem(`note_${note._id}`));
        return storedNote
          ? { ...note, isPinned: storedNote.isPinned }
          : { ...note, isPinned: false };
      });

      const sortedNotes = updatedList.sort((a, b) =>
        a.isPinned === b.isPinned ? 0 : a.isPinned ? -1 : 1
      );

      setList(sortedNotes);
    } catch (error) {
      console.error("Error fetching notes:", error.message);
    }
  };

  const fetchUserDetails = async () => {
    try {
      const token = localStorage.getItem("usersdatatoken");
      const res = await fetch(`http://localhost:5000/api/user-details`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }

      const data = await res.json();

      if (data.teamLeaderAlert) {
        alert("Congratulations! You are now a Team Leader.");
        // Reset the alert
        await fetch("http://localhost:5000/api/reset-team-leader-alert", {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: data.userId }),
        });
      }

      // Alert if user has been made a Client Coordinator
      if (data.clientCoordinatorAlert) {
        alert("Congratulations! You are now a Client Coordinator.");
        // Reset the client coordinator alert
        await fetch(
          "http://localhost:5000/api/reset-client-coordinator-alert",
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId: data.userId }),
          }
        );
      }

      // Continue with other logic...
    } catch (error) {
      console.error("Error fetching user details:", error.message);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("usersdatatoken");

    if (token && !logindata) {
      const fetchUserData = async () => {
        try {
          const res = await fetch("http://localhost:5000/api/validuser", {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });

          if (!res.ok) {
            throw new Error("Failed to fetch user data");
          }

          const data = await res.json();

          if (data.status === 401 || !data.validUserOne) {
            localStorage.removeItem("usersdatatoken");
            navigate("/login");
          } else {
            setLoginData(data.validUserOne);
            fetchUserDetails();
          }
        } catch (error) {
          console.error("Error fetching user data:", error.message);
        }
      };

      fetchUserData();
    } else if (logindata) {
      fetchNotes();
    }
  }, [logindata, navigate, setLoginData]);

  const pinNote = async (id) => {
    try {
      const token = localStorage.getItem("usersdatatoken");
      await fetch(`http://localhost:5000/api/pinnote/${id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      setList((prevList) =>
        prevList
          .map((note) =>
            note._id === id ? { ...note, isPinned: !note.isPinned } : note
          )
          .sort((a, b) => (a.isPinned === b.isPinned ? 0 : a.isPinned ? -1 : 1))
      );
    } catch (error) {
      console.error("Error pinning note:", error.message);
      alert("Failed to pin note.");
    }
  };

  const deleteNote = async (id) => {
    if (!window.confirm("Are you sure you want to delete this note?")) return;

    try {
      const token = localStorage.getItem("usersdatatoken");
      await fetch(`http://localhost:5000/api/deletenote/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      setList((prevList) => prevList.filter((note) => note._id !== id));
    } catch (error) {
      console.error("Error deleting note:", error.message);
      alert("Failed to delete note.");
    }
  };

  const logout = async () => {
    try {
      const token = localStorage.getItem("usersdatatoken");
      await fetch("http://localhost:5000/api/logout", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });
      localStorage.removeItem("usersdatatoken");
      setLoginData(null);
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error.message);
    }
  };

  useEffect(() => {
    if (logindata) fetchNotes();
  }, [logindata]);

  const goLogin = () => {
    navigate("/login");
  };

  const goRegister = () => {
    navigate("/register");
  };

  const requestform = () => {
    navigate("/request");
  };

  const ownrequest = () => {
    navigate("/ownrequest");
  };
  const messages = () => {
    navigate("/viewmessage");
  };
  const taskform = () => {
    navigate("/taskform");
  };
  const tasklists = () => {
    navigate("/tasklist");
  };
  const notification = () => {
    navigate("/notification");
  };
  const team = () => {
    navigate("/team-members");
  };

  return (
    <div className="wox-dashboard-container">
      <header className="wox-header">
        <div className="wox-logo-img-userside">
          <img src={woxLogo} alt="Logo" />
        </div>
        <div className="wox-auth-buttons">
          {logindata ? (
            <button onClick={logout}>
              <TbLogout2 />
              <span>Logout</span>
            </button>
          ) : (
            <>
              <button onClick={goLogin}>
                <IoMdLogIn />
                <span>Login</span>
              </button>
              <button onClick={goRegister}>
                <FaRegRegistered />
                <span>Register</span>
              </button>
            </>
          )}
        </div>
      </header>
      <div className="wox-main-content">
        <aside className="woxuser-sidebar">
          <NavLink to="/woxaddnote" className="wox-sidebar-link">
            <FiPlus />
            <span>Add Note</span>
          </NavLink>
          <NavLink to="/wox-user-requestform" className="wox-sidebar-link">
            <BiMessageSquareDetail />
            <span>Request Form</span>
          </NavLink>
          <NavLink to="/wox-user-requests" className="wox-sidebar-link">
            <BsCardList />
            <span>Requests</span>
          </NavLink>
          <NavLink to="/notification" className="wox-sidebar-link">
            <HiOutlineBell />
            <NotificationBadge />
            <span>Notification</span>
          </NavLink>
          <NavLink to="/viewmessage" className="wox-sidebar-link">
            <BiMessageSquareDetail />
            <span>Messages</span>
          </NavLink>
          {logindata?.isTeamLeader && (
            <NavLink to="/team-members" className="wox-sidebar-link">
              <RiTeamFill />
              <span>Team Members</span>
            </NavLink>
          )}
          {logindata?.isTeamLeader && (
            <NavLink to="/team-members-request" className="wox-sidebar-link">
              <VscGitPullRequestNewChanges />
              <span>Team Requests</span>
            </NavLink>
          )}
          {logindata?.isTeamLeader && (
            <NavLink
              to="/wox-team-leader-send-message"
              className="wox-sidebar-link"
            >
              <BsSend />
              <span>Send Message</span>
            </NavLink>
          )}
          {logindata?.isTeamLeader && (
            <NavLink to="/tltasklist" className="wox-sidebar-link">
              <FaTasks />
              <span>Members Tasks</span>
            </NavLink>
          )}
          {logindata?.isTeamLeader && (
            <NavLink to="/viewclientmessage" className="wox-sidebar-link">
              <CiViewList />
              <span>Client Messages</span>
            </NavLink>
          )}
          {logindata?.isClientCoordinator && (
            <NavLink to="/cordinatortoleader" className="wox-sidebar-link">
              <MdAssignmentAdd />
              <span>Assign Task</span>
            </NavLink>
          )}
          {logindata?.isClientCoordinator && (
            <NavLink to="/clientcoseeaccepttask" className="wox-sidebar-link">
              <GoVerified />
              <span>Completed Task</span>
            </NavLink>
          )}
          <NavLink to="/tasklist" className="wox-sidebar-link">
            <BiTask />
            <span>Task Lists</span>
          </NavLink>
        </aside>
        <div className="wox-notes-list">
          <h2>Welcome {logindata ? logindata.fname : "Guest"}!</h2>
          <div className="wox-search-bar">
            <input
              type="text"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
          <h2>Your Notes</h2>
          <div className="wox-notes-container">
            {filteredNotes.map((item) => (
              <div key={item._id} className="wox-note-card">
                <h3>{item.title}</h3>
                <p>{item.content}</p>
                <div className="wox-note-actions">
                  <div className="wox-tooltip">
                    <NavLink to={`/woxeditnote/${item._id}`}>
                      <FiEdit2 className="wox-edit-notes" />
                      <span className="wox-tooltiptext">Edit</span>
                    </NavLink>
                  </div>
                  <div className="wox-tooltip wox-usr-note-delete-button">
                    <button onClick={() => deleteNote(item._id)}>
                      <FiTrash2 />
                      <span className="wox-tooltiptext">Delete</span>
                    </button>
                  </div>
                  <div className="wox-tooltip">
                    <button
                      onClick={() => pinNote(item._id)}
                      style={{ color: item.isPinned ? "blue" : "black" }}
                    >
                      <MdPushPin />
                      <span className="wox-tooltiptext">
                        {item.isPinned ? "Unpin" : "Pin"}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
            <div className="wox-add-note">
              <NavLink to="/addnotes">
                <FiPlus />
              </NavLink>
              <span className="wox-tooltip-text">Add a note</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WoxDashboard;
