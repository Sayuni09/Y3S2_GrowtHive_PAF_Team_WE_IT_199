// src/components/Notifications.js
import React, { useState, useEffect } from 'react';
import { Bell, Heart, MessageSquare, Book, Check, Filter, UserPlus } from 'lucide-react';
import '../styles/Notifications.css';

const notificationIcons = {
  like: Heart,
  comment: MessageSquare,
  plan: Book,
  follow: UserPlus  // Added new icon for follow notifications
};

const mockNotifications = [
  { 
    id: 1, 
    type: 'like', 
    content: 'Alice Parker liked your post "Minimalist Design Tips"', 
    read: false,
    time: '10 minutes ago',
    user: {
      name: 'Alice Parker',
      profile: 'https://randomuser.me/api/portraits/women/42.jpg'
    }
  },
  { 
    id: 2, 
    type: 'comment', 
    content: 'Bob Johnson commented: "This is exactly what I needed. Thanks for sharing these insights!"', 
    read: false,
    time: '2 hours ago',
    user: {
      name: 'Bob Johnson',
      profile: 'https://randomuser.me/api/portraits/men/32.jpg'
    }
  },
  { 
    id: 3, 
    type: 'follow', // Added new follow notification
    content: 'Sophia Rodriguez started following you',
    read: false,
    time: '1 hour ago',
    user: {
      name: 'Sophia Rodriguez',
      profile: 'https://randomuser.me/api/portraits/women/28.jpg'
    }
  },
  { 
    id: 4, 
    type: 'plan', 
    content: 'Your learning plan "React Basics" was updated with 2 new lessons',
    read: true,
    time: 'Yesterday',
    user: {
      name: 'System',
      profile: null
    }
  },
  { 
    id: 5, 
    type: 'like', 
    content: 'Michael Chen and 3 others liked your comment on "Color Theory in Practice"', 
    read: true,
    time: '2 days ago',
    user: {
      name: 'Michael Chen',
      profile: 'https://randomuser.me/api/portraits/men/45.jpg'
    }
  },
  { 
    id: 6, 
    type: 'comment', 
    content: 'Sarah Williams replied to your comment: "I completely agree with your perspective."', 
    read: true,
    time: '3 days ago',
    user: {
      name: 'Sarah Williams',
      profile: 'https://randomuser.me/api/portraits/women/63.jpg'
    }
  },
  { 
    id: 7, 
    type: 'follow', // Added another follow notification
    content: 'David Wilson started following you',
    read: true,
    time: '4 days ago',
    user: {
      name: 'David Wilson',
      profile: 'https://randomuser.me/api/portraits/men/22.jpg'
    }
  }
];

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [showFilterOptions, setShowFilterOptions] = useState(false);

  // Simulate API call to get notifications
  useEffect(() => {
    const timer = setTimeout(() => {
      setNotifications(mockNotifications);
      setLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  const filtered = filter === 'all'
    ? notifications
    : filter === 'unread'
      ? notifications.filter(n => !n.read)
      : notifications.filter(n => n.type === filter);

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const markAsRead = (id) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const toggleFilterOptions = () => {
    setShowFilterOptions(!showFilterOptions);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

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
                <div className={`filter-option ${filter === 'plan' ? 'active' : ''}`} onClick={() => { setFilter('plan'); setShowFilterOptions(false); }}>
                  <Book size={16} />
                  <span>Learning Plans</span>
                </div>
              </div>
            )}
          </div>
          <button className="mark-read-button" onClick={markAllRead} disabled={unreadCount === 0}>
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
            const IconComponent = notificationIcons[notification.type];
            
            return (
              <li 
                key={notification.id} 
                className={`notification-item ${notification.read ? 'read' : 'unread'}`}
                onClick={() => !notification.read && markAsRead(notification.id)}
              >
                <div className="notification-avatar">
                  {notification.user.profile ? (
                    <img src={notification.user.profile} alt={notification.user.name} />
                  ) : (
                    <div className="system-avatar">
                      <Bell size={16} />
                    </div>
                  )}
                </div>
                <div className="notification-content">
                  <div className="notification-message">
                    {notification.content}
                  </div>
                  <div className="notification-meta">
                    <span className="notification-time">{notification.time}</span>
                    <div className={`notification-type-indicator ${notification.type}`}>
                      <IconComponent size={14} />
                      <span>{notification.type}</span>
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
