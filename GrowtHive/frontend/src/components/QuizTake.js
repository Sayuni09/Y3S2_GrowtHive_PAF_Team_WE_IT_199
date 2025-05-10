import React, { useState } from 'react';

function QuizTake({ quiz, onClose, onFinish }) {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState('');
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const question = quiz.questions[current];

  const handleAnswer = (option) => {
    setSelected(option);
  };

  // Helper for case-insensitive, trimmed comparison
  const isCorrect = (userAnswer, correctAnswer) =>
    userAnswer.trim().toLowerCase() === correctAnswer.trim().toLowerCase();

  const next = () => {
    if (isCorrect(selected, question.correctAnswer)) setScore(score + 1);
    setSelected('');
    if (current + 1 < quiz.questions.length) {
      setCurrent(current + 1);
    } else {
      setFinished(true);
      onFinish(score + (isCorrect(selected, question.correctAnswer) ? 1 : 0), quiz.questions.length);
    }
  };

  return (
    <div className="quiz-take-modal">
      <div className="quiz-take-content">
        <button className="close-btn" onClick={onClose}>×</button>
        {!finished ? (
          <>
            <h3>{question.questionText}</h3>
            <div className="quiz-options">
              {question.options.map((opt, idx) => (
                <button
                  key={idx}
                  className={selected === opt ? 'selected' : ''}
                  onClick={() => handleAnswer(opt)}
                >
                  {opt}
                </button>
              ))}
            </div>
            <button className="next-btn" onClick={next} disabled={!selected}>
              {current + 1 === quiz.questions.length ? 'Finish' : 'Next'}
            </button>
          </>
        ) : (
          <div className="quiz-result">
            <h2>Quiz Completed!</h2>
            <p>
              Your Score: <strong>{score}</strong> / {quiz.questions.length}
            </p>
            <button onClick={onClose}>Close</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default QuizTake;
