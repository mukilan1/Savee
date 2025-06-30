// Integration Configuration
export const INTEGRATIONS = {
  // ElevenLabs AI Voice
  ELEVENLABS: {
    API_KEY: import.meta.env.VITE_ELEVENLABS_API_KEY,
    VOICE_ID: 'pNInz6obpgDQGcFmaJgB', // Adam voice
    BASE_URL: 'https://api.elevenlabs.io/v1'
  },

  // Sentry Error Monitoring
  SENTRY: {
    DSN: import.meta.env.VITE_SENTRY_DSN,
    ENVIRONMENT: import.meta.env.VITE_ENVIRONMENT || 'development'
  },

  // Algorand Blockchain
  ALGORAND: {
    NETWORK: 'testnet',
    NODE_URL: 'https://testnet-api.algonode.cloud',
    INDEXER_URL: 'https://testnet-idx.algonode.cloud'
  },

  // Dappier AI
  DAPPIER: {
    API_KEY: import.meta.env.VITE_DAPPIER_API_KEY,
    BASE_URL: 'https://api.dappier.com/v1'
  },

  // Tavus Video AI
  TAVUS: {
    API_KEY: import.meta.env.VITE_TAVUS_API_KEY,
    BASE_URL: 'https://tavusapi.com/v2'
  },

  // River Financial Data
  RIVER: {
    API_KEY: import.meta.env.VITE_RIVER_API_KEY,
    BASE_URL: 'https://api.river.com/v1'
  }
};

// Feature Flags
export const FEATURES = {
  VOICE_ASSISTANT: true,
  BLOCKCHAIN_WALLET: true,
  AI_VIDEO_ADVISOR: true,
  CRYPTO_TRACKING: true,
  ADVANCED_ANALYTICS: true,
  DOCUMENT_GENERATION: true,
  MULTI_LANGUAGE: true
};