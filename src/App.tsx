import React, { useState } from 'react';
import { User } from './types';
import Sidebar from './components/Sidebar';
import LandingPage from './pages/LandingPage';
import OnboardingPage from './pages/OnboardingPage';
import DashboardPage from './pages/DashboardPage';
import BudgetPage from './pages/BudgetPage';
import TransactionsPage from './pages/TransactionsPage';
import GoalsPage from './pages/GoalsPage';
import ChatPage from './pages/ChatPage';
import SettingsPage from './pages/SettingsPage';

type AppState = 'landing' | 'onboarding' | 'app';

function App() {
  const [appState, setAppState] = useState<AppState>('landing');
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const handleGetStarted = () => {
    setAppState('onboarding');
  };

  const handleLogin = () => {
    // For demo purposes, skip to dashboard with default user
    setUser({
      name: 'Demo User',
      age: 28,
      monthlyIncome: 75000,
      occupation: 'professional',
      goals: ['Save for emergency', 'Buy a car', 'Start investing'],
      riskPreference: 'medium'
    });
    setAppState('app');
  };

  const handleOnboardingComplete = (userData: User) => {
    setUser(userData);
    setAppState('app');
  };

  const handleUpdateUser = (updatedUser: User) => {
    setUser(updatedUser);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  if (appState === 'landing') {
    return (
      <LandingPage 
        onGetStarted={handleGetStarted}
        onLogin={handleLogin}
      />
    );
  }

  if (appState === 'onboarding') {
    return (
      <OnboardingPage onComplete={handleOnboardingComplete} />
    );
  }

  if (!user) {
    return null; // This shouldn't happen, but good to handle
  }

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardPage user={user} />;
      case 'budget':
        return <BudgetPage user={user} />;
      case 'transactions':
        return <TransactionsPage />;
      case 'goals':
        return <GoalsPage />;
      case 'chat':
        return <ChatPage />;
      case 'settings':
        return <SettingsPage user={user} onUpdateUser={handleUpdateUser} />;
      default:
        return <DashboardPage user={user} />;
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