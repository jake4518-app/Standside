import React, { createContext, useContext, useState } from 'react';
import { INITIAL_MATCHES, STANDSIDERS } from '../data';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [matches, setMatches] = useState(INITIAL_MATCHES);
  const [standsiders, setStandsiders] = useState(STANDSIDERS);
  const [profile, setProfile] = useState({
    name: 'Ciarán Mac Giolla',
    handle: '@ciaranmg',
    bio: 'GAA fan from Kilkenny. Hurling is life. 🐝',
    county: 'Kilkenny',
    province: 'Leinster',
    since: 'January 2024',
    favouriteTeam: { name: 'Kilkenny', emoji: '🐝', sport: 'Hurling', province: 'Leinster' },
    avatarInitial: 'C',
    avatarColor: '#28843F',
  });

  const addMatch = (match) => {
    const newMatch = {
      ...match,
      id: Date.now().toString(),
      standsidersCount: Math.floor(Math.random() * 500) + 10,
      friendsCount: Math.floor(Math.random() * 5),
    };
    setMatches(prev => [newMatch, ...prev]);
  };

  const toggleFollow = (standsiderId) => {
    setStandsiders(prev =>
      prev.map(s => s.id === standsiderId ? { ...s, following: !s.following } : s)
    );
  };

  const updateProfile = (updates) => {
    setProfile(prev => ({ ...prev, ...updates }));
  };

  const stats = {
    games: matches.length,
    programmes: matches.filter(m => m.hasProgramme).length,
    counties: [...new Set(matches.flatMap(m => [m.homeTeam, m.awayTeam]))].length,
    following: standsiders.filter(s => s.following).length,
  };

  return (
    <AppContext.Provider value={{
      matches, addMatch,
      standsiders, toggleFollow,
      profile, updateProfile,
      stats,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
