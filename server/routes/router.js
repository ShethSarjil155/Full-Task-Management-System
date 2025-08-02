require("dotenv").config();
const express = require("express");
const router = new express.Router();
const bcrypt = require("bcryptjs");
const User = require("../models/userSchema");
const infodb = require("../models/infoSchema");
const notesdb = require("../models/noteSchema");
const LoginHistory = require("../models/loginhistorySchema");
const UserRequest = require("../models/requests");
const authenticate = require("../middleware/authenticate");
const jwt = require("jsonwebtoken");
const userRequest = require("../models/requests");
const Message = require("../models/message");
const Task = require("../models/taskModel");
const Notification = require("../models/Notification");
const Company = require("../models/companyschema");
const TaskAssignment = require("../models/taskAssignmentSchema");
const TaskAssignmentLog = require("../models/taskAssignmentLogSchema");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Skey = "soelshaikhshaikhsoelshaikhsoelab";

console.log("JWT Secret Key:", process.env.SKEY); // Verify if the secret key is loaded

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

if (!process.env.SKEY) {
  console.error("JWT secret key is not set in environment variables");
  process.exit(1); // Exit the application if the key is not set
}

//register router
router.post("/register", async (req, res) => {
  const { fname, email, password, cpassword, team, designation, company } =
    req.body;

  if (
    !fname ||
    !email ||
    !password ||
    !cpassword ||
    !team ||
    !designation ||
    !company
  ) {
    return res.status(422).json({ error: "Please fill all the details" });
  }

  try {
    const preuser = await User.findOne({ email: email });
    if (preuser) {
      return res.status(422).json({ error: "This email is already in use" });
    }

    if (password !== cpassword) {
      return res.status(422).json({ error: "Passwords do not match" });
    }

    const newUser = new User({
      fname,
      email,
      password,
      cpassword,
      team,
      designation,
      company,
    });
    const savedUser = await newUser.save();

    return res.status(201).json({ status: 201, data: savedUser });
  } catch (error) {
    return res.status(500).json({ error: "Failed to register user" });
  }
});

//login main code
// router.post("/login", async (req, res) => {
//   const { email, password } = req.body;

//   if (!email || !password) {
//     return res.status(422).json({ error: "Please fill all the details" });
//   }

//   try {
//     console.log(`Attempting login for email: ${email}`);

//     // Check for User
//     const user = await User.findOne({ email });
//     if (user.isBlocked === "y") {
//       return res.status(403).json({ error: "User is blocked" });
//     }

//     if (!user) {
//       console.log("User not found");
//       return res.status(400).json({ error: "Invalid email or password" });
//     }

//     if (user.role == "admin") {
//       return res.status(202).json({
//         status: 202,
//         result: { role: "admin" },
//       });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       console.log("User password mismatch");
//       return res.status(400).json({ error: "Invalid email or password" });
//     }

//     const loginHistory = new LoginHistory({
//       role: "user",
//       userName: email,
//       loginTime: new Date(),
//       task: "login",
//     });

//     await loginHistory.save();

//     console.log("User password match");
//     const token = jwt.sign({ _id: user._id, role: "user" }, Skey, {
//       expiresIn: "2h",
//     });

//     console.log("User JWT token generated:", token);

//     res.cookie("usercookie", token, {
//       expires: new Date(Date.now() + 9000000000),
//       httpOnly: true,
//     });

//     console.log("User token set in cookie");

//     return res.status(202).json({
//       status: 202,
//       result: { user, token, role: "user" },
//     });
//   } catch (error) {
//     console.error("Login error:", error);
//     res.status(500).json({ error: "Failed to login user" });
//   }
// });

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(422).json({ error: "Please fill all the details" });
  }

  try {
    console.log(`Attempting login for email: ${email}`);

    // Check for User
    const user = await User.findOne({ email });
    if (user.isBlocked === "y") {
      return res.status(403).json({ error: "User is blocked" });
    }

    if (!user) {
      console.log("User not found");
      return res.status(400).json({ error: "Invalid email or password" });
    }

    if (user.role == "admin") {
      return res.status(202).json({
        status: 202,
        result: { role: "admin" },
      });
    }
    if (user.role == "admin2") {
      return res.status(202).json({
        status: 202,
        result: { role: "admin2" },
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("User password mismatch");
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // Log login history
    const loginHistory = new LoginHistory({
      role: "user",
      userName: email,
      loginTime: new Date(),
      task: "login",
    });

    await loginHistory.save();

    console.log("User password match");

    // Generate JWT token
    const token = jwt.sign({ _id: user._id, role: "user" }, Skey, {
      expiresIn: "2h",
    });

    console.log("User JWT token generated:", token);

    res.cookie("usercookie", token, {
      expires: new Date(Date.now() + 9000000000),
      httpOnly: true,
    });

    console.log("User token set in cookie");

    // Send the company data along with the user info in the response
    return res.status(202).json({
      status: 202,
      result: { user, token, role: "user", company: user.company },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Failed to login user" });
  }
});

router.get("/validuser", authenticate, async (req, res) => {
  try {
    if (!req.rootUser) {
      return res
        .status(401)
        .json({ status: 401, error: "User not authorized" });
    }

    let validUserOne;

    if (req.rootUser.role === "admin") {
      validUserOne = await AdminAccs.findOne({ _id: req.rootUser._id });
    } else if (req.rootUser.role === "client") {
      validUserOne = await AdminAccs.findOne({ _id: req.rootUser._id });
    } else {
      validUserOne = await User.findOne({ _id: req.rootUser._id });
    }

    if (!validUserOne) {
      return res
        .status(401)
        .json({ status: 401, error: "User not authorized" });
    }

    res.status(200).json({ status: 200, validUserOne });
  } catch (error) {
    console.error("Error fetching valid user:", error);
    res.status(500).json({ status: 500, error: "Server error" });
  }
});

router.get("/logout", authenticate, async (req, res) => {
  try {
    if (!req.rootUser) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const loginHistory = new LoginHistory({
      role: "user",
      userName: req.rootUser.email,
      loginTime: new Date(),
      task: "logout",
    });

    await loginHistory.save();

    // Check if tokens exist before attempting to filter
    if (req.rootUser.tokens) {
      req.rootUser.tokens = req.rootUser.tokens.filter(
        (token) => token.token !== req.token
      );
    }

    await req.rootUser.save();

    // Clear cookies based on role
    if (req.rootUser.role === "admin") {
      res.clearCookie("admintoken");
    } else {
      res.clearCookie("usercookie");
    }

    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error("Logout error:", error.message);
    res.status(500).json({ error: "Failed to logout user" });
  }
});

router.post("/addata", async (req, res) => {
  console.log(req.body);
  const { fullname, age } = req.body;

  console.log(fullname + age);

  if (!fullname || !age) {
    res.status(422).json("Plz Fill Data");
  }

  try {
    const addData = new infodb({
      fullname: fullname,
      age: age,
    });

    const finaldata = await addData.save();
    res.status(201).json({ status: 201, finaldata });
    console.log("Data Added Successfully");
  } catch (error) {
    res.status(422).json(error);
  }
});
router.get("/getdata", async (req, res) => {
  try {
    const getAllData = await infodb.find();
    res.status(201).json(getAllData);
  } catch (error) {
    res.status(422).json(error);
  }
});
router.delete("/deletedata/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    const deletedData = await infodb.findByIdAndDelete({ _id: id });
    console.log(deletedData);
    res.status(201).json(deletedData);
  } catch (error) {
    res.status(422).json(error);
  }
});
router.get("/getdata/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const selectedData = await infodb.findById({ _id: id });
    res.status(201).json(selectedData);
  } catch (error) {
    res.status(422).json(error);
  }
});
router.patch("/updatedata/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = await infodb.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    console.log("check :", updatedData);
    res.status(201).json(updatedData);
  } catch (error) {
    res.status(422).json(error);
  }
});

