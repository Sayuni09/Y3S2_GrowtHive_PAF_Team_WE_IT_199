// src/pages/Profile.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Image, 
  Book, 
  Heart, 
  MessageSquare, 
  ArrowLeft, 
  Search, 
  Home, 
  User, 
  Bell, 
  Settings, 
  LogOut, 
  PlusCircle,
  Sofa,
} from 'lucide-react';
import '../styles/Profile.css';
import Modal from '../components/Modal';
import axios from 'axios';
import { toast } from 'react-toastify';
import API_BASE_URL from '../services/baseUrl';
import ProfileHeader from '../components/ProfileHeader';
import ProfileTabs from '../components/ProfileTabs';
import LikeService from '../services/LikeService';
import ProfileService from '../services/ProfileService';

function Profile() {
  const navigate = useNavigate();
  
  // User data state
  const [userData, setUserData] = useState({
    id: '',
    name: 'User',
    email: '',
    profilePicture: 'https://randomuser.me/api/portraits/women/44.jpg',
    coverImage: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
    bio: 'Interior design enthusiast with a passion for Scandinavian aesthetics and sustainable living solutions.',
    location: 'Colombo, Sri Lanka',
    website: 'designportfolio.com/emtt',
    followers: 128,
    following: 87,
    joinedDate: 'April 2023',
    // Initialize activity summary to prevent undefined errors
    activitySummary: {
      postsCreated: 0,
      postsLiked: 0,
      commentsReceived: 0,
      designChallenges: 0
    }
  });

  // States for the component
  const [posts, setPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);
  const [activeTab, setActiveTab] = useState('posts');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPostEditModalOpen, setIsPostEditModalOpen] = useState(false);
  const [editedData, setEditedData] = useState({...userData});
  const [editingPost, setEditingPost] = useState(null);
  const [followerSearch, setFollowerSearch] = useState('');
  const [followingSearch, setFollowingSearch] = useState('');
  const [filteredFollowers, setFilteredFollowers] = useState([]);
  const [filteredFollowing, setFilteredFollowing] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [connections, setConnections] = useState({
    followers: [],
    following: []
  });
  
  // Profile picture and cover image upload states
  const [profilePictureFile, setProfilePictureFile] = useState(null);
  const [coverImageFile, setCoverImageFile] = useState(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState(null);
  const [coverImagePreview, setCoverImagePreview] = useState(null);

  const [editedPostData, setEditedPostData] = useState({
    title: '',
    content: '',
    category: '',
    visibility: 'public',
    mediaFiles: []
  });
  const [mediaPreview, setMediaPreview] = useState([]);
  const [mediaToUpload, setMediaToUpload] = useState([]);
  const [confirmDeleteModalOpen, setConfirmDeleteModalOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);

  // Function to correctly count comments
  const getCommentCount = (post) => {
    if (post.commentCount !== undefined) {
      return post.commentCount;
    }
    if (!post || !post.comments || !Array.isArray(post.comments)) {
      return 0;
    }
    
    return post.comments.length;
  };

  useEffect(() => {
    fetchUserData();
    fetchUserPosts();
    fetchLikedPosts();
    
    setConnections({
      followers: [
        { id: 1, name: 'Sarah Johnson', image: 'https://randomuser.me/api/portraits/women/22.jpg', isFollowing: true },
        { id: 2, name: 'Michael Chen', image: 'https://randomuser.me/api/portraits/men/32.jpg', isFollowing: false },
        { id: 3, name: 'Emma Davis', image: 'https://randomuser.me/api/portraits/women/67.jpg', isFollowing: true },
      ],
      following: [
        { id: 8, name: 'Julia Martinez', image: 'https://randomuser.me/api/portraits/women/46.jpg' },
        { id: 9, name: 'Robert Lee', image: 'https://randomuser.me/api/portraits/men/45.jpg' },
        { id: 10, name: 'Lisa Thompson', image: 'https://randomuser.me/api/portraits/women/33.jpg' },
      ]
    });
    
    // These will now run after connections has been set
    setFilteredFollowers(connections.followers);
    setFilteredFollowing(connections.following);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch user profile from backend
  const fetchUserData = async () => {
    setIsLoading(true);
    try {
      const profile = await ProfileService.getCurrentUserProfile();
      setUserData(prevData => ({
        ...prevData,
        id: profile.userId || '',
        name: profile.name || 'User',
        email: profile.email || '',
        bio: profile.bio || prevData.bio,
        location: profile.location || prevData.location,
        website: profile.website || prevData.website,
        profilePicture: profile.profilePicture || prevData.profilePicture,
        coverImage: profile.coverImage || prevData.coverImage,
        followers: profile.followers || prevData.followers,
        following: profile.following || prevData.following,
        joinedDate: profile.joinedDate ? new Date(profile.joinedDate).toLocaleDateString('en-US', {
          month: 'long', year: 'numeric'
        }) : prevData.joinedDate,
        activitySummary: profile.activitySummary || prevData.activitySummary
      }));
      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching user profile:', err);
      
      // Fallback to localStorage if API fails
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
        } catch (parseErr) {
          console.error('Error parsing stored user data:', parseErr);
        }
      }
      setIsLoading(false);
    }
  };

  // Fetch user posts from backend
  const fetchUserPosts = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const userObject = JSON.parse(localStorage.getItem('user'));
      
      if (!token || !userObject) {
        navigate('/');
        return;
      }
      
      const response = await axios.get(`${API_BASE_URL}/api/auth/posts/user/${userObject.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      // Transform backend posts to match frontend format
      const transformedPosts = response.data.map(post => ({
        id: post.id,
        title: post.title,
        content: post.content,
        image: post.mediaFiles && post.mediaFiles.length > 0 ? 
              (post.mediaFiles[0].type === 'image' ? `${API_BASE_URL}${post.mediaFiles[0].url}` : null) : null,
        mediaFiles: post.mediaFiles || [],
        category: post.category || '',
        visibility: post.visibility || 'public',
        likes: post.likes || 0,
        userLiked: post.userLiked || false,
        commentCount: post.comments || 0,
        comments: Array.isArray(post.comments) ? post.comments : [],
        timestamp: new Date(post.createdAt).toLocaleDateString('en-US', {
          month: 'long', day: 'numeric', year: 'numeric'
        }),
        showComments: false
      }));
      
      setPosts(transformedPosts);
    
      // Fetch like status for each post
      try {
        const postIds = transformedPosts.map(post => post.id);
        const likeStatuses = await LikeService.batchGetLikeStatus(postIds);
        
        // Update posts with like information
        setPosts(posts => posts.map(post => {
          const status = likeStatuses[post.id];
          return status ? {...post, userLiked: status.liked, likes: status.likeCount} : post;
        }));
      } catch (error) {
        console.error('Error fetching like statuses:', error);
      }
      
    } catch (error) {
      console.error('Error fetching user posts:', error);
      toast.error('Failed to load your posts');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch liked posts from backend
  const fetchLikedPosts = async () => {
    setIsLoading(true);
    try {
      const response = await LikeService.getUserLikedPosts();
      
      // Transform the posts from the API to match frontend format
      const transformedLikedPosts = response.likedPosts.map(post => ({
        id: post.id,
        user: { 
          name: post.userName || 'Anonymous User', 
          profilePic: post.userProfilePic || 'https://randomuser.me/api/portraits/lego/1.jpg' 
        },
        title: post.title || '',
        content: post.content || '',
        image: post.mediaFiles && post.mediaFiles.length > 0 ? 
          (post.mediaFiles[0].type === 'image' ? `${API_BASE_URL}${post.mediaFiles[0].url}` : null) : null,
        mediaFiles: post.mediaFiles || [],
        likes: post.likeCount || 0,
        userLiked: true, // These are posts the user has liked
        
        // The key fix: Ensure commentCount is correctly set regardless of how comments is structured
        commentCount: typeof post.comments === 'number' 
          ? post.comments 
          : (Array.isArray(post.comments) ? post.comments.length : 0),
        
        comments: Array.isArray(post.comments) ? post.comments : [],
        timestamp: new Date(post.createdAt).toLocaleDateString('en-US', {
          month: 'long', day: 'numeric', year: 'numeric'
        }),
        showComments: false
      }));
      
      setLikedPosts(transformedLikedPosts);
    } catch (error) {
      console.error('Error fetching liked posts:', error);
      toast.error('Failed to load your liked posts');
      // Fallback to empty array if API fails
      setLikedPosts([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter followers based on search input
  useEffect(() => {
    if (connections.followers) {
      setFilteredFollowers(
        connections.followers.filter(follower => 
          follower.name.toLowerCase().includes(followerSearch.toLowerCase())
        )
      );
    }
  }, [followerSearch, connections.followers]);

  // Filter following based on search input
  useEffect(() => {
    if (connections.following) {
      setFilteredFollowing(
        connections.following.filter(following => 
          following.name.toLowerCase().includes(followingSearch.toLowerCase())
        )
      );
    }
  }, [followingSearch, connections.following]);

  // Handle updating user profile
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedData({
      ...editedData,
      [name]: value
    });
  };

  // Handle profile picture change
  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePictureFile(file);
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicturePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle cover image change
  const handleCoverImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverImageFile(file);
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle saving profile changes
  const handleSaveProfile = async () => {
    try {
      setIsLoading(true);
      
      // First update profile text data
      // Fix: Remove the variable or prefix with underscore
      await ProfileService.updateProfile({
        name: editedData.name,
        bio: editedData.bio,
        location: editedData.location,
        website: editedData.website
      });
      
      // If profile picture file is selected, upload it
      if (profilePictureFile) {
        await ProfileService.uploadProfilePicture(profilePictureFile);
      }
      
      // If cover image file is selected, upload it
      if (coverImageFile) {
        await ProfileService.uploadCoverImage(coverImageFile);
      }
      
      // Fetch updated profile after all changes
      await fetchUserData();
      
      // Reset file states
      setProfilePictureFile(null);
      setCoverImageFile(null);
      setProfilePicturePreview(null);
      setCoverImagePreview(null);
      
      setIsEditModalOpen(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile: ' + (error.response?.data?.error || error.message));
    } finally {
      setIsLoading(false);
    }
  };

  // Open edit profile modal
  const openEditModal = () => {
    setEditedData({...userData});
    setProfilePicturePreview(null);
    setCoverImagePreview(null);
    setProfilePictureFile(null);
    setCoverImageFile(null);
    setIsEditModalOpen(true);
  };

  // Toggle notifications panel
  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  // Handle edit post
  const handleEditPost = (post) => {
    setEditingPost(post);
    setEditedPostData({
      title: post.title,
      content: post.content,
      category: post.category || '',
      visibility: post.visibility || 'public'
    });
    
    // Set media previews if available
    if (post.mediaFiles && post.mediaFiles.length > 0) {
      const previews = post.mediaFiles.map(media => ({
        url: `${API_BASE_URL}${media.url}`,
        type: media.type
      }));
      setMediaPreview(previews);
    } else {
      setMediaPreview([]);
    }
    
    setIsPostEditModalOpen(true);
  };

  // Handle post input change
  const handlePostInputChange = (e) => {
    const { name, value } = e.target;
    setEditedPostData({
      ...editedPostData,
      [name]: value
    });
  };

  // Handle media file changes
  const handleMediaChange = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length > 3) {
      toast.warning('Maximum 3 files allowed');
      return;
    }
    
    // Clear previous preview and files
    setMediaPreview([]);
    setMediaToUpload([]);
    
    // Create previews and store files
    const newPreviews = [];
    const newFiles = [];
    
    files.forEach(file => {
      if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
        newPreviews.push({
          url: URL.createObjectURL(file),
          type: file.type.startsWith('image/') ? 'image' : 'video'
        });
        newFiles.push(file);
      } else {
        toast.error('Only images and videos are supported');
      }
    });
    
    setMediaPreview(newPreviews);
    setMediaToUpload(newFiles);
  };

  // Save updated post
  const handleSavePostChanges = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        navigate('/');
        return;
      }
      
      // Create form data
      const formData = new FormData();
      formData.append('title', editedPostData.title);
      formData.append('content', editedPostData.content);
      if (editedPostData.category) {
        formData.append('category', editedPostData.category);
      }
      
      formData.append('visibility', editedPostData.visibility);
      
      // Add media files if any
      if (mediaToUpload.length > 0) {
        mediaToUpload.forEach(file => {
          formData.append('media', file);
        });
      }
      
      const response = await axios.put(
        `${API_BASE_URL}/api/auth/posts/${editingPost.id}`, 
        formData, 
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      
      // Update the post in state
      setPosts(posts.map(post => 
        post.id === editingPost.id ? {
          ...post,
          title: editedPostData.title,
          content: editedPostData.content,
          category: editedPostData.category,
          visibility: editedPostData.visibility,
          // Update image if there's a new one
          image: response.data.mediaFiles && response.data.mediaFiles.length > 0 ? 
                (response.data.mediaFiles[0].type === 'image' ? `${API_BASE_URL}${response.data.mediaFiles[0].url}` : null) : null,
          mediaFiles: response.data.mediaFiles || []
        } : post
      ));
      
      setIsPostEditModalOpen(false);
      toast.success('Post updated successfully');
    } catch (error) {
      console.error('Error updating post:', error);
      toast.error(error.response?.data?.error || 'Failed to update post');
    } finally {
      setIsLoading(false);
    }
  };

  // Open delete confirmation modal
  const handleDeletePrompt = (post) => {
    setPostToDelete(post);
    setConfirmDeleteModalOpen(true);
  };

  // Delete post
  const handleDeletePost = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        navigate('/');
        return;
      }
      await axios.delete(`${API_BASE_URL}/api/auth/posts/${postToDelete.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      // Remove post from state
      setPosts(posts.filter(post => post.id !== postToDelete.id));
      
      setConfirmDeleteModalOpen(false);
      toast.success('Post deleted successfully');
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error(error.response?.data?.error || 'Failed to delete post');
    } finally {
      setIsLoading(false);
    }
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

  // Handle following/unfollowing
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

  // Add a new comment to a post
  const addComment = (postId, commentText, isLikedPost = false) => {
    if (!commentText.trim()) return;
    
    const newCommentObj = {
      id: Date.now(), // Temporary ID, will be replaced when comments are refreshed
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
    
    if (isLikedPost) {
      setLikedPosts(likedPosts.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            comments: [...post.comments, newCommentObj],
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
            comments: [...post.comments, newCommentObj],
            commentCount: (post.commentCount || 0) + 1
          };
        }
        return post;
      }));
    }
    
    return true;
  };

  // Add a reply to a comment
  const addReply = (postId, commentId, replyContent, isLikedPost = false) => {
    if (!replyContent.trim()) return;
    
    const newReply = {
      id: Date.now(), // Temporary ID, will be replaced when comments are refreshed
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
  const likePost = async (postId, isLikedPost = false) => {
    try {
      const response = await LikeService.toggleLike(postId);
      const { liked, likeCount } = response;
      
      if (isLikedPost) {
        // Update in likedPosts array
        setLikedPosts(likedPosts.map(post =>
          post.id === postId ? { ...post, likes: likeCount, userLiked: liked } : post
        ));
      } else {
        // Update in posts array
        setPosts(posts.map(post =>
          post.id === postId ? { ...post, likes: likeCount, userLiked: liked } : post
        ));
      }
      
      // Update activity summary safely
      setUserData(prevData => {
        // Check if activitySummary exists
        const currentLikes = prevData.activitySummary?.postsLiked || 0;
        
        return {
          ...prevData,
          // Create activitySummary if it doesn't exist
          activitySummary: {
            ...(prevData.activitySummary || {}),
            postsLiked: liked ? currentLikes + 1 : Math.max(0, currentLikes - 1)
          }
        };
      });
      
      // If unliked and we're in the liked posts tab, refresh the liked posts
      if (!liked && isLikedPost) {
        // Optionally remove from the current list immediately
        setLikedPosts(likedPosts.filter(post => post.id !== postId));
        // Or refresh the whole list
        fetchLikedPosts();
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      toast.error('Failed to update like status. Please try again.');
    }
  };

  return (
    <div className="profile-page-container">
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
        {/* Header and notifications */}
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

        {/* Notifications Panel */}
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
          {/* Profile Header Component */}
          <ProfileHeader 
            userData={userData}
            openEditModal={openEditModal}
            posts={posts}
            likedPosts={likedPosts}
          />

          {/* Profile Tabs Component */}
          <ProfileTabs
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            posts={posts}
            likedPosts={likedPosts}
            isLoading={isLoading}
            userData={userData}
            followerSearch={followerSearch}
            setFollowerSearch={setFollowerSearch}
            followingSearch={followingSearch}
            setFollowingSearch={setFollowingSearch}
            filteredFollowers={filteredFollowers}
            filteredFollowing={filteredFollowing}
            connections={connections}
            handleFollowToggle={handleFollowToggle}
            handleEditPost={handleEditPost}
            handleDeletePrompt={handleDeletePrompt}
            toggleComments={toggleComments}
            likePost={likePost}
            unlikePost={(postId) => likePost(postId, true)} // Use likePost for unlike as well
            addComment={addComment}
            addReply={addReply}
            likeComment={likeComment}
            getCommentCount={getCommentCount}
          />
        </div>
      </div>

      {/* Edit Profile Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        <div className="edit-profile-modal">
          <h2>Edit Profile</h2>
          <div className="profile-edit-form">
            <div className="edit-profile-picture">
              <img 
                src={profilePicturePreview || userData.profilePicture} 
                alt="Profile" 
              />
              <label className="change-picture-btn">
                <Image size={18} />
                <input 
                  type="file" 
                  accept="image/*" 
                  style={{ display: 'none' }} 
                  onChange={handleProfilePictureChange}
                />
              </label>
            </div>
            
            <div className="edit-cover-photo">
              <label>
                Cover Photo
                <label className="change-cover-btn">
                  <Image size={16} />
                  Change Cover Photo
                  <input 
                    type="file" 
                    accept="image/*" 
                    style={{ display: 'none' }} 
                    onChange={handleCoverImageChange}
                  />
                </label>
              </label>
              <div 
                className="cover-preview" 
                style={{backgroundImage: `url(${coverImagePreview || userData.coverImage})`}}
              ></div>
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
              <button 
                className="cancel-btn" 
                onClick={() => setIsEditModalOpen(false)}
                disabled={isLoading}
              >
                Cancel
              </button>
              <button 
                className="save-btn" 
                onClick={handleSaveProfile}
                disabled={isLoading}
              >
                {isLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      </Modal>

      {/* Post Edit Modal */}
      <Modal isOpen={isPostEditModalOpen} onClose={() => setIsPostEditModalOpen(false)}>
        <div className="edit-post-modal">
          <h2>Edit Post</h2>
          <div className="post-edit-form">
            <div className="edit-field">
              <label>Title</label>
              <input
                type="text"
                name="title"
                value={editedPostData.title}
                onChange={handlePostInputChange}
                required
              />
            </div>
            
            <div className="edit-field">
              <label>Content</label>
              <textarea
                name="content"
                value={editedPostData.content}
                onChange={handlePostInputChange}
                rows={4}
                required
              ></textarea>
            </div>
            
            <div className="edit-row">
              <div className="edit-field half">
                <label>Category</label>
                <select
                  name="category"
                  value={editedPostData.category}
                  onChange={handlePostInputChange}
                >
                  <option value="">Select Category</option>
                  <option value="Design">Design</option>
                  <option value="Coding">Coding</option>
                  <option value="Cooking">Cooking</option>
                  <option value="Music">Music</option>
                  <option value="Art">Art</option>
                  <option value="Fitness">Fitness</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div className="edit-field half">
                <label>Visibility</label>
                <select
                  name="visibility"
                  value={editedPostData.visibility}
                  onChange={handlePostInputChange}
                >
                  <option value="public">Public - Anyone can see</option>
                  <option value="followers">Followers Only</option>
                  <option value="private">Private - Only you can see</option>
                </select>
              </div>
            </div>
            
            <div className="edit-field">
              <label>
                Media (max 3 files)
                <input
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  onChange={handleMediaChange}
                />
              </label>
              {mediaPreview.length > 0 && (
                <div className="media-preview">
                  {mediaPreview.map((media, index) => (
                    <div key={index} className="preview-item">
                      {media.type === 'image' ? (
                        <img src={media.url} alt="Preview" />
                      ) : (
                        <video src={media.url} controls />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="modal-actions">
              <button 
                className="cancel-btn" 
                onClick={() => setIsPostEditModalOpen(false)}
                disabled={isLoading}
              >
                Cancel
              </button>
              <button 
                className="save-btn" 
                onClick={handleSavePostChanges}
                disabled={isLoading}
              >
                {isLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={confirmDeleteModalOpen} onClose={() => setConfirmDeleteModalOpen(false)}>
        <div className="delete-confirmation-modal">
          <h2>Delete Post</h2>
          <p>Are you sure you want to delete this post? This action cannot be undone.</p>
          
          <div className="modal-actions">
            <button 
              className="cancel-btn" 
              onClick={() => setConfirmDeleteModalOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button 
              className="delete-btn" 
              onClick={handleDeletePost}
              disabled={isLoading}
            >
              {isLoading ? 'Deleting...' : 'Delete Post'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default Profile;