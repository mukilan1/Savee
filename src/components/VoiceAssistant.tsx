import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { VoiceService } from '../services/voiceService';
import { AIService } from '../services/aiService';
import { useProfile } from '../hooks/useProfile';

const VoiceAssistant: React.FC = () => {
  const { profile } = useProfile();
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');

  const voiceService = VoiceService.getInstance();
  const aiService = AIService.getInstance();

  useEffect(() => {
    // Check if browser supports speech recognition
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      console.warn('Speech recognition not supported');
    }
  }, []);

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window)) return;

    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = async (event: any) => {
      const transcript = event.results[0][0].transcript;
      setTranscript(transcript);
      
      // Get AI response
      if (profile) {
        const aiResponse = await aiService.getFinancialAdvice(transcript, profile);
        setResponse(aiResponse.text);
        
        // Speak the response
        setIsSpeaking(true);
        await voiceService.textToSpeech(aiResponse.text);
        setIsSpeaking(false);
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const stopListening = () => {
    setIsListening(false);
  };

  const toggleSpeech = () => {
    if (isSpeaking) {
      voiceService.stopSpeech();
      setIsSpeaking(false);
    } else if (response) {
      setIsSpeaking(true);
      voiceService.textToSpeech(response).then(() => setIsSpeaking(false));
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Voice Assistant</h3>
        <div className="flex space-x-2">
          <button
            onClick={isListening ? stopListening : startListening}
            className={`p-3 rounded-full transition-colors ${
              isListening 
                ? 'bg-red-500 text-white animate-pulse' 
                : 'bg-emerald-500 text-white hover:bg-emerald-600'
            }`}
          >
            {isListening ? <MicOff size={20} /> : <Mic size={20} />}
          </button>
          
          {response && (
            <button
              onClick={toggleSpeech}
              className={`p-3 rounded-full transition-colors ${
                isSpeaking 
                  ? 'bg-blue-500 text-white animate-pulse' 
                  : 'bg-gray-500 text-white hover:bg-gray-600'
              }`}
            >
              {isSpeaking ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
          )}
        </div>
      </div>

      {transcript && (
        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>You said:</strong> {transcript}
          </p>
        </div>
      )}

      {response && (
        <div className="p-3 bg-emerald-50 rounded-lg">
          <p className="text-sm text-emerald-800">
            <strong>AI Response:</strong> {response}
          </p>
        </div>
      )}

      <div className="mt-4 text-xs text-gray-500">
        {isListening ? 'Listening... Speak now' : 'Click the microphone to start voice interaction'}
      </div>
    </div>
  );
};

export default VoiceAssistant;