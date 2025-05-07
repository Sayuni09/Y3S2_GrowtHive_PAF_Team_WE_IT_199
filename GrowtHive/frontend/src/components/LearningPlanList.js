import React, { useState, useEffect } from 'react';
import LearningPlanForm from './LearningPlanForm';
import { Trash2, Edit, CheckCircle, Clock, Award, BookOpen } from 'lucide-react';
import { getLearningPlans, createLearningPlan, updateLearningPlan, deleteLearningPlan } from '../services/learningPlanService';
import { useNavigate } from 'react-router-dom';

function LearningPlanList() {
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [editingPlan, setEditingPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get user info and token from localStorage
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userId = user.id;

  useEffect(() => {
    if (!token || !userId) {
      navigate('/');
      return;
    }
    fetchLearningPlans();
  }, [userId, token, navigate]);

  const fetchLearningPlans = async () => {
    try {
      setLoading(true);
      const data = await getLearningPlans(userId);
      setPlans(data);
      setError(null);
    } catch (err) {
      console.error('Error details:', err);
      if (err.response) {
        if (err.response.status === 401) {
          setError('Please log in to view your learning plans.');
        } else if (err.response.status === 403) {
          setError('You do not have permission to view these learning plans.');
        } else {
          setError(`Failed to fetch learning plans: ${err.response.data.message || 'Unknown error'}`);
        }
      } else if (err.request) {
        setError('Cannot connect to the server. Please check your internet connection.');
      } else {
        setError('An unexpected error occurred while fetching learning plans.');
      }
    } finally {
      setLoading(false);
    }
  };

  const addPlan = async (plan) => {
    try {
      const newPlan = {
        ...plan,
        userId,
        status: plan.progress === 100 ? 'completed' : 'in-progress'
      };
      const createdPlan = await createLearningPlan(newPlan);
      setPlans([...plans, createdPlan]);
      setError(null);
    } catch (err) {
      setError('Failed to create learning plan');
      console.error(err);
    }
  };

  const updatePlan = async (updatedPlan) => {
    try {
      const result = await updateLearningPlan(updatedPlan.id, {
        ...updatedPlan,
        userId,
        status: updatedPlan.progress === 100 ? 'completed' : 'in-progress'
      });
      setPlans(plans.map(p => (p.id === result.id ? result : p)));
      setEditingPlan(null);
      setError(null);
    } catch (err) {
      setError('Failed to update learning plan');
      console.error(err);
    }
  };

  const deletePlanHandler = async (id) => {
    try {
      await deleteLearningPlan(id);
      setPlans(plans.filter(p => p.id !== id));
      setError(null);
    } catch (err) {
      setError('Failed to delete learning plan');
      console.error(err);
    }
  };

  const inProgress = plans.filter(p => p.status === 'in-progress' || p.progress < 100);
  const completed = plans.filter(p => p.status === 'completed' || p.progress === 100);

  if (!userId) {
    return <div className="error-message">Please log in to view and manage learning plans.</div>;
  }

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="plans-section">
      <div className="plan-form-section">
        <h3>{editingPlan ? 'Edit Learning Plan' : 'Create New Learning Plan'}</h3>
        <LearningPlanForm
          onSubmit={editingPlan ? updatePlan : addPlan}
          initial={editingPlan}
          onCancel={() => setEditingPlan(null)}
        />
      </div>

      <h2>
        <Clock size={24} className="section-icon" />
        In-Progress Learning Plans
      </h2>
      <div className="plans-list">
        {inProgress.map(plan => (
          <div className="plan-card" key={plan.id}>
            <div className="card-header">
              <BookOpen size={20} />
              <span className="progress-indicator">{plan.progress}%</span>
            </div>
            <h3>{plan.title}</h3>
            <p>{plan.description}</p>
            <div className="progress-container">
              <div className="progress-bar" style={{ width: `${plan.progress}%` }}></div>
            </div>
            <div className="card-actions">
              <button onClick={() => setEditingPlan(plan)}>
                <Edit size={16} /> Edit
              </button>
              <button onClick={() => deletePlanHandler(plan.id)} className="delete-btn">
                <Trash2 size={16} /> Delete
              </button>
            </div>
          </div>
        ))}
        {inProgress.length === 0 && (
          <div className="empty-state">
            <Clock size={48} />
            <p>No in-progress learning plans yet</p>
          </div>
        )}
      </div>

      <h2>
        <Award size={24} className="section-icon" />
        Completed Learning Plans
      </h2>
      <div className="plans-list">
        {completed.map(plan => (
          <div className="plan-card completed" key={plan.id}>
            <div className="card-header">
              <Award size={20} />
              <CheckCircle size={20} />
            </div>
            <h3>{plan.title}</h3>
            <p>{plan.description}</p>
            <div className="card-actions">
              <button onClick={() => setEditingPlan(plan)}>
                <Edit size={16} /> Edit
              </button>
              <button onClick={() => deletePlanHandler(plan.id)} className="delete-btn">
                <Trash2 size={16} /> Delete
              </button>
            </div>
          </div>
        ))}
        {completed.length === 0 && (
          <div className="empty-state">
            <Award size={48} />
            <p>No completed learning plans yet</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default LearningPlanList;
