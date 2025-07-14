import React from "react";
import dayjs from "dayjs";
import { XMarkIcon } from "@heroicons/react/24/outline";

const PatientDetailModal = ({ patient, onClose }) => {
  if (!patient) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-bold mb-4">Patient Details</h2>
        <div className="space-y-2">
          <div><span className="font-semibold">Name:</span> {patient.firstName} {patient.middleName} {patient.lastName}</div>
             <div><span className="font-semibold">DOB:</span> {patient.dob ? dayjs(patient.dob).format("DD-MM-YYYY") : "N/A"}</div>
          <div><span className="font-semibold">Status:</span> {patient.status}</div>
          <div><span className="font-semibold">Street:</span> {patient.street}</div>
          <div><span className="font-semibold">City:</span> {patient.city}</div>
          <div><span className="font-semibold">State:</span> {patient.state}</div>
          <div><span className="font-semibold">Postal Code:</span> {patient.postalCode}</div>
        </div>
      </div>
    </div>
  );
};

export default PatientDetailModal; 