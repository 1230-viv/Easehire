import React from 'react';
import { useParams } from 'react-router-dom';

const ResultsPage = () => {
  const { jobId } = useParams();

  return (
    <div>
      <h2>Results for Job ID: {jobId}</h2>
      <p>Your MCQ score has been recorded successfully.</p>
    </div>
  );
};

export default ResultsPage;
