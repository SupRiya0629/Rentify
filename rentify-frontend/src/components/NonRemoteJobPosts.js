import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import "./AllJobPosts.css";

const NonRemoteJobPosts = () => {
  const [jobPosts, setJobPosts] = useState([]);
  const history = useHistory();

  useEffect(() => {
    const fetchJobPosts = async () => {
      try {
        const response = await fetch(
          "http://127.0.0.1:8000/api/show_all_non_remote_jobs/"
        );
        const data = await response.json();
        setJobPosts(data);
      } catch (error) {
        console.error("Error fetching job posts:", error);
      }
    };

    fetchJobPosts();
  }, []);

  // Function to get the image URL based on the name_of_work
  const getImageUrl = (nameOfWork) => {
    // Convert nameOfWork to lowercase and replace spaces with underscores
    // const imageName = nameOfWork.toLowerCase().replace(/\s+/g, "_");

    try {
      // Try to require the image dynamically
      return require(`./img/Sector_jobs/${nameOfWork}.png`);
    } catch (error) {
      // If the image doesn't exist, return the default image URL
      return require("./img/jobPost.jpg");
    }
  };

  const handleJobClick = (jobId) => {
    history.push(`/apply_job_details/${jobId}`);
  };

  return (
    <div className="container">
      <h1>All Non-Remote Job Posts</h1>
      {jobPosts.length === 0 ? (
        <div className="noJobsMessage">
          <p>
            Currently no remote jobs are available.{" "}
            <span onClick={() => history.push("/all_non_remote_jobs")}>
              Click here to see non_remote jobs.
            </span>
          </p>
        </div>
      ) : (
        <div className="card-list">
          {jobPosts.map((job) => (
            <div
              className="card-item"
              key={job.job_id}
              onClick={() => handleJobClick(job.job_id)}
            >
              <img src={getImageUrl(job.name_of_work)} alt="Profile" />
              <div className="card-content">
                <h3>{job.name_of_work}</h3>
                <p>
                  <strong>Due Date:</strong> {job.due_date}
                </p>
                <p>
                  <strong>Compensation:</strong> {job.compensation}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NonRemoteJobPosts;
