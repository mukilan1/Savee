import React, { useState } from 'react';
import { User } from '../types';
import { CheckCircle, ArrowRight } from 'lucide-react';

interface OnboardingPageProps {
  onComplete: (userData: User) => void;
}

const OnboardingPage: React.FC<OnboardingPageProps> = ({ onComplete }) => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    monthlyIncome: '',
    occupation: 'professional' as User['occupation'],
    goals: [] as string[],
    riskPreference: 'medium' as User['riskPreference']
  });

  const goalOptions = [
    'Buy a car',
    'Save for emergency',
    'Pay off debt',
    'Travel abroad',
    'Buy a home',
    'Start investing',
    'Education fund',
    'Retirement planning'
  ];

  const handleGoalToggle = (goal: string) => {
    setFormData(prev => ({
      ...prev,
      goals: prev.goals.includes(goal)
        ? prev.goals.filter(g => g !== goal)
        : [...prev.goals, goal]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const userData: User = {
      name: formData.name,
      age: parseInt(formData.age),
      monthlyIncome: parseInt(formData.monthlyIncome),
      occupation: formData.occupation,
      goals: formData.goals,
      riskPreference: formData.riskPreference
    };
    onComplete(userData);
  };

  const isFormValid = formData.name && formData.age && formData.monthlyIncome && formData.goals.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Let's get to know you</h1>
          <p className="text-gray-600">Help us personalize your financial journey</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Personal Information</h2>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                  placeholder="Enter your full name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Age *
                </label>
                <input
                  type="number"
                  required
                  min="18"
                  max="100"
                  value={formData.age}
                  onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                  placeholder="25"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Monthly Income (₹) *
              </label>
              <input
                type="number"
                required
                min="0"
                value={formData.monthlyIncome}
                onChange={(e) => setFormData(prev => ({ ...prev, monthlyIncome: e.target.value }))}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                placeholder="50000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Occupation Type
              </label>
              <select
                value={formData.occupation}
                onChange={(e) => setFormData(prev => ({ ...prev, occupation: e.target.value as User['occupation'] }))}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
              >
                <option value="student">Student</option>
                <option value="professional">Professional</option>
                <option value="homemaker">Homemaker</option>
                <option value="business-owner">Business Owner</option>
              </select>
            </div>
          </div>

          {/* Financial Goals */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Financial Goals</h2>
            <p className="text-sm text-gray-600">Select all that apply to you</p>
            
            <div className="grid grid-cols-2 gap-3">
              {goalOptions.map((goal) => (
                <button
                  key={goal}
                  type="button"
                  onClick={() => handleGoalToggle(goal)}
                  className={`
                    flex items-center space-x-3 p-3 rounded-lg border-2 transition-all duration-200 text-left
                    ${formData.goals.includes(goal)
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                    }
                  `}
                >
                  <CheckCircle
                    size={20}
                    className={formData.goals.includes(goal) ? 'text-emerald-500' : 'text-gray-300'}
                  />
                  <span className="font-medium">{goal}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Risk Preference */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Investment Risk Preference</h2>
            
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: 'low', label: 'Conservative', desc: 'Low risk, steady returns' },
                { value: 'medium', label: 'Balanced', desc: 'Moderate risk, balanced growth' },
                { value: 'high', label: 'Aggressive', desc: 'High risk, high potential returns' }
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, riskPreference: option.value as User['riskPreference'] }))}
                  className={`
                    p-4 rounded-lg border-2 transition-all duration-200 text-center
                    ${formData.riskPreference === option.value
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                    }
                  `}
                >
                  <div className="font-semibold">{option.label}</div>
                  <div className="text-xs mt-1 opacity-70">{option.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={!isFormValid}
            className={`
              w-full py-4 px-6 rounded-lg font-semibold text-lg transition-all duration-200 flex items-center justify-center space-x-2
              ${isFormValid
                ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg hover:shadow-xl'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }
            `}
          >
            <span>Continue to Dashboard</span>
            <ArrowRight size={20} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default OnboardingPage;