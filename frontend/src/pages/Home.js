import React from 'react';
import Navbar from '../components/navbar';
import '../styles/home.css'


const Home = () => {

  return (
    <div>
      <Navbar />
      <h1>Welcome to Home Page</h1>
      <a href='/expjob'><button>Apply Job</button></a>
    </div>
  );
};

export default Home;