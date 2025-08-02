// require("dotenv").config();
// const express = require("express");
// const app = express();
// const cors = require("cors");
// const userdb = require("./models/userSchema");
// const cookieParser = require("cookie-parser");
// const bcrypt = require("bcryptjs");
// const compression = require("compression");
// const path = require("path");

// require("./db/conn");
// const router = require("./routes/router");
// const port = 5000;

// app.use(express.json());

// app.use(
//   cors({
//     origin: "http://localhost:3000",
//     credentials: true,
//   })
// );

// app.use(compression());
// app.use("/api", router);
// app.use(cookieParser());

// // Serve static files from the 'uploads' directory
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// const checkAdminAccount = async () => {
//   try {
//     // Fetch admin account details with optimized query
//     const uservar = await userdb
//       .findOne({
//         email: "leafwayadmin@gmail.com",
//       })
//       .select("email password")
//       .lean();

//     if (!uservar) {
//       const hashedPassword = await bcrypt.hash("12345678", 10);
//       const newAdmin = new userdb({
//         email: "leafwayadmin@gmail.com",
//         fname: "admin",
//         password: hashedPassword,
//         cpassword: hashedPassword,
//         role: "admin",
//       });

//       await newAdmin.save();
//       console.log("Admin account created successfully");
//     } else {
//       console.log("Admin account already exists");
//     }
//   } catch (error) {
//     console.error("Error checking/admin account:", error);
//   }
// };

// checkAdminAccount();

// console.log("JWT Secret Key:", process.env.SKEY);

// app.listen(port, () => {
//   console.log(`Server created at: ${port}`);
// });

require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const userdb = require("./models/userSchema");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcryptjs");
const compression = require("compression");
const path = require("path");

require("./db/conn");
const router = require("./routes/router");
const port = 5000;

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(compression());
app.use("/api", router);
app.use(cookieParser());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// const checkAdminAccount = async () => {
//   try {
//     const uservar = await userdb
//       .findOne({
//         email: "leafwayadmin@gmail.com",
//       })
//       .select("email password")
//       .lean();

//     if (!uservar) {
//       const hashedPassword = await bcrypt.hash("12345678", 10);
//       const newAdmin = new userdb({
//         email: "leafwayadmin@gmail.com",
//         fname: "admin",
//         password: hashedPassword,
//         cpassword: hashedPassword,
//         role: "admin",
//       });

//       await newAdmin.save();
//       console.log("Admin account created successfully");
//     } else {
//       console.log("Admin account already exists");
//     }
//   } catch (error) {
//     console.error("Error checking/admin account:", error);
//   }
// };

const checkAdminAccount = async () => {
  try {
    const uservar = await userdb
      .findOne({
        email: "leafwayadmin@gmail.com",
      })
      .select("email password")
      .lean();

    if (!uservar) {
      const hashedPassword = await bcrypt.hash(
        "FocuslyWorkManagement@01022025",
        10
      );
      const newAdmin = new userdb({
        email: "leafwayadmin@gmail.com",
        fname: "admin",
        password: hashedPassword,
        cpassword: hashedPassword,
        role: "admin",
        // Add the company field here
      });

      await newAdmin.save();
      console.log("Admin account created successfully");
    } else {
      console.log("Admin account already exists");
    }
  } catch (error) {
    console.error("Error checking/admin account:", error);
  }
};

const checkWoxAdminAccount = async () => {
  try {
    const uservar = await userdb
      .findOne({
        email: "woxadmin@gmail.com",
      })
      .select("email password")
      .lean();

    if (!uservar) {
      const hashedPassword = await bcrypt.hash(
        "FocuslyWorkManagement@01022025",
        10
      );
      const newAdmin = new userdb({
        email: "voxadmin@gmail.com",
        fname: "admin",
        password: hashedPassword,
        cpassword: hashedPassword,
        role: "admin2",
        // Add the company field here
      });

      await newAdmin.save();
      console.log("Wox Admin account created successfully");
    } else {
      console.log("Wox Admin account already exists");
    }
  } catch (error) {
    console.error("Error checking/admin account:", error);
  }
};

checkAdminAccount();
checkWoxAdminAccount();

console.log("JWT Secret Key:", process.env.SKEY);

app.listen(port, () => {
  console.log(`Server created at: ${port}`);
});
