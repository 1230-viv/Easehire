import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Admin from '../pages/admin';
import Empd from '../pages/AddEmployee';
import Apptrack from '../pages/Applicant_tracking';
import ExploreJob from '../pages/explorejob';
import Ats from '../pages/ats';
import Mcq from '../pages/mcq';
import ResultsPage from '../pages/ResultsPage'; 
import CodingRound from '../pages/codinground';

const AppRoutes = () => {
  const isAuthenticated = !!localStorage.getItem("token");

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={isAuthenticated ? <Admin /> : <Navigate to="/login" />} />
        <Route path="/admin/app_track" element={isAuthenticated ? <Apptrack /> : <Navigate to="/login" />} />
        <Route path="/expjob" element={<ExploreJob />} />
        <Route path="/empd" element={<Empd />} />
        <Route path="/ats/:employeeId" element={<Ats />} />
        <Route path="/mcq/:jobId" element={<Mcq />} />
        <Route path="/results/:jobId" element={<ResultsPage />} /> {/* ✅ Added ResultsPage route */}
        <Route path="/coding/:jobId" element={<CodingRound />} />

      </Routes>
    </Router>
  );
};

export default AppRoutes;
