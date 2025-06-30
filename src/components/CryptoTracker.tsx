import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Bitcoin, DollarSign, Plus } from 'lucide-react';
import { CryptoService, CryptoPrice, CryptoHolding } from '../services/cryptoService';

const CryptoTracker: React.FC = () => {
  const [cryptoPrices, setCryptoPrices] = useState<CryptoPrice[]>([]);
  const [holdings, setHoldings] = useState<CryptoHolding[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(true);

  const cryptoService = CryptoService.getInstance();

  useEffect(() => {
    loadCryptoPrices();
    loadHoldings();
  }, []);

  const loadCryptoPrices = async () => {
    try {
      const prices = await cryptoService.getCryptoPrices();
      setCryptoPrices(prices);
    } catch (error) {
      console.error('Failed to load crypto prices:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadHoldings = () => {
    // Load from localStorage for demo
    const savedHoldings = localStorage.getItem('crypto_holdings');
    if (savedHoldings) {
      setHoldings(JSON.parse(savedHoldings));
    }
  };

  const addHolding = (symbol: string, amount: number, avgPrice: number) => {
    const currentPrice = cryptoPrices.find(p => p.symbol === symbol)?.price || 0;
    const value = amount * currentPrice;
    const gainLoss = (currentPrice - avgPrice) * amount;

    const newHolding: CryptoHolding = {
      symbol,
      amount,
      avgPrice,
      currentPrice,
      value,
      gainLoss
    };

    const updatedHoldings = [...holdings, newHolding];
    setHoldings(updatedHoldings);
    localStorage.setItem('crypto_holdings', JSON.stringify(updatedHoldings));
  };

  const portfolio = cryptoService.calculatePortfolio(holdings);

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Portfolio Summary */}
      {holdings.length > 0 && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Crypto Portfolio</h3>
            <Bitcoin className="h-6 w-6 text-orange-500" />
          </div>
          
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600">Total Value</p>
              <p className="text-2xl font-bold text-gray-900">₹{portfolio.totalValue.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Gain/Loss</p>
              <p className={`text-2xl font-bold ${portfolio.totalGainLoss >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                {portfolio.totalGainLoss >= 0 ? '+' : ''}₹{portfolio.totalGainLoss.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Holdings</p>
              <p className="text-2xl font-bold text-gray-900">{holdings.length}</p>
            </div>
          </div>
        </div>
      )}

      {/* Market Prices */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Market Prices</h3>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center space-x-2 bg-emerald-600 text-white px-3 py-2 rounded-lg hover:bg-emerald-700 transition-colors text-sm"
          >
            <Plus size={16} />
            <span>Add Holding</span>
          </button>
        </div>

        <div className="space-y-3">
          {cryptoPrices.map((crypto) => (
            <div key={crypto.symbol} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                  <span className="font-bold text-orange-600">{crypto.symbol}</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{crypto.name}</h4>
                  <p className="text-sm text-gray-600">₹{crypto.price.toLocaleString()}</p>
                </div>
              </div>
              
              <div className="text-right">
                <div className={`flex items-center space-x-1 ${crypto.change24h >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                  {crypto.change24h >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                  <span className="font-medium">{crypto.change24h >= 0 ? '+' : ''}{crypto.change24h.toFixed(2)}%</span>
                </div>
                <p className="text-xs text-gray-500">24h change</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Holdings */}
      {holdings.length > 0 && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Holdings</h3>
          
          <div className="space-y-3">
            {holdings.map((holding, index) => (
              <div key={index} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">{holding.symbol}</h4>
                  <p className="text-sm text-gray-600">{holding.amount} coins</p>
                </div>
                
                <div className="text-right">
                  <p className="font-medium text-gray-900">₹{holding.value.toLocaleString()}</p>
                  <p className={`text-sm ${holding.gainLoss >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                    {holding.gainLoss >= 0 ? '+' : ''}₹{holding.gainLoss.toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Holding Form */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Crypto Holding</h3>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target as HTMLFormElement);
              const symbol = formData.get('symbol') as string;
              const amount = parseFloat(formData.get('amount') as string);
              const avgPrice = parseFloat(formData.get('avgPrice') as string);
              
              addHolding(symbol, amount, avgPrice);
              setShowAddForm(false);
            }} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cryptocurrency
                </label>
                <select name="symbol" required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500">
                  {cryptoPrices.map(crypto => (
                    <option key={crypto.symbol} value={crypto.symbol}>{crypto.name} ({crypto.symbol})</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount
                </label>
                <input
                  type="number"
                  name="amount"
                  step="0.00000001"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="0.1"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Average Purchase Price (₹)
                </label>
                <input
                  type="number"
                  name="avgPrice"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="4000000"
                />
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  Add Holding
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CryptoTracker;