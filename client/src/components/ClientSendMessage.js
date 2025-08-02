// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import "./ClientSendMessageForm.css";

// const SendMessageFormClient = () => {
//   const [leaders, setLeaders] = useState([]);
//   const [userId, setUserId] = useState("");
//   const [message, setMessage] = useState("");
//   const [file, setFile] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchLeaders = async () => {
//       try {
//         const response = await fetch("http://localhost:5000/api/team-leaders");
//         const data = await response.json();
//         setLeaders(data);
//       } catch (error) {
//         console.error("Error fetching leaders:", error);
//       }
//     };

//     fetchLeaders();
//   }, []);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const formData = new FormData();
//     formData.append("userId", userId);
//     formData.append("message", message);
//     if (file) {
//       formData.append("file", file);
//     }

//     try {
//       const response = await fetch("http://localhost:5000/api/send-message", {
//         method: "POST",
//         body: formData,
//       });

//       if (!response.ok) {
//         throw new Error("Failed to send message");
//       }

//       alert("Message sent successfully");
//       navigate("/clientusers");
//     } catch (error) {
//       console.error("Error sending message:", error.message);
//     }
//   };

//   return (
//     <div className="sendmessageform">
//       <form onSubmit={handleSubmit} className="send-message-form">
//         <div className="form-group">
//           <label>User Email:</label>
//           <select
//             value={userId}
//             onChange={(e) => setUserId(e.target.value)}
//             className="form-control"
//           >
//             <option value="">Select a team leader</option>
//             {leaders.map((leader) => (
//               <option key={leader._id} value={leader._id}>
//                 {leader.email}
//               </option>
//             ))}
//           </select>
//         </div>
//         <div className="form-group">
//           <label>Message:</label>
//           <textarea
//             value={message}
//             onChange={(e) => setMessage(e.target.value)}
//             className="form-control"
//           ></textarea>
//         </div>
//         <div className="form-group input-file-clientside">
//           <label>File:</label>
//           <input
//             type="file"
//             onChange={(e) => setFile(e.target.files[0])}
//             className="form-control-file"
//           />
//         </div>
//         <button type="submit" className="btn btn-primary sendddd">
//           Send Message
//         </button>
//       </form>
//     </div>
//   );
// };

// export default SendMessageFormClient;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminSendMessageForm.css";

const AdminSendMessageForm = () => {
  const [teams, setTeams] = useState([]);
  const [selectedTeams, setSelectedTeams] = useState([]);
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/team-leaders");
        const data = await response.json();
        setTeams(data);
      } catch (error) {
        console.error("Error fetching teams:", error);
      }
    };

    fetchTeams();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("message", message);
    selectedTeams.forEach((teamId) => {
      formData.append("teamIds[]", teamId);
    });
    Array.from(files).forEach((file) => {
      formData.append("files[]", file);
    });

    try {
      const response = await fetch(
        "http://localhost:5000/api/admin-send-message",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      alert("Message sent successfully");
      navigate("/clientusers");
    } catch (error) {
      console.error("Error sending message:", error.message);
    }
  };

  const handleTeamSelection = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions).map(
      (option) => option.value
    );
    setSelectedTeams(selectedOptions);
  };

  const handleFileChange = (e) => {
    setFiles(e.target.files);
  };

  return (
    <div className="tlsendmessageform">
      <form onSubmit={handleSubmit} className="tlsend-message-form">
        <div className="tlform-group">
          <label>Team Names:</label>
          <select
            multiple
            value={selectedTeams}
            onChange={handleTeamSelection}
            className="tlform-control"
          >
            {teams.map((team) => (
              <option key={team._id} value={team._id}>
                {team.team} {/* Assuming the API provides teamName */}
              </option>
            ))}
          </select>
        </div>
        <div className="tlform-group">
          <label>Message:</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="tlform-control"
          ></textarea>
        </div>
        <div className="tlform-group input-file-adminside">
          <label>Files:</label>
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            className="tlform-control-file"
          />
        </div>
        <button type="submit" className="btn btn-primary tlsendddd">
          Send Message
        </button>
      </form>
    </div>
  );
};

export default AdminSendMessageForm;
