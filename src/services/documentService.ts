import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import QRCode from 'qrcode';

export class DocumentService {
  private static instance: DocumentService;

  static getInstance(): DocumentService {
    if (!DocumentService.instance) {
      DocumentService.instance = new DocumentService();
    }
    return DocumentService.instance;
  }

  // Generate financial report PDF
  async generateFinancialReport(userData: any, transactions: any[], goals: any[]): Promise<Blob> {
    const pdf = new jsPDF();
    
    // Header
    pdf.setFontSize(20);
    pdf.text('Savee Financial Report', 20, 30);
    
    // User Info
    pdf.setFontSize(12);
    pdf.text(`Name: ${userData.name}`, 20, 50);
    pdf.text(`Monthly Income: ₹${userData.monthly_income?.toLocaleString()}`, 20, 60);
    pdf.text(`Occupation: ${userData.occupation}`, 20, 70);
    
    // Financial Summary
    const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = Math.abs(transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0));
    
    pdf.text('Financial Summary:', 20, 90);
    pdf.text(`Total Income: ₹${totalIncome.toLocaleString()}`, 30, 100);
    pdf.text(`Total Expenses: ₹${totalExpenses.toLocaleString()}`, 30, 110);
    pdf.text(`Net Savings: ₹${(totalIncome - totalExpenses).toLocaleString()}`, 30, 120);
    
    // Goals Progress
    pdf.text('Goals Progress:', 20, 140);
    goals.forEach((goal, index) => {
      const progress = (goal.saved_amount / goal.target_amount) * 100;
      pdf.text(`${goal.name}: ${progress.toFixed(1)}% complete`, 30, 150 + (index * 10));
    });
    
    // Generate QR code for report verification
    const qrCodeData = await QRCode.toDataURL(`savee-report-${Date.now()}`);
    pdf.addImage(qrCodeData, 'PNG', 150, 160, 40, 40);
    pdf.text('Scan for verification', 150, 210);
    
    return pdf.output('blob');
  }

  // Generate investment certificate
  async generateInvestmentCertificate(investment: any): Promise<Blob> {
    const pdf = new jsPDF();
    
    pdf.setFontSize(24);
    pdf.text('Investment Certificate', 60, 40);
    
    pdf.setFontSize(14);
    pdf.text(`This certifies that the investment of ₹${investment.amount.toLocaleString()}`, 20, 80);
    pdf.text(`in ${investment.type} has been recorded on ${new Date().toLocaleDateString()}`, 20, 100);
    
    // Add blockchain hash for verification
    pdf.text(`Blockchain Hash: ${investment.blockchainHash || 'N/A'}`, 20, 140);
    
    return pdf.output('blob');
  }

  // Export data as JSON
  exportUserData(userData: any, transactions: any[], goals: any[], budget: any): Blob {
    const exportData = {
      user: userData,
      transactions,
      goals,
      budget,
      exportDate: new Date().toISOString(),
      version: '1.0'
    };
    
    return new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
  }
}