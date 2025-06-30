import { INTEGRATIONS } from '../config/integrations';

export interface CryptoPrice {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  marketCap: number;
}

export interface CryptoPortfolio {
  holdings: CryptoHolding[];
  totalValue: number;
  totalGainLoss: number;
}

export interface CryptoHolding {
  symbol: string;
  amount: number;
  avgPrice: number;
  currentPrice: number;
  value: number;
  gainLoss: number;
}

export class CryptoService {
  private static instance: CryptoService;

  static getInstance(): CryptoService {
    if (!CryptoService.instance) {
      CryptoService.instance = new CryptoService();
    }
    return CryptoService.instance;
  }

  // Get crypto prices from River API
  async getCryptoPrices(): Promise<CryptoPrice[]> {
    try {
      if (!INTEGRATIONS.RIVER.API_KEY) {
        return this.getMockCryptoPrices();
      }

      const response = await fetch(`${INTEGRATIONS.RIVER.BASE_URL}/market/prices`, {
        headers: {
          'Authorization': `Bearer ${INTEGRATIONS.RIVER.API_KEY}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        return data.prices;
      }
    } catch (error) {
      console.error('Crypto price fetch error:', error);
    }

    return this.getMockCryptoPrices();
  }

  private getMockCryptoPrices(): CryptoPrice[] {
    return [
      {
        symbol: 'BTC',
        name: 'Bitcoin',
        price: 4200000, // ₹42,00,000
        change24h: 2.5,
        marketCap: 82000000000000 // ₹82 trillion
      },
      {
        symbol: 'ETH',
        name: 'Ethereum',
        price: 280000, // ₹2,80,000
        change24h: -1.2,
        marketCap: 33600000000000 // ₹33.6 trillion
      },
      {
        symbol: 'ALGO',
        name: 'Algorand',
        price: 25, // ₹25
        change24h: 5.8,
        marketCap: 200000000000 // ₹200 billion
      }
    ];
  }

  // Calculate portfolio value
  calculatePortfolio(holdings: CryptoHolding[]): CryptoPortfolio {
    const totalValue = holdings.reduce((sum, holding) => sum + holding.value, 0);
    const totalGainLoss = holdings.reduce((sum, holding) => sum + holding.gainLoss, 0);

    return {
      holdings,
      totalValue,
      totalGainLoss
    };
  }

  // Get investment recommendations
  async getCryptoRecommendations(riskProfile: string, budget: number): Promise<string[]> {
    const recommendations: Record<string, string[]> = {
      low: [
        `Invest ₹${(budget * 0.7).toLocaleString()} in Bitcoin for stability`,
        `Allocate ₹${(budget * 0.3).toLocaleString()} to Ethereum for growth`
      ],
      medium: [
        `Diversify with 50% Bitcoin (₹${(budget * 0.5).toLocaleString()})`,
        `25% Ethereum (₹${(budget * 0.25).toLocaleString()})`,
        `25% Algorand (₹${(budget * 0.25).toLocaleString()}) for DeFi exposure`
      ],
      high: [
        `Aggressive portfolio: 40% Bitcoin, 30% Ethereum, 30% Altcoins`,
        `Consider DeFi staking for additional yield`,
        `Monitor market trends for swing trading opportunities`
      ]
    };

    return recommendations[riskProfile] || recommendations.medium;
  }
}