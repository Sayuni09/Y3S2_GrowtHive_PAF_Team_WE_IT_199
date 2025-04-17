import React, { useState, useEffect } from 'react';

function LearningPlanForm({ onSubmit, initial, onCancel }) {
  const [title, setTitle] = useState('');
  const [status, setStatus] = useState('in-progress');

  useEffect(() => {
    if (initial) {
      setTitle(initial.title);
      setStatus(initial.status);
    } else {
      setTitle('');
      setStatus('in-progress');
    }
  }, [initial]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSubmit({ id: initial ? initial.id : undefined, title, status });
    setTitle('');
    setStatus('in-progress');
  };

  return (
    <form className="plan-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Learning Plan Title"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <select value={status} onChange={e => setStatus(e.target.value)}>
        <option value="in-progress">In-Progress</option>
        <option value="completed">Completed</option>
      </select>
      <button type="submit">{initial ? 'Update' : 'Add'}</button>
      {initial && <button type="button" onClick={onCancel}>Cancel</button>}
    </form>
  );
}

export default LearningPlanForm;
