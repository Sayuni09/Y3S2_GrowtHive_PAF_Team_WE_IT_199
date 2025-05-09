// src/services/ProfileService.js
import axios from 'axios';
import API_BASE_URL from './baseUrl';

const API_URL = `${API_BASE_URL}/api/auth/profile`;

class ProfileService {
  // Get auth header with token
  _getAuthHeader() {
    const user = JSON.parse(localStorage.getItem('user'));
    
    if (user && user.token) {
      return { Authorization: `Bearer ${user.token}` };
    } else {
      return {};
    }
  }

  // Get current user's profile
  async getCurrentUserProfile() {
    try {
      const response = await axios.get(`${API_URL}/me`, { 
        headers: this._getAuthHeader(),
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      this._handleError(error);
      throw error;
    }
  }

  // Get profile by userId
  async getProfileByUserId(userId) {
    try {
      const response = await axios.get(`${API_URL}/${userId}`, { 
        headers: this._getAuthHeader(),
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      this._handleError(error);
      throw error;
    }
  }

  // Update profile details
  async updateProfile(profileData) {
    try {
      const response = await axios.put(`${API_URL}/update`, profileData, { 
        headers: {
          ...this._getAuthHeader(),
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      this._handleError(error);
      throw error;
    }
  }

  // Upload profile picture
  async uploadProfilePicture(file) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await axios.post(`${API_URL}/picture`, formData, {
        headers: {
          ...this._getAuthHeader()
          // Note: Don't set Content-Type for multipart/form-data - axios sets it automatically with boundary
        },
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      this._handleError(error);
      throw error;
    }
  }

  // Upload cover image
  async uploadCoverImage(file) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await axios.post(`${API_URL}/cover`, formData, {
        headers: {
          ...this._getAuthHeader()
        },
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      this._handleError(error);
      throw error;
    }
  }

  // Update profile images directly with URLs
  async updateProfileImages(profilePicture, coverImage) {
    const data = {};
    if (profilePicture) data.profilePicture = profilePicture;
    if (coverImage) data.coverImage = coverImage;
    
    return this.updateProfile(data);
  }

  // Get activity summary data
  async getActivitySummary() {
    try {
      const profile = await this.getCurrentUserProfile();
      return profile.activitySummary;
    } catch (error) {
      this._handleError(error);
      throw error;
    }
  }

  // Helper method to handle errors
  _handleError(error) {
    if (error.response) {
      console.error("Error response:", error.response.data);
      
      // If unauthorized, redirect to login
      if (error.response.status === 401) {
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Request error:", error.message);
    }
  }
}

// Fix: Assign instance to a variable before exporting
const profileService = new ProfileService();
export default profileService;
