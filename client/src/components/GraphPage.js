import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
import { Link } from "react-router-dom";
import Sidebar from "./SideBar";
import "./GraphPage.css";

// Register the necessary components
Chart.register(ArcElement, Tooltip, Legend);

const GraphPage = () => {
  const [stats, setStats] = useState({
    total: 0,
    solved: 0,
    rejected: 0,
    pending: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/all-requests", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch requests");
        }

        const data = await response.json();

        // Calculate stats
        const total = data.length;
        const solved = data.filter((req) => req.status === "solved").length;
        const rejected = data.filter((req) => req.status === "rejected").length;
        const pending = data.filter((req) => req.status === "pending").length;

        setStats({ total, solved, rejected, pending });
      } catch (error) {
        console.error("Error fetching request stats:", error.message);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="graph-page-container">
      <div className="sidebar">
        <Sidebar />
      </div>
      <div className="graph-content">
        <h2 className="graph-heading">User Requests Overview</h2>

        <div className="chart-container">
          <Pie
            data={{
              labels: ["Solved", "Rejected", "Pending"],
              datasets: [
                {
                  label: "Request Status",
                  data: [stats.solved, stats.rejected, stats.pending],
                  backgroundColor: ["#2ecc71", "#e74c3c", "#f1c40f"],
                  borderColor: "#34495e",
                  borderWidth: 1,
                },
              ],
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: "bottom",
                  labels: {
                    boxWidth: 20,
                    color: "#ecf0f1",
                  },
                },
                tooltip: {
                  callbacks: {
                    label: (tooltipItem) => {
                      const label = tooltipItem.label || "";
                      const value = tooltipItem.raw || 0;
                      const total = stats.total;
                      const percentage = ((value / total) * 100).toFixed(2);
                      return `${label}: ${value} (${percentage}%)`;
                    },
                  },
                },
              },
              animation: {
                animateScale: true,
                animateRotate: true,
              },
            }}
          />
        </div>
        <div className="stats-summary">
          <p>Total Requests: {stats.total}</p>
          <p>Solved: {stats.solved}</p>
          <p>Rejected: {stats.rejected}</p>
          <p>Pending: {stats.pending}</p>
        </div>
        <Link to="/adminuserrequest">
          <button className="view-requests-button">View All Requests</button>
        </Link>
      </div>
    </div>
  );
};

export default GraphPage;
