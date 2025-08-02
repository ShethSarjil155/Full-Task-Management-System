// import React, { useEffect, useState } from "react";
// import "./clientuserloginhistory.css"; // Import the updated CSS file
// import ClientSidebar from "./ClientDahboard"; // Ensure the correct import of ClientSidebar

// const LoginHistory = () => {
//   const [list, setList] = useState([]);

//   const getData = async () => {
//     try {
//       const res = await fetch("http://localhost:5000/api/login-history", {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//         },
//       });

//       if (!res.ok) {
//         throw new Error("Failed to fetch login history");
//       }

//       const data = await res.json();
//       setList(data);
//     } catch (error) {
//       console.error(error.message);
//     }
//   };

//   const handleDelete = async () => {
//     try {
//       const res = await fetch("http://localhost:5000/api/delete-history", {
//         method: "DELETE",
//         headers: {
//           "Content-Type": "application/json",
//         },
//       });

//       if (!res.ok) {
//         throw new Error("Failed to delete history data");
//       }

//       setList([]);
//       console.log("All history data deleted");
//     } catch (error) {
//       console.error(error.message);
//     }
//   };

//   useEffect(() => {
//     getData();
//   }, []);

//   return (
//     <div className="login-history-page">
//       <ClientSidebar />
//       <main className="login-history-content">
//         <header className="login-history-header">
//           <h2>Login History</h2>
//           <button className="delete-button" onClick={handleDelete}>
//             Delete All History
//           </button>
//         </header>
//         <div className="login-history-table-container">
//           <table className="login-history-table">
//             <thead>
//               <tr>
//                 <th>Username</th>
//                 <th>Login Time</th>
//                 <th>Logout Time</th>
//                 <th>Task</th>
//               </tr>
//             </thead>
//             <tbody>
//               {list.map((item, index) => (
//                 <tr key={index}>
//                   <td>{item.userName}</td>
//                   <td>{new Date(item.loginTime).toLocaleString()}</td>
//                   <td>
//                     {item.logoutTime
//                       ? new Date(item.logoutTime).toLocaleString()
//                       : "N/A"}
//                   </td>
//                   <td>{item.task}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </main>
//     </div>
//   );
// };

// export default LoginHistory;

import React, { useEffect, useState } from "react";
import "./clientuserloginhistory.css"; // Import the CSS file
import Sidebar from "./ClientDahboard"; // Ensure Sidebar component is correctly imported

const LoginHistory = () => {
  const [list, setList] = useState([]);

  const getData = async () => {
    const res = await fetch("http://localhost:5000/api/login-history", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();
    if (res.status === 422 || !data) {
      console.log("error");
    } else {
      setList(data);
      console.log(data);
    }
  };

  const handleDelete = async () => {
    const res = await fetch("http://localhost:5000/api/delete-history", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (res.status === 200) {
      setList([]);
      console.log("All history data deleted");
    } else {
      console.log("Failed to delete history data");
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <div className="login-history-container">
        <Sidebar />
        <div className="history-content">
          <div className="history-header">
            <h2>Login History</h2>
            <button onClick={handleDelete}>Delete All History</button>
          </div>
          <table>
            <thead>
              <tr>
                <th>Username</th>
                <th>Login Time</th>
                <th>Task</th>
              </tr>
            </thead>
            <tbody>
              {list.map((item, index) => (
                <tr key={index}>
                  <td>{item.userName}</td>
                  <td>
                    {new Date(item.loginTime).toLocaleString()}
                    {item.logoutTime &&
                      new Date(item.logoutTime).toLocaleString()}
                  </td>
                  <td>{item.task}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default LoginHistory;
