import React from 'react';
import { TrendingUp, Target, PieChart, MessageCircle, ArrowRight, Sparkles } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
  onLogin: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted, onLogin }) => {
  const features = [
    {
      icon: PieChart,
      title: 'Smart Budgeting',
      description: 'AI-powered budget allocation based on your lifestyle and goals'
    },
    {
      icon: Target,
      title: 'Goal Tracking',
      description: 'Set and achieve financial milestones with visual progress tracking'
    },
    {
      icon: TrendingUp,
      title: 'Investment Planning',
      description: 'Personalized investment strategies tailored to your risk profile'
    },
    {
      icon: MessageCircle,
      title: 'AI Assistant',
      description: '24/7 financial guidance and instant answers to money questions'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50">
      {/* Header */}
      <header className="px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-8 w-8 text-emerald-600" />
            <h1 className="text-2xl font-bold text-gray-800">Savee</h1>
          </div>
          <button
            onClick={onLogin}
            className="px-4 py-2 text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
          >
            Login
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-emerald-100 text-emerald-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Sparkles size={16} />
            <span>AI-Powered Financial Intelligence</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Smarter money.
            <br />
            <span className="text-emerald-600">Simple decisions.</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Take control of your finances with AI-powered insights, personalized budgeting, 
            and smart investment recommendations tailored to your lifestyle.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={onGetStarted}
              className="group bg-emerald-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center space-x-2"
            >
              <span>Get Started Free</span>
              <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
            </button>
            
            <button className="text-gray-600 px-8 py-4 rounded-xl font-semibold text-lg hover:text-gray-800 transition-colors">
              Watch Demo
            </button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group bg-white p-6 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-emerald-200"
              >
                <div className="bg-emerald-100 w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:bg-emerald-200 transition-colors">
                  <Icon className="text-emerald-600" size={24} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>

        {/* Stats Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-emerald-600 mb-2">₹2.5L+</div>
              <div className="text-gray-600">Average Annual Savings</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">95%</div>
              <div className="text-gray-600">Goal Achievement Rate</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">10K+</div>
              <div className="text-gray-600">Happy Users</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;