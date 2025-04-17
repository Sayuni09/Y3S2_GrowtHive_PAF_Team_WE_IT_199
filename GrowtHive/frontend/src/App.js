import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import SkillPostPage from './pages/SkillPostPage';
import NotificationsPage from './pages/NotificationsPage';
import ExplorePage from './pages/ExplorePage';

import LearningPlan from './pages/LearningPlan';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/skill-post" element={<SkillPostPage />} />
        <Route path="/learning-plan" element={<LearningPlan />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/explore" element={<ExplorePage />} />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
