import React, { useState } from 'react';
import { FileText, Download, Share, QrCode } from 'lucide-react';
import { DocumentService } from '../services/documentService';
import { useProfile } from '../hooks/useProfile';
import { useTransactions } from '../hooks/useTransactions';
import { useGoals } from '../hooks/useGoals';
import { useBudget } from '../hooks/useBudget';

const DocumentGenerator: React.FC = () => {
  const { profile } = useProfile();
  const { transactions } = useTransactions();
  const { goals } = useGoals();
  const { budget } = useBudget();
  const [generating, setGenerating] = useState(false);

  const documentService = DocumentService.getInstance();

  const generateFinancialReport = async () => {
    if (!profile) return;

    setGenerating(true);
    try {
      const reportBlob = await documentService.generateFinancialReport(profile, transactions, goals);
      
      // Download the PDF
      const url = URL.createObjectURL(reportBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `savee-financial-report-${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Report generation failed:', error);
    } finally {
      setGenerating(false);
    }
  };

  const exportUserData = () => {
    if (!profile) return;

    const dataBlob = documentService.exportUserData(profile, transactions, goals, budget);
    
    // Download the JSON
    const url = URL.createObjectURL(dataBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `savee-data-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const generateInvestmentCertificate = async () => {
    const mockInvestment = {
      amount: 50000,
      type: 'Mutual Fund SIP',
      blockchainHash: 'Qm' + Math.random().toString(36).substring(2, 46)
    };

    setGenerating(true);
    try {
      const certBlob = await documentService.generateInvestmentCertificate(mockInvestment);
      
      const url = URL.createObjectURL(certBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `investment-certificate-${Date.now()}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Certificate generation failed:', error);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="flex items-center space-x-2 mb-6">
        <FileText className="h-5 w-5 text-emerald-600" />
        <h3 className="text-lg font-semibold text-gray-900">Document Generator</h3>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Financial Report */}
        <div className="p-4 border border-gray-200 rounded-lg hover:border-emerald-300 transition-colors">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
              <FileText className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Financial Report</h4>
              <p className="text-sm text-gray-600">Comprehensive financial summary</p>
            </div>
          </div>
          
          <button
            onClick={generateFinancialReport}
            disabled={generating || !profile}
            className="w-full flex items-center justify-center space-x-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50"
          >
            <Download size={16} />
            <span>{generating ? 'Generating...' : 'Generate PDF'}</span>
          </button>
        </div>

        {/* Data Export */}
        <div className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Share className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Data Export</h4>
              <p className="text-sm text-gray-600">Export all your data as JSON</p>
            </div>
          </div>
          
          <button
            onClick={exportUserData}
            disabled={!profile}
            className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <Download size={16} />
            <span>Export JSON</span>
          </button>
        </div>

        {/* Investment Certificate */}
        <div className="p-4 border border-gray-200 rounded-lg hover:border-purple-300 transition-colors">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <QrCode className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Investment Certificate</h4>
              <p className="text-sm text-gray-600">Blockchain-verified certificate</p>
            </div>
          </div>
          
          <button
            onClick={generateInvestmentCertificate}
            disabled={generating}
            className="w-full flex items-center justify-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
          >
            <Download size={16} />
            <span>{generating ? 'Generating...' : 'Generate Certificate'}</span>
          </button>
        </div>

        {/* Tax Report */}
        <div className="p-4 border border-gray-200 rounded-lg hover:border-orange-300 transition-colors">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <FileText className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Tax Report</h4>
              <p className="text-sm text-gray-600">Annual tax summary</p>
            </div>
          </div>
          
          <button
            disabled
            className="w-full flex items-center justify-center space-x-2 bg-gray-300 text-gray-500 px-4 py-2 rounded-lg cursor-not-allowed"
          >
            <Download size={16} />
            <span>Coming Soon</span>
          </button>
        </div>
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-2">Document Features</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• QR codes for document verification</li>
          <li>• Blockchain hash integration for security</li>
          <li>• Professional formatting and branding</li>
          <li>• Automatic data aggregation and analysis</li>
        </ul>
      </div>
    </div>
  );
};

export default DocumentGenerator;