import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Home, User, Bell, Search, Book, MessageSquare, Settings, LogOut, Sofa, Trophy } from 'lucide-react';
import LearningPlanList from '../components/LearningPlanList';
import QuizList from '../components/QuizList';
import '../styles/LearningPlan.css';

function LearningPlan() {
  const [activeTab, setActiveTab] = useState('plans');
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Mock user data (similar to Dashboard.js)
  const userData = {
    name: 'Aththanayake',
    email: '3lakshana1124@gmail.com',
    profilePicture: 'https://randomuser.me/api/portraits/women/44.jpg',
    notifications: [
      { id: 1, type: 'learn', user: 'Design Academy', content: 'published a new course: "Color Theory for Interiors"', time: '2 hours ago' },
      { id: 2, type: 'quiz', user: 'Sarah Johnson', content: 'shared a quiz: "Furniture Style Recognition"', time: '3 hours ago' },
      { id: 3, type: 'complete', user: 'System', content: 'Your "Minimalist Design" learning plan is 80% complete', time: '1 day ago' },
      { id: 4, type: 'reminder', user: 'System', content: 'Quiz reminder: "Interior Design Principles" due tomorrow', time: '2 days ago' }
    ]
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  return (
    <div className="dashboard-container">
      {/* Left Sidebar */}
      <div className="dashboard-sidebar">
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
          <Link to="/learning-plan" className="menu-item active">
            <Book size={22} />
            <span>Learning Plans</span>
          </Link>
          <Link to="/room-makeover" className="menu-item">
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
      <div className="dashboard-main learning-main">
        {/* Header with search and profile quick access */}
        <header className="dashboard-header">
          <div className="search-container">
            <Search size={20} />
            <input 
              type="text" 
              placeholder="Search for learning plans, quizzes..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="header-actions">
            {/* "Create Plan" button removed from here */}
            <div className="notification-icon" onClick={toggleNotifications}>
              <Bell size={22} />
              <div className="notification-badge">4</div>
            </div>
            
            <Link to="/profile" className="profile-quick-access">
              <img src={userData.profilePicture} alt="Profile" />
              <span>{userData.name.split(' ')[0]}</span>
            </Link>
          </div>
        </header>

        {/* Notifications Panel - Shown when clicked */}
        {showNotifications && (
          <div className="notifications-panel">
            <div className="notifications-header">
              <h3>Notifications</h3>
              <button onClick={() => setShowNotifications(false)}>Close</button>
            </div>
            <div className="notifications-list">
              {userData.notifications.map(notification => (
                <div key={notification.id} className={`notification-item ${notification.type}`}>
                  <div className="notification-icon">
                    {notification.type === 'learn' && <Book size={18} />}
                    {notification.type === 'quiz' && <MessageSquare size={18} />}
                    {notification.type === 'complete' && <Trophy size={18} />}
                    {notification.type === 'reminder' && <Bell size={18} />}
                  </div>
                  <div className="notification-content">
                    <p><strong>{notification.user}</strong> {notification.content}</p>
                    <span className="notification-time">{notification.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Learning Plan Section */}
        <div className="learningplan-container">
          <div className="learningplan-header">
            <h1>Interior Design Learning Hub</h1>
            <div className="learningplan-tabs">
              <button
                className={activeTab === 'plans' ? 'active' : ''}
                onClick={() => setActiveTab('plans')}
              >
                <Book size={16} />
                Learning Plans
              </button>
              <button
                className={activeTab === 'quizzes' ? 'active' : ''}
                onClick={() => setActiveTab('quizzes')}
              >
                <MessageSquare size={16} />
                Quizzes
              </button>
            </div>
          </div>
          <div className="learningplan-content">
            {activeTab === 'plans' ? <LearningPlanList /> : <QuizList />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default LearningPlan;
