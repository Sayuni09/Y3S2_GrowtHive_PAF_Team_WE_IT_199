// src/pages/Dashboard.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, User, Bell, Search, PlusCircle, Book, Heart, MessageSquare, Settings, LogOut, Sofa, Trophy } from 'lucide-react';
import '../styles/Dashboard.css';
import Modal from '../components/Modal';
import SkillPost from '../components/SkillPost';
import CommentSection from '../components/CommentSection';

function Dashboard() {
  const navigate = useNavigate(); // Add navigate hook for programmatic navigation
  
  // Mock data for demonstration
  const [userData, _setUserData] = useState({
    name: 'E.M.T.T.BANDARANAYAKE',
    email: '3lakshana1124@gmail.com',
    profilePicture: 'https://randomuser.me/api/portraits/women/44.jpg',
    activitySummary: {
      postsCreated: 24,
      postsLiked: 48,
      commentsReceived: 37,
      designChallenges: 14 // Added design challenges count
    },
    notifications: [
      { id: 1, type: 'like', user: 'Sarah Johnson', content: 'liked your post about "Modern Living Room Design"', time: '2 hours ago' },
      { id: 2, type: 'comment', user: 'Michael Chen', content: 'commented on your post: "Great use of negative space!"', time: '3 hours ago' },
      { id: 3, type: 'follow', user: 'Emma Davis', content: 'started following you', time: '1 day ago' },
      { id: 4, type: 'post', user: 'David Wilson', content: 'shared a new post: "Minimalist Kitchen Essentials"', time: '2 days ago' }
    ]
  });

  // Navigation function for Design Challenges card
  const navigateToMakeoverChallenges = () => {
    navigate('/makeover-challenges');
  };

  const navigateToRoomMakeover = () => {
    navigate('/room-makeover');
  };

  // Mock posts data with comments
  const [posts, setPosts] = useState([
    {
      id: 1,
      user: { name: 'Julia Martinez', profilePic: 'https://randomuser.me/api/portraits/women/22.jpg' },
      title: 'Scandinavian Design Principles',
      content: 'Exploring the clean lines and functional elegance of Scandinavian interior design. Here are my top takeaways from renovating my living space...',
      image: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      likes: 28,
      comments: [
        {
          id: 101,
          user: { name: 'Michael Chen', profilePic: 'https://randomuser.me/api/portraits/men/32.jpg' },
          content: 'I love how you incorporated natural elements while keeping the clean lines. Would you mind sharing where you got that coffee table?',
          likes: 4,
          time: '2 hours ago',
          replies: [
            {
              id: 1011,
              user: { name: 'Julia Martinez', profilePic: 'https://randomuser.me/api/portraits/women/22.jpg' },
              content: 'Thank you! The coffee table is from Scandinavian Designs, but I found it on sale last month. I think they still have similar models.',
              likes: 2,
              time: '1 hour ago'
            }
          ]
        },
        {
          id: 102,
          user: { name: 'Emma Davis', profilePic: 'https://randomuser.me/api/portraits/women/67.jpg' },
          content: 'The minimalist approach really makes the space feel larger. Great job on the color palette selection!',
          likes: 7,
          time: '3 hours ago',
          replies: []
        }
      ],
      timestamp: '3 hours ago',
      showComments: false
    },
    {
      id: 2,
      user: { name: 'Robert Lee', profilePic: 'https://randomuser.me/api/portraits/men/32.jpg' },
      title: 'Indoor Plants for Better Air Quality',
      content: 'Did you know that certain houseplants can significantly improve your home\'s air quality? Here\'s my curated list of low-maintenance plants that purify your space...',
      image: 'https://media.istockphoto.com/id/1837566278/photo/scandinavian-style-apartment-interior.webp?a=1&b=1&s=612x612&w=0&k=20&c=7qzRX7XP3Bok4EA6Nfqbn7s6CkYb9JwXM-vH8elseI4=',
      likes: 45,
      comments: [
        {
          id: 201,
          user: { name: 'Sarah Johnson', profilePic: 'https://randomuser.me/api/portraits/women/22.jpg' },
          content: 'I just got a snake plant after reading about its air-purifying benefits. Do you have any care tips for beginners?',
          likes: 3,
          time: '1 hour ago',
          replies: []
        }
      ],
      timestamp: '5 hours ago',
      showComments: false
    },
    {
      id: 3,
      user: { name: 'Sarah Johnson', profilePic: 'https://randomuser.me/api/portraits/women/67.jpg' },
      title: 'Color Theory in Home Decor',
      content: 'Understanding color relationships can transform your space. Here\'s how I applied complementary colors to create a harmonious bedroom design...',
      image: 'https://images.unsplash.com/photo-1556702571-3e11dd2b1a92?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      likes: 36,
      comments: [
        {
          id: 301,
          user: { name: 'Robert Lee', profilePic: 'https://randomuser.me/api/portraits/men/32.jpg' },
          content: 'This is exactly what I needed! I\'ve been struggling with my bedroom color palette. Would you recommend warm or cool tones for a north-facing room?',
          likes: 5,
          time: '4 hours ago',
          replies: [
            {
              id: 3011,
              user: { name: 'Sarah Johnson', profilePic: 'https://randomuser.me/api/portraits/women/67.jpg' },
              content: 'For north-facing rooms, I typically recommend warmer tones as they can help counteract the cooler light. Try terracotta or warm ochre tones as accents!',
              likes: 3,
              time: '3 hours ago'
            }
          ]
        }
      ],
      timestamp: '1 day ago',
      showComments: false
    }
  ]);
  
  const [activeTab, setActiveTab] = useState('feed');
  const [showNotifications, setShowNotifications] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  const handleCreatePost = () => {
    setIsModalOpen(true);
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
          comments: [...post.comments, newCommentObj]
        };
      }
      return post;
    });
    
    setPosts(updatedPosts);
  };

  // Add a reply to a comment
  const addReply = (postId, commentId, replyContent) => {
    if (!replyContent.trim()) return;
    
    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        const updatedComments = post.comments.map(comment => {
          if (comment.id === commentId) {
            const newReply = {
              id: Date.now(),
              user: { 
                name: userData.name, 
                profilePic: userData.profilePicture 
              },
              content: replyContent,
              likes: 0,
              time: 'Just now'
            };
            
            return {
              ...comment,
              replies: [...comment.replies, newReply]
            };
          }
          return comment;
        });
        
        return {
          ...post,
          comments: updatedComments
        };
      }
      return post;
    });
    
    setPosts(updatedPosts);
  };

  // Like a comment
  const likeComment = (postId, commentId, replyId = null) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        const updatedComments = post.comments.map(comment => {
          if (replyId) {
            // Liking a reply
            if (comment.id === commentId) {
              const updatedReplies = comment.replies.map(reply => 
                reply.id === replyId ? { ...reply, likes: reply.likes + 1 } : reply
              );
              return { ...comment, replies: updatedReplies };
            }
            return comment;
          } else {
            // Liking a comment
            if (comment.id === commentId) {
              return { ...comment, likes: comment.likes + 1 };
            }
            return comment;
          }
        });
        
        return { ...post, comments: updatedComments };
      }
      return post;
    }));
  };

  // Like a post
  const likePost = (postId) => {
    setPosts(posts.map(post =>
      post.id === postId ? { ...post, likes: post.likes + 1 } : post
    ));
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
      <div className="dashboard-main">
        {/* Header with search and profile quick access */}
        <header className="dashboard-header">
          <div className="search-container">
            <Search size={20} />
            <input type="text" placeholder="Search designs, techniques, users..." />
          </div>
          
          <div className="header-actions">
            <button className="create-button" onClick={handleCreatePost}>
              <PlusCircle size={20} />
              <span>Create Post</span>
            </button>
            
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
                    {notification.type === 'like' && <Heart size={18} />}
                    {notification.type === 'comment' && <MessageSquare size={18} />}
                    {notification.type === 'follow' && <User size={18} />}
                    {notification.type === 'post' && <PlusCircle size={18} />}
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
          
          {/* REPLACED: Learning Progress Card with Design Challenges Card */}
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
            {posts.map(post => (
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
                
                {post.image && (
                  <div className="post-image">
                    <img src={post.image} alt={post.title} />
                  </div>
                )}
                
                <div className="post-actions">
                  <div className="action-button" onClick={() => likePost(post.id)}>
                    <Heart size={20} />
                    <span>{post.likes}</span>
                  </div>
                  <div 
                    className={`action-button ${post.showComments ? 'active' : ''}`} 
                    onClick={() => toggleComments(post.id)}
                  >
                    <MessageSquare size={20} />
                    <span>{post.comments.length}</span>
                  </div>
                </div>

                {/* Comment Section Component */}
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
            ))}
          </div>
        </section>
      </div>

      {/* Right Sidebar - Quick Links & Suggested Content */}
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
            <div className="connection-item">
              <img src="https://randomuser.me/api/portraits/men/42.jpg" alt="Alex Wong" />
              <div className="connection-info">
                <h4>Alex Wong</h4>
                <p>Color Theory Expert</p>
              </div>
              <button className="follow-button">Follow</button>
            </div>
            <div className="connection-item">
              <img src="https://randomuser.me/api/portraits/women/55.jpg" alt="Jessica Miller" />
              <div className="connection-info">
                <h4>Jessica Miller</h4>
                <p>Furniture Design</p>
              </div>
              <button className="follow-button">Follow</button>
            </div>
            <div className="connection-item">
              <img src="https://randomuser.me/api/portraits/men/67.jpg" alt="Daniel Kim" />
              <div className="connection-info">
                <h4>Daniel Kim</h4>
                <p>Sustainability Expert</p>
              </div>
              <button className="follow-button">Follow</button>
            </div>
          </div>
        </div>

        <div className="trending-topics">
          <h3>Trending Topics</h3>
          <div className="topic-list">
            <div className="topic-item">
              <span>#MinimalistDesign</span>
              <span className="topic-count">128 posts</span>
            </div>
            <div className="topic-item">
              <span>#SustainableLiving</span>
              <span className="topic-count">97 posts</span>
            </div>
            <div className="topic-item">
              <span>#SmallSpaces</span>
              <span className="topic-count">85 posts</span>
            </div>
            <div className="topic-item">
              <span>#ColorTheory</span>
              <span className="topic-count">72 posts</span>
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

export default Dashboard;
