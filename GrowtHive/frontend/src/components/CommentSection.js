// src/components/CommentSection.js
import React, { useState, useEffect, useCallback } from 'react';
import { Reply, X, Send, Edit, Trash2 } from 'lucide-react';
import CommentSectionService from '../services/CommentSectionService';
import '../styles/CommentSection.css';

function CommentSection({ post, postId: propPostId, userData, onClose, onAddComment }) {
  // Support both post object or direct postId
  const effectivePostId = post?.id || propPostId;
  
  const [comments, setComments] = useState([]);
  const [organizedComments, setOrganizedComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [editingComment, setEditingComment] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [animateComment, setAnimateComment] = useState(false);

  // Use useCallback to memoize the fetchComments function
  const fetchComments = useCallback(async () => {
    if (!effectivePostId) return;
    
    try {
      setLoading(true);
      const response = await CommentSectionService.getCommentsByPostId(effectivePostId);
      setComments(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching comments:", err);
      setError("Failed to load comments. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [effectivePostId]); // effectivePostId is the only dependency

  // Organize comments into parent-child structure for rendering
  useEffect(() => {
    // Map to store all comments by ID
    const commentsById = {};
    comments.forEach(comment => {
      commentsById[comment.id] = {
        ...comment,
        replies: []
      };
    });
    
    // Separate top-level comments and replies
    const topLevelComments = [];
    
    comments.forEach(comment => {
      // If this is a reply (has a parentId)
      if (comment.parentId) {
        // Add to parent's replies if parent exists
        if (commentsById[comment.parentId]) {
          commentsById[comment.parentId].replies.push(commentsById[comment.id]);
        }
      } else {
        // This is a top-level comment
        topLevelComments.push(commentsById[comment.id]);
      }
    });
    
    setOrganizedComments(topLevelComments);
  }, [comments]);

  // Fetch comments when component mounts or fetchComments changes
  useEffect(() => {
    fetchComments();
  }, [fetchComments]); // fetchComments is now a stable dependency

  // Handle adding a new comment
  const handleAddComment = async () => {
    if (!newComment.trim() || !effectivePostId) return;
    
    try {
      const response = await CommentSectionService.createComment(effectivePostId, newComment);
      
      // Add the new comment to the comments list
      setComments(prevComments => [response.data, ...prevComments]);
      setNewComment('');
      
      // Show animation feedback
      setAnimateComment(true);
      setTimeout(() => setAnimateComment(false), 500);
      
      // If parent component provided a callback, call it
      if (onAddComment) {
        onAddComment(effectivePostId, newComment);
      }
    } catch (err) {
      console.error("Error adding comment:", err);
      setError("Failed to add comment. Please try again.");
    }
  };

  // Handle adding a reply to a comment
  const handleAddReply = async (parentId) => {
    if (!newComment.trim() || !effectivePostId) return;
    
    try {
      const response = await CommentSectionService.createComment(effectivePostId, newComment, parentId);
      
      // Add the new reply to the comments list
      setComments(prevComments => [response.data, ...prevComments]);
      setNewComment('');
      setReplyingTo(null);
      
      // Show animation feedback
      setAnimateComment(true);
      setTimeout(() => setAnimateComment(false), 500);
    } catch (err) {
      console.error("Error adding reply:", err);
      setError("Failed to add reply. Please try again.");
    }
  };

  // Handle updating a comment
  const handleUpdateComment = async () => {
    if (!editContent.trim() || !editingComment) return;
    
    try {
      const response = await CommentSectionService.updateComment(editingComment.id, editContent);
      
      // Update the comments state with the edited comment
      const updatedComments = comments.map(comment => 
        comment.id === editingComment.id ? response.data : comment
      );
      
      setComments(updatedComments);
      setEditingComment(null);
      setEditContent('');
    } catch (err) {
      console.error("Error updating comment:", err);
      setError("Failed to update comment. Please try again.");
    }
  };

  // Handle deleting a comment
  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) return;
    
    try {
      await CommentSectionService.deleteComment(commentId);
      
      // Find and remove the deleted comment and its replies from state
      const idsToRemove = new Set([commentId]);
      
      // Find all replies to this comment (recursively if needed)
      const findReplies = (cid) => {
        comments.forEach(c => {
          if (c.parentId === cid) {
            idsToRemove.add(c.id);
            findReplies(c.id); // Recursively find replies to replies
          }
        });
      };
      
      findReplies(commentId);
      
      // Filter out the deleted comment and its replies
      const filteredComments = comments.filter(comment => !idsToRemove.has(comment.id));
      setComments(filteredComments);
    } catch (err) {
      console.error("Error deleting comment:", err);
      setError("Failed to delete comment. Please try again.");
    }
  };

  // Check if comment belongs to logged in user
  const isCommentOwner = (comment) => {
    return comment.userId === userData.id;
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'Recently';
    
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  // Reset focus when component unmounts
  useEffect(() => {
    return () => {
      document.activeElement?.blur();
    };
  }, []);

  // Recursive function to render comments and their replies
  const renderComment = (comment, level = 0) => {
    return (
      <div key={comment.id} className="comment-container" style={{ marginLeft: level > 0 ? `${level * 20}px` : '0' }}>
        {editingComment && editingComment.id === comment.id ? (
          // Edit comment form
          <div className="reply-form">
            <img 
              src={userData.profilePicture || "https://randomuser.me/api/portraits/lego/1.jpg"} 
              alt={userData.name} 
              className="comment-avatar" 
            />
            <div className="reply-input-container">
              <textarea 
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                autoFocus
              ></textarea>
              <div className="reply-actions">
                <button 
                  className="cancel-reply" 
                  onClick={() => {
                    setEditingComment(null);
                    setEditContent('');
                  }}
                >
                  <X size={16} />
                  <span>Cancel</span>
                </button>
                <button 
                  className="send-reply" 
                  onClick={handleUpdateComment}
                  disabled={!editContent.trim()}
                >
                  <Send size={16} />
                  <span>Update</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          // Comment view
          <div className="comment">
            <img 
              src={comment.userProfilePic || "https://randomuser.me/api/portraits/lego/1.jpg"} 
              alt={comment.userName || "User"} 
              className="comment-avatar" 
            />
            <div className="comment-content">
              <div className="comment-header">
                <h5>{comment.userName || "Anonymous"}</h5>
                <span className="comment-time">{formatDate(comment.createdAt)}</span>
              </div>
              <p>{comment.content}</p>
              <div className="comment-actions">
                <button 
                  className="comment-action-btn"
                  onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                >
                  <Reply size={16} />
                  <span>Reply</span>
                </button>
                
                {/* Edit and Delete buttons - only show for comment owner */}
                {isCommentOwner(comment) && (
                  <>
                    <button 
                      className="comment-action-btn" 
                      onClick={() => {
                        setEditingComment(comment);
                        setEditContent(comment.content);
                      }}
                    >
                      <Edit size={16} />
                      <span>Edit</span>
                    </button>
                    <button 
                      className="comment-action-btn" 
                      onClick={() => handleDeleteComment(comment.id)}
                    >
                      <Trash2 size={16} />
                      <span>Delete</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Reply Form */}
        {replyingTo === comment.id && (
          <div className="reply-form">
            <img 
              src={userData.profilePicture || "https://randomuser.me/api/portraits/lego/1.jpg"} 
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

        {/* Render replies */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="replies-container">
            {comment.replies.map(reply => renderComment(reply, level + 1))}
          </div>
        )}
      </div>
    );
  };

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
      
      {loading ? (
        <div className="empty-comments">
          <p>Loading comments...</p>
        </div>
      ) : error ? (
        <div className="empty-comments">
          <p>{error}</p>
        </div>
      ) : comments.length === 0 ? (
        <div className="empty-comments">
          <p>No comments yet. Be the first to share your thoughts!</p>
        </div>
      ) : (
        <div className="comments-list">
          {organizedComments.map(comment => renderComment(comment))}
        </div>
      )}
      
      {/* Add a new top-level comment */}
      <div className="add-comment">
        <img 
          src={userData.profilePicture || "https://randomuser.me/api/portraits/lego/1.jpg"} 
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
