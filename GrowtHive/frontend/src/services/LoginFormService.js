import axios from 'axios';
import API_BASE_URL from './baseUrl';

const loginUser = async (email, password) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/auth/login`, {
      email,
      password
    });
    
    // Store the JWT token and user info in localStorage
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      // Set the token in axios default headers for future requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      
      return {
        success: true,
        data: response.data
      };
    }
    
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.error || "Login failed. Please check your credentials."
    };
  }
};

const loginWithGoogle = () => {
  // Redirect to Google OAuth endpoint
  window.location.href = `${API_BASE_URL}/oauth2/authorization/google`;
};

const handleOAuthRedirect = () => {
  // First, check if this page contains a JSON response (from OAuth2)
  try {
    // Look for JSON content in the page
    const bodyText = document.body.textContent || "";
    if (bodyText.includes('"token"') && (bodyText.includes('"user"') || bodyText.includes('"id"'))) {
      // Try to extract the JSON content
      const jsonMatch = bodyText.match(/(\{.*\})/);
      if (jsonMatch && jsonMatch[0]) {
        const jsonResponse = JSON.parse(jsonMatch[0]);
        
        if (jsonResponse.token) {
          // Store the token and user info
          localStorage.setItem('token', jsonResponse.token);
          if (jsonResponse.user) {
            localStorage.setItem('user', JSON.stringify(jsonResponse.user));
          }
          
          // Set auth header for future requests
          axios.defaults.headers.common['Authorization'] = `Bearer ${jsonResponse.token}`;
          
          // Immediate redirect to dashboard
          window.location.href = '/dashboard';
          return { success: true };
        }
      }
    }
  } catch (e) {
    console.error('Error parsing OAuth response:', e);
  }
  
  // Check URL parameters as fallback
  const params = new URLSearchParams(window.location.search);
  const token = params.get('token');
  const error = params.get('error');
  
  if (token) {
    // Handle token in URL parameters
    localStorage.setItem('token', token);
    const userJson = params.get('user');
    if (userJson) {
      try {
        const user = JSON.parse(decodeURIComponent(userJson));
        localStorage.setItem('user', JSON.stringify(user));
      } catch (e) {
        console.error('Error parsing user data', e);
      }
    }
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
    // Redirect to dashboard
    window.location.href = '/dashboard';
    return { success: true };
  } else if (error) {
    return { success: false, error: error };
  }
  
  return null; // No OAuth redirect detected
};

const isLoggedIn = () => {
  return localStorage.getItem('token') !== null;
};

const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  delete axios.defaults.headers.common['Authorization'];
};

const LoginFormService = {
  loginUser,
  loginWithGoogle,
  handleOAuthRedirect,
  isLoggedIn,
  logout
};

export default LoginFormService;