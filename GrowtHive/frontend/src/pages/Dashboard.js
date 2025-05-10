// src/pages/Dashboard.js

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, User, Bell, Search, PlusCircle, Book, Heart, MessageSquare, Settings, LogOut, Sofa, Trophy, UserPlus, Check } from 'lucide-react';
import '../styles/Dashboard.css';
import Modal from '../components/Modal';
import SkillPost from '../components/SkillPost';
import CommentSection from '../components/CommentSection';
import MediaGallery from '../components/MediaGallery';
import PostMediaModal from '../components/PostMediaModal';
import LoginFormService from '../services/LoginFormService';
import LikeService from '../services/LikeService';
import NotificationService from '../services/NotificationService';
import axios from 'axios';
import { toast } from 'react-toastify';
import API_BASE_URL from '../services/baseUrl';
import FollowService from '../services/FollowService';

function Dashboard() {
  const navigate = useNavigate();

  // User data
  const [userData, setUserData] = useState({
    name: 'User',
    email: '',
    id: '',
    profilePicture: 'https://randomuser.me/api/portraits/women/44.jpg',
    activitySummary: {
      postsCreated: 24,
      postsLiked: 48,
      commentsReceived: 37,
      designChallenges: 14
    },
    notifications: [
      { id: 1, type: 'like', user: 'Sarah Johnson', content: 'liked your post about "Modern Living Room Design"', time: '2 hours ago' },
      { id: 2, type: 'comment', user: 'Michael Chen', content: 'commented on your post: "Great use of negative space!"', time: '3 hours ago' },
      { id: 3, type: 'follow', user: 'Emma Davis', content: 'started following you', time: '1 day ago' },
      { id: 4, type: 'post', user: 'David Wilson', content: 'shared a new post: "Minimalist Kitchen Essentials"', time: '2 days ago' }
    ]
  });

  // State for notification status
  const [notificationStatus, setNotificationStatus] = useState({
    hasUnread: false,
    unreadCount: 0
  });

  // State for real notifications fetched from backend
  const [notifications, setNotifications] = useState([]);
  const [notificationsLoading, setNotificationsLoading] = useState(false);

  // Posts state
  const [posts, setPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('feed');
  const [showNotifications, setShowNotifications] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Media modal state
  const [activeMediaPost, setActiveMediaPost] = useState(null);
  const [initialMediaIndex, setInitialMediaIndex] = useState(0);

  // --- Suggested Connections & Search ---
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [suggestedLoading, setSuggestedLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchDropdown, setSearchDropdown] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const searchInputRef = useRef(null);

  // Helper function to format timestamps
  const formatTimeAgo = (timestamp) => {
    if (!timestamp) return 'Recently';
    const now = new Date();
    const date = new Date(timestamp);
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays === 0) {
      const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
      if (diffHours === 0) {
        const diffMinutes = Math.floor(diffTime / (1000 * 60));
        return diffMinutes <= 1 ? 'Just now' : `${diffMinutes} minutes ago`;
      }
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  // Fetch notification status
  const fetchNotificationStatus = async () => {
    try {
      const status = await NotificationService.getNotificationStatus();
      setNotificationStatus(status);
    } catch (error) {
      console.error("Error fetching notification status:", error);
    }
  };

  // Fetch notifications
  const fetchNotifications = async () => {
    setNotificationsLoading(true);
    try {
      const data = await NotificationService.getAllNotifications();
      setNotifications(data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setNotificationsLoading(false);
    }
  };

  // Mark notification as read
  const markAsRead = async (id) => {
    try {
      await NotificationService.markNotificationAsRead(id);
      // Update the specific notification in the local state
      setNotifications(notifications.map(n => 
        n.id === id ? { ...n, read: true } : n
      ));
      // Update notification status
      fetchNotificationStatus();
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      await NotificationService.markAllNotificationsAsRead();
      // Update local state to reflect all as read
      setNotifications(notifications.map(n => ({ ...n, read: true })));
      setNotificationStatus({ hasUnread: false, unreadCount: 0 });
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  // Fetch all posts
  const fetchAllPosts = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/api/auth/posts`, {
        headers: {
          'Authorization': token ? `Bearer ${token}` : ''
        }
      });

      const formattedPosts = response.data
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .map(post => ({
          id: post.id,
          user: {
            name: post.userName || 'Anonymous User',
            profilePic: post.userProfilePic || 'https://randomuser.me/api/portraits/lego/1.jpg'
          },
          title: post.title || '',
          content: post.content || '',
          mediaFiles: Array.isArray(post.mediaFiles) ? post.mediaFiles : [],
          image: post.mediaFiles && post.mediaFiles.length > 0 ? post.mediaFiles[0].url : null,
          likes: post.likes || 0,
          userLiked: post.userLiked || false,
          commentCount: post.comments || 0,
          comments: Array.isArray(post.comments) ? post.comments.map(comment => ({
            id: comment.id,
            userId: comment.userId,
            parentId: comment.parentId,
            user: {
              name: comment.userName || 'Anonymous',
              profilePic: comment.userProfilePic || 'https://randomuser.me/api/portraits/lego/1.jpg'
            },
            content: comment.content,
            likes: comment.likes || 0,
            time: formatTimeAgo(comment.createdAt),
            replies: []
          })) : [],
          timestamp: formatTimeAgo(post.createdAt),
          createdAt: post.createdAt,
          showComments: false
        }));

      setPosts(formattedPosts);

      // Fetch like status for each post
      try {
        const postIds = formattedPosts.map(post => post.id);
        const likeStatuses = await LikeService.batchGetLikeStatus(postIds);
        setPosts(posts => posts.map(post => {
          const status = likeStatuses[post.id];
          return status ? {...post, userLiked: status.liked, likes: status.likeCount} : post;
        }));
      } catch (error) {
        console.error('Error fetching like statuses:', error);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast.error('Failed to load posts. Please try again later.');
      setLoading(false);
    }
  }, []);

  // Check for token in URL parameters on component mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const userInfo = params.get('user');
    if (token) {
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      if (userInfo) {
        try {
          const user = JSON.parse(decodeURIComponent(userInfo));
          localStorage.setItem('user', JSON.stringify(user));
        } catch (e) {
          console.error('Failed to parse user info:', e);
        }
      }
      navigate('/dashboard', { replace: true });
      toast.success('Successfully logged in with Google!');
    }
  }, [navigate]);

  // Load user data from localStorage on component mount
  useEffect(() => {
    // Get user data from local storage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUserData(prevData => ({
          ...prevData,
          id: parsedUser.id || '',
          name: parsedUser.name || 'User',
          email: parsedUser.email || '',
          profilePicture: parsedUser.profilePicture || prevData.profilePicture
        }));
      } catch (err) {
        console.error('Error parsing stored user data:', err);
      }
    }
    fetchAllPosts();
    
    // Fetch notification status on mount
    fetchNotificationStatus();

    // Set up interval to periodically check for new notifications
    const intervalId = setInterval(fetchNotificationStatus, 60000); // Check every minute
    
    // Clear interval on component unmount
    return () => clearInterval(intervalId);
  }, [fetchAllPosts]);

  // Fetch 3 recently registered users for Suggested Connections
  useEffect(() => {
    const fetchSuggestedUsers = async () => {
      if (!userData.id) return;
      setSuggestedLoading(true);
      try {
        const token = localStorage.getItem('jwt-token') || localStorage.getItem('token');
        const res = await axios.get(`${API_BASE_URL}/api/auth/users/search?query=`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        let users = res.data
          .filter(u => u.id !== userData.id)
          .sort((a, b) => (b.createdAt && a.createdAt ? new Date(b.createdAt) - new Date(a.createdAt) : 0));
        if (!users.length || !users[0].createdAt) {
          users = res.data.filter(u => u.id !== userData.id).slice(-3).reverse();
        } else {
          users = users.slice(0, 3);
        }
        setSuggestedUsers(users);
      } catch (e) {
        setSuggestedUsers([]);
      }
      setSuggestedLoading(false);
    };
    fetchSuggestedUsers();
  }, [userData.id]);

  // Follow/unfollow handlers
  const handleFollow = async (userId, updateListFn) => {
    if (!userData.id || userId === userData.id) {
      toast.error("You cannot follow yourself");
      return;
    }
    try {
      await FollowService.followUser(userId);
      toast.success('Followed user!');
      if (updateListFn) updateListFn(userId, true);
    } catch (e) {
      toast.error(
        e?.response?.data?.error ||
        (e?.response?.data?.message ? e.response.data.message : 'Could not follow user')
      );
    }
  };


  // Search Bar with Dropdown
  useEffect(() => {
    if (!searchTerm.trim()) {
      setSearchDropdown([]);
      return;
    }
    let active = true;
    setSearchLoading(true);
    const fetchSearch = async () => {
      try {
        const token = localStorage.getItem('jwt-token') || localStorage.getItem('token');
        const res = await axios.get(`${API_BASE_URL}/api/auth/users/search?query=${encodeURIComponent(searchTerm)}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (active) {
          setSearchDropdown(res.data.filter(u => u.id !== userData.id));
        }
      } catch (e) {
        setSearchDropdown([]);
      }
      setSearchLoading(false);
    };
    const timer = setTimeout(fetchSearch, 300);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [searchTerm, userData.id]);

  // Update follow status in dropdown
  const updateDropdownFollowStatus = (userId, isFollowing) => {
    setSearchDropdown(dropdown =>
      dropdown.map(u => (u.id === userId ? { ...u, isFollowing } : u))
    );
  };

  // Update follow status in suggested users
  const updateSuggestedFollowStatus = (userId, isFollowing) => {
    setSuggestedUsers(users =>
      users.map(u => (u.id === userId ? { ...u, isFollowing } : u))
    );
  };

  // Function to format notification time
  const formatNotificationTime = (timestamp) => {
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

  // Get notification icon based on type
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'LIKE':
        return <Heart size={18} />;
      case 'COMMENT':
        return <MessageSquare size={18} />;
      case 'FOLLOW':
        return <UserPlus size={18} />;
      default:
        return <Bell size={18} />;
    }
  };

  // --- UI Functions ---
  const openMediaModal = (post, index = 0) => {
    setActiveMediaPost(post);
    setInitialMediaIndex(index);
  };

  const closeMediaModal = () => {
    setActiveMediaPost(null);
  };

  const navigateToMakeoverChallenges = () => {
    navigate('/makeover-challenges');
  };

  const navigateToRoomMakeover = () => {
    navigate('/room-makeover');
  };

  const handleLogout = () => {
    LoginFormService.logout();
    navigate('/');
  };

  const toggleNotifications = async () => {
    const newState = !showNotifications;
    setShowNotifications(newState);
    
    // Fetch notifications when opening the panel
    if (newState && notifications.length === 0) {
      await fetchNotifications();
    }
  };

  const handleCreatePost = () => {
    setIsModalOpen(true);
  };

  // Handle new post creation
  const handlePostCreated = (newPost) => {
    setUserData(prevData => ({
      ...prevData,
      activitySummary: {
        ...prevData.activitySummary,
        postsCreated: prevData.activitySummary.postsCreated + 1
      }
    }));
    const newPostForFeed = {
      id: newPost.id,
      user: {
        name: userData.name,
        profilePic: userData.profilePicture
      },
      title: newPost.title,
      content: newPost.content,
      mediaFiles: newPost.mediaFiles || [],
      image: newPost.mediaFiles && newPost.mediaFiles.length > 0 ?
        (newPost.mediaFiles[0].type === 'image' ? newPost.mediaFiles[0].url : null) : null,
      likes: 0,
      comments: [],
      timestamp: 'Just now',
      createdAt: new Date().toISOString(),
      showComments: false
    };
    setPosts(prevPosts => [newPostForFeed, ...prevPosts]);
    toast.success('Your post has been published!');
  };

  // Toggle comments visibility for a post
  const toggleComments = (postId) => {
    setPosts(posts.map(post =>
      post.id === postId ? { ...post, showComments: !post.showComments } : post
    ));
  };

  // Add a new comment to a post
  const addComment = (postId, commentText) => {
    if (!commentText.trim()) return;
    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        const newCommentObj = {
          id: Date.now(),
          userId: userData.id,
          parentId: null,
          user: {
            name: userData.name,
            profilePic: userData.profilePicture
          },
          content: commentText,
          likes: 0,
          time: 'Just now',
          replies: []
        };
        return {
          ...post,
          comments: [...post.comments, newCommentObj],
          commentCount: (post.commentCount || 0) + 1
        };
      }
      return post;
    });
    setPosts(updatedPosts);
  };

  // Add a reply to a comment
  const addReply = (postId, commentId, replyContent, isLikedPost = false) => {
    if (!replyContent.trim()) return;
    const newReply = {
      id: Date.now(),
      userId: userData.id,
      parentId: commentId,
      user: {
        name: userData.name,
        profilePic: userData.profilePicture
      },
      content: replyContent,
      likes: 0,
      time: 'Just now',
      replies: []
    };
    if (isLikedPost) {
      setLikedPosts(likedPosts.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            comments: [...post.comments, newReply],
            commentCount: (post.commentCount || 0) + 1
          };
        }
        return post;
      }));
    } else {
      setPosts(posts.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            comments: [...post.comments, newReply],
            commentCount: (post.commentCount || 0) + 1
          };
        }
        return post;
      }));
    }
    return true;
  };

  // Like a comment
  const likeComment = (postId, commentId, replyId = null) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        const updatedComments = post.comments.map(comment => {
          if (replyId) {
            if (comment.id === replyId) {
              return { ...comment, likes: comment.likes + 1 };
            }
          } else if (comment.id === commentId) {
            return { ...comment, likes: comment.likes + 1 };
          }
          return comment;
        });
        return { ...post, comments: updatedComments };
      }
      return post;
    }));
  };

  // Like a post
  const likePost = async (postId) => {
    try {
      const response = await LikeService.toggleLike(postId);
      const { liked, likeCount } = response;
      setPosts(posts.map(post =>
        post.id === postId ? { ...post, likes: likeCount, userLiked: liked } : post
      ));
      if (liked) {
        setUserData(prevData => ({
          ...prevData,
          activitySummary: {
            ...prevData.activitySummary,
            postsLiked: prevData.activitySummary.postsLiked + 1
          }
        }));
      } else {
        setUserData(prevData => ({
          ...prevData,
          activitySummary: {
            ...prevData.activitySummary,
            postsLiked: Math.max(0, prevData.activitySummary.postsLiked - 1)
          }
        }));
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      toast.error('Failed to update like status. Please try again.');
    }
  };

  // --- Render ---
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
          <div className={`menu-item ${activeTab === 'feed' ? 'active' : ''}`} onClick={() => setActiveTab('feed')}>
            <Home size={22} />
            <span>Home Feed</span>
          </div>
          <Link to="/explore" className={`menu-item ${activeTab === 'explore' ? 'active' : ''}`}>
            <Search size={22} />
            <span>Explore</span>
          </Link>
          <Link to="/learning-plan" className={`menu-item ${activeTab === 'learning' ? 'active' : ''}`}>
            <Book size={22} />
            <span>Learning Plans</span>
          </Link>
          <Link to="/room-makeover" className="menu-item">
            <Sofa size={22} />
            <span>Room Makeover</span>
          </Link>
          <Link to="/notifications" className={`menu-item ${activeTab === 'notifications' ? 'active' : ''}`}>
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
          <div className="menu-item logout" onClick={handleLogout}>
            <LogOut size={22} />
            <span>Logout</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="dashboard-main">
        {/* Header with search and profile quick access */}
        <header className="dashboard-header">
          <div className="search-container" style={{ position: 'relative' }}>
            <Search size={20} />
            <input
              type="text"
              placeholder="Search designs, techniques, users..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
              ref={searchInputRef}
              autoComplete="off"
            />
            {searchFocused && searchTerm && (
              <div className="search-dropdown">
                {searchLoading ? (
                  <div className="dropdown-row">Searching...</div>
                ) : searchDropdown.length === 0 ? (
                  <div className="dropdown-row">No users found.</div>
                ) : (
                  searchDropdown.map(user => (
                    <div className="dropdown-row" key={user.id}>
                      <div className="dropdown-user-info">
                        <img
                          src={user.profilePicture || 'https://randomuser.me/api/portraits/lego/2.jpg'}
                          alt={user.name}
                          className="dropdown-user-avatar"
                          style={{ width: 32, height: 32, borderRadius: '50%', marginRight: 8 }}
                        />
                        <span>{user.name}</span>
                        <span style={{ fontSize: 12, color: '#888', marginLeft: 8 }}>{user.email}</span>
                      </div>
                      <button
                        className="follow-button"
                        disabled={user.isFollowing || user.id === userData.id}
                        onClick={() => handleFollow(user.id, updateDropdownFollowStatus)}
                        style={{ marginLeft: 'auto' }}
                      >
                        {user.isFollowing ? 'Following' : 'Follow'}
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
          <div className="header-actions">
            <button className="create-button" onClick={handleCreatePost}>
              <PlusCircle size={20} />
              <span>Create Post</span>
            </button>
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
              {notificationsLoading ? (
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
                      <span className="notification-time">{formatNotificationTime(notification.createdAt)}</span>
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

        {/* Activity Summary Widgets */}
        <div className="activity-summary">
          <div className="summary-widget">
            <div className="widget-icon posts-icon">
              <PlusCircle size={24} />
            </div>
            <div className="widget-content">
              <h3>{userData.activitySummary.postsCreated}</h3>
              <p>Posts Created</p>
            </div>
          </div>
          <div className="summary-widget">
            <div className="widget-icon likes-icon">
              <Heart size={24} />
            </div>
            <div className="widget-content">
              <h3>{userData.activitySummary.postsLiked}</h3>
              <p>Posts Liked</p>
            </div>
          </div>
          <div
            className="summary-widget challenges-widget"
            onClick={navigateToMakeoverChallenges}
            style={{ cursor: 'pointer' }}
          >
            <div className="widget-icon challenges-icon">
              <Trophy size={24} />
            </div>
            <div className="widget-content">
              <h3>{userData.activitySummary.designChallenges}</h3>
              <p className="design-challenges-text">Design Challenges</p>
            </div>
          </div>
          <div className="summary-widget">
            <div className="widget-icon comments-icon">
              <MessageSquare size={24} />
            </div>
            <div className="widget-content">
              <h3>{userData.activitySummary.commentsReceived}</h3>
              <p>Comments Received</p>
            </div>
          </div>
        </div>

        {/* Feed Section */}
        <section className="feed-section">
          <h2>Your Feed</h2>
          <div className="posts-container">
            {loading ? (
              <div className="loading-posts">
                <p>Loading posts...</p>
              </div>
            ) : posts.length === 0 ? (
              <div className="no-posts">
                <p>No posts found. Start by creating your first post!</p>
              </div>
            ) : (
              posts.map(post => (
                <div key={post.id} className="post-card">
                  <div className="post-header">
                    <img src={post.user.profilePic} alt={post.user.name} className="user-avatar" />
                    <div className="post-info">
                      <h4>{post.user.name}</h4>
                      <span className="post-time">{post.timestamp}</span>
                    </div>
                  </div>
                  <h3 className="post-title">{post.title}</h3>
                  <p className="post-content">{post.content}</p>
                  {post.mediaFiles && post.mediaFiles.length > 0 && (
                    <MediaGallery
                      mediaFiles={post.mediaFiles}
                      API_BASE_URL={API_BASE_URL}
                      onClick={() => openMediaModal(post)}
                    />
                  )}
                  <div className="post-actions">
                    <div className="action-button" onClick={() => likePost(post.id)}>
                      <Heart size={20} className={post.userLiked ? "liked-heart" : ""} />
                      <span>{post.likes}</span>
                    </div>
                    <div
                      className={`action-button ${post.showComments ? 'active' : ''}`}
                      onClick={() => toggleComments(post.id)}
                    >
                      <MessageSquare size={20} />
                      <span>{post.commentCount || post.comments.length}</span>
                    </div>
                  </div>
                  {post.showComments && (
                    <CommentSection
                      post={post}
                      userData={userData}
                      onAddComment={addComment}
                      onAddReply={addReply}
                      onLikeComment={likeComment}
                      onClose={() => toggleComments(post.id)}
                    />
                  )}
                </div>
              ))
            )}
          </div>
        </section>
      </div>

      {/* Right Sidebar */}
      <div className="dashboard-right-sidebar">
        <div className="quick-actions">
          <h3>Quick Actions</h3>
          <button className="action-button" onClick={handleCreatePost}>
            <PlusCircle size={18} />
            Create New Post
          </button>
          <button className="action-button" onClick={navigateToRoomMakeover}>
            <Sofa size={18} />
            Try Room Makeover
          </button>
          <button className="action-button" onClick={navigateToMakeoverChallenges}>
            <Trophy size={18} />
            Design Challenges
          </button>
        </div>

        <div className="suggested-connections">
          <h3>Suggested Connections</h3>
          <div className="connection-list">
            {suggestedLoading ? (
              <div className="connection-item">Loading...</div>
            ) : suggestedUsers.length === 0 ? (
              <div className="connection-item">No suggestions</div>
            ) : (
              suggestedUsers.map(user => (
                <div className="connection-item" key={user.id}>
                  <img
                    src={user.profilePicture || 'https://randomuser.me/api/portraits/lego/3.jpg'}
                    alt={user.name}
                  />
                  <div className="connection-info">
                    <h4>{user.name}</h4>
                    <p>{user.email}</p>
                  </div>
                  <button
                    className="follow-button"
                    disabled={user.isFollowing || user.id === userData.id}
                    onClick={() => handleFollow(user.id, updateSuggestedFollowStatus)}
                  >
                    {user.isFollowing ? 'Following' : 'Follow'}
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="trending-topics">
          <h3>Trending Topics</h3>
          <div className="topic-list">
            <div className="topic-item">
              <span>#MinimalistDesign</span>
              <span className="topic-count">8 posts</span>
            </div>
            <div className="topic-item">
              <span>#SustainableLiving</span>
              <span className="topic-count">4 posts</span>
            </div>
            <div className="topic-item">
              <span>#SmallSpaces</span>
              <span className="topic-count">1 posts</span>
            </div>
            <div className="topic-item">
              <span>#ColorTheory</span>
              <span className="topic-count">2 posts</span>
            </div>
          </div>
        </div>
      </div>

      {/* Media Modal */}
      {activeMediaPost && activeMediaPost.mediaFiles && activeMediaPost.mediaFiles.length > 0 && (
        <PostMediaModal
          isOpen={activeMediaPost !== null}
          onClose={closeMediaModal}
          mediaFiles={activeMediaPost.mediaFiles}
          API_BASE_URL={API_BASE_URL}
          initialIndex={initialMediaIndex}
        />
      )}

      {/* Modal for SkillPost */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <SkillPost
          onClose={() => setIsModalOpen(false)}
          onPostCreated={handlePostCreated}
        />
      </Modal>
    </div>
  );
}

export default Dashboard;
