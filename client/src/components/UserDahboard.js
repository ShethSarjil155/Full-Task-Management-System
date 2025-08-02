import React, { useContext, useEffect, useState } from "react";
import { FiEdit2, FiTrash2, FiPlus } from "react-icons/fi";
import { MdPushPin } from "react-icons/md";
import { IoMdLogIn } from "react-icons/io";
import { FaRegRegistered } from "react-icons/fa";
import { TbLogout2 } from "react-icons/tb";
import { BiMessageSquareDetail, BiTask } from "react-icons/bi";
import { BsCardList } from "react-icons/bs";
import { HiOutlineBell } from "react-icons/hi";
import "./userdash.css";
import { NavLink, useNavigate } from "react-router-dom";
import { LoginContext } from "./ContextProvider/Context";
import logo from "./Images/leafwaylogo .png";
import NotificationBadge from "./NotifyCount";
import { RiTeamFill } from "react-icons/ri";
import { MdAssignmentAdd } from "react-icons/md";
import { GoVerified } from "react-icons/go";
import { VscGitPullRequestNewChanges } from "react-icons/vsc";
import { BsSend } from "react-icons/bs";
import { FaTasks } from "react-icons/fa";
import { CiViewList } from "react-icons/ci";

const UserDashboard = () => {
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
        if (storedNote) {
          return { ...note, isPinned: storedNote.isPinned };
        } else {
          return { ...note, isPinned: false }; // Default to unpinned if not found in localStorage
        }
      });

      const sortedNotes = updatedList.sort((a, b) => {
        if (a.isPinned && !b.isPinned) {
          return -1; // a comes before b (pinned notes first)
        } else if (!a.isPinned && b.isPinned) {
          return 1; // b comes before a (unpinned notes after pinned)
        } else {
          return 0; // maintain order for notes with same pinned status
        }
      });

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

  const deleteNote = async (id) => {
    const userConfirmed = window.confirm(
      "Are you sure you want to delete this note?"
    );

    if (!userConfirmed) {
      return;
    }

    try {
      const token = localStorage.getItem("usersdatatoken");
      const res = await fetch(`http://localhost:5000/api/deletenote/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error("Failed to delete note");
      }

      await res.json();
      fetchNotes();
      navigate("/userdash");
    } catch (error) {
      console.error("Error deleting note:", error.message);
      alert("Failed to delete note.");
    }
  };

  const pinNote = async (id) => {
    try {
      const token = localStorage.getItem("usersdatatoken");
      const res = await fetch(`http://localhost:5000/api/pinnote/${id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error("Failed to pin note");
      }

      const updatedList = list.map((note) =>
        note._id === id ? { ...note, isPinned: !note.isPinned } : note
      );

      const sortedNotes = updatedList.sort((a, b) =>
        a.isPinned === b.isPinned ? 0 : a.isPinned ? -1 : 1
      );

      setList(sortedNotes);

      const updatedNote = updatedList.find((note) => note._id === id);
      if (updatedNote) {
        localStorage.setItem(
          `note_${id}`,
          JSON.stringify({ isPinned: updatedNote.isPinned })
        );
      } else {
        localStorage.removeItem(`note_${id}`);
      }
    } catch (error) {
      console.error("Error pinning note:", error.message);
      alert("Failed to pin note.");
    }
  };

  const logout = async () => {
    const token = localStorage.getItem("usersdatatoken");

    if (token) {
      try {
        const res = await fetch("http://localhost:5000/api/logout", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        });

        if (!res.ok) {
          const error = await res.json();
          throw new Error(error.message);
        }

        localStorage.removeItem("usersdatatoken");
        setLoginData(null);
        navigate("/login");
      } catch (error) {
        console.error("Logout error:", error.message);
      }
    } else {
      console.log("No token found");
    }
  };

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
    <div className="dashboard-container">
      <header className="header">
        <div className="logo-img-userside">
          <img src={logo} alt="Logo" />
        </div>
        <div className="auth-buttons">
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
      <div className="user-main-content">
        <aside className="usersidebar">
          <NavLink to="/addnotes" className="sidebar-link">
            <FiPlus />
            <span>Add Note</span>
          </NavLink>
          <NavLink to="/request" className="sidebar-link">
            <BiMessageSquareDetail />
            <span>Request Form</span>
          </NavLink>
          <NavLink to="/ownrequest" className="sidebar-link">
            <BsCardList />
            <span>Requests</span>
          </NavLink>
          <NavLink to="/notification" className="sidebar-link">
            <HiOutlineBell />
            <NotificationBadge />
            <span>Notification</span>
          </NavLink>
          <NavLink to="/viewmessage" className="sidebar-link">
            <BiMessageSquareDetail />
            <span>Messages</span>
          </NavLink>
          {logindata?.isTeamLeader && (
            <NavLink to="/team-members" className="sidebar-link">
              <RiTeamFill />
              <span>Team Members</span>
            </NavLink>
          )}
          {logindata?.isTeamLeader && (
            <NavLink to="/team-members-request" className="sidebar-link">
              <VscGitPullRequestNewChanges />
              <span>Team Requests</span>
            </NavLink>
          )}
          {logindata?.isTeamLeader && (
            <NavLink to="/team-leader-send-message" className="sidebar-link">
              <BsSend />
              <span>Send Message </span>
            </NavLink>
          )}
          {logindata?.isTeamLeader && (
            <NavLink to="/tltasklist" className="sidebar-link">
              <FaTasks />
              <span> Members Tasks</span>
            </NavLink>
          )}
          {logindata?.isTeamLeader && (
            <NavLink to="/viewclientmessage" className="sidebar-link">
              <CiViewList />
              <span>Client Messages</span>
            </NavLink>
          )}
          {/* {logindata?.isTeamLeader && (
            <NavLink to="/tltoteammates" className="sidebar-link">
              <RiTeamFill />
              <span>Assign to Team</span>
            </NavLink>
          )} */}

          {logindata?.isClientCoordinator && (
            <NavLink to="/cordinatortoleader" className="sidebar-link">
              <MdAssignmentAdd />
              <span>Assign Task</span>
            </NavLink>
          )}
          {logindata?.isClientCoordinator && (
            <NavLink to="/clientcoseeaccepttask" className="sidebar-link">
              <GoVerified />
              <span>Completed Task</span>
            </NavLink>
          )}

          <NavLink to="/tasklist" className="sidebar-link">
            <BiTask />
            <span>Task Lists</span>
          </NavLink>
        </aside>
        <div className="notes-list">
          <h2>Welcome {logindata ? logindata.fname : "Guest"}!</h2>
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
          <h2>Your Notes</h2>
          <div className="notes-container">
            {filteredNotes.map((item) => (
              <div key={item._id} className="note-card">
                <h3>{item.title}</h3>
                <p>{item.content}</p>
                <div className="note-actions">
                  <div className="tooltip ">
                    <NavLink to={`/editnote/${item._id}`}>
                      <FiEdit2 className="edit-notes" />
                      <span className="tooltiptext">Edit</span>
                    </NavLink>
                  </div>
                  <div className="tooltip usr-note-delete-button">
                    <button onClick={() => deleteNote(item._id)}>
                      <FiTrash2 />
                      <span className="tooltiptext">Delete</span>
                    </button>
                  </div>
                  <div className="tooltip">
                    <button
                      onClick={() => pinNote(item._id)}
                      style={{ color: item.isPinned ? "blue" : "black" }}
                    >
                      <MdPushPin />
                      <span className="tooltiptext">
                        {item.isPinned ? "Unpin" : "Pin"}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
            <div className="add-note">
              <NavLink to="/addnotes">
                <FiPlus />
              </NavLink>
              <span className="tooltip-text">Add a note</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
