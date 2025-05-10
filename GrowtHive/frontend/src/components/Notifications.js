// src/components/Notifications.js
import React, { useState, useEffect } from 'react';
import { Bell, Heart, MessageSquare, UserPlus, Check, Filter } from 'lucide-react';
import NotificationService from '../services/NotificationService';
import '../styles/Notifications.css';

// Map notification types to their corresponding icons
const notificationIcons = {
  LIKE: Heart,
  COMMENT: MessageSquare,
  FOLLOW: UserPlus
};

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [showFilterOptions, setShowFilterOptions] = useState(false);

  // Fetch notifications on component mount
  useEffect(() => {
    fetchNotifications();
  }, []);

  // Function to fetch all notifications
  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const data = await NotificationService.getAllNotifications();
      setNotifications(data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  // Apply filter to notifications
  const filtered = filter === 'all'
    ? notifications
    : filter === 'unread'
      ? notifications.filter(n => !n.read)
      : notifications.filter(n => n.type === filter.toUpperCase());

  // Mark all notifications as read
  const markAllRead = async () => {
    try {
      await NotificationService.markAllNotificationsAsRead();
      // Update local state to reflect all as read
      setNotifications(notifications.map(n => ({ ...n, read: true })));
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  // Mark a single notification as read
  const markAsRead = async (id) => {
    try {
      await NotificationService.markNotificationAsRead(id);
      // Update the specific notification in the local state
      setNotifications(notifications.map(n => 
        n.id === id ? { ...n, read: true } : n
      ));
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const toggleFilterOptions = () => {
    setShowFilterOptions(!showFilterOptions);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  // Function to format the timestamp
  const formatTime = (timestamp) => {
    try {
      // Parse the timestamp string into a Date object
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
        // If more than a month, show date
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return date.toLocaleDateString(undefined, options);
      }
    } catch (e) {
      console.error("Error formatting date:", e);
      return "Unknown time";
    }
  };

  return (
    <div className="notifications-container">
      <div className="notifications-header">
        <h2>
          <Bell size={24} className="notifications-title-icon" />
          Notifications
          {unreadCount > 0 && <span className="unread-badge">{unreadCount}</span>}
        </h2>
        <div className="notifications-controls">
          <div className="filter-dropdown">
            <button className="filter-button" onClick={toggleFilterOptions}>
              <Filter size={18} />
              <span>{filter === 'all' ? 'All' : filter === 'unread' ? 'Unread' : filter.charAt(0).toUpperCase() + filter.slice(1) + 's'}</span>
            </button>
            {showFilterOptions && (
              <div className="filter-options">
                <div className={`filter-option ${filter === 'all' ? 'active' : ''}`} onClick={() => { setFilter('all'); setShowFilterOptions(false); }}>
                  <Bell size={16} />
                  <span>All</span>
                </div>
                <div className={`filter-option ${filter === 'unread' ? 'active' : ''}`} onClick={() => { setFilter('unread'); setShowFilterOptions(false); }}>
                  <Bell size={16} />
                  <span>Unread</span>
                </div>
                <div className={`filter-option ${filter === 'like' ? 'active' : ''}`} onClick={() => { setFilter('like'); setShowFilterOptions(false); }}>
                  <Heart size={16} />
                  <span>Likes</span>
                </div>
                <div className={`filter-option ${filter === 'comment' ? 'active' : ''}`} onClick={() => { setFilter('comment'); setShowFilterOptions(false); }}>
                  <MessageSquare size={16} />
                  <span>Comments</span>
                </div>
                <div className={`filter-option ${filter === 'follow' ? 'active' : ''}`} onClick={() => { setFilter('follow'); setShowFilterOptions(false); }}>
                  <UserPlus size={16} />
                  <span>Follows</span>
                </div>
              </div>
            )}
          </div>
          <button 
            className="mark-read-button" 
            onClick={markAllRead} 
            disabled={unreadCount === 0}
          >
            <Check size={18} />
            <span>Mark All as Read</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading notifications...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <Bell size={48} />
          <p>No {filter !== 'all' ? filter : ''} notifications to display</p>
        </div>
      ) : (
        <ul className="notifications-list">
          {filtered.map(notification => {
            const IconComponent = notificationIcons[notification.type] || Bell;
            
            return (
              <li 
                key={notification.id} 
                className={`notification-item ${notification.read ? 'read' : 'unread'}`}
                onClick={() => !notification.read && markAsRead(notification.id)}
              >
                <div className="notification-avatar">
                  {notification.actorProfilePic ? (
                    <img src={notification.actorProfilePic} alt={notification.actorName} />
                  ) : (
                    <div className="system-avatar">
                      <Bell size={16} />
                    </div>
                  )}
                </div>
                <div className="notification-content">
                  <div className="notification-message">
                    {notification.message}
                  </div>
                  <div className="notification-meta">
                    <span className="notification-time">{formatTime(notification.createdAt)}</span>
                    <div className={`notification-type-indicator ${notification.type.toLowerCase()}`}>
                      <IconComponent size={14} />
                      <span>{notification.type.toLowerCase()}</span>
                    </div>
                  </div>
                </div>
                {!notification.read && (
                  <div className="unread-indicator"></div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default Notifications;
