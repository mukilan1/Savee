import React, { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { useAuth } from './hooks/useAuth';
import { useProfile } from './hooks/useProfile';
import { initSentry } from './services/sentryService';
import { NotificationService } from './services/notificationService';
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
import InvestmentsPage from './pages/InvestmentsPage';
import AnalyticsPage from './pages/AnalyticsPage';
import SettingsPage from './pages/SettingsPage';
import LoadingScreen from './components/LoadingScreen';
import ErrorBoundary from './components/ErrorBoundary';

type AppState = 'landing' | 'auth' | 'onboarding' | 'app';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 3,
    },
  },
});

function App() {
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading } = useProfile();
  const [appState, setAppState] = useState<AppState>('landing');
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Initialize services
    const initializeApp = async () => {
      try {
        initSentry();
        await NotificationService.getInstance().initialize();
        setIsInitialized(true);
      } catch (error) {
        console.error('App initialization failed:', error);
        setIsInitialized(true); // Continue anyway
      }
    };

    initializeApp();
  }, []);

  useEffect(() => {
    if (authLoading || profileLoading || !isInitialized) return;

    if (!user) {
      setAppState('landing');
    } else if (!profile) {
      setAppState('onboarding');
    } else {
      setAppState('app');
    }
  }, [user, profile, authLoading, profileLoading, isInitialized]);

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

  if (!isInitialized || authLoading || profileLoading) {
    return <LoadingScreen />;
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
      case 'investments':
        return <InvestmentsPage />;
      case 'analytics':
        return <AnalyticsPage />;
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
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
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
        
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
          }}
        />
      </ErrorBoundary>
    </QueryClientProvider>
  );
}

export default App;