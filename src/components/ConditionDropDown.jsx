import React from "react";
import PropTypes from "prop-types";

const ConditionDropdown = ({ value, onChange, disabled }) => {
  const conditions = ["New", "Used", "Like New"]; // Predefined conditions

  return (
    <select
      name="condition"
      value={value}
      onChange={onChange}
      className={`w-full p-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 ${
        disabled ? "opacity-50 cursor-not-allowed" : "hover:border-indigo-400"
      }`}
      disabled={disabled}
    >
      <option value="">Select a condition</option>
      {conditions.map((condition) => (
        <option key={condition} value={condition.toLowerCase()}>
          {condition}
        </option>
      ))}
    </select>
  );
};

ConditionDropdown.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

export default ConditionDropdown;
