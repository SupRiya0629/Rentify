import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./JobApplications.css";
import RatingPopup from "./RatingPopup";

const JobApplications = () => {
  const [users, setUsers] = useState([]);
  const { job_id } = useParams();
  const [showRatingPopup, setShowRatingPopup] = useState(false);

  const fetchAppliedUsers = async (jobId) => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/get_users_applied_to_job/?job_id=${jobId}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching applied users:", error);
    }
  };

  useEffect(() => {
    fetchAppliedUsers(job_id);
  }, [job_id]);

  const handleAction = async (userId, action) => {
    try {
      const jobIdInt = parseInt(job_id);
      const response = await fetch(
        "http://localhost:8000/api/update_job_status/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            job_id: jobIdInt,
            user_id: userId,
            action,
          }),
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const result = await response.json();
      console.log(result);
      fetchAppliedUsers(job_id);
    } catch (error) {
      console.error("Error updating job status:", error);
    }
  };

  const handleChangeToInProgress = (userId) => {
    const confirmation = window.confirm(
      "Are you sure you want to change the status to IN PROGRESS?"
    );
    if (confirmation) {
      handleAction(userId, "IN PROGRESS");
    }
  };

  const handleSubmitRating = async (ratingData, userId) => {
    try {
      const response = await fetch("http://localhost:8000/api/update_rating/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          job_id: parseInt(job_id),
          user_id: userId,
          rating: ratingData.rating,
          feedback: ratingData.feedback,
          whose_feedback: "titan",
        }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const result = await response.json();
      console.log(result);
      // Fetch applied users after rating submission if needed
      fetchAppliedUsers(job_id);
    } catch (error) {
      console.error("Error updating rating:", error);
    }
  };

  const openRatingPopup = () => {
    setShowRatingPopup(true);
  };

  return (
    <div className="appliedUsers">
      {users.map((user) => (
        <div key={user.user_management_id} className="userCard">
          <h2>{user.name}</h2>
          <p>Gender: {user.gender}</p>
          <p>Email: {user.email}</p>
          <p>Address: {user.address}</p>
          {user.status === "PENDING" && (
            <>
              <button
                onClick={() =>
                  handleAction(user.user_management_id, "approved")
                }
              >
                Approve
              </button>
              <button
                onClick={() =>
                  handleAction(user.user_management_id, "rejected")
                }
              >
                Reject
              </button>
            </>
          )}
          {user.status === "ACCEPTED" && (
            <>
              <span>Application status :</span>
              <button>{user.status}</button>
              <p>
                Work Status:
                <button>{user.work_status}</button>
              </p>
              {user.work_status === "COMPLETED" && (
                <>
                  {user.titan_rating_status ? (
                    <div>
                      <p>
                        Rating given by you for completion of job:{" "}
                        {user.titan_rating}
                      </p>
                      <p>
                        Feedback given by you for completion of job:{" "}
                        {user.titan_feedback}
                      </p>
                    </div>
                  ) : (
                    <>
                      <button onClick={openRatingPopup}>Give Rating</button>
                      {showRatingPopup && (
                        <RatingPopup
                          onClose={() => setShowRatingPopup(false)}
                          onSubmit={(ratingData) =>
                            handleSubmitRating(
                              ratingData,
                              user.user_management_id
                            )
                          }
                        />
                      )}
                      <p style={{ textAlign: "center" }}>or</p>
                      <br />
                      <span>If work is not yet completed???</span>
                      <button
                        onClick={() =>
                          handleChangeToInProgress(user.user_management_id)
                        }
                      >
                        Change to IN PROGRESS
                      </button>
                    </>
                  )}
                </>
              )}
            </>
          )}
          {user.status === "REJECTED" && <button>Rejected</button>}
        </div>
      ))}
    </div>
  );
};

export default JobApplications;
