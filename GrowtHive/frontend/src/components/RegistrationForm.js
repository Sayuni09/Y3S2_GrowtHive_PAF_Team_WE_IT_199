import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import '../styles/RegistrationForm.css';

function RegistrationForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle registration logic here
    console.log('Registration submitted:', formData);
    
    // After successful registration, navigate to dashboard
    navigate('/dashboard');
  };

  return (
    <div className="registration-form">
      <h2>Join GrowtHive</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Full Name</label>
          <div className="input-icon">
            <User />
            <input
              id="name"
              type="text"
              name="name"
              placeholder="Your full name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
        </div>

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
                placeholder="Create a password"
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

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <div className="input-wrapper">
            <div className="input-icon">
              <Lock />
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
            <button 
              type="button" 
              className="toggle-visibility"
              onClick={toggleConfirmPasswordVisibility}
              aria-label={showConfirmPassword ? "Hide password" : "Show password"}
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div className="form-agreement">
          <input type="checkbox" id="terms" required />
          <label htmlFor="terms">
  I agree to the <button type="button" className="text-link" onClick={() => console.log('Terms clicked')}>Terms of Service</button> and <button type="button" className="text-link" onClick={() => console.log('Privacy clicked')}>Privacy Policy</button>
</label>
        </div>

        <button type="submit" className="submit-btn">
          Create Account
        </button>
      </form>
    </div>
  );
}

export default RegistrationForm;
