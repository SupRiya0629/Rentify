import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AllJobPosts.css";

const UsersProfiles = () => {
  const [userProfiles, setUserProfiles] = useState([]);

  useEffect(() => {
    const fetchUserProfiles = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/all_users/"
        );
        setUserProfiles(response.data.users); // Accessing the 'users' array from the response data
      } catch (error) {
        console.error("Error fetching user profiles:", error);
      }
    };

    fetchUserProfiles();
  }, []);

  return (
    <div className="container">
      <h1>User Profiles</h1>
      <div className="card-list">
        {userProfiles.map((profile, index) => (
          <div className="card-item" key={index}>
            <div className="card-content">
              <img src={require("./img/profile.png")} alt="Profile" />
              <h3>{profile.name}</h3>
              <p>
                <strong>Gender:</strong> {profile.gender}
              </p>
              <p>
                <strong>Email:</strong> {profile.email}
              </p>
              <p>
                <strong>Address:</strong> {profile.address}
              </p>
              <p>
                <strong>Overall Titan Rating:</strong>{" "}
                {profile.overall_titan_rating
                  ? profile.overall_titan_rating
                  : "N/A"}
              </p>
              <p>
                <strong>Overall Captain Rating:</strong>{" "}
                {profile.overall_captain_rating
                  ? profile.overall_captain_rating
                  : "N/A"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UsersProfiles;
