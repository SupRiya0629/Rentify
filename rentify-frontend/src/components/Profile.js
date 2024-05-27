import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./Profile.css";

function Profile() {
  const [userData, setUserData] = useState({});
  const [userSkills, setUserSkills] = useState([]);
  const userId = localStorage.getItem("user_id");
  const [editMode, setEditMode] = useState(false);
  const [newSkillRows, setNewSkillRows] = useState([]);
  const [changesMade, setChangesMade] = useState(false);

  useEffect(() => {
    // Fetch user details
    axios
      .get(`http://localhost:8000/api/profile/${userId}/`)
      .then((response) => {
        const { user_details, user_skills } = response.data;
        setUserData(user_details);
        setUserSkills(user_skills || []); // Ensure userSkills is initialized as an array, even if null or undefined
      })
      .catch((error) => {
        console.error("Error fetching user details:", error);
      });
  }, [userId]);

  const toggleEditMode = () => {
    setEditMode(!editMode);
  };

  const saveChanges = () => {
    if (changesMade) {
      axios
        .post("http://localhost:8000/api/edit_user/", {
          user_details: userData,
          user_skills: userSkills.concat(newSkillRows),
        })
        .then((response) => {
          console.log(response.data);
          alert(response.data.message);
          window.location.reload();
          // Optionally, you can handle success response here
        })
        .catch((error) => {
          console.error("Error saving profile changes:", error);
          // Optionally, you can handle error response here
        })
        .finally(() => {
          setEditMode(false);
        });
    } else {
      setEditMode(false);
    }
  };

  const handleNewSkillChange = (e, index) => {
    const { name, value } = e.target;
    const updatedRows = [...newSkillRows];
    updatedRows[index][name] = value;
    updatedRows[index]["user_management"] = parseInt(
      localStorage.getItem("user_id")
    );
    // Check if the skill_id exists in userSkills
    const skillId = updatedRows[index].skill_id;
    const existingSkillIndex = userSkills.findIndex(
      (skill) => skill.skill_id === skillId
    );

    if (existingSkillIndex !== -1) {
      // Update existing row in userSkills
      const updatedUserSkills = [...userSkills];
      updatedUserSkills[existingSkillIndex] = {
        ...updatedUserSkills[existingSkillIndex],
        [name]: value,
      };
      setUserSkills(updatedUserSkills);
    }

    setNewSkillRows(updatedRows);
    setChangesMade(true);
  };
  const cancelEdit = () => {
    setEditMode(false);
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
    setChangesMade(true);
  };
  const addNewSkillRow = () => {
    setNewSkillRows([
      ...newSkillRows,
      {
        skill_category: "",
        job_details: "",
        has_work_experience: "",
        workplace: "",
        position: "",
        duration: "",
      },
    ]);
  };
  const removeSkillRow = (index) => {
    const updatedRows = [...newSkillRows];
    updatedRows.splice(index, 1);
    setNewSkillRows(updatedRows);
    setChangesMade(true);
  };
  return (
    <div className="editUser">
      {!editMode && (
        <button className="edit-button" onClick={toggleEditMode}>
          Edit
        </button>
      )}
      {editMode && (
        <button className="edit-button" onClick={cancelEdit}>
          Cancel
        </button>
      )}
      <button
        className="edit-mode-button"
        style={{ display: editMode ? "inline-block" : "none" }}
        onClick={saveChanges}
      >
        Save
      </button>

      <div className="user-details">
        <ul>
          <li>
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={userData.name}
              onChange={handleInputChange}
              className={`user-input ${editMode ? "" : "no-border"}`}
              disabled={!editMode}
            />
          </li>
          <li>
            <label htmlFor="gender">Gender:</label>
            <input
              type="text"
              id="gender"
              name="gender"
              value={userData.gender}
              onChange={handleInputChange}
              className={`user-input ${editMode ? "" : "no-border"}`}
              disabled={!editMode}
            />
          </li>
          <li>
            <label htmlFor="phone">Phone:</label>
            <input
              type="text"
              id="phone"
              name="phone"
              value={userData.phone}
              onChange={handleInputChange}
              className={`user-input ${editMode ? "" : "no-border"}`}
              disabled={!editMode}
            />
          </li>
          <li>
            <label htmlFor="email">Email:</label>
            <input
              type="text"
              id="email"
              name="email"
              value={userData.email}
              onChange={handleInputChange}
              className={`user-input ${editMode ? "" : "no-border"}`}
              disabled={!editMode}
            />
          </li>
          <li>
            <label htmlFor="address">Address:</label>
            <input
              type="text"
              id="address"
              name="address"
              value={userData.address}
              onChange={handleInputChange}
              className={`user-input ${editMode ? "" : "no-border"}`}
              disabled={!editMode}
            />
          </li>
        </ul>
      </div>
      <div className="user-skills">
        <h2>User Skills</h2>
        <table>
          <thead>
            <tr>
              <th>Skill Category</th>
              <th>Job Details</th>
              <th>Work Experience</th>
              <th>Workplace</th>
              <th>Position</th>
              <th>Duration</th>
            </tr>
          </thead>
          <tbody>
            {userSkills.map((skill, index) => (
              <tr key={index}>
                <td>{skill.skill_category}</td>
                <td>{skill.job_details}</td>
                <td>{skill.has_work_experience}</td>
                <td>{skill.workplace}</td>
                <td>{skill.position}</td>
                <td>{skill.duration}</td>
              </tr>
            ))}
            {newSkillRows.map((row, index) => (
              <tr key={index}>
                <td>
                  <input
                    type="text"
                    name="skill_category"
                    value={row.skill_category}
                    onChange={(e) => handleNewSkillChange(e, index)}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    name="job_details"
                    value={row.job_details}
                    onChange={(e) => handleNewSkillChange(e, index)}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    name="has_work_experience"
                    value={row.has_work_experience}
                    onChange={(e) => handleNewSkillChange(e, index)}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    name="workplace"
                    value={row.workplace}
                    onChange={(e) => handleNewSkillChange(e, index)}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    name="position"
                    value={row.position}
                    onChange={(e) => handleNewSkillChange(e, index)}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    name="duration"
                    value={row.duration}
                    onChange={(e) => handleNewSkillChange(e, index)}
                  />
                </td>
                <td>
                  <button onClick={() => removeSkillRow(index)}>Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button
          className="add-skill-button"
          style={{ display: editMode ? "inline-block" : "none" }}
          onClick={addNewSkillRow}
        >
          Add New Skill
        </button>
      </div>
    </div>
  );
}

export default Profile;
