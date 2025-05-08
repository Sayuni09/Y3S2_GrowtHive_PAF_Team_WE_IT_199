// LikeService.js
import axios from 'axios';
import API_BASE_URL from './baseUrl';

const LikeService = {
  // Toggle like/unlike for a post
  toggleLike: async (postId) => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/auth/likes/toggle?postId=${postId}`,
        {},
        {
          headers: {
            'Authorization': token ? `Bearer ${token}` : ''
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error toggling like:', error);
      throw error;
    }
  },

  // Get like status and count for a post
  getLikeStatus: async (postId) => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/auth/likes/status?postId=${postId}`,
        {
          headers: {
            'Authorization': token ? `Bearer ${token}` : ''
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error getting like status:', error);
      throw error;
    }
  },
  
  // Check like status for multiple posts (useful when loading feed)
  batchGetLikeStatus: async (postIds) => {
    const token = localStorage.getItem('token');
    const results = {};
    
    try {
      // We could optimize this with a backend batch endpoint in the future
      for (const postId of postIds) {
        const response = await axios.get(
          `${API_BASE_URL}/api/auth/likes/status?postId=${postId}`,
          {
            headers: {
              'Authorization': token ? `Bearer ${token}` : ''
            }
          }
        );
        results[postId] = response.data;
      }
      return results;
    } catch (error) {
      console.error('Error getting batch like status:', error);
      throw error;
    }
  },

   // Get all posts liked by the current user
   getUserLikedPosts: async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/auth/likes/user-liked-posts`,
        {
          headers: {
            'Authorization': token ? `Bearer ${token}` : ''
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error getting user liked posts:', error);
      throw error;
    }
  }
};

export default LikeService;
