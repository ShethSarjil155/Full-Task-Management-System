// const mongoose = require("mongoose");

// const taskAssignmentLogSchema = new mongoose.Schema({
//   companyId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Company",
//     required: true,
//   },
//   taskName: {
//     type: String,
//     required: true,
//   },
//   teamLeaderId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",
//     required: true,
//   },
//   assignedBy: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User", // Client coordinator
//     required: true,
//   },
//   assignedAt: {
//     type: Date,
//     default: Date.now,
//   },
// });

// const TaskAssignmentLog = mongoose.model(
//   "TaskAssignmentLog",
//   taskAssignmentLogSchema
// );
// module.exports = TaskAssignmentLog;

// const mongoose = require("mongoose");

// const taskAssignmentLogSchema = new mongoose.Schema({
//   companyId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Company",
//     required: true,
//   },
//   taskName: {
//     type: String,
//     required: true,
//   },
//   preview: {
//     type: String,
//   },
//   teamLeaderId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",
//     required: true,
//   },
//   assignedTo: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User", // The teammate to whom the task is assigned
//     required: true,
//   },
//   assignedBy: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User", // Client coordinator
//     required: true,
//   },
//   assignedAt: {
//     type: Date,
//     default: Date.now,
//   },
// });

// const TaskAssignmentLog = mongoose.model(
//   "TaskAssignmentLog",
//   taskAssignmentLogSchema
// );
// module.exports = TaskAssignmentLog;

// const mongoose = require("mongoose");

// const taskAssignmentLogSchema = new mongoose.Schema({
//   companyId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Company",
//     required: true,
//   },
//   taskName: {
//     type: String,
//     required: true,
//   },
//   preview: {
//     type: String,
//     required: false,
//   },
//   teamLeaderId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",
//     required: true,
//   },
//   assignedTo: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User", // The teammate to whom the task is initially assigned
//     required: false, // Change required to false initially
//   },
//   teammateAssignedTo: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User", // Teammate assigned by the team leader
//     required: false, // This will be used for team leader assignments
//   },
//   assignedBy: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User", // Client coordinator
//     required: true,
//   },
//   assignedAt: {
//     type: Date,
//     default: Date.now,
//   },
//   startTime: {
//     type: Date,
//     required: false,
//   },
//   finishTime: {
//     type: Date,
//     required: false,
//   },
//   status: {
//     type: String,
//     enum: ["in-progress", "completed"],
//     default: "in-progress",
//   },
//   sentToTeamLeader: {
//     type: Boolean,
//     default: false,
//   },
// });

// const TaskAssignmentLog = mongoose.model(
//   "TaskAssignmentLog",
//   taskAssignmentLogSchema
// );
// module.exports = TaskAssignmentLog;

// const mongoose = require("mongoose");

// const taskAssignmentSchema = new mongoose.Schema({
//   companyId: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
//   taskName: { type: String, required: true },
//   preview: { type: String },
//   teamLeaderId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//   assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//   teammateAssignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//   assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//   assignedAt: { type: Date, default: Date.now },
//   startTime: { type: Date },
//   finishTime: { type: Date },
//   isStarted: { type: Boolean, default: false },
//   isFinished: { type: Boolean, default: false },
//   status: { type: String, default: "pending" },
//   sentToTeamLeader: { type: Boolean, default: false },
//   // Include additional fields as necessary
// });

// const TaskAssignmentLog = mongoose.model(
//   "TaskAssignmentLog",
//   taskAssignmentSchema
// );
// module.exports = TaskAssignmentLog;

// const mongoose = require("mongoose");

// const taskAssignmentSchema = new mongoose.Schema({
//   companyId: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
//   taskName: { type: String, required: true },
//   preview: { type: String },
//   teamLeaderId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//   assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//   teammateAssignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//   assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//   assignedAt: { type: Date, default: Date.now },
//   startTime: { type: Date },
//   finishTime: { type: Date },
//   isStarted: { type: Boolean, default: false },
//   isFinished: { type: Boolean, default: false },
//   status: { type: String, default: "pending" },
//   sentToTeamLeader: { type: Boolean, default: false },
//   responseStatus: {
//     type: String,
//     enum: ["accepted", "rejected"],
//     default: null,
//   }, // New field for response
//   responseTime: { type: Date, default: null }, // Time when the response was given
//   teamLeaderResponse: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // ID of the team leader who responded
//   // Include additional fields as necessary
//   rejectCount: { type: Number, default: 0 }, // Track how many times the task has been rejected and resubmitted
//   doneBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // ID of the client coordinator who marked it as done
//   doneAt: { type: Date }, // Timestamp when the task was marked as done
// });

// const TaskAssignmentLog = mongoose.model(
//   "TaskAssignmentLog",
//   taskAssignmentSchema
// );

// module.exports = TaskAssignmentLog;

const mongoose = require("mongoose");
const taskAssignmentSchema = new mongoose.Schema({
  clientCoordinatorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Add this field
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
  taskName: { type: String, required: true },
  preview: { type: Number },
  completedPreviews: { type: Number, default: 0 },
  remainingPreviews: { type: Number, default: 0 },
  // pendingPreviews: { type: Number, default: 0 },
  teamLeaderId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  assignedAt: { type: Date, default: Date.now },
  startTime: { type: Date },
  finishTime: { type: Date },
  isStarted: { type: Boolean, default: false },
  isFinished: { type: Boolean, default: false },
  status: { type: String, default: "pending" },
  sentToTeamLeader: { type: Boolean, default: false },
  responseStatus: {
    type: String,
    enum: ["accepted", "rejected"],
    default: null,
  },
  responseTime: { type: Date, default: null },
  rejectCount: { type: Number, default: 0 },
  doneBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  doneAt: { type: Date },
  assignedPreviews: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      totalCount: { type: Number, required: true },
      completedCount: { type: Number, default: 0 },
      pendingCount: { type: Number, default: 0 },
      finishTime: { type: Date },
      status: { type: String, default: "pending" },
    },
  ],
  messages: [
    {
      sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      recipient: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      content: { type: String },
      timestamp: { type: Date, default: Date.now },
      read: { type: Boolean, default: false },
    },
  ],
  teammateAssignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // New field added here
  completionLogs: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      completedCount: Number,
      timestamp: Date,
    },
  ],
});

// Add virtual field for remaining previews
// taskAssignmentSchema.virtual("remainingPreviews").get(function () {
//   return this.preview - this.completedPreviews;
// });

// Ensure virtual fields are included when converting document to JSON
taskAssignmentSchema.set("toJSON", {
  virtuals: true,
});

const TaskAssignmentLog = mongoose.model(
  "TaskAssignmentLog",
  taskAssignmentSchema
);
module.exports = TaskAssignmentLog;
