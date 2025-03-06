import React from "react";
import Sidebar from "../../components/admin/Sidebar";
import EmployeeList from "../../components/admin/EmployeeList"; // Import the Employee List Component

const ApplicantTracking = () => {
  return (
    <div className="flex">
      {/* Sidebar on the left */}
      <Sidebar />

      {/* Main Content */}
        
        
        {/* Employee List Component */}
        <EmployeeList />
    </div>
  );
};

export default ApplicantTracking;
