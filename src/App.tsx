import React, { useState, useEffect, createContext, useContext } from 'react';
import { LoginScreen } from './components/LoginScreen';
import { Dashboard } from './components/Dashboard';
import { SetupWizard } from './components/SetupWizard';
import { supabase } from './utils/supabase/client';
import { projectId } from './utils/supabase/info';

// Theme Context
const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [needsSetup, setNeedsSetup] = useState(false);
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    // Check for saved theme preference or default to dark
    const savedTheme = localStorage.getItem('campaign-ai-theme') || 'dark';
    setTheme(savedTheme);
    
    // Apply theme to document
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('campaign-ai-theme', newTheme);
    
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    // Check if user needs setup
    checkUserSetup(userData.id);
  };

  const checkUserSetup = async (userId) => {
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-5efafb23/user/setup-status`, {
        headers: {
          'Authorization': `Bearer ${await supabase.auth.getSession().then(s => s.data.session?.access_token)}`
        }
      });
      const data = await response.json();
      setNeedsSetup(!data.isSetupComplete);
    } catch (error) {
      console.error('Error checking setup status:', error);
      setNeedsSetup(true);
    }
  };

  const handleSetupComplete = () => {
    setNeedsSetup(false);
  };

  const themeContextValue = {
    theme,
    toggleTheme,
    isDark: theme === 'dark'
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <ThemeContext.Provider value={themeContextValue}>
      {!user ? (
        <LoginScreen onLoginSuccess={handleLoginSuccess} />
      ) : needsSetup ? (
        <SetupWizard onComplete={handleSetupComplete} />
      ) : (
        <Dashboard user={user} />
      )}
    </ThemeContext.Provider>
  );
}