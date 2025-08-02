// const jwt = require("jsonwebtoken")
// const userdb = require("../models/userSchema")

// const Skey = "soelshaikhshaikhsoelshaikhsoelab"

// const authenticate = async(req,res,next) =>{
//     try {
//         const token = req.headers.authorization;
//         //console.log("token :0",token);
//         const verifytoken = jwt.verify(token,Skey);
//         //console.log(verifytoken);
//         const rootUser = await userdb.findOne({_id : verifytoken._id})
//         //console.log(rootUser);

//         if(!rootUser){
//             throw new Error("User not found");
//         }

//         req.token = token,
//         req.rootUser = rootUser,
//         req.userId = rootUser._id;

//         next();
//     } catch (error) {
//         res.status(401).json({status:401,message:"Unauthorized no token Provided"})
//     }
// }

// module.exports = authenticate;

// middlewares/authenticate.js

// const jwt = require("jsonwebtoken");
// const userdb = require("../models/userSchema");

// const Skey = "soelshaikhshaikhsoelshaikhsoelab"; // Replace with your secret key

// const authenticate = async (req, res, next) => {
//   try {
//     const token = req.headers.authorization;
//     if (!token) {
//       return res
//         .status(401)
//         .json({ status: 401, message: "Unauthorized, no token provided" });
//     }

//     const verifytoken = jwt.verify(token, Skey);
//     const rootUser = await userdb.findOne({ _id: verifytoken._id });

//     if (!rootUser) {
//       throw new Error("User not found");
//     }

//     req.token = token;
//     req.rootUser = rootUser;
//     req.userId = rootUser._id;

//     next();
//   } catch (error) {
//     console.error(error);
//     res
//       .status(401)
//       .json({ status: 401, message: "Unauthorized, invalid token" });
//   }
// };

// module.exports = authenticate;

//

// const jwt = require("jsonwebtoken");
// const User = require("../models/userSchema"); // Ensure this path is correct
// const Skey = "soelshaikhshaikhsoelshaikhsoelab"; // Replace with your secret key

// const authenticate = async (req, res, next) => {
//   try {
//     const token = req.headers.authorization.split(" ")[1]; // Get token after "Bearer"
//     if (!token) {
//       return res
//         .status(401)
//         .json({ status: 401, message: "Unauthorized, no token provided" });
//     }

//     const verifyToken = jwt.verify(token, Skey);
//     const rootUser = await User.findOne({ _id: verifyToken._id });

//     if (!rootUser) {
//       throw new Error("User not found");
//     }

//     req.token = token;
//     req.rootUser = rootUser;
//     req.userId = rootUser._id;

//     next();
//   } catch (error) {
//     console.error(error);
//     res
//       .status(401)
//       .json({ status: 401, message: "Unauthorized, invalid token" });
//   }
// };

// module.exports = authenticate;

// const jwt = require("jsonwebtoken");
// const User = require("../models/userSchema");
// const Skey = "soelshaikhshaikhsoelshaikhsoelab"; // Replace with your secret key

// const authenticate = async (req, res, next) => {
//   try {
//     const token = req.headers.authorization.split(" ")[1]; // Get token after "Bearer"
//     if (!token) {
//       return res
//         .status(401)
//         .json({ status: 401, message: "Unauthorized, no token provided" });
//     }

//     const verifyToken = jwt.verify(token, Skey);
//     const rootUser = await User.findOne({ _id: verifyToken._id });

//     if (!rootUser) {
//       return res
//         .status(401)
//         .json({ status: 401, message: "Unauthorized, user not found" });
//     }

//     req.token = token;
//     req.rootUser = rootUser;
//     req.userId = rootUser._id;

//     next();
//   } catch (error) {
//     console.error("Authentication error:", error.message);
//     return res
//       .status(401)
//       .json({ status: 401, message: "Unauthorized, invalid token" });
//   }
// };

// module.exports = authenticate;

// const jwt = require("jsonwebtoken");
// const User = require("../models/userSchema"); // Adjust the path accordingly
// const Skey = "soelshaikhshaikhsoelshaikhsoelab"; // Replace with your secret key

// const authenticate = async (req, res, next) => {
//   try {
//     const authHeader = req.headers.authorization;
//     if (!authHeader) {
//       return res
//         .status(401)
//         .json({ status: 401, message: "Unauthorized, no token provided" });
//     }

//     const token = authHeader.split(" ")[1]; // Get token after "Bearer"
//     if (!token) {
//       return res
//         .status(401)
//         .json({ status: 401, message: "Unauthorized, no token provided" });
//     }

//     let verifyToken;
//     try {
//       verifyToken = jwt.verify(token, Skey);
//     } catch (err) {
//       return res
//         .status(401)
//         .json({ status: 401, message: "Unauthorized, invalid token" });
//     }

//     const rootUser = await User.findOne({ _id: verifyToken._id });
//     if (!rootUser) {
//       return res
//         .status(401)
//         .json({ status: 401, message: "Unauthorized, user not found" });
//     }

//     req.token = token;
//     req.rootUser = rootUser;
//     req.userId = rootUser._id;

//     next();
//   } catch (error) {
//     console.error("Authentication error:", error.message);
//     return res
//       .status(401)
//       .json({ status: 401, message: "Unauthorized, invalid token" });
//   }
// };

// module.exports = authenticate;

// const jwt = require("jsonwebtoken");
// const User = require("../models/userSchema"); // Adjust the path accordingly
// const Skey = "soelshaikhshaikhsoelshaikhsoelab"; // Replace with your secret key

// const authenticate = async (req, res, next) => {
//   try {
//     const authHeader = req.headers.authorization;
//     if (!authHeader) {
//       return res
//         .status(401)
//         .json({ status: 401, message: "Unauthorized, no token provided" });
//     }

