import React, { useState } from "react";
import { FaStar } from "react-icons/fa";

const RatingPopup = ({ onClose, onSubmit }) => {
  const [rate, setRate] = useState(0);
  const [feedback, setFeedback] = useState("");

  const handleRating = (givenRating) => {
    setRate(givenRating);
  };

  const handleSubmit = () => {
    onSubmit({ rating: rate, feedback });
    onClose();
  };

  return (
    <div
      style={{
        backgroundColor: "#fff",
        padding: "20px",
        borderRadius: "5px",
        textAlign: "center",
      }}
    >
      <button
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          background: "none",
          border: "none",
          fontSize: "20px",
          cursor: "pointer",
        }}
        onClick={onClose}
      >
        &times;
      </button>
      <h2>Rate Us!</h2>
      <div style={{ display: "flex", justifyContent: "center" }}>
        {[...Array(5)].map((item, index) => {
          const givenRating = index + 1;
          return (
            <label key={index}>
              <input
                type="radio"
                style={{ display: "none" }}
                value={givenRating}
                onClick={() => handleRating(givenRating)}
              />
              <div
                style={{
                  cursor: "pointer",
                  color:
                    givenRating < rate || givenRating === rate
                      ? "#000"
                      : "rgb(192,192,192)",
                  marginRight: "10px", // Add margin between stars
                }}
              >
                <FaStar />
              </div>
            </label>
          );
        })}
      </div>
      <textarea
        placeholder="Leave your feedback here..."
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
        style={{ width: "100%", marginTop: "10px" }}
      ></textarea>
      <button onClick={handleSubmit} style={{ marginTop: "10px" }}>
        Submit
      </button>
    </div>
  );
};

export default RatingPopup;
