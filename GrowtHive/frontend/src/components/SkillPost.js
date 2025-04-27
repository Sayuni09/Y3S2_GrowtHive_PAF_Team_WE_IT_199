// D:\SprinBoot_Project\Git Repo\GrowtHive_With_Team\Y3S2_GrowtHive_PAF_Team_WE_IT_199\GrowtHive\frontend\src\components\SkillPost.js

import React, { useState } from 'react';
import '../styles/SkillPost.css';
import SkillPostService from '../services/SkillPostService';
import { toast } from 'react-toastify';

const categories = [
  'Interior Design', 'DIY & Crafts', 'Furniture Design', 'Lighting & Decor'
];

const visibilityOptions = [
  { value: 'public', label: 'Public - Anyone can see' },
  { value: 'followers', label: 'Followers Only' },
  { value: 'private', label: 'Private - Only you can see' }
];

function SkillPost({ onClose, onPostCreated }) {
  const [media, setMedia] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [visibility, setVisibility] = useState('public');
  const [preview, setPreview] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleMediaChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    
    // Validate number of files
    if (selectedFiles.length > 3) {
      toast.warning('Maximum 3 files allowed');
      setMedia(selectedFiles.slice(0, 3));
      return;
    }
    
    // Check file types
    const validFiles = selectedFiles.filter(file => 
      file.type.startsWith('image/') || file.type.startsWith('video/')
    );
    
    if (validFiles.length !== selectedFiles.length) {
      toast.error('Only images and videos are allowed');
    }
    
    setMedia(validFiles);
  };

  const handlePreview = () => setPreview(true);
  const handleEdit = () => setPreview(false);
  
  const handlePublish = async () => {
    // Validation
    if (!title.trim()) {
      setError("Title is required");
      return;
    }
    
    if (!description.trim()) {
      setError("Description is required");
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      const result = await SkillPostService.createPost(
        title,
        description,
        category,
        visibility,
        media
      );
      
      if (result.success) {
        toast.success('Post created successfully!');
        
        // Call the callback if provided
        if (onPostCreated) {
          onPostCreated(result.data);
        }
        
        onClose();
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      console.error('Post creation error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="skillpost-container">
      <h2>Create Skill Sharing Post</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      {!preview ? (
        <form className="skillpost-form">
          <label>
            Upload Photos/Videos (max 3, 30s each):
            <input
              type="file"
              accept="image/*,video/*"
              multiple
              onChange={handleMediaChange}
              max={3}
            />
            <small>Note: Videos longer than 30 seconds will be rejected</small>
          </label>
          
          <label>
            Topic/Title:
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Enter a title for your post..."
              className="title-input"
            />
          </label>
          
          <label>
            Description:
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Describe your skill or tip..."
              rows={3}
            />
          </label>
          
          <div className="form-row">
            <label className="half-width">
              Category:
              <select value={category} onChange={e => setCategory(e.target.value)}>
                <option value="">Select Category</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </label>
            
            <label className="half-width">
              Visibility:
              <select value={visibility} onChange={e => setVisibility(e.target.value)}>
                {visibilityOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
          
          <div className="skillpost-actions">
            <button type="button" className="preview-btn" onClick={handlePreview}>
              Preview Post
            </button>
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="skillpost-preview">
          <h3>Preview</h3>
          <div className="media-preview">
            {media.length > 0 ? (
              media.map((file, idx) => (
                file.type.startsWith('image') ? (
                  <img key={idx} src={URL.createObjectURL(file)} alt="preview" />
                ) : (
                  <video key={idx} src={URL.createObjectURL(file)} controls />
                )
              ))
            ) : (
              <p>No media uploaded</p>
            )}
          </div>
          
          <h4 className="preview-title">{title || 'No title provided'}</h4>
          <p><strong>Description:</strong> {description || 'No description provided'}</p>
          <p><strong>Category:</strong> {category || 'No category selected'}</p>
          <p><strong>Visibility:</strong> {
            visibilityOptions.find(opt => opt.value === visibility)?.label || 'Public'
          }</p>
          
          <div className="preview-actions">
            <button onClick={handleEdit}>Edit</button>
            <button 
              className="publish-btn" 
              onClick={handlePublish} 
              disabled={isLoading}
            >
              {isLoading ? 'Publishing...' : 'Publish'}
            </button>
            <button className="cancel-btn" onClick={onClose}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default SkillPost;
