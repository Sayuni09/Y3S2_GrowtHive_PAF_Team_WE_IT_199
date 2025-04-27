
import axios from 'axios';
import API_BASE_URL from './baseUrl';

const createPost = async (title, content, category, visibility, mediaFiles) => {
  try {
    // Create form data for multipart upload
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    
    if (category) {
      formData.append('category', category);
    }
    
    formData.append('visibility', visibility);
    
    // Append each media file
    if (mediaFiles && mediaFiles.length > 0) {
      for (let i = 0; i < mediaFiles.length; i++) {
        formData.append('media', mediaFiles[i]);
      }
    }
    
    // Get the stored token
    const token = localStorage.getItem('token');
    
    // Make the API call
    const response = await axios.post(`${API_BASE_URL}/api/auth/posts`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`
      }
    });
    
    return {
      success: true,
      data: response.data
    };
    
  } catch (error) {
    console.error("Post creation error:", error);
    return {
      success: false,
      error: error.response?.data?.error || "Failed to create post. Please try again."
    };
  }
};

const SkillPostService = {
  createPost
};

export default SkillPostService;
