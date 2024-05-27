import React, { useEffect, useState } from "react";
import { useHistory, Link } from "react-router-dom";
import "./AllJobPosts.css";
import axios from "axios";

const OngoingJobs = () => {
  const [jobPosts, setJobPosts] = useState([]);
  const history = useHistory();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/get_jobs_for_user/",
          {
            params: {
              user_id: localStorage.getItem("user_id"),
            },
          }
        );
        setJobPosts(response.data);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };

    fetchJobs();
  }, []);

  // Function to get the image URL based on the name_of_work
  const getImageUrl = (nameOfWork) => {
    try {
      return require(`./img/Sector_jobs/${nameOfWork}.png`);
    } catch (error) {
      return require("./img/jobPost.jpg");
    }
  };

  const handleJobClick = (jobId) => {
    history.push(`/apply_job_details/${jobId}`);
  };

  return (
    <div className="container">
      <h1>Ongoing Jobs</h1>
      <div className="card-list">
        {jobPosts.length === 0 ? ( // Check if jobPosts array is empty
          <div className="noJobsMessage">
            <p>
              Currently there are no ongoing jobs.{" "}
              <Link to="/all_jobs">Click here to apply for jobs</Link>
            </p>
          </div>
        ) : (
          jobPosts.map((job) => (
            <div
              className="card-item"
              key={job.job_id}
              onClick={() => handleJobClick(job.job_id)}
            >
              <img src={getImageUrl(job.name_of_work)} alt="Profile" />
              <div className="card-content">
                <h3>{job.job_name}</h3>
                <p>
                  <strong>Due Date:</strong> {job.due_date}
                </p>
                <p>
                  <strong>Application Status:</strong> {job.status}
                </p>
                <p>
                  <strong>Work Status:</strong> {job.work_status}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default OngoingJobs;