//     // Extract token using a regular expression
//     const tokenMatch = authHeader.match(/^Bearer (.+)$/);
//     if (!tokenMatch) {
//       return res
//         .status(401)
//         .json({ status: 401, message: "Unauthorized, invalid token format" });
//     }

//     const token = tokenMatch[1];
//     let verifyToken;
//     try {
//       verifyToken = jwt.verify(token, Skey);
//     } catch (err) {
//       return res
//         .status(401)
//         .json({ status: 401, message: "Unauthorized, invalid token" });
//     }

//     const rootUser = await User.findOne({ _id: verifyToken._id });
//     if (!rootUser) {
//       return res
//         .status(401)
//         .json({ status: 401, message: "Unauthorized, user not found" });
//     }

//     req.token = token;
//     req.rootUser = rootUser;
//     req.userId = rootUser._id;

//     next();
//   } catch (error) {
//     console.error("Authentication error:", error.message);
//     return res
//       .status(401)
//       .json({ status: 401, message: "Unauthorized, invalid token" });
//   }
// };

// module.exports = authenticate;
// const jwt = require("jsonwebtoken");
// const User = require("../models/userSchema");
// const AdminAccs = require("../models/Adminacc");
// const Skey = "soelshaikhshaikhsoelshaikhsoelab"; // Replace with your secret key

// const authenticate = async (req, res, next) => {
//   try {
//     const authHeader = req.headers.authorization;
//     if (!authHeader) {
//       return res
//         .status(401)
//         .json({ status: 401, message: "Unauthorized, no token provided" });
//     }

//     const tokenMatch = authHeader.match(/^Bearer (.+)$/);
//     if (!tokenMatch) {
//       return res
//         .status(401)
//         .json({ status: 401, message: "Unauthorized, invalid token format" });
//     }

//     const token = tokenMatch[1];
//     let verifyToken;
//     try {
//       verifyToken = jwt.verify(token, Skey);
//     } catch (err) {
//       return res
//         .status(401)
//         .json({ status: 401, message: "Unauthorized, invalid token" });
//     }

//     let rootUser;
//     if (verifyToken.role === "admin") {
//       rootUser = await AdminAccs.findOne({ _id: verifyToken._id });
//     } else {
//       rootUser = await User.findOne({ _id: verifyToken._id });
//     }

//     if (!rootUser) {
//       return res
//         .status(401)
//         .json({ status: 401, message: "Unauthorized, user not found" });
//     }

//     req.token = token;
//     req.rootUser = rootUser;
//     req.userId = rootUser._id;

//     next();
//   } catch (error) {
//     console.error("Authentication error:", error.message);
//     return res
//       .status(401)
//       .json({ status: 401, message: "Unauthorized, invalid token" });
//   }
// };

// module.exports = authenticate;

// const jwt = require("jsonwebtoken");
// const User = require("../models/userSchema");
// const Skey = "soelshaikhshaikhsoelshaikhsoelab"; // Replace with your secret key

// const authenticate = async (req, res, next) => {
//   try {
//     const authHeader = req.headers.authorization;
//     if (!authHeader) {
//       return res
//         .status(401)
//         .json({ message: "Unauthorized, no token provided" });
//     }

//     const token = authHeader.split(" ")[1]; // Get the token part after "Bearer "

//     let verifyToken;
//     try {
//       verifyToken = jwt.verify(token, process.env.SKEY);
//     } catch (err) {
//       return res.status(401).json({ message: "Unauthorized, invalid token" });
//     }

//     // Fetch user based on token data
//     let rootUser;
//     if (verifyToken.role === "admin") {
//       rootUser = await User.findOne({ _id: verifyToken._id });
//     }
//     if (verifyToken.role === "client") {
//       rootUser = await User.findOne({ _id: verifyToken._id });
//     } else {
//       rootUser = await User.findOne({ _id: verifyToken._id });
//     }

//     if (!rootUser) {
//       return res.status(401).json({ message: "Unauthorized, user not found" });
//     }

//     // Attach user data to request object
//     req.token = token;
//     req.rootUser = rootUser;
//     req.userId = rootUser._id;

//     next();
//   } catch (error) {
//     console.error("Authentication error:", error.message);
//     return res.status(401).json({ message: "Unauthorized, invalid token" });
//   }
// };

// module.exports = authenticate;

const jwt = require("jsonwebtoken");
const User = require("../models/userSchema");
const Skey = "soelshaikhshaikhsoelshaikhsoelab"; // Ensure this is the same key used to sign the token

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res
        .status(401)
        .json({ message: "Unauthorized, no token provided" });
    }

    const token = authHeader.split(" ")[1]; // Get the token part after "Bearer "
    console.log("Received token:", token);

    let verifyToken;
    try {
      verifyToken = jwt.verify(token, Skey); // Use the correct secret key
    } catch (err) {
      console.error("Token verification failed:", err.message);
      return res.status(401).json({ message: "Unauthorized, invalid token" });
    }

    // Fetch user based on token data
    const rootUser = await User.findOne({ _id: verifyToken._id });

    if (!rootUser) {
      return res.status(401).json({ message: "Unauthorized, user not found" });
    }

    // Check if the user is a team leader
    if (rootUser.isTeamLeader) {
      req.team = rootUser.team; // Store the team in the request object if the user is a team leader
    }

    // Attach user data to request object
    req.token = token;
    req.rootUser = rootUser;
    req.userId = rootUser._id;

    next();
  } catch (error) {
    console.error("Authentication error:", error.message);
    return res.status(401).json({ message: "Unauthorized, invalid token" });
  }
};

module.exports = authenticate;
