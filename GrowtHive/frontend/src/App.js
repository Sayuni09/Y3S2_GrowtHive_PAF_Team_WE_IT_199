import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import SkillPostPage from './pages/SkillPostPage';
import NotificationsPage from './pages/NotificationsPage';
import ExplorePage from './pages/ExplorePage';
import LearningPlan from './pages/LearningPlan';
import LoginFormService from './services/LoginFormService';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const hasTokenInParams = params.get('token') !== null;
  
  // Allow through if authenticated OR if there's a token in URL params
  const isAuthenticated = LoginFormService.isLoggedIn() || hasTokenInParams;
  
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

// OAuth Callback handler component - works for both callback routes
function OAuthCallback() {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Process the OAuth response and extract tokens
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const userParam = params.get('user');
    
    if (token) {
      // Store the token
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Store user info if available
      if (userParam) {
        try {
          const user = JSON.parse(decodeURIComponent(userParam));
          localStorage.setItem('user', JSON.stringify(user));
        } catch (e) {
          console.error('Error parsing user data:', e);
        }
      }
      
      // Show success toast
      toast.success('Successfully logged in with Google!');
      
      // Navigate to dashboard using React Router (not window.location)
      navigate('/dashboard', { replace: true });
    } else {
      navigate('/');
    }
  }, [navigate]);
  
  return <div>Processing authentication...</div>;
}

function App() {
  // Set up axios interceptor for authentication
  useEffect(() => {
    // Check if user is logged in and set auth header
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    
    // Set up interceptor for 401 responses
    const interceptor = axios.interceptors.response.use(
      response => response,
      error => {
        if (error.response && error.response.status === 401) {
          // If we get an unauthorized error, log user out and redirect to login
          LoginFormService.logout();
          window.location.href = '/';
        }
        return Promise.reject(error);
      }
    );
    
    return () => {
      // Clean up interceptor on unmount
      axios.interceptors.response.eject(interceptor);
    };
  }, []);

  return (
    <Router>
      {/* Toast Container for notifications */}
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      
      <Routes>
        <Route path="/" element={<Home />} />
        
        {/* Add BOTH OAuth callback routes to ensure all redirects are handled */}
        <Route path="/login/oauth2/code/google" element={<OAuthCallback />} />
        <Route path="/login/oauth2/callback" element={<OAuthCallback />} />
        
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
        
        {/* Other routes remain unchanged */}
        <Route path="/skill-post" element={
          <ProtectedRoute>
            <SkillPostPage />
          </ProtectedRoute>
        } />
        
        <Route path="/learning-plan" element={
          <ProtectedRoute>
            <LearningPlan />
          </ProtectedRoute>
        } />
        
        <Route path="/notifications" element={
          <ProtectedRoute>
            <NotificationsPage />
          </ProtectedRoute>
        } />
        
        <Route path="/explore" element={
          <ProtectedRoute>
            <ExplorePage />
          </ProtectedRoute>
        } />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;

