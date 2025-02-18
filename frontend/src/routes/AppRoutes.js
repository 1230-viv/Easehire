import React from 'react';
import { BrowserRouter as Router, Routes, Route ,Navigate} from 'react-router-dom';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Admin from '../pages/admin';


const AppRoutes = () => {
  const isAuthenticated = !!localStorage.getItem("token");
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={isAuthenticated ? <Admin /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;