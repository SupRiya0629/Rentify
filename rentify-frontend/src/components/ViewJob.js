import React, { useState, useEffect } from "react";
// import "./ViewJob.css";

const ViewJob = ({ job_id }) => {
  const [job, setJob] = useState(null);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/api/get_job_details/?job_id=${job_id}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setJob(data);
      } catch (error) {
        console.error("Error fetching job details:", error);
      }
    };

    fetchJobDetails();
  }, [job_id]);

  if (!job) {
    return <div>Loading...</div>;
  }

  return (
    <div className="job-card">
      <h2>{job.name_of_work}</h2>
      <p>Type of Sector: {job.type_of_sector}</p>
      <p>Description: {job.description_of_work}</p>
      <p>Type of Work: {job.type_of_work}</p>
      <p>Useful Skills: {job.useful_skills}</p>
      <p>Useful Things: {job.useful_things}</p>
      <p>Expected Time: {job.expected_time}</p>
      <p>Place of Work: {job.place_of_work}</p>
      <p>Worker Stay Info: {job.worker_stay_info}</p>
      <p>Travel Info: {job.travel_info}</p>
      <p>Other Incentives: {job.other_incentives}</p>
      <p>Expected Days: {job.expected_days}</p>
      <p>Compensation: {job.compensation}</p>
      <p>Rules or Conditions: {job.rules_or_conditions}</p>
      <p>Due Date: {job.due_date}</p>
    </div>
  );
};

export default ViewJob;
