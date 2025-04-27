
import React from 'react';
import SkillPost from '../components/SkillPost';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function SkillPostPage() {
  const navigate = useNavigate();
  
  const handleClose = () => {
    navigate('/dashboard');
  };
  
  const handlePostCreated = (_post) => {
    toast.success('Post created successfully!');
    navigate('/dashboard');
  };
  
  return (
    <div className="skill-post-page">
      <SkillPost 
        onClose={handleClose} 
        onPostCreated={handlePostCreated} 
      />
    </div>
  );
}

export default SkillPostPage;
