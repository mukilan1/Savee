import React from 'react';
import { User } from '../types';
import { mockTransactions, mockGoals } from '../data/mockData';
import ProgressBar from '../components/ProgressBar';
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  PiggyBank, 
  AlertCircle,
  CheckCircle,
  Lightbulb
} from 'lucide-react';

interface DashboardPageProps {
  user: User;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ user }) => {
  // Calculate financial metrics
  const totalIncome = mockTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpenses = Math.abs(mockTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0));
  
  const savings = totalIncome - totalExpenses;
  const savingsRate = ((savings / totalIncome) * 100);

  const totalGoalTarget = mockGoals.reduce((sum, goal) => sum + goal.targetAmount, 0);
  const totalGoalSaved = mockGoals.reduce((sum, goal) => sum + goal.savedAmount, 0);
  const goalProgress = (totalGoalSaved / totalGoalTarget) * 100;

  // AI Suggestions based on user profile and data
  const getAISuggestion = () => {
    if (savingsRate < 20) {
      return {
        type: 'warning',
        title: 'Boost Your Savings',
        message: `Your current savings rate is ${savingsRate.toFixed(1)}%. Try to reduce dining out expenses by ₹3,000 this month to reach the recommended 20% savings rate.`,
        icon: AlertCircle
      };
    } else if (user.occupation === 'professional' && savings > 50000) {
      return {
        type: 'success',
        title: 'Investment Opportunity',
        message: `Great job saving ₹${savings.toLocaleString()}! Consider starting a SIP of ₹10,000/month in diversified equity funds to grow your wealth.`,
        icon: Lightbulb
      };
    } else {
      return {
        type: 'info',
        title: 'Emergency Fund Progress',
        message: `You're doing well! Your emergency fund is 42% complete. Continue saving ₹8,000/month to fully secure your financial safety net.`,
        icon: CheckCircle
      };
    }
  };

  const aiSuggestion = getAISuggestion();

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user.name}!</h1>
        <p className="text-gray-600">Here's your financial overview for this month</p>
      </div>

      {/* Financial Snapshot Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Total Income</h3>
            <TrendingUp className="h-5 w-5 text-emerald-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">₹{totalIncome.toLocaleString()}</p>
          <p className="text-sm text-emerald-600 mt-1">+12% from last month</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Total Expenses</h3>
            <TrendingDown className="h-5 w-5 text-red-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900">₹{totalExpenses.toLocaleString()}</p>
          <p className="text-sm text-red-500 mt-1">+5% from last month</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Savings</h3>
            <PiggyBank className="h-5 w-5 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">₹{savings.toLocaleString()}</p>
          <p className="text-sm text-blue-600 mt-1">{savingsRate.toFixed(1)}% savings rate</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Goal Progress</h3>
            <Target className="h-5 w-5 text-purple-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{goalProgress.toFixed(1)}%</p>
          <p className="text-sm text-purple-600 mt-1">₹{totalGoalSaved.toLocaleString()} saved</p>
        </div>
      </div>

      {/* AI Suggestion Box */}
      <div className={`
        p-6 rounded-xl border-l-4 
        ${aiSuggestion.type === 'warning' ? 'bg-orange-50 border-orange-500' :
          aiSuggestion.type === 'success' ? 'bg-emerald-50 border-emerald-500' :
          'bg-blue-50 border-blue-500'}
      `}>
        <div className="flex items-start space-x-3">
          <aiSuggestion.icon className={`
            h-6 w-6 mt-0.5
            ${aiSuggestion.type === 'warning' ? 'text-orange-600' :
              aiSuggestion.type === 'success' ? 'text-emerald-600' :
              'text-blue-600'}
          `} />
          <div>
            <h3 className={`
              font-semibold text-lg
              ${aiSuggestion.type === 'warning' ? 'text-orange-800' :
                aiSuggestion.type === 'success' ? 'text-emerald-800' :
                'text-blue-800'}
            `}>
              AI Suggestion: {aiSuggestion.title}
            </h3>
            <p className={`
              mt-1
              ${aiSuggestion.type === 'warning' ? 'text-orange-700' :
                aiSuggestion.type === 'success' ? 'text-emerald-700' :
                'text-blue-700'}
            `}>
              {aiSuggestion.message}
            </p>
          </div>
        </div>
      </div>

      {/* Goals Progress */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Active Goals Progress</h2>
        <div className="space-y-4">
          {mockGoals.slice(0, 3).map((goal) => {
            const progress = (goal.savedAmount / goal.targetAmount) * 100;
            return (
              <div key={goal.id} className="border border-gray-100 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium text-gray-900">{goal.name}</h3>
                  <span className="text-sm text-gray-600">
                    ₹{goal.savedAmount.toLocaleString()} / ₹{goal.targetAmount.toLocaleString()}
                  </span>
                </div>
                <ProgressBar progress={progress} showPercentage={false} />
                <div className="flex justify-between text-sm text-gray-600 mt-1">
                  <span>{Math.round(progress)}% complete</span>
                  <span>₹{(goal.targetAmount - goal.savedAmount).toLocaleString()} remaining</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Notification Banner */}
      <div className="bg-emerald-100 border border-emerald-200 p-4 rounded-xl">
        <div className="flex items-center space-x-3">
          <CheckCircle className="h-5 w-5 text-emerald-600" />
          <p className="text-emerald-800 font-medium">
            Great news! You're ₹3,200 under budget this month. Consider allocating this to your emergency fund.
          </p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Transactions</h2>
        <div className="space-y-3">
          {mockTransactions.slice(0, 5).map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
              <div>
                <p className="font-medium text-gray-900">{transaction.description}</p>
                <p className="text-sm text-gray-600">{transaction.category} • {transaction.date}</p>
              </div>
              <span className={`font-semibold ${
                transaction.type === 'income' ? 'text-emerald-600' : 'text-red-600'
              }`}>
                {transaction.type === 'income' ? '+' : ''}₹{Math.abs(transaction.amount).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;