// src/pages/NotificationsPage.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Home, User, Bell, Search, PlusCircle, Book, Settings, LogOut, Sofa  } from 'lucide-react';
import Notifications from '../components/Notifications';
import Modal from '../components/Modal';
import SkillPost from '../components/SkillPost';
import '../styles/Dashboard.css';

function NotificationsPage() {
  // Mock data for demonstration
  const [userData, _setUserData] = useState({
    name: 'E.M.T.T.BANDARANAYAKE',
    email: '3lakshana1124@gmail.com',
    profilePicture: 'https://randomuser.me/api/portraits/women/44.jpg',
  });

  const [activeTab] = useState('notifications');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreatePost = () => {
    setIsModalOpen(true);
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
          <Link to="/" className={`menu-item ${activeTab === 'feed' ? 'active' : ''}`}>
            <Home size={22} />
            <span>Home Feed</span>
          </Link>
          <Link to="/explore" className={`menu-item ${activeTab === 'explore' ? 'active' : ''}`}>
            <Search size={22} />
            <span>Explore</span>
          </Link>
          <Link to="/learning-plan" className={`menu-item ${activeTab === 'learning' ? 'active' : ''}`}>
            <Book size={22} />
            <span>Learning Plans</span>
          </Link>
          <Link to="/room-makeover" className={`menu-item ${activeTab === 'room-makeover' ? 'active' : ''}`}>
          <Sofa size={22} />
          <span>Room Makeover</span>
        </Link>
         <Link to="/notifications" className={`menu-item ${activeTab === 'notifications' ? 'active' : ''}`}>
            <Bell size={22} />
            <span>Notifications</span>
            <div className="notification-badge">4</div>
          </Link>
          <Link to="/profile" className={`menu-item ${activeTab === 'profile' ? 'active' : ''}`}>
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
      <div className="dashboard-main">
        {/* Header with search and profile quick access */}
        <header className="dashboard-header">
          <div className="search-container">
            <Search size={20} />
            <input type="text" placeholder="Search notifications..." />
          </div>
          
          <div className="header-actions">
            <button className="create-button" onClick={handleCreatePost}>
              <PlusCircle size={20} />
              <span>Create Post</span>
            </button>
            
            <Link to="/profile" className="profile-quick-access">
              <img src={userData.profilePicture} alt="Profile" />
              <span>{userData.name.split(' ')[0]}</span>
            </Link>
          </div>
        </header>

        {/* Notifications Component */}
        <Notifications />
      </div>

      {/* Right Sidebar - Quick Links & Suggested Content */}
      <div className="dashboard-right-sidebar">
        <div className="quick-actions">
          <h3>Quick Actions</h3>
          <button className="action-button" onClick={handleCreatePost}>
            <PlusCircle size={18} />
            Create New Post
          </button>
          <button className="action-button">
            <Book size={18} />
            Update Learning Plan
          </button>
        </div>

        <div className="trending-topics">
          <h3>Notification Tips</h3>
          <div className="topic-list">
            <div className="topic-item">
              <span>Turn on browser notifications for instant updates</span>
            </div>
            <div className="topic-item">
              <span>Customize notification settings in your profile</span>
            </div>
            <div className="topic-item">
              <span>Filter by type to focus on specific activities</span>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for SkillPost */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <SkillPost onClose={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  );
}

export default NotificationsPage;
