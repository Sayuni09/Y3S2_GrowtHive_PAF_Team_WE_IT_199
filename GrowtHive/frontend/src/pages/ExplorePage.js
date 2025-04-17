// src/pages/ExplorePage.js
import React from 'react';
import { Link } from 'react-router-dom';
import { Home, User, Bell, Search, Book, Settings, LogOut, Sofa } from 'lucide-react';
import ExploreSection from '../components/ExploreSection';
import '../styles/ExplorePage.css';

function ExplorePage() {
  // Basic user data for the sidebar
  const userData = {
    name: 'E.M.T.T.BANDARANAYAKE',
    profilePicture: 'https://randomuser.me/api/portraits/women/44.jpg',
  };

  return (
    <div className="page-container">
      {/* Left Sidebar - Kept consistent with the dashboard */}
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
          <Link to="/explore" className="menu-item active">
            <Search size={22} />
            <span>Explore</span>
          </Link>
          <Link to="/learning-plan" className="menu-item">
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
      <div className="page-main">
        {/* Header */}
        <header className="page-header">
          <Link to="/dashboard" className="back-button">
            <Home size={20} />
            <span>Back to Dashboard</span>
          </Link>
          
          <div className="header-actions">
            <div className="notification-icon">
              <Bell size={22} />
              <div className="notification-badge">4</div>
            </div>
            
            <Link to="/profile" className="profile-quick-access">
              <img src={userData.profilePicture} alt="Profile" />
              <span>{userData.name.split(' ')[0]}</span>
            </Link>
          </div>
        </header>

        {/* Explore Section Component */}
        <ExploreSection userData={userData} />
      </div>
    </div>
  );
}

export default ExplorePage;
