import React, { useState, useEffect, useCallback } from 'react';
import QuizForm from './QuizForm';
import QuizTake from './QuizTake';
import { PlusCircle, Share2, Award, Eye, BarChart, Trash2 } from 'lucide-react';
import {  createQuiz, updateQuiz, deleteQuiz, getQuizzesByCreator, getSharedQuizzes } from '../services/quizService';
import { useNavigate } from 'react-router-dom';

function QuizList() {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [takeQuiz, setTakeQuiz] = useState(null);
  const [showHistory, setShowHistory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('my'); // 'my' or 'all'

  // Get user info from localStorage
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userId = user.id;

  const fetchQuizzes = useCallback(async () => {
  try {
    setLoading(true);
    let data;
    if (viewMode === 'my') {
      data = await getQuizzesByCreator(userId);
    } else {
      data = await getSharedQuizzes();
    }
    setQuizzes(data);
    setError(null);
  } catch (err) {
    console.error('Error fetching quizzes:', err);
    setError('Failed to load quizzes. Please try again later.');
  } finally {
    setLoading(false);
  }
}, [userId, viewMode]);

useEffect(() => {
  if (!token || !userId) {
    navigate('/');
    return;
  }
  fetchQuizzes();
}, [userId, token, navigate, viewMode, fetchQuizzes]);


  const handleDeleteQuiz = async (id) => {
    if (window.confirm('Are you sure you want to delete this quiz?')) {
      try {
        await deleteQuiz(id);
        setQuizzes(quizzes.filter(q => q.id !== id));
        setError(null);
      } catch (err) {
        console.error('Error deleting quiz:', err);
        setError('Failed to delete quiz. Please try again.');
      }
    }
  };

  const addQuiz = async (quiz) => {
    try {
      console.log('Current user ID:', userId);
      console.log('Token from localStorage:', localStorage.getItem('token'));
      
      const newQuiz = {
        ...quiz,
        creatorId: userId,
        shared: false
      };
      console.log('Sending quiz data:', newQuiz);
      
      const createdQuiz = await createQuiz(newQuiz);
      console.log('Quiz created successfully:', createdQuiz);
      
      setQuizzes([...quizzes, createdQuiz]);
      setShowForm(false);
      setError(null);
    } catch (err) {
      console.error('Error creating quiz:', err);
      if (err.response) {
        console.error('Response status:', err.response.status);
        console.error('Response data:', err.response.data);
      }
      setError('Failed to create quiz. Please try again.');
    }
  };

  const shareQuiz = async (id) => {
    try {
      const quiz = quizzes.find(q => q.id === id);
      if (quiz) {
        const updatedQuiz = await updateQuiz(id, {
          ...quiz,
          shared: true,
          title: quiz.title,
          description: quiz.description,
          questions: quiz.questions,
          history: quiz.history,
          creatorId: quiz.creatorId
        });
        setQuizzes(quizzes.map(q => q.id === id ? updatedQuiz : q));
      }
    } catch (err) {
      console.error('Error sharing quiz:', err);
      setError('Failed to share quiz. Please try again.');
    }
  };

  const saveQuizResult = async (quizId, score, total) => {
    try {
      const quiz = quizzes.find(q => q.id === quizId);
      console.log('Found quiz:', quiz);
      if (quiz) {
        const today = new Date().toISOString().split('T')[0];
        const history = quiz.history || [];
        console.log('Current history:', history);
        const newHistory = [...history, { date: today, score, total }];
        console.log('New history:', newHistory);
        
        const updateData = {
          ...quiz,
          title: quiz.title,
          description: quiz.description,
          questions: quiz.questions,
          shared: quiz.shared,
          creatorId: quiz.creatorId,
          history: newHistory
        };
        console.log('Sending update data:', updateData);
        
        const updatedQuiz = await updateQuiz(quizId, updateData);
        console.log('Received updated quiz:', updatedQuiz);
        setQuizzes(quizzes.map(q => q.id === quizId ? updatedQuiz : q));
      }
    } catch (err) {
      console.error('Error saving quiz result:', err);
      setError('Failed to save quiz result. Please try again.');
    }
  };

  if (loading) return <div className="loading">Loading quizzes...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="quiz-section">
      <div className="quiz-header">
        <div className="view-toggle">
          <button 
            className={viewMode === 'my' ? 'active' : ''} 
            onClick={() => setViewMode('my')}
          >
            My Quizzes
          </button>
          <button 
            className={viewMode === 'all' ? 'active' : ''} 
            onClick={() => setViewMode('all')}
          >
            All Quizzes
          </button>
        </div>
        <button className="add-quiz-btn" onClick={() => setShowForm(!showForm)}>
          <PlusCircle size={18} />
          {showForm ? 'Close Quiz Creator' : 'Create New Quiz'}
        </button>
      </div>
      
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
              <span className="question-count">{quiz.questions?.length || 0} Questions</span>
            </div>
            
            <h3 className="quiz-title">{quiz.title}</h3>
            <p>{quiz.description}</p>
            
            <div className="quiz-stats">
              {quiz.history?.length > 0 && (
                <div className="quiz-stats-item">
                  <Award size={16} />
                  <span>Best: {Math.max(...quiz.history.map(h => h.score))}/{quiz.questions?.length}</span>
                </div>
              )}
              
              {quiz.history?.length > 0 && (
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
              
              {quiz.creatorId === userId && (
                <>
                  {!quiz.shared && (
                    <button onClick={() => shareQuiz(quiz.id)}>
                      <Share2 size={16} /> Share
                    </button>
                  )}
                  <button className="delete-btn" onClick={() => handleDeleteQuiz(quiz.id)}>
                    <Trash2 size={16} /> Delete
                  </button>
                </>
              )}
              
              {(quiz.shared || quiz.history?.length > 0) && (
                <button 
                  className="history-btn" 
                  onClick={() => setShowHistory(showHistory === quiz.id ? null : quiz.id)}
                >
                  <BarChart size={16} /> 
                  {showHistory === quiz.id ? 'Hide History' : 'Show History'}
                </button>
              )}
            </div>
            
            {showHistory === quiz.id && (
              <div className="quiz-history">
                <strong>Quiz History:</strong>
                {quiz.history?.length > 0 ? (
                  <ul>
                    {quiz.history.map((h, i) => (
                      <li key={i}>
                        {h.date}: <strong>{h.score}/{h.total}</strong> ({Math.round(h.score/h.total*100)}%)
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No attempts yet.</p>
                )}
              </div>
            )}
          </div>
        ))}
        {quizzes.length === 0 && (
          <div className="empty-state">
            <Award size={48} />
            <p>No quizzes {viewMode === 'my' ? 'created' : 'available'} yet.</p>
          </div>
        )}
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
