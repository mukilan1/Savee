import React, { useState, useEffect } from 'react';
import { useAuth } from './hooks/useAuth';
import { useProfile } from './hooks/useProfile';
import { initSentry } from './services/sentryService';
import AuthForm from './components/AuthForm';
import Sidebar from './components/Sidebar';
import LandingPage from './pages/LandingPage';
import OnboardingPage from './pages/OnboardingPage';
import DashboardPage from './pages/DashboardPage';
import BudgetPage from './pages/BudgetPage';
import TransactionsPage from './pages/TransactionsPage';
import GoalsPage from './pages/GoalsPage';
import ChatPage from './pages/ChatPage';
import AdvancedPage from './pages/AdvancedPage';
import SettingsPage from './pages/SettingsPage';

type AppState = 'landing' | 'auth' | 'onboarding' | 'app';

function App() {
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading } = useProfile();
  const [appState, setAppState] = useState<AppState>('landing');
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    // Initialize Sentry for error monitoring
    initSentry();
  }, []);

  useEffect(() => {
    if (authLoading || profileLoading) return;

    if (!user) {
      setAppState('landing');
    } else if (!profile) {
      setAppState('onboarding');
    } else {
      setAppState('app');
    }
  }, [user, profile, authLoading, profileLoading]);

  const handleGetStarted = () => {
    setAppState('auth');
  };

  const handleLogin = () => {
    setAppState('auth');
  };

  const handleAuthSuccess = () => {
    // The useEffect will handle the state transition
  };

  const handleOnboardingComplete = () => {
    // The useEffect will handle the state transition
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Savee...</p>
        </div>
      </div>
    );
  }

  if (appState === 'landing') {
    return (
      <LandingPage 
        onGetStarted={handleGetStarted}
        onLogin={handleLogin}
      />
    );
  }

  if (appState === 'auth') {
    return <AuthForm onSuccess={handleAuthSuccess} />;
  }

  if (appState === 'onboarding') {
    return <OnboardingPage onComplete={handleOnboardingComplete} />;
  }

  if (!profile) {
    return null; // This shouldn't happen, but good to handle
  }

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardPage />;
      case 'budget':
        return <BudgetPage />;
      case 'transactions':
        return <TransactionsPage />;
      case 'goals':
        return <GoalsPage />;
      case 'chat':
        return <ChatPage />;
      case 'advanced':
        return <AdvancedPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        isOpen={sidebarOpen}
        onToggle={toggleSidebar}
      />
      
      <div className="flex-1 md:ml-0">
        <main className="p-6 md:p-8 pt-16 md:pt-8">
          <div className="max-w-7xl mx-auto">
            {renderCurrentPage()}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;