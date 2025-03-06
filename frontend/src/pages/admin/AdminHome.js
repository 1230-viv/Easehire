// src/pages/admin/AdminHome.js

import React from "react";
import Sidebar from "../../components/admin/Sidebar";
import Dashboard from "../../components/admin/Dashboard";
import "./AdminHome.css";


const AdminHome = () => {
  return (
    <div className="flex">
      {/* Sidebar on the left */}
      <Sidebar />

      {/* Main Content */}
        <Dashboard />
      </div>
  );
};

export default AdminHome;
