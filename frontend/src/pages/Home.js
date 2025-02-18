import React from 'react';
import Navbar from '../components/navbar';
import '../styles/home.css'


const Home = () => {

  return (
    <div>
      <Navbar />
      <h1>Welcome to Home Page</h1>
      <button >Apply for Job</button> {/* Login button */}
    </div>
  );
};

export default Home;