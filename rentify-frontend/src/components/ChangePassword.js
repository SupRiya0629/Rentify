import React, { useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";

const ChangePasswordForm = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [confirmPasswordTouched, setConfirmPasswordTouched] = useState(false); // State to track if confirm password field is touched
  const location = useLocation();
  const history = useHistory();
  const { username, otp } = location.state;

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if passwords match
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match. Please try again.");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:8000/api/change_password/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, otp, newPassword }),
        }
      );
      const data = await response.json();

      if (data.success) {
        // Show success alert
        alert(data.message);
        // Redirect to the login page
        history.push("/login");
      } else {
        // Show error alert
        alert(data.error);
      }
    } catch (error) {
      console.error("Error:", error);
      // Show error alert
      alert("An error occurred. Please try again later.");
    }
  };

  const toggleNewPasswordVisibility = () => {
    setShowNewPassword(!showNewPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);
    setPasswordsMatch(newPassword === value); // Check if passwords match
  };

  const handleConfirmPasswordBlur = () => {
    setConfirmPasswordTouched(true); // Set confirm password as touched when it loses focus
  };

  return (
    <div>
      <h2>Change Password</h2>
      <p>Enter a new password for {username}</p>
      <form onSubmit={handleSubmit}>
        <label>
          New Password:
          <div className="password-input">
            <input
              type={showNewPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <button
              type="button"
              className="password-toggle-btn"
              onClick={toggleNewPasswordVisibility}
            >
              {showNewPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>
        </label>
        <label>
          Confirm Password:
          <div className="password-input">
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              onBlur={handleConfirmPasswordBlur}
            />
            <button
              type="button"
              className="password-toggle-btn"
              onClick={toggleConfirmPasswordVisibility}
            >
              {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>
          {/* Display error message only when confirm password is touched and passwords don't match */}
          {confirmPasswordTouched && !passwordsMatch && (
            <span style={{ color: "red" }}>Passwords do not match</span>
          )}
        </label>
        <button type="submit" disabled={!passwordsMatch}>
          Change Password
        </button>
      </form>
    </div>
  );
};

export default ChangePasswordForm;
