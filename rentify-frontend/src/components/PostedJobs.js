import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom"; // Import Link and useHistory from React Router
import "./PostedJobs.css";

const PostedJobs = () => {
  const [jobs, setJobs] = useState([]);
  const user_id = localStorage.getItem("user_id");
  const history = useHistory(); // Initialize useHistory hook

  useEffect(() => {
    const fetchPostedJobs = async () => {
      try {
        if (!user_id) {
          console.error("User ID not found in local storage");
          return;
        }

        const response = await fetch(
          `http://localhost:8000/api/posted_by_user/?user_management_id=${user_id}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setJobs(data.jobs);
      } catch (error) {
        console.error("Error fetching posted jobs:", error);
      }
    };

    fetchPostedJobs();
  }, [user_id]);

  const handleDeleteJob = async (jobId) => {
    if (window.confirm("Are you sure you want to delete this job?")) {
      try {
        const response = await fetch(
          `http://localhost:8000/api/delete_job/?job_id=${jobId}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // Update the job list after deletion
        const updatedJobs = jobs.filter((job) => job.job_id !== jobId);
        setJobs(updatedJobs);
      } catch (error) {
        console.error("Error deleting job:", error);
      }
    }
  };

  return (
    <div className="JobPosts">
      <h1>Posted Jobs</h1>
      <div className="createpost">
        <Link to="/post_job">
          <button>
            <i className="fas fa-plus"></i> Create Job Post
          </button>
        </Link>
      </div>
      {jobs.length === 0 ? ( // Check if jobs array is empty
        <div className="noJobsMessage">
          <p>
            You haven't created any Jobs yet. Please{" "}
            <span onClick={() => history.push("/post_job")}>click here</span> to
            Post a Job
          </p>
        </div>
      ) : (
        jobs.map((job, index) => (
          <div className="jobpost" key={index}>
            {/* Wrap the job details in a Link component */}
            <div className="details">
              <h1>{job.name_of_work}</h1>
              <h3>{job.type_of_sector}</h3>
            </div>

            <div className="btn">
              <Link to={`/get_user_by_job/${job.job_id}`}>
                <button className="ap">Application Requests</button>
              </Link>
              <Link to={`/view_job/${job.job_id}`}>
                {/* Pass job_id as part of the route path */}
                <button className="v">View</button>
              </Link>

              <button className="d" onClick={() => handleDeleteJob(job.job_id)}>
                Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default PostedJobs;
