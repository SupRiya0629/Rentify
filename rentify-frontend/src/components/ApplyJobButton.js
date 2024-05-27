import React, { useState } from "react";
import ConfirmationDialog from "./ConfirmationDialog";

const ApplyJobButton = ({ userId, jobId, jobAssigneeId }) => {
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleApplyJob = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/apply_job/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: userId,
          job_id: jobId,
          job_assignee_id: jobAssigneeId,
        }),
      });
      if (response.ok) {
        // Handle successful apply job
        alert("Job applied successfully!");
        window.location.reload(); // Reload the page
      } else {
        // Handle unsuccessful apply job
        alert("Failed to apply for job");
      }
    } catch (error) {
      console.error("Error applying for job:", error);
    }
    setShowConfirmation(false); // Hide the confirmation dialog
  };

  return (
    <div>
      <button onClick={() => setShowConfirmation(true)}>Apply Job</button>
      {showConfirmation && (
        <ConfirmationDialog
          message="Are you sure you want to apply for this job?"
          onConfirm={handleApplyJob}
          onCancel={() => setShowConfirmation(false)}
        />
      )}
    </div>
  );
};

export default ApplyJobButton;
