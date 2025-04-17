// src/components/ExploreSection.js
import React, { useState, useEffect } from 'react';
import { Search, Filter, Book, Heart, MessageSquare, Bookmark, Share2, TrendingUp, Award, Users} from 'lucide-react';
import '../styles/ExploreSection.css';
import CommentSection from './CommentSection';

function ExploreSection({ userData }) {
  // State for search and filters
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeView, setActiveView] = useState('trending');
  const [hoveredCard, setHoveredCard] = useState(null);
  
  // Categories with icons and colors - Modified to include interior design related concepts
  const categories = [
    { id: 'all', name: 'All Categories', color: '#8C6140', icon: <Filter size={18} /> },
    { id: 'design', name: 'Interior Design', color: '#B88D6C', icon: <TrendingUp size={18} /> },
    { id: 'crafts', name: 'DIY & Crafts', color: '#7D9D8C', icon: <Award size={18} /> },
    { id: 'furniture', name: 'Furniture Design', color: '#E8A798', icon: <Users size={18} /> },
    { id: 'lighting', name: 'Lighting & Decor', color: '#7B9EA8', icon: <Book size={18} /> },
  ];

  // State for trending posts with comments structure
  const [trendingPosts, setTrendingPosts] = useState([
    {
      id: 1,
      title: 'Scandinavian Design Principles',
      description: 'Exploring the clean lines and functional elegance of Scandinavian interior design. Here are my top takeaways from renovating my living space...',
      category: 'design',
      image: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      author: {
        name: 'Julia Martinez',
        avatar: 'https://randomuser.me/api/portraits/women/22.jpg'
      },
      stats: {
        likes: 128,
        comments: 32,
        saves: 76
      },
      comments: [],
      tags: ['minimalist', 'furniture', 'neutral colors'],
      timeAgo: '3 days ago',
      showComments: false
    },
    {
      id: 2,
      title: 'Indoor Plants for Better Air Quality',
      description: 'Did you know that certain houseplants can significantly improve your home\'s air quality? Here\'s my curated list of low-maintenance plants that purify your space...',
      category: 'design',
      image: 'https://media.istockphoto.com/id/1837566278/photo/scandinavian-style-apartment-interior.webp?a=1&b=1&s=612x612&w=0&k=20&c=7qzRX7XP3Bok4EA6Nfqbn7s6CkYb9JwXM-vH8elseI4=',
      author: {
        name: 'Robert Lee',
        avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
      },
      stats: {
        likes: 245,
        comments: 58,
        saves: 198
      },
      comments: [],
      tags: ['plants', 'air quality', 'home decor'],
      timeAgo: '1 week ago',
      showComments: false
    },
    {
      id: 3,
      title: 'Custom Pottery Techniques',
      description: 'Learn how to create beautiful ceramic pieces for your home with these beginner-friendly pottery techniques and tips.',
      category: 'crafts',
      image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      author: {
        name: 'Emma Davis',
        avatar: 'https://randomuser.me/api/portraits/women/43.jpg'
      },
      stats: {
        likes: 187,
        comments: 42,
        saves: 113
      },
      comments: [],
      tags: ['pottery', 'clay', 'DIY'],
      timeAgo: '2 weeks ago',
      showComments: false
    },
    {
      id: 4,
      title: "Custom Wood Furniture for Your Home",
      description: "A complete guide to designing, building, and finishing custom wood furniture pieces that elevate your living space. Learn to craft tables, shelves, and cabinets with a professional touch.",
      category: "furniture",
      image: "https://images.unsplash.com/photo-1487015307662-6ce6210680f1?q=80&w=1970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      author: {
        name: "David Wilson",
        avatar: "https://randomuser.me/api/portraits/men/75.jpg"
      },
      stats: {
        likes: 312,
        comments: 87,
        saves: 256
      },
      comments: [],
      tags: ["woodworking", "DIY", "furniture design"],
      timeAgo: "4 days ago",
      showComments: false
    },
    {
      id: 5,
      title: "Creative Lighting Ideas for Modern Homes",
      description: "A step-by-step guide to enhancing your home ambiance using smart lighting solutions, mood lighting setups, and decorative fixtures. Learn to combine function and aesthetics to transform your spaces.",
      category: "lighting",
      image: "https://images.unsplash.com/photo-1647695878806-f629ac174a0e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGxpZ2h0bmluZyUyMGFuZCUyMGRlY29yfGVufDB8fDB8fHww",
      author: {
        name: "Michael Chen",
        avatar: "https://randomuser.me/api/portraits/men/86.jpg"
      },
      stats: {
        likes: 421,
        comments: 93,
        saves: 301
      },
      comments: [],
      tags: ["lighting design", "home decor", "interior lighting"],
      timeAgo: "6 days ago",
      showComments: false
    },
    {
      id: 6,
      title: 'Color Theory in Home Decor',
      description: 'Understanding color relationships can transform your space. Here\'s how I applied complementary colors to create a harmonious bedroom design...',
      category: 'design',
      image: 'https://images.unsplash.com/photo-1556702571-3e11dd2b1a92?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      author: {
        name: 'Sarah Johnson',
        avatar: 'https://randomuser.me/api/portraits/women/67.jpg'
      },
      stats: {
        likes: 236,
        comments: 45,
        saves: 174
      },
      comments: [],
      tags: ['color theory', 'interior design', 'decor'],
      timeAgo: '1 day ago',
      showComments: false
    },
  ]);

  // Mock data for learning plans
  const [learningPlans] = useState([
    {
      id: 1,
      title: 'Mastering Interior Design Fundamentals',
      category: 'design',
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      author: {
        name: 'Design Academy',
        avatar: 'https://randomuser.me/api/portraits/women/28.jpg'
      },
      description: 'Learn the core principles of interior design, from space planning to color theory in this comprehensive course.',
      modules: 8,
      duration: '4 weeks',
      level: 'Beginner',
      enrolled: 1245,
      rating: 4.8
    },
    {
      id: 2,
      title: 'Pottery for Beginners',
      category: 'crafts',
      image: 'https://images.unsplash.com/photo-1493106641515-6b5631de4bb9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      author: {
        name: 'Ceramic Studio',
        avatar: 'https://randomuser.me/api/portraits/men/29.jpg'
      },
      description: 'Start your pottery journey with this hands-on course teaching basic techniques, glazing, and firing your own creations.',
      modules: 6,
      duration: '3 weeks',
      level: 'Beginner',
      enrolled: 876,
      rating: 4.7
    },
    {
      id: 3,
      title: "Advanced Furniture Design Techniques",
      category: "furniture",
      image: "https://images.unsplash.com/photo-1540574163026-643ea20ade25?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      author: {
        name: "Artisan Woodworks",
        avatar: "https://randomuser.me/api/portraits/women/41.jpg"
      },
      description: "Elevate your craftsmanship with advanced furniture design concepts including joinery, ergonomic planning, sustainable materials, and finish techniques. Perfect for those looking to refine their home improvement projects with professional touches.",
      modules: 10,
      duration: "5 weeks",
      level: "Intermediate",
      enrolled: 1572,
      rating: 4.9
    },
    {
      id: 4,
      title: "Lighting & Ambience: Designing the Perfect Home Atmosphere",
      category: "lighting",
      image: "https://images.unsplash.com/photo-1670537114446-e17e0259bfca?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fGxpZ2h0bmluZyUyMGFuZCUyMGRlY29yfGVufDB8fDB8fHww",
      author: {
        name: "Tech Lighting Studio",
        avatar: "https://randomuser.me/api/portraits/men/54.jpg"
      },
      description: "Transform your living space with expert lighting techniques. This course covers layering light, choosing the right fixtures, smart lighting integration, and enhancing mood through design.",
      modules: 7,
      duration: "2 weeks",
      level: "All Levels",
      enrolled: 2103,
      rating: 4.6
    }
  ]);

  // Filter posts based on search and category
  const filteredPosts = trendingPosts.filter(post => 
    (activeCategory === 'all' || post.category === activeCategory) &&
    (post.title.toLowerCase().includes(search.toLowerCase()) || 
     post.description.toLowerCase().includes(search.toLowerCase()) ||
     post.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase())))
  );

  // Filter learning plans based on search and category
  const filteredPlans = learningPlans.filter(plan => 
    (activeCategory === 'all' || plan.category === activeCategory) &&
    (plan.title.toLowerCase().includes(search.toLowerCase()) || 
     plan.description.toLowerCase().includes(search.toLowerCase()))
  );

  // Display data based on active view
  const displayData = activeView === 'trending' ? filteredPosts : filteredPlans;
  const isEmpty = displayData.length === 0;

  // Toggle comments visibility for a post
  const toggleComments = (postId) => {
    setTrendingPosts(trendingPosts.map(post => 
      post.id === postId ? { ...post, showComments: !post.showComments } : post
    ));
  };
  
  // Add a new comment to a post
  const addComment = (postId, commentText) => {
    if (!commentText.trim()) return;
    
    const updatedPosts = trendingPosts.map(post => {
      if (post.id === postId) {
        const newCommentObj = {
          id: Date.now(),
          user: { 
            name: userData.name, 
            profilePic: userData.profilePicture 
          },
          content: commentText,
          likes: 0,
          time: 'Just now',
          replies: []
        };
        
        // Update stats
        const updatedStats = {
          ...post.stats,
          comments: post.stats.comments + 1
        };
        
        return {
          ...post,
          comments: [...post.comments, newCommentObj],
          stats: updatedStats
        };
      }
      return post;
    });
    
    setTrendingPosts(updatedPosts);
  };
  
  // Add a reply to a comment
  const addReply = (postId, commentId, replyContent) => {
    if (!replyContent.trim()) return;
    
    const updatedPosts = trendingPosts.map(post => {
      if (post.id === postId) {
        const updatedComments = post.comments.map(comment => {
          if (comment.id === commentId) {
            const newReply = {
              id: Date.now(),
              user: { 
                name: userData.name, 
                profilePic: userData.profilePicture 
              },
              content: replyContent,
              likes: 0,
              time: 'Just now'
            };
            
            return {
              ...comment,
              replies: [...(comment.replies || []), newReply]
            };
          }
          return comment;
        });
        
        return {
          ...post,
          comments: updatedComments
        };
      }
      return post;
    });
    
    setTrendingPosts(updatedPosts);
  };
  
  // Like a comment
  const likeComment = (postId, commentId, replyId = null) => {
    setTrendingPosts(trendingPosts.map(post => {
      if (post.id === postId) {
        const updatedComments = post.comments.map(comment => {
          if (replyId) {
            // Liking a reply
            if (comment.id === commentId) {
              const updatedReplies = (comment.replies || []).map(reply => 
                reply.id === replyId ? { ...reply, likes: (reply.likes || 0) + 1 } : reply
              );
              return { ...comment, replies: updatedReplies };
            }
            return comment;
          } else {
            // Liking a comment
            if (comment.id === commentId) {
              return { ...comment, likes: (comment.likes || 0) + 1 };
            }
            return comment;
          }
        });
        
        return { ...post, comments: updatedComments };
      }
      return post;
    }));
  };

  // Like a post
  const likePost = (postId) => {
    setTrendingPosts(trendingPosts.map(post => {
      if (post.id === postId) {
        // Update stats
        const updatedStats = {
          ...post.stats,
          likes: post.stats.likes + 1
        };
        
        return { 
          ...post, 
          stats: updatedStats 
        };
      }
      return post;
    }));
  };

  // Save a post
  const savePost = (postId) => {
    setTrendingPosts(trendingPosts.map(post => {
      if (post.id === postId) {
        // Update stats
        const updatedStats = {
          ...post.stats,
          saves: post.stats.saves + 1
        };
        
        return { 
          ...post, 
          stats: updatedStats 
        };
      }
      return post;
    }));
  };

  // Animation effect for search results
  useEffect(() => {
    const cards = document.querySelectorAll('.explore-card');
    cards.forEach((card, index) => {
      card.style.animation = `fadeInUp 0.3s ease forwards ${index * 0.1}s`;
      card.style.opacity = 0;
    });
  }, [activeCategory, activeView, search]);

  return (
    <div className="explore-section-container">
      <div className="explore-header">
        <h1>Explore Skills & Inspiration</h1>
        <p>Discover trending content, learning resources, and connect with creative minds</p>
        
        <div className="explore-search-container">
          <Search size={22} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search for skills, topics, or creators..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="explore-navigation">
        <div className="explore-categories">
          {categories.map(category => (
            <button 
              key={category.id}
              className={`category-button ${activeCategory === category.id ? 'active' : ''}`}
              style={activeCategory === category.id ? {backgroundColor: `${category.color}15`, color: category.color, borderColor: category.color} : {}}
              onClick={() => setActiveCategory(category.id)}
            >
              {category.icon}
              {category.name}
            </button>
          ))}
        </div>

        <div className="explore-view-toggle">
          <button 
            className={`view-button ${activeView === 'trending' ? 'active' : ''}`}
            onClick={() => setActiveView('trending')}
          >
            <TrendingUp size={18} />
            Trending Content
          </button>
          <button 
            className={`view-button ${activeView === 'learning' ? 'active' : ''}`}
            onClick={() => setActiveView('learning')}
          >
            <Book size={18} />
            Learning Plans
          </button>
        </div>
      </div>

      {isEmpty ? (
        <div className="explore-empty-state">
          <div className="empty-icon">🔍</div>
          <h3>No results found</h3>
          <p>Try adjusting your search or filter to find what you're looking for</p>
          <button onClick={() => {setSearch(''); setActiveCategory('all');}}>Clear filters</button>
        </div>
      ) : (
        <div className="explore-content">
          {activeView === 'trending' ? (
            <div className="explore-grid">
              {filteredPosts.map(post => (
                <div 
                  key={post.id} 
                  className="explore-card content-card"
                  onMouseEnter={() => setHoveredCard(post.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <div className="card-image-container">
                    <img src={post.image} alt={post.title} className="card-image" />
                    <div className="card-category-tag" style={{backgroundColor: categories.find(c => c.id === post.category)?.color || '#8C6140'}}>
                      {categories.find(c => c.id === post.category)?.name || 'Category'}
                    </div>
                    {hoveredCard === post.id && (
                      <div className="card-hover-actions">
                        <button onClick={() => savePost(post.id)}><Bookmark size={20} /></button>
                        <button><Share2 size={20} /></button>
                      </div>
                    )}
                  </div>
                  
                  <div className="card-content">
                    <h3 className="card-title">{post.title}</h3>
                    <p className="card-description">{post.description.substring(0, 100)}...</p>
                    
                    <div className="card-tags">
                      {post.tags.map((tag, index) => (
                        <span key={index} className="tag">#{tag}</span>
                      ))}
                    </div>
                    
                    <div className="card-footer">
                      <div className="card-author">
                        <img src={post.author.avatar} alt={post.author.name} />
                        <span>{post.author.name}</span>
                      </div>
                      <div className="card-stats">
                        <span onClick={() => likePost(post.id)} style={{cursor: 'pointer'}}><Heart size={16} /> {post.stats.likes}</span>
                        <span 
                          onClick={() => toggleComments(post.id)}
                          style={{cursor: 'pointer'}}
                          className={post.showComments ? 'active' : ''}
                        >
                          <MessageSquare size={16} /> {post.stats.comments}
                        </span>
                      </div>
                    </div>
                    
                    {/* Comment Section - Displayed when showComments is true */}
                    {post.showComments && (
                      <CommentSection 
                        post={post}
                        userData={userData}
                        onAddComment={addComment}
                        onAddReply={addReply}
                        onLikeComment={likeComment}
                        onClose={() => toggleComments(post.id)}
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="explore-grid learning-grid">
              {filteredPlans.map(plan => (
                <div key={plan.id} className="explore-card learning-card">
                  <div className="card-image-container">
                    <img src={plan.image} alt={plan.title} className="card-image" />
                    <div className="card-overlay">
                      <div className="card-level-badge">{plan.level}</div>
                    </div>
                  </div>
                  
                  <div className="card-content">
                    <h3 className="card-title">{plan.title}</h3>
                    <p className="card-description">{plan.description.substring(0, 100)}...</p>
                    
                    <div className="plan-details">
                      <div className="plan-detail">
                        <strong>{plan.modules}</strong>
                        <span>Modules</span>
                      </div>
                      <div className="plan-detail">
                        <strong>{plan.duration}</strong>
                        <span>Duration</span>
                      </div>
                      <div className="plan-detail">
                        <strong>{plan.rating}</strong>
                        <span>Rating</span>
                      </div>
                    </div>
                    
                    <div className="card-footer">
                      <div className="card-author">
                        <img src={plan.author.avatar} alt={plan.author.name} />
                        <span>{plan.author.name}</span>
                      </div>
                      <div className="enrolled-count">
                        <Users size={16} />
                        <span>{plan.enrolled} enrolled</span>
                      </div>
                    </div>
                    
                    <button className="enroll-button">View Learning Plan</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ExploreSection;
