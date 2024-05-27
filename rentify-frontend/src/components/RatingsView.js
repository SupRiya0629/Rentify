import React, { useState, useEffect } from "react";
import axios from "axios";
import "./RatingsView.css";

const RatingsView = () => {
  const [ratings, setRatings] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("captain"); // Default to captain

  useEffect(() => {
    fetchRatings(selectedFilter);
  }, [selectedFilter]);

  const fetchRatings = async (filter) => {
    try {
      const user_id = localStorage.getItem("user_id");
      const response = await axios.post(
        "http://localhost:8000/api/show_reviews/",
        {
          user_id,
          type_of_user: filter,
        }
      );
      setRatings(response.data);
    } catch (error) {
      console.error("Error fetching ratings:", error);
    }
  };

  return (
    <div className="ratingsView">
      <div className="filterButtons">
        <button
          className={selectedFilter === "captain" ? "active" : ""}
          onClick={() => setSelectedFilter("captain")}
        >
          Ratings Given by You (Captain)
        </button>
        <button
          className={selectedFilter === "titan" ? "active" : ""}
          onClick={() => setSelectedFilter("titan")}
        >
          Ratings Given to You (Titan)
        </button>
      </div>
      <div className="ratingsContainer">
        {ratings.length === 0 ? (
          <div className="noRatingsMessage">
            <p>
              {selectedFilter === "captain"
                ? "You have not written any ratings"
                : "You haven't received any ratings"}
            </p>
          </div>
        ) : (
          ratings.map((rating, index) => (
            <div className="ratingBox" key={index}>
              <h3>{rating.job_id__name_of_work}</h3>
              {rating.titan_rating ? (
                <p>Rating: {rating.titan_rating}</p>
              ) : (
                <p>Rating: {rating.captain_rating}</p>
              )}
              {rating.titan_feedback ? (
                <p>Feedback: {rating.titan_feedback}</p>
              ) : (
                <p>Feedback: {rating.captain_feedback}</p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RatingsView;
