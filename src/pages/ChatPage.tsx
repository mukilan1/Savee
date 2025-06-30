import React, { useState } from 'react';
import { ChatMessage } from '../types';
import { suggestedQuestions, getAIResponse } from '../data/mockData';
import { Send, Bot, User, Sparkles, HelpCircle } from 'lucide-react';

const ChatPage: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      message: "Hello! I'm your AI financial assistant. I can help you with budgeting, investments, savings strategies, and answer any money-related questions. How can I assist you today?",
      sender: 'ai',
      timestamp: new Date().toISOString()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = async (message: string) => {
    if (!message.trim()) return;

    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      message: message,
      sender: 'user',
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        message: getAIResponse(message),
        sender: 'ai',
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 2000); // Random delay between 1-3 seconds
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputMessage);
  };

  const handleSuggestedQuestion = (question: string) => {
    sendMessage(question);
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="h-full flex flex-col">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">AI Financial Assistant</h1>
        <p className="text-gray-600">Get personalized financial advice and answers to your money questions</p>
      </div>

      <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col">
        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 max-h-96">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start space-x-3 ${
                message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
              }`}
            >
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0
                ${message.sender === 'ai' 
                  ? 'bg-emerald-100 text-emerald-600' 
                  : 'bg-blue-100 text-blue-600'
                }
              `}>
                {message.sender === 'ai' ? <Bot size={16} /> : <User size={16} />}
              </div>
              
              <div className={`
                max-w-xs lg:max-w-md px-4 py-3 rounded-2xl
                ${message.sender === 'ai'
                  ? 'bg-gray-100 text-gray-900'
                  : 'bg-emerald-600 text-white'
                }
              `}>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.message}</p>
                <p className={`
                  text-xs mt-2 opacity-70
                  ${message.sender === 'ai' ? 'text-gray-500' : 'text-emerald-100'}
                `}>
                  {formatTime(message.timestamp)}
                </p>
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <Bot size={16} />
              </div>
              <div className="bg-gray-100 px-4 py-3 rounded-2xl">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Suggested Questions */}
        {messages.length === 1 && (
          <div className="border-t border-gray-100 p-4">
            <div className="flex items-center space-x-2 mb-3">
              <HelpCircle className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Suggested Questions</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {suggestedQuestions.slice(0, 4).map((question, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestedQuestion(question)}
                  className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition-colors"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Form */}
        <div className="border-t border-gray-100 p-4">
          <form onSubmit={handleSubmit} className="flex space-x-3">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask me anything about your finances..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
              disabled={isTyping}
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || isTyping}
              className={`
                px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2
                ${inputMessage.trim() && !isTyping
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg hover:shadow-xl'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }
              `}
            >
              <Send size={16} />
              <span>Send</span>
            </button>
          </form>
        </div>
      </div>

      {/* AI Features */}
      <div className="mt-6 grid md:grid-cols-3 gap-4">
        <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200">
          <div className="flex items-center space-x-2 mb-2">
            <Sparkles className="h-5 w-5 text-emerald-600" />
            <h3 className="font-semibold text-emerald-800">Smart Analysis</h3>
          </div>
          <p className="text-sm text-emerald-700">
            Get personalized insights based on your spending patterns and financial goals.
          </p>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center space-x-2 mb-2">
            <Bot className="h-5 w-5 text-blue-600" />
            <h3 className="font-semibold text-blue-800">24/7 Support</h3>
          </div>
          <p className="text-sm text-blue-700">
            Available round the clock to answer your financial questions and provide guidance.
          </p>
        </div>

        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <div className="flex items-center space-x-2 mb-2">
            <HelpCircle className="h-5 w-5 text-purple-600" />
            <h3 className="font-semibold text-purple-800">Expert Advice</h3>
          </div>
          <p className="text-sm text-purple-700">
            Receive professional-grade financial advice tailored to your unique situation.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;