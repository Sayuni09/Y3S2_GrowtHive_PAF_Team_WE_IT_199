// src/pages/ExplorePage.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Home, User, Bell, Search, Book, Settings, LogOut, Sofa, Heart, MessageSquare, UserPlus, Check } from 'lucide-react';
import ExploreSection from '../components/ExploreSection';
import NotificationService from '../services/NotificationService';
import '../styles/ExplorePage.css';

function ExplorePage() {
  // Basic user data for the sidebar
  const [userData, setUserData] = useState({
    name: 'E.M.T.T.BANDARANAYAKE',
    profilePicture: 'https://randomuser.me/api/portraits/women/44.jpg',
  });

  // State for notifications
  const [notificationStatus, setNotificationStatus] = useState({
    hasUnread: false,
    unreadCount: 0
  });
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch notification status and user data on component mount
  useEffect(() => {
    // Get user data from local storage
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    // Set user data
    setUserData({
      name: user.name || 'E.M.T.T.BANDARANAYAKE',
      profilePicture: user.profilePicture || 'https://randomuser.me/api/portraits/women/44.jpg',
    });
    
    // Fetch notification status
    fetchNotificationStatus();

    // Set up interval to periodically check for new notifications
    const intervalId = setInterval(fetchNotificationStatus, 60000); // Check every minute
    
    // Clear interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  // Fetch notification status from API
  const fetchNotificationStatus = async () => {
    try {
      const status = await NotificationService.getNotificationStatus();
      setNotificationStatus(status);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching notification status:", error);
      setLoading(false);
    }
  };

  // Fetch notifications when dropdown is opened
  const toggleNotifications = async () => {
    const newState = !showNotifications;
    setShowNotifications(newState);
    
    if (newState && notifications.length === 0) {
      try {
        setLoading(true);
        const data = await NotificationService.getAllNotifications();
        setNotifications(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching notifications:", error);
        setLoading(false);
      }
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      await NotificationService.markAllNotificationsAsRead();
      setNotifications(notifications.map(n => ({ ...n, read: true })));
      setNotificationStatus({ hasUnread: false, unreadCount: 0 });
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  // Mark a single notification as read
  const markAsRead = async (id) => {
    try {
      await NotificationService.markNotificationAsRead(id);
      setNotifications(notifications.map(n => 
        n.id === id ? { ...n, read: true } : n
      ));
      
      const updatedStatus = await NotificationService.getNotificationStatus();
      setNotificationStatus(updatedStatus);
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  // Function to format the timestamp
  const formatTime = (timestamp) => {
    try {
      const date = new Date(timestamp);
      const now = new Date();
      const diffInSeconds = Math.floor((now - date) / 1000);
      
      if (diffInSeconds < 60) {
        return 'just now';
      } else if (diffInSeconds < 3600) {
        const minutes = Math.floor(diffInSeconds / 60);
        return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
      } else if (diffInSeconds < 86400) {
        const hours = Math.floor(diffInSeconds / 3600);
        return `${hours} hour${hours > 1 ? 's' : ''} ago`;
      } else if (diffInSeconds < 2592000) {
        const days = Math.floor(diffInSeconds / 86400);
        return `${days} day${days > 1 ? 's' : ''} ago`;
      } else {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return date.toLocaleDateString(undefined, options);
      }
    } catch (e) {
      console.error("Error formatting date:", e);
      return "Unknown time";
    }
  };

  // Map notification types to their corresponding icons
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'LIKE': return <Heart size={16} />;
      case 'COMMENT': return <MessageSquare size={16} />;
      case 'FOLLOW': return <UserPlus size={16} />;
      default: return <Bell size={16} />;
    }
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
            {notificationStatus.unreadCount > 0 && (
              <div className="notification-badge">{notificationStatus.unreadCount}</div>
            )}
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
            <div className="notification-icon" onClick={toggleNotifications}>
              <Bell size={22} />
              {notificationStatus.unreadCount > 0 && (
                <div className="notification-badge">{notificationStatus.unreadCount}</div>
              )}
            </div>
            
            <Link to="/profile" className="profile-quick-access">
              <img src={userData.profilePicture} alt="Profile" />
              <span>{userData.name.split(' ')[0]}</span>
            </Link>
          </div>
        </header>

        {/* Notifications Panel */}
        {showNotifications && (
          <div className="notifications-panel">
            <div className="notifications-header">
              <h3>
                <Bell size={20} /> 
                Notifications
                {notificationStatus.unreadCount > 0 && (
                  <span className="unread-badge">{notificationStatus.unreadCount}</span>
                )}
              </h3>
              <div className="notification-actions">
                <button 
                  className="mark-read-button" 
                  onClick={markAllAsRead}
                  disabled={notificationStatus.unreadCount === 0}
                >
                  <Check size={16} />
                  <span>Mark All as Read</span>
                </button>
                <button onClick={() => setShowNotifications(false)}>Close</button>
              </div>
            </div>
            
            <div className="notifications-list">
              {loading ? (
                <div className="loading-state">
                  <div className="spinner"></div>
                  <p>Loading notifications...</p>
                </div>
              ) : notifications.length === 0 ? (
                <div className="empty-state">
                  <Bell size={36} />
                  <p>No notifications to display</p>
                </div>
              ) : (
                notifications.map(notification => (
                  <div 
                    key={notification.id} 
                    className={`notification-item ${notification.read ? 'read' : 'unread'}`}
                    onClick={() => !notification.read && markAsRead(notification.id)}
                  >
                    <div className="notification-icon">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="notification-content">
                      <p>{notification.message}</p>
                      <span className="notification-time">{formatTime(notification.createdAt)}</span>
                    </div>
                    {!notification.read && <div className="unread-indicator"></div>}
                  </div>
                ))
              )}
            </div>
            
            {/* <div className="notifications-footer">
              <Link to="/notifications" onClick={() => setShowNotifications(false)}>
                View All Notifications
              </Link>
            </div> */}
          </div>
        )}

        {/* Explore Section Component */}
        <ExploreSection userData={userData} />
      </div>
    </div>
  );
}

export default ExplorePage;
