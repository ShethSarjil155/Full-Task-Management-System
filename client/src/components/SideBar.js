import React from "react";
import Logo from "../components/Images/leafwaylogo .png";
import {
  FaStickyNote,
  FaUsers,
  FaHistory,
  FaBan,
  FaSignOutAlt,
  FaCheckCircle,
} from "react-icons/fa";
import { IoMdSend } from "react-icons/io";
import { FaTasks } from "react-icons/fa";
import { FaCrown } from "react-icons/fa";
import "./Sidebar.css";
import { useNavigate } from "react-router-dom";
import { MdCreateNewFolder } from "react-icons/md";
import { SiCmake } from "react-icons/si";
import { MdOutlineManageHistory } from "react-icons/md";

function Sidebar() {
  const navigate = useNavigate();

  const logout = () => {
    if (window.confirm("Do you want to logout")) {
      navigate("/login");
    }
  };

  const logouthistory = () => {
    navigate("/loginhistory");
  };

  const allUsers = () => {
    navigate("/admin");
  };

  const allusernotes = () => {
    navigate("/admin/all-user-notes");
  };

  const userrequests = () => {
    navigate("/userrequestsgraphs");
  };

  const SendMessage = () => {
    navigate("/adminsendmessage");
  };

  const CreateCompany = () => {
    navigate("/createcompany");
  };

  const MakesClientCordinator = () => {
    navigate("/adminmakesclientcordinator");
  };

  const alltasks = () => {
    navigate("/adminseetasks");
  };
  const teamleader = () => {
    navigate("/adminmakeleader");
  };
  const sendmessagetoleader = () => {
    navigate("/adminsendmessagetoleader");
  };
  const alltaskshistory = () => {
    navigate("/admin/task-assignments");
  };
  return (
    <div className="sidebar">
      <div className="logo-img">
        <img src={Logo} alt="logo" />
        <p className="admin-panel-text">Admin Panel</p> {/* New text element */}
      </div>
      <div className="sidebar-item" onClick={allUsers}>
        <FaUsers />
        <span>All Users</span>
      </div>
      <div className="sidebar-item" onClick={allusernotes}>
        <FaStickyNote />
        <span>All Notes</span>
      </div>
      <div className="sidebar-item" onClick={logouthistory}>
        <FaHistory />
        <span>Login History</span>
      </div>
      <div className="sidebar-item" onClick={sendmessagetoleader}>
        <IoMdSend />
        <span>SendMessageToLeader</span>
      </div>
      <div className="sidebar-item" onClick={userrequests}>
        <FaCheckCircle />
        <span>Users Request</span>
      </div>
      <div className="sidebar-item" onClick={SendMessage}>
        <IoMdSend />
        <span>SendMessage</span>
      </div>
      <div className="sidebar-item" onClick={CreateCompany}>
        <MdCreateNewFolder />
        <span>Create Company</span>
      </div>
      <div className="sidebar-item" onClick={MakesClientCordinator}>
        <SiCmake />
        <span>Make Client Cordinator</span>
      </div>

      <div className="sidebar-item" onClick={alltaskshistory}>
        <MdOutlineManageHistory />
        <span>All Tasks History</span>
      </div>
      <div className="sidebar-item" onClick={teamleader}>
        <FaCrown />
        <span>Leaders</span>
      </div>
      <div className="sidebar-item" onClick={logout}>
        <FaSignOutAlt />
        <span>Logout</span>
      </div>
    </div>
  );
}

export default Sidebar;
