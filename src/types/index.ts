export interface User {
  name: string;
  age: number;
  monthlyIncome: number;
  occupation: 'student' | 'professional' | 'homemaker' | 'business-owner';
  goals: string[];
  riskPreference: 'low' | 'medium' | 'high';
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  category: string;
  type: 'income' | 'expense';
}

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  savedAmount: number;
  startDate: string;
  endDate: string;
  category: string;
}

export interface BudgetAllocation {
  expenses: number;
  savings: number;
  investments: number;
  emergencyFund: number;
}

export interface ChatMessage {
  id: string;
  message: string;
  sender: 'user' | 'ai';
  timestamp: string;
}