import React, { useState } from 'react';

function QuizForm({ onSubmit }) {
  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState([
    { question: '', options: ['', '', '', ''], answer: '' },
  ]);

  const handleQuestionChange = (idx, field, value) => {
    const updated = [...questions];
    if (field === 'question') updated[idx].question = value;
    else if (field === 'answer') updated[idx].answer = value;
    else updated[idx].options[field] = value;
    setQuestions(updated);
  };

  const addQuestion = () => {
    setQuestions([...questions, { question: '', options: ['', '', '', ''], answer: '' }]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || questions.some(q => !q.question || !q.answer)) return;
    onSubmit({ title, questions });
    setTitle('');
    setQuestions([{ question: '', options: ['', '', '', ''], answer: '' }]);
  };

  return (
    <form className="quiz-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Quiz Title"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      {questions.map((q, idx) => (
        <div key={idx} className="quiz-question-block">
          <input
            type="text"
            placeholder={`Question ${idx + 1}`}
            value={q.question}
            onChange={e => handleQuestionChange(idx, 'question', e.target.value)}
          />
          {q.options.map((opt, oidx) => (
            <input
              key={oidx}
              type="text"
              placeholder={`Option ${oidx + 1}`}
              value={opt}
              onChange={e => handleQuestionChange(idx, oidx, e.target.value)}
            />
          ))}
          <input
            type="text"
            placeholder="Correct Answer"
            value={q.answer}
            onChange={e => handleQuestionChange(idx, 'answer', e.target.value)}
          />
        </div>
      ))}
      <button type="button" onClick={addQuestion}>Add Question</button>
      <button type="submit">Save Quiz</button>
    </form>
  );
}

export default QuizForm;
