import React from "react";
import Sidebar from '../../components/admin/Sidebar';

const Help = () => {
  return (
    <div className="flex">
      {/* Sidebar on the left */}
      <Sidebar />

      {/* Main Content */}
      <div className="p-4 flex-1">
        <h1>Help & Support</h1>
        <p>If you have any issues, please contact support.</p>
      </div>
    </div>
  );
};

export default Help;