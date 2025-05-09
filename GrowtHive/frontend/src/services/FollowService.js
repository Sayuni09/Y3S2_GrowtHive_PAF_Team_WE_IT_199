import axios from 'axios';
import API_BASE_URL from './baseUrl';

/**
 * Service for follow/unfollow functionality.
 * All requests require a JWT token in Authorization header.
 */
const FollowService = {
  /**
   * Follow a user by userId.
   * @param {string} userId - The ID of the user to follow.
   * @returns {Promise<Object>} - Response data from backend.
   */
  followUser: async (userId) => {
    const token = localStorage.getItem('jwt-token') || localStorage.getItem('token');
    if (!token) throw new Error('No authentication token found');
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/auth/follow/${userId}`,
        {}, // No body needed
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      // Forward backend error to caller
      if (error.response && error.response.data) {
        throw error;
      }
      throw new Error('Network error');
    }
  },

  /**
   * Unfollow a user by userId.
   * @param {string} userId - The ID of the user to unfollow.
   * @returns {Promise<Object>} - Response data from backend.
   */
  unfollowUser: async (userId) => {
    const token = localStorage.getItem('jwt-token') || localStorage.getItem('token');
    if (!token) throw new Error('No authentication token found');
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/api/auth/follow/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        throw error;
      }
      throw new Error('Network error');
    }
  },

  /**
   * Check if the current user is following the specified user.
   * @param {string} userId - The ID of the user to check.
   * @returns {Promise<boolean>} - { following: true/false }
   */
  checkFollowStatus: async (userId) => {
    const token = localStorage.getItem('jwt-token') || localStorage.getItem('token');
    if (!token) throw new Error('No authentication token found');
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/auth/follow/status/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data; // { following: true/false }
    } catch (error) {
      if (error.response && error.response.data) {
        throw error;
      }
      throw new Error('Network error');
    }
  }
};

export default FollowService;
