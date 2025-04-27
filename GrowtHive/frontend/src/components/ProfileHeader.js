import React from 'react';
import { Edit } from 'lucide-react';

function ProfileHeader({ userData, openEditModal, posts, likedPosts }) {
  return (
    <>
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
    </>
  );
}

export default ProfileHeader;
