import React, { useState, useEffect } from 'react';
import LearningPlanForm from './LearningPlanForm';
import { Trash2, Edit, CheckCircle, Clock, Award, BookOpen } from 'lucide-react';
import { getLearningPlans, createLearningPlan, updateLearningPlan, deleteLearningPlan } from '../services/learningPlanService';

function LearningPlanList() {
  const [plans, setPlans] = useState([]);
  const [editingPlan, setEditingPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchLearningPlans();
  }, []);

  const fetchLearningPlans = async () => {
    try {
      setLoading(true);
      const data = await getLearningPlans();
      setPlans(data);
      setError(null);
    } catch (err) {
      setError('Cannot connect to the server. Please check your internet connection.');
    } finally {
      setLoading(false);
    }
  };

  const addPlan = async (plan) => {
    try {
      const newPlan = {
        ...plan,
        status: plan.progress === 100 ? 'completed' : 'in-progress'
      };
      const createdPlan = await createLearningPlan(newPlan);
      setPlans([...plans, createdPlan]);
      setError(null);
    } catch (err) {
      setError('Failed to create learning plan');
    }
  };

  const updatePlan = async (updatedPlan) => {
    try {
      console.log("Updating plan with id:", updatedPlan.id, updatedPlan);
      const result = await updateLearningPlan(updatedPlan.id, {
        ...updatedPlan,
        status: updatedPlan.progress === 100 ? 'completed' : 'in-progress'
      });
      setPlans(plans.map(p => (p.id === result.id ? result : p)));
      setEditingPlan(null);
      setError(null);
    } catch (err) {
      setError('Failed to update learning plan');
    }
  };

  const deletePlanHandler = async (id) => {
    try {
      await deleteLearningPlan(id);
      setPlans(plans.filter(p => p.id !== id));
      setError(null);
    } catch (err) {
      setError('Failed to delete learning plan');
    }
  };

  const inProgress = plans.filter(p => p.status === 'in-progress' || p.progress < 100);
  const completed = plans.filter(p => p.status === 'completed' || p.progress === 100);

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
