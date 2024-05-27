// src/components/RegistrationForm.js

import React, { useState } from "react";
import FirstSection from "./FirstSection";
import SecondSection from "./SecondSection";
import "./RegistrationForm.css";

const RegistrationForm = () => {
  const [formState, setFormState] = useState({
    username: "",
    password: "",
    reenterPassword: "",
    name: "",
    gender: "",
    phone: "",
    email: "",
    address: "",
    skillCategory: "",
    lookingFor: "",
    workExperience: "",
    workplace: "",
    position: "",
    duration: "",
  });

  const [currentStep, setCurrentStep] = useState(1);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const nextStep = () => {
    setCurrentStep((prevStep) => prevStep + 1);
  };

  const prevStep = () => {
    setCurrentStep((prevStep) => prevStep - 1);
  };

  // const submitForm = async () => {
  //   // Send data to the backend
  //   const response = await fetch(
  //     "http://localhost:8000/api/user-registration/",
  //     {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(formData),
  //     }
  //   );

  //   if (response.ok) {
  //     // Handle success (e.g., show success message, redirect to login)
  //     console.log("Registration successful. Redirect to login page.");
  //   } else {
  //     // Handle error (e.g., show error message)
  //     console.error("Error during registration:", await response.json());
  //   }
  // };

  return (
    <div>
      {currentStep === 1 && (
        <FirstSection
          formData={formState}
          handleChange={handleChange}
          nextStep={nextStep}
        />
      )}
      {currentStep === 2 && (
        <SecondSection
          formData={formState}
          handleChange={handleChange}
          prevStep={prevStep}
        />
      )}
    </div>
  );
};

export default RegistrationForm;
