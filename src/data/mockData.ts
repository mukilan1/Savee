import { Transaction, Goal } from '../types';

export const mockTransactions: Transaction[] = [
  {
    id: '1',
    date: '2024-01-15',
    description: 'Salary Credit',
    amount: 75000,
    category: 'Salary',
    type: 'income'
  },
  {
    id: '2',
    date: '2024-01-14',
    description: 'Grocery Shopping',
    amount: -2500,
    category: 'Food',
    type: 'expense'
  },
  {
    id: '3',
    date: '2024-01-13',
    description: 'Uber Ride',
    amount: -350,
    category: 'Transportation',
    type: 'expense'
  },
  {
    id: '4',
    date: '2024-01-12',
    description: 'Netflix Subscription',
    amount: -499,
    category: 'Entertainment',
    type: 'expense'
  },
  {
    id: '5',
    date: '2024-01-11',
    description: 'Investment SIP',
    amount: -10000,
    category: 'Investment',
    type: 'expense'
  },
  {
    id: '6',
    date: '2024-01-10',
    description: 'Freelance Project',
    amount: 15000,
    category: 'Freelance',
    type: 'income'
  }
];

export const mockGoals: Goal[] = [
  {
    id: '1',
    name: 'Emergency Fund',
    targetAmount: 200000,
    savedAmount: 85000,
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    category: 'Emergency'
  },
  {
    id: '2',
    name: 'MacBook Pro',
    targetAmount: 180000,
    savedAmount: 45000,
    startDate: '2024-01-01',
    endDate: '2024-06-30',
    category: 'Technology'
  },
  {
    id: '3',
    name: 'Europe Trip',
    targetAmount: 300000,
    savedAmount: 120000,
    startDate: '2024-01-01',
    endDate: '2024-11-30',
    category: 'Travel'
  },
  {
    id: '4',
    name: 'Car Down Payment',
    targetAmount: 150000,
    savedAmount: 65000,
    startDate: '2024-02-01',
    endDate: '2024-08-31',
    category: 'Vehicle'
  }
];

export const suggestedQuestions = [
  "Can I afford a new phone?",
  "How do I close my loan early?",
  "Suggest a ₹5,000 investment plan",
  "What's my spending pattern this month?",
  "Should I increase my SIP amount?",
  "How to build an emergency fund?",
  "Best tax-saving options for me?"
];

export const getAIResponse = (question: string): string => {
  const responses: Record<string, string> = {
    "Can I afford a new phone?": "Based on your current budget, you can afford a phone up to ₹25,000 without affecting your savings goals. Consider phones in the ₹15,000-20,000 range for better financial balance.",
    "How do I close my loan early?": "To close your loan early, increase your EMI by 20-30% or make lump sum payments during bonus months. This could save you ₹50,000+ in interest over the loan tenure.",
    "Suggest a ₹5,000 investment plan": "For ₹5,000/month: 60% in diversified equity mutual funds (₹3,000), 30% in debt funds (₹1,500), and 10% in gold ETF (₹500). This balanced approach suits your risk profile.",
    "What's my spending pattern this month?": "Your spending this month: Food (35%), Transportation (20%), Entertainment (15%), Shopping (20%), Others (10%). You're spending 15% more on food than recommended.",
    "Should I increase my SIP amount?": "Yes! With your current income growth, increasing SIP by ₹2,000 could help you reach your goals 2 years earlier. Your emergency fund is strong enough to support this increase.",
    "How to build an emergency fund?": "Aim for 6-12 months of expenses (₹3-6 lakhs). Start with ₹10,000/month in liquid funds or high-yield savings. You're already 42% there - great progress!",
    "Best tax-saving options for me?": "For your income bracket: ELSS mutual funds (₹1.5L), PPF (₹1.5L), NPS (₹50K), and health insurance premium (₹25K). This saves ₹1.17L in taxes annually."
  };

  return responses[question] || "That's a great question! Based on your financial profile, I'd recommend consulting with a financial advisor for personalized advice on this topic.";
};