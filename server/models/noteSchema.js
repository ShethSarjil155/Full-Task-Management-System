// const mongoose = require("mongoose");

// const noteSchema = new mongoose.Schema({
//   title: {
//     type: String,
//     required: true,
//   },
//   notes: {
//     type: String,
//     required: true,
//   },
//   dataCreated: {
//     type: Date,
//     default: Date.now,
//   },
// });

// const notesdb = new mongoose.model("notess", noteSchema);

// module.exports = notesdb;

// models/notes.js
// const mongoose = require("mongoose");

// const noteSchema = new mongoose.Schema({
//   title: {
//     type: String,
//     required: true,
//   },
//   notes: {
//     type: String,
//     required: true,
//   },
//   dateCreated: {
//     type: Date,
//     default: Date.now,
//   },
//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "userdb",
//     required: true,
//   },
// });

// const Note = mongoose.model("notes", noteSchema);

// module.exports = Note;

const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    dateCreated: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Note = mongoose.model("notes", noteSchema);

module.exports = Note;
