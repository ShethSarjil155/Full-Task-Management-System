import React from "react";
import Logo from "../components/Images/woxlogo.png";
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
import "./WoxSidebar.css";
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
    navigate("/woxloginhistory");
  };

  const allUsers = () => {
    navigate("/woxdashboard");
  };

  const allusernotes = () => {
    navigate("/woxadmin/all-user-notes");
  };

  const userrequests = () => {
    navigate("/woxrequestsgraph");
  };

  const SendMessage = () => {
    navigate("/woxsendmessageform");
  };

  const CreateCompany = () => {
    navigate("/woxadmincreate");
  };

  const MakesClientCordinator = () => {
    navigate("/woxassigncc");
  };

  const alltasks = () => {
    navigate("/adminseetasks");
  };
  const teamleader = () => {
    navigate("/woxadminmakeleader");
  };
  const sendmessagetoleader = () => {
    navigate("/woxsendmessagetoleader");
  };
  const alltaskshistory = () => {
    navigate("/admin/task-assignments");
  };
  return (
    <div className="wox-sidebar">
      <div className="wox-logo-img">
        <img src={Logo} alt="logo" />
        <p className="wox-admin-panel-text">Admin Panel</p>
      </div>
      <div className="wox-sidebar-item" onClick={allUsers}>
        <FaUsers />
        <span>All Users</span>
      </div>
      <div className="wox-sidebar-item" onClick={allusernotes}>
        <FaStickyNote />
        <span>All Notes</span>
      </div>
      <div className="wox-sidebar-item" onClick={logouthistory}>
        <FaHistory />
        <span>Login History</span>
      </div>
      <div className="wox-sidebar-item" onClick={sendmessagetoleader}>
        <IoMdSend />
        <span>SendMessageToLeader</span>
      </div>
      <div className="wox-sidebar-item" onClick={userrequests}>
        <FaCheckCircle />
        <span>Users Request</span>
      </div>
      <div className="wox-sidebar-item" onClick={SendMessage}>
        <IoMdSend />
        <span>SendMessage</span>
      </div>
      <div className="wox-sidebar-item" onClick={CreateCompany}>
        <MdCreateNewFolder />
        <span>Create Company</span>
      </div>
      <div className="wox-sidebar-item" onClick={MakesClientCordinator}>
        <SiCmake />
        <span>Make Client Cordinator</span>
      </div>

      <div className="wox-sidebar-item" onClick={alltaskshistory}>
        <MdOutlineManageHistory />
        <span>All Tasks History</span>
      </div>
      <div className="wox-sidebar-item" onClick={teamleader}>
        <FaCrown />
        <span>Leaders</span>
      </div>
      <div className="wox-sidebar-item" onClick={logout}>
        <FaSignOutAlt />
        <span>Logout</span>
      </div>
    </div>
  );
}

export default Sidebar;
