import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./SideBar.js";
import "./AdminAllUserNotes.css";

const AdminAllUserNotes = () => {
  const [notes, setNotes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllNotes = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/all-notes", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (res.ok) {
          const data = await res.json();
          setNotes(data.notes);
        } else {
          const error = await res.json();
          console.error("Error fetching all user notes:", error);
        }
      } catch (error) {
        console.error("Error fetching all user notes:", error);
      }
    };

    fetchAllNotes();
  }, []);

  return (
    <div className="page-container">
      <Sidebar />
      <div className="content-container">
        <h2>All User Notes</h2>
        <div className="notes-list">
          {notes.length === 0 ? (
            <p>No notes available.</p>
          ) : (
            notes.map((note) => (
              <div key={note._id} className="note-item">
                <p>
                  <strong>Username: </strong>
                  {note.owner.email}
                </p>
                <p>
                  <strong>Title:</strong> {note.title}
                </p>
                <p>
                  <strong>Content:</strong> {note.content}
                </p>
                <small>{new Date(note.dateCreated).toLocaleString()}</small>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminAllUserNotes;
