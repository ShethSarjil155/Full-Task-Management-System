// import React, { useEffect, useState } from "react";
// import "./LoginHistory.css"; // Import the CSS file
// import Sidebar from "./WoxSideBar"; // Ensure Sidebar component is correctly imported

// const LoginHistory = () => {
//   const [list, setList] = useState([]); // Original list from API
//   const [filteredData, setFilteredData] = useState([]); // Filtered list to display
//   const [searchTerm, setSearchTerm] = useState(""); // Search term

//   const getData = async () => {
//     try {
//       const res = await fetch("http://localhost:5000/api/login-history", {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//         },
//       });

//       const data = await res.json();
//       if (res.status === 422 || !data) {
//         console.log("Error fetching data");
//       } else {
//         setList(data);
//         setFilteredData(data); // Initialize filtered data
//       }
//     } catch (error) {
//       console.error("Error fetching login history:", error);
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

//       if (res.status === 200) {
//         setList([]);
//         setFilteredData([]);
//         console.log("All history data deleted");
//       } else {
//         console.log("Failed to delete history data");
//       }
//     } catch (error) {
//       console.error("Error deleting history data:", error);
//     }
//   };

//   // Filter list based on search term
//   const handleSearch = (event) => {
//     const value = event.target.value.toLowerCase();
//     setSearchTerm(value);

//     const filtered = list.filter((item) =>
//       item.userName.toLowerCase().includes(value)
//     );
//     setFilteredData(filtered);
//   };

//   useEffect(() => {
//     getData();
//   }, []);

//   return (
//     <>
//       <div className="login-history-container">
//         <Sidebar /> {/* Ensure Sidebar is correctly styled and functional */}
//         <div className="history-content">
//           <div className="history-header">
//             <h2>Login History</h2>
//             <input
//               type="text"
//               placeholder="Search by username..."
//               value={searchTerm}
//               onChange={handleSearch}
//               className="search-input"
//             />
//             <button onClick={handleDelete}>Delete All History</button>
//           </div>
//           <table>
//             <thead>
//               <tr>
//                 <th>Username</th>
//                 <th>Login Time</th>
//                 <th>Task</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredData.map((item, index) => (
//                 <tr key={index}>
//                   <td>{item.userName}</td>
//                   <td>
//                     {new Date(item.loginTime).toLocaleString()}
//                     {item.logoutTime && (
//                       <span>
//                         {" "}
//                         - {new Date(item.logoutTime).toLocaleString()}
//                       </span>
//                     )}
//                   </td>
//                   <td>{item.task}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//           {filteredData.length === 0 && (
//             <p className="no-results">No results found.</p>
//           )}
//         </div>
//       </div>
//     </>
//   );
// };

// export default LoginHistory;

import React, { useEffect, useState } from "react";
import jsPDF from "jspdf"; // Import jsPDF
import "jspdf-autotable"; // Import autotable plugin
import "./LoginHistory.css";
import Sidebar from "./WoxSideBar";

const LoginHistory = () => {
  const [list, setList] = useState([]); // Original list from API
  const [filteredData, setFilteredData] = useState([]); // Filtered list to display
  const [searchTerm, setSearchTerm] = useState(""); // Search term

  const getData = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/login-history", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();
      if (res.status === 422 || !data) {
        console.log("Error fetching data");
      } else {
        setList(data);
        setFilteredData(data); // Initialize filtered data
      }
    } catch (error) {
      console.error("Error fetching login history:", error);
    }
  };

  const handleDelete = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/delete-history", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.status === 200) {
        setList([]);
        setFilteredData([]);
        console.log("All history data deleted");
      } else {
        console.log("Failed to delete history data");
      }
    } catch (error) {
      console.error("Error deleting history data:", error);
    }
  };

  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);

    const filtered = list.filter((item) =>
      item.userName.toLowerCase().includes(value)
    );
    setFilteredData(filtered);
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Login History", 14, 20);

    // Add table with autoTable
    const tableData = filteredData.map((item) => [
      item.userName,
      new Date(item.loginTime).toLocaleString(),
      item.task,
    ]);

    doc.autoTable({
      head: [["Username", "Login Time", "Task"]],
      body: tableData,
      startY: 30,
    });

    doc.save("login-history.pdf"); // Save the file as login-history.pdf
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
            <input
              type="text"
              placeholder="Search by username..."
              value={searchTerm}
              onChange={handleSearch}
              className="search-input"
            />
            <button onClick={handleDelete}>Delete All History</button>
            <button onClick={downloadPDF} className="download-button-history">
              Download PDF
            </button>
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
              {filteredData.map((item, index) => (
                <tr key={index}>
                  <td>{item.userName}</td>
                  <td>
                    {new Date(item.loginTime).toLocaleString()}
                    {item.logoutTime && (
                      <span>
                        {" "}
                        - {new Date(item.logoutTime).toLocaleString()}
                      </span>
                    )}
                  </td>
                  <td>{item.task}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredData.length === 0 && (
            <p className="no-results">No results found.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default LoginHistory;
