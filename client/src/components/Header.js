import React, { useContext } from "react";
import { Avatar } from "@mui/material";
import { NavLink, useNavigate } from "react-router-dom";
import "./header.css";
import { LoginContext } from "./ContextProvider/Context";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

const Header = () => {
  const { logindata, setLoginData } = useContext(LoginContext);
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const logoutuser = async () => {
    let token = localStorage.getItem("usersdatatoken");

    const res = await fetch("/logout", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
        Accept: "application/json",
      },
      credentials: "include",
    });

    const data = await res.json();

    if (data.status === 201) {
      localStorage.removeItem("usersdatatoken");
      setLoginData({ validUserOne: null });
      navigate("/login");
    } else {
      console.log("error");
    }
  };

  const goLogin = () => {
    navigate("/login");
  };

  const goRegister = () => {
    navigate("/register");
  };

  return (
    <header>
      <nav>
        <NavLink to="/">
          <h1>React App</h1>
        </NavLink>
        <div className="avatar">
          {logindata && logindata.validUserOne ? (
            <Avatar
              style={{
                background: "salmon",
                fontWeight: "bold",
                textTransform: "capitalize",
              }}
              onClick={handleClick}
            >
              {logindata.validUserOne.fname[0].toUpperCase()}
            </Avatar>
          ) : (
            <Avatar style={{ background: "blue" }} onClick={handleClick} />
          )}
        </div>

        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
        >
          {logindata && logindata.validUserOne ? (
            <MenuItem
              key="logout"
              onClick={() => {
                logoutuser();
                handleClose();
              }}
            >
              Logout
            </MenuItem>
          ) : (
            <div>
              <MenuItem
                key="login"
                onClick={() => {
                  goLogin();
                  handleClose();
                }}
              >
                Login
              </MenuItem>
              <MenuItem
                key="register"
                onClick={() => {
                  goRegister();
                  handleClose();
                }}
              >
                Register
              </MenuItem>
            </div>
          )}
        </Menu>
      </nav>
    </header>
  );
};

export default Header;
