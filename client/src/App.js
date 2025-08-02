import { Route, Routes, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { LoginContext } from "./components/ContextProvider/Context";
import Login from "./components/Login";
import Blocked from "./components/Blocked";
import Register from "./components/Register";
import Edit from "./components/Edit";
import UserDashboard from "./components/UserDahboard";
import NoteForm from "./components/AddNote";
import EditNoteForm from "./components/EditNoteForm";
import Admin from "./components/Admin";
import LoginHistory from "./components/LoginHistory";
import UserTable from "./components/UserTable";
import AdminAllUserNotes from "./components/AllUserNotes";
import RequestForm from "./components/RequestForm";
import UserSeeRequests from "./components/UserSeeRequests";
import AdminUserRequests from "./components/AdminUserRequest";
import SendMessageForm from "./components/SendMessageForm";
import UserseeMessages from "./components/UserseeMessages";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import AdminTaskList from "./components/AdminTaskList";
import GraphPage from "./components/GraphPage";
import AdminAssignTeamLeader from "./components/AssignTeamLeader";
import Notifications from "./components/Notifications";
import ClientDashboard from "./components/ClientDahboard";
import ClientUsersList from "./components/ClientUsersList";
import ClientUsersLoginHistory from "./components/ClientUsersHistory";
import ClientSendMessageForm from "./components/ClientSendMessage";
import TeamMembers from "./components/TeamMember";
import TeamLeaderRequests from "./components/TeamLeaderSeeRequest";
import AdminToLeader from "./components/AdminToTeamLeader";
import TeamLeaderSendMessageForm from "./components/TeamLeaderSendMessageForm";
import TeamLeaderTaskList from "./components/TeamLeaderTaskList";
import CreateCompany from "./components/CreateCompany";
import AdminAssignClientCoordinator from "./components/AdminAssignClientCoordinator";
import ClientCoordinatorAssignTask from "./components/ClientCoordinatorAssignTask";
import ViewClientMessages from "./components/ViewClientMeassages";
import TLtoTeam from "./components/TeamLeadertoTeammates";
import Clientseetasks from "./components/ClientCordinatorseeacceptedtask";
import AdminTaskAssignments from "./components/AdminTaskAssignments";
import WoxDashboard from "./components/WoxDashBoard";
import WoxTeamLeaderSendMessage from "./components/WoxTeamLeaderSendMessageForm";
import WoxSendRequest from "./components/WoxUserRequestForm";
import WoxSeeRequests from "./components/WoxUserSeeRequests";
import WoxAdmin from "./components/WoxAdmin";
import WoxUserTable from "./components/WoxUserTable";
import WoxAllUserNotes from "./components/WoxAllUserNotes";
import WoxLoginHistory from "./components/WoxUserLoginHistory";
import WoxSendMessageForm from "./components/WoxAdminSendMessageForm";
import WoxSendMessageToLeader from "./components/WoxSendToLeader";
import WoxRequestGraph from "./components/WoxUsersRequestsGraph";
import WoxUsersRequests from "./components/WoxAdminSeeRequsts";
import WoxAdminCompanyCreate from "./components/WoxAdminCreateCompany";
import WoxAssignCc from "./components/WoxAssignClientCoordinator";
import WoxAssignTL from "./components/Woxassignteamleader";
import WoxAddNoteForm from "./components/WoxAddNote";
import WoxEditNoteForm from "./components/WoxEditNoteForm";

const App = () => {
  const { logindata, setLoginData } = useContext(LoginContext);
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const DashboardValid = async () => {
    const token = localStorage.getItem("usersdatatoken");

    if (!token) {
      console.log("No token found in localStorage");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/validuser", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }

      const data = await res.json();

      if (!data.validUserOne) {
        console.log("User not valid or authorized");
        localStorage.removeItem("usersdatatoken");
      } else {
        setLoginData(data.validUserOne);
        setIsLoggedIn(true);
      }
    } catch (error) {
      console.error("Error fetching valid user:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    DashboardValid();
  }, []);

  return (
    <div>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/editdata/:id" element={<Edit />} />
        <Route path="/userdash" element={<UserDashboard />} />
        <Route path="/addnotes" element={<NoteForm />} />
        <Route path="/editnote/:id" element={<EditNoteForm />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/loginhistory" element={<LoginHistory />} />
        <Route path="/blocked" element={<Blocked />} />
        <Route path="/allusers" element={<UserTable />} />
        <Route path="/admin/all-user-notes" element={<AdminAllUserNotes />} />
        <Route path="/request" element={<RequestForm />} />
        <Route path="/ownrequest" element={<UserSeeRequests />} />
        <Route path="/adminuserrequest" element={<AdminUserRequests />} />
        <Route path="/adminsendmessage" element={<SendMessageForm />} />
        <Route
          path="/viewmessage"
          element={<UserseeMessages userId={logindata?._id} />} // Adjust based on your user object structure
        />
        <Route path="/taskform" element={<TaskForm />} />
        <Route path="/tasklist" element={<TaskList />} />
        <Route path="/adminseetasks" element={<AdminTaskList />} />
        <Route path="/userrequestsgraphs" element={<GraphPage />} />
        <Route path="/adminmakeleader" element={<AdminAssignTeamLeader />} />
        <Route path="/notification" element={<Notifications />} />
        <Route path="/client" element={<ClientDashboard />} />
        <Route path="/clientusers" element={<ClientUsersList />} />
        <Route
          path="/clientusershistory"
          element={<ClientUsersLoginHistory />}
        />
        <Route path="/clientsendmessage" element={<ClientSendMessageForm />} />
        <Route path="/team-members" element={<TeamMembers />} />
        <Route path="/team-members-request" element={<TeamLeaderRequests />} />
        <Route path="/adminsendmessagetoleader" element={<AdminToLeader />} />
        <Route
          path="/team-leader-send-message"
          element={<TeamLeaderSendMessageForm />}
        />
        <Route path="/tltasklist" element={<TeamLeaderTaskList />} />
        <Route path="/createcompany" element={<CreateCompany />} />
        <Route
          path="/adminmakesclientcordinator"
          element={<AdminAssignClientCoordinator />}
        />
        <Route
          path="/cordinatortoleader"
          element={<ClientCoordinatorAssignTask />}
        />
        <Route path="/viewclientmessage" element={<ViewClientMessages />} />
        <Route path="/tltoteammates/:taskId" element={<TLtoTeam />} />
        <Route path="/clientcoseeaccepttask" element={<Clientseetasks />} />
        <Route
          path="/admin/task-assignments"
          element={<AdminTaskAssignments />}
        />
        <Route path="/wox-dashboard" element={<WoxDashboard />} />
        <Route
          path="/wox-team-leader-send-message"
          element={<WoxTeamLeaderSendMessage />}
        />
        <Route path="/wox-user-requestform" element={<WoxSendRequest />} />
        <Route path="/wox-user-requests" element={<WoxSeeRequests />} />
        <Route path="/woxdashboard" element={<WoxAdmin />} />
        <Route path="/woxallusers" element={<WoxUserTable />} />
        <Route path="/woxadmin/all-user-notes" element={<WoxAllUserNotes />} />
        <Route path="/woxloginhistory" element={<WoxLoginHistory />} />
        <Route path="/woxsendmessageform" element={<WoxSendMessageForm />} />
        <Route
          path="/woxsendmessagetoleader"
          element={<WoxSendMessageToLeader />}
        />
        <Route path="/woxrequestsgraph" element={<WoxRequestGraph />} />
        <Route path="/woxusersrequets" element={<WoxUsersRequests />} />
        <Route path="/woxadmincreate" element={<WoxAdminCompanyCreate />} />
        <Route path="/woxassigncc" element={<WoxAssignCc />} />
        <Route path="/woxadminmakeleader" element={<WoxAssignTL />} />
        <Route path="/woxaddnote" element={<WoxAddNoteForm />} />
        <Route path="/woxeditnote/:id" element={<WoxEditNoteForm />} />
      </Routes>
    </div>
  );
};

export default App;
