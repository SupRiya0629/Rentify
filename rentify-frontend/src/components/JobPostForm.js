import React, { useState } from "react";

function JobPostForm() {
  const [formData, setFormData] = useState({
    typeOfWork: "", // Default to empty string
    typeOfSector: "",
    nameOfWork: "",
    descriptionOfWork: "",
    usefulSkills: "",
    usefulThings: "",
    expectedTime: "",
    placeOfWork: "",
    workerStayInfo: "",
    travelInfo: "",
    incentives: "",
    expectedDays: "",
    compensation: "",
    rulesOrConditions: "",
    dueDate: "",
    file: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      file: e.target.files[0],
    });
  };

  const handleTypeOfWorkChange = (e) => {
    const { value } = e.target;
    setFormData({
      ...formData,
      typeOfWork: value,
    });
  };
  const handleTypeOfSectorChange = (e) => {
    const { value } = e.target;
    setFormData({
      ...formData,
      typeOfSector: value,
      nameOfWork: "", // Reset name of work when type of sector changes
    });
  };

  const renderNameOfWorkOptions = () => {
    switch (formData.typeOfSector) {
      case "Beautician Services":
        return (
          <select
            name="nameOfWork"
            value={formData.nameOfWork}
            onChange={handleChange}
            style={{ marginBottom: "10px", width: "100%" }}
            required
          >
            <option value="">Select</option>
            <option value="Hair Styling">Hair Styling</option>
            <option value="Makeup Artistry">Makeup Artistry</option>
            <option value="Mehandi">Mehandi</option>
            <option value="Nail Care">Nail Care</option>
            <option value="SkinCare and Facials">SkinCare and Facials</option>
          </select>
        );
      case "Caring Services":
        return (
          <select
            name="nameOfWork"
            value={formData.nameOfWork}
            onChange={handleChange}
            style={{ marginBottom: "10px", width: "100%" }}
            required
          >
            <option value="">Select</option>
            <option value="Child Care">Child Care</option>
            <option value="Elderly Care">Elderly Care</option>
            <option value="Pet Care">Pet Care</option>
          </select>
        );
      case "Event Services":
        return (
          <select
            name="nameOfWork"
            value={formData.nameOfWork}
            onChange={handleChange}
            style={{ marginBottom: "10px", width: "100%" }}
            required
          >
            <option value="">Select</option>
            <option value="Catoring Service">Catoring Service</option>
            <option value="Decoration">Decoration</option>
            <option value="Event Planning">Event Planning</option>
            <option value="Photography">Photography</option>
          </select>
        );
      case "Gardening and Landscaping":
        return (
          <select
            name="nameOfWork"
            value={formData.nameOfWork}
            onChange={handleChange}
            style={{ marginBottom: "10px", width: "100%" }}
            required
          >
            <option value="">Select</option>
            <option value="Gardening and Planting">
              Gardening and Planting
            </option>
            <option value="Lawn Care and maintenance">
              Lawn Care and maintenance
            </option>
          </select>
        );
      case "Garment Works":
        return (
          <select
            name="nameOfWork"
            value={formData.nameOfWork}
            onChange={handleChange}
            style={{ marginBottom: "10px", width: "100%" }}
            required
          >
            <option value="">Select</option>
            <option value="Embroidery">Embroidery</option>
            <option value="Tailoring">Tailoring</option>
          </select>
        );
      case "HandyMan Services":
        return (
          <select
            name="nameOfWork"
            value={formData.nameOfWork}
            onChange={handleChange}
            style={{ marginBottom: "10px", width: "100%" }}
            required
          >
            <option value="">Select</option>
            <option value="Carpenter">Carpenter</option>
            <option value="Electrician">Electrician</option>
            <option value="Home Repair">Home Repair</option>
            <option value="Painter">Painter</option>
            <option value="Plumber">Plumber</option>
          </select>
        );
      case "Healthcare and Fitness":
        return (
          <select
            name="nameOfWork"
            value={formData.nameOfWork}
            onChange={handleChange}
            style={{ marginBottom: "10px", width: "100%" }}
            required
          >
            <option value="">Select</option>
            <option value="Nursing Assitance">Nursing Assitance</option>
            <option value="Personal Trainer">Personal Trainer</option>
            <option value="Yoga Trainer">Yoga Trainer</option>
          </select>
        );
      case "Household Assitance":
        return (
          <select
            name="nameOfWork"
            value={formData.nameOfWork}
            onChange={handleChange}
            style={{ marginBottom: "10px", width: "100%" }}
            required
          >
            <option value="">Select</option>
            <option value="Cleaning Services">Cleaning Services</option>
            <option value="Cooking">Cooking</option>
            <option value="Laundry and Ironing">Laundry and Ironing</option>
          </select>
        );
      case "Labour Works":
        return (
          <select
            name="nameOfWork"
            value={formData.nameOfWork}
            onChange={handleChange}
            style={{ marginBottom: "10px", width: "100%" }}
            required
          >
            <option value="">Select</option>
            <option value="Agricultural Labour">Agricultural Labour</option>
            <option value="Factory Labour">Factory Labour</option>
            <option value="Mason Labour">Mason Labour</option>
            <option value="Porter">Porter</option>
            <option value="Other Labour">Other Labour</option>
          </select>
        );
      case "Repairing Services":
        return (
          <select
            name="nameOfWork"
            value={formData.nameOfWork}
            onChange={handleChange}
            style={{ marginBottom: "10px", width: "100%" }}
            required
          >
            <option value="">Select</option>
            <option value="Automobile">Automobile</option>
            <option value="Home Appliance">Home Appliance</option>
          </select>
        );
      case "Studio Works":
        return (
          <select
            name="nameOfWork"
            value={formData.nameOfWork}
            onChange={handleChange}
            style={{ marginBottom: "10px", width: "100%" }}
            required
          >
            <option value="">Select</option>
            <option value="Graphic Design">Graphic Design</option>
            <option value="Illustration">Illustration</option>
            <option value="Photo Editing">Photo Editing</option>
            <option value="Video Editing">Video Editing</option>
          </select>
        );
      case "Technology Support":
        return (
          <select
            name="nameOfWork"
            value={formData.nameOfWork}
            onChange={handleChange}
            style={{ marginBottom: "10px", width: "100%" }}
            required
          >
            <option value="">Select</option>
            <option value="Device SetUp">Device SetUp</option>
            <option value="IT Repairs">IT Repairs</option>
            <option value="Software Installation">Software Installation</option>
          </select>
        );
      case "Transportation":
        return (
          <select
            name="nameOfWork"
            value={formData.nameOfWork}
            onChange={handleChange}
            style={{ marginBottom: "10px", width: "100%" }}
            required
          >
            <option value="">Select</option>
            <option value="Chauffer Services">Chauffer Services</option>
            <option value="Delivery Services">Delivery Services</option>
            <option value="Driver">Driver</option>
          </select>
        );
      case "Tutoring and Education":
        return (
          <select
            name="nameOfWork"
            value={formData.nameOfWork}
            onChange={handleChange}
            style={{ marginBottom: "10px", width: "100%" }}
            required
          >
            <option value="">Select</option>
            <option value="Art Classes">Art Classes</option>
            <option value="Dance Classes">Dance Classes</option>
            <option value="Language Instructor">Language Instructor</option>
            <option value="Music Lesson">Music Lesson</option>
            <option value="Peronsal Tutor">Personal Tutor</option>
          </select>
        );

      // Add more cases as needed
      default:
        return (
          <input
            type="text"
            name="nameOfWork"
            value={formData.nameOfWork}
            onChange={handleChange}
            style={{ marginBottom: "10px", width: "100%" }}
            required
          />
        );
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validate required fields
    if (
      !formData.nameOfWork ||
      !formData.descriptionOfWork ||
      !formData.typeOfWork ||
      (formData.typeOfWork === "remote" &&
        (!formData.usefulSkills ||
          !formData.usefulThings ||
          !formData.expectedTime)) ||
      (formData.typeOfWork === "non-remote" &&
        (!formData.placeOfWork ||
          !formData.workerStayInfo ||
          !formData.travelInfo ||
          !formData.incentives)) ||
      !formData.expectedDays ||
      !formData.compensation ||
      !formData.rulesOrConditions ||
      !formData.dueDate
    ) {
      alert("Please fill in all required fields!");
    } else {
      // Retrieve user_id from local storage
      const user_id = localStorage.getItem("user_id");

      // Prepare data object
      const dataToSend = {
        user_id: user_id, // Change to user_management
        name_of_work: formData.nameOfWork, // Change to name_of_work
        type_of_sector: formData.typeOfSector,
        description_of_work: formData.descriptionOfWork, // Change to description_of_work
        type_of_work: formData.typeOfWork, // Change to type_of_work
        useful_skills: formData.usefulSkills, // Change to useful_skills
        useful_things: formData.usefulThings, // Change to useful_things
        expected_time: formData.expectedTime, // Change to expected_time
        place_of_work: formData.placeOfWork, // Change to place_of_work
        worker_stay_info: formData.workerStayInfo, // Change to worker_stay_info
        travel_info: formData.travelInfo, // Change to travel_info
        other_incentives: formData.incentives,
        expected_days: formData.expectedDays, // Change to expected_days
        compensation: formData.compensation,
        rules_or_conditions: formData.rulesOrConditions, // Change to rules_or_conditions
        due_date: formData.dueDate, // Change to due_date
        file: formData.file, // No change required for file
      };
      fetch("http://localhost:8000/api/create-job/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error("Failed to submit form");
          }
        })
        .then((data) => {
          console.log(data);
          alert("Submitted successfully!");
        })
        .catch((error) => {
          console.error("Error:", error);
          alert("An error occurred while submitting the form.");
        });
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <fieldset
        style={{
          border: "1px solid #ccc",
          padding: "20px",
          borderRadius: "10px",
          width: "400px",
        }}
      >
        <legend style={{ fontWeight: "bold", marginBottom: "10px" }}>
          Post a Job
        </legend>
        <form onSubmit={handleSubmit}>
          <label>
            Type of sector: <span style={{ color: "red" }}>*</span>
          </label>
          <select
            name="typeOfSector"
            value={formData.typeOfSector}
            onChange={handleTypeOfSectorChange}
            style={{ marginBottom: "10px", width: "100%" }}
            required
          >
            <option value="">Select</option>
            <option value="Beautician Services">Beautician Services</option>
            <option value="Caring Services">Caring Services</option>
            <option value="Event Services">Event Services</option>
            <option value="Gardening and Landscaping">
              Gardening and Landscaping
            </option>
            <option value="Garment Works">Garment Works</option>
            <option value="HandyMan Services">HandyMan Services</option>
            <option value="Healthcare and Fitness">
              Healthcare and Fitness
            </option>
            <option value="Household Assitance">Household Assistance</option>
            <option value="Labour Works">Labour Works</option>
            <option value="Repairing Services">Repairing Services</option>
            <option value="Studio Works">Studio Works</option>
            <option value="Technology Support">Technology Support</option>
            <option value="Transportation">Transportation</option>
            <option value="Tutoring and Education">
              Tutoring and Education
            </option>
            <option value="Other">Other</option>
          </select>

          <label>
            Name of work: <span style={{ color: "red" }}>*</span>
          </label>
          {renderNameOfWorkOptions()}

          <label>
            Description of work: <span style={{ color: "red" }}>*</span>
          </label>
          <textarea
            name="descriptionOfWork"
            value={formData.descriptionOfWork}
            onChange={handleChange}
            style={{ marginBottom: "10px", width: "100%" }}
            required
          ></textarea>

          <label>
            Type of work: <span style={{ color: "red" }}>*</span>
          </label>
          <div style={{ marginBottom: "10px" }}>
            <label style={{ marginRight: "10px" }}>
              <input
                type="radio"
                name="typeOfWork"
                value="remote"
                checked={formData.typeOfWork === "remote"}
                onChange={handleTypeOfWorkChange}
                required
              />
              Remote
            </label>
            <label>
              <input
                type="radio"
                name="typeOfWork"
                value="non-remote"
                checked={formData.typeOfWork === "non-remote"}
                onChange={handleTypeOfWorkChange}
                required
              />
              Non-Remote
            </label>
          </div>

          {formData.typeOfWork === "remote" && (
            <>
              <label>
                Useful skills: <span style={{ color: "red" }}>*</span>
              </label>
              <input
                type="text"
                name="usefulSkills"
                value={formData.usefulSkills}
                onChange={handleChange}
                style={{ marginBottom: "10px", width: "100%" }}
                required
              />

              <label>
                Useful things: <span style={{ color: "red" }}>*</span>
              </label>
              <input
                type="text"
                name="usefulThings"
                value={formData.usefulThings}
                onChange={handleChange}
                style={{ marginBottom: "10px", width: "100%" }}
                required
              />

              <label>
                Expected time to complete:{" "}
                <span style={{ color: "red" }}>*</span>
              </label>
              <input
                type="text"
                name="expectedTime"
                value={formData.expectedTime}
                onChange={handleChange}
                style={{ marginBottom: "10px", width: "100%" }}
                required
              />
            </>
          )}

          {formData.typeOfWork === "non-remote" && (
            <>
              <label>
                Place/address of work: <span style={{ color: "red" }}>*</span>
              </label>
              <input
                type="text"
                name="placeOfWork"
                value={formData.placeOfWork}
                onChange={handleChange}
                style={{ marginBottom: "10px", width: "100%" }}
                required
              />

              <label>
                Worker stay information: <span style={{ color: "red" }}>*</span>
              </label>
              <input
                type="text"
                name="workerStayInfo"
                value={formData.workerStayInfo}
                onChange={handleChange}
                style={{ marginBottom: "10px", width: "100%" }}
                required
              />

              <label>
                Travel information: <span style={{ color: "red" }}>*</span>
              </label>
              <input
                type="text"
                name="travelInfo"
                value={formData.travelInfo}
                onChange={handleChange}
                style={{ marginBottom: "10px", width: "100%" }}
                required
              />
              <label>
                Any other incentives: <span style={{ color: "red" }}>*</span>
              </label>
              <input
                type="text"
                name="incentives"
                value={formData.incentives}
                onChange={handleChange}
                style={{ marginBottom: "10px", width: "100%" }}
                required
              />
            </>
          )}

          <label>
            Expected days to complete the work:{" "}
            <span style={{ color: "red" }}>*</span>
          </label>
          <input
            type="text"
            name="expectedDays"
            value={formData.expectedDays}
            onChange={handleChange}
            style={{ marginBottom: "10px", width: "100%" }}
            required
          />

          <label>
            Compensation: <span style={{ color: "red" }}>*</span>
          </label>
          <input
            type="text"
            name="compensation"
            value={formData.compensation}
            onChange={handleChange}
            style={{ marginBottom: "10px", width: "100%" }}
            required
          />

          <label>
            Any rules or conditions: <span style={{ color: "red" }}>*</span>
          </label>
          <textarea
            name="rulesOrConditions"
            value={formData.rulesOrConditions}
            onChange={handleChange}
            style={{ marginBottom: "10px", width: "100%" }}
            required
          ></textarea>

          <label>File Upload (Related to Work):</label>
          <input
            type="file"
            name="file"
            onChange={handleFileChange}
            style={{ marginBottom: "10px" }}
          />

          <label>
            Due date: <span style={{ color: "red" }}>*</span>
          </label>
          <input
            type="date"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
            style={{ marginBottom: "10px", width: "100%" }}
            required
          />

          <button type="submit" style={{ marginTop: "10px" }}>
            Submit
          </button>
        </form>
      </fieldset>
    </div>
  );
}
export default JobPostForm;
