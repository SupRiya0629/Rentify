import React, { useState } from "react";
import RegistrationForm from "./RegistrationForm";
import LoginForm from "./LoginForm";
import "./HomePage.css";

const HomePage = () => {
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);

  const handleRegisterClick = () => {
    setShowRegistrationForm(true);
    setShowLoginForm(false);
  };

  const handleLoginClick = () => {
    setShowRegistrationForm(false);
    setShowLoginForm(true);
  };

  return (
    <div>
      <header className="navbar">
        <h1>Logo: Rentify</h1>
        <div className="buttons">
          <button onClick={handleRegisterClick}>Register</button>
          <button onClick={handleLoginClick}>Login</button>
        </div>
      </header>

      {showRegistrationForm && <RegistrationForm />}
      {showLoginForm && <LoginForm />}

      {!showRegistrationForm && !showLoginForm && (
        <div>
          <h2>Other Content</h2>
          <p>Some additional content goes here...</p>
        </div>
      )}
    </div>
  );
};

export default HomePage;
