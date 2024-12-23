import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const ResultPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  return (
    <div className="mainContainer">
      <div className='homepageContainer'>
        <h1 className="question-center">Your Score</h1>
        <p className="score" >{state.percentage}%</p>
        {state.percentage >= 66 ? <div className="question-end">Well Done! You passed 66%</div> : <div className="question-end"> Try one more time. Less than 66% :( </div>}
        <button className='start-restart' onClick={() => navigate('/')}>Restart Quiz</button>
      </div>
    </div>
  );
};

export default ResultPage;
