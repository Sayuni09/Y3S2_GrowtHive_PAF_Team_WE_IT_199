import axios from 'axios';
import API_BASE_URL from './baseUrl';

const ROOM_MAKEOVER_API_URL = `${API_BASE_URL}/api/auth/room-makeover`;

/**
 * Service for handling room makeover functionality.
 * All requests require a JWT token in Authorization header.
 */
const RoomMakeoverService = {
  /**
   * Upload a room image to the server.
   * @param {File} file - The image file to upload
   * @returns {Promise<Object>} - Response with file details
   */
  uploadRoomImage: async (file) => {
    const token = localStorage.getItem('token') || JSON.parse(localStorage.getItem('user'))?.token;
    if (!token) throw new Error('No authentication token found');
    
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const response = await axios.post(`${ROOM_MAKEOVER_API_URL}/upload`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading room image:', error);
      throw error.response?.data || error;
    }
  },

  /**
   * Generate a room redesign based on original image and design style.
   * @param {string} originalImageName - The filename of the original image
   * @param {string} designStyle - The design style to apply
   * @returns {Promise<Object>} - Response with redesign details
   */
  generateRoomRedesign: async (originalImageName, designStyle) => {
    const token = localStorage.getItem('token') || JSON.parse(localStorage.getItem('user'))?.token;
    if (!token) throw new Error('No authentication token found');
    
    const formData = new FormData();
    formData.append('originalImageName', originalImageName);
    formData.append('designStyle', designStyle);
    
    try {
      const response = await axios.post(`${ROOM_MAKEOVER_API_URL}/generate`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error generating room redesign:', error);
      throw error.response?.data || error;
    }
  },

  /**
   * Get the URL for an image by filename.
   * @param {string} fileName - The name of the image file
   * @returns {string} - The full URL to the image
   */
  getImageUrl: (fileName) => {
    return `${ROOM_MAKEOVER_API_URL}/images/${fileName}`;
  },

  /**
   * Get all makeovers for the current user.
   * @returns {Promise<Array>} - List of user's makeovers
   */
  getUserMakeovers: async () => {
    const token = localStorage.getItem('token') || JSON.parse(localStorage.getItem('user'))?.token;
    if (!token) throw new Error('No authentication token found');
    
    try {
      const response = await axios.get(`${ROOM_MAKEOVER_API_URL}/my-makeovers`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error getting user makeovers:', error);
      throw error.response?.data || error;
    }
  },

  /**
   * Get a specific makeover by ID.
   * @param {string} id - The ID of the makeover
   * @returns {Promise<Object>} - The makeover details
   */
  getMakeover: async (id) => {
    const token = localStorage.getItem('token') || JSON.parse(localStorage.getItem('user'))?.token;
    if (!token) throw new Error('No authentication token found');
    
    try {
      const response = await axios.get(`${ROOM_MAKEOVER_API_URL}/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error getting makeover details:', error);
      throw error.response?.data || error;
    }
  },

  /**
   * Delete a makeover by ID.
   * @param {string} id - The ID of the makeover to delete
   * @returns {Promise<Object>} - Response with success message
   */
  deleteMakeover: async (id) => {
    const token = localStorage.getItem('token') || JSON.parse(localStorage.getItem('user'))?.token;
    if (!token) throw new Error('No authentication token found');
    
    try {
      const response = await axios.delete(`${ROOM_MAKEOVER_API_URL}/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error deleting makeover:', error);
      throw error.response?.data || error;
    }
  },

  /**
   * Get available design styles.
   * @returns {Array} - List of design style options
   */
  getDesignStyles: () => {
    return [
      { value: 'SCANDINAVIAN', label: 'Scandinavian', description: 'Clean, simple designs with natural materials' },
      { value: 'MODERN', label: 'Modern', description: 'Sleek lines and minimalist approach' },
      { value: 'INDUSTRIAL', label: 'Industrial', description: 'Raw materials and exposed elements' },
      { value: 'BOHEMIAN', label: 'Bohemian', description: 'Colorful, eclectic mix of patterns and textures' },
      { value: 'TRADITIONAL', label: 'Traditional', description: 'Classic, timeless designs with elegant details' },
      { value: 'COASTAL', label: 'Coastal', description: 'Light, airy spaces inspired by the beach' },
      { value: 'FARMHOUSE', label: 'Farmhouse', description: 'Rustic charm with practical comfort' }
    ];
  }
};

export default RoomMakeoverService;
