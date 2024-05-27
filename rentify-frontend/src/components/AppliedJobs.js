import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./AppliedJobs.css";
import RatingPopup from "./RatingPopup";
import { useHistory } from "react-router-dom";

const AppliedJobs = () => {
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [workStatusDropdowns, setWorkStatusDropdowns] = useState({}); // State to track work status dropdowns for each job
  const [ratingPopups, setRatingPopups] = useState({}); // State to track rating popups for each job
  const history = useHistory();

  const getImageUrl = (nameOfWork) => {
    try {
      return require(`./img/Sector_jobs/${nameOfWork}.png`);
    } catch (error) {
      return require("./img/jobPost.jpg");
    }
  };

  useEffect(() => {
    const fetchAppliedJobs = async () => {
      try {
        const user_id = localStorage.getItem("user_id");
        const response = await fetch(
          `http://localhost:8000/api/get_applied_jobs/?user_id=${user_id}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setAppliedJobs(data);
      } catch (error) {
        console.error("Error fetching applied jobs:", error);
      }
    };

    fetchAppliedJobs();
  }, []);

  const handleDeleteJob = async (jobId) => {
    if (window.confirm("Are you sure you want to delete this applied job?")) {
      try {
        const user_id = localStorage.getItem("user_id");
        const response = await fetch(
          `http://localhost:8000/api/delete_applied_job/?job_id=${jobId}&user_id=${user_id}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const updatedJobs = appliedJobs.filter((job) => job.job_id !== jobId);
        setAppliedJobs(updatedJobs);
      } catch (error) {
        console.error("Error deleting job:", error);
      }
    }
  };

  const handleChangeWorkStatus = async (jobId) => {
    if (!selectedStatus) {
      alert("Please select a new work status.");
      return;
    }
    try {
      const jobIdInt = parseInt(jobId);
      const userId = localStorage.getItem("user_id");
      const response = await fetch(
        "http://localhost:8000/api/update_work_status/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            job_id: jobIdInt,
            user_id: parseInt(userId),
            action: selectedStatus,
          }),
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const updatedJobs = appliedJobs.map((job) =>
        job.job_id === jobIdInt ? { ...job, work_status: selectedStatus } : job
      );
      setAppliedJobs(updatedJobs);
    } catch (error) {
      console.error("Error updating work status:", error);
    }
  };

  const toggleWorkStatusDropdown = (jobId) => {
    setWorkStatusDropdowns((prevState) => ({
      ...prevState,
      [jobId]: !prevState[jobId],
    }));
  };

  const toggleRatingPopup = (jobId) => {
    setRatingPopups((prevState) => ({
      ...prevState,
      [jobId]: !prevState[jobId],
    }));
  };

  const handleSubmitRating = async (job_id, ratingData, userId) => {
    try {
      console.log(ratingData);
      console.log(userId);
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
          whose_feedback: "captain",
        }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const result = await response.json();
      console.log(result);
      window.location.reload();

      // Fetch applied users after rating submission if needed
    } catch (error) {
      console.error("Error updating rating:", error);
    }
  };
  return (
    <div className="appliedJobs">
      <h1>Applied Jobs</h1>
      {appliedJobs.length === 0 ? (
        <div className="noJobsMessage">
          <p>
            You haven't applied for any jobs yet.{" "}
            <span onClick={() => history.push("/all_jobs")}>
              Click here to search for jobs
            </span>
          </p>
        </div>
      ) : (
        appliedJobs.map((job) => (
          <div key={job.job_id} className="appliedpost">
            <div className="details">
              <img src={getImageUrl(job.name_of_work)} alt="Profile" />{" "}
              <span className="info">
                <h1>{job.name_of_work}</h1>
                <h3>{job.type_of_sector}</h3>
                <h3 className="status">
                  Application Status : {job.status_of_job}
                </h3>
                <h3 className="work-status">Work Status : {job.work_status}</h3>
                {job.work_status === "COMPLETED" &&
                  job.titan_rating_status !== null && (
                    <h3> Rating : {job.titan_rating_status}</h3>
                  )}
                {job.work_status === "COMPLETED" &&
                  job.captain_rating_status !== null && (
                    <h3>
                      {" "}
                      Job assignee Rating given by you :{" "}
                      {job.captain_rating_status}
                    </h3>
                  )}
              </span>
              <h3 className="due-date">Due: {job.due_date}</h3>
            </div>
            <div className="btn">
              <Link to={`/view_job/${job.job_id}`}>
                <button className="v">View</button>
              </Link>
              <button className="d" onClick={() => handleDeleteJob(job.job_id)}>
                Cancel
              </button>
            </div>
            {job.status_of_job === "ACCEPTED" &&
              job.work_status !== "COMPLETED" && (
                <div>
                  <button onClick={() => toggleWorkStatusDropdown(job.job_id)}>
                    {workStatusDropdowns[job.job_id]
                      ? "Close Work Status"
                      : "Select Work Status"}
                  </button>
                  {workStatusDropdowns[job.job_id] && (
                    <div>
                      <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                      >
                        <option value="">Select Work Status</option>
                        {job.work_status === "PENDING" && (
                          <option value="IN PROGRESS">In Progress</option>
                        )}
                        {job.work_status === "IN PROGRESS" && (
                          <option value="COMPLETED">Completed</option>
                        )}
                      </select>
                      <button
                        onClick={() => handleChangeWorkStatus(job.job_id)}
                      >
                        Update Status
                      </button>
                    </div>
                  )}
                </div>
              )}
            {job.work_status === "COMPLETED" &&
              job.titan_rating_status !== null &&
              job.captain_rating_status === null && (
                <button onClick={() => toggleRatingPopup(job.job_id)}>
                  Give Rating for your job assignee {job.user_management_id}
                </button>
              )}
            {/* Render the rating popup if ratingPopups state is true */}
            {ratingPopups[job.job_id] && (
              <RatingPopup
                onClose={() => toggleRatingPopup(job.job_id)}
                onSubmit={(ratingData) =>
                  handleSubmitRating(
                    job.job_id,
                    ratingData,
                    job.user_management
                  )
                }
              />
            )}
          </div>
        ))
      )}
    </div>
  );
};
export default AppliedJobs;
