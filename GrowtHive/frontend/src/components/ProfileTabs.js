import React, { useState } from 'react';
import { Grid, Heart, Users, Search, X, Edit, Trash2, MessageSquare } from 'lucide-react';
import CommentSection from './CommentSection';
import MediaGallery from './MediaGallery';
import PostMediaModal from './PostMediaModal';
import API_BASE_URL from '../services/baseUrl';

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
  filteredFollowers,
  filteredFollowing,
  handleFollowToggle,
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

 {/* Tab Content */}
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
                    {/* Post header with actions */}
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
                  
             {/* Post media */}
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

                  {/* Media handling - support both mediaFiles and single image */}
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
                {filteredFollowers && filteredFollowers.length > 0 ? (
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
                {filteredFollowing && filteredFollowing.length > 0 ? (
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