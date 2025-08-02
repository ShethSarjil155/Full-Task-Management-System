// const mongoose = require("mongoose");

// const taskSchema = new mongoose.Schema({
//   userId: { type: mongoose.Schema.Types.String, ref: "User", required: true },
//   taskName: { type: String, required: true },
//   startTime: { type: Date, required: true },
//   endTime: { type: Date, required: true },
//   duration: { type: Number, required: true }, // duration in milliseconds
//   completed: { type: Boolean, default: false },
// });

// const mongoose = require("mongoose");

// const taskSchema = new mongoose.Schema({
//   taskName: { type: String, required: true },
//   startTime: { type: Date, required: true },
//   endTime: { type: Date, required: true },

//   createdBy: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",
//     required: true,
//   },
//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",
//     required: true, // Use this as an additional reference if needed
//   },
//   status: {
//     type: String,
//     enum: ["Pending", "Completed", "SentToLeader", "InProgress"],
//     default: "Pending",
//   },
// });

// const Task = mongoose.model("Task", taskSchema);

// module.exports = Task;

const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  taskName: { type: String, required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  remainingTime: { type: Number, default: 0 }, // New field for remaining time
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  status: {
    type: String,
    enum: [
      "Pending",
      "Completed",
      "SentToLeader",
      "SentToAdmin",
      "DoneByLeader",
      "DoneByAdmin",
    ],
    default: "Pending",
  },
  teamLeaderStatus: {
    type: String,
    enum: ["Pending", "Approved", "Rejected"],
    default: "Pending", // Status of the task as seen by the team leader
  },
  adminStatus: {
    type: String,
    enum: ["Pending", "Approved"],
    default: "Pending", // Status of the task as seen by the admin
  },
});

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
