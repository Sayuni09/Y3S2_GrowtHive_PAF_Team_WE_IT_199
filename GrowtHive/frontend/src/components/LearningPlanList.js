import React, { useState } from 'react';
import LearningPlanForm from './LearningPlanForm';
import { Trash2, Edit, CheckCircle, Clock, Award } from 'lucide-react';

function LearningPlanList() {
  const [plans, setPlans] = useState([
    { 
      id: 1, 
      title: 'Color Theory for Interior Design', 
      status: 'in-progress',
      progress: 65,
      description: 'Learn how to use colors effectively in interior spaces'
    },
    { 
      id: 2, 
      title: 'Furniture Arrangement Principles', 
      status: 'completed',
      progress: 100,
      description: 'Master the art of furniture placement for optimal flow'
    },
    { 
      id: 3, 
      title: 'Lighting Design Fundamentals', 
      status: 'in-progress',
      progress: 35,
      description: 'Understanding natural and artificial lighting for spaces'
    },
    { 
      id: 4, 
      title: 'Sustainable Materials', 
      status: 'completed',
      progress: 100,
      description: 'Eco-friendly materials for modern interior design'
    },
  ]);
  const [editingPlan, setEditingPlan] = useState(null);

  const addPlan = (plan) => {
    setPlans([...plans, { ...plan, id: Date.now(), progress: 0 }]);
  };

  const updatePlan = (updatedPlan) => {
    setPlans(plans.map(p => (p.id === updatedPlan.id ? updatedPlan : p)));
    setEditingPlan(null);
  };

  const deletePlan = (id) => {
    setPlans(plans.filter(p => p.id !== id));
  };

  const inProgress = plans.filter(p => p.status === 'in-progress');
  const completed = plans.filter(p => p.status === 'completed');

  return (
    <div className="plans-section">
      {/* Create New Learning Plan section moved above In-Progress section */}
      <div className="plan-form-section">
        <h3>{editingPlan ? 'Edit Learning Plan' : 'Create New Learning Plan'}</h3>
        <LearningPlanForm
          onSubmit={editingPlan ? updatePlan : addPlan}
          initial={editingPlan}
          onCancel={() => setEditingPlan(null)}
        />
      </div>

      <h2>In-Progress Learning Plans</h2>
      <div className="plans-list">
        {inProgress.map(plan => (
          <div className="plan-card" key={plan.id}>
            <div className="card-header">
              <Clock size={18} />
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
              <button onClick={() => deletePlan(plan.id)} className="delete-btn">
                <Trash2 size={16} /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <h2>Completed Learning Plans</h2>
      <div className="plans-list">
        {completed.map(plan => (
          <div className="plan-card completed" key={plan.id}>
            <div className="card-header">
              <Award size={18} />
              <CheckCircle size={18} />
            </div>
            <h3>{plan.title}</h3>
            <p>{plan.description}</p>
            <div className="card-actions">
              <button onClick={() => setEditingPlan(plan)}>
                <Edit size={16} /> Edit
              </button>
              <button onClick={() => deletePlan(plan.id)} className="delete-btn">
                <Trash2 size={16} /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default LearningPlanList;
