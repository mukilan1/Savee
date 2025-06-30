import React, { useState, useEffect } from 'react';
import { useProfile } from '../hooks/useProfile';
import { useAuth } from '../hooks/useAuth';
import { Save, User as UserIcon, Target, Shield, Bell, CheckCircle, LogOut } from 'lucide-react';

const SettingsPage: React.FC = () => {
  const { profile, updateProfile } = useProfile();
  const { signOut } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    monthly_income: '',
    occupation: 'professional' as 'student' | 'professional' | 'homemaker' | 'business-owner',
    goals: [] as string[],
    risk_preference: 'medium' as 'low' | 'medium' | 'high'
  });

  const [notifications, setNotifications] = useState({
    budgetAlerts: true,
    goalReminders: true,
    expenseWarnings: true,
    investmentUpdates: false
  });

  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name,
        age: profile.age.toString(),
        monthly_income: profile.monthly_income.toString(),
        occupation: profile.occupation,
        goals: profile.goals,
        risk_preference: profile.risk_preference
      });
    }
  }, [profile]);

  if (!profile) return null;

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await updateProfile({
        name: formData.name,
        age: parseInt(formData.age),
        monthly_income: parseInt(formData.monthly_income),
        occupation: formData.occupation,
        goals: formData.goals,
        risk_preference: formData.risk_preference
      });

      if (error) throw error;

      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    if (confirm('Are you sure you want to sign out?')) {
      await signOut();
    }
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
                  value={formData.monthly_income}
                  onChange={(e) => setFormData(prev => ({ ...prev, monthly_income: e.target.value }))}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Occupation Type
                </label>
                <select
                  value={formData.occupation}
                  onChange={(e) => setFormData(prev => ({ ...prev, occupation: e.target.value as typeof formData.occupation }))}
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
                disabled={loading}
                className={`
                  flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all duration-200
                  ${isSaved
                    ? 'bg-green-600 text-white'
                    : loading
                    ? 'bg-gray-400 text-white cursor-not-allowed'
                    : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg hover:shadow-xl'
                  }
                `}
              >
                {isSaved ? <CheckCircle size={20} /> : <Save size={20} />}
                <span>
                  {loading ? 'Saving...' : isSaved ? 'Profile Saved!' : 'Save Changes'}
                </span>
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
                { value: 'low' as const, label: 'Conservative', desc: 'Low risk, steady returns' },
                { value: 'medium' as const, label: 'Balanced', desc: 'Moderate risk, balanced growth' },
                { value: 'high' as const, label: 'Aggressive', desc: 'High risk, high potential returns' }
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, risk_preference: option.value }))}
                  className={`
                    p-4 rounded-lg border-2 transition-all duration-200 text-center
                    ${formData.risk_preference === option.value
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
                <span className="text-sm font-medium">
                  {new Date(profile.created_at).toLocaleDateString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Goals created</span>
                <span className="text-sm font-medium">{profile.goals.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Monthly income</span>
                <span className="text-sm font-medium">₹{profile.monthly_income.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Risk level</span>
                <span className={`text-sm font-medium capitalize ${
                  profile.risk_preference === 'low' ? 'text-green-600' :
                  profile.risk_preference === 'medium' ? 'text-yellow-600' :
                  'text-red-600'
                }`}>
                  {profile.risk_preference}
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
              <button 
                onClick={handleSignOut}
                className="w-full text-left px-3 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center space-x-2"
              >
                <LogOut size={16} />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;