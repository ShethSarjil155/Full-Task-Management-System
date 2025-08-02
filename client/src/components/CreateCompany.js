import React, { useState, useEffect } from "react";
import "./CreateCompany.css";
import Sidebar from "./SideBar";

const CreateCompany = () => {
  const [companyName, setCompanyName] = useState("");
  const [companies, setCompanies] = useState([]);
  const [error, setError] = useState("");

  // Fetch all companies when the component mounts
  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/companies");
      const data = await response.json();
      if (data.success) {
        setCompanies(data.companies);
      }
    } catch (error) {
      console.error("Error fetching companies:", error);
    }
  };

  const handleCreateCompany = async (e) => {
    e.preventDefault();

    if (companyName === "") {
      setError("Company name is required");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/create-company", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ companyName }),
      });

      const data = await response.json();
      if (data.success) {
        setCompanies([...companies, data.company]); // Add the new company to the list
        setCompanyName(""); // Reset the input field
      } else {
        setError("Error creating company");
      }
    } catch (error) {
      console.error("Error creating company:", error);
    }
  };

  const handleDeleteCompany = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/delete-company/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();
      if (data.success) {
        // Remove the company from the list
        setCompanies(companies.filter((company) => company._id !== id));
      } else {
        setError("Error deleting company");
      }
    } catch (error) {
      console.error("Error deleting company:", error);
    }
  };

  return (
    <>
      <div className="admin-dashboard">
        <Sidebar />
      </div>
      <div className="main-content">
        <h2>Create Company</h2>
        <form onSubmit={handleCreateCompany}>
          <div className="form-input">
            <input
              type="text"
              placeholder="Enter company name"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
            />
          </div>
          <button type="submit">Create</button>
          {error && <p className="error">{error}</p>}
        </form>

        <h3>Companies</h3>
        <ul>
          {companies.map((company) => (
            <li key={company._id}>
              {company.companyName}
              <button onClick={() => handleDeleteCompany(company._id)}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default CreateCompany;
