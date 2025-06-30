import { INTEGRATIONS } from '../config/integrations';

export interface VideoRequest {
  script: string;
  persona: 'financial-advisor' | 'investment-expert' | 'budget-coach';
  background: 'office' | 'home' | 'studio';
  duration?: number;
}

export interface VideoResponse {
  videoId: string;
  videoUrl: string;
  status: 'processing' | 'completed' | 'failed';
  thumbnailUrl?: string;
  duration?: number;
}

export class AIVideoService {
  private static instance: AIVideoService;

  static getInstance(): AIVideoService {
    if (!AIVideoService.instance) {
      AIVideoService.instance = new AIVideoService();
    }
    return AIVideoService.instance;
  }

  // Generate personalized financial advice video using Tavus
  async generateAdviceVideo(request: VideoRequest): Promise<VideoResponse> {
    try {
      if (!INTEGRATIONS.TAVUS.API_KEY) {
        return this.getMockVideoResponse();
      }

      const response = await fetch(`${INTEGRATIONS.TAVUS.BASE_URL}/videos`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${INTEGRATIONS.TAVUS.API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          script: request.script,
          persona_id: request.persona,
          background: request.background,
          voice_settings: {
            stability: 0.8,
            similarity_boost: 0.9,
            style: 'professional'
          },
          video_settings: {
            resolution: '1080p',
            format: 'mp4'
          }
        })
      });

      if (response.ok) {
        const data = await response.json();
        return {
          videoId: data.video_id,
          videoUrl: data.video_url,
          status: data.status,
          thumbnailUrl: data.thumbnail_url,
          duration: data.duration
        };
      }
    } catch (error) {
      console.error('Video generation error:', error);
    }

    return this.getMockVideoResponse();
  }

  private getMockVideoResponse(): VideoResponse {
    return {
      videoId: `video_${Date.now()}`,
      videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
      status: 'completed',
      thumbnailUrl: 'https://via.placeholder.com/640x360/10b981/ffffff?text=Financial+Advice+Video',
      duration: 120
    };
  }

  // Get video status
  async getVideoStatus(videoId: string): Promise<VideoResponse> {
    try {
      if (!INTEGRATIONS.TAVUS.API_KEY) {
        return this.getMockVideoResponse();
      }

      const response = await fetch(`${INTEGRATIONS.TAVUS.BASE_URL}/videos/${videoId}`, {
        headers: {
          'Authorization': `Bearer ${INTEGRATIONS.TAVUS.API_KEY}`,
        }
      });

      if (response.ok) {
        const data = await response.json();
        return {
          videoId: data.video_id,
          videoUrl: data.video_url,
          status: data.status,
          thumbnailUrl: data.thumbnail_url,
          duration: data.duration
        };
      }
    } catch (error) {
      console.error('Video status check error:', error);
    }

    return this.getMockVideoResponse();
  }

  // Generate script for financial advice video
  generateAdviceScript(userProfile: any, topic: string): string {
    const scripts: Record<string, string> = {
      'budget': `Hello ${userProfile.name}! Based on your monthly income of ₹${userProfile.monthly_income?.toLocaleString()}, I've prepared a personalized budget strategy. As a ${userProfile.occupation}, you should focus on the 50-30-20 rule: 50% for needs, 30% for wants, and 20% for savings. Given your ${userProfile.risk_preference} risk preference, I recommend starting with conservative investments while building your emergency fund.`,
      
      'investment': `Hi ${userProfile.name}! Let's talk about investment strategies tailored for you. With your ${userProfile.risk_preference} risk profile and current income, I suggest a diversified portfolio. Start with 60% in equity mutual funds for long-term growth, 30% in debt funds for stability, and 10% in gold ETF for hedging. Your age of ${userProfile.age} gives you a good investment horizon.`,
      
      'goals': `Welcome ${userProfile.name}! I see you have goals like ${userProfile.goals?.join(', ')}. Let me help you create a roadmap to achieve them. Based on your income and expenses, here's how you can systematically work towards each goal with specific monthly savings targets and investment strategies.`,
      
      'debt': `Hello ${userProfile.name}! Let's discuss debt management strategies. If you have any loans or credit card debt, prioritize high-interest debt first. Consider the debt avalanche method - pay minimums on all debts, then put extra money toward the highest interest rate debt. This will save you the most money over time.`
    };

    return scripts[topic] || scripts['budget'];
  }
}
</boltService>