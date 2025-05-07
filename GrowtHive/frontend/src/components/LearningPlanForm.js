import React, { useState, useEffect } from 'react';

function LearningPlanForm({ onSubmit, initial, onCancel }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('in-progress');

  useEffect(() => {
    if (initial) {
      setTitle(initial.title || '');
      setDescription(initial.description || '');
      setProgress(initial.progress || 0);
      setStatus(initial.status || 'in-progress');
    }
  }, [initial]);

  // Update status when progress changes
  useEffect(() => {
    setStatus(progress === 100 ? 'completed' : 'in-progress');
  }, [progress]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalStatus = progress === 100 ? 'completed' : 'in-progress';
    onSubmit({
      title,
      description,
      progress,
      status: finalStatus
    });
    // Reset form if not editing
    if (!initial) {
      setTitle('');
      setDescription('');
      setProgress(0);
      setStatus('in-progress');
    }
  };

  return (
    <form className="plan-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="title">Title *</label>
        <input
          id="title"
          type="text"
          placeholder="Enter learning plan title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
          className="form-control"
        />
      </div>

      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          placeholder="Enter plan description"
          value={description}
          onChange={e => setDescription(e.target.value)}
          rows={3}
          className="form-control"
        />
      </div>

      <div className="form-group">
        <label htmlFor="progress">Progress</label>
        <div className="progress-input">
          <input
            id="progress"
            type="number"
            min="0"
            max="100"
            value={progress}
            onChange={e => {
              const value = Math.min(100, Math.max(0, parseInt(e.target.value) || 0));
              setProgress(value);
            }}
            className="form-control"
          />
          <span className="percentage">%</span>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="status">Status</label>
        <div className="status-indicator">
          <div className={`status-badge ${status}`}>
            {status === 'completed' ? 'Completed' : 'In Progress'}
          </div>
          <span className="status-hint">
            {status === 'completed' 
              ? '✓ This plan is marked as complete' 
              : '⏳ Set progress to 100% to complete this plan'}
          </span>
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" className="submit-btn">
          {initial ? 'Update Plan' : 'Create Plan'}
        </button>
        {initial && (
          <button type="button" onClick={onCancel} className="cancel-btn">
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default LearningPlanForm;
