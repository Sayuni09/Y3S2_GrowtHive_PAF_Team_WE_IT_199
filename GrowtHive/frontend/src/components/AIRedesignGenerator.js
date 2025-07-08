import React, { useState } from 'react';
import { RefreshCw, Download, Zap, Palette, Sofa, Lightbulb } from 'lucide-react';
import '../styles/RoomMakeover.css';
import RoomMakeoverService from '../services/RoomMakeoverService';

function AIRedesignGenerator({ originalImageName, onRedesignGenerated }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [redesignImage, setRedesignImage] = useState(null);
  const [selectedStyle, setSelectedStyle] = useState('SCANDINAVIAN');
  const [error, setError] = useState(null);

  // Get design styles from the service
  const designStyles = RoomMakeoverService.getDesignStyles();

  // Progressive update of the progress bar
  const updateProgress = () => {
    const interval = setInterval(() => {
      setProgress(prevProgress => {
        if (prevProgress >= 95) {
          clearInterval(interval);
          return 95;
        }
        return prevProgress + 5;
      });
    }, 300);
    
    return interval;
  };

  const generateRedesign = async () => {
    if (!originalImageName) {
      setError('Please upload a room photo first');
      return;
    }

    setIsGenerating(true);
    setProgress(0);
    setError(null);
    
    // Start progress animation
    const progressInterval = updateProgress();
    
    try {
      const result = await RoomMakeoverService.generateRoomRedesign(originalImageName, selectedStyle);
      
      clearInterval(progressInterval);
      setProgress(100);
      
      let redesignedImageUrl = null;
      
      // Handle the response format from the server
      if (result.redesignedImage) {
        // Get the filename from the path
        const urlParts = result.redesignedImage.split('/');
        const fileName = urlParts[urlParts.length - 1];
        redesignedImageUrl = RoomMakeoverService.getImageUrl(fileName);
      } else if (result.redesignedImageName) {
        // Directly use redesignedImageName if available
        redesignedImageUrl = RoomMakeoverService.getImageUrl(result.redesignedImageName);
      } else {
        throw new Error('Could not find redesigned image in response');
      }
      
      setRedesignImage(redesignedImageUrl);
      
      if (onRedesignGenerated) {
        onRedesignGenerated(redesignedImageUrl, selectedStyle, result);
      }
    } catch (err) {
      setError(err.message || 'Failed to generate redesign');
      clearInterval(progressInterval);
      setProgress(0);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (redesignImage) {
      const link = document.createElement('a');
      link.href = redesignImage;
      link.download = 'room-redesign.jpg';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="ai-redesign-generator">
      <div className="style-selection">
        <h3>Choose a Design Style</h3>
        <div className="style-options">
          {designStyles.map(style => (
            <div 
              key={style.value}
              className={`style-option ${selectedStyle === style.value ? 'selected' : ''}`}
              onClick={() => setSelectedStyle(style.value)}
            >
              <span className="style-name">{style.label}</span>
              <span className="style-description">{style.description}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="generate-actions">
        <button 
          className="generate-btn" 
          onClick={generateRedesign} 
          disabled={isGenerating || !originalImageName}
        >
          {isGenerating ? <RefreshCw size={18} className="spin" /> : <Zap size={18} />}
          <span>{isGenerating ? 'Generating...' : 'Generate Redesign'}</span>
        </button>
      </div>

      {error && (
        <div className="generate-error">
          <span>{error}</span>
        </div>
      )}

      {isGenerating && (
        <div className="generation-progress">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }}></div>
          </div>
          <div className="progress-steps">
            <div className={`progress-step ${progress >= 25 ? 'active' : ''}`}>
              <Lightbulb size={18} />
              <span>Analyzing room</span>
            </div>
            <div className={`progress-step ${progress >= 50 ? 'active' : ''}`}>
              <Palette size={18} />
              <span>Generating palette</span>
            </div>
            <div className={`progress-step ${progress >= 75 ? 'active' : ''}`}>
              <Sofa size={18} />
              <span>Adding furniture</span>
            </div>
            <div className={`progress-step ${progress >= 100 ? 'active' : ''}`}>
              <Zap size={18} />
              <span>Finalizing design</span>
            </div>
          </div>
        </div>
      )}

      {redesignImage && !isGenerating && (
        <div className="redesign-result">
          <h3>Your AI-Generated Redesign</h3>
          <div className="redesign-image-container">
            <img src={redesignImage} alt="AI Redesigned Room" className="redesign-image" />
          </div>
          <div className="redesign-actions">
            <button className="redesign-action-btn" onClick={handleDownload}>
              <Download size={18} />
              <span>Download</span>
            </button>
            <button className="redesign-action-btn" onClick={generateRedesign}>
              <RefreshCw size={18} />
              <span>Regenerate</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AIRedesignGenerator;
