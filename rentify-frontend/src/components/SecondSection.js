// src/components/SecondSection.js

import React, { useState } from "react";
import "./SecondSection.css";
import { sendDataToBackend } from "./backend";

const SecondSection = ({ formData, handleChange, prevStep, submitForm }) => {
  // Destructure values from formData
  const {
    skillCategory,
    jobDetails,
    hasWorkExperience,
    workplace,
    position,
    duration,
  } = formData;

  const [errorMessage, setErrorMessage] = useState(null);
  // Inside your functional component
  const handleSubmit = async () => {
    // Assuming formData contains the data you want to send
    const userManagementData = {
      username: formData.username,
      password: formData.password,
    };

    const userDetailsData = {
      name: formData.name,
      gender: formData.gender,
      phone: formData.phone,
      email: formData.email,
      address: formData.address,
      user_management: userManagementData,
    };

    const userSkillsData = {
      skill_category: skillCategory,
      job_details: jobDetails,
      has_work_experience: hasWorkExperience,
      workplace: hasWorkExperience === "Yes" ? workplace : null,
      position: hasWorkExperience === "Yes" ? position : null,
      duration: hasWorkExperience === "Yes" ? duration : null,
      user_management: userManagementData,
    };

    const formDataToSend = {
      userManagement: userManagementData,
      userDetails: userDetailsData,
      userSkills: userSkillsData,
    };

    try {
      const response = await fetch("http://localhost:8000/api/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formDataToSend),
      });

      if (response.ok) {
        // Success
        alert("Data sent successfully");
        // Show success message or redirect to login page
      } else {
        // Error
        const errorData = await response.json();
        console.error("Error during submission:", errorData);

        if (errorData.error) {
          // Extract and display the specific error message
          setErrorMessage(errorData.error);
        } else {
          // Display a generic error message
          setErrorMessage("Unknown error. Please try again.");
        }
      }
    } catch (error) {
      console.error("Error during submission:", error);
      setErrorMessage("Error during submission. Please try again.");
    }
  };

  // Function to render additional fields if the user has work experience
  const renderWorkExperienceFields = () => {
    if (hasWorkExperience === "Yes") {
      return (
        <>
          <label>
            Workplace:
            <input
              type="text"
              name="workplace"
              value={workplace}
              onChange={handleChange}
            />
          </label>
          <br />
          <label>
            Position:
            <input
              type="text"
              name="position"
              value={position}
              onChange={handleChange}
            />
          </label>
          <br />
          <label>
            Duration:
            <input
              type="text"
              name="duration"
              value={duration}
              onChange={handleChange}
            />
          </label>
          <br />
        </>
      );
    }
    return null;
  };

  return (
    <div className="registration-section">
      <h2>Skills & Work Experience</h2>
      <form>
        <label>
          Skill Category:
          <select
            name="skillCategory"
            value={skillCategory}
            onChange={handleChange}
          >
            <option value="">Select</option>
            <option value="remote">Remote</option>
            <option value="non-remote">Non-Remote</option>
          </select>
        </label>
        <br />
        <label>
          What are you looking for?
          <input
            type="text"
            name="jobDetails"
            value={jobDetails}
            onChange={handleChange}
          />
        </label>
        <br />
        <label>
          Work experience:
          <select
            name="hasWorkExperience"
            value={hasWorkExperience}
            onChange={handleChange}
          >
            <option value="">Select</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </label>
        <br />
        {renderWorkExperienceFields()}
        {/* Add other form fields */}
        {errorMessage && (
          <p style={{ color: "red", textAlign: "center" }}>{errorMessage}</p>
        )}
        <button type="button" onClick={prevStep}>
          Previous
        </button>
        <button type="button" onClick={handleSubmit}>
          Submit
        </button>
      </form>
    </div>
  );
};

export default SecondSection;
