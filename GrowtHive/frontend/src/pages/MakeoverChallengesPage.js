// src/pages/MakeoverChallengesPage.js
import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, User, Bell, Search, Book, Settings, LogOut, 
         ArrowLeft, Filter, Trophy, Calendar, Clock, SlidersHorizontal, Sofa } from 'lucide-react';
import MakeoverChallenge from '../components/MakeoverChallenge';
import '../styles/MakeoverChallenge.css';

function MakeoverChallengesPage() {
  const [_challenges, setChallenges] = useState([]); // Renamed to _challenges to follow unused variable naming convention
  const [filteredChallenges, setFilteredChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('active');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilterOptions, setShowFilterOptions] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const location = useLocation();
  const { fromRoomMakeover, originalImage } = location.state || {};
  const activeFilterRef = useRef(activeFilter);
  const searchQueryRef = useRef(searchQuery);
  const sortByRef = useRef(sortBy);

  const userData = {
    name: 'E.M.T.T.BANDARANAYAKE',
    profilePicture: 'https://randomuser.me/api/portraits/women/44.jpg'
  };

  // Function to apply filters - defined outside useEffect to avoid recreating it on every render
  const applyFilters = (challengeList, filter, search, sort) => {
    // Filter by status
    let filtered = challengeList;
    if (filter === 'active') {
      filtered = challengeList.filter(challenge => challenge.isActive);
    } else if (filter === 'completed') {
      filtered = challengeList.filter(challenge => !challenge.isActive);
    }
    
    // Apply search
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(challenge => 
        challenge.title.toLowerCase().includes(searchLower) ||
        challenge.description.toLowerCase().includes(searchLower) ||
        challenge.author.name.toLowerCase().includes(searchLower)
      );
    }
    
    // Apply sorting
    switch (sort) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'popular':
        filtered.sort((a, b) => b.votes - a.votes);
        break;
      case 'ending-soon':
        // Only sort active challenges by end date
        const active = filtered.filter(c => c.isActive);
        const completed = filtered.filter(c => !c.isActive);
        active.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
        filtered = [...active, ...completed];
        break;
      case 'most-submissions':
        filtered.sort((a, b) => b.submissionsCount - a.submissionsCount);
        break;
      default:
        break;
    }
    
    setFilteredChallenges(filtered);
  };

  // Mock data for challenges
  useEffect(() => {
    // Simulate API call to fetch challenges
    setTimeout(() => {
      const mockChallenges = [
        {
          id: 1,
          title: "Modern Living Room Redesign Challenge",
          description: "Help me transform my outdated living room into a modern space with clean lines and a neutral color palette. Looking for furniture arrangements and decor ideas.",
          roomImage: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
          author: {
            name: "Sarah Johnson",
            avatar: "https://randomuser.me/api/portraits/women/45.jpg"
          },
          isActive: true,
          deadline: "April 22, 2025",
          endsIn: "7 days left",
          participants: 18,
          submissionsCount: 8,
          votes: 32,
          comments: 15,
          topSubmissions: [
            { image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" },
            { image: "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" },
            { image: "https://images.unsplash.com/photo-1618220179428-22790b461013?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" }
          ],
          prize: "Featured on the homepage",
          createdAt: new Date('2025-04-15T10:30:00')
        },
        {
          id: 2,
          title: "Small Bathroom Makeover Ideas",
          description: "Working with a tiny bathroom (5x7 ft) and need creative storage solutions and design ideas to make it feel more spacious. Prefer a clean, spa-like aesthetic.",
          roomImage: "https://images.unsplash.com/photo-1564540583246-934409427776?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
          author: {
            name: "Michael Chen",
            avatar: "https://randomuser.me/api/portraits/men/32.jpg"
          },
          isActive: true,
          deadline: "April 30, 2025",
          endsIn: "15 days left",
          participants: 12,
          submissionsCount: 5,
          votes: 24,
          comments: 9,
          topSubmissions: [
            { image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" },
            { image: "https://images.unsplash.com/photo-1620626011761-996317b8d101?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" }
          ],
          prize: "$50 Gift Card",
          createdAt: new Date('2025-04-10T14:45:00')
        },
        {
          id: 3,
          title: "Kid-Friendly Playroom Design",
          description: "Converting a spare bedroom into a creative playroom for two children (ages 4 and 7). Need ideas for storage, play areas, and educational spaces that can grow with them.",
          roomImage: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
          author: {
            name: "Emma Davis",
            avatar: "https://randomuser.me/api/portraits/women/67.jpg"
          },
          isActive: true,
          deadline: "May 7, 2025",
          endsIn: "22 days left",
          participants: 21,
          submissionsCount: 3,
          votes: 29,
          comments: 11,
          topSubmissions: [
            { image: "https://images.unsplash.com/photo-1617104678098-de229db51175?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" }
          ],
          prize: "Design consultation",
          createdAt: new Date('2025-04-13T09:15:00')
        },
        {
          id: 4,
          title: "Home Office Transformation",
          description: "Need to create a productive home office in the corner of my living room. Looking for desk setup, storage solutions, and ways to visually separate it from the rest of the space.",
          roomImage: "https://images.unsplash.com/photo-1497215842964-222b430dc094?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
          author: {
            name: "David Wilson",
            avatar: "https://randomuser.me/api/portraits/men/22.jpg"
          },
          isActive: false,
          deadline: "April 5, 2025",
          endsIn: "Completed",
          participants: 34,
          submissionsCount: 15,
          votes: 87,
          comments: 25,
          topSubmissions: [
            { image: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" },
            { image: "https://images.unsplash.com/photo-1593476550610-87baa860004a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" },
            { image: "https://images.unsplash.com/photo-1585128792020-803d29415281?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" }
          ],
          prize: "Community favorite badge",
          createdAt: new Date('2025-03-22T16:20:00')
        },
        {
          id: 5,
          title: "Cozy Bedroom Makeover Challenge",
          description: "Looking to transform my stark bedroom into a cozy retreat. Would love ideas for layered textures, lighting, and color schemes that create warmth.",
          roomImage: "https://images.unsplash.com/photo-1499916078039-922301b0eb9b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
          author: {
            name: "Julia Martinez",
            avatar: "https://randomuser.me/api/portraits/women/22.jpg"
          },
          isActive: false,
          deadline: "March 25, 2025",
          endsIn: "Completed",
          participants: 28,
          submissionsCount: 12,
          votes: 63,
          comments: 19,
          topSubmissions: [
            { image: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" },
            { image: "https://images.unsplash.com/photo-1588046130717-0eb0c9a3ba15?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" }
          ],
          prize: "Feature in newsletter",
          createdAt: new Date('2025-03-10T11:30:00')
        }
      ];
      
      setChallenges(mockChallenges);
      applyFilters(mockChallenges, activeFilter, searchQuery, sortBy);
      setLoading(false);
    }, 1000);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // This effect should only run once on mount, don't add the dependencies

  // Update refs when values change
  useEffect(() => {
    activeFilterRef.current = activeFilter;
    searchQueryRef.current = searchQuery;
    sortByRef.current = sortBy;
  }, [activeFilter, searchQuery, sortBy]);
  
  const initialRender = useRef(true);

  useEffect(() => {
    // Skip the first render
    if (initialRender.current) {
      initialRender.current = false;
      return;
    }
    
    if (fromRoomMakeover && originalImage) {
      console.log("Room makeover data received:", originalImage);
      console.log("Using filter:", activeFilterRef.current);
      console.log("Using search:", searchQueryRef.current);
      console.log("Using sort:", sortByRef.current);
    }
  }, [fromRoomMakeover, originalImage]); // These are the only dependencies needed here

  // Apply filters whenever filter criteria change
  useEffect(() => {
    applyFilters(_challenges, activeFilter, searchQuery, sortBy);
  }, [activeFilter, searchQuery, sortBy, _challenges]); // Added missing dependencies

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
          <Link to="/dashboard" className="back-button">
            <ArrowLeft size={20} />
            <span>Back to Dashboard</span>
          </Link>
          
          <div className="header-actions">
            <Link to="/profile" className="profile-quick-access">
              <img src={userData.profilePicture} alt="Profile" />
              <span>{userData.name.split(' ')[0]}</span>
            </Link>
          </div>
        </header>

        {/* Challenges Content */}
        <div className="challenges-container">
          <div className="challenges-header">
            <div className="challenges-title">
              <h1><Trophy size={28} /> Room Makeover Challenges</h1>
              <p>Participate in community design challenges and showcase your skills</p>
            </div>
            
            <div className="challenges-search">
              <Search size={20} className="search-icon" />
              <input 
                type="text" 
                placeholder="Search challenges..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="challenges-filters">
            <div className="filter-tabs">
              <button 
                className={`filter-tab ${activeFilter === 'all' ? 'active' : ''}`}
                onClick={() => setActiveFilter('all')}
              >
                All Challenges
              </button>
              <button 
                className={`filter-tab ${activeFilter === 'active' ? 'active' : ''}`}
                onClick={() => setActiveFilter('active')}
              >
                <Clock size={16} />
                Active
              </button>
              <button 
                className={`filter-tab ${activeFilter === 'completed' ? 'active' : ''}`}
                onClick={() => setActiveFilter('completed')}
              >
                <Trophy size={16} />
                Completed
              </button>
            </div>
            
            <div className="sort-dropdown">
              <button 
                className="sort-button"
                onClick={() => setShowFilterOptions(!showFilterOptions)}
              >
                <SlidersHorizontal size={16} />
                <span>
                  {sortBy === 'newest' && 'Newest First'}
                  {sortBy === 'popular' && 'Most Popular'}
                  {sortBy === 'ending-soon' && 'Ending Soon'}
                  {sortBy === 'most-submissions' && 'Most Submissions'}
                </span>
              </button>
              
              {showFilterOptions && (
                <div className="sort-options">
                  <div 
                    className={`sort-option ${sortBy === 'newest' ? 'active' : ''}`}
                    onClick={() => {
                      setSortBy('newest');
                      setShowFilterOptions(false);
                    }}
                  >
                    <Calendar size={16} />
                    <span>Newest First</span>
                  </div>
                  <div 
                    className={`sort-option ${sortBy === 'popular' ? 'active' : ''}`}
                    onClick={() => {
                      setSortBy('popular');
                      setShowFilterOptions(false);
                    }}
                  >
                    <Trophy size={16} />
                    <span>Most Popular</span>
                  </div>
                  <div 
                    className={`sort-option ${sortBy === 'ending-soon' ? 'active' : ''}`}
                    onClick={() => {
                      setSortBy('ending-soon');
                      setShowFilterOptions(false);
                    }}
                  >
                    <Clock size={16} />
                    <span>Ending Soon</span>
                  </div>
                  <div 
                    className={`sort-option ${sortBy === 'most-submissions' ? 'active' : ''}`}
                    onClick={() => {
                      setSortBy('most-submissions');
                      setShowFilterOptions(false);
                    }}
                  >
                    <Filter size={16} />
                    <span>Most Submissions</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading challenges...</p>
            </div>
          ) : filteredChallenges.length === 0 ? (
            <div className="empty-state">
              <Trophy size={48} />
              <h3>No challenges found</h3>
              <p>{searchQuery ? 'Try a different search term' : 'Be the first to create a challenge!'}</p>
              <Link to="/room-makeover" className="create-button">
                <Trophy size={16} />
                <span>Create a Challenge</span>
              </Link>
            </div>
          ) : (
            <div className="challenges-grid">
              {filteredChallenges.map(challenge => (
                <MakeoverChallenge key={challenge.id} challenge={challenge} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MakeoverChallengesPage;