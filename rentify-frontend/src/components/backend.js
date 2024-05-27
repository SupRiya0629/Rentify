import axios from "axios";

// Update the URL endpoint according to your Django project
const backendURL = "http://localhost:8000/api/";

export const sendDataToBackend = async (endpoints, formData) => {
  try {
    // Step 1: Create UserManagement
    const responseUserManagement = await axios.post(
      `${backendURL}${endpoints.userManagement}`,
      formData.userManagement
    );
    const userManagementId = responseUserManagement.data.user_id;
    console.log(responseUserManagement.data);

    // Step 2: Use the obtained userManagementId to create UserDetails
    const userDetailsData = {
      name: formData.userDetails.name,
      gender: formData.userDetails.gender,
      phone: formData.userDetails.phone,
      email: formData.userDetails.email,
      address: formData.userDetails.address,
      user_management: userManagementId,
    };
    await axios.post(`${backendURL}${endpoints.userDetails}`, userDetailsData);

    // Step 3: Use the obtained userManagementId to create UserSkills
    const userSkillsData = {
      skill_category: formData.userSkills.skill_category,
      job_details: formData.userSkills.job_details,
      has_work_experience: formData.userSkills.has_work_experience,
      workplace: formData.userSkills.workplace,
      position: formData.userSkills.position,
      duration: formData.userSkills.duration,
      user_management: userManagementId,
    };
    await axios.post(`${backendURL}${endpoints.userSkills}`, userSkillsData);

    console.log("Data sent successfully");
  } catch (error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error("Server responded with an error:", error.response.data);

      // Extract and return specific error messages
      const { username } = error.response.data;
      if (
        username &&
        username[0] === "user management with this username already exists."
      ) {
        console.error("Username already exists. Choose another one.");
        return "Username already exists. Choose another one.";
      } else {
        console.error("Unknown error. Please try again.");
        return "Unknown error. Please try again.";
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error("No response received from the server:", error.request);
      return "No response received from the server. Please try again.";
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error("Error setting up the request:", error.message);
      return "Error setting up the request. Please try again.";
    }
  }
};
