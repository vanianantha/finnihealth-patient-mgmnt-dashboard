import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { 
  CalendarIcon, 
  XMarkIcon,
  ExclamationTriangleIcon
} from "@heroicons/react/24/outline";
import dayjs from "dayjs";

// Available patient status options for the dropdown
const statusOptions = ["Inquiry", "Onboarding", "Active", "Churned"];

// US ZIP: 12345 or 12345-6789
const usZipRegex = /^\d{5}(-\d{4})?$/;
// Canadian Postal: A1A 1A1 (must have a space)
const caPostalRegex = /^[A-Za-z]\d[A-Za-z] \d[A-Za-z]\d$/;

// Field configuration for consistent styling and validation
// This object defines the properties for each form field including validation rules
const fieldConfig = {
  firstName: {
    label: "First Name",
    placeholder: "Enter first name",
    required: true,
    maxLength: 50,
    validation: (value) => value.trim().length >= 2 ? null : "First name must be at least 2 characters"
  },
  middleName: {
    label: "Middle Name",
    placeholder: "Enter middle name",
    required: false,
    maxLength: 50,
  },
  lastName: {
    label: "Last Name",
    placeholder: "Enter last name",
    required: true,
    maxLength: 50,
    validation: (value) => value.trim().length >= 2 ? null : "Last name must be at least 2 characters"
  },
  dob: {
    label: "Date of Birth",
    placeholder: "Select date of birth",
    required: true,
    validation: (value) => value ? null : "Date of birth is required"
  },
  status: {
    label: "Patient Status",
    placeholder: "Select status",
    required: true,
    validation: (value) => value ? null : "Status is required"
  },
  street: {
    label: "Street Address",
    placeholder: "Enter street address, apartment, or suite number",
    required: true,
    maxLength: 100,
    validation: (value) => value.trim().length >= 5 ? null : "Street address must be at least 5 characters"
  },
  city: {
    label: "City",
    placeholder: "Enter city name",
    required: true,
    maxLength: 50,
    validation: (value) => {
      if (!/^[a-zA-Z .'-]+$/.test(value.trim())) return "City must contain only letters and spaces";
      if (value.trim().length < 2) return "City must be at least 2 characters";
      return null;
    }
  },
  state: {
    label: "State/Province",
    placeholder: "Enter state or province (e.g. NY, ON)",
    required: true,
    maxLength: 2,
    validation: (value) => {
      const trimmed = value.trim();
      if (trimmed.length !== 2) return "State/Province must be 2 characters (abbreviation or any 2 letters)";
      if (!/^[a-zA-Z]{2}$/.test(trimmed)) return "State/Province must be 2 letters";
      return null;
    }
  },
  postalCode: {
    label: "Postal Code",
    placeholder: "Enter postal code",
    required: true,
    maxLength: 10,
    validation: (value) => {
      if (usZipRegex.test(value.trim())) return null;
      if (caPostalRegex.test(value.trim())) return null;
      return "Postal code must be a valid US ZIP (12345 or 12345-6789) or Canadian postal code (A1A 1A1)";
    }
  }
};

const AddPatientForm = ({ onClose, onSubmit, initialValues }) => {
  // Initialize form data - if initialValues provided, use for editing mode
  const [formData, setFormData] = useState(() => {
    if (initialValues) {
      return {
        ...initialValues,
        dob: initialValues.dob ? dayjs(initialValues.dob, "DD-MM-YYYY").toDate() : null,
      };
    }
    return {
      firstName: "",
      middleName: "",
      lastName: "",
      dob: null,
      status: "",
      street: "",
      city: "",
      state: "",
      postalCode: "",
    };
  });

  // State for form validation errors and submission status
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle input changes and clear errors when user starts typing
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  // Validate individual field based on fieldConfig rules
  const validateField = (name, value) => {
    const config = fieldConfig[name];
    if (!config) return null;
    
    if (config.required && !value) {
      return `${config.label} is required`;
    }
    
    if (config.validation) {
      return config.validation(value);
    }
    
    return null;
  };

  // Validate entire form and set error state
  const validateForm = () => {
    const newErrors = {};
    Object.keys(fieldConfig).forEach(fieldName => {
      const error = validateField(fieldName, formData[fieldName]);
      if (error) {
        newErrors[fieldName] = error;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form before submission
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle escape key to close modal
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  // Render individual form field based on field type
  const renderField = (fieldName) => {
    const config = fieldConfig[fieldName];
    const error = errors[fieldName];
    const value = formData[fieldName];

    return (
      <div key={fieldName} className="space-y-1">
        <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
          {config.label}
          {config.required && <span className="text-red-500 text-lg">*</span>}
        </label>
        
        <div className="relative">
          {fieldName === 'dob' ? (
            // Date picker for date of birth field
            <div className="relative">
              <DatePicker
                selected={value}
                onChange={(date) => {
                  setFormData({ ...formData, dob: date });
                  if (errors.dob) setErrors({ ...errors, dob: null });
                }}
                dateFormat="dd-MM-yyyy"
                placeholderText={config.placeholder}
                minDate={new Date("1900-01-01")}
                maxDate={new Date()}
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
                className={`w-full border rounded-lg px-3 py-2.5 pr-10 focus:outline-none focus:ring-2 transition-all ${
                  error 
                    ? 'border-red-300 focus:ring-red-400 focus:border-red-400' 
                    : 'border-gray-300 focus:ring-blue-400 focus:border-blue-400'
                }`}
                required={config.required}
              />
              <CalendarIcon className="w-5 h-5 text-gray-400 absolute top-1/2 right-3 transform -translate-y-1/2 pointer-events-none" />
            </div>
          ) : fieldName === 'status' ? (
            // Dropdown for status selection
            <select
              name={fieldName}
              value={value}
              onChange={handleChange}
              className={`w-full border rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 transition-all ${
                error 
                  ? 'border-red-300 focus:ring-red-400 focus:border-red-400' 
                  : 'border-gray-300 focus:ring-blue-400 focus:border-blue-400'
              }`}
              required={config.required}
            >
              <option value="">{config.placeholder}</option>
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          ) : (
            // Regular text input for other fields
            <input
              type="text"
              name={fieldName}
              placeholder={config.placeholder}
              maxLength={config.maxLength}
              value={value}
              onChange={handleChange}
              className={`w-full border rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 transition-all ${
                error 
                  ? 'border-red-300 focus:ring-red-400 focus:border-red-400' 
                  : 'border-gray-300 focus:ring-blue-400 focus:border-blue-400'
              }`}
              required={config.required}
            />
          )}
        </div>
        
        {/* Display validation error if any */}
        {error && (
          <div className="flex items-center gap-1 text-red-600 text-xs">
            <ExclamationTriangleIcon className="w-3 h-3" />
            {error}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Modal header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            {initialValues ? 'Edit Patient' : 'Add New Patient'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 transition-colors"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Form content */}
        <form onSubmit={handleSubmit} onKeyDown={handleKeyDown} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Render all form fields */}
            {Object.keys(fieldConfig).map(renderField)}
          </div>

          {/* Form actions */}
          <div className="flex items-center justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {isSubmitting ? 'Saving...' : (initialValues ? 'Update Patient' : 'Add Patient')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPatientForm;
