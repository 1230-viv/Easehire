import React from 'react';
import { BrowserRouter as Router, Routes, Route ,Navigate} from 'react-router-dom';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Admin from '../pages/admin';
import Empd from '../pages/AddEmployee';
import Apptrack from '../pages/Applicant_tracking';
import ExploreJob from '../pages/explorejob';
import Ats from '../pages/ats';

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


      </Routes>
    </Router>
  );
};

export default AppRoutes;