import React, { useState } from 'react';
import VoiceAssistant from '../components/VoiceAssistant';
import CryptoTracker from '../components/CryptoTracker';
import BlockchainWallet from '../components/BlockchainWallet';
import DocumentGenerator from '../components/DocumentGenerator';
import { Zap, TrendingUp, Shield, FileText } from 'lucide-react';

const AdvancedPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('voice');

  const tabs = [
    { id: 'voice', label: 'Voice Assistant', icon: Zap },
    { id: 'crypto', label: 'Crypto Tracker', icon: TrendingUp },
    { id: 'blockchain', label: 'Blockchain Wallet', icon: Shield },
    { id: 'documents', label: 'Documents', icon: FileText }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'voice':
        return <VoiceAssistant />;
      case 'crypto':
        return <CryptoTracker />;
      case 'blockchain':
        return <BlockchainWallet />;
      case 'documents':
        return <DocumentGenerator />;
      default:
        return <VoiceAssistant />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Advanced Features</h1>
        <p className="text-gray-600">Powered by cutting-edge AI and blockchain technology</p>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-1">
        <div className="flex space-x-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all duration-200
                  ${activeTab === tab.id
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                  }
                `}
              >
                <Icon size={20} />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="min-h-[600px]">
        {renderTabContent()}
      </div>

      {/* Feature Highlights */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
          <div className="flex items-center space-x-2 mb-2">
            <Zap className="h-5 w-5 text-purple-600" />
            <h3 className="font-semibold text-purple-800">AI Voice</h3>
          </div>
          <p className="text-sm text-purple-700">Natural language financial conversations with ElevenLabs AI voice</p>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg border border-orange-200">
          <div className="flex items-center space-x-2 mb-2">
            <TrendingUp className="h-5 w-5 text-orange-600" />
            <h3 className="font-semibold text-orange-800">Crypto Trading</h3>
          </div>
          <p className="text-sm text-orange-700">Real-time crypto prices and portfolio tracking with River integration</p>
        </div>

        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-4 rounded-lg border border-emerald-200">
          <div className="flex items-center space-x-2 mb-2">
            <Shield className="h-5 w-5 text-emerald-600" />
            <h3 className="font-semibold text-emerald-800">Blockchain Security</h3>
          </div>
          <p className="text-sm text-emerald-700">Decentralized data backup on Algorand blockchain via IPFS</p>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center space-x-2 mb-2">
            <FileText className="h-5 w-5 text-blue-600" />
            <h3 className="font-semibold text-blue-800">Smart Documents</h3>
          </div>
          <p className="text-sm text-blue-700">AI-generated reports with QR verification and blockchain attestation</p>
        </div>
      </div>
    </div>
  );
};

export default AdvancedPage;