import React, { useState } from "react";
import "./AddNoteForm.css";
import { useNavigate } from "react-router-dom";

const AddNoteForm = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [titleError, setTitleError] = useState("");
  const [contentError, setContentError] = useState("");
  const navigate = useNavigate();

  const addNoteHandler = async (e) => {
    e.preventDefault();

    setTitleError("");
    setContentError("");

    if (!title.trim()) {
      setTitleError("Please enter the title of your note.");
      return;
    }
    if (!content.trim()) {
      setContentError("Please enter your content of your note.");
      return;
    }

    try {
      const token = localStorage.getItem("usersdatatoken");
      console.log("Title:", title);
      console.log("Content:", content);

      const response = await fetch("http://localhost:5000/api/addnotes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Format the token correctly
        },
        body: JSON.stringify({ title, content }), // Send `content` instead of `notes`
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      if (data.status === 201) {
        // Reset form fields after successful submission
        document.getElementById("note-form").reset(); // Reset form directly

        setTitle("");
        setContent("");
        alert("Note added successfully!");
        navigate("/userdash");
      } else {
        alert("Failed to add note.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while adding the note.");
    }
  };

  return (
    <div className="form-container">
      <form id="note-form" className="note-form" onSubmit={addNoteHandler}>
        <h2>Add a New Note</h2>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter note title"
          />
          {titleError && <span className="error">{titleError}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="content">Note</label>
          <textarea
            id="content"
            name="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Enter your note"
          ></textarea>
          {contentError && <span className="error">{contentError}</span>}
        </div>
        <button type="submit" className="save-button">
          Save Note
        </button>
      </form>
    </div>
  );
};

export default AddNoteForm;
