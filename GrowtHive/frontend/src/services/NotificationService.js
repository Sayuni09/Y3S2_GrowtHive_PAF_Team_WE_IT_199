// NotificationService.js
import axios from 'axios';
import API_BASE_URL from './baseUrl';

const NOTIFICATIONS_API_URL = `${API_BASE_URL}/api/auth/notifications`;

/**
 * Service for handling user notifications.
 * All requests require a JWT token in Authorization header.
 */
const NotificationService = {
  /**
   * Get all notifications for the current user.
   * @returns {Promise<Array>} - List of all notifications.
   */
  getAllNotifications: async () => {
    const token = localStorage.getItem('jwt-token') || localStorage.getItem('token');
    if (!token) throw new Error('No authentication token found');
    
    try {
      const response = await axios.get(NOTIFICATIONS_API_URL, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error getting all notifications:', error);
      throw error;
    }
  },

  /**
   * Get only unread notifications for the current user.
   * @returns {Promise<Array>} - List of unread notifications.
   */
  getUnreadNotifications: async () => {
    const token = localStorage.getItem('jwt-token') || localStorage.getItem('token');
    if (!token) throw new Error('No authentication token found');
    
    try {
      const response = await axios.get(`${NOTIFICATIONS_API_URL}/unread`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error getting unread notifications:', error);
      throw error;
    }
  },

  /**
   * Get notification status (count and if there are unread notifications).
   * @returns {Promise<Object>} - Status object with unreadCount and hasUnread properties.
   */
  getNotificationStatus: async () => {
    const token = localStorage.getItem('jwt-token') || localStorage.getItem('token');
    if (!token) throw new Error('No authentication token found');
    
    try {
      const response = await axios.get(`${NOTIFICATIONS_API_URL}/status`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error getting notification status:', error);
      throw error;
    }
  },

  /**
   * Mark a specific notification as read.
   * @param {string} notificationId - The ID of the notification to mark as read.
   * @returns {Promise<Object>} - The updated notification.
   */
  markNotificationAsRead: async (notificationId) => {
    const token = localStorage.getItem('jwt-token') || localStorage.getItem('token');
    if (!token) throw new Error('No authentication token found');
    
    try {
      const response = await axios.put(`${NOTIFICATIONS_API_URL}/${notificationId}/read`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  },

  /**
   * Mark all notifications as read for the current user.
   * @returns {Promise<Object>} - Response with success message.
   */
  markAllNotificationsAsRead: async () => {
    const token = localStorage.getItem('jwt-token') || localStorage.getItem('token');
    if (!token) throw new Error('No authentication token found');
    
    try {
      const response = await axios.put(`${NOTIFICATIONS_API_URL}/read-all`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  }
};

export default NotificationService;
