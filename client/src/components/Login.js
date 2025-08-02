import React, { useContext, useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { LoginContext } from "./ContextProvider/Context";
import "./style.css";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginEmailError, setLoginEmailError] = useState("");
  const [loginPassError, setLoginPassError] = useState("");
  const [passShow, setPassShow] = useState(false);
  const { setLoginData } = useContext(LoginContext);

  const passwordShowHideHandler = () => {
    setPassShow((prev) => !prev);
  };

  // const loginHandler = async (e) => {
  //   e.preventDefault();
  //   let submit = true;

  //   if (email === "") {
  //     submit = false;
  //     setLoginEmailError("Please Enter Email");
  //   } else {
  //     setLoginEmailError("");
  //   }

  //   if (password === "") {
  //     submit = false;
  //     setLoginPassError("Please Enter Password");
  //   } else {
  //     setLoginPassError("");
  //   }

  //   if (submit) {
  //     try {
  //       const login_api = await fetch("http://localhost:5000/api/login", {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({ email, password }),
  //       });

  //       const res = await login_api.json();
  //       if (res.status === 202) {
  //         const role = res.result.role;
  //         localStorage.setItem("usersdatatoken", res.result.token);
  //         setLoginData(res.result.user);

  //         if (role === "admin") {
  //           alert("Admin Login Successful!");
  //           navigate("/admin");
  //         } else {
  //           alert("Login Successful!");
  //           navigate("/userdash");
  //         }

  //         setEmail("");
  //         setPassword("");
  //       } else if (
  //         login_api.status === 403 &&
  //         res.error === "User is blocked"
  //       ) {
  //         alert("You are  blocked.");
  //         navigate("/Blocked");
  //       } else {
  //         alert("Invalid details");
  //       }
  //     } catch (error) {
  //       console.error("Login error:", error);
  //       alert("Failed to login. Please try again.");
  //     }
  //   }
  // };

  const loginHandler = async (e) => {
    e.preventDefault();
    let submit = true;

    if (email === "") {
      submit = false;
      setLoginEmailError("Please Enter Email");
    } else {
      setLoginEmailError("");
    }

    if (password === "") {
      submit = false;
      setLoginPassError("Please Enter Password");
    } else {
      setLoginPassError("");
    }

    if (submit) {
      try {
        const login_api = await fetch("http://localhost:5000/api/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        });

        const res = await login_api.json();
        if (res.status === 202) {
          const role = res.result.role;
          const company = res.result.company; // Access the company from the response
          localStorage.setItem("usersdatatoken", res.result.token);
          setLoginData(res.result.user);

          if (role === "admin") {
            alert("Admin Login Successful!");
            navigate("/admin");
          } else if (role === "admin2") {
            alert("Admin Login Successful!");
            navigate("/woxdashboard");
          } else if (company === "Wox") {
            alert("Login Successful!");
            navigate("/wox-dashboard");
          } else if (company === "Leafway") {
            alert("Login Successful!");
            navigate("/userdash");
          }

          setEmail("");
          setPassword("");
        } else if (
          login_api.status === 403 &&
          res.error === "User is blocked"
        ) {
          alert("You are blocked.");
          navigate("/Blocked");
        } else {
          alert("Invalid details");
        }
      } catch (error) {
        console.error("Login error:", error);
        alert("Failed to login. Please try again.");
      }
    }
  };

  const dashboardValid = async () => {
    const token = localStorage.getItem("usersdatatoken");

    if (!token) {
      console.log("No token found in localStorage");
      // Handle case where token is missing (redirect to login, display message, etc.)
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

      if (data.status === 401 || !data.validUserOne) {
        console.log("User not valid or authorized");
        // Handle unauthorized user (redirect to login, clear token, etc.)
        // For example:
        // localStorage.removeItem("usersdatatoken");
        // Redirect to login page
      } else if (data.error === "User is blocked") {
        navigate("/blockedstudenterror");
      } else {
        console.log("User verified");
        // Handle authorized user (set user data in state/context, redirect to dashboard, etc.)
        // For example:
        // setLoginData(data.validUserOne);
        navigate("/userdash");
      }
    } catch (error) {
      console.error("Error fetching valid user:", error);
      // Handle error (display error message, redirect to login, etc.)
    }
  };

  useEffect(() => {
    dashboardValid();
  }, [setLoginData, navigate]);

  return (
    <div className="reg-login">
      <div className="container1">
        <h1>Leaf Note</h1>
        <p>Your thoughts, beautifully organized.</p>
        <form onSubmit={loginHandler}>
          <div className="form_input">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              name="email"
              id="email"
              placeholder="Enter Your Email Address"
            />
            <div style={{ color: "red" }}>{loginEmailError}</div>
          </div>
          <div className="form_input">
            <label htmlFor="password">Password</label>
            <div className="two">
              <input
                type={passShow ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                name="password"
                id="password"
                placeholder="Enter Your Password"
              />
              <div className="showpass" onClick={passwordShowHideHandler}>
                {passShow ? <VisibilityOffIcon /> : <VisibilityIcon />}
              </div>
            </div>
            <div style={{ color: "red" }}>{loginPassError}</div>
          </div>
          <button className="btn" type="submit">
            Login
          </button>
          <p>
            Don't have an account?{" "}
            <NavLink to="/register">Create an Account</NavLink>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
