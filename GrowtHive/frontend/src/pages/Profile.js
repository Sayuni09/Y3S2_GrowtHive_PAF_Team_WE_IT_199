// src/pages/Profile.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Edit, 
  Image, 
  Book, 
  Users, 
  Grid, 
  Heart, 
  MessageSquare, 
  ArrowLeft, 
  Search, 
  X, 
  Home, 
  User, 
  Bell, 
  Settings, 
  LogOut, 
  PlusCircle,
  Sofa 
} from 'lucide-react';
import '../styles/Profile.css';
import Modal from '../components/Modal';
import CommentSection from '../components/CommentSection';

function Profile() {
  // Mock user data
  const [userData, setUserData] = useState({
    name: 'E.M.T.T.BANDARANAYAKE',
    email: '3lakshana1124@gmail.com',
    profilePicture: 'https://randomuser.me/api/portraits/women/44.jpg',
    coverImage: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
    bio: 'Interior design enthusiast with a passion for Scandinavian aesthetics and sustainable living solutions. Constantly exploring ways to blend functionality with beauty.',
    location: 'Colombo, Sri Lanka',
    website: 'designportfolio.com/emtt',
    followers: 128,
    following: 87,
    joinedDate: 'April 2023'
  });

  // Mock posts data
  const [postsOriginal] = useState([
    {
      id: 1,
      title: 'Revamping Small Spaces: My Kitchen Makeover',
      content: 'I recently completed a budget-friendly kitchen renovation that maximized storage while creating an open, airy feel. Here are the before and after photos along with my process...',
      image: 'https://images.unsplash.com/photo-1588854337236-6889d631faa8?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGtpdGNoZW58ZW58MHx8MHx8fDA%3D',
      likes: 48,
      comments: [],
      timestamp: '2 weeks ago'
    },
    {
      id: 2,
      title: 'Creating a Productive Home Office',
      content: 'With remote work becoming more common, I wanted to share my approach to designing a home office that promotes productivity and wellbeing...',
      image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGhvbWUlMjBvZmZpY2V8ZW58MHx8MHx8fDA%3D',
      likes: 36,
      comments: [],
      timestamp: '1 month ago'
    },
    {
      id: 3,
      title: 'Sustainable Materials Guide',
      content: 'After researching eco-friendly materials for my latest project, I have compiled this comprehensive guide to sustainable options for flooring, furniture, and décor...',
      image: 'https://images.unsplash.com/photo-1618220179428-22790b461013?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8aW50ZXJpb3IlMjBkZXNpZ258ZW58MHx8MHx8fDA%3D',
      likes: 72,
      comments: [],
      timestamp: '2 months ago'
    }
  ]);

  // Mock liked posts data
  const [likedPostsOriginal] = useState([
    {
      id: 101,
      user: { name: 'Julia Martinez', profilePic: 'https://randomuser.me/api/portraits/women/22.jpg' },
      title: 'Scandinavian Design Principles',
      content: 'Exploring the clean lines and functional elegance of Scandinavian interior design. Here are my top takeaways from renovating my living space...',
      image: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      likes: 128,
      comments: [],
      timestamp: '3 days ago'
    },
    {
      id: 102,
      user: { name: 'Robert Lee', profilePic: 'https://randomuser.me/api/portraits/men/32.jpg' },
      title: 'Indoor Plants for Better Air Quality',
      content: 'Did you know that certain houseplants can significantly improve your home\'s air quality? Here\'s my curated list of low-maintenance plants that purify your space...',
      image: 'https://images.unsplash.com/photo-1556702571-3e11dd2b1a92?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      likes: 245,
      comments: [],
      timestamp: '1 week ago'
    },
    {
      id: 103,
      user: { name: 'Sarah Johnson', profilePic: 'https://randomuser.me/api/portraits/women/67.jpg' },
      title: 'Color Theory in Home Decor',
      content: 'Understanding color relationships can transform your space. Here\'s how I applied complementary colors to create a harmonious bedroom design...',
      image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      likes: 236,
      comments: [],
      timestamp: '5 days ago'
    },
    {
      id: 104,
      user: { name: 'Michael Chen', profilePic: 'https://randomuser.me/api/portraits/men/86.jpg' },
      title: 'Creative Lighting Ideas for Modern Homes',
      content: 'A step-by-step guide to enhancing your home ambiance using smart lighting solutions, mood lighting setups, and decorative fixtures...',
      image: 'https://images.unsplash.com/photo-1647695878806-f629ac174a0e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGxpZ2h0bmluZyUyMGFuZCUyMGRlY29yfGVufDB8fDB8fHww',
      likes: 421,
      comments: [],
      timestamp: '2 weeks ago'
    }
  ]);

  // State for posts with comments structure
  const [posts, setPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);

  // Initialize posts with additional properties for comments
  useEffect(() => {
    setPosts(postsOriginal.map(post => ({
      ...post,
      showComments: false,
      comments: post.comments || []
    })));

    setLikedPosts(likedPostsOriginal.map(post => ({
      ...post,
      showComments: false,
      comments: post.comments || []
    })));
  }, [postsOriginal, likedPostsOriginal]);

  // Mock followers/following data
  const [connections, setConnections] = useState({
    followers: [
      { id: 1, name: 'Sarah Johnson', image: 'https://randomuser.me/api/portraits/women/22.jpg', isFollowing: true },
      { id: 2, name: 'Michael Chen', image: 'https://randomuser.me/api/portraits/men/32.jpg', isFollowing: false },
      { id: 3, name: 'Emma Davis', image: 'https://randomuser.me/api/portraits/women/67.jpg', isFollowing: true },
      { id: 4, name: 'David Wilson', image: 'https://randomuser.me/api/portraits/men/91.jpg', isFollowing: false },
      { id: 5, name: 'Anna Smith', image: 'https://randomuser.me/api/portraits/women/65.jpg', isFollowing: true },
      { id: 6, name: 'Robert Brown', image: 'https://randomuser.me/api/portraits/men/43.jpg', isFollowing: false },
      { id: 7, name: 'Jessica Lee', image: 'https://randomuser.me/api/portraits/women/89.jpg', isFollowing: true }
    ],
    following: [
      { id: 8, name: 'Julia Martinez', image: 'https://randomuser.me/api/portraits/women/46.jpg' },
      { id: 9, name: 'Robert Lee', image: 'https://randomuser.me/api/portraits/men/45.jpg' },
      { id: 10, name: 'Lisa Thompson', image: 'https://randomuser.me/api/portraits/women/33.jpg' },
      { id: 11, name: 'James Anderson', image: 'https://randomuser.me/api/portraits/men/22.jpg' },
      { id: 12, name: 'Maria Rodriguez', image: 'https://randomuser.me/api/portraits/women/90.jpg' },
      { id: 13, name: 'John Taylor', image: 'https://randomuser.me/api/portraits/men/60.jpg' }
    ]
  });

  const [activeTab, setActiveTab] = useState('posts');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editedData, setEditedData] = useState({...userData});
  const [followerSearch, setFollowerSearch] = useState('');
  const [followingSearch, setFollowingSearch] = useState('');
  const [filteredFollowers, setFilteredFollowers] = useState(connections.followers);
  const [filteredFollowing, setFilteredFollowing] = useState(connections.following);
  const [showNotifications, setShowNotifications] = useState(false);

  // Filter connections based on search input
  useEffect(() => {
    setFilteredFollowers(
      connections.followers.filter(follower => 
        follower.name.toLowerCase().includes(followerSearch.toLowerCase())
      )
    );
  }, [followerSearch, connections.followers]);

  useEffect(() => {
    setFilteredFollowing(
      connections.following.filter(following => 
        following.name.toLowerCase().includes(followingSearch.toLowerCase())
      )
    );
  }, [followingSearch, connections.following]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedData({
      ...editedData,
      [name]: value
    });
  };

  const handleSaveProfile = () => {
    setUserData(editedData);
    setIsEditModalOpen(false);
  };

  const handleFollowToggle = (id, type) => {
    if (type === 'follower') {
      const updatedFollowers = connections.followers.map(follower => 
        follower.id === id ? { ...follower, isFollowing: !follower.isFollowing } : follower
      );
      setConnections({
        ...connections,
        followers: updatedFollowers
      });
    } else if (type === 'following') {
      // For simplicity, just remove from following list
      const updatedFollowing = connections.following.filter(follow => follow.id !== id);
      setUserData({
        ...userData,
        following: userData.following - 1
      });
      setConnections({
        ...connections,
        following: updatedFollowing
      });
    }
  };

  const openEditModal = () => {
    setEditedData({...userData});
    setIsEditModalOpen(true);
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  // Toggle comments visibility for a post
  const toggleComments = (postId, isLikedPost = false) => {
    if (isLikedPost) {
      setLikedPosts(likedPosts.map(post => 
        post.id === postId ? { ...post, showComments: !post.showComments } : post
      ));
    } else {
      setPosts(posts.map(post => 
        post.id === postId ? { ...post, showComments: !post.showComments } : post
      ));
    }
  };

  // Add a new comment to a post
  const addComment = (postId, commentText, isLikedPost = false) => {
    if (!commentText.trim()) return;
    
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
    
    if (isLikedPost) {
      const updatedPosts = likedPosts.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            comments: [...post.comments, newCommentObj]
          };
        }
        return post;
      });
      
      setLikedPosts(updatedPosts);
    } else {
      const updatedPosts = posts.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            comments: [...post.comments, newCommentObj]
          };
        }
        return post;
      });
      
      setPosts(updatedPosts);
    }
  };

  // Add a reply to a comment
  const addReply = (postId, commentId, replyContent, isLikedPost = false) => {
    if (!replyContent.trim()) return;
    
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
    
    if (isLikedPost) {
      const updatedPosts = likedPosts.map(post => {
        if (post.id === postId) {
          const updatedComments = post.comments.map(comment => {
            if (comment.id === commentId) {
              return {
                ...comment,
                replies: [...(comment.replies || []), newReply]
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
      
      setLikedPosts(updatedPosts);
    } else {
      const updatedPosts = posts.map(post => {
        if (post.id === postId) {
          const updatedComments = post.comments.map(comment => {
            if (comment.id === commentId) {
              return {
                ...comment,
                replies: [...(comment.replies || []), newReply]
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
    }
  };

  // Like a comment
  const likeComment = (postId, commentId, replyId = null, isLikedPost = false) => {
    if (isLikedPost) {
      setLikedPosts(likedPosts.map(post => {
        if (post.id === postId) {
          const updatedComments = post.comments.map(comment => {
            if (replyId) {
              // Liking a reply
              if (comment.id === commentId) {
                const updatedReplies = (comment.replies || []).map(reply => 
                  reply.id === replyId ? { ...reply, likes: (reply.likes || 0) + 1 } : reply
                );
                return { ...comment, replies: updatedReplies };
              }
              return comment;
            } else {
              // Liking a comment
              if (comment.id === commentId) {
                return { ...comment, likes: (comment.likes || 0) + 1 };
              }
              return comment;
            }
          });
          
          return { ...post, comments: updatedComments };
        }
        return post;
      }));
    } else {
      setPosts(posts.map(post => {
        if (post.id === postId) {
          const updatedComments = post.comments.map(comment => {
            if (replyId) {
              // Liking a reply
              if (comment.id === commentId) {
                const updatedReplies = (comment.replies || []).map(reply => 
                  reply.id === replyId ? { ...reply, likes: (reply.likes || 0) + 1 } : reply
                );
                return { ...comment, replies: updatedReplies };
              }
              return comment;
            } else {
              // Liking a comment
              if (comment.id === commentId) {
                return { ...comment, likes: (comment.likes || 0) + 1 };
              }
              return comment;
            }
          });
          
          return { ...post, comments: updatedComments };
        }
        return post;
      }));
    }
  };

  // Like a post
  const likePost = (postId, isLikedPost = false) => {
    if (isLikedPost) {
      setLikedPosts(likedPosts.map(post =>
        post.id === postId ? { ...post, likes: post.likes + 1 } : post
      ));
    } else {
      setPosts(posts.map(post =>
        post.id === postId ? { ...post, likes: post.likes + 1 } : post
      ));
    }
  };

  // Unlike a post (remove from liked posts)
  const unlikePost = (postId) => {
    setLikedPosts(likedPosts.filter(post => post.id !== postId));
  };

  return (
    <div className="profile-page-container">
      {/* Left Sidebar - Added from Dashboard */}
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
          <Link to="/profile" className="menu-item active">
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

      {/* Main Content with Profile */}
      <div className="profile-main-content">
        {/* Header with notifications and search */}
        <header className="profile-header-bar">
          <Link to="/dashboard" className="back-to-dashboard">
            <ArrowLeft size={18} />
            <span>Back to Dashboard</span>
          </Link>
          
          <div className="header-actions">
            <div className="notification-icon" onClick={toggleNotifications}>
              <Bell size={22} />
              <div className="notification-badge">4</div>
            </div>
            
            <div className="profile-quick-access">
              <img src={userData.profilePicture} alt="Profile" />
              <span>{userData.name.split(' ')[0]}</span>
            </div>
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
              <div className="notification-item like">
                <div className="notification-icon">
                  <Heart size={18} />
                </div>
                <div className="notification-content">
                  <p><strong>Sarah Johnson</strong> liked your post about "Modern Living Room Design"</p>
                  <span className="notification-time">2 hours ago</span>
                </div>
              </div>
              <div className="notification-item comment">
                <div className="notification-icon">
                  <MessageSquare size={18} />
                </div>
                <div className="notification-content">
                  <p><strong>Michael Chen</strong> commented on your post: "Great use of negative space!"</p>
                  <span className="notification-time">3 hours ago</span>
                </div>
              </div>
              <div className="notification-item follow">
                <div className="notification-icon">
                  <User size={18} />
                </div>
                <div className="notification-content">
                  <p><strong>Emma Davis</strong> started following you</p>
                  <span className="notification-time">1 day ago</span>
                </div>
              </div>
              <div className="notification-item post">
                <div className="notification-icon">
                  <PlusCircle size={18} />
                </div>
                <div className="notification-content">
                  <p><strong>David Wilson</strong> shared a new post: "Minimalist Kitchen Essentials"</p>
                  <span className="notification-time">2 days ago</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="profile-container">
          {/* Profile Header */}
          <div className="profile-header" style={{ backgroundImage: `url(${userData.coverImage})` }}>
            <div className="profile-header-overlay"></div>
            <div className="profile-info">
              <div className="profile-picture-container">
                <img src={userData.profilePicture} alt="Profile" className="profile-picture" />
              </div>
              <div className="profile-details">
                <h1>{userData.name}</h1>
                <p className="profile-bio">{userData.bio}</p>
                <div className="profile-meta">
                  {userData.location && (
                    <span className="meta-item">
                      <span className="meta-icon">📍</span>
                      {userData.location}
                    </span>
                  )}
                  {userData.website && (
                    <span className="meta-item">
                      <span className="meta-icon">🌐</span>
                      <a href={`https://${userData.website}`} target="_blank" rel="noopener noreferrer">
                        {userData.website}
                      </a>
                    </span>
                  )}
                  <span className="meta-item">
                    <span className="meta-icon">📅</span>
                    Joined {userData.joinedDate}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="profile-actions">
              <button className="edit-profile-btn" onClick={openEditModal}>
                <Edit size={18} />
                Edit Profile
              </button>
            </div>
          </div>

          {/* Profile Stats */}
          <div className="profile-stats">
            <div className="stat-item">
              <span className="stat-number">{posts.length}</span>
              <span className="stat-label">Posts</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{likedPosts.length}</span>
              <span className="stat-label">Liked Posts</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{userData.followers}</span>
              <span className="stat-label">Followers</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{userData.following}</span>
              <span className="stat-label">Following</span>
            </div>
          </div>

          {/* Profile Content Tabs */}
          <div className="profile-content">
            <div className="profile-tabs">
              <button 
                className={`tab-btn ${activeTab === 'posts' ? 'active' : ''}`}
                onClick={() => setActiveTab('posts')}
              >
                <Grid size={18} />
                Posts
              </button>
              <button 
                className={`tab-btn ${activeTab === 'liked' ? 'active' : ''}`}
                onClick={() => setActiveTab('liked')}
              >
                <Heart size={18} />
                Liked Posts
              </button>
              <button 
                className={`tab-btn ${activeTab === 'followers' ? 'active' : ''}`}
                onClick={() => setActiveTab('followers')}
              >
                <Users size={18} />
                Connections
              </button>
            </div>

            {/* Tab Content */}
            <div className="tab-content">
              {/* Posts Tab */}
              {activeTab === 'posts' && (
                <div className="posts-grid">
                  {posts.length > 0 ? (
                    posts.map(post => (
                      <div key={post.id} className="post-card">
                        <div className="post-content">
                          <h3 className="post-title">{post.title}</h3>
                          <p className="post-excerpt">{post.content}</p>
                          <div className="post-meta">
                            <span className="post-time">{post.timestamp}</span>
                            <div className="post-stats">
                              <span className="stat" onClick={() => likePost(post.id)}>
                                <Heart size={16} />
                                {post.likes}
                              </span>
                              <span 
                                className={`stat comment-toggle ${post.showComments ? 'active' : ''}`}
                                onClick={() => toggleComments(post.id)}
                              >
                                <MessageSquare size={16} />
                                {post.comments.length}
                              </span>
                            </div>
                          </div>
                          
                          {/* Comment Section */}
                          {post.showComments && (
                            <CommentSection 
                              post={post}
                              userData={userData}
                              onAddComment={(postId, comment) => addComment(postId, comment)}
                              onAddReply={(postId, commentId, reply) => addReply(postId, commentId, reply)}
                              onLikeComment={(postId, commentId, replyId) => likeComment(postId, commentId, replyId)}
                              onClose={() => toggleComments(post.id)}
                            />
                          )}
                        </div>
                        {post.image && (
                          <div className="post-image">
                            <img src={post.image} alt={post.title} />
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="empty-tab-message">
                      <div className="empty-icon">✍️</div>
                      <h3>No posts yet</h3>
                      <p>Share your first post to see it here</p>
                    </div>
                  )}
                </div>
              )}

              {/* Liked Posts Tab (previously Skills) */}
              {activeTab === 'liked' && (
                <div className="posts-grid">
                  {likedPosts.length > 0 ? (
                    likedPosts.map(post => (
                      <div key={post.id} className="post-card liked-post-card">
                        <div className="post-header">
                          <img src={post.user.profilePic} alt={post.user.name} className="user-avatar" />
                          <div className="post-author-info">
                            <h4>{post.user.name}</h4>
                            <span className="post-time">{post.timestamp}</span>
                          </div>
                        </div>
                        <div className="post-content">
                          <h3 className="post-title">{post.title}</h3>
                          <p className="post-excerpt">{post.content}</p>
                          <div className="post-meta">
                            <div className="post-stats">
                              <span className="stat unlike-btn" onClick={() => unlikePost(post.id)}>
                                <Heart size={16} className="filled" />
                                <span>Unlike</span>
                              </span>
                              <span 
                                className={`stat comment-toggle ${post.showComments ? 'active' : ''}`}
                                onClick={() => toggleComments(post.id, true)}
                              >
                                <MessageSquare size={16} />
                                {post.comments.length}
                              </span>
                            </div>
                          </div>
                          
                          {/* Comment Section */}
                          {post.showComments && (
                            <CommentSection 
                              post={post}
                              userData={userData}
                              onAddComment={(postId, comment) => addComment(postId, comment, true)}
                              onAddReply={(postId, commentId, reply) => addReply(postId, commentId, reply, true)}
                              onLikeComment={(postId, commentId, replyId) => likeComment(postId, commentId, replyId, true)}
                              onClose={() => toggleComments(post.id, true)}
                            />
                          )}
                        </div>
                        {post.image && (
                          <div className="post-image">
                            <img src={post.image} alt={post.title} />
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="empty-tab-message">
                      <div className="empty-icon">❤️</div>
                      <h3>No liked posts yet</h3>
                      <p>Posts you like will appear here</p>
                    </div>
                  )}
                </div>
              )}

              {/* Connections Tab */}
              {activeTab === 'followers' && (
                <div className="connections-container">
                  <div className="connections-section">
                    <h3>Followers</h3>
                    <div className="search-box">
                      <Search size={16} />
                      <input
                        type="text"
                        placeholder="Search followers"
                        value={followerSearch}
                        onChange={(e) => setFollowerSearch(e.target.value)}
                      />
                      {followerSearch && (
                        <button 
                          className="clear-search" 
                          onClick={() => setFollowerSearch('')}
                        >
                          <X size={16} />
                        </button>
                      )}
                    </div>
                    <div className="connections-list">
                      {filteredFollowers.length > 0 ? (
                        filteredFollowers.map(follower => (
                          <div key={follower.id} className="connection-card">
                            <div className="connection-info">
                              <img src={follower.image} alt={follower.name} />
                              <span className="connection-name">{follower.name}</span>
                            </div>
                            <button 
                              className={`connection-action ${follower.isFollowing ? 'following' : ''}`}
                              onClick={() => handleFollowToggle(follower.id, 'follower')}
                            >
                              {follower.isFollowing ? 'Following' : 'Follow Back'}
                            </button>
                          </div>
                        ))
                      ) : (
                        <div className="empty-search">No followers found matching "{followerSearch}"</div>
                      )}
                    </div>
                  </div>
                  
                  <div className="connections-section">
                    <h3>Following</h3>
                    <div className="search-box">
                      <Search size={16} />
                      <input
                        type="text"
                        placeholder="Search following"
                        value={followingSearch}
                        onChange={(e) => setFollowingSearch(e.target.value)}
                      />
                      {followingSearch && (
                        <button 
                          className="clear-search" 
                          onClick={() => setFollowingSearch('')}
                        >
                          <X size={16} />
                        </button>
                      )}
                    </div>
                    <div className="connections-list">
                      {filteredFollowing.length > 0 ? (
                        filteredFollowing.map(followed => (
                          <div key={followed.id} className="connection-card">
                            <div className="connection-info">
                              <img src={followed.image} alt={followed.name} />
                              <span className="connection-name">{followed.name}</span>
                            </div>
                            <button 
                              className="connection-action following"
                              onClick={() => handleFollowToggle(followed.id, 'following')}
                            >
                              Following
                            </button>
                          </div>
                        ))
                      ) : (
                        <div className="empty-search">No following found matching "{followingSearch}"</div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        <div className="edit-profile-modal">
          <h2>Edit Profile</h2>
          <div className="profile-edit-form">
            <div className="edit-profile-picture">
              <img src={userData.profilePicture} alt="Profile" />
              <label className="change-picture-btn">
                <Image size={18} />
                <input type="file" accept="image/*" style={{ display: 'none' }} />
              </label>
            </div>
            
            <div className="edit-cover-photo">
              <label>
                Cover Photo
                <button className="change-cover-btn">
                  <Image size={16} />
                  Change Cover Photo
                </button>
              </label>
              <div className="cover-preview" style={{backgroundImage: `url(${userData.coverImage})`}}></div>
            </div>
            
            <div className="edit-field">
              <label>Name</label>
              <input
                type="text"
                name="name"
                value={editedData.name}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="edit-field">
              <label>Bio</label>
              <textarea
                name="bio"
                value={editedData.bio}
                onChange={handleInputChange}
                rows={3}
              ></textarea>
            </div>
            
            <div className="edit-row">
              <div className="edit-field half">
                <label>Location</label>
                <input
                  type="text"
                  name="location"
                  value={editedData.location}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="edit-field half">
                <label>Website</label>
                <input
                  type="text"
                  name="website"
                  value={editedData.website}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div className="modal-actions">
              <button className="cancel-btn" onClick={() => setIsEditModalOpen(false)}>
                Cancel
              </button>
              <button className="save-btn" onClick={handleSaveProfile}>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default Profile;
