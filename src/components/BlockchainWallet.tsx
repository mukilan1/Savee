import React, { useState, useEffect } from 'react';
import { Wallet, Shield, Copy, Download, Upload } from 'lucide-react';
import { BlockchainService } from '../services/blockchainService';
import { useProfile } from '../hooks/useProfile';
import { useTransactions } from '../hooks/useTransactions';
import { useGoals } from '../hooks/useGoals';

const BlockchainWallet: React.FC = () => {
  const { profile } = useProfile();
  const { transactions } = useTransactions();
  const { goals } = useGoals();
  const [wallet, setWallet] = useState<{ address: string; privateKey: string } | null>(null);
  const [balance, setBalance] = useState(0);
  const [backupHash, setBackupHash] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const blockchainService = BlockchainService.getInstance();

  useEffect(() => {
    loadWallet();
  }, []);

  const loadWallet = () => {
    const savedWallet = localStorage.getItem('blockchain_wallet');
    if (savedWallet) {
      const walletData = JSON.parse(savedWallet);
      setWallet(walletData);
      loadBalance(walletData.address);
    }
  };

  const loadBalance = async (address: string) => {
    try {
      const balance = await blockchainService.getWalletBalance(address);
      setBalance(balance);
    } catch (error) {
      console.error('Failed to load balance:', error);
    }
  };

  const createWallet = () => {
    const newWallet = blockchainService.generateWallet();
    setWallet(newWallet);
    localStorage.setItem('blockchain_wallet', JSON.stringify(newWallet));
    loadBalance(newWallet.address);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  const createBackup = async () => {
    if (!profile || !wallet) return;

    setLoading(true);
    try {
      const financialData = {
        profile,
        transactions,
        goals,
        wallet: { address: wallet.address } // Don't backup private key
      };

      const hash = await blockchainService.createFinancialBackup(profile.id, financialData);
      setBackupHash(hash);
    } catch (error) {
      console.error('Backup creation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const restoreFromBackup = async (hash: string) => {
    try {
      const data = await blockchainService.retrieveFromIPFS(hash);
      if (data) {
        console.log('Backup data retrieved:', data);
        // In a real app, you would restore the data to the database
      }
    } catch (error) {
      console.error('Restore failed:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Wallet Overview */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Blockchain Wallet</h3>
          <Wallet className="h-6 w-6 text-emerald-600" />
        </div>

        {wallet ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Wallet Address
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={wallet.address}
                  readOnly
                  className="flex-1 px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm font-mono"
                />
                <button
                  onClick={() => copyToClipboard(wallet.address)}
                  className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <Copy size={16} />
                </button>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Balance
                </label>
                <p className="text-2xl font-bold text-emerald-600">
                  {balance.toFixed(4)} ALGO
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  USD Value
                </label>
                <p className="text-2xl font-bold text-gray-900">
                  ${(balance * 0.3).toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <Wallet className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">No Wallet Found</h4>
            <p className="text-gray-600 mb-4">Create a secure blockchain wallet to backup your financial data</p>
            <button
              onClick={createWallet}
              className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
            >
              Create Wallet
            </button>
          </div>
        )}
      </div>

      {/* Backup & Security */}
      {wallet && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center space-x-2 mb-4">
            <Shield className="h-5 w-5 text-emerald-600" />
            <h3 className="text-lg font-semibold text-gray-900">Data Backup & Security</h3>
          </div>

          <div className="space-y-4">
            <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200">
              <h4 className="font-medium text-emerald-800 mb-2">Decentralized Backup</h4>
              <p className="text-sm text-emerald-700 mb-3">
                Your financial data is encrypted and stored on IPFS for maximum security and availability.
              </p>
              
              <div className="flex space-x-3">
                <button
                  onClick={createBackup}
                  disabled={loading}
                  className="flex items-center space-x-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50"
                >
                  <Upload size={16} />
                  <span>{loading ? 'Creating...' : 'Create Backup'}</span>
                </button>
                
                {backupHash && (
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-emerald-700">Backup Hash:</span>
                    <code className="text-xs bg-white px-2 py-1 rounded border font-mono">
                      {backupHash.substring(0, 20)}...
                    </code>
                    <button
                      onClick={() => copyToClipboard(backupHash)}
                      className="p-1 text-emerald-600 hover:text-emerald-700"
                    >
                      <Copy size={14} />
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h4 className="font-medium text-blue-800 mb-2">Restore from Backup</h4>
              <p className="text-sm text-blue-700 mb-3">
                Enter your backup hash to restore your financial data from IPFS.
              </p>
              
              <div className="flex space-x-3">
                <input
                  type="text"
                  placeholder="Enter backup hash (Qm...)"
                  className="flex-1 px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      const hash = (e.target as HTMLInputElement).value;
                      if (hash) restoreFromBackup(hash);
                    }
                  }}
                />
                <button
                  onClick={() => {
                    const input = document.querySelector('input[placeholder*="backup hash"]') as HTMLInputElement;
                    if (input?.value) restoreFromBackup(input.value);
                  }}
                  className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Download size={16} />
                  <span>Restore</span>
                </button>
              </div>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <h4 className="font-medium text-yellow-800 mb-2">⚠️ Security Notice</h4>
              <p className="text-sm text-yellow-700">
                Your private key is stored locally and never transmitted. Keep it safe and never share it with anyone.
                If you lose your private key, you won't be able to access your wallet.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlockchainWallet;