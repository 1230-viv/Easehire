import React from "react";
import Sidebar from '../../components/admin/Sidebar';

const ApplicantTracking = () => {
  return (
    <div className="flex">
      {/* Sidebar on the left */}
      <Sidebar />

      {/* Main Content */}
      <div className="p-4 flex-1">
        <h1>Applicant Tracking System</h1>
        <p>Manage applicants for different jobs here.</p>
      </div>
    </div>
  );
};

export default ApplicantTracking;