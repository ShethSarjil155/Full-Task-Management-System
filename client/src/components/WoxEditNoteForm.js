import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./EditNoteForm.css";

const EditNoteForm = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [titleError, setTitleError] = useState("");
  const [contentError, setcontentError] = useState("");
  const [selectedIndex, setSelectedIndex] = useState("");
  const navigate = useNavigate();

  const { id } = useParams("");

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const token = localStorage.getItem("usersdatatoken");
        const response = await fetch(
          `http://localhost:5000/api/getnotes/${id}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setTitle(data.title);
        setContent(data.content);
      } catch (error) {
        console.error("Error fetching note:", error);
      }
    };

    fetchNote();
  }, [id]);

  const updateDataHandler = async (e) => {
    e.preventDefault();

    let submit = false;

    if (selectedIndex === "") {
      if (title === "") {
        submit = false;
        setTitleError("Enter Title");
      } else {
        submit = true;
        setTitleError("");
      }
      if (content === "") {
        submit = false;
        setcontentError("Enter Note");
      } else {
        submit = true;
        setcontentError("");
      }
    }

    if (submit) {
      try {
        const token = localStorage.getItem("usersdatatoken");
        const response = await fetch(
          `http://localhost:5000/api/updatenotes/${id}`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              title,
              content,
            }),
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        alert("Note updated successfully!");
        navigate("/wox-dashboard");
      } catch (error) {
        console.error("Error updating note:", error);
        alert("Failed to update note.");
      }
    }
  };

  return (
    <div className="edit-form-container">
      <form className="edit-note-form" onSubmit={updateDataHandler}>
        <h2>Edit Note</h2>
        <div className="edit-form-group">
          <label htmlFor="edit-title">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter note title"
          />
          {titleError && <span className="edit-error">{titleError}</span>}
        </div>
        <div className="edit-form-group">
          <label htmlFor="content">Note</label>
          <textarea
            id="content"
            name="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Enter your note"
          ></textarea>
          {contentError && <span className="edit-error">{contentError}</span>}
        </div>
        <button type="submit" className="edit-save-button">
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditNoteForm;
