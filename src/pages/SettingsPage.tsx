import React, { useState } from 'react';
import { User } from '../types';
import { Save, User as UserIcon, DollarSign, Target, Shield, Bell, CheckCircle } from 'lucide-react';

interface SettingsPageProps {
  user: User;
  onUpdateUser: (updatedUser: User) => void;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ user, onUpdateUser }) => {
  const [formData, setFormData] = useState({
    name: user.name,
    age: user.age.toString(),
    monthlyIncome: user.monthlyIncome.toString(),
    occupation: user.occupation,
    goals: user.goals,
    riskPreference: user.riskPreference
  });

  const [notifications, setNotifications] = useState({
    budgetAlerts: true,
    goalReminders: true,
    expenseWarnings: true,
    investmentUpdates: false
  });

  const [isSaved, setIsSaved] = useState(false);

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
    const updatedUser: User = {
      name: formData.name,
      age: parseInt(formData.age),
      monthlyIncome: parseInt(formData.monthlyIncome),
      occupation: formData.occupation,
      goals: formData.goals,
      riskPreference: formData.riskPreference
    };
    
    onUpdateUser(updatedUser);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">Manage your profile and preferences</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Profile Settings */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center space-x-2 mb-6">
              <UserIcon className="h-5 w-5 text-emerald-600" />
              <h2 className="text-lg font-semibold text-gray-900">Personal Information</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Age
                  </label>
                  <input
                    type="number"
                    min="18"
                    max="100"
                    value={formData.age}
                    onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Monthly Income (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.monthlyIncome}
                  onChange={(e) => setFormData(prev => ({ ...prev, monthlyIncome: e.target.value }))}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
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

              <button
                type="submit"
                className={`
                  flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all duration-200
                  ${isSaved
                    ? 'bg-green-600 text-white'
                    : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg hover:shadow-xl'
                  }
                `}
              >
                {isSaved ? <CheckCircle size={20} /> : <Save size={20} />}
                <span>{isSaved ? 'Profile Saved!' : 'Save Changes'}</span>
              </button>
            </form>
          </div>

          {/* Financial Goals */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center space-x-2 mb-6">
              <Target className="h-5 w-5 text-emerald-600" />
              <h2 className="text-lg font-semibold text-gray-900">Financial Goals</h2>
            </div>

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
                    size={16}
                    className={formData.goals.includes(goal) ? 'text-emerald-500' : 'text-gray-300'}
                  />
                  <span className="text-sm font-medium">{goal}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Risk Preference */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center space-x-2 mb-6">
              <Shield className="h-5 w-5 text-emerald-600" />
              <h2 className="text-lg font-semibold text-gray-900">Investment Risk Preference</h2>
            </div>

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
        </div>

        {/* Sidebar Settings */}
        <div className="space-y-6">
          {/* Notifications */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center space-x-2 mb-6">
              <Bell className="h-5 w-5 text-emerald-600" />
              <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
            </div>

            <div className="space-y-4">
              {Object.entries(notifications).map(([key, enabled]) => {
                const labels = {
                  budgetAlerts: 'Budget Alerts',
                  goalReminders: 'Goal Reminders',
                  expenseWarnings: 'Expense Warnings',
                  investmentUpdates: 'Investment Updates'
                };

                return (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">
                      {labels[key as keyof typeof labels]}
                    </span>
                    <button
                      onClick={() => setNotifications(prev => ({ ...prev, [key]: !enabled }))}
                      className={`
                        relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                        ${enabled ? 'bg-emerald-600' : 'bg-gray-200'}
                      `}
                    >
                      <span
                        className={`
                          inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                          ${enabled ? 'translate-x-6' : 'translate-x-1'}
                        `}
                      />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Account Summary */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Account Summary</h2>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Member since</span>
                <span className="text-sm font-medium">Jan 2024</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Goals created</span>
                <span className="text-sm font-medium">{user.goals.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Monthly income</span>
                <span className="text-sm font-medium">₹{user.monthlyIncome.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Risk level</span>
                <span className={`text-sm font-medium capitalize ${
                  user.riskPreference === 'low' ? 'text-green-600' :
                  user.riskPreference === 'medium' ? 'text-yellow-600' :
                  'text-red-600'
                }`}>
                  {user.riskPreference}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
            
            <div className="space-y-2">
              <button className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                Export Data
              </button>
              <button className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                Privacy Settings
              </button>
              <button className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                Help & Support
              </button>
              <button className="w-full text-left px-3 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50 transition-colors">
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;