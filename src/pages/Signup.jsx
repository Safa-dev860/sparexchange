import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signUp } from "../redux/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { Stepper, Step, StepLabel, Button } from "@mui/material";
import useCloudinaryUpload from "../hooks/useCloudinaryUpload"; // Adjust the path as needed

const SignUpPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    birthday: "",
    profilePicture: null, // Will hold the URL string after upload
  });

  const [activeStep, setActiveStep] = useState(0);
  const steps = ["Account Details", "Personal Info", "Profile Picture"];

  const {
    uploadImage,
    isLoading: uploadLoading,
    error: uploadError,
  } = useCloudinaryUpload();

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const url = await uploadImage(file);
        console.log("Uploaded image URL:", url); // Debugging line
        if (url) {
          setFormData((prev) => ({ ...prev, profilePicture: url }));
        }
      } catch (err) {
        console.error("Image upload failed:", err);
      }
    }
  };

  const handleNext = async () => {
    if (activeStep === 0) {
      if (!formData.email || !formData.password || !formData.confirmPassword) {
        alert("Please fill in all required fields.");
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        alert("Passwords do not match!");
        return;
      }
    } else if (activeStep === 1) {
      if (!formData.name || !formData.birthday) {
        alert("Please fill in all required fields.");
        return;
      }
    } else if (activeStep === 2) {
      if (!formData.profilePicture) {
        alert("Please upload a profile picture before submitting.");
        return;
      }
      await handleSubmit(new Event("submit")); // Ensure form submits after the image URL is set
      return;
    }
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Submitting with formData:", formData); // Debug
      await dispatch(
        signUp({
          email: formData.email,
          password: formData.password,
          name: formData.name,
          birthday: formData.birthday,
          profilePicture: formData.profilePicture, // URL or null
        })
      ).unwrap();
      navigate("/");
    } catch (err) {
      console.error("Sign Up Failed:", err);
    }
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <div className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold mb-2"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleFormChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold mb-2"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleFormChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-semibold mb-2"
              >
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleFormChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
          </div>
        );
      case 1:
        return (
          <div className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-semibold mb-2"
              >
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleFormChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label
                htmlFor="birthday"
                className="block text-sm font-semibold mb-2"
              >
                Birthday
              </label>
              <input
                type="date"
                id="birthday"
                name="birthday"
                value={formData.birthday}
                onChange={handleFormChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
          </div>
        );
      case 2:
        return (
          <div>
            <label
              htmlFor="profilePicture"
              className="block text-sm font-semibold mb-2"
            >
              Profile Picture
            </label>
            <input
              type="file"
              id="profilePicture"
              name="profilePicture"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-indigo-100 file:text-indigo-700 file:font-semibold hover:file:bg-indigo-200 transition-all duration-200"
              disabled={uploadLoading}
            />
            {uploadLoading && (
              <p className="text-sm text-gray-500 mt-2">Uploading...</p>
            )}
            {uploadError && (
              <p className="text-sm text-red-500 mt-2">{uploadError}</p>
            )}
            {formData.profilePicture &&
              typeof formData.profilePicture === "string" && (
                <div className="mt-4">
                  <p className="text-sm text-gray-700">Preview:</p>
                  <img
                    src={formData.profilePicture}
                    alt="Profile Preview"
                    className="w-32 h-32 object-cover rounded-full"
                  />
                </div>
              )}
          </div>
        );
      default:
        return "Unknown step";
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 mt-32">
      <div className="flex flex-col flex-1 md:flex-row p-6 gap-6 justify-center items-center">
        <div className="w-full max-w-md bg-white shadow-md p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-4 text-center">Sign Up</h3>
          {(error || uploadError) && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-md mb-4">
              {error || uploadError}
            </div>
          )}

          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <form
            onSubmit={
              activeStep === 2 ? handleSubmit : (e) => e.preventDefault()
            }
            className="mt-6"
          >
            {getStepContent(activeStep)}

            <div className="flex justify-between mt-6">
              <Button
                disabled={
                  activeStep === 0 || status === "loading" || uploadLoading
                }
                onClick={handleBack}
                className="bg-gray-300 text-black px-4 py-2 rounded-md"
              >
                Back
              </Button>
              {activeStep === steps.length ? (
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  disabled={
                    status === "loading" ||
                    uploadLoading ||
                    !formData.email ||
                    !formData.password ||
                    !formData.name ||
                    !formData.birthday
                  }
                >
                  {status === "loading" ? "Signing Up..." : "Finish"}
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleNext}
                  disabled={status === "loading" || uploadLoading}
                >
                  Next
                </Button>
              )}
            </div>
          </form>

          <div className="mt-4 text-center">
            <p className="text-sm">
              Already have an account?{" "}
              <a href="/login" className="text-green-500 hover:underline">
                Sign In
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
