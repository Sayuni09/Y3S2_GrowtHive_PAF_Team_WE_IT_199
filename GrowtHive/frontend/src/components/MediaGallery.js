import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';

function MediaGallery({ mediaFiles, API_BASE_URL, onClick }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!mediaFiles || mediaFiles.length === 0) {
    return null;
  }

  const handlePrev = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? mediaFiles.length - 1 : prev - 1));
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === mediaFiles.length - 1 ? 0 : prev + 1));
  };

  const currentMedia = mediaFiles[currentIndex];

  return (
    <div className="media-gallery" onClick={onClick}>
      {mediaFiles.length > 1 && (
        <div className="media-indicator">
          {currentIndex + 1}/{mediaFiles.length}
        </div>
      )}
      
      <div className="media-container">
        {currentMedia.type === 'image' ? (
          <img 
            src={`${API_BASE_URL}${currentMedia.url}`} 
            alt="Post content" 
            className="gallery-media"
          />
        ) : (
          <div className="video-container">
            <video 
              src={`${API_BASE_URL}${currentMedia.url}`} 
              className="gallery-media" 
              onClick={(e) => e.stopPropagation()}
            />
            <div className="video-play-overlay">
              <Play size={50} />
            </div>
          </div>
        )}
        
        {mediaFiles.length > 1 && (
          <>
            <button className="gallery-nav prev" onClick={handlePrev}>
              <ChevronLeft size={20} />
            </button>
            <button className="gallery-nav next" onClick={handleNext}>
              <ChevronRight size={20} />
            </button>
            <div className="gallery-dots">
              {mediaFiles.map((_, idx) => (
                <span 
                  key={idx} 
                  className={`dot ${idx === currentIndex ? 'active' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentIndex(idx);
                  }}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default MediaGallery;
