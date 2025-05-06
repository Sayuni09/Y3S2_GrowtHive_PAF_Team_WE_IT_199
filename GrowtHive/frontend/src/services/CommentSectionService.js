// src/services/CommentSectionService.js
import axios from 'axios';
import API_BASE_URL from './baseUrl';

const COMMENTS_API_URL = `${API_BASE_URL}/api/auth/comments`;

class CommentSectionService {
  // Get all comments for a post
  getCommentsByPostId(postId) {
    return axios.get(`${COMMENTS_API_URL}/post/${postId}`);
  }

  // Create a new comment
  createComment(postId, content, parentId = null) {
    // Use FormData for better compatibility with Spring backend
    const formData = new FormData();
    formData.append('postId', postId);
    formData.append('content', content);
    
    // Add parentId if provided (for replies)
    if (parentId) {
      formData.append('parentId', parentId);
    }
    
    // Get auth token from localStorage
    const token = localStorage.getItem('token');
    
    return axios.post(COMMENTS_API_URL, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': token ? `Bearer ${token}` : ''
      }
    });
  }

  // Update an existing comment
  updateComment(commentId, content) {
    // Use FormData for better compatibility with Spring backend
    const formData = new FormData();
    formData.append('content', content);
    
    // Get auth token from localStorage
    const token = localStorage.getItem('token');
    
    return axios.put(`${COMMENTS_API_URL}/${commentId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': token ? `Bearer ${token}` : ''
      }
    });
  }

  // Delete a comment
  deleteComment(commentId) {
    // Get auth token from localStorage
    const token = localStorage.getItem('token');
    
    return axios.delete(`${COMMENTS_API_URL}/${commentId}`, {
      headers: {
        'Authorization': token ? `Bearer ${token}` : ''
      }
    });
  }
}

// Create instance and then export
const commentSectionService = new CommentSectionService();
export default commentSectionService;
