import React, { useState } from 'react';
import { mockGoals } from '../data/mockData';
import { Goal } from '../types';
import ProgressBar from '../components/ProgressBar';
import { Plus, Target, Calendar, DollarSign, Edit, Trash2 } from 'lucide-react';

const GoalsPage: React.FC = () => {
  const [goals, setGoals] = useState(mockGoals);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    targetAmount: '',
    startDate: '',
    endDate: '',
    category: 'Personal'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newGoal: Goal = {
      id: Date.now().toString(),
      name: formData.name,
      targetAmount: parseInt(formData.targetAmount),
      savedAmount: 0,
      startDate: formData.startDate,
      endDate: formData.endDate,
      category: formData.category
    };
    
    setGoals([...goals, newGoal]);
    setFormData({ name: '', targetAmount: '', startDate: '', endDate: '', category: 'Personal' });
    setShowForm(false);
  };

  const deleteGoal = (id: string) => {
    setGoals(goals.filter(goal => goal.id !== id));
  };

  const calculateMonthsRemaining = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    const diffTime = end.getTime() - now.getTime();
    const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30));
    return Math.max(0, diffMonths);
  };

  const getSuggestedMonthlySaving = (goal: Goal) => {
    const remaining = goal.targetAmount - goal.savedAmount;
    const months = calculateMonthsRemaining(goal.endDate);
    return months > 0 ? Math.ceil(remaining / months) : 0;
  };

  const totalTargetAmount = goals.reduce((sum, goal) => sum + goal.targetAmount, 0);
  const totalSavedAmount = goals.reduce((sum, goal) => sum + goal.savedAmount, 0);
  const overallProgress = (totalSavedAmount / totalTargetAmount) * 100;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Financial Goals</h1>
          <p className="text-gray-600">Track your progress towards financial milestones</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
        >
          <Plus size={20} />
          <span>Add Goal</span>
        </button>
      </div>

      {/* Overall Progress */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Overall Progress</h2>
          <Target className="h-6 w-6 text-emerald-600" />
        </div>
        <div className="grid md:grid-cols-3 gap-4 mb-4">
          <div>
            <p className="text-sm text-gray-600">Total Target</p>
            <p className="text-2xl font-bold text-gray-900">₹{totalTargetAmount.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Total Saved</p>
            <p className="text-2xl font-bold text-emerald-600">₹{totalSavedAmount.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Remaining</p>
            <p className="text-2xl font-bold text-orange-600">₹{(totalTargetAmount - totalSavedAmount).toLocaleString()}</p>
          </div>
        </div>
        <ProgressBar progress={overallProgress} color="emerald" />
      </div>

      {/* Goals Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {goals.map((goal) => {
          const progress = (goal.savedAmount / goal.targetAmount) * 100;
          const monthsRemaining = calculateMonthsRemaining(goal.endDate);
          const suggestedMonthlySaving = getSuggestedMonthlySaving(goal);

          return (
            <div key={goal.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{goal.name}</h3>
                  <span className="inline-block bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs mt-1">
                    {goal.category}
                  </span>
                </div>
                <div className="flex space-x-2">
                  <button className="text-gray-400 hover:text-emerald-600 transition-colors">
                    <Edit size={16} />
                  </button>
                  <button 
                    onClick={() => deleteGoal(goal.id)}
                    className="text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Target Amount</span>
                  <span className="font-medium">₹{goal.targetAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Saved</span>
                  <span className="font-medium text-emerald-600">₹{goal.savedAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Remaining</span>
                  <span className="font-medium text-orange-600">₹{(goal.targetAmount - goal.savedAmount).toLocaleString()}</span>
                </div>
              </div>

              <ProgressBar progress={progress} color="emerald" className="mb-4" />

              <div className="border-t border-gray-100 pt-4 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-1 text-gray-600">
                    <Calendar size={14} />
                    <span>Time left</span>
                  </div>
                  <span className="font-medium">
                    {monthsRemaining > 0 ? `${monthsRemaining} months` : 'Overdue'}
                  </span>
                </div>
                
                {monthsRemaining > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-1 text-gray-600">
                      <DollarSign size={14} />
                      <span>Suggested monthly</span>
                    </div>
                    <span className="font-medium text-emerald-600">
                      ₹{suggestedMonthlySaving.toLocaleString()}
                    </span>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="text-xs text-gray-500">
                  {new Date(goal.startDate).toLocaleDateString('en-IN')} - {new Date(goal.endDate).toLocaleDateString('en-IN')}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Goal Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Add New Goal</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Goal Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="e.g., New Laptop"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Target Amount (₹) *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={formData.targetAmount}
                  onChange={(e) => setFormData(prev => ({ ...prev, targetAmount: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="100000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="Personal">Personal</option>
                  <option value="Emergency">Emergency</option>
                  <option value="Travel">Travel</option>
                  <option value="Technology">Technology</option>
                  <option value="Vehicle">Vehicle</option>
                  <option value="Education">Education</option>
                  <option value="Investment">Investment</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.startDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Target Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.endDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  Add Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoalsPage;