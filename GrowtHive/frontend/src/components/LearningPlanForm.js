import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

function LearningPlanForm({ onSubmit, initial, onCancel }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    progress: 0,
    status: 'in-progress',
    startDate: '',
    endDate: '',
    priority: 'medium',
    tags: []
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initial) {
      setFormData({
        title: initial.title || '',
        description: initial.description || '',
        progress: initial.progress || 0,
        status: initial.status || 'in-progress',
        startDate: initial.startDate || '',
        endDate: initial.endDate || '',
        priority: initial.priority || 'medium',
        tags: initial.tags || []
      });
    }
  }, [initial]);

  useEffect(() => {
    if (formData.progress === 100) {
      setFormData(prev => ({ ...prev, status: 'completed' }));
    }
  }, [formData.progress]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length < 3) {
      newErrors.title = 'Title must be at least 3 characters long';
    }

    if (formData.description && formData.description.length > 500) {
      newErrors.description = 'Description cannot exceed 500 characters';
    }

    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      if (end < start) {
        newErrors.endDate = 'End date cannot be before start date';
      }
    }

    if (formData.progress < 0 || formData.progress > 100) {
      newErrors.progress = 'Progress must be between 0 and 100';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        ...initial,
        ...formData
      });
      
      if (!initial) {
        setFormData({
          title: '',
          description: '',
          progress: 0,
          status: 'in-progress',
          startDate: '',
          endDate: '',
          priority: 'medium',
          tags: []
        });
      }
      toast.success(initial ? 'Plan updated successfully' : 'Plan created successfully');
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="plan-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="title">Title *</label>
        <input
          id="title"
          name="title"
          type="text"
          placeholder="Enter learning plan title"
          value={formData.title}
          onChange={handleChange}
          className={`form-control ${errors.title ? 'is-invalid' : ''}`}
        />
        {errors.title && <div className="invalid-feedback">{errors.title}</div>}
      </div>

      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          placeholder="Enter plan description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          className={`form-control ${errors.description ? 'is-invalid' : ''}`}
        />
        {errors.description && <div className="invalid-feedback">{errors.description}</div>}
        <small className="text-muted">{formData.description.length}/500 characters</small>
      </div>

      <div className="form-row">
        <div className="form-group col-md-6">
          <label htmlFor="startDate">Start Date</label>
          <input
            id="startDate"
            name="startDate"
            type="date"
            value={formData.startDate}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        <div className="form-group col-md-6">
          <label htmlFor="endDate">End Date</label>
          <input
            id="endDate"
            name="endDate"
            type="date"
            value={formData.endDate}
            onChange={handleChange}
            className={`form-control ${errors.endDate ? 'is-invalid' : ''}`}
          />
          {errors.endDate && <div className="invalid-feedback">{errors.endDate}</div>}
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="priority">Priority</label>
        <select
          id="priority"
          name="priority"
          value={formData.priority}
          onChange={handleChange}
          className="form-control"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="progress">Progress</label>
        <div className="progress-input">
          <input
            id="progress"
            name="progress"
            type="number"
            min="0"
            max="100"
            value={formData.progress}
            onChange={handleChange}
            className={`form-control ${errors.progress ? 'is-invalid' : ''}`}
          />
          <span className="percentage">%</span>
        </div>
        {errors.progress && <div className="invalid-feedback">{errors.progress}</div>}
      </div>

      <div className="form-group">
        <label>Status</label>
        <div className="status-indicator">
          <div className={`status-badge ${formData.status}`}>
            {formData.status === 'completed' ? 'Completed' : 'In Progress'}
          </div>
          <span className="status-hint">
            {formData.status === 'completed' 
              ? '✓ This plan is marked as complete' 
              : '⏳ Set progress to 100% to complete this plan'}
          </span>
        </div>
      </div>

      <div className="form-actions">
        <button 
          type="submit" 
          className="submit-btn"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : (initial ? 'Update Plan' : 'Create Plan')}
        </button>
        {initial && (
          <button 
            type="button" 
            onClick={onCancel} 
            className="cancel-btn"
            disabled={isSubmitting}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default LearningPlanForm;
