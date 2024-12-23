import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const QuizPage = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState([]); // To store answers for all questions
  const [showAnswers, setShowAnswers] = useState(false); // To toggle answer visibility
  const [currentSelections, setCurrentSelections] = useState([]); // To track selections for the current question
  const navigate = useNavigate();

  // Fetch quiz questions from the JSON file
  useEffect(() => {
    fetch('/Questions.json')
      .then((response) => response.json())
      .then((data) => setQuestions(data));
  }, []);

  // Handle user answer selection
  const handleAnswer = (answer) => {
    // If the answer is already selected, deselect it
    if (currentSelections.includes(answer)) {
      setCurrentSelections(currentSelections.filter((sel) => sel !== answer));
    } else {
      // If the answer is not selected, select it (only allow selecting answers up to the correctAnswers count)
      if (currentSelections.length < questions[currentQuestion].correctAnswers.length) {
        setCurrentSelections([...currentSelections, answer]);
      }
    }
  };

  // Store the current selections for the question when navigating to the next question
  const handleNext = () => {
    // Only store the answers if the question has been answered
    if (currentSelections.length > 0 || currentQuestion === questions.length - 1) {
      // Store the current selections for the current question
      setSelectedAnswers((prev) => {
        const updatedAnswers = [...prev];
        updatedAnswers[currentQuestion] = currentSelections;
        return updatedAnswers;
      });
    }

    // Reset the selections for the next question
    setCurrentSelections([]);
    setShowAnswers(false); // Hide answers when moving to the next question

    // Move to the next question or finish
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateScore();
    }
  };

  // Show correct answers for the current question
  const handleShowAnswers = () => {
    setShowAnswers(true); // Show the correct answers for the current question
  };

  // Navigate to a specific question when clicked in the navigation
  const handleNavigateToQuestion = (index) => {
    setCurrentQuestion(index);
    setCurrentSelections(selectedAnswers[index] || []); // Load previously selected answers for that question
    setShowAnswers(false); // Reset the answer display
  };

  // Calculate score based on user answers
  const calculateScore = () => {
    let score = 0;

    // Loop through each question
    questions.forEach((question, index) => {
      const correctAnswersSet = new Set(question.correctAnswers); // Set of correct answers
      const userAnswersSet = new Set(selectedAnswers[index] || []); // Set of user's answers

      // Compare the user's selected answers with correct answers
      if (
        correctAnswersSet.size === userAnswersSet.size &&
        [...correctAnswersSet].every((answer) => userAnswersSet.has(answer))
      ) {
        score++; // Increment score if all selected answers are correct
      }
    });
    // Calculate the percentage based on the score and total number of questions
    const percentage = ((score / (questions.length - 1)) * 100).toFixed(2);
    navigate('/result', { state: { percentage } });
  };

  // If questions are not loaded yet, show a loading state
  if (!questions.length) return <div>Loading...</div>;

  const { question, answers, correctAnswers, img } = questions[currentQuestion];

  // Map answers to alphabetical identifiers (a, b, c, ...)
  const answerMap = answers.map((answer, index) => ({
    id: String.fromCharCode(97 + index), // Convert index to a letter (a, b, c, ...)
    text: answer,
  }));

  return (
    <div className="mainContainer">
      <div className="quiz-page">

        {/* Count */}
        <div className="question-center">
          <span className="question-counter">
            Question {currentQuestion + 1} / {questions.length}
          </span>
        </div>

        {/* Question */}
        <div className="question-container">
          <h2 className="question-question">{question}</h2>
          {/* Display the question image if it exists */}
          {img && (
            <div className="question-image">
              <img className="question-img" src={`/img/${img}`} />
            </div>
          )}
          <span className="question-center">{`Note: There are ${correctAnswers.length} correct answers to this question`}</span>
          {/* Show Correct Answers */}
        {showAnswers && (
          <div className="question-center">
            <h3>Correct Answers:</h3>
            <ul className="question-correct">
              {correctAnswers.map((correctId, idx) => (
                <li key={idx}>
                  {`${correctId} - ${answerMap.find((ans) => ans.id === correctId)?.text}`}
                </li>
              ))}
            </ul>
          </div>
        )}
          <div className="question-center">
            {!showAnswers && <button className="button-standart" onClick={handleShowAnswers}>Show Answers</button>}
          </div>
          <ul className="question-options">
            {answerMap.map(({ id, text }) => (
              <li key={id} className="question-option">
                <button
                  onClick={() => handleAnswer(id)}
                  className={currentSelections.includes(id) ? 'selected' : ''}
                >
                  {`${id} - ${text}`}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Actions */}
        <div className="question-center">
          <button className="button-standart" onClick={handleNext}>
            {currentQuestion < questions.length - 1 ? 'Next' : 'Finish'}
          </button>
        </div>
      </div>
      <div className="footer">
          {/* Navigation Bar */}
          <div className="question-navbar">
            <div className="question-links">
              {questions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleNavigateToQuestion(index)}
                  className={`question-button ${
                    currentQuestion === index
                      ? 'active'
                      : selectedAnswers[index] && selectedAnswers[index].length > 0
                      ? 'completed'
                      : ''
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>

          {/* Navigation Back */}
          <div className="question-center">
            <button className="question-nav-back" onClick={() => navigate('/')}>Restart Quiz</button>
          </div>
        </div>
    </div>
  );
};

export default QuizPage;
