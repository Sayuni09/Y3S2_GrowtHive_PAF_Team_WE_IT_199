import React, { useState, useRef } from 'react';
import { Upload, Trash2, Check, AlertTriangle, Loader } from 'lucide-react';
import '../styles/RoomMakeover.css';
import RoomMakeoverService from '../services/RoomMakeoverService';

function RoomPhotoUploader({ onImageUploaded }) {
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    validateAndSetImage(file);
  };

  const validateAndSetImage = (file) => {
    setErrorMessage('');
    
    // Check if file exists
    if (!file) return;
    
    // Check file type
    if (!file.type.match('image/*')) {
      setErrorMessage('Please upload an image file (JPEG, PNG, etc.)');
      return;
    }
    
    // Check file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage('Image size must be less than 5MB');
      return;
    }
    
    setImage(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    validateAndSetImage(file);
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const removeImage = () => {
    setImage(null);
    setPreviewUrl(null);
  };

  const confirmUpload = async () => {
    if (!image) return;
    
    setIsUploading(true);
    setErrorMessage('');
    
    try {
      const response = await RoomMakeoverService.uploadRoomImage(image);
      
      if (response && response.fileName) {
        // Call the parent component callback with image details
        onImageUploaded(
          response.fileName, 
          RoomMakeoverService.getImageUrl(response.fileName),
          response
        );
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      setErrorMessage(error.message || 'Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="room-photo-uploader">
      {!previewUrl ? (
        <div 
          className={`upload-area ${isDragging ? 'dragging' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleFileChange} 
            ref={fileInputRef} 
            style={{ display: 'none' }}
          />
          <Upload size={48} className="upload-icon" />
          <h3>Upload a room photo</h3>
          <p>Drag and drop an image or <button onClick={triggerFileInput} className="upload-btn">browse files</button></p>
          <p className="upload-tip">For best results, use a clear photo of your room with good lighting</p>
          
          {errorMessage && (
            <div className="upload-error">
              <AlertTriangle size={18} />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>
      ) : (
        <div className="preview-container">
          <img src={previewUrl} alt="Room preview" className="room-preview" />
          <div className="preview-actions">
            <button className="preview-action-btn remove" onClick={removeImage} disabled={isUploading}>
              <Trash2 size={18} />
              <span>Remove</span>
            </button>
            <button 
              className="preview-action-btn confirm" 
              onClick={confirmUpload} 
              disabled={isUploading}
            >
              {isUploading ? (
                <>
                  <Loader size={18} className="spin" />
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <Check size={18} />
                  <span>Use This Photo</span>
                </>
              )}
            </button>
          </div>
          
          {errorMessage && (
            <div className="upload-error">
              <AlertTriangle size={18} />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>
      )}

      <div className="photo-tips">
        <h4>Room Photo Tips:</h4>
        <ul>
          <li>Take photos during daylight for natural lighting</li>
          <li>Capture the entire room from a corner angle</li>
          <li>Remove clutter for clearer redesign suggestions</li>
          <li>Include existing furniture for more accurate results</li>
        </ul>
      </div>
    </div>
  );
}

export default RoomPhotoUploader;
