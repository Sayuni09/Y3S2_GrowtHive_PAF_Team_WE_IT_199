import React, { useState, useRef, useEffect, useCallback } from 'react';
import '../styles/BeforeAfterSlider.css';

function BeforeAfterSlider({ beforeImage, afterImage, beforeLabel = "Before", afterLabel = "After" }) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [imageError, setImageError] = useState(false);
  const containerRef = useRef(null);

  // Reset error state when images change
  useEffect(() => {
    setImageError(false);
  }, [beforeImage, afterImage]);

  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (isDragging && containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const containerWidth = containerRect.width;
      const mouseX = e.clientX - containerRect.left;
      
      // Calculate position as percentage
      let newPosition = (mouseX / containerWidth) * 100;
      
      // Clamp value between 0 and 100
      newPosition = Math.max(0, Math.min(100, newPosition));
      
      setSliderPosition(newPosition);
    }
  }, [isDragging]);

  const handleTouchMove = useCallback((e) => {
    if (containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const containerWidth = containerRect.width;
      const touch = e.touches[0];
      const touchX = touch.clientX - containerRect.left;
      
      // Calculate position as percentage
      let newPosition = (touchX / containerWidth) * 100;
      
      // Clamp value between 0 and 100
      newPosition = Math.max(0, Math.min(100, newPosition));
      
      setSliderPosition(newPosition);
    }
  }, []);

  // Add event listeners for mouse events
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Handle image loading errors
  const handleImageError = () => {
    setImageError(true);
  };

  if (imageError) {
    return (
      <div className="before-after-error">
        <p>Error loading images. Please try again.</p>
      </div>
    );
  }

  return (
    <div 
      className="before-after-container"
      ref={containerRef}
      onTouchMove={handleTouchMove}
    >
      <div className="before-image-container">
        <img 
          src={beforeImage} 
          alt="Before" 
          onError={handleImageError}
        />
        <div className="image-label before-label">{beforeLabel}</div>
      </div>
      
      <div 
        className="after-image-container"
        style={{ width: `${sliderPosition}%` }}
      >
        <img 
          src={afterImage} 
          alt="After" 
          onError={handleImageError}
        />
        <div className="image-label after-label">{afterLabel}</div>
      </div>
      
      <div 
        className="slider-handle"
        style={{ left: `${sliderPosition}%` }}
        onMouseDown={handleMouseDown}
        onTouchStart={() => setIsDragging(true)}
        onTouchEnd={() => setIsDragging(false)}
      >
        <div className="slider-line"></div>
        <div className="slider-circle"></div>
      </div>
    </div>
  );
}

export default BeforeAfterSlider;
