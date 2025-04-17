import React, { useState, useEffect } from 'react';
import LoginForm from '../components/LoginForm';
import RegistrationForm from '../components/RegistrationForm';
import { Home as HomeIcon, Sofa, Palette, PaintBucket } from 'lucide-react';
import '../styles/Home.css';

function Home() {
  const [activeForm, setActiveForm] = useState('login');
  const [animationPaused, setAnimationPaused] = useState(false);
  
  // Create floating elements dynamically
  useEffect(() => {
    const floatingContainer = document.querySelector('.floating-elements');
    if (floatingContainer) {
      // Clear any existing elements
      floatingContainer.innerHTML = '';
      
      // Create new elements
      for (let i = 0; i < 50; i++) {
        const element = document.createElement('div');
        element.className = 'floating-element';
        
        // Randomize properties
        const size = Math.random() * 100 + 30; // 30-130px
        const posX = Math.random() * 100; // 0-100%
        const posY = Math.random() * 100; // 0-100%
        const duration = Math.random() * 20 + 10; // 10-30s
        const delay = Math.random() * 5; // 0-5s
        
        // Apply styles
        element.style.width = `${size}px`;
        element.style.height = `${size}px`;
        element.style.left = `${posX}%`;
        element.style.top = `${posY}%`;
        element.style.animationDuration = `${duration}s`;
        element.style.animationDelay = `${delay}s`;
        
        // Add shape class
        const shapeType = Math.floor(Math.random() * 5); // Increased variety
        if (shapeType === 0) element.classList.add('square');
        else if (shapeType === 1) element.classList.add('circle');
        else if (shapeType === 2) element.classList.add('triangle');
        else if (shapeType === 3) element.classList.add('star');
        else element.classList.add('hexagon');
        
        // Add brightness class (randomly)
        const brightness = Math.floor(Math.random() * 3);
        if (brightness === 0) element.classList.add('bright');
        else if (brightness === 5) element.classList.add('brighter');
        
        floatingContainer.appendChild(element);
      }
    }
  }, []);

  const testimonials = [
    {
      id: 1,
      text: "GrowtHive transformed my living room design. The community feedback was invaluable!",
      author: "Sarah Johnson",
      role: "Interior Design Enthusiast"
    },
    {
      id: 2,
      text: "The color palette suggestions and room layouts have inspired my entire home renovation.",
      author: "Michael Chen",
      role: "Home Renovator"
    },
    {
      id: 3,
      text: "From bland spaces to stunning interiors, GrowtHive guided me every step of the way.",
      author: "Emma Davis",
      role: "Home Decorator"
    },
    {
      id: 4,
      text: "The 3D visualization tools helped me perfectly plan my space before making any purchases.",
      author: "David Wilson",
      role: "Architect"
    },
    {
      id: 5,
      text: "GrowtHive's seasonal decor challenges pushed my creativity to new levels!",
      author: "Julia Martinez",
      role: "Interior Stylist"
    },
    {
      id: 6,
      text: "I discovered my signature style thanks to the expert mentors on this platform.",
      author: "Robert Lee",
      role: "Design Student"
    },
    {
      id: 7,
      text: "The Virtual Room Makeover feature helped me visualize my design ideas before making any changes. It's like having a designer at home!",
      author: "Thomas Green",
      role: "Home Renovation Enthusiast"
    }
    
  ];

  // Toggle animation pause on hover
  const handleMouseEnter = () => {
    setAnimationPaused(true);
  };

  const handleMouseLeave = () => {
    setAnimationPaused(false);
  };

  return (
    <div className="home-container">
      {/* Floating background elements */}
      <div className={`floating-elements ${animationPaused ? 'paused' : ''}`}></div>
      
      {/* Interior design background overlay */}
      <div className="background-overlay"></div>
      
      <nav className="navbar">
        <div className="logo">
          <div className="logo-icon">
            <HomeIcon size={24} className="logo-house" />
            <Sofa size={18} className="logo-couch" />
          </div>
          <span>GrowtHive</span>
        </div>
      </nav>

      <div className="hero-section">
        <div className="hero-content">
          <h1>Where Design Dreams Blossom</h1>
          <p>Join our community of interior design enthusiasts creating beautiful homes together</p>
        </div>

        <div className="form-container" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
          <div className="form-tabs">
            <button 
              className={`tab ${activeForm === 'login' ? 'active' : ''}`}
              onClick={() => setActiveForm('login')}
            >
              Login
            </button>
            <button 
              className={`tab ${activeForm === 'register' ? 'active' : ''}`}
              onClick={() => setActiveForm('register')}
            >
              Register
            </button>
          </div>
          
          {activeForm === 'login' ? <LoginForm /> : <RegistrationForm />}
        </div>
      </div>

      {/* Centralized Feature Icons */}
      <div className="feature-icons-container">
        <div className="feature-icons">
          <div className="feature">
            <Palette size={40} />
            <span>Color Theory</span>
          </div>
          <div className="feature">
            <Sofa size={40} />
            <span>Furniture Layout</span>
          </div>
          <div className="feature">
            <Sofa size={40} />
            <span>Virtual Room Makeover</span>
          </div>
          <div className="feature">
            <PaintBucket size={40} />
            <span>Materials & Textures</span>
          </div>
        </div>
      </div>

      <div className="design-showcase">
        <div className="design-element element-1"></div>
        <div className="design-element element-2"></div>
        <div className="design-element element-3"></div>
      </div>

      <div className="testimonials">
        <h2>Our Interior Design Community</h2>
        <div className="testimonial-container">
          <div className="testimonial-track">
            {[...testimonials, ...testimonials].map((testimonial, index) => (
              <div key={`${testimonial.id}-${index}`} className="testimonial-card">
                <p>{testimonial.text}</p>
                <div className="testimonial-author">
                  <strong>{testimonial.author}</strong>
                  <span>{testimonial.role}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
