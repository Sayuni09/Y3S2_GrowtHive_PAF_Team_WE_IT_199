// src/pages/MakeoverDetailsPage.js
import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Home, User, Bell, Search, Book, Settings, LogOut, 
         ArrowLeft, ThumbsUp, Share2, Calendar,
         Users, Trophy, Award, ChevronLeft, ChevronRight, Sofa } from 'lucide-react';
import BeforeAfterSlider from '../components/BeforeAfterSlider';
import '../styles/MakeoverDetailsPage.css';
//import '../styles/MakeoverChallenge.css'


function MakeoverDetailsPage() {
  const { id } = useParams();
  const [challenge, setChallenge] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSubmission, setActiveSubmission] = useState(0);
  const [comment, setComment] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);

  const userData = {
    name: 'E.M.T.T.BANDARANAYAKE',
    profilePicture: 'https://randomuser.me/api/portraits/women/44.jpg'
  };

  // Fetch challenge and submissions data
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      // Mock challenge data
      const mockChallenge = {
        id: 1,
        title: "Modern Living Room Redesign Challenge",
        description: "Help me transform my outdated living room into a modern space with clean lines and a neutral color palette. Looking for furniture arrangements and decor ideas that maximize the natural light. The room has hardwood floors and white walls which I'd like to keep. Budget range is moderate, willing to invest in key pieces but looking for value overall. I prefer a minimalist look but not too sterile.",
        roomImage: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        author: {
          name: "Sarah Johnson",
          avatar: "https://randomuser.me/api/portraits/women/45.jpg",
          bio: "Interior design enthusiast with a love for modern spaces"
        },
        isActive: true,
        deadline: "April 22, 2025",
        endsIn: "7 days left",
        participants: 18,
        submissionsCount: 8,
        votes: 32,
        comments: [
          {
            id: 1,
            user: {
              name: "Michael Chen",
              avatar: "https://randomuser.me/api/portraits/men/32.jpg"
            },
            text: "What an interesting space! I love the natural light you get from those windows.",
            time: "2 days ago",
            likes: 5
          },
          {
            id: 2,
            user: {
              name: "Emma Davis",
              avatar: "https://randomuser.me/api/portraits/women/67.jpg"
            },
            text: "Are you open to changing the layout completely or do you want to keep the general arrangement?",
            time: "3 days ago",
            likes: 3
          }
        ],
        prize: "Featured on the homepage",
        createdAt: "April 15, 2025"
      };
      
      // Mock submissions
      const mockSubmissions = [
        {
          id: 1,
          user: {
            name: "Julia Martinez",
            avatar: "https://randomuser.me/api/portraits/women/22.jpg",
            bio: "Professional interior designer with 5 years of experience"
          },
          afterImage: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
          description: "I focused on creating an airy, modern space with a neutral palette and clean lines. Added a sectional sofa to maximize seating, a minimalist coffee table, and strategic accent pieces for warmth. The layered lighting offers flexibility for different moods.",
          votes: 15,
          comments: 4,
          timestamp: "3 days ago",
          style: "Scandinavian Modern"
        },
        {
          id: 2,
          user: {
            name: "David Wilson",
            avatar: "https://randomuser.me/api/portraits/men/22.jpg",
            bio: "Self-taught design enthusiast specializing in modern interiors"
          },
          afterImage: "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
          description: "My approach was to create a multifunctional space that balances aesthetics with practicality. The streamlined furniture keeps the room feeling open, while the textural elements add depth and interest. I used a monochromatic color scheme with subtle wood accents to maintain warmth.",
          votes: 23,
          comments: 7,
          timestamp: "5 days ago",
          style: "Minimalist"
        },
        {
          id: 3,
          user: {
            name: "Sophia Rodriguez",
            avatar: "https://randomuser.me/api/portraits/women/28.jpg",
            bio: "Interior design student with a passion for sustainable materials"
          },
          afterImage: "https://images.unsplash.com/photo-1618220179428-22790b461013?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
          description: "I redesigned the space focusing on a balance between functionality and style. The furniture arrangement optimizes conversation flow while maintaining open pathways. I incorporated sustainable materials and plants to bring life to the room while keeping the modern aesthetic.",
          votes: 19,
          comments: 5,
          timestamp: "2 days ago",
          style: "Eco-Modern"
        }
      ];
      
      setChallenge(mockChallenge);
      setSubmissions(mockSubmissions);
      setLoading(false);
    }, 1200);
  }, [id]);

  const handleVoteSubmission = (submissionId) => {
    setSubmissions(submissions.map(sub => 
      sub.id === submissionId 
        ? { ...sub, votes: sub.votes + 1 } 
        : sub
    ));
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    
    // Add the new comment
    if (challenge) {
      const newComment = {
        id: challenge.comments.length + 1,
        user: {
          name: userData.name,
          avatar: userData.profilePicture
        },
        text: comment,
        time: "Just now",
        likes: 0
      };
      
      setChallenge({
        ...challenge,
        comments: [...challenge.comments, newComment]
      });
      
      setComment('');
    }
  };

  const nextSubmission = () => {
    setActiveSubmission((prev) => 
      prev === submissions.length - 1 ? 0 : prev + 1
    );
  };

  const prevSubmission = () => {
    setActiveSubmission((prev) => 
      prev === 0 ? submissions.length - 1 : prev - 1
    );
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading challenge details...</p>
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className="error-container">
        <p>Challenge not found</p>
        <Link to="/makeover-challenges">Back to Challenges</Link>
      </div>
    );
  }

  return (
    <div className="page-container">
      {/* Left Sidebar */}
      <div className="page-sidebar">
        <div className="sidebar-header">
          <div className="logo">
            <Home size={24} className="logo-icon" />
            <span>GrowtHive</span>
          </div>
        </div>
        
        <div className="sidebar-menu">
          <Link to="/dashboard" className="menu-item">
            <Home size={22} />
            <span>Home Feed</span>
          </Link>
          <Link to="/explore" className="menu-item">
            <Search size={22} />
            <span>Explore</span>
          </Link>
          <Link to="/learning-plan" className="menu-item">
            <Book size={22} />
            <span>Learning Plans</span>
          </Link>
          <Link to="/room-makeover" className="menu-item">
            <Sofa size={22} />
            <span>Room Makeover</span>
          </Link>
          <Link to="/notifications" className="menu-item">
            <Bell size={22} />
            <span>Notifications</span>
            <div className="notification-badge">4</div>
          </Link>
          <Link to="/profile" className="menu-item">
            <User size={22} />
            <span>Profile</span>
          </Link>
          <div className="menu-item">
            <Settings size={22} />
            <span>Settings</span>
          </div>
        </div>

        <div className="sidebar-footer">
          <div className="menu-item logout">
            <LogOut size={22} />
            <span>Logout</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="page-main">
        {/* Header */}
        <header className="page-header">
          <Link to="/makeover-challenges" className="back-button">
            <ArrowLeft size={20} />
            <span>Back to Challenges</span>
          </Link>
          
          <div className="header-actions">
            <div className="notification-icon" onClick={toggleNotifications}>
              <Bell size={22} />
              <div className="notification-badge">4</div>
            </div>
            
            <Link to="/profile" className="profile-quick-access">
              <img src={userData.profilePicture} alt="Profile" />
              <span>{userData.name.split(' ')[0]}</span>
            </Link>
          </div>
        </header>

        {/* Challenge Details */}
        <div className="challenge-details-container">
          <div className="challenge-header">
            <div className={`challenge-status ${challenge.isActive ? 'active' : 'completed'}`}>
              {challenge.isActive ? (
                <>
                  <span className="status-icon">●</span>
                  Active Challenge
                </>
              ) : (
                <>
                  <Trophy size={16} />
                  Completed
                </>
              )}
            </div>
            <h1>{challenge.title}</h1>
          </div>

          <div className="challenge-details-content">
            <div className="challenge-details-main">
              <div className="challenge-creator">
                <img src={challenge.author.avatar} alt={challenge.author.name} />
                <div className="creator-info">
                  <h3>Created by {challenge.author.name}</h3>
                  <p>{challenge.author.bio}</p>
                  <span className="challenge-date">Posted on {challenge.createdAt}</span>
                </div>
              </div>

              <div className="challenge-description-box">
                <h3>Challenge Description</h3>
                <p>{challenge.description}</p>
              </div>

              <div className="challenge-original-image">
                <h3>Original Room</h3>
                <div className="image-container">
                  <img src={challenge.roomImage} alt="Original Room" />
                </div>
              </div>

              <div className="challenge-meta-stats">
                <div className="meta-stat">
                  <Calendar size={20} />
                  <div className="stat-content">
                    <span className="stat-value">{challenge.deadline}</span>
                    <span className="stat-label">Deadline</span>
                  </div>
                </div>
                <div className="meta-stat">
                  <Users size={20} />
                  <div className="stat-content">
                    <span className="stat-value">{challenge.participants}</span>
                    <span className="stat-label">Participants</span>
                  </div>
                </div>
                <div className="meta-stat">
                  <Award size={20} />
                  <div className="stat-content">
                    <span className="stat-value">{challenge.prize}</span>
                    <span className="stat-label">Prize</span>
                  </div>
                </div>
              </div>

              {submissions.length > 0 && (
                <div className="challenge-submissions">
                  <h2>Design Submissions ({submissions.length})</h2>
                  
                  <div className="active-submission">
                    <div className="submission-navigation">
                      <button className="nav-button prev" onClick={prevSubmission}>
                        <ChevronLeft size={24} />
                      </button>
                      <div className="submission-indicator">
                        {submissions.map((_, index) => (
                          <span 
                            key={index} 
                            className={`indicator ${index === activeSubmission ? 'active' : ''}`}
                            onClick={() => setActiveSubmission(index)}
                          ></span>
                        ))}
                      </div>
                      <button className="nav-button next" onClick={nextSubmission}>
                        <ChevronRight size={24} />
                      </button>
                    </div>

                    {submissions[activeSubmission] && (
                      <div className="submission-detail">
                        <div className="submission-creator">
                          <img 
                            src={submissions[activeSubmission].user.avatar} 
                            alt={submissions[activeSubmission].user.name} 
                          />
                          <div className="creator-info">
                            <h3>{submissions[activeSubmission].user.name}</h3>
                            <span className="submission-style">{submissions[activeSubmission].style}</span>
                            <span className="submission-time">{submissions[activeSubmission].timestamp}</span>
                          </div>
                          <div className="submission-actions">
                            <button className="action-button vote" onClick={() => handleVoteSubmission(submissions[activeSubmission].id)}>
                              <ThumbsUp size={18} />
                              <span>{submissions[activeSubmission].votes} votes</span>
                            </button>
                            <button className="action-button share">
                              <Share2 size={18} />
                              <span>Share</span>
                            </button>
                          </div>
                        </div>

                        <div className="submission-comparison">
                          <BeforeAfterSlider 
                            beforeImage={challenge.roomImage} 
                            afterImage={submissions[activeSubmission].afterImage}
                            beforeLabel="Original"
                            afterLabel="Redesign"
                          />
                        </div>

                        <div className="submission-description">
                          <h3>Designer's Notes</h3>
                          <p>{submissions[activeSubmission].description}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="challenge-comments">
                <h3>Discussion ({challenge.comments.length})</h3>
                
                <form className="comment-form" onSubmit={handleCommentSubmit}>
                  <img src={userData.profilePicture} alt={userData.name} />
                  <div className="comment-input-container">
                    <textarea 
                      placeholder="Add a comment or question..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    ></textarea>
                    <button type="submit" disabled={!comment.trim()}>Post</button>
                  </div>
                </form>
                
                <div className="comments-list">
                  {challenge.comments.map(comment => (
                    <div key={comment.id} className="comment-item">
                      <img src={comment.user.avatar} alt={comment.user.name} />
                      <div className="comment-content">
                        <div className="comment-header">
                          <h4>{comment.user.name}</h4>
                          <span className="comment-time">{comment.time}</span>
                        </div>
                        <p>{comment.text}</p>
                        <div className="comment-actions">
                          <button className="comment-like">
                            <ThumbsUp size={16} />
                            <span>{comment.likes}</span>
                          </button>
                          <button className="comment-reply">Reply</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="challenge-sidebar">
              <div className="participate-card">
                <h3>Submit Your Design</h3>
                {challenge.isActive ? (
                  <>
                    <p>Create your own redesign of this room and join the challenge!</p>
                    <div className="deadline-info">
                      <Calendar size={18} />
                      <span>Deadline: {challenge.deadline}</span>
                    </div>
                    <Link 
                      to="/room-makeover" 
                      state={{ 
                        fromChallenge: true, 
                        challengeId: challenge.id,
                        originalImage: challenge.roomImage 
                      }} 
                      className="participate-button"
                    >
                      <Trophy size={18} />
                      <span>Create Submission</span>
                    </Link>
                  </>
                ) : (
                  <>
                    <p>This challenge has ended. View the winning designs or explore active challenges.</p>
                    <Link to="/makeover-challenges" className="explore-button">
                      <Trophy size={18} />
                      <span>Explore Challenges</span>
                    </Link>
                  </>
                )}
              </div>
              
              <div className="top-submissions-card">
                <h3>Top Submissions</h3>
                <div className="top-list">
                  {submissions
                    .sort((a, b) => b.votes - a.votes)
                    .slice(0, 3)
                    .map((submission, index) => (
                      <div 
                        key={submission.id} 
                        className="top-submission-item"
                        onClick={() => setActiveSubmission(submissions.findIndex(s => s.id === submission.id))}
                      >
                        <div className="rank">#{index + 1}</div>
                        <img src={submission.user.avatar} alt={submission.user.name} />
                        <div className="submission-info">
                          <h4>{submission.user.name}</h4>
                          <div className="votes">
                            <ThumbsUp size={14} />
                            <span>{submission.votes} votes</span>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
              
              <div className="more-challenges-card">
                <h3>More Challenges</h3>
                <Link to="/makeover-challenges" className="view-all-link">
                  View All <ArrowLeft size={16} />
                </Link>
                <div className="more-challenges-list">
                  <div className="more-challenge-item">
                    <img src="https://images.unsplash.com/photo-1564540583246-934409427776?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" alt="Challenge" />
                    <div className="more-challenge-info">
                      <h4>Small Bathroom Makeover Ideas</h4>
                      <span>15 days left</span>
                    </div>
                  </div>
                  <div className="more-challenge-item">
                    <img src="https://images.unsplash.com/photo-1501004318641-b39e6451bec6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" alt="Challenge" />
                    <div className="more-challenge-info">
                      <h4>Kid-Friendly Playroom Design</h4>
                      <span>22 days left</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MakeoverDetailsPage;
