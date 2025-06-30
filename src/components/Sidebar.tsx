import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { 
  Home, 
  PieChart, 
  Target, 
  Receipt, 
  MessageCircle, 
  Settings,
  TrendingUp,
  Menu,
  X,
  LogOut,
  Zap
} from 'lucide-react';

interface SidebarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'budget', label: 'Budget', icon: PieChart },
  { id: 'goals', label: 'Goals', icon: Target },
  { id: 'transactions', label: 'Transactions', icon: Receipt },
  { id: 'chat', label: 'AI Assistant', icon: MessageCircle },
  { id: 'advanced', label: 'Advanced', icon: Zap },
  { id: 'settings', label: 'Settings', icon: Settings },
];

const Sidebar: React.FC<SidebarProps> = ({ currentPage, onPageChange, isOpen, onToggle }) => {
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    if (confirm('Are you sure you want to sign out?')) {
      await signOut();
    }
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={onToggle}
        className="fixed top-4 left-4 z-50 md:hidden bg-emerald-600 text-white p-2 rounded-lg shadow-lg hover:bg-emerald-700 transition-colors"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed left-0 top-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 z-40 flex flex-col
        md:relative md:transform-none md:z-auto
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-6 flex-1">
          <div className="flex items-center space-x-2 mb-8 pt-12 md:pt-0">
            <TrendingUp className="h-8 w-8 text-emerald-600" />
            <h1 className="text-2xl font-bold text-gray-800">Savee</h1>
            <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full font-medium">Pro</span>
          </div>
          
          <nav className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onPageChange(item.id);
                    if (window.innerWidth < 768) onToggle();
                  }}
                  className={`
                    w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200
                    ${currentPage === item.id
                      ? 'bg-emerald-50 text-emerald-700 border-r-4 border-emerald-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                    }
                  `}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.label}</span>
                  {item.id === 'advanced' && (
                    <span className="ml-auto text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">New</span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sign Out Button */}
        <div className="p-6 border-t border-gray-100">
          <button
            onClick={handleSignOut}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 text-red-600 hover:bg-red-50"
          >
            <LogOut size={20} />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;