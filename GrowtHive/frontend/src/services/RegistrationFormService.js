
import axios from 'axios';
import API_BASE_URL from './baseUrl';

const registerUser = async (name, email, password) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/auth/register`, {
      name,
      email,
      password
    });
    
    return {
      success: true,
      message: response.data.message
    };
    
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.error || "Registration failed. Please try again."
    };
  }
};

const RegistrationFormService = {
  registerUser
};

export default RegistrationFormService;
