import React, { useState } from "react";
import { useHistory } from "react-router-dom";

const ForgotPasswordForm = () => {
  const [username, setUsername] = useState("");
  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://localhost:8000/api/forgot_password/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username }),
        }
      );
      const data = await response.json();

      if (data.success) {
        // Show success alert
        alert(data.message);
        // Redirect to the VerifyOTPForm
        history.push("/verify_otp", { username });
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

  return (
    <div>
      <h2>Forgot Password</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Username:
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </label>
        <button type="submit">Send OTP</button>
      </form>
    </div>
  );
};

export default ForgotPasswordForm;
