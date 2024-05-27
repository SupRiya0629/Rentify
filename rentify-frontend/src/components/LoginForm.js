// src/components/Login.js
import React, { useState } from "react";
import axios from "axios";
import "./LoginForm.css";
import { useHistory } from "react-router-dom";

const LoginForm = ({ handleLogin }) => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState({});
  const history = useHistory();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleForgotPasswordClick = () => {
    history.push("/forgot_password");
  };

  const handleLoginClick = async () => {
    // Validate form fields
    const newErrors = {};
    if (!formData.username) {
      newErrors.username = "Username is required";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    // Update errors state
    setErrors(newErrors);

    // Check if there are any errors
    if (Object.values(newErrors).some((error) => error !== "")) {
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8000/api/login/",
        formData
      );

      if (response.status === 200 && response.data && response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user_id", response.data.user_id);
        localStorage.setItem("username", formData.username);
        history.push("/dashboard");
        //handleLogin();
      } else {
        // If there is no token or error message in the response
        setErrors({ ...errors, general: "An error occurred during login" });
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        // If the error is due to authentication failure (401 Unauthorized)
        setErrors({ ...errors, general: "Invalid username or password" });
      } else if (
        error.response &&
        error.response.data &&
        error.response.data.error
      ) {
        // If the server sends a specific error message in the response
        setErrors({ ...errors, general: error.response.data.error });
      } else {
        // If there is no specific error message in the response
        setErrors({
          ...errors,
          general: "An unexpected error occurred during login",
        });
      }
    }
  };

  return (
    <div className="login-section">
      <h2>Login</h2>
      <form>
        <label>
          Username:
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
          />
          {errors.username && <p style={{ color: "red" }}>{errors.username}</p>}
        </label>
        <br />
        <label>
          Password:
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
          {errors.password && <p style={{ color: "red" }}>{errors.password}</p>}
        </label>
        <br />
        {errors.general && <p style={{ color: "red" }}>{errors.general}</p>}
        <br />
        <span
          style={{ cursor: "pointer", color: "blue" }}
          onClick={handleForgotPasswordClick}
        >
          Forgot Password?
        </span>
        <button type="button" onClick={handleLoginClick}>
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
