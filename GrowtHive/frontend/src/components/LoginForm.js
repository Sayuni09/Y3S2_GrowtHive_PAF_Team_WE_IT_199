import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import '../styles/LoginForm.css';

function LoginForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login logic here
    console.log('Login submitted:', formData);
    
    // After successful login, navigate to dashboard
    navigate('/dashboard');
  };

  return (
    <div className="login-form">
      <h2>Welcome Back</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <div className="input-icon">
            <Mail />
            <input
              id="email"
              type="email"
              name="email"
              placeholder="Your email address"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <div className="input-wrapper">
            <div className="input-icon">
              <Lock />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Your password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <button 
              type="button" 
              className="toggle-visibility"
              onClick={togglePasswordVisibility}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div className="form-options">
          <div className="remember-me">
            <input 
              type="checkbox" 
              id="rememberMe" 
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleChange}
            />
            <label htmlFor="rememberMe">Remember me</label>
          </div>
          <button 
            type="button" 
            className="forgot-password-link"
            onClick={() => console.log('Forgot password clicked')}
          >
            Forgot password?
          </button>
        </div>

        <button type="submit" className="submit-btn">
          Sign In
        </button>
      </form>
      
      <div className="social-login">
        <div className="divider">
          <span>Or sign in with</span>
        </div>
        <div className="social-buttons">
          <button className="social-btn google" onClick={() => console.log('Google login clicked')}>
            <div className="google-icon">
              <svg viewBox="0 0 24 24" width="20" height="20">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
                <path fill="none" d="M1 1h22v22H1z" />
              </svg>
            </div>
            <span>Google</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;
