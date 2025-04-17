// src/components/CommentSection.js
import React, { useState, useEffect } from 'react';
import { ThumbsUp, Reply, X, Send } from 'lucide-react';
import '../styles/CommentSection.css'; // Import your CSS styles

function CommentSection({ 
  post, 
  userData, 
  onAddComment, 
  onAddReply, 
  onLikeComment,
  onClose 
}) {
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [animateComment, setAnimateComment] = useState(false);

  // Handle adding a new comment
  const handleAddComment = () => {
    if (!newComment.trim()) return;
    
    onAddComment(post.id, newComment);
    setNewComment('');
    
    // Show animation feedback
    setAnimateComment(true);
    setTimeout(() => setAnimateComment(false), 500);
  };

  // Handle adding a reply to a comment
  const handleAddReply = (commentId) => {
    if (!newComment.trim()) return;
    
    onAddReply(post.id, commentId, newComment);
    setNewComment('');
    setReplyingTo(null);
  };

  // Reset focus when component unmounts
  useEffect(() => {
    return () => {
      document.activeElement?.blur();
    };
  }, []);

  // Ensure comments array exists
  const comments = post.comments || [];

  return (
    <div className="comments-section">
      <div className="comments-header">
        <h4>Comments <span>({comments.length})</span></h4>
        {onClose && (
          <button className="comments-close-btn" onClick={onClose}>
            <X size={16} />
          </button>
        )}
      </div>
      
      {comments.length === 0 ? (
        <div className="empty-comments">
          <p>No comments yet. Be the first to share your thoughts!</p>
        </div>
      ) : (
        <div className="comments-list">
          {comments.map(comment => (
            <div key={comment.id} className="comment-container">
              <div className="comment">
                <img 
                  src={comment.user?.profilePic || comment.user?.profilePicture || 'https://randomuser.me/api/portraits/lego/1.jpg'} 
                  alt={comment.user?.name || 'User'} 
                  className="comment-avatar" 
                />
                <div className="comment-content">
                  <div className="comment-header">
                    <h5>{comment.user?.name || 'Anonymous'}</h5>
                    <span className="comment-time">{comment.time || 'Recently'}</span>
                  </div>
                  <p>{comment.content}</p>
                  <div className="comment-actions">
                    <button 
                      className="comment-action-btn" 
                      onClick={() => onLikeComment(post.id, comment.id)}
                    >
                      <ThumbsUp size={16} />
                      <span>{comment.likes || 0}</span>
                    </button>
                    <button 
                      className="comment-action-btn"
                      onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                    >
                      <Reply size={16} />
                      <span>Reply</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Reply Form */}
              {replyingTo === comment.id && (
                <div className="reply-form">
                  <img 
                    src={userData.profilePicture} 
                    alt={userData.name} 
                    className="comment-avatar" 
                  />
                  <div className="reply-input-container">
                    <textarea 
                      placeholder="Write a reply..." 
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      autoFocus
                    ></textarea>
                    <div className="reply-actions">
                      <button 
                        className="cancel-reply" 
                        onClick={() => {
                          setReplyingTo(null);
                          setNewComment('');
                        }}
                      >
                        <X size={16} />
                        <span>Cancel</span>
                      </button>
                      <button 
                        className="send-reply" 
                        onClick={() => handleAddReply(comment.id)}
                        disabled={!newComment.trim()}
                      >
                        <Send size={16} />
                        <span>Reply</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Replies */}
              {comment.replies && comment.replies.length > 0 && (
                <div className="replies-container">
                  {comment.replies.map(reply => (
                    <div key={reply.id} className="reply">
                      <img 
                        src={reply.user?.profilePic || reply.user?.profilePicture || 'https://randomuser.me/api/portraits/lego/1.jpg'} 
                        alt={reply.user?.name || 'User'} 
                        className="comment-avatar" 
                      />
                      <div className="comment-content">
                        <div className="comment-header">
                          <h5>{reply.user?.name || 'Anonymous'}</h5>
                          <span className="comment-time">{reply.time || 'Recently'}</span>
                        </div>
                        <p>{reply.content}</p>
                        <div className="comment-actions">
                          <button 
                            className="comment-action-btn" 
                            onClick={() => onLikeComment(post.id, comment.id, reply.id)}
                          >
                            <ThumbsUp size={16} />
                            <span>{reply.likes || 0}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      
      {/* Add a new comment */}
      <div className="add-comment">
        <img 
          src={userData.profilePicture} 
          alt={userData.name} 
          className="comment-avatar" 
        />
        <div className={`comment-input-container ${animateComment ? 'animate-pulse' : ''}`}>
          <textarea 
            placeholder="Write a comment..." 
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          ></textarea>
          <button 
            className="send-comment" 
            onClick={handleAddComment}
            disabled={!newComment.trim()}
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default CommentSection;
