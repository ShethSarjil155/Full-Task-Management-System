// // Assuming you have a mongoose instance set up
// const mongoose = require("mongoose");

// // Define Complaint Schema
// const requestSchema = new mongoose.Schema({
//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",
//     required: true,
//   },
//   subject: {
//     type: String,
//     required: true,
//   },
//   complaint: {
//     type: String,
//     required: true,
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
//   status: {
//     type: String,
//     default: "pending",
//   }, // New field for status
// });
// // Create and export the Complaint model
// const userRequest = mongoose.model("userRequest", requestSchema);
// module.exports = userRequest;

const mongoose = require("mongoose");

// Define Request Schema
const requestSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  complaint: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    default: "pending", // possible values: pending, approved by leader, rejected by leader, approved by admin, rejected by admin
  },
  leaderStatus: {
    type: String,
    default: "pending", // possible values: approved, rejected
  },
  leaderMessage: {
    type: String,
    default: "", // message from the leader
  },
  adminMessage: {
    type: String,
    default: "", // message from admin after final approval or rejection
  },
});

// Create and export the Request model
const userRequest = mongoose.model("userRequest", requestSchema);
module.exports = userRequest;
