export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          name: string
          age: number
          monthly_income: number
          occupation: 'student' | 'professional' | 'homemaker' | 'business-owner'
          goals: string[]
          risk_preference: 'low' | 'medium' | 'high'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          name: string
          age: number
          monthly_income: number
          occupation: 'student' | 'professional' | 'homemaker' | 'business-owner'
          goals?: string[]
          risk_preference?: 'low' | 'medium' | 'high'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          age?: number
          monthly_income?: number
          occupation?: 'student' | 'professional' | 'homemaker' | 'business-owner'
          goals?: string[]
          risk_preference?: 'low' | 'medium' | 'high'
          created_at?: string
          updated_at?: string
        }
      }
      transactions: {
        Row: {
          id: string
          user_id: string
          date: string
          description: string
          amount: number
          category: string
          type: 'income' | 'expense'
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          date?: string
          description: string
          amount: number
          category: string
          type: 'income' | 'expense'
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          date?: string
          description?: string
          amount?: number
          category?: string
          type?: 'income' | 'expense'
          created_at?: string
        }
      }
      financial_goals: {
        Row: {
          id: string
          user_id: string
          name: string
          target_amount: number
          saved_amount: number
          start_date: string
          end_date: string
          category: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          target_amount: number
          saved_amount?: number
          start_date: string
          end_date: string
          category: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          target_amount?: number
          saved_amount?: number
          start_date?: string
          end_date?: string
          category?: string
          created_at?: string
          updated_at?: string
        }
      }
      budget_allocations: {
        Row: {
          id: string
          user_id: string
          expenses: number
          savings: number
          investments: number
          emergency_fund: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          expenses?: number
          savings?: number
          investments?: number
          emergency_fund?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          expenses?: number
          savings?: number
          investments?: number
          emergency_fund?: number
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}