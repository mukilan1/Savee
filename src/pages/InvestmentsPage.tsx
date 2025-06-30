import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, DollarSign, PieChart, Plus, Eye, BarChart3 } from 'lucide-react';
import { CryptoService } from '../services/cryptoService';
import { AIService } from '../services/aiService';
import { useProfile } from '../hooks/useProfile';
import Chart from '../components/Chart';

interface Investment {
  id: string;
  name: string;
  type: 'mutual_fund' | 'stock' | 'crypto' | 'bond';
  amount: number;
  currentValue: number;
  gainLoss: number;
  gainLossPercent: number;
  lastUpdated: string;
}

const InvestmentsPage: React.FC = () => {
  const { profile } = useProfile();
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedView, setSelectedView] = useState<'overview' | 'performance' | 'allocation'>('overview');

  const cryptoService = CryptoService.getInstance();
  const aiService = AIService.getInstance();

  useEffect(() => {
    loadInvestments();
    loadRecommendations();
  }, []);

  const loadInvestments = async () => {
    // Mock investment data - in production, this would come from your API
    const mockInvestments: Investment[] = [
      {
        id: '1',
        name: 'HDFC Top 100 Fund',
        type: 'mutual_fund',
        amount: 50000,
        currentValue: 58500,
        gainLoss: 8500,
        gainLossPercent: 17.0,
        lastUpdated: new Date().toISOString()
      },
      {
        id: '2',
        name: 'Reliance Industries',
        type: 'stock',
        amount: 25000,
        currentValue: 23800,
        gainLoss: -1200,
        gainLossPercent: -4.8,
        lastUpdated: new Date().toISOString()
      },
      {
        id: '3',
        name: 'Bitcoin',
        type: 'crypto',
        amount: 100000,
        currentValue: 125000,
        gainLoss: 25000,
        gainLossPercent: 25.0,
        lastUpdated: new Date().toISOString()
      },
      {
        id: '4',
        name: 'Government Bond 2030',
        type: 'bond',
        amount: 75000,
        currentValue: 78200,
        gainLoss: 3200,
        gainLossPercent: 4.3,
        lastUpdated: new Date().toISOString()
      }
    ];

    setInvestments(mockInvestments);
    setLoading(false);
  };

  const loadRecommendations = async () => {
    if (!profile) return;

    try {
      const response = await aiService.getFinancialAdvice(
        `investment recommendations for ${profile.risk_preference} risk profile`,
        profile
      );
      setRecommendations(response.suggestions);
    } catch (error) {
      console.error('Failed to load recommendations:', error);
    }
  };

  const totalInvestment = investments.reduce((sum, inv) => sum + inv.amount, 0);
  const totalCurrentValue = investments.reduce((sum, inv) => sum + inv.currentValue, 0);
  const totalGainLoss = totalCurrentValue - totalInvestment;
  const totalGainLossPercent = totalInvestment > 0 ? (totalGainLoss / totalInvestment) * 100 : 0;

  const allocationData = investments.map((inv, index) => ({
    label: inv.name,
    value: inv.currentValue,
    color: ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'][index % 4]
  }));

  const performanceData = investments.map((inv, index) => ({
    label: inv.name,
    value: inv.gainLossPercent,
    color: inv.gainLoss >= 0 ? '#10b981' : '#ef4444'
  }));

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid md:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Investment Portfolio</h1>
          <p className="text-gray-600">Track and manage your investment performance</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center space-x-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
        >
          <Plus size={20} />
          <span>Add Investment</span>
        </button>
      </div>

      {/* Portfolio Summary */}
      <div className="grid md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Total Invested</h3>
            <DollarSign className="h-5 w-5 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">₹{totalInvestment.toLocaleString()}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Current Value</h3>
            <TrendingUp className="h-5 w-5 text-emerald-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">₹{totalCurrentValue.toLocaleString()}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Total Gain/Loss</h3>
            {totalGainLoss >= 0 ? 
              <TrendingUp className="h-5 w-5 text-emerald-600" /> : 
              <TrendingDown className="h-5 w-5 text-red-600" />
            }
          </div>
          <p className={`text-2xl font-bold ${totalGainLoss >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
            {totalGainLoss >= 0 ? '+' : ''}₹{totalGainLoss.toLocaleString()}
          </p>
          <p className={`text-sm ${totalGainLoss >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
            {totalGainLossPercent >= 0 ? '+' : ''}{totalGainLossPercent.toFixed(2)}%
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Investments</h3>
            <PieChart className="h-5 w-5 text-purple-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{investments.length}</p>
          <p className="text-sm text-gray-600">Active positions</p>
        </div>
      </div>

      {/* View Selector */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-1">
        <div className="flex space-x-1">
          {[
            { id: 'overview', label: 'Overview', icon: Eye },
            { id: 'performance', label: 'Performance', icon: BarChart3 },
            { id: 'allocation', label: 'Allocation', icon: PieChart }
          ].map((view) => {
            const Icon = view.icon;
            return (
              <button
                key={view.id}
                onClick={() => setSelectedView(view.id as any)}
                className={`
                  flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all duration-200
                  ${selectedView === view.id
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                  }
                `}
              >
                <Icon size={20} />
                <span className="hidden sm:inline">{view.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content based on selected view */}
      {selectedView === 'overview' && (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Investment List */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">Your Investments</h2>
            </div>
            
            <div className="p-6 space-y-4">
              {investments.map((investment) => (
                <div key={investment.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      investment.type === 'mutual_fund' ? 'bg-blue-100' :
                      investment.type === 'stock' ? 'bg-green-100' :
                      investment.type === 'crypto' ? 'bg-orange-100' :
                      'bg-purple-100'
                    }`}>
                      <span className={`font-bold text-sm ${
                        investment.type === 'mutual_fund' ? 'text-blue-600' :
                        investment.type === 'stock' ? 'text-green-600' :
                        investment.type === 'crypto' ? 'text-orange-600' :
                        'text-purple-600'
                      }`}>
                        {investment.type === 'mutual_fund' ? 'MF' :
                         investment.type === 'stock' ? 'ST' :
                         investment.type === 'crypto' ? 'CR' : 'BD'}
                      </span>
                    </div>
                    
                    <div>
                      <h3 className="font-medium text-gray-900">{investment.name}</h3>
                      <p className="text-sm text-gray-600 capitalize">{investment.type.replace('_', ' ')}</p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="font-medium text-gray-900">₹{investment.currentValue.toLocaleString()}</p>
                    <p className={`text-sm ${investment.gainLoss >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                      {investment.gainLoss >= 0 ? '+' : ''}₹{investment.gainLoss.toLocaleString()} ({investment.gainLossPercent >= 0 ? '+' : ''}{investment.gainLossPercent.toFixed(1)}%)
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Recommendations */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">AI Recommendations</h2>
            </div>
            
            <div className="p-6 space-y-4">
              {recommendations.map((rec, index) => (
                <div key={index} className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                  <p className="text-sm text-emerald-800">{rec}</p>
                </div>
              ))}
              
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-medium text-blue-800 mb-2">Portfolio Health Score</h4>
                <div className="flex items-center space-x-2">
                  <div className="flex-1 bg-blue-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '78%' }}></div>
                  </div>
                  <span className="text-sm font-medium text-blue-800">78/100</span>
                </div>
                <p className="text-xs text-blue-700 mt-1">Good diversification, consider rebalancing</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedView === 'allocation' && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Portfolio Allocation</h2>
          <div className="flex justify-center">
            <Chart data={allocationData} type="donut" size={300} />
          </div>
        </div>
      )}

      {selectedView === 'performance' && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Performance Analysis</h2>
          <div className="space-y-4">
            {performanceData.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg">
                <span className="font-medium text-gray-900">{item.label}</span>
                <div className="flex items-center space-x-3">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full" 
                      style={{ 
                        width: `${Math.abs(item.value)}%`, 
                        backgroundColor: item.color,
                        marginLeft: item.value < 0 ? `${100 - Math.abs(item.value)}%` : '0'
                      }}
                    ></div>
                  </div>
                  <span className={`font-medium ${item.value >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                    {item.value >= 0 ? '+' : ''}{item.value.toFixed(1)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default InvestmentsPage;