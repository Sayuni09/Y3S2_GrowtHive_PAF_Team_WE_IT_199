import React, { useState } from 'react';
import QuizForm from './QuizForm';
import QuizTake from './QuizTake';
import { PlusCircle, Share2, Award, Eye, BarChart } from 'lucide-react';

function QuizList() {
  const [quizzes, setQuizzes] = useState([
    {
      id: 1,
      title: 'Interior Design Styles Recognition',
      description: 'Test your knowledge of different interior design styles',
      questions: [
        {
          question: 'Which style features clean lines, neutral colors, and minimal decoration?',
          options: ['Bohemian', 'Minimalist', 'Baroque', 'Rustic'],
          answer: 'Minimalist',
        },
        {
          question: 'What characterizes the Industrial style?',
          options: ['Exposed brick and pipes', 'Floral patterns', 'Pastel colors', 'Ornate details'],
          answer: 'Exposed brick and pipes',
        },
      ],
      shared: true,
      history: [
        { date: '2025-04-15', score: 8, total: 10 },
        { date: '2025-04-10', score: 7, total: 10 }
      ],
    },
    {
      id: 2,
      title: 'Color Theory in Interior Design',
      description: 'Test your knowledge of color combinations and effects',
      questions: [
        {
          question: 'Which colors are complementary?',
          options: ['Red and Green', 'Blue and Yellow', 'Purple and Green', 'All of the above'],
          answer: 'All of the above',
        },
      ],
      shared: false,
      history: [],
    },
  ]);
  const [showForm, setShowForm] = useState(false);
  const [takeQuiz, setTakeQuiz] = useState(null);
  const [showHistory, setShowHistory] = useState(null);

  const addQuiz = (quiz) => {
    setQuizzes([...quizzes, { ...quiz, id: Date.now(), history: [], description: quiz.description || '' }]);
    setShowForm(false);
  };

  const shareQuiz = (id) => {
    setQuizzes(quizzes.map(q => q.id === id ? { ...q, shared: true } : q));
  };

  const saveQuizResult = (quizId, score, total) => {
    const today = new Date().toISOString().split('T')[0];
    setQuizzes(quizzes.map(q =>
      q.id === quizId
        ? { ...q, history: [...q.history, { date: today, score, total }] }
        : q
    ));
  };

  return (
    <div className="quiz-section">
      <button className="add-quiz-btn" onClick={() => setShowForm(!showForm)}>
        <PlusCircle size={18} />
        {showForm ? 'Close Quiz Creator' : 'Create New Quiz'}
      </button>
      
      {showForm && <QuizForm onSubmit={addQuiz} />}
      
      <h2>Interior Design Quizzes</h2>
      <div className="quizzes-list">
        {quizzes.map(quiz => (
          <div className="quiz-card" key={quiz.id}>
            <div className="card-header">
              {quiz.shared ? 
                <span className="shared-label"><Share2 size={14} /> Shared</span> : 
                <span className="private-label">Private</span>
              }
              <span className="question-count">{quiz.questions.length} Questions</span>
            </div>
            
            <h3 className="quiz-title">{quiz.title}</h3>
            <p>{quiz.description}</p>
            
            <div className="quiz-stats">
              {quiz.history.length > 0 && (
                <div className="quiz-stats-item">
                  <Award size={16} />
                  <span>Best: {Math.max(...quiz.history.map(h => h.score))}/{quiz.questions.length}</span>
                </div>
              )}
              
              {quiz.history.length > 0 && (
                <div className="quiz-stats-item">
                  <BarChart size={16} />
                  <span>Attempts: {quiz.history.length}</span>
                </div>
              )}
            </div>
            
            <div className="card-actions">
              <button className="primary-btn" onClick={() => setTakeQuiz(quiz)}>
                <Eye size={16} /> Take Quiz
              </button>
              
              {!quiz.shared && (
                <button onClick={() => shareQuiz(quiz.id)}>
                  <Share2 size={16} /> Share
                </button>
              )}
              
              {quiz.history.length > 0 && (
                <button 
                  className="history-btn" 
                  onClick={() => setShowHistory(showHistory === quiz.id ? null : quiz.id)}
                >
                  <BarChart size={16} /> 
                  {showHistory === quiz.id ? 'Hide History' : 'Show History'}
                </button>
              )}
            </div>
            
            {showHistory === quiz.id && quiz.history.length > 0 && (
              <div className="quiz-history">
                <strong>Quiz History:</strong>
                <ul>
                  {quiz.history.map((h, i) => (
                    <li key={i}>
                      {h.date}: <strong>{h.score}/{h.total}</strong> ({Math.round(h.score/h.total*100)}%)
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
      
      {takeQuiz && (
        <QuizTake
          quiz={takeQuiz}
          onClose={() => setTakeQuiz(null)}
          onFinish={(score, total) => {
            saveQuizResult(takeQuiz.id, score, total);
            setTakeQuiz(null);
          }}
        />
      )}
    </div>
  );
}

export default QuizList;
