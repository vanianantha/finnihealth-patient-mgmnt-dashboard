import React, { useState, useEffect } from "react";
import api from "../api/api";
import { 
  PencilSquareIcon, 
  TrashIcon, 
  EyeIcon, 
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  XMarkIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  UserIcon
} from "@heroicons/react/24/outline";
import AddPatientForm from "../components/addPatientForm";
import PatientDetailModal from "../components/PatientDetailModal";
import dayjs from "dayjs";

const PatientList = () => {
  // State management for patients and UI
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Search and filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  
  // Modal state for different actions
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [viewPatient, setViewPatient] = useState(null);
  const [editPatient, setEditPatient] = useState(null);

  // State for success and error messages
  const [successMessage, setSuccessMessage] = useState("");
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Available patient status options
  const statusOptions = ["Inquiry", "Onboarding", "Active", "Churned"];

  // Load patients on component mount
  useEffect(() => {
    fetchPatients();
  }, []);

  // Filter patients whenever patients, search, or filter changes
  useEffect(() => {
    filterPatients();
  }, [patients, searchTerm, statusFilter]);

  // Fetch all patients from the API
  const fetchPatients = async () => {
    try {
      setLoading(true);
      setError(null);
      //api call to fetch all the patients
      const response = await api.get("/patients");
      setPatients(response.data.data); // Use the 'data' property from backend response
    } catch (error) {
      console.error("Error fetching patients:", error);
      let errorMsg = "Failed to load patients. Please try again.";
      
      if (error.response) {
        // Server responded with error status
        if (error.response.status === 404) {
          errorMsg = "Patients endpoint not found. Please check the server.";
        } else if (error.response.status === 500) {
          errorMsg = "Server error. Please try again later.";
        } else if (error.response.data?.message) {
          errorMsg = error.response.data.message;
        }
      } else if (error.request) {
        // Network error
        errorMsg = "Network error. Please check your connection.";
      }
      
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Filter patients based on search term and status filter
  const filterPatients = () => {
    let filtered = patients;

    // Apply search filter - search by name, city, or state
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(patient => 
        `${patient.firstName} ${patient.middleName} ${patient.lastName}`.toLowerCase().includes(searchLower) ||
        patient.city?.toLowerCase().includes(searchLower) ||
        patient.state?.toLowerCase().includes(searchLower)
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(patient => patient.status === statusFilter);
    }

    setFilteredPatients(filtered);
  };

  // Handle adding a new patient
  const handleAddPatient = async (newPatient) => {
    try {
      // Format dob to DD-MM-YYYY if present (backend requirement)
      const formattedPatient = {
        ...newPatient,
        dob: newPatient.dob ? dayjs(newPatient.dob).format("DD-MM-YYYY") : undefined,
      };
      await api.post("/patients", formattedPatient);
      fetchPatients(); // Refresh the list
      setShowForm(false);
      setSuccessMessage("Patient added successfully!");
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error("Error adding patient:", error);
      setErrorMessage(error.response?.data?.message || "Failed to add patient. Please try again.");
      setShowError(true);
      setTimeout(() => setShowError(false), 5000);
      throw error;
    }
  };

  // Handle editing an existing patient
  const handleEditPatient = async (updatedPatient) => {
    try {
      const formattedPatient = {
        ...updatedPatient,
        dob: updatedPatient.dob ? dayjs(updatedPatient.dob).format("DD-MM-YYYY") : undefined,
      };
      // Remove _id, createdAt, updatedAt, __v before sending to backend
      const { _id, createdAt, updatedAt, __v, ...body } = formattedPatient;
      await api.put(`/patients/${_id}`, body);
      fetchPatients();
      setEditPatient(null);
      setSuccessMessage("Patient updated successfully!");
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error("Error updating patient:", error);
      setErrorMessage(error.response?.data?.message || "Failed to update patient. Please try again.");
      setShowError(true);
      setTimeout(() => setShowError(false), 5000);
      throw error;
    }
  };

  // Handle delete patient confirmation
  const handleDelete = async (patient) => {
    setPatientToDelete(patient);
    setShowDeleteModal(true);
  };

  // Confirm and execute patient deletion
  const confirmDelete = async () => {
    try {
      await api.delete(`/patients/${patientToDelete._id}`);
      fetchPatients();
      setShowDeleteModal(false);
      setPatientToDelete(null);
      setSuccessMessage("Patient deleted successfully!");
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error("Error deleting patient:", error);
      setErrorMessage(error.response?.data?.message || "Failed to delete patient. Please try again.");
      setShowError(true);
      setTimeout(() => setShowError(false), 5000);
    }
  };

  // Get CSS classes for status badges
  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800 border-green-200";
      case "Onboarding":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Inquiry":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Churned":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Get appropriate icon for each status
  const getStatusIcon = (status) => {
    switch (status) {
      case "Active":
        return <CheckCircleIcon className="w-4 h-4" />;
      case "Onboarding":
        return <ClockIcon className="w-4 h-4" />;
      case "Inquiry":
        return <UserIcon className="w-4 h-4" />;
      case "Churned":
        return <ExclamationTriangleIcon className="w-4 h-4" />;
      default:
        return <UserIcon className="w-4 h-4" />;
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get full name from patient object
  const getFullName = (patient) => {
    const parts = [patient.firstName, patient.middleName, patient.lastName].filter(Boolean);
    return parts.join(" ");
  };

  // Show loading spinner while fetching data
  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header section with title and add button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Patient Management Dashboard</h1>
          <p className="text-gray-600 mt-1">
            {filteredPatients.length} of {patients.length} patients
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-lg hover:shadow-xl"
        >
          <PlusIcon className="w-5 h-5" />
          Add Patient
        </button>
      </div>

      {/* Search and filter controls */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search input */}
          <div className="flex-1">
            <div className="relative">
              <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search patients by name, city, or state..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Status filter dropdown */}
          <div className="lg:w-48">
            <div className="relative">
              <FunnelIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-10 pr-8 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 appearance-none"
              >
                <option value="all">All Status</option>
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Error message display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2 text-red-800">
            <ExclamationTriangleIcon className="w-5 h-5" />
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Success message popup */}
      {showSuccess && (
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2 animate-fade-in">
          <CheckCircleIcon className="w-6 h-6" />
          {successMessage}
        </div>
      )}

      {/* Error message popup */}
      {showError && (
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2 animate-fade-in">
          <ExclamationTriangleIcon className="w-6 h-6" />
          {errorMessage}
        </div>
      )}

      {/* Patients grid display */}
      {filteredPatients.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPatients.map((patient) => (
            <div
              key={patient._id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 overflow-hidden"
            >
              {/* Card header with name and status */}
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">
                      {getFullName(patient)}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      DOB: {formatDate(patient.dob)}
                    </p>
                  </div>
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-full border text-xs font-medium ${getStatusColor(patient.status)}`}>
                    {getStatusIcon(patient.status)}
                    {patient.status}
                  </div>
                </div>
              </div>

              {/* Card body with location info */}
              <div className="p-4">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500 w-16">Location:</span>
                    <span className="text-gray-900">
                      {patient.city}, {patient.state}
                    </span>
                  </div>
                  {patient.postalCode && (
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500 w-16">Postal:</span>
                      <span className="text-gray-900">{patient.postalCode}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Card actions - view, edit, delete buttons */}
              <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setViewPatient(patient)}
                      className="flex items-center gap-1 px-3 py-1.5 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors duration-200"
                      title="View Details"
                    >
                      <EyeIcon className="w-4 h-4" />
                      View
                    </button>
                    <button
                      onClick={() => setEditPatient(patient)}
                      className="flex items-center gap-1 px-3 py-1.5 text-sm text-green-600 hover:text-green-800 hover:bg-green-50 rounded-md transition-colors duration-200"
                      title="Edit Patient"
                    >
                      <PencilSquareIcon className="w-4 h-4" />
                      Edit
                    </button>
                  </div>
                  <button
                    onClick={() => handleDelete(patient)}
                    className="flex items-center gap-1 px-3 py-1.5 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors duration-200"
                    title="Delete Patient"
                  >
                    <TrashIcon className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        // Empty state when no patients found
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <UserIcon className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {patients.length === 0 ? "No patients yet" : "No patients found"}
          </h3>
          <p className="text-gray-500 mb-6">
            {patients.length === 0 
              ? "Get started by adding your first patient."
              : "Try adjusting your search or filter criteria."
            }
          </p>
          {patients.length === 0 && (
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              <PlusIcon className="w-5 h-5" />
              Add Your First Patient
            </button>
          )}
        </div>
      )}

      {/* Add Patient Form Modal */}
      {showForm && (
        <AddPatientForm
          onClose={() => setShowForm(false)}
          onSubmit={handleAddPatient}
        />
      )}

      {/* View Patient Modal */}
      {viewPatient && (
        <PatientDetailModal patient={viewPatient} onClose={() => setViewPatient(null)} />
      )}

      {/* Edit Patient Modal */}
      {editPatient && (
        <AddPatientForm
          onClose={() => setEditPatient(null)}
          onSubmit={handleEditPatient}
          initialValues={editPatient}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && patientToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <ExclamationTriangleIcon className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Delete Patient</h3>
                <p className="text-sm text-gray-600">This action cannot be undone.</p>
              </div>
            </div>
            
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete <strong>{getFullName(patientToDelete)}</strong>? 
              This will permanently remove all patient data.
            </p>
            
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setPatientToDelete(null);
                }}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors duration-200"
              >
                Delete Patient
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientList;