// Add a note
router.post("/addnotes", authenticate, async (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(422).json({ error: "Please fill in all fields." });
  }

  try {
    const newNote = new notesdb({
      title,
      content,
      owner: req.userId,
    });

    const savedNote = await newNote.save();
    res.status(201).json({
      status: 201,
      message: "Note added successfully",
      note: savedNote,
    });
  } catch (error) {
    console.error("Error adding note:", error.message);
    res.status(500).json({ error: "Failed to add note" });
  }
});

// Get notes
router.get("/getnotes", authenticate, async (req, res) => {
  try {
    const userNotes = await notesdb.find({ owner: req.userId }); // Use `owner` instead of `userId`
    res.status(200).json(userNotes);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch notes" });
  }
});

router.get("/getnotes/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const selectedData = await notesdb.findById(id);
    if (!selectedData) {
      return res.status(404).json({ error: "Note not found" });
    }
    res.status(200).json(selectedData);
  } catch (error) {
    console.error("Error fetching note by ID:", error.message);
    res.status(500).json({ error: "Failed to fetch note" });
  }
});

// Update a note by ID
router.put("/updatenotes/:id", authenticate, async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;

  try {
    const updatedNote = await notesdb.findByIdAndUpdate(
      id,
      { title, content },
      { new: true } // To return the updated document
    );

    if (!updatedNote) {
      return res.status(404).json({ error: "Note not found" });
    }

    res.status(200).json({
      status: 200,
      message: "Note updated successfully",
      note: updatedNote,
    });
  } catch (error) {
    console.error("Error updating note:", error.message);
    res.status(500).json({ error: "Failed to update note" });
  }
});
router.delete("/deletenote/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedNote = await notesdb.findOneAndDelete({
      _id: id,
      userId: req.userId, // Assuming req.userId is properly populated with the authenticated user's ID
    });

    if (!deletedNote) {
      return res.status(404).json({ error: "Note not found" });
    }

    res.status(200).json(deletedNote);
  } catch (error) {
    console.error("Error deleting note:", error);
    res.status(500).json({ error: "Failed to delete note" });
  }
});

// Example Express.js route handler
router.patch("/pinnote/:id", async (req, res) => {
  try {
    const noteId = req.params.id;
    const note = await notesdb.findById(noteId);

    if (!note) {
      return res.status(404).json({ error: "Note not found" });
    }

    note.isPinned = !note.isPinned; // Toggle pinned status
    await note.save();

    // Fetch the updated note to ensure correct isPinned status
    const updatedNote = await notesdb.findById(noteId);

    res.status(200).json(updatedNote);
  } catch (error) {
    console.error("Failed to pin note:", error);
    res.status(500).json({ error: "Failed to pin note" });
  }
});

router.get("/allusers", async (req, res) => {
  try {
    const getAllData = await User.find();
    res.status(201).json(getAllData);
  } catch (error) {
    res.status(422).json(error);
  }
});

router.get("/login-history", async (req, res) => {
  try {
    const loginHistory = await LoginHistory.find();
    res.status(201).json(loginHistory);
  } catch (error) {
    res.status(422).json(error);
  }
});

