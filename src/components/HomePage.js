import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="mainContainer">
      <div className="homepageContainer">
        <h1 className="homepageTitle">Welcome to the SAP Quiz C_FIORD_2404</h1>
        <button className="start-restart" onClick={() => navigate('/quiz')}>Start Quiz</button>
      </div>
    </div>
  );
};

export default HomePage;
