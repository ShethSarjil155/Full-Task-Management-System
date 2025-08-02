import React from "react";
import Sidebar from "./WoxSideBar";
import UserTable from "./WoxUserTable";
import "./Admin.css";

function App() {
  return (
    <div className="App">
      <Sidebar />
      <div className="admin-main-content">
        <h1>All Users</h1>
        <UserTable />
      </div>
    </div>
  );
}

export default App;
