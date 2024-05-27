import React, { useState } from "react";
import "./EditUser.css";

const EditUser = () => {
  const [editMode, setEditMode] = useState(false);
  const [newSkillRow, setNewSkillRow] = useState({
    skillCategory: "",
    jobDetails: "",
    workExperience: "",
    workplace: "",
    position: "",
    duration: "",
  });
  const [changesMade, setChangesMade] = useState(false);

  const toggleEditMode = () => {
    setEditMode(!editMode);
  };

  const saveChanges = () => {
    if (changesMade) {
      // Make API call only if changes are made
      // Call API here
      setEditMode(false);
    } else {
      // No changes made, do nothing or show a message to the user
      // For now, just exit edit mode
      setEditMode(false);
    }
  };

  const handleNewSkillChange = (e) => {
    const { name, value } = e.target;
    setNewSkillRow({ ...newSkillRow, [name]: value });
    setChangesMade(true); // Indicate that changes are made
  };

  const addNewSkillRow = () => {
    // Toggle visibility of the last row
    setEditMode(!editMode);
  };

  return (
    <div className="editUser">
      <button className="edit-button" onClick={toggleEditMode}>
        Edit
      </button>
      <button
        className="edit-mode-button"
        style={{ display: editMode ? "inline-block" : "none" }}
        onClick={saveChanges}
      >
        Save
      </button>

      <div className="user-details">
        <h2>User Details</h2>
        <ul>
          <li>
            <strong>Name</strong>
            <strong className="colon">:</strong>
            <span className="editable">Santosh</span>
          </li>
          <li>
            <strong>Gender</strong>
            <strong className="colon">:</strong>
            <span className="editable">Male</span>
          </li>
          <li>
            <strong>Phone</strong>
            <strong className="colon">:</strong>
            <span className="editable">+91 6300 670 112</span>
          </li>
          <li>
            <strong>Email</strong>
            <strong className="colon">:</strong>
            <span className="editable">n180603@rguktn.ac.in</span>
          </li>
          <li>
            <strong>Address</strong>
            <strong className="colon">:</strong>
            <span className="editable">Palangi, Undrajavaram</span>
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
            <tr>
              <td>Web Development</td>
              <td>Frontend Developer</td>
              <td>Yes</td>
              <td>ABC Inc.</td>
              <td>Senior Developer</td>
              <td>3 years</td>
            </tr>
            <tr>
              <td>Data Analysis</td>
              <td>Data Scientist</td>
              <td>No</td>
              <td>XYZ Corp.</td>
              <td>Data Analyst</td>
              <td>2 years</td>
            </tr>
            {editMode && (
              <tr>
                <td>
                  <input
                    type="text"
                    name="skillCategory"
                    value={newSkillRow.skillCategory}
                    onChange={handleNewSkillChange}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    name="jobDetails"
                    value={newSkillRow.jobDetails}
                    onChange={handleNewSkillChange}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    name="workExperience"
                    value={newSkillRow.workExperience}
                    onChange={handleNewSkillChange}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    name="workplace"
                    value={newSkillRow.workplace}
                    onChange={handleNewSkillChange}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    name="position"
                    value={newSkillRow.position}
                    onChange={handleNewSkillChange}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    name="duration"
                    value={newSkillRow.duration}
                    onChange={handleNewSkillChange}
                  />
                </td>
              </tr>
            )}
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
};

export default EditUser;
