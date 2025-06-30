import React from 'react';
import { TrendingUp } from 'lucide-react';

const LoadingScreen: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 flex items-center justify-center">
      <div className="text-center">
        <div className="flex items-center justify-center space-x-2 mb-8">
          <TrendingUp className="h-12 w-12 text-emerald-600 animate-pulse" />
          <h1 className="text-4xl font-bold text-gray-800">Savee</h1>
          <span className="text-sm bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full font-medium">Pro</span>
        </div>
        
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-emerald-600 mx-auto mb-4"></div>
          <div className="absolute inset-0 rounded-full h-16 w-16 border-t-4 border-emerald-200 mx-auto animate-ping"></div>
        </div>
        
        <p className="text-gray-600 text-lg mb-2">Initializing Savee Professional</p>
        <p className="text-gray-500 text-sm">Loading AI services and blockchain connections...</p>
        
        <div className="mt-8 flex justify-center space-x-2">
          <div className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;