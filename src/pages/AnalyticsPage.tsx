import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, PieChart, Calendar, Download, Filter } from 'lucide-react';
import { useTransactions } from '../hooks/useTransactions';
import { useGoals } from '../hooks/useGoals';
import { useProfile } from '../hooks/useProfile';
import Chart from '../components/Chart';

const AnalyticsPage: React.FC = () => {
  const { transactions } = useTransactions();
  const { goals } = useGoals();
  const { profile } = useProfile();
  const [timeRange, setTimeRange] = useState<'1M' | '3M' | '6M' | '1Y'>('3M');
  const [selectedMetric, setSelectedMetric] = useState<'spending' | 'income' | 'savings' | 'goals'>('spending');

  // Calculate analytics data
  const getFilteredTransactions = () => {
    const now = new Date();
    const months = timeRange === '1M' ? 1 : timeRange === '3M' ? 3 : timeRange === '6M' ? 6 : 12;
    const cutoffDate = new Date(now.getFullYear(), now.getMonth() - months, now.getDate());
    
    return transactions.filter(t => new Date(t.date) >= cutoffDate);
  };

  const filteredTransactions = getFilteredTransactions();
  
  const spendingByCategory = filteredTransactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + Math.abs(t.amount);
      return acc;
    }, {} as Record<string, number>);

  const incomeByCategory = filteredTransactions
    .filter(t => t.type === 'income')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

  const monthlyTrends = () => {
    const months: Record<string, { income: number; expenses: number }> = {};
    
    filteredTransactions.forEach(t => {
      const month = new Date(t.date).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });
      if (!months[month]) months[month] = { income: 0, expenses: 0 };
      
      if (t.type === 'income') {
        months[month].income += t.amount;
      } else {
        months[month].expenses += Math.abs(t.amount);
      }
    });
    
    return months;
  };

  const getChartData = () => {
    switch (selectedMetric) {
      case 'spending':
        return Object.entries(spendingByCategory).map(([category, amount], index) => ({
          label: category,
          value: amount,
          color: ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6'][index % 5]
        }));
      
      case 'income':
        return Object.entries(incomeByCategory).map(([category, amount], index) => ({
          label: category,
          value: amount,
          color: ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'][index % 5]
        }));
      
      case 'goals':
        return goals.map((goal, index) => ({
          label: goal.name,
          value: (goal.saved_amount / goal.target_amount) * 100,
          color: ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'][index % 5]
        }));
      
      default:
        return [];
    }
  };

  const totalIncome = filteredTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpenses = Math.abs(filteredTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0));
  
  const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;
  const avgMonthlySpending = totalExpenses / (timeRange === '1M' ? 1 : timeRange === '3M' ? 3 : timeRange === '6M' ? 6 : 12);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Financial Analytics</h1>
          <p className="text-gray-600">Deep insights into your financial patterns</p>
        </div>
        
        <div className="flex space-x-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          >
            <option value="1M">Last Month</option>
            <option value="3M">Last 3 Months</option>
            <option value="6M">Last 6 Months</option>
            <option value="1Y">Last Year</option>
          </select>
          
          <button className="flex items-center space-x-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors">
            <Download size={16} />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Savings Rate</h3>
            <TrendingUp className="h-5 w-5 text-emerald-600" />
          </div>
          <p className="text-2xl font-bold text-emerald-600">{savingsRate.toFixed(1)}%</p>
          <p className="text-sm text-gray-600">of income saved</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Avg Monthly Spending</h3>
            <BarChart3 className="h-5 w-5 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">₹{avgMonthlySpending.toLocaleString()}</p>
          <p className="text-sm text-gray-600">per month</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Top Category</h3>
            <PieChart className="h-5 w-5 text-purple-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {Object.keys(spendingByCategory).length > 0 
              ? Object.entries(spendingByCategory).sort(([,a], [,b]) => b - a)[0][0]
              : 'N/A'
            }
          </p>
          <p className="text-sm text-gray-600">highest spending</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Goal Progress</h3>
            <Calendar className="h-5 w-5 text-orange-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {goals.length > 0 
              ? Math.round(goals.reduce((sum, g) => sum + (g.saved_amount / g.target_amount) * 100, 0) / goals.length)
              : 0
            }%
          </p>
          <p className="text-sm text-gray-600">average completion</p>
        </div>
      </div>

      {/* Chart Section */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Financial Breakdown</h2>
            
            <div className="flex space-x-2">
              {[
                { id: 'spending', label: 'Spending' },
                { id: 'income', label: 'Income' },
                { id: 'goals', label: 'Goals' }
              ].map((metric) => (
                <button
                  key={metric.id}
                  onClick={() => setSelectedMetric(metric.id as any)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                    selectedMetric === metric.id
                      ? 'bg-emerald-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {metric.label}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex justify-center">
            <Chart data={getChartData()} type="donut" size={300} />
          </div>
        </div>

        {/* Insights Panel */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">AI Insights</h2>
          
          <div className="space-y-4">
            <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
              <h4 className="font-medium text-emerald-800 mb-2">💡 Spending Pattern</h4>
              <p className="text-sm text-emerald-700">
                Your spending has been consistent over the last {timeRange.toLowerCase()}. 
                Consider increasing your emergency fund allocation.
              </p>
            </div>
            
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-medium text-blue-800 mb-2">📈 Savings Opportunity</h4>
              <p className="text-sm text-blue-700">
                You could save an additional ₹{(avgMonthlySpending * 0.1).toLocaleString()} 
                per month by optimizing your largest expense category.
              </p>
            </div>
            
            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <h4 className="font-medium text-purple-800 mb-2">🎯 Goal Recommendation</h4>
              <p className="text-sm text-purple-700">
                Based on your current savings rate, you're on track to achieve 
                {goals.length > 0 ? ` ${goals.length} goals` : ' your financial goals'} 
                within the target timeframe.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Trends */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Monthly Trends</h2>
        
        <div className="space-y-4">
          {Object.entries(monthlyTrends()).map(([month, data]) => (
            <div key={month} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg">
              <span className="font-medium text-gray-900">{month}</span>
              
              <div className="flex items-center space-x-6">
                <div className="text-right">
                  <p className="text-sm text-gray-600">Income</p>
                  <p className="font-medium text-emerald-600">₹{data.income.toLocaleString()}</p>
                </div>
                
                <div className="text-right">
                  <p className="text-sm text-gray-600">Expenses</p>
                  <p className="font-medium text-red-600">₹{data.expenses.toLocaleString()}</p>
                </div>
                
                <div className="text-right">
                  <p className="text-sm text-gray-600">Net</p>
                  <p className={`font-medium ${data.income - data.expenses >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                    ₹{(data.income - data.expenses).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Financial Health Score */}
      <div className="bg-gradient-to-r from-emerald-50 to-blue-50 p-6 rounded-xl border border-emerald-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Financial Health Score</h2>
          <div className="text-3xl font-bold text-emerald-600">
            {Math.round((savingsRate + (goals.length > 0 ? 20 : 0) + (totalIncome > 0 ? 30 : 0)) / 3)}
            <span className="text-lg text-gray-600">/100</span>
          </div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-600 mb-1">Savings Rate</p>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-emerald-600 h-2 rounded-full" 
                style={{ width: `${Math.min(savingsRate, 100)}%` }}
              ></div>
            </div>
          </div>
          
          <div>
            <p className="text-sm text-gray-600 mb-1">Goal Progress</p>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full" 
                style={{ width: `${goals.length > 0 ? 80 : 0}%` }}
              ></div>
            </div>
          </div>
          
          <div>
            <p className="text-sm text-gray-600 mb-1">Income Stability</p>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-purple-600 h-2 rounded-full" 
                style={{ width: `${totalIncome > 0 ? 90 : 0}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;