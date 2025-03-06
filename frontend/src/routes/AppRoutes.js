import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from '../pages/Home';
import Login from '../pages/Login';
import AdminHome from "../pages/admin/AdminHome";
import ManageJobsPage from "../pages/admin/ManageJobsPage";
import ApplicantTracking from "../pages/admin/ApplicantTracking";
import Help from "../pages/admin/Help";

import Empd from '../pages/AddEmployee';
import Apptrack from '../pages/Applicant_tracking';
import ExploreJob from '../pages/explorejob';
import Ats from '../pages/ats';
import Mcq from '../pages/mcq';
import ResultsPage from '../pages/ResultsPage';
import CodingRound from '../pages/codinground';
import ContactUs from '../pages/contactus';
import AboutUs from '../pages/aboutus';
import Logout from '../pages/Logout';

const AppRoutes = () => {
  const isAuthenticated = !!localStorage.getItem("token");

  return (
    <Router>
      <Routes>
        {/* Public Routes (No Authentication Required) */}
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/login" element={<Login />} />
        <Route path="/result" element={<ResultsPage />} />
        <Route path="/expjob" element={<ExploreJob />} />
        <Route path="/empd" element={<Empd />} />
        <Route path="/ats/:employeeId" element={<Ats />} />
        <Route path="/mcq/:jobId" element={<Mcq />} />
        <Route path="/results/:jobId" element={<ResultsPage />} />
        <Route path="/coding/:employeeId/:jobId" element={<CodingRound />} />

        {/* Admin Routes (Require Authentication) */}
        <Route path="/AdminHome" element={isAuthenticated ? <AdminHome /> : <Navigate to="/login" />} />
        <Route path="/admin/app_track" element={isAuthenticated ? <Apptrack /> : <Navigate to="/login" />} />
        <Route path="/job-management" element={isAuthenticated ? <ManageJobsPage /> : <Navigate to="/login" />} />
        <Route path="/applicant-tracking" element={isAuthenticated ? <ApplicantTracking /> : <Navigate to="/login" />} />
        <Route path="/help" element={isAuthenticated ? <Help /> : <Navigate to="/login" />} />

        {/* Logout Route */}
        <Route path="/logout" element={<Logout />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
