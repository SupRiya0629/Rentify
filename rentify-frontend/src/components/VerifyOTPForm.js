import React, { useState } from "react";
import { useHistory, useLocation } from "react-router-dom";

const VerifyOTPForm = () => {
  const [otp, setOTP] = useState("");
  const location = useLocation();
  const history = useHistory();
  const { username } = location.state;

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8000/api/verify_otp/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, otp }),
      });
      const data = await response.json();

      if (data.success) {
        // Show success alert
        alert(data.message);
        // Redirect to the ChangePasswordForm
        history.push("/change_password", { username });
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
      <h2>Verify OTP</h2>
      <p>Enter the OTP sent to {username}</p>
      <form onSubmit={handleSubmit}>
        <label>
          OTP:
          <input
            type="text"
            value={otp}
            onChange={(e) => setOTP(e.target.value)}
          />
        </label>
        <button type="submit">Verify OTP</button>
      </form>
    </div>
  );
};

export default VerifyOTPForm;
