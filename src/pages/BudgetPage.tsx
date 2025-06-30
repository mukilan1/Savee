import React, { useState } from 'react';
import { User, BudgetAllocation } from '../types';
import Chart from '../components/Chart';
import { Sliders, Save, Target, AlertTriangle, CheckCircle } from 'lucide-react';

interface BudgetPageProps {
  user: User;
}

const BudgetPage: React.FC<BudgetPageProps> = ({ user }) => {
  const [budget, setBudget] = useState<BudgetAllocation>({
    expenses: 60,
    savings: 20,
    investments: 15,
    emergencyFund: 5
  });

  const [monthlyIncome, setMonthlyIncome] = useState(user.monthlyIncome);
  const [isSaved, setIsSaved] = useState(false);

  const handleSliderChange = (category: keyof BudgetAllocation, value: number) => {
    setBudget(prev => ({ ...prev, [category]: value }));
    setIsSaved(false);
  };

  const totalAllocation = Object.values(budget).reduce((sum, value) => sum + value, 0);
  const isValidBudget = totalAllocation === 100;

  const chartData = [
    { label: 'Expenses', value: budget.expenses, color: '#ef4444' },
    { label: 'Savings', value: budget.savings, color: '#3b82f6' },
    { label: 'Investments', value: budget.investments, color: '#10b981' },
    { label: 'Emergency Fund', value: budget.emergencyFund, color: '#f59e0b' }
  ];

  const getBudgetAdvice = () => {
    if (budget.savings < 20) {
      return {
        type: 'warning',
        message: 'Consider increasing savings to at least 20% for better financial security.'
      };
    } else if (budget.investments < 10 && user.age < 40) {
      return {
        type: 'info',
        message: 'Young professionals should ideally invest 15-20% for long-term wealth building.'
      };
    } else if (budget.emergencyFund < 5) {
      return {
        type: 'warning',
        message: 'Emergency fund should be at least 5-10% of your income for unexpected expenses.'
      };
    } else {
      return {
        type: 'success',
        message: 'Great budget allocation! This balanced approach supports your financial goals.'
      };
    }
  };

  const advice = getBudgetAdvice();

  const saveBudget = () => {
    if (isValidBudget) {
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Budget Planner</h1>
        <p className="text-gray-600">Optimize your budget allocation for better financial health</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Budget Controls */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center space-x-2 mb-6">
            <Sliders className="h-5 w-5 text-emerald-600" />
            <h2 className="text-lg font-semibold text-gray-900">Budget Allocation</h2>
          </div>

          {/* Monthly Income */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Monthly Income (₹)
            </label>
            <input
              type="number"
              value={monthlyIncome}
              onChange={(e) => setMonthlyIncome(parseInt(e.target.value))}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
            />
          </div>

          {/* Budget Sliders */}
          <div className="space-y-6">
            {Object.entries(budget).map(([category, value]) => {
              const amount = (monthlyIncome * value) / 100;
              const categoryLabels = {
                expenses: 'Living Expenses',
                savings: 'Savings',
                investments: 'Investments',
                emergencyFund: 'Emergency Fund'
              };

              return (
                <div key={category}>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-gray-700">
                      {categoryLabels[category as keyof typeof categoryLabels]}
                    </label>
                    <div className="text-sm text-gray-600">
                      {value}% (₹{amount.toLocaleString()})
                    </div>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="80"
                    value={value}
                    onChange={(e) => handleSliderChange(category as keyof BudgetAllocation, parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>
              );
            })}
          </div>

          {/* Total Allocation Warning */}
          <div className={`mt-6 p-4 rounded-lg border-l-4 ${
            totalAllocation === 100 ? 'bg-emerald-50 border-emerald-500' :
            totalAllocation > 100 ? 'bg-red-50 border-red-500' :
            'bg-yellow-50 border-yellow-500'
          }`}>
            <div className="flex items-center space-x-2">
              {totalAllocation === 100 ? (
                <CheckCircle className="h-5 w-5 text-emerald-600" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
              )}
              <span className={`font-medium ${
                totalAllocation === 100 ? 'text-emerald-800' :
                totalAllocation > 100 ? 'text-red-800' :
                'text-yellow-800'
              }`}>
                Total Allocation: {totalAllocation}%
              </span>
            </div>
            {totalAllocation !== 100 && (
              <p className={`text-sm mt-1 ${
                totalAllocation > 100 ? 'text-red-700' : 'text-yellow-700'
              }`}>
                {totalAllocation > 100 
                  ? 'You\'re over-allocating! Reduce some categories.'
                  : 'You have unallocated budget. Consider increasing allocations.'
                }
              </p>
            )}
          </div>
        </div>

        {/* Budget Visualization */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Budget Distribution</h2>
          
          <div className="flex justify-center mb-6">
            <Chart data={chartData} type="donut" size={250} />
          </div>

          {/* Budget Breakdown */}
          <div className="space-y-3 mb-6">
            {chartData.map((item, index) => {
              const amount = (monthlyIncome * item.value) / 100;
              return (
                <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="font-medium text-gray-900">{item.label}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">₹{amount.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">{item.value}%</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* AI Advice */}
          <div className={`p-4 rounded-lg border-l-4 ${
            advice.type === 'success' ? 'bg-emerald-50 border-emerald-500' :
            advice.type === 'warning' ? 'bg-orange-50 border-orange-500' :
            'bg-blue-50 border-blue-500'
          }`}>
            <div className="flex items-start space-x-2">
              <Target className={`h-5 w-5 mt-0.5 ${
                advice.type === 'success' ? 'text-emerald-600' :
                advice.type === 'warning' ? 'text-orange-600' :
                'text-blue-600'
              }`} />
              <div>
                <h3 className={`font-medium ${
                  advice.type === 'success' ? 'text-emerald-800' :
                  advice.type === 'warning' ? 'text-orange-800' :
                  'text-blue-800'
                }`}>
                  Budget Recommendation
                </h3>
                <p className={`text-sm mt-1 ${
                  advice.type === 'success' ? 'text-emerald-700' :
                  advice.type === 'warning' ? 'text-orange-700' :
                  'text-blue-700'
                }`}>
                  {advice.message}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-center">
        <button
          onClick={saveBudget}
          disabled={!isValidBudget}
          className={`
            flex items-center space-x-2 px-8 py-3 rounded-lg font-semibold transition-all duration-200
            ${isValidBudget
              ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg hover:shadow-xl'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }
            ${isSaved ? 'bg-green-600' : ''}
          `}
        >
          <Save size={20} />
          <span>{isSaved ? 'Budget Saved!' : 'Save Budget Plan'}</span>
        </button>
      </div>
    </div>
  );
};

export default BudgetPage;