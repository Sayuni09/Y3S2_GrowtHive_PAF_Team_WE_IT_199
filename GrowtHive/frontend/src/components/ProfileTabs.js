import React, { useEffect, useState } from 'react';
import { Grid, Heart, Users, Search, X, Edit, Trash2, MessageSquare } from 'lucide-react';
import CommentSection from './CommentSection';
import MediaGallery from './MediaGallery';
import PostMediaModal from './PostMediaModal';
import API_BASE_URL from '../services/baseUrl';
import FollowService from '../services/FollowService';
import axios from 'axios';
import { toast } from 'react-toastify';

function ProfileTabs({
  activeTab,
  setActiveTab,
  posts,
  likedPosts,
  isLoading,
  userData,
  followerSearch,
  setFollowerSearch,
  followingSearch,
  setFollowingSearch,
  handleEditPost,
  handleDeletePrompt,
  toggleComments,
  likePost,
  addComment,
  addReply,
  likeComment,
  getCommentCount
}) {
  const [activeMediaPost, setActiveMediaPost] = useState(null);
  const [initialMediaIndex, setInitialMediaIndex] = useState(0);

  // Followers and following state
  const [allUsers, setAllUsers] = useState([]);
  const [loadingConnections, setLoadingConnections] = useState(false);

  // Fetch all users (except self) with follow status
  useEffect(() => {
    const fetchConnections = async () => {
      if (!userData.id) return;
      setLoadingConnections(true);
      try {
        const token = localStorage.getItem('jwt-token') || localStorage.getItem('token');
        const res = await axios.get(
          `${API_BASE_URL}/api/auth/users/search?query=`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setAllUsers(res.data || []);
      } catch (err) {
        setAllUsers([]);
        toast.error('Failed to load connections');
      }
      setLoadingConnections(false);
    };
    fetchConnections();
  }, [userData.id]);

  // Filtered followers and following lists
  const filteredFollowers = allUsers
    .filter(u =>
      (u.name || '').toLowerCase().includes(followerSearch.toLowerCase()) ||
      (u.email || '').toLowerCase().includes(followerSearch.toLowerCase())
    )
    .filter(u => !u.isFollowing); // Not followed by current user (for "Follow Back")

  const filteredFollowing = allUsers
    .filter(u =>
      (u.name || '').toLowerCase().includes(followingSearch.toLowerCase()) ||
      (u.email || '').toLowerCase().includes(followingSearch.toLowerCase())
    )
    .filter(u => u.isFollowing); // Followed by current user

  // Follow/Unfollow logic
  const handleFollow = async (userId) => {
    try {
      await FollowService.followUser(userId);
      setAllUsers(users =>
        users.map(u =>
          u.id === userId ? { ...u, isFollowing: true } : u
        )
      );
      toast.success('Followed user!');
    } catch (e) {
      toast.error(
        e?.response?.data?.error ||
        (e?.response?.data?.message ? e.response.data.message : 'Could not follow user')
      );
    }
  };

  const handleUnfollow = async (userId) => {
    try {
      await FollowService.unfollowUser(userId);
      setAllUsers(users =>
        users.map(u =>
          u.id === userId ? { ...u, isFollowing: false } : u
        )
      );
      toast.success('Unfollowed user!');
    } catch (e) {
      toast.error(
        e?.response?.data?.error ||
        (e?.response?.data?.message ? e.response.data.message : 'Could not unfollow user')
      );
    }
  };

  const openMediaModal = (post, index = 0) => {
    setActiveMediaPost(post);
    setInitialMediaIndex(index);
  };

  const closeMediaModal = () => {
    setActiveMediaPost(null);
  };

  return (
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

      <div className="tab-content">
        {/* Posts Tab */}
        {activeTab === 'posts' && (
          <div className="posts-grid">
            {isLoading ? (
              <div className="loading">Loading your posts...</div>
            ) : posts.length > 0 ? (
              posts.map(post => (
                <div key={post.id} className="post-card">
                  <div className="post-content">
                    <div className="post-header-actions">
                      <h3 className="post-title">{post.title}</h3>
                      <div className="post-actions">
                        <button
                          className="edit-post-btn"
                          onClick={() => handleEditPost(post)}
                          aria-label="Edit post"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          className="delete-post-btn"
                          onClick={() => handleDeletePrompt(post)}
                          aria-label="Delete post"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    <p className="post-excerpt">{post.content}</p>
                    <div className="post-meta">
                      <span className="post-time">{post.timestamp}</span>
                      {post.category && (
                        <span className="post-category">{post.category}</span>
                      )}
                      <div className="post-stats">
                        <span
                          className="stat"
                          onClick={() => likePost(post.id)}
                        >
                          <Heart
                            size={16}
                            className={post.userLiked ? "liked-heart filled" : ""}
                          />
                          {post.likes}
                        </span>
                        <span
                          className={`stat comment-toggle ${post.showComments ? 'active' : ''}`}
                          onClick={() => toggleComments(post.id)}
                        >
                          <MessageSquare size={16} />
                          {getCommentCount(post)}
                        </span>
                      </div>
                    </div>
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
                  {post.mediaFiles && post.mediaFiles.length > 0 && (
                    <MediaGallery
                      mediaFiles={post.mediaFiles}
                      API_BASE_URL={API_BASE_URL}
                      onClick={() => openMediaModal(post)}
                    />
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

        {/* Liked Posts Tab */}
        {activeTab === 'liked' && (
          <div className="posts-grid">
            {isLoading ? (
              <div className="loading">Loading your liked posts...</div>
            ) : likedPosts.length > 0 ? (
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
                        <span
                          className="stat"
                          onClick={() => likePost(post.id, true)}
                        >
                          <Heart
                            size={16}
                            className={post.userLiked ? "liked-heart filled" : ""}
                          />
                          {post.likes}
                        </span>
                        <span
                          className={`stat comment-toggle ${post.showComments ? 'active' : ''}`}
                          onClick={() => toggleComments(post.id, true)}
                        >
                          <MessageSquare size={16} />
                          <span className="comment-count">{getCommentCount(post)}</span>
                        </span>
                      </div>
                    </div>
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
                  {post.mediaFiles && post.mediaFiles.length > 0 ? (
                    <MediaGallery
                      mediaFiles={post.mediaFiles}
                      API_BASE_URL={API_BASE_URL}
                      onClick={() => openMediaModal(post)}
                    />
                  ) : post.image && (
                    <div className="media-gallery" onClick={() => openMediaModal(post)}>
                      <div className="media-container">
                        <img src={post.image} alt={post.title} className="gallery-media" />
                      </div>
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
              <h3>Followers (not followed by you)</h3>
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
                {loadingConnections ? (
                  <div className="loading">Loading followers...</div>
                ) : filteredFollowers.length > 0 ? (
                  filteredFollowers.map(follower => (
                    <div key={follower.id} className="connection-card">
                      <div className="connection-info">
                        <img src={follower.profilePicture || 'https://randomuser.me/api/portraits/lego/1.jpg'} alt={follower.name} />
                        <span className="connection-name">{follower.name}</span>
                      </div>
                      <button
                        className="connection-action"
                        onClick={() => handleFollow(follower.id)}
                      >
                        Follow Back
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
                {loadingConnections ? (
                  <div className="loading">Loading following...</div>
                ) : filteredFollowing.length > 0 ? (
                  filteredFollowing.map(followed => (
                    <div key={followed.id} className="connection-card">
                      <div className="connection-info">
                        <img src={followed.profilePicture || 'https://randomuser.me/api/portraits/lego/2.jpg'} alt={followed.name} />
                        <span className="connection-name">{followed.name}</span>
                      </div>
                      <button
                        className="connection-action following"
                        onClick={() => handleUnfollow(followed.id)}
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

      {/* Media Modal */}
      {activeMediaPost && (
        <PostMediaModal
          isOpen={activeMediaPost !== null}
          onClose={closeMediaModal}
          mediaFiles={activeMediaPost.mediaFiles ||
            (activeMediaPost.image ? [{ type: 'image', url: activeMediaPost.image.replace(API_BASE_URL, '') }] : [])}
          API_BASE_URL={API_BASE_URL}
          initialIndex={initialMediaIndex}
        />
      )}
    </div>
  );
}

export default ProfileTabs;