router.put("/blocked/:email", async (req, res) => {
  const { email } = req.params;

  try {
    const result = await User.updateOne(
      { email: email },
      { $set: { isBlocked: "y" } }
    );

    if (result.nModified === 0) {
      return res.status(404).json({ error: "Student not found" });
    }

    res.json({
      message: `Student blocked successfully`,
    });
  } catch (error) {
    console.error("Error updating student:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/unblocked/:email", async (req, res) => {
  const { email } = req.params;

  try {
    const result = await User.updateOne(
      { email: email },
      { $set: { isBlocked: "n" } }
    );

    if (result.nModified === 0) {
      return res.status(404).json({ error: "Student not found" });
    }

    res.json({
      message: `Student blocked successfully`,
    });
  } catch (error) {
    console.error("Error updating student:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// In your routes file

router.delete("/delete-history", async (req, res) => {
  try {
    await LoginHistory.deleteMany({});
    res.status(200).json({ message: "All history data deleted" });
  } catch (error) {
    console.error("Failed to delete history data:", error);
    res.status(500).json({ error: "Failed to delete history data" });
  }
});

// Route to get all user notes
// Route to get all user notes
router.get("/all-notes", async (req, res) => {
  try {
    const notes = await notesdb
      .find()
      .populate({ path: "owner", select: "email name" })
      .sort({ dateCreated: -1 });
    res.json({ notes });
  } catch (error) {
    console.error("Error fetching all user notes:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//request code

//team leader
// Route to get all requests for a team leader
router.get("/team-requests", authenticate, async (req, res) => {
  try {
    const requests = await UserRequest.find({ status: "pending" }).populate(
      "userId",
      "fname"
    );
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/leader-approve-request/:id", async (req, res) => {
  try {
    const requestId = req.params.id;
    const { action, message } = req.body;

    const request = await userRequest.findById(requestId);

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (action === "approve") {
      if (request.leaderStatus === "approved") {
        return res
          .status(400)
          .json({ message: "Request already approved by leader" });
      }
      request.leaderStatus = "approved";
      request.leaderMessage = message;
      request.status = "approved by leader";
    } else if (action === "reject") {
      if (request.leaderStatus === "rejected") {
        return res
          .status(400)
          .json({ message: "Request already rejected by leader" });
      }
      request.leaderStatus = "rejected";
      request.leaderMessage = message;
      request.status = "rejected by leader";
    } else {
      return res.status(400).json({ message: "Invalid action" });
    }

    await request.save();

    res.status(200).json({ message: `Request ${action}d by leader` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/submit-complaint", authenticate, async (req, res) => {
  const { subject, complaint } = req.body;
  const userId = req.userId;

  try {
    const newComplaint = new UserRequest({ userId, subject, complaint });
    await newComplaint.save();
    res.status(201).json({ message: "Complaint submitted successfully" });
  } catch (error) {
    console.error("Error submitting complaint:", error);
    res.status(500).json({ error: "Failed to submit complaint" });
  }
});

router.get("/user-complaints", authenticate, async (req, res) => {
  const userId = req.userId;

  try {
    const complaints = await UserRequest.find({ userId }).sort({
      createdAt: -1,
    });
    res.status(200).json(complaints);
  } catch (error) {
    console.error("Error fetching complaints:", error);
    res.status(500).json({ error: "Failed to fetch complaints" });
  }
});

router.delete("/delete-complaint/:id", authenticate, async (req, res) => {
  const { id } = req.params;

  try {
    const complaint = await userRequest.findByIdAndDelete(id);
    if (!complaint) {
      return res.status(404).json({ error: "Complaint not found" });
    }
    res.status(200).json({ message: "Complaint deleted successfully" });
  } catch (error) {
    console.error("Error deleting complaint:", error);
    res.status(500).json({ error: "Failed to delete complaint" });
  }
});

// Fetch all requests for admin view
router.get("/all-requests", async (req, res) => {
  try {
    const requests = await userRequest.find().populate("userId", "fname");
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Admin approves the request
router.put("/solve-request/:id", async (req, res) => {
  const requestId = req.params.id;

  try {
    const request = await userRequest.findById(requestId);

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    request.status = "accepted"; // Ensure status value matches what you're checking in frontend
    await request.save();

    res.status(200).json({ message: "Request marked as solved" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin rejects the request
router.put("/reject-request/:id", async (req, res) => {
  const requestId = req.params.id;

  try {
    const request = await userRequest.findById(requestId);

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    request.status = "rejected"; // Ensure status value matches what you're checking in frontend
    await request.save();

    res.status(200).json({ message: "Request marked as rejected" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/send-message", upload.single("file"), async (req, res) => {
  try {
    const { userId, message } = req.body; // Ensure userId is correctly sent in the request
    const file = req.file ? req.file.path : null;

    if (!userId || !message) {
      return res
        .status(400)
        .json({ message: "User ID and message are required" });
    }

    const newMessage = new Message({
      userId,
      message,
      file,
      createdAt: new Date(),
    });

    await newMessage.save();

    await Notification.create({
      userId: userId, // Use the correct userId from the request body
      message: `New message: ${message}`,
      type: "message",
      createdAt: new Date(),
      read: false,
    });

    res.status(201).json({ message: "Message sent and notification created" });
  } catch (error) {
    console.error("Error sending message and creating notification:", error);
    res.status(500).json({ message: error.message });
  }
});

router.get("/:userId/messages", async (req, res) => {
  try {
    const userId = req.params.userId;
    const messages = await Message.find({ userId });

    if (!messages) {
      return res
        .status(404)
        .json({ error: "Messages not found for this user" });
    }

    res.json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error.message);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

// DELETE route to delete a message by ID
router.delete("/messages/:messageId", async (req, res) => {
  const messageId = req.params.messageId;

  try {
    // Check if the message exists
    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ error: "Message not found" });
    }

    // Check if the message belongs to the user or handle permissions as needed

    // Delete the message from the database
    await message.deleteOne();

    res.status(200).json({ message: "Message deleted successfully" });
  } catch (error) {
    console.error("Error deleting message:", error.message);
    res.status(500).json({ error: "Failed to delete message" });
  }
});

router.put("/make-team-leader/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { isTeamLeader, team } = req.body;

    if (typeof isTeamLeader !== "boolean" || !team) {
      return res.status(400).json({ message: "Invalid request payload" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (isTeamLeader) {
      // Check if the team already has a leader
      const existingLeader = await User.findOne({ team, isTeamLeader: true });

      if (existingLeader && existingLeader._id.toString() !== userId) {
        return res
          .status(400)
          .json({ message: `The ${team} team already has a leader.` });
      }

      user.isTeamLeader = true;
      user.team = team;
      user.teamLeaderAlert = true;

      await Notification.create({
        userId: userId,
        message: `You have been made the Team Leader of the ${team} team!`,
        type: "teamLeader",
      });
    } else {
      user.isTeamLeader = false;
      user.team = null;
      user.teamLeaderAlert = false;
    }

    await user.save();

    res.status(200).json({
      message: isTeamLeader
        ? `User is now the Team Leader of the ${team} team`
        : "User is no longer a Team Leader",
    });
  } catch (error) {
    console.error("Error updating team leader status:", error);
    res.status(500).json({ message: "Error updating team leader status" });
  }
});

router.get("/user-details", authenticate, async (req, res) => {
  try {
    console.log("Fetching user details for userId:", req.userId); // Debugging log

    const userId = req.userId;
    if (!userId) {
      return res.status(400).json({ message: "No user ID provided" });
    }

    const user = await User.findById(userId);

    if (!user) {
      console.log("User not found:", userId); // Debugging log
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      teamLeaderAlert: user.teamLeaderAlert,
      clientCoordinatorAlert: user.clientCoordinatorAlert, // Make sure this is returned
      userId: user._id,
    });
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).json({ message: "Error fetching user details" });
  }
});

// Route to reset team leader alert
router.put("/reset-team-leader-alert", async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Reset the alert flag
    user.teamLeaderAlert = false;
    await user.save();

    res.status(200).json({ message: "Alert flag reset successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error resetting alert flag" });
  }
});

router.get("/notifications", authenticate, async (req, res) => {
  try {
    // Fetch all notifications for the user
    const notifications = await Notification.find({
      userId: req.userId,
    }).sort({ createdAt: -1 });

    // Delete notifications after fetching
    await Notification.deleteMany({ userId: req.userId });

    res.status(200).json(notifications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching notifications" });
  }
});

router.put("/notifications/mark-as-read", authenticate, async (req, res) => {
  try {
    await Notification.updateMany(
      { userId: req.userId, read: false },
      { read: true }
    );
    res.status(200).json({ message: "Notifications marked as read" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error marking notifications as read" });
  }
});

router.get("/notifications/count", authenticate, async (req, res) => {
  try {
    const count = await Notification.countDocuments({
      userId: req.userId,
      read: false,
    });
    res.status(200).json({ unreadCount: count });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching notification count" });
  }
});

// Fetch all users who are team leaders
router.get("/team-leaders", async (req, res) => {
  try {
    const leaders = await User.find({ isTeamLeader: true });
    res.status(200).json(leaders);
  } catch (error) {
    console.error("Error fetching team leaders:", error);
    res.status(500).json({ message: "Failed to fetch team leaders" });
  }
});

// Client sending message to leaders
router.post("/client/send-message", upload.single("file"), async (req, res) => {
  try {
    const { leaderId, message } = req.body;
    const file = req.file ? req.file.path : null;

    if (!leaderId || !message) {
      return res
        .status(400)
        .json({ message: "Leader ID and message are required" });
    }

    const newMessage = new Message({
      userId: leaderId,
      message,
      file,
      createdAt: new Date(),
    });

    await newMessage.save();

    await Notification.create({
      userId: leaderId,
      message: `New message from client: ${message}`,
      type: "message",
      createdAt: new Date(),
      read: false,
    });

    res.status(201).json({ message: "Message sent and notification created" });
  } catch (error) {
    console.error("Error sending message and creating notification:", error);
    res.status(500).json({ message: error.message });
  }
});

// Middleware to check if the user is a team leader
const verifyTeamLeader = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id); // Assuming req.user is populated by an authentication middleware
    if (!user || !user.isTeamLeader) {
      return res.status(403).json({ message: "Access denied" });
    }
    req.team = user.team; // Store the team in the request object
    next();
  } catch (error) {
    console.error("Error verifying team leader:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Route to get teammates
router.get("/teammates", authenticate, async (req, res) => {
  try {
    if (!req.rootUser.isTeamLeader) {
      return res
        .status(403)
        .json({ message: "Access denied, not a team leader" });
    }

    const teammates = await User.find({ team: req.team, isTeamLeader: false }); // Exclude the team leader
    res.status(200).json(teammates);
  } catch (error) {
    console.error("Error fetching teammates:", error);
    res.status(500).json({ message: "Error fetching teammates" });
  }
});

router.post(
  "/admin-send-message",
  upload.array("files[]"),
  async (req, res) => {
    try {
      const { teamIds, message } = req.body;
      const files = req.files.map((file) => file.path);

      // Create a message for each selected team
      for (const teamId of teamIds) {
        await Message.create({
          userId: teamId,
          message,
          files,
        });

        await Notification.create({
          userId: teamId,
          message: `New message for your team: ${message}`,
          type: "message",
          createdAt: new Date(),
          read: false,
        });
      }

      res.status(200).json({ message: "Messages sent successfully" });
    } catch (error) {
      console.error("Error sending message:", error.message);
      res.status(500).json({ error: "Failed to send message" });
    }
  }
);
router.post(
  "/teamleader-send-message",
  authenticate,
  upload.array("files[]"), // Match the field name used in the form for consistency
  async (req, res) => {
    try {
      if (!req.rootUser.isTeamLeader) {
        return res
          .status(403)
          .json({ message: "Access denied, not a team leader" });
      }

      const { message, teammateIds } = req.body;
      const files = req.files.map((file) => file.path);

      // Create a message for each selected teammate
      for (const userId of teammateIds) {
        await Message.create({
          userId,
          message,
          files,
        });

        await Notification.create({
          userId,
          message: `New message from your team leader: ${message}`,
          type: "message",
          createdAt: new Date(),
          read: false,
        });
      }

      res.status(200).json({ message: "Messages sent successfully" });
    } catch (error) {
      console.error("Error sending message:", error.message);
      res.status(500).json({ error: "Failed to send message" });
    }
  }
);

router.get("/teamleader/teammates-emails", authenticate, async (req, res) => {
  try {
    if (!req.rootUser.isTeamLeader) {
      return res
        .status(403)
        .json({ message: "Access denied, not a team leader" });
    }

    const teammates = await User.find({
      team: req.rootUser.team,
      isTeamLeader: false,
    });

    const emails = teammates.map((teammate) => ({
      _id: teammate._id,
      email: teammate.email,
    }));

    res.status(200).json(emails);
  } catch (error) {
    console.error("Error fetching teammates' emails:", error);
    res.status(500).json({ message: "Failed to fetch teammates' emails" });
  }
});

router.patch("/tasks/:id", authenticate, async (req, res) => {
  try {
    const { taskName, startTime, endTime, completed } = req.body;
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { taskName, startTime, endTime, completed },
      { new: true, runValidators: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//new code
router.post("/tasks", authenticate, async (req, res) => {
  try {
    const { taskName, startTime, endTime } = req.body;
    const userId = req.userId; // Use the user ID from the token
    const createdBy = req.userId;

    // Ensure all required fields are present
    if (!taskName || !startTime || !endTime) {
      return res.status(400).json({
        message: "All fields (taskName, startTime, endTime) are required",
      });
    }

    // Check if req.user is defined
    if (!req.userId || !req.userId._id) {
      return res.status(401).json({ message: "Unauthorized, user not found" });
    }

    // Calculate remaining time in minutes
    const remainingTime = Math.max(
      0,
      Math.floor((new Date(endTime) - new Date()) / (1000 * 60))
    );

    const task = new Task({
      taskName,
      startTime,
      endTime,
      createdBy,
      userId,
      remainingTime,
      status: "Pending", // Initial status
      teamLeaderStatus: "Pending", // Initial team leader status
      adminStatus: "Pending", // Initial admin status
    });

    const savedTask = await task.save();
    res
      .status(201)
      .json({ message: "Task created successfully", task: savedTask });
  } catch (error) {
    console.error("Error creating task:", error);
    res
      .status(500)
      .json({ message: "Error creating task", error: error.message });
  }
});

router.delete("/tasks/:id", authenticate, async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/tasks", authenticate, async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.userId }); // Filter by userId from token
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Mark a task as done and send to the team leader
router.patch("/tasks/:id/mark-done", authenticate, async (req, res) => {
  try {
    const taskId = req.params.id;
    const user = req.rootUser; // Access user data from middleware

    // Find the task by ID
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Update the task status to "Completed"
    task.status = "Completed";

    // Reset remaining time
    task.remainingTime = 0;

    // Determine if the task should be sent to the team leader
    if (user.isTeamLeader) {
      task.status = "SentToAdmin"; // Set to "SentToAdmin" if sent to team leader
    }

    // Save the updated task
    await task.save();

    // Optionally notify the admin about the completed task
    if (user.isTeamLeader && task.status === "SentToAdmin") {
      const admin = await User.findOne({ role: "admin" }); // Assuming admin role
      // Implement notification logic here if needed
    }

    res.json({ message: "Task marked as done", task });
  } catch (error) {
    console.error("Error marking task as done:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/team-tasks", authenticate, async (req, res) => {
  try {
    const teamLeader = req.rootUser;

    if (!teamLeader.isTeamLeader) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Find all users in the same team as the team leader
    const teamMembers = await User.find({ team: teamLeader.team });
    const teamMemberIds = teamMembers.map((member) => member._id);

    // Fetch tasks assigned to the team members and populate the userId field
    const tasks = await Task.find({ userId: { $in: teamMemberIds } })
      .populate({ path: "userId", select: "fname" })
      .exec();

    res.status(200).json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

router.patch("/tasks/:id/leader-done", authenticate, async (req, res) => {
  try {
    const taskId = req.params.id;
    const userId = req.userId; // This should be the ID from the authenticated user
    const task = await Task.findById(taskId);

    if (!task) return res.status(404).json({ message: "Task not found" });

    // Check if the task is assigned to the user or if the user is a team leader
    if (String(task.userId) !== String(userId) && !req.rootUser.isTeamLeader) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // If the task is pending, mark it as completed
    if (task.status === "Pending") {
      task.status = "Completed";
      await task.save();
    }

    // If the user is a team leader, update the status to "SentToAdmin" after completion
    if (req.rootUser.isTeamLeader) {
      if (task.status === "Completed") {
        task.status = "SentToAdmin";
        await task.save();
        // Optionally, notify the admin about the task status change
        // You can implement a notification system here
      }
    }

    res.json({ message: "Task status updated", task });
  } catch (error) {
    console.error("Error marking task as done:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/admin/tasks", async (req, res) => {
  try {
    const tasks = await Task.find({ status: "SentToAdmin" }).populate(
      "userId",
      "fname"
    );
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Error fetching tasks", error });
  }
});

router.delete("/tasks/:id/admin-done", async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Remove the admin check since you only need authentication

    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Error deleting task:", error.message);
    res.status(500).json({ error: "Error deleting task" });
  }
});

// Create company
router.post("/create-company", async (req, res) => {
  const { companyName } = req.body;

  if (!companyName) {
    return res.status(400).json({ error: "Company name is required" });
  }

  try {
    const newCompany = new Company({ companyName });
    await newCompany.save();
    res.status(201).json({ success: true, company: newCompany });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error creating company", details: error.message });
  }
});

// Get all companies
router.get("/companies", async (req, res) => {
  try {
    const companies = await Company.find();
    console.log(companies); // Add this to verify the response
    res.status(200).json({ success: true, companies });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error fetching companies", details: error.message });
  }
});

// Delete company
router.delete("/delete-company/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await Company.findByIdAndDelete(id);
    res
      .status(200)
      .json({ success: true, message: "Company deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error deleting company", details: error.message });
  }
});

//client cordinator making
router.put("/make-client-coordinator/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { isClientCoordinator } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (isClientCoordinator) {
      user.isClientCoordinator = true;
      user.clientCoordinatorAlert = true; // <-- This flag should be set to true
      await Notification.create({
        userId: userId,
        message: "You have been made a Client Coordinator!",
        type: "clientCoordinator",
      });
    } else {
      user.isClientCoordinator = false;
      user.clientCoordinatorAlert = false; // Reset the alert if removed
    }

    await user.save();
    res.status(200).json({
      message: isClientCoordinator
        ? "User is now a Client Coordinator"
        : "User is no longer a Client Coordinator",
    });
  } catch (error) {
    console.error("Error updating client coordinator status:", error);
    res
      .status(500)
      .json({ message: "Error updating client coordinator status" });
  }
});

// Route to reset client coordinator alert
router.put("/reset-client-coordinator-alert", async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Reset the alert flag
    user.clientCoordinatorAlert = false;
    await user.save();

    res.status(200).json({ message: "Alert flag reset successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error resetting alert flag" });
  }
});

router.post("/assign-task", authenticate, async (req, res) => {
  try {
    const { companyId, taskName, preview, teamLeaderId } = req.body;

    const taskAssignment = await TaskAssignment.create({
      companyId,
      taskName,
      preview,
      teamLeaderId,
      assignedBy: req.userId, // Client Coordinator ID
      clientCoordinatorId: req.userId, // Add Client Coordinator ID here
    });

    //     // Log the task assignment
    await TaskAssignmentLog.create({
      companyId,
      taskName,
      teamLeaderId,
      assignedBy: req.userId, // Use req.userId from authentication middleware
      assignedAt: new Date(),
    });

    await Notification.create({
      userId: teamLeaderId,
      message: `New message for your team from Client Coordinator`,
      type: "message",
      createdAt: new Date(),
      read: false,
    });

    res
      .status(200)
      .json({ message: "Task assigned successfully", taskAssignment });
  } catch (error) {
    console.error("Error assigning task:", error.message);
    res.status(500).json({ error: "Failed to assign task" });
  }
});

router.get("/client-team-tasks", authenticate, async (req, res) => {
  try {
    const teamLeaderId = req.rootUser._id; // Assuming team leader is authenticated

    const tasks = await TaskAssignment.find({ teamLeaderId })
      .populate("companyId", "companyName") // Populate company details
      .populate("teamLeaderId", "name"); // Populate team leader details

    if (!tasks || tasks.length === 0) {
      return res
        .status(404)
        .json({ error: "No tasks found for this team leader" });
    }

    res.json(tasks);
  } catch (error) {
    console.error("Error fetching team tasks:", error.message);
    res.status(500).json({ error: "Failed to fetch team tasks" });
  }
});

router.post("/assign-team-task", authenticate, async (req, res) => {
  try {
    const {
      companyId,
      taskName,
      preview,
      teamLeaderId,
      assignedTo,
      teammateAssignedTo,
    } = req.body;

    // Check if a task is already assigned to the same teammate to avoid duplication
    const existingAssignment = await TaskAssignmentLog.findOne({
      companyId,
      taskName,
      teamLeaderId,
      assignedTo,
    });

    if (existingAssignment) {
      return res
        .status(400)
        .json({ error: "Task has already been assigned to this teammate." });
    }

    // Log the task assignment
    const newTaskAssignment = await TaskAssignmentLog.create({
      companyId,
      taskName,
      preview,
      teamLeaderId,
      assignedTo, // Team leader ID
      teammateAssignedTo, // The actual teammate the team leader assigned
      assignedBy: req.userId, // Client coordinator or Team Leader
      assignedAt: new Date(),
    });

    // Optionally send a notification to the teammate
    if (teammateAssignedTo) {
      await Notification.create({
        userId: teammateAssignedTo, // Send the notification to the teammate
        message: `A new task has been assigned to you by the team leader.`,
        type: "task",
        createdAt: new Date(),
        read: false,
      });
    }

    res.status(200).json({
      message: "Task assigned successfully",
      newTaskAssignment,
    });
  } catch (error) {
    console.error("Error assigning task to teammate:", error.message);
    res.status(500).json({ error: "Failed to assign task to teammate" });
  }
});

router.get("/fetchingtasks/:taskId", async (req, res) => {
  const { taskId } = req.params;

  try {
    // Find the task by its ID
    const task = await TaskAssignment.findById(taskId).populate(
      "companyId",
      "companyName"
    ); // Assuming 'companyId' is populated

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json(task);
  } catch (error) {
    console.error("Error fetching task details:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/tasks-assigned-to-me", authenticate, async (req, res) => {
  try {
    const teammateId = req.userId; // Get the current teammate's ID from authentication middleware
    console.log("Teammate ID:", teammateId); // Log the logged-in teammate ID for debugging

    // Find tasks assigned to the teammate, matching the teammateAssignedTo field
    const tasksAssignedToTeammate = await TaskAssignmentLog.find({
      teammateAssignedTo: teammateId, // Match the teammate's ID in the teammateAssignedTo field
      isFinished: false, // Only fetch tasks that are not finished yet
    })
      .populate("companyId", "companyName") // Populate company name
      .populate("teammateAssignedTo", "name email"); // Populate teammate's details (name and email)

    console.log("Fetched Tasks:", tasksAssignedToTeammate); // Log the fetched tasks for debugging

    if (tasksAssignedToTeammate.length === 0) {
      return res.status(404).json({ message: "No tasks assigned to you." });
    }

    // Map through tasks to include preview details and ensure task status is correctly returned
    const formattedTasks = tasksAssignedToTeammate.map((task) => ({
      _id: task._id,
      taskName: task.taskName,
      companyId: task.companyId,
      preview: task.preview, // Include the preview field
      remainingPreviews: task.remainingPreviews, // Include the virtual remainingPreviews field
      assignedAt: task.assignedAt,
      teammateAssignedTo: task.teammateAssignedTo, // Include teammate assigned field
      isStarted: task.isStarted,
      isFinished: task.isFinished,
      assignedPreviews: task.assignedPreviews.map((preview) => ({
        userId: preview.userId,
        name: preview.userId?.name,
        email: preview.userId?.email,
        completedCount: preview.completedCount,
        pendingCount: preview.pendingCount,
      })),
    }));

    res.status(200).json({ tasksAssignedToTeammate: formattedTasks });
  } catch (error) {
    console.error("Error fetching tasks assigned to teammate:", error.message);
    res
      .status(500)
      .json({ error: "Failed to fetch tasks assigned to teammate." });
  }
});

router.post("/tasks/split/:taskId", authenticate, async (req, res) => {
  const { splits } = req.body;
  const teamLeaderId = req.userId;
  const taskId = req.params.taskId;

  try {
    const task = await TaskAssignment.findById(taskId);

    if (!task) return res.status(404).json({ message: "Task not found" });

    if (String(task.teamLeaderId) !== String(teamLeaderId)) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    for (const split of splits) {
      const assignmentData = {
        companyId: task.companyId,
        taskName: task.taskName,
        preview: task.preview > 0 ? split.count : 0,
        teamLeaderId: task.teamLeaderId,
        assignedBy: teamLeaderId, // Team Leader ID
        teammateAssignedTo: split.userId,
        clientCoordinatorId: task.clientCoordinatorId, // Retain original Client Coordinator ID
        assignedAt: new Date(),
      };

      // Create task assignment log
      const newTask = await TaskAssignmentLog.create(assignmentData);

      // Create a notification for the teammate
      await Notification.create({
        userId: split.userId, // Notification sent to the teammate
        message: `You have been assigned a new task: "${task.taskName}" with ${split.count} previews.`,
        type: "task",
        createdAt: new Date(),
        read: false,
      });

      console.log(`Notification sent to teammate: ${split.userId}`);
    }

    res.status(200).json({
      message: "Task split, assigned, and notifications sent successfully.",
    });
  } catch (error) {
    console.error("Error splitting task:", error.message);
    res.status(500).json({ message: "Error splitting task." });
  }
});

router.post("/tasks/start/:taskId", authenticate, async (req, res) => {
  const { taskId } = req.params;
  const userId = req.userId; // Get logged-in user's ID

  try {
    const task = await TaskAssignmentLog.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Check if the current user is assigned to the task or the team leader
    const isAssignedToTask =
      task.teammateAssignedTo &&
      String(task.teammateAssignedTo) === String(userId); // assuming `assignedTo` contains the assigned user's ID
    const isTeamLeader = String(task.createdBy) === String(userId); // Assuming `createdBy` is the team leader

    if (!isAssignedToTask && !isTeamLeader) {
      return res
        .status(403)
        .json({ message: "Unauthorized to start this task" });
    }

    // Mark the task as started
    task.startTime = new Date(); // Add finish time
    task.isStarted = true;
    await task.save();

    res.status(200).json({ message: "Task started successfully", task });
  } catch (error) {
    console.error("Error starting task:", error.message);
    res.status(500).json({ message: "Error starting task." });
  }
});

router.post("/tasks/finish/:taskId", authenticate, async (req, res) => {
  try {
    const { taskId } = req.params;
    const { completedCount } = req.body;
    const userId = req.userId;

    const task = await TaskAssignmentLog.findById(taskId);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (completedCount > task.preview - task.completedPreviews) {
      return res.status(400).json({
        message: "Completed count exceeds remaining previews",
      });
    }

    // Update completed and pending previews
    task.completedPreviews = (task.completedPreviews || 0) + completedCount;
    task.remainingPreviews = task.preview - task.completedPreviews; // Update remaining previews

    // Add log for the completion
    const completionLog = {
      userId,
      completedCount,
      timestamp: new Date(),
    };
    task.completionLogs.push(completionLog);

    // Check if task is fully completed
    if (task.completedPreviews >= task.preview) {
      task.isFinished = true;
      task.finishTime = new Date();
    }

    // Save the task
    await task.save();

    res.status(200).json({ message: "Task updated successfully", task });
  } catch (error) {
    console.error("Error updating task:", error.message);
    res.status(500).json({ message: "Failed to update task" });
  }
});

router.get("/tasks-for-leader", authenticate, async (req, res) => {
  try {
    const teamLeaderId = req.userId;

    // Fetch tasks that are either:
    // - Finished and sent to the team leader but not yet responded to
    // - Rejected and sent back to the teammate
    const tasksForLeader = await TaskAssignmentLog.find({
      teamLeaderId: teamLeaderId,
      isFinished: true, // Task is finished by the teammate
      sentToTeamLeader: { $in: [true, false] }, // Task can be sent to the team leader or rejected
      $or: [
        { responseStatus: null }, // Task hasn't been responded to yet
        { responseStatus: "rejected" }, // Task was rejected by the team leader
      ],
    })
      .populate("companyId", "companyName")
      .populate("teammateAssignedTo", "fname")
      .populate("assignedBy", "fname");

    res.status(200).json({ tasksForLeader });
  } catch (error) {
    console.error("Error fetching tasks for team leader:", error.message);
    res.status(500).json({ message: "Failed to fetch tasks for team leader." });
  }
});

// POST /api/accept-task/:taskId
router.post("/accept-task/:taskId", authenticate, async (req, res) => {
  try {
    const taskId = req.params.taskId;
    const task = await TaskAssignmentLog.findById(taskId);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Mark the task as accepted by the team leader
    task.responseStatus = "accepted";
    task.responseTime = new Date();
    task.teamLeaderResponse = req.userId;

    // Set flag to indicate the task is now visible to the client coordinator
    task.sentToClientCoordinator = true;

    await task.save();

    res.status(200).json({ message: "Task accepted successfully", task });
  } catch (error) {
    console.error("Error accepting task:", error.message);
    res.status(500).json({ message: "Failed to accept task" });
  }
});

router.post("/reject-task/:taskId", authenticate, async (req, res) => {
  try {
    const taskId = req.params.taskId;
    const task = await TaskAssignmentLog.findById(taskId);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Reset the task for the teammate and store rejection time
    task.responseStatus = "rejected";
    task.isFinished = false; // Task should be marked as not finished
    task.sentToTeamLeader = false; // Mark task as sent back to the teammate
    task.responseTime = new Date(); // Store the time of rejection
    task.rejectCount += 1; // Increment the rejection count if you are tracking rejections

    await task.save();

    // Debugging - Check if the task updates were successful
    console.log("Task after rejection: ", task);

    res
      .status(200)
      .json({ message: "Task rejected and sent back to teammate", task });
  } catch (error) {
    console.error("Error rejecting task:", error.message);
    res.status(500).json({ message: "Failed to reject task" });
  }
});

//client coordinator see accepted task

router.get("/tasks-for-client-coordinator", authenticate, async (req, res) => {
  try {
    const clientCoordinatorId = req.userId;

    const tasksForClientCoordinator = await TaskAssignmentLog.find({
      clientCoordinatorId: clientCoordinatorId, // Use the original client coordinator ID
      responseStatus: "accepted",
    })
      .populate("companyId", "companyName")
      .populate("teammateAssignedTo", "fname lname")
      .populate("teamLeaderId", "fname lname");

    res.status(200).json({ tasksForClientCoordinator });
  } catch (error) {
    console.error("Error fetching tasks:", error.message);
    res.status(500).json({ message: "Failed to fetch tasks" });
  }
});

router.post(
  "/client-coordinator-accept-task/:taskId",
  authenticate,
  async (req, res) => {
    try {
      const taskId = req.params.taskId;
      const task = await TaskAssignmentLog.findById(taskId);

      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }

      // Update the task status and mark it as completed
      task.status = "completed"; // Set task status as completed
      task.isFinished = true; // Optional: if you have a separate flag for finished tasks
      task.doneBy = req.userId; // Store the user ID of the person who accepted the task
      task.doneAt = new Date(); // Store the time when it was accepted

      await task.save(); // Save the updated task record

      res
        .status(200)
        .json({ message: "Task accepted by Client Coordinator", task });
    } catch (error) {
      console.error(
        "Error accepting task by Client Coordinator:",
        error.message
      );
      res.status(500).json({ message: "Failed to accept task" });
    }
  }
);

router.post(
  "/client-coordinator-reject-task/:taskId",
  authenticate,
  async (req, res) => {
    try {
      const taskId = req.params.taskId;
      const task = await TaskAssignmentLog.findById(taskId);

      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }

      // Update task to reflect rejection
      task.responseStatus = "rejected";
      task.sentToClientCoordinator = false;
      task.sentToTeamLeader = true; // Send back to the team leader
      task.rejectionTime = new Date();

      await task.save();

      res.status(200).json({
        message: "Task rejected and sent back to Team Leader",
        task,
      });
    } catch (error) {
      console.error(
        "Error rejecting task by Client Coordinator:",
        error.message
      );
      res.status(500).json({ message: "Failed to reject task" });
    }
  }
);

router.get("/admin/task-assignments", async (req, res) => {
  try {
    const { username, companyName, fromDate, toDate } = req.query;

    const matchStage = {};

    // Apply filters for company name
    if (companyName) {
      matchStage["company.companyName"] = new RegExp(companyName, "i");
    }

    // Apply filters for username
    if (username) {
      const regex = new RegExp(username, "i");
      matchStage.$or = [
        { "teamLeader.fname": { $regex: regex } },
        { "teammateAssignedTo.fname": { $regex: regex } },
        { "assignedBy.fname": { $regex: regex } },
        { "doneBy.fname": { $regex: regex } },
      ];
    }

    // Apply date range filters
    if (fromDate || toDate) {
      matchStage.assignedAt = {};
      if (fromDate) matchStage.assignedAt.$gte = new Date(fromDate);
      if (toDate) matchStage.assignedAt.$lte = new Date(toDate);
    }

    console.log("Filters being applied:", matchStage);

    const tasks = await TaskAssignmentLog.aggregate([
      // Join with Company collection
      {
        $lookup: {
          from: "companies",
          localField: "companyId",
          foreignField: "_id",
          as: "company",
        },
      },
      { $unwind: { path: "$company", preserveNullAndEmptyArrays: true } },

      // Join with User collection for teamLeaderId
      {
        $lookup: {
          from: "users",
          localField: "teamLeaderId",
          foreignField: "_id",
          as: "teamLeader",
        },
      },
      { $unwind: { path: "$teamLeader", preserveNullAndEmptyArrays: true } },

      // Join with User collection for teammateAssignedTo
      {
        $lookup: {
          from: "users",
          localField: "teammateAssignedTo",
          foreignField: "_id",
          as: "teammateAssignedTo",
        },
      },
      {
        $unwind: {
          path: "$teammateAssignedTo",
          preserveNullAndEmptyArrays: true,
        },
      },

      // Join with User collection for assignedBy
      {
        $lookup: {
          from: "users",
          localField: "assignedBy",
          foreignField: "_id",
          as: "assignedBy",
        },
      },
      { $unwind: { path: "$assignedBy", preserveNullAndEmptyArrays: true } },

      // Join with User collection for doneBy
      {
        $lookup: {
          from: "users",
          localField: "doneBy",
          foreignField: "_id",
          as: "doneBy",
        },
      },
      { $unwind: { path: "$doneBy", preserveNullAndEmptyArrays: true } },

      {
        // Join users to populate user details for completionLogs
        $lookup: {
          from: "users",
          localField: "completionLogs.userId",
          foreignField: "_id",
          as: "completionLogUsers",
        },
      },
      {
        $addFields: {
          completionLogs: {
            $map: {
              input: { $ifNull: ["$completionLogs", []] },
              as: "log",
              in: {
                userName: {
                  $let: {
                    vars: {
                      user: {
                        $arrayElemAt: [
                          {
                            $filter: {
                              input: "$completionLogUsers",
                              as: "user",
                              cond: { $eq: ["$$user._id", "$$log.userId"] },
                            },
                          },
                          0,
                        ],
                      },
                    },
                    in: { $ifNull: ["$$user.fname", "N/A"] },
                  },
                },
                completedCount: { $ifNull: ["$$log.completedCount", 0] },
                timestamp: { $ifNull: ["$$log.timestamp", null] },
              },
            },
          },
        },
      },

      // Apply filters
      { $match: matchStage },

      // Project final output
      {
        $project: {
          _id: 1,
          taskName: 1,
          preview: 1,
          completedPreviews: 1,
          remainingPreviews: 1,
          assignedAt: 1,
          startTime: 1,
          finishTime: 1,
          isStarted: 1,
          isFinished: 1,
          status: 1,
          responseStatus: 1,
          responseTime: 1,
          rejectCount: 1,
          doneAt: 1,
          companyName: "$company.companyName",
          teamLeaderName: "$teamLeader.fname",
          teammateAssignedToName: "$teammateAssignedTo.fname",
          assignedByName: "$assignedBy.fname",
          doneByName: "$doneBy.fname",
          completionLogs: 1,
        },
      },
    ]);

    res.json(tasks);
  } catch (error) {
    console.error("Error fetching task assignments:", error);
    res.status(500).json({
      message: "Error fetching task assignments",
      error: error.message,
    });
  }
});

module.exports = router;
