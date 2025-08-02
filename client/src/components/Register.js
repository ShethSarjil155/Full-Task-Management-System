import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import "./reg.css"; // Make sure to include your CSS file
const Register = () => {
  const [fname, setFname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cpassword, setCpassword] = useState("");
  const [team, setTeam] = useState(""); // New state for team selection
  const [designation, setDesignation] = useState(""); // New state for designation selection
  const [passShow, setPassShow] = useState(false);
  const [cpassShow, setCPassShow] = useState(false);
  const [company, setCompany] = useState("");

  const [fnameError, setFnameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [cPasswordError, setCpasswordError] = useState("");
  const [teamError, setTeamError] = useState(""); // New state for team error
  const [designationError, setDesignationError] = useState(""); // New state for designation error
  const [companyError, setCompanyError] = useState("");
  const [selectedIndex, setSelectedIndex] = useState("");
  const navigate = useNavigate();

  const RegisterHandler = async (e) => {
    e.preventDefault();

    let submit = true;

    if (selectedIndex === "") {
      // Validate form inputs
      if (fname === "") {
        setFnameError("Please Enter Full Name");
        submit = false;
      } else {
        setFnameError("");
      }

      if (email === "") {
        setEmailError("Please Enter Email address");
        submit = false;
      } else if (!email.includes("@")) {
        setEmailError("Please Enter Valid Email address");
        submit = false;
      } else {
        setEmailError("");
      }

      if (password === "") {
        setPasswordError("Please Enter Password");
        submit = false;
      } else if (password.length < 6) {
        setPasswordError("Please Enter minimum 6 Character");
        submit = false;
      } else {
        setPasswordError("");
      }

      if (cpassword === "") {
        setCpasswordError("Please Enter Confirm Password");
        submit = false;
      } else if (cpassword.length < 6) {
        setCpasswordError("Please Enter minimum 6 Character");
        submit = false;
      } else if (password !== cpassword) {
        setCpasswordError("Password and Confirm Password not match");
        submit = false;
      } else {
        setCpasswordError("");
      }

      if (team === "") {
        setTeamError("Please select a team");
        submit = false;
      } else {
        setTeamError("");
      }

      if (designation === "") {
        setDesignationError("Please select a designation");
        submit = false;
      } else {
        setDesignationError("");
      }

      if (company === "") {
        setCompanyError("Please select a company");
        submit = false;
      } else {
        setCompanyError("");
      }
    }

    try {
      const response = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fname,
          email,
          password,
          cpassword,
          team, // Include team in request body
          designation, // Include designation in request body
          company,
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      if (responseData.status === 201) {
        alert("User registration successful");
        setFname("");
        setEmail("");
        setPassword("");
        setCpassword("");
        setTeam(""); // Reset team selection
        setDesignation(""); // Reset designation selection
        setCompany("");
        navigate("/login");
      } else {
        alert("Failed to register user: " + responseData.error);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while registering the user.");
    }
  };

  const passwordShowHideHandler = () => {
    setPassShow(!passShow);
  };

  const cPasswordShowHideHandler = () => {
    setCPassShow(!cpassShow);
  };

  return (
    <div className="reg-main">
      <div className="container">
        <h1>Leaf Note</h1>
        <p>Your thoughts, beautifully organized.</p>
        <form onSubmit={RegisterHandler}>
          <div className="form_row">
            <div className="form_input">
              <label htmlFor="fname">Name</label>
              <input
                type="text"
                onChange={(e) => setFname(e.target.value)}
                value={fname}
                name="fname"
                id="fname"
                placeholder="Enter Your Name"
              />
              <div style={{ color: "red" }}>{fnameError}</div>
            </div>
            <div className="form_input">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                name="email"
                id="email"
                placeholder="Enter Your Email Address"
              />
              <div style={{ color: "red" }}>{emailError}</div>
            </div>
          </div>
          <div className="form_row">
            <div className="form_input">
              <label htmlFor="password">Password</label>
              <div className="two">
                <input
                  type={passShow ? "text" : "password"}
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  name="password"
                  id="password"
                  placeholder="Enter Your password"
                />
                <div className="showpass" onClick={passwordShowHideHandler}>
                  {passShow ? <VisibilityOffIcon /> : <VisibilityIcon />}
                </div>
              </div>
              <div style={{ color: "red" }}>{passwordError}</div>
            </div>
            <div className="form_input">
              <label htmlFor="cpassword">Confirm Password</label>
              <div className="two">
                <input
                  type={cpassShow ? "text" : "password"}
                  onChange={(e) => setCpassword(e.target.value)}
                  value={cpassword}
                  name="cpassword"
                  id="cpassword"
                  placeholder="Confirm password"
                />
                <div className="showpass" onClick={cPasswordShowHideHandler}>
                  {cpassShow ? <VisibilityOffIcon /> : <VisibilityIcon />}
                </div>
              </div>
              <div style={{ color: "red" }}>{cPasswordError}</div>
            </div>
          </div>
          <div className="form_row">
            <div className="form_input">
              <label htmlFor="team">Team</label>
              <select
                name="team"
                id="team"
                value={team}
                onChange={(e) => setTeam(e.target.value)}
              >
                <option value="">Select Team</option>
                <option value="VFX">VFX</option>
                <option value="Design">Design</option>
                <option value="UI/UX">UI/UX</option>
                <option value="PhotoShop">PhotoShop</option>
                <option value="Developing">Developing</option>
                <option value="Social Media">Social Media</option>
                <option value="Digital Marketing">Digital Marketing</option>
              </select>
              <div style={{ color: "red" }}>{teamError}</div>
            </div>
            <div className="form_input">
              <label htmlFor="designation">Designation</label>
              <select
                name="designation"
                id="designation"
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
              >
                <option value="">Select Designation</option>
                <option value="TL">TL</option>
                <option value="Client Coordinator">Client Coordinator</option>
                <option value="Designer">Designer</option>
                <option value="Developer">Developer</option>
                <option value="Photoshop Artist">Photoshop Artist</option>
                <option value="VFX Artist">VFX Artist</option>
                <option value="Content Writer">Content Writer</option>
                <option value="UI/UX">UI/UX</option>
                <option value="Manager Executive">Manager Executive</option>
              </select>
              <div style={{ color: "red" }}>{designationError}</div>
            </div>

            <div className="form_input">
              <label htmlFor="company">Company</label>
              <select
                name="company"
                id="company"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
              >
                <option value="">Select Company</option>
                <option value="Wox">Wox</option>
                <option value="Leafway">Leafway</option>
              </select>
              <div style={{ color: "red" }}>{companyError}</div>
            </div>
          </div>
          <button className="btn" type="submit">
            Create My Account
          </button>
          <p>
            Already have an account? <Link to="/login">Login instead</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
