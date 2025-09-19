import React, { useState, useEffect, createContext, useContext } from 'react';
import { LoginScreen } from './components/LoginScreen';
import { Dashboard } from './components/Dashboard';
import { SetupWizard } from './components/SetupWizard';
import { getCurrentUser, getSetupStatus } from './utils/api';

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
    
    const initializeSession = async () => {
      try {
        const currentUser = await getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
          await checkUserSetup();
        }
      } catch (error) {
        console.error('Error loading session:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeSession();
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
    checkUserSetup().catch((error) => {
      console.error('Error verifying setup after login:', error);
    });
  };

  const checkUserSetup = async () => {
    try {
      const data = await getSetupStatus();
      setNeedsSetup(!data?.isSetupComplete);
    } catch (error) {
      console.error('Error checking setup status:', error);
      setNeedsSetup(true);
    }
  };

  const handleSetupComplete = () => {
    setNeedsSetup(false);
  };

  const handleLogout = () => {
    setUser(null);
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
        <Dashboard user={user} onLogout={handleLogout} />
      )}
    </ThemeContext.Provider>
  );
}