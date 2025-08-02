import React, { useEffect, useState } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";

const AdminTaskAssignments = () => {
  const [tasks, setTasks] = useState([]);
  const [filters, setFilters] = useState({
    username: "",
    companyName: "",
    fromDate: "",
    toDate: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  // Fetch tasks from the database
  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      setError(null);
      try {
        const queryParams = new URLSearchParams(filters).toString();
        const response = await fetch(
          `http://localhost:5000/api/admin/task-assignments?${queryParams}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setTasks(data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
        setError("Failed to load tasks. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const generatePDF = () => {
    const doc = new jsPDF({
      orientation: "landscape", // Switch to landscape orientation
      unit: "mm", // Units for the page size
      format: [600, 300], // Custom width (350mm) and standard height for landscape (210mm)
    });

    // Title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("Task Assignments Report", 14, 10);

    // Table Columns and Rows
    const tableColumns = [
      "Company Name",
      "Task Name",
      "Preview",
      "Completed Previews",
      "Remaining Previews",
      "Team Leader",
      "Teammate Assigned To",
      "Assigned By",
      "Assigned At",
      "Start Time",
      "Finish Time",
      "Is Started?",
      "Is Finished?",
      "Status",
      "Response Status",
      "Response Time",
      "Reject Count",
      "Done By",
      "Done At",
      "Completion Logs",
    ];

    const tableRows = tasks.map((task) => [
      task.companyName || "N/A",
      task.taskName || "N/A",
      task.preview || "N/A",
      task.completedPreviews || "N/A",
      task.remainingPreviews || "N/A",
      task.teamLeaderName || "N/A",
      task.teammateAssignedToName || "N/A",
      task.assignedByName || "N/A",
      task.assignedAt ? new Date(task.assignedAt).toLocaleString() : "N/A",
      task.startTime ? new Date(task.startTime).toLocaleString() : "N/A",
      task.finishTime ? new Date(task.finishTime).toLocaleString() : "N/A",
      task.isStarted ? "Yes" : "No",
      task.isFinished ? "Yes" : "No",
      task.status || "N/A",
      task.responseStatus || "N/A",
      task.responseTime ? new Date(task.responseTime).toLocaleString() : "N/A",
      task.rejectCount || "N/A",
      task.doneByName || "N/A",
      task.doneAt ? new Date(task.doneAt).toLocaleString() : "N/A",
      task.completionLogs
        .map(
          (log) =>
            `User: ${log.userName}, Count: ${
              log.completedCount
            }, Time: ${new Date(log.timestamp).toLocaleString()}`
        )
        .join("\n") || "N/A",
    ]);

    // Customize autoTable settings for better layout and formatting
    const pageHeight = doc.internal.pageSize.height;
    const pageWidth = doc.internal.pageSize.width; // Custom width of 350mm
    const margin = 10; // Reduced margin for more space
    const tableHeight = pageHeight - 40; // Space for title and some padding
    const rowsPerPage = Math.floor(tableHeight / 10); // Approximate number of rows per page

    // Adjusting column widths for better fit on the page (in landscape)
    const columnWidths = [
      30, 35, 20, 25, 25, 35, 40, 35, 35, 25, 25, 20, 20, 20, 30, 30, 35, 25,
      30, 35,
    ];

    doc.autoTable({
      head: [tableColumns],
      body: tableRows,
      startY: 20,
      theme: "grid", // Grid style for table borders
      styles: {
        fontSize: 8, // Reduce font size for better readability
        cellPadding: 2, // Add padding to cells
        valign: "middle", // Vertically center content
        overflow: "linebreak", // Handle text overflow with line breaks
      },
      headStyles: {
        fillColor: [0, 51, 102], // Dark blue background for header
        textColor: [255, 255, 255], // White text color
        fontSize: 9,
      },
      bodyStyles: {
        fillColor: [255, 255, 255], // White background for body
        textColor: [0, 0, 0], // Black text color
        fontSize: 8,
      },
      margin: { top: margin, left: margin, right: margin }, // Reduced margins
      columnStyles: columnWidths.reduce((styles, width, index) => {
        styles[index] = { cellWidth: width };
        return styles;
      }, {}),
      pageBreak: "auto", // Automatically split pages if the table exceeds the page height
      afterPageContent: function (data) {
        if (data.cursor.y > pageHeight - 50) {
          // Ensure we handle page breaks manually if needed
          doc.addPage();
        }
      },
    });

    doc.save("task_assignments_report.pdf");
  };

  // Download Excel
  const downloadExcel = () => {
    const rows = tasks.map((task) => ({
      "Company Name": task.companyName || "N/A",
      "Task Name": task.taskName || "N/A",
      Preview: task.preview || "N/A",
      "Completed Previews": task.completedPreviews || "N/A",
      "Remaining Previews": task.remainingPreviews || "N/A",
      "Team Leader": task.teamLeaderName || "N/A",
      "Teammate Assigned To": task.teammateAssignedToName || "N/A",
      "Assigned By": task.assignedByName || "N/A",
      "Assigned At": task.assignedAt
        ? new Date(task.assignedAt).toLocaleString()
        : "N/A",
      "Start Time": task.startTime
        ? new Date(task.startTime).toLocaleString()
        : "N/A",
      "Finish Time": task.finishTime
        ? new Date(task.finishTime).toLocaleString()
        : "N/A",
      "Is Started?": task.isStarted ? "Yes" : "No",
      "Is Finished?": task.isFinished ? "Yes" : "No",
      Status: task.status || "N/A",
      "Response Status": task.responseStatus || "N/A",
      "Response Time": task.responseTime
        ? new Date(task.responseTime).toLocaleString()
        : "N/A",
      "Reject Count": task.rejectCount || "N/A",
      "Done By": task.doneByName || "N/A",
      "Done At": task.doneAt ? new Date(task.doneAt).toLocaleString() : "N/A",
      "Completion Logs":
        task.completionLogs
          .map(
            (log) =>
              `User: ${log.userName}, Count: ${
                log.completedCount
              }, Time: ${new Date(log.timestamp).toLocaleString()}`
          )
          .join("; ") || "N/A",
    }));

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Task Assignments");
    XLSX.writeFile(workbook, "task_assignments_report.xlsx");
  };

  // Download Word
  const downloadWord = () => {
    const content = tasks
      .map(
        (task) =>
          `Task Name: ${task.taskName}\nCompany Name: ${
            task.companyName
          }\nTeam Leader: ${task.teamLeaderName}\nAssigned By: ${
            task.assignedByName
          }\nStatus: ${task.status}\nCompletion Logs:\n${task.completionLogs
            .map(
              (log) =>
                `User: ${log.userName}, Count: ${
                  log.completedCount
                }, Time: ${new Date(log.timestamp).toLocaleString()}`
            )
            .join("\n")}\n\n`
      )
      .join("");
    const blob = new Blob([content], { type: "application/msword" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "task_assignments_report.doc";
    link.click();
  };

  // Download Notepad
  const downloadNotepad = () => {
    const content = tasks
      .map(
        (task) =>
          `Task Name: ${task.taskName}\nCompany Name: ${
            task.companyName
          }\nStatus: ${task.status}\nCompletion Logs:\n${task.completionLogs
            .map(
              (log) =>
                `User: ${log.userName}, Count: ${
                  log.completedCount
                }, Time: ${new Date(log.timestamp).toLocaleString()}`
            )
            .join("\n")}\n\n`
      )
      .join("");
    const blob = new Blob([content], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "task_assignments_report.txt";
    link.click();
  };

  const emailReport = () => {
    const subject = "Task Assignments Report";
    const body = "Please find attached the task assignments report.";
    const mailtoLink = `mailto:?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>Task Assignments</h1>
      {/* Filters */}
      <div className="filter-form">
        <h3>Filter Tasks</h3>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={filters.username}
          onChange={handleFilterChange}
        />
        <input
          type="text"
          name="companyName"
          placeholder="Company Name"
          value={filters.companyName}
          onChange={handleFilterChange}
        />
        <input
          type="date"
          name="fromDate"
          value={filters.fromDate}
          onChange={handleFilterChange}
        />
        <input
          type="date"
          name="toDate"
          value={filters.toDate}
          onChange={handleFilterChange}
        />
      </div>

      {/* Popup for download options */}
      {showPopup && (
        <div className="popup">
          <h3>Select Download Format</h3>
          <button
            onClick={() => {
              setShowPopup(false);
              generatePDF();
            }}
          >
            PDF
          </button>
          <button
            onClick={() => {
              setShowPopup(false);
              downloadExcel();
            }}
          >
            Excel
          </button>
          <button
            onClick={() => {
              setShowPopup(false);
              downloadWord();
            }}
          >
            Word
          </button>
          <button
            onClick={() => {
              setShowPopup(false);
              downloadNotepad();
            }}
          >
            Notepad
          </button>
        </div>
      )}

      <button onClick={() => setShowPopup(true)}>Download Report</button>
      <button onClick={emailReport}>Email Report</button>

      {/* Table */}
      <table>
        <thead>
          <tr>
            <th>Company Name</th>
            <th>Task Name</th>
            <th>Preview</th>
            <th>Completed Previews</th>
            <th>Remaining Previews</th>
            <th>Team Leader</th>
            <th>Teammate Assigned To</th>
            <th>Assigned By</th>
            <th>Assigned At</th>
            <th>Start Time</th>
            <th>Finish Time</th>
            <th>Is Started?</th>
            <th>Is Finished?</th>
            <th>Status</th>
            <th>Response Status</th>
            <th>Response Time</th>
            <th>Reject Count</th>
            <th>Done By</th>
            <th>Done At</th>
            <th>Completion Logs</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.id}>
              <td>{task.companyName || "N/A"}</td>
              <td>{task.taskName || "N/A"}</td>
              <td>{task.preview || "N/A"}</td>
              <td>{task.completedPreviews || "N/A"}</td>
              <td>{task.remainingPreviews || "N/A"}</td>
              <td>{task.teamLeaderName || "N/A"}</td>
              <td>{task.teammateAssignedToName || "N/A"}</td>
              <td>{task.assignedByName || "N/A"}</td>
              <td>
                {task.assignedAt
                  ? new Date(task.assignedAt).toLocaleString()
                  : "N/A"}
              </td>
              <td>
                {task.startTime
                  ? new Date(task.startTime).toLocaleString()
                  : "N/A"}
              </td>
              <td>
                {task.finishTime
                  ? new Date(task.finishTime).toLocaleString()
                  : "N/A"}
              </td>
              <td>{task.isStarted ? "Yes" : "No"}</td>
              <td>{task.isFinished ? "Yes" : "No"}</td>
              <td>{task.status || "N/A"}</td>
              <td>{task.responseStatus || "N/A"}</td>
              <td>
                {task.responseTime
                  ? new Date(task.responseTime).toLocaleString()
                  : "N/A"}
              </td>
              <td>{task.rejectCount || "N/A"}</td>
              <td>{task.doneByName || "N/A"}</td>
              <td>
                {task.doneAt ? new Date(task.doneAt).toLocaleString() : "N/A"}
              </td>
              <td>
                <ul>
                  {task.completionLogs.map((log, index) => (
                    <li key={index}>
                      User: {log.userName}, Count: {log.completedCount}, Time:{" "}
                      {new Date(log.timestamp).toLocaleString()}
                    </li>
                  ))}
                </ul>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminTaskAssignments;
