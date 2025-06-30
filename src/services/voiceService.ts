import { INTEGRATIONS } from '../config/integrations';

export class VoiceService {
  private static instance: VoiceService;
  private isPlaying = false;

  static getInstance(): VoiceService {
    if (!VoiceService.instance) {
      VoiceService.instance = new VoiceService();
    }
    return VoiceService.instance;
  }

  async textToSpeech(text: string): Promise<void> {
    if (!INTEGRATIONS.ELEVENLABS.API_KEY) {
      console.warn('ElevenLabs API key not configured');
      return;
    }

    try {
      const response = await fetch(
        `${INTEGRATIONS.ELEVENLABS.BASE_URL}/text-to-speech/${INTEGRATIONS.ELEVENLABS.VOICE_ID}`,
        {
          method: 'POST',
          headers: {
            'Accept': 'audio/mpeg',
            'Content-Type': 'application/json',
            'xi-api-key': INTEGRATIONS.ELEVENLABS.API_KEY
          },
          body: JSON.stringify({
            text,
            model_id: 'eleven_monolingual_v1',
            voice_settings: {
              stability: 0.5,
              similarity_boost: 0.5
            }
          })
        }
      );

      if (response.ok) {
        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        
        this.isPlaying = true;
        audio.onended = () => {
          this.isPlaying = false;
          URL.revokeObjectURL(audioUrl);
        };
        
        await audio.play();
      }
    } catch (error) {
      console.error('Text-to-speech error:', error);
    }
  }

  stopSpeech(): void {
    this.isPlaying = false;
  }

  get isCurrentlyPlaying(): boolean {
    return this.isPlaying;
  }
}