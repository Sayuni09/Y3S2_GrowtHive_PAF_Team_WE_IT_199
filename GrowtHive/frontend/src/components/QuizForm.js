import React, { useState } from 'react';
import { toast } from 'react-toastify';

function QuizForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    timeLimit: 30, // minutes
    passingScore: 70, // percentage
    questions: [
      { 
        questionText: '', 
        options: ['', '', '', ''], 
        correctAnswer: '',
        explanation: '',
        points: 1
      }
    ]
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateQuestion = (question) => {
    const questionErrors = {};
    
    if (!question.questionText.trim()) {
      questionErrors.questionText = 'Question text is required';
    }

    const emptyOptions = question.options.filter(opt => !opt.trim());
    if (emptyOptions.length > 0) {
      questionErrors.options = 'All options must be filled';
    }

    const uniqueOptions = new Set(question.options.map(opt => opt.trim().toLowerCase()));
    if (uniqueOptions.size !== question.options.length) {
      questionErrors.options = 'Options must be unique';
    }

    if (!question.correctAnswer.trim()) {
      questionErrors.correctAnswer = 'Correct answer is required';
    } else if (!question.options.includes(question.correctAnswer)) {
      questionErrors.correctAnswer = 'Correct answer must match one of the options';
    }

    if (question.points < 1 || question.points > 10) {
      questionErrors.points = 'Points must be between 1 and 10';
    }

    return questionErrors;
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Quiz title is required';
    } else if (formData.title.length < 3) {
      newErrors.title = 'Title must be at least 3 characters long';
    }

    if (formData.description && formData.description.length > 500) {
      newErrors.description = 'Description cannot exceed 500 characters';
    }

    if (formData.timeLimit < 1 || formData.timeLimit > 180) {
      newErrors.timeLimit = 'Time limit must be between 1 and 180 minutes';
    }

    if (formData.passingScore < 0 || formData.passingScore > 100) {
      newErrors.passingScore = 'Passing score must be between 0 and 100';
    }

    if (formData.questions.length < 1) {
      newErrors.questions = 'At least one question is required';
    }

    const questionErrors = formData.questions.map(q => validateQuestion(q));
    if (questionErrors.some(err => Object.keys(err).length > 0)) {
      newErrors.questions = questionErrors;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleQuestionChange = (idx, field, value) => {
    setFormData(prev => {
      const updated = { ...prev };
      if (field === 'questionText' || field === 'correctAnswer' || field === 'explanation' || field === 'points') {
        updated.questions[idx] = {
          ...updated.questions[idx],
          [field]: value
        };
      } else if (typeof field === 'number') {
        updated.questions[idx].options[field] = value;
      }
      return updated;
    });

    // Clear errors for the changed field
    if (errors.questions && errors.questions[idx]) {
      setErrors(prev => ({
        ...prev,
        questions: prev.questions.map((q, i) => 
          i === idx ? { ...q, [field]: '' } : q
        )
      }));
    }
  };

  const addQuestion = () => {
    setFormData(prev => ({
      ...prev,
      questions: [
        ...prev.questions,
        { 
          questionText: '', 
          options: ['', '', '', ''], 
          correctAnswer: '',
          explanation: '',
          points: 1
        }
      ]
    }));
  };

  const removeQuestion = (idx) => {
    if (formData.questions.length > 1) {
      setFormData(prev => ({
        ...prev,
        questions: prev.questions.filter((_, i) => i !== idx)
      }));
    } else {
      toast.warning('Quiz must have at least one question');
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
        ...formData,
        totalPoints: formData.questions.reduce((sum, q) => sum + q.points, 0)
      });
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        timeLimit: 30,
        passingScore: 70,
        questions: [
          { 
            questionText: '', 
            options: ['', '', '', ''], 
            correctAnswer: '',
            explanation: '',
            points: 1
          }
        ]
      });
      toast.success('Quiz created successfully');
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="quiz-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="title">Quiz Title *</label>
        <input
          id="title"
          type="text"
          placeholder="Enter quiz title"
          value={formData.title}
          onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
          className={`form-control ${errors.title ? 'is-invalid' : ''}`}
        />
        {errors.title && <div className="invalid-feedback">{errors.title}</div>}
      </div>

      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          placeholder="Enter quiz description"
          value={formData.description}
          onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
          className={`form-control ${errors.description ? 'is-invalid' : ''}`}
          rows={3}
        />
        {errors.description && <div className="invalid-feedback">{errors.description}</div>}
        <small className="text-muted">{formData.description.length}/500 characters</small>
      </div>

      <div className="form-row">
        <div className="form-group col-md-6">
          <label htmlFor="timeLimit">Time Limit (minutes)</label>
          <input
            id="timeLimit"
            type="number"
            min="1"
            max="180"
            value={formData.timeLimit}
            onChange={e => setFormData(prev => ({ ...prev, timeLimit: parseInt(e.target.value) || 0 }))}
            className={`form-control ${errors.timeLimit ? 'is-invalid' : ''}`}
          />
          {errors.timeLimit && <div className="invalid-feedback">{errors.timeLimit}</div>}
        </div>

        <div className="form-group col-md-6">
          <label htmlFor="passingScore">Passing Score (%)</label>
          <input
            id="passingScore"
            type="number"
            min="0"
            max="100"
            value={formData.passingScore}
            onChange={e => setFormData(prev => ({ ...prev, passingScore: parseInt(e.target.value) || 0 }))}
            className={`form-control ${errors.passingScore ? 'is-invalid' : ''}`}
          />
          {errors.passingScore && <div className="invalid-feedback">{errors.passingScore}</div>}
        </div>
      </div>

      {formData.questions.map((q, idx) => (
        <div key={idx} className="quiz-question-block">
          <div className="question-header">
            <h4>Question {idx + 1}</h4>
            <button
              type="button"
              className="btn btn-danger btn-sm"
              onClick={() => removeQuestion(idx)}
              disabled={formData.questions.length === 1}
            >
              Remove
            </button>
          </div>

          <div className="form-group">
            <label>Question Text *</label>
            <input
              type="text"
              placeholder="Enter your question"
              value={q.questionText}
              onChange={e => handleQuestionChange(idx, 'questionText', e.target.value)}
              className={`form-control ${errors.questions?.[idx]?.questionText ? 'is-invalid' : ''}`}
            />
            {errors.questions?.[idx]?.questionText && (
              <div className="invalid-feedback">{errors.questions[idx].questionText}</div>
            )}
          </div>

          <div className="form-group">
            <label>Options *</label>
            {q.options.map((opt, oidx) => (
              <input
                key={oidx}
                type="text"
                placeholder={`Option ${oidx + 1}`}
                value={opt}
                onChange={e => handleQuestionChange(idx, oidx, e.target.value)}
                className={`form-control ${errors.questions?.[idx]?.options ? 'is-invalid' : ''}`}
              />
            ))}
            {errors.questions?.[idx]?.options && (
              <div className="invalid-feedback">{errors.questions[idx].options}</div>
            )}
          </div>

          <div className="form-group">
            <label>Correct Answer *</label>
            <input
              type="text"
              placeholder="Enter the correct answer (must match one of the options)"
              value={q.correctAnswer}
              onChange={e => handleQuestionChange(idx, 'correctAnswer', e.target.value)}
              className={`form-control ${errors.questions?.[idx]?.correctAnswer ? 'is-invalid' : ''}`}
            />
            {errors.questions?.[idx]?.correctAnswer && (
              <div className="invalid-feedback">{errors.questions[idx].correctAnswer}</div>
            )}
          </div>

          <div className="form-group">
            <label>Explanation</label>
            <textarea
              placeholder="Explain why this is the correct answer"
              value={q.explanation}
              onChange={e => handleQuestionChange(idx, 'explanation', e.target.value)}
              className="form-control"
              rows={2}
            />
          </div>

          <div className="form-group">
            <label>Points</label>
            <input
              type="number"
              min="1"
              max="10"
              value={q.points}
              onChange={e => handleQuestionChange(idx, 'points', parseInt(e.target.value) || 1)}
              className={`form-control ${errors.questions?.[idx]?.points ? 'is-invalid' : ''}`}
            />
            {errors.questions?.[idx]?.points && (
              <div className="invalid-feedback">{errors.questions[idx].points}</div>
            )}
          </div>
        </div>
      ))}

      <div className="form-actions">
        <button 
          type="button" 
          onClick={addQuestion} 
          className="add-question-btn"
          disabled={isSubmitting}
        >
          Add Question
        </button>
        <button 
          type="submit" 
          className="submit-btn"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Creating...' : 'Create Quiz'}
        </button>
      </div>
    </form>
  );
}

export default QuizForm;
