// src/components/MakeoverChallenge.js
import React, { useState } from 'react';
import { Trophy, ThumbsUp, MessageSquare, Share2, Calendar, Users, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import '../styles/MakeoverChallenge.css';

function MakeoverChallenge({ challenge, isCompact = false }) {
  const [voteCount, setVoteCount] = useState(challenge.votes || 0);
  const [hasVoted, setHasVoted] = useState(false);

  const handleVote = (e) => {
    e.preventDefault();
    if (!hasVoted) {
      setVoteCount(voteCount + 1);
      setHasVoted(true);
    } else {
      setVoteCount(voteCount - 1);
      setHasVoted(false);
    }
  };

  // If compact mode, render a simplified card
  if (isCompact) {
    return (
      <Link to={`/makeover-challenges/${challenge.id}`} className="challenge-card-compact">
        <div className="challenge-card-image">
          <img src={challenge.roomImage} alt={challenge.title} />
          <div className="challenge-status">
            {challenge.isActive ? (
              <span className="active-badge">Active</span>
            ) : (
              <span className="completed-badge">Completed</span>
            )}
          </div>
        </div>
        <div className="challenge-card-content">
          <h3>{challenge.title}</h3>
          <div className="challenge-meta">
            <span className="challenge-participants">
              <Users size={14} />
              {challenge.participants} participants
            </span>
            <span className="challenge-deadline">
              <Calendar size={14} />
              {challenge.endsIn}
            </span>
          </div>
        </div>
      </Link>
    );
  }

  // Full challenge card
  return (
    <div className="challenge-card">
      <div className="challenge-card-header">
        <div className={`challenge-status ${challenge.isActive ? 'active' : 'completed'}`}>
          {challenge.isActive ? (
            <>
              <span className="status-icon">●</span>
              Active Challenge
            </>
          ) : (
            <>
              <Trophy size={16} />
              Completed
            </>
          )}
        </div>
        <div className="challenge-author">
          <img src={challenge.author.avatar} alt={challenge.author.name} />
          <span>by {challenge.author.name}</span>
        </div>
      </div>

      <h2 className="challenge-title">{challenge.title}</h2>
      
      <div className="challenge-image-container">
        <img src={challenge.roomImage} alt={challenge.title} className="challenge-image" />
        {challenge.submissionsCount > 0 && (
          <div className="submissions-preview">
            <div className="submission-count">
              <span>{challenge.submissionsCount}</span>
              <small>designs</small>
            </div>
            <div className="submission-thumbnails">
              {challenge.topSubmissions.map((submission, index) => (
                <div key={index} className="submission-thumbnail">
                  <img src={submission.image} alt={`Submission ${index + 1}`} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="challenge-details">
        <p className="challenge-description">{challenge.description}</p>
        
        <div className="challenge-meta-info">
          <div className="meta-item">
            <Calendar size={18} />
            <div className="meta-content">
              <span className="meta-label">Deadline</span>
              <span className="meta-value">{challenge.deadline}</span>
            </div>
          </div>
          <div className="meta-item">
            <Users size={18} />
            <div className="meta-content">
              <span className="meta-label">Participants</span>
              <span className="meta-value">{challenge.participants}</span>
            </div>
          </div>
          <div className="meta-item">
            <Trophy size={18} />
            <div className="meta-content">
              <span className="meta-label">Prize</span>
              <span className="meta-value">{challenge.prize || "Community Recognition"}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="challenge-actions">
        <button className={`vote-button ${hasVoted ? 'voted' : ''}`} onClick={handleVote}>
          <ThumbsUp size={18} />
          <span>{voteCount}</span>
        </button>
        <button className="comment-button">
          <MessageSquare size={18} />
          <span>{challenge.comments || 0}</span>
        </button>
        <button className="share-button">
          <Share2 size={18} />
        </button>
        <Link to={`/makeover-challenges/${challenge.id}`} className="view-details-button">
          <span>View Details</span>
          <ArrowRight size={18} />
        </Link>
      </div>
    </div>
  );
}

export default MakeoverChallenge;
