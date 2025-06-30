import React, { useState } from 'react';
import { useGoals } from '../hooks/useGoals';
import ProgressBar from '../components/ProgressBar';
import { Plus, Target, Calendar, DollarSign, Edit, Trash2, X } from 'lucide-react';

const GoalsPage: React.FC = () => {
  const { goals, addGoal, updateGoal, deleteGoal } = useGoals();
  const [showForm, setShowForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    target_amount: '',
    saved_amount: '',
    start_date: '',
    end_date: '',
    category: 'Personal'
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingGoal) {
        const { error } = await updateGoal(editingGoal, {
          name: formData.name,
          target_amount: parseInt(formData.target_amount),
          saved_amount: parseInt(formData.saved_amount || '0'),
          start_date: formData.start_date,
          end_date: formData.end_date,
          category: formData.category
        });
        if (error) throw error;
      } else {
        const { error } = await addGoal({
          name: formData.name,
          target_amount: parseInt(formData.target_amount),
          saved_amount: parseInt(formData.saved_amount || '0'),
          start_date: formData.start_date,
          end_date: formData.end_date,
          category: formData.category
        });
        if (error) throw error;
      }

      setFormData({ 
        name: '', 
        target_amount: '', 
        saved_amount: '', 
        start_date: '', 
        end_date: '', 
        category: 'Personal' 
      });
      setShowForm(false);
      setEditingGoal(null);
    } catch (error) {
      console.error('Error saving goal:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (goal: any) => {
    setFormData({
      name: goal.name,
      target_amount: goal.target_amount.toString(),
      saved_amount: goal.saved_amount.toString(),
      start_date: goal.start_date,
      end_date: goal.end_date,
      category: goal.category
    });
    setEditingGoal(goal.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this goal?')) {
      await deleteGoal(id);
    }
  };

  const calculateMonthsRemaining = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    const diffTime = end.getTime() - now.getTime();
    const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30));
    return Math.max(0, diffMonths);
  };

  const getSuggestedMonthlySaving = (goal: any) => {
    const remaining = goal.target_amount - goal.saved_amount;
    const months = calculateMonthsRemaining(goal.end_date);
    return months > 0 ? Math.ceil(remaining / months) : 0;
  };

  const totalTargetAmount = goals.reduce((sum, goal) => sum + goal.target_amount, 0);
  const totalSavedAmount = goals.reduce((sum, goal) => sum + goal.saved_amount, 0);
  const overallProgress = totalTargetAmount > 0 ? (totalSavedAmount / totalTargetAmount) * 100 : 0;

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
      {goals.length > 0 && (
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
      )}

      {/* Goals Grid */}
      {goals.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {goals.map((goal) => {
            const progress = (goal.saved_amount / goal.target_amount) * 100;
            const monthsRemaining = calculateMonthsRemaining(goal.end_date);
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
                    <button 
                      onClick={() => handleEdit(goal)}
                      className="text-gray-400 hover:text-emerald-600 transition-colors"
                    >
                      <Edit size={16} />
                    </button>
                    <button 
                      onClick={() => handleDelete(goal.id)}
                      className="text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Target Amount</span>
                    <span className="font-medium">₹{goal.target_amount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Saved</span>
                    <span className="font-medium text-emerald-600">₹{goal.saved_amount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Remaining</span>
                    <span className="font-medium text-orange-600">₹{(goal.target_amount - goal.saved_amount).toLocaleString()}</span>
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
                    {new Date(goal.start_date).toLocaleDateString('en-IN')} - {new Date(goal.end_date).toLocaleDateString('en-IN')}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white p-12 rounded-xl shadow-sm border border-gray-100 text-center">
          <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Goals Yet</h3>
          <p className="text-gray-600 mb-4">Start by creating your first financial goal to track your progress.</p>
          <button
            onClick={() => setShowForm(true)}
            className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Create Your First Goal
          </button>
        </div>
      )}

      {/* Add/Edit Goal Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                {editingGoal ? 'Edit Goal' : 'Add New Goal'}
              </h2>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingGoal(null);
                  setFormData({ 
                    name: '', 
                    target_amount: '', 
                    saved_amount: '', 
                    start_date: '', 
                    end_date: '', 
                    category: 'Personal' 
                  });
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>
            
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Target Amount (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.target_amount}
                    onChange={(e) => setFormData(prev => ({ ...prev, target_amount: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="100000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Saved Amount (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.saved_amount}
                    onChange={(e) => setFormData(prev => ({ ...prev, saved_amount: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="0"
                  />
                </div>
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
                    value={formData.start_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
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
                    value={formData.end_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, end_date: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingGoal(null);
                    setFormData({ 
                      name: '', 
                      target_amount: '', 
                      saved_amount: '', 
                      start_date: '', 
                      end_date: '', 
                      category: 'Personal' 
                    });
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Saving...' : (editingGoal ? 'Update Goal' : 'Add Goal')}
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