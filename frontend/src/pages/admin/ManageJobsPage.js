import React from "react";
import Sidebar from '../../components/admin/Sidebar';
import JobManagement from '../../components/admin/JobManagement';


const ManageJobsPage = () => {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Job Management Content */}
      <div className="w-3/4 p-4">
        <JobManagement  />
      </div>
    </div>
  );
};

export default ManageJobsPage;