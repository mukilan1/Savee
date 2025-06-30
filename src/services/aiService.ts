import { INTEGRATIONS } from '../config/integrations';

export interface AIResponse {
  text: string;
  confidence: number;
  suggestions: string[];
}

export class AIService {
  private static instance: AIService;

  static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  // Enhanced AI financial advice using Dappier
  async getFinancialAdvice(query: string, userProfile: any): Promise<AIResponse> {
    try {
      if (!INTEGRATIONS.DAPPIER.API_KEY) {
        return this.getFallbackAdvice(query, userProfile);
      }

      const response = await fetch(`${INTEGRATIONS.DAPPIER.BASE_URL}/chat`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${INTEGRATIONS.DAPPIER.API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          query,
          context: {
            age: userProfile.age,
            income: userProfile.monthly_income,
            occupation: userProfile.occupation,
            goals: userProfile.goals,
            risk_preference: userProfile.risk_preference
          },
          model: 'financial-advisor-v2'
        })
      });

      if (response.ok) {
        const data = await response.json();
        return {
          text: data.response,
          confidence: data.confidence || 0.8,
          suggestions: data.suggestions || []
        };
      }
    } catch (error) {
      console.error('AI service error:', error);
    }

    return this.getFallbackAdvice(query, userProfile);
  }

  private getFallbackAdvice(query: string, userProfile: any): AIResponse {
    const responses: Record<string, AIResponse> = {
      "investment": {
        text: `Based on your ${userProfile.risk_preference} risk profile and ₹${userProfile.monthly_income?.toLocaleString()} monthly income, I recommend a diversified portfolio with 60% equity funds, 30% debt funds, and 10% gold ETF.`,
        confidence: 0.85,
        suggestions: ["Start SIP", "Emergency fund first", "Tax-saving investments"]
      },
      "budget": {
        text: `For your income level, follow the 50-30-20 rule: 50% for needs, 30% for wants, and 20% for savings and investments. This ensures financial stability.`,
        confidence: 0.9,
        suggestions: ["Track expenses", "Automate savings", "Review monthly"]
      },
      "debt": {
        text: `Focus on high-interest debt first. Consider debt consolidation if you have multiple loans. Aim to pay 20% more than minimum EMI to reduce interest burden.`,
        confidence: 0.8,
        suggestions: ["List all debts", "Pay high-interest first", "Consider refinancing"]
      }
    };

    const key = Object.keys(responses).find(k => query.toLowerCase().includes(k)) || "budget";
    return responses[key];
  }

  // Generate personalized video advice using Tavus
  async generateVideoAdvice(script: string, userProfile: any): Promise<string> {
    try {
      if (!INTEGRATIONS.TAVUS.API_KEY) {
        return "video-placeholder-url";
      }

      const response = await fetch(`${INTEGRATIONS.TAVUS.BASE_URL}/videos`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${INTEGRATIONS.TAVUS.API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          script,
          persona_id: 'financial-advisor',
          background: 'office',
          voice_settings: {
            stability: 0.7,
            similarity_boost: 0.8
          }
        })
      });

      if (response.ok) {
        const data = await response.json();
        return data.video_url;
      }
    } catch (error) {
      console.error('Video generation error:', error);
    }

    return "video-placeholder-url";
  }
}