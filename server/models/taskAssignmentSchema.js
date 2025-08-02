const mongoose = require("mongoose");

const taskAssignmentSchema = new mongoose.Schema({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
    required: true,
  },
  taskName: {
    type: String,
    required: true,
  },
  preview: {
    type: String,
  },
  teamLeaderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Assuming User model is used for team leaders
    required: true,
  },
  assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Client Coordinator ID
  clientCoordinatorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Add this field
  assignedAt: {
    type: Date,
    default: Date.now,
  },
});

const TaskAssignment = mongoose.model("TaskAssignment", taskAssignmentSchema);
module.exports = TaskAssignment;
