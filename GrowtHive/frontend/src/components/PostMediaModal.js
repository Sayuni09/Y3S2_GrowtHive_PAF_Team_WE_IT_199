import React, { useState, useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import Modal from './Modal';

function PostMediaModal({ isOpen, onClose, mediaFiles, API_BASE_URL, initialIndex = 0 }) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isPlaying, setIsPlaying] = useState(false);
  
  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex, isOpen]);

  // Memoize these functions so they don't change on every render
  const handlePrev = useCallback(() => {
    setIsPlaying(false);
    setCurrentIndex((prev) => (prev === 0 ? mediaFiles.length - 1 : prev - 1));
  }, [mediaFiles?.length]);

  const handleNext = useCallback(() => {
    setIsPlaying(false);
    setCurrentIndex((prev) => (prev === mediaFiles.length - 1 ? 0 : prev + 1));
  }, [mediaFiles?.length]);

  useEffect(() => {
    // Add keyboard navigation
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'Escape') onClose();
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handlePrev, handleNext, onClose]);

  if (!mediaFiles || mediaFiles.length === 0) {
    return null;
  }

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const currentMedia = mediaFiles[currentIndex];

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="post-media-modal">
        <button className="modal-close-btn" onClick={onClose}>
          <X size={24} />
        </button>
        
        <div className="modal-media-container">
          {currentMedia.type === 'image' ? (
            <img 
              src={`${API_BASE_URL}${currentMedia.url}`} 
              alt="Post media" 
              className="modal-media"
            />
          ) : (
            <video 
              src={`${API_BASE_URL}${currentMedia.url}`} 
              className="modal-media" 
              controls={isPlaying}
              autoPlay={isPlaying}
              loop
              onClick={togglePlay}
            />
          )}
          
          {mediaFiles.length > 1 && (
            <>
              <button className="modal-nav prev" onClick={handlePrev}>
                <ChevronLeft size={28} />
              </button>
              <button className="modal-nav next" onClick={handleNext}>
                <ChevronRight size={28} />
              </button>
              
              <div className="modal-thumbnails">
                {mediaFiles.map((media, idx) => (
                  <div 
                    key={idx} 
                    className={`thumbnail ${idx === currentIndex ? 'active' : ''}`}
                    onClick={() => setCurrentIndex(idx)}
                  >
                    {media.type === 'image' ? (
                      <img src={`${API_BASE_URL}${media.url}`} alt="Thumbnail" />
                    ) : (
                      <div className="video-thumbnail">
                        <div className="video-icon"></div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
          
          <div className="modal-counter">
            {currentIndex + 1}/{mediaFiles.length}
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default PostMediaModal;
