import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, User, Bell, Search, Book, Trash2, Settings, LogOut, 
         ArrowLeft, Save, Sofa, Loader, AlertTriangle } from 'lucide-react';
import RoomPhotoUploader from '../components/RoomPhotoUploader';
import AIRedesignGenerator from '../components/AIRedesignGenerator';
import BeforeAfterSlider from '../components/BeforeAfterSlider';
import RoomMakeoverService from '../services/RoomMakeoverService';
import '../styles/RoomMakeover.css';

function RoomMakeoverPage() {
  const [step, setStep] = useState(1); // 1: Upload, 2: Generate, 3: Compare
  const [roomPhotoUrl, setRoomPhotoUrl] = useState(null);
  const [originalImageName, setOriginalImageName] = useState(null);
  const [redesignImage, setRedesignImage] = useState(null);
  const [_makeover, setMakeover] = useState(null);
  const [designStyle, setDesignStyle] = useState(null);
  const [saveMessage, setSaveMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [userMakeovers, setUserMakeovers] = useState([]);
  
  const location = useLocation();
  const { fromChallenge, originalImage } = location.state || {};

  // Get user makeovers on component mount
  useEffect(() => {
    fetchUserMakeovers();
  }, []);

  // If coming from challenge with existing image
  useEffect(() => {
    if (fromChallenge && originalImage) {
      setRoomPhotoUrl(originalImage);
      setStep(2); // Skip to design generation step
    }
  }, [fromChallenge, originalImage]);

  const fetchUserMakeovers = async () => {
    try {
      setLoading(true);
      const makeovers = await RoomMakeoverService.getUserMakeovers();
      setUserMakeovers(makeovers);
    } catch (err) {
      console.error('Failed to fetch makeovers:', err);
      // Don't show error message here to avoid cluttering the UI
    } finally {
      setLoading(false);
    }
  };

  const handleImageUploaded = (fileName, imageUrl) => {
    setOriginalImageName(fileName);
    setRoomPhotoUrl(imageUrl);
    setStep(2);
  };

  const handleRedesignGenerated = (imageUrl, style, result) => {
    setRedesignImage(imageUrl);
    setDesignStyle(style);
    setMakeover(result);
    setStep(3);
    // Refresh user makeovers list
    fetchUserMakeovers();
  };

  const handleDeleteMakeover = async (id) => {
    if (!id || !window.confirm('Are you sure you want to delete this makeover?')) return;
    
    try {
      setLoading(true);
      await RoomMakeoverService.deleteMakeover(id);
      setSaveMessage('Makeover deleted successfully');
      // Refresh makeovers list
      fetchUserMakeovers();
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (err) {
      setError('Failed to delete makeover: ' + err.message);
      setTimeout(() => setError(null), 5000);
    } finally {
      setLoading(false);
    }
  };

  const handleViewMakeover = (makeover) => {
    setOriginalImageName(makeover.originalImageName);
    setRoomPhotoUrl(RoomMakeoverService.getImageUrl(makeover.originalImageName));
    setRedesignImage(RoomMakeoverService.getImageUrl(makeover.redesignedImageName));
    setDesignStyle(makeover.designStyle);
    setMakeover(makeover);
    setStep(3);
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  const resetToUpload = () => {
    setStep(1);
    setOriginalImageName(null);
    setRoomPhotoUrl(null);
    setRedesignImage(null);
    setMakeover(null);
  };

  // Try to get user data from localStorage
  const getUserData = () => {
    try {
      const userStr = localStorage.getItem('user');
      if (!userStr) return { name: 'User', profilePicture: 'https://randomuser.me/api/portraits/lego/1.jpg' };
      
      const user = JSON.parse(userStr);
      return {
        name: user.email ? user.email.split('@')[0] : 'User',
        profilePicture: 'https://randomuser.me/api/portraits/lego/1.jpg'
      };
    } catch (e) {
      return { name: 'User', profilePicture: 'https://randomuser.me/api/portraits/lego/1.jpg' };
    }
  };
  
  const userData = getUserData();

  // Extract design style label
  const getDesignStyleLabel = (styleValue) => {
    const style = RoomMakeoverService.getDesignStyles()
      .find(style => style.value === styleValue);
    return style ? style.label : styleValue;
  };

  return (
    <div className="page-container">
      {/* Left Sidebar */}
      <div className="page-sidebar">
        <div className="sidebar-header">
          <div className="logo">
            <Home size={24} className="logo-icon" />
            <span>GrowtHive</span>
          </div>
        </div>
        
        <div className="sidebar-menu">
          <Link to="/dashboard" className="menu-item">
            <Home size={22} />
            <span>Home Feed</span>
          </Link>
          <Link to="/explore" className="menu-item">
            <Search size={22} />
            <span>Explore</span>
          </Link>
          <Link to="/learning-plan" className="menu-item">
            <Book size={22} />
            <span>Learning Plans</span>
          </Link>
          <Link to="/room-makeover" className="menu-item active">
            <Sofa size={22} />
            <span>Room Makeover</span>
          </Link>
          <Link to="/notifications" className="menu-item">
            <Bell size={22} />
            <span>Notifications</span>
            <div className="notification-badge">4</div>
          </Link>
          <Link to="/profile" className="menu-item">
            <User size={22} />
            <span>Profile</span>
          </Link>
          <div className="menu-item">
            <Settings size={22} />
            <span>Settings</span>
          </div>
        </div>

        <div className="sidebar-footer">
          <div className="menu-item logout">
            <LogOut size={22} />
            <span>Logout</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="page-main">
        {/* Header */}
        <header className="page-header">
          <Link to="/dashboard" className="back-button">
            <ArrowLeft size={20} />
            <span>Back to Dashboard</span>
          </Link>
          
          <div className="header-actions">
            <div className="notification-icon" onClick={toggleNotifications}>
              <Bell size={22} />
              <div className="notification-badge">4</div>
            </div>
            
            <Link to="/profile" className="profile-quick-access">
              <img src={userData.profilePicture} alt="Profile" />
              <span>{userData.name}</span>
            </Link>
          </div>
        </header>

        {/* Main Room Makeover Container */}
        <div className="room-makeover-container">
          <div className="makeover-header">
            <h1>Virtual Room Makeover</h1>
            <p>Transform your space with AI-powered design suggestions</p>
          </div>

          {/* Progress Steps */}
          <div className="makeover-progress">
            <div 
              className={`progress-step ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}
              onClick={() => step > 1 && resetToUpload()}
            >
              <div className="step-number">1</div>
              <span>Upload Photo</span>
            </div>
            <div className={`progress-step ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>
              <div className="step-number">2</div>
              <span>Generate Design</span>
            </div>
            <div className={`progress-step ${step >= 3 ? 'active' : ''}`}>
              <div className="step-number">3</div>
              <span>View Results</span>
            </div>
          </div>

          {/* Error and Message Display */}
          {error && (
            <div className="error-message">
              <AlertTriangle size={18} />
              <span>{error}</span>
            </div>
          )}
          
          {saveMessage && (
            <div className="save-message success">
              {saveMessage}
            </div>
          )}

          {/* Step Content */}
          <div className="makeover-content">
            {step === 1 && (
              <div className="makeover-step upload-step">
                <RoomPhotoUploader onImageUploaded={handleImageUploaded} />
                
                {/* Previous Makeovers */}
                {userMakeovers.length > 0 && (
                  <div className="previous-makeovers">
                    <h3>Your Previous Makeovers</h3>
                    {loading ? (
                      <div className="loading-indicator">
                        <Loader size={24} className="spin" />
                        <span>Loading your makeovers...</span>
                      </div>
                    ) : (
                      <div className="makeovers-grid">
                        {userMakeovers.map(makeover => (
                          <div className="makeover-card" key={makeover.id}>
                            <div className="makeover-images">
                              <img 
                                src={RoomMakeoverService.getImageUrl(makeover.redesignedImageName)} 
                                alt="Room Makeover"
                                className="makeover-thumbnail" 
                                onClick={() => handleViewMakeover(makeover)}
                              />
                            </div>
                            <div className="makeover-info">
                              <div className="makeover-style">
                                {getDesignStyleLabel(makeover.designStyle)}
                              </div>
                              <div className="makeover-date">
                                {new Date(makeover.createdAt).toLocaleDateString()}
                              </div>
                              <button 
                                className="delete-makeover" 
                                onClick={() => handleDeleteMakeover(makeover.id)}
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {step === 2 && (
              <div className="makeover-step generate-step">
                <AIRedesignGenerator 
                  originalImageName={originalImageName}
                  onRedesignGenerated={handleRedesignGenerated} 
                />
              </div>
            )}

            {step === 3 && (
              <div className="makeover-step results-step">
                <h2>Before & After Comparison</h2>
                
                <div className="comparison-container">
                  <BeforeAfterSlider 
                    beforeImage={roomPhotoUrl} 
                    afterImage={redesignImage}
                    beforeLabel="Current Room"
                    afterLabel={`${getDesignStyleLabel(designStyle)} Design`}
                  />
                </div>
                
                <div className="results-actions">
                  <button 
                    className="action-button primary"
                    onClick={() => {
                      resetToUpload();
                    }}
                  >
                    <Sofa size={18} />
                    <span>Create New Makeover</span>
                  </button>
                  
                  <button className="action-button download" onClick={() => {
                    const link = document.createElement('a');
                    link.href = redesignImage;
                    link.download = 'room-redesign.jpg';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}>
                    <Save size={18} />
                    <span>Download</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default RoomMakeoverPage;
