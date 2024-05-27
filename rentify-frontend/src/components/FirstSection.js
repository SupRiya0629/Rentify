// src/components/FirstSection.js

import React, { useState } from "react";
import "./FirstSection.css";
import axios from "axios";

const FirstSection = ({ formData, handleChange, nextStep }) => {
  const {
    username = "",
    password = "",
    password1 = "",
    name = "",
    gender = "Male",
    phone = "",
    email = "",
    address = "",
  } = formData;

  // State variables to track user interaction and errors
  const [touchedFields, setTouchedFields] = useState({});
  const [errors, setErrors] = useState({});
  const [usernameAvailable, setUsernameAvailable] = useState(true);

  // Function to validate phone number (10 digits)
  const isPhoneNumberValid = (phoneNumber) => /^\d{10}$/.test(phoneNumber);

  // Function to validate email
  const isEmailValid = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // Function to check if password is valid
  const isPasswordValid =
    password.length >= 8 &&
    password.length <= 16 &&
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/.test(
      password
    );

  // Function to handle form field change
  const handleFieldChange = (e) => {
    handleChange(e);

    // Mark the field as touched
    setTouchedFields({ ...touchedFields, [e.target.name]: true });

    // Validate the form field and update errors
    validateFormField(e.target.name, e.target.value);
  };

  // Function to handle onBlur event for field validation
  const handleFieldBlur = (e) => {
    const { name, value } = e.target;

    // Mark the field as touched
    setTouchedFields({ ...touchedFields, [name]: true });

    // Validate the form field and update errors
    validateFormField(name, value);
    // Check username availability when the username field changes
    if (name === "username") {
      checkUsernameAvailability(value);
    }
  };

  // Function to validate a specific form field
  const validateFormField = (fieldName, value) => {
    let error = "";

    switch (fieldName) {
      case "password":
        error =
          touchedFields.password && !isPasswordValid
            ? "Password should be between 8 and 16 characters and include at least one uppercase letter, one lowercase letter, one number, and one special symbol."
            : "";
        break;
      case "password1":
        error =
          touchedFields.password1 && password !== password1
            ? "Passwords do not match!"
            : "";
        break;
      case "phone":
        error =
          touchedFields.phone && !isPhoneNumberValid(value)
            ? "Invalid phone number!"
            : "";
        break;
      case "email":
        error =
          touchedFields.email && !isEmailValid(value)
            ? "Invalid email address!"
            : "";
        break;
      case "username":
        error =
          touchedFields.username && !usernameAvailable
            ? "Username is not available!"
            : "";
        break;
      // Add cases for other form fields if needed
      default:
        break;
    }

    // Update errors state
    setErrors({ ...errors, [fieldName]: error });
  };

  // Function to handle "Next" button click
  const handleNextClick = () => {
    // Validate all form fields
    Object.keys(formData).forEach((fieldName) => {
      validateFormField(fieldName, formData[fieldName]);
    });

    // Check if all form fields are valid
    const isFormFieldsValid = Object.values(errors).every(
      (error) => error === ""
    );

    // Proceed to the next step if all form fields are valid
    if (isFormFieldsValid) {
      nextStep();
    }
  };

  // Function to check username availability
  const checkUsernameAvailability = async (value) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/check-username/?username=${value}`
      );
      setUsernameAvailable(response.data.available);
    } catch (error) {
      console.error("Error checking username availability:", error);
    }
  };
  // Function to check if all form fields are valid
  const isFormValid = () => {
    return (
      Object.keys(touchedFields).every((fieldName) => !errors[fieldName]) &&
      !Object.values(errors).some(
        (error) => error !== "" && error !== undefined
      )
    );
  };

  return (
    <div className="registration-section">
      <h2>Basic Information</h2>
      <form>
        <label>
          Username:
          <input
            type="text"
            name="username"
            value={username}
            onChange={handleFieldChange}
            onBlur={handleFieldBlur}
          />
          {touchedFields.username && !usernameAvailable && (
            <p style={{ color: "red" }}>{errors.username}</p>
          )}
        </label>
        <br />
        <label>
          Password:
          <input
            type="password"
            name="password"
            value={password}
            onChange={handleFieldChange}
            onBlur={handleFieldBlur}
          />
          {touchedFields.password && errors.password && (
            <p style={{ color: "red" }}>{errors.password}</p>
          )}
        </label>
        <br />
        <label>
          Reenter password:
          <input
            type="password"
            name="password1"
            value={password1}
            onChange={handleFieldChange}
            onBlur={handleFieldBlur}
          />
          {touchedFields.password1 && errors.password1 && (
            <p style={{ color: "red" }}>{errors.password1}</p>
          )}
        </label>
        <br />
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={name}
            onChange={handleFieldChange}
            onBlur={handleFieldBlur}
          />
        </label>
        <br />
        <label>
          Gender:
          <div>
            <label>
              <input
                type="radio"
                name="gender"
                value="Male"
                checked={gender === "Male"}
                onChange={handleFieldChange}
              />
              Male
            </label>
          </div>
          <div>
            <label>
              <input
                type="radio"
                name="gender"
                value="Female"
                checked={gender === "Female"}
                onChange={handleFieldChange}
              />
              Female
            </label>
          </div>
          <div>
            <label>
              <input
                type="radio"
                name="gender"
                value="Other"
                checked={gender === "Other"}
                onChange={handleFieldChange}
              />
              Other
            </label>
          </div>
        </label>
        <br />
        <label>
          Phone:
          <input
            type="text"
            name="phone"
            value={phone}
            onChange={handleFieldChange}
            onBlur={handleFieldBlur}
          />
          {touchedFields.phone && errors.phone && (
            <p style={{ color: "red" }}>{errors.phone}</p>
          )}
        </label>
        <br />
        <label>
          Email:
          <input
            type="text"
            name="email"
            value={email}
            onChange={handleFieldChange}
            onBlur={handleFieldBlur}
          />
          {touchedFields.email && errors.email && (
            <p style={{ color: "red" }}>{errors.email}</p>
          )}
        </label>
        <br />
        <label>
          Address:
          <textarea
            name="address"
            value={address}
            onChange={handleFieldChange}
            onBlur={handleFieldBlur}
          />
        </label>
        <br />
        {/* ... (other input fields) ... */}
        <button
          type="button"
          onClick={handleNextClick}
          disabled={!isFormValid()}
        >
          Next
        </button>
      </form>
    </div>
  );
};

export default FirstSection;
