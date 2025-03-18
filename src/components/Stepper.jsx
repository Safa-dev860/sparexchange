// components/Stepper.js
import React from "react";

const Stepper = ({ activeStep }) => {
  const steps = ["Cart Items", "Card Details"];

  return (
    <div className="flex items-center mb-8">
      {steps.map((step, index) => (
        <div key={index} className="flex items-center">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
              activeStep === index ? "bg-blue-500 text-white" : ""
            } ${
              index < activeStep
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            {index + 1}
          </div>
          <div
            className={`ml-4 font-medium ${
              index < activeStep ? "text-blue-500" : "text-gray-700"
            }`}
          >
            {step}
          </div>
          {index < steps.length - 1 && (
            <div
              className={`w-24 h-0.5 bg-gray-200 ${
                index < activeStep ? "bg-blue-500" : ""
              }`}
            ></div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Stepper;
