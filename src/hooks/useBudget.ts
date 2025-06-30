import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Database } from '../types/database';
import { useAuth } from './useAuth';

type BudgetAllocation = Database['public']['Tables']['budget_allocations']['Row'];
type BudgetInsert = Database['public']['Tables']['budget_allocations']['Insert'];
type BudgetUpdate = Database['public']['Tables']['budget_allocations']['Update'];

export function useBudget() {
  const { user } = useAuth();
  const [budget, setBudget] = useState<BudgetAllocation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchBudget();
    } else {
      setBudget(null);
      setLoading(false);
    }
  }, [user]);

  const fetchBudget = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('budget_allocations')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      setBudget(data);
    } catch (error) {
      console.error('Error fetching budget:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveBudget = async (budgetData: Omit<BudgetInsert, 'user_id'>) => {
    if (!user) throw new Error('No user found');

    try {
      if (budget) {
        // Update existing budget
        const { data, error } = await supabase
          .from('budget_allocations')
          .update(budgetData)
          .eq('user_id', user.id)
          .select()
          .single();

        if (error) throw error;
        setBudget(data);
        return { data, error: null };
      } else {
        // Create new budget
        const { data, error } = await supabase
          .from('budget_allocations')
          .insert({ ...budgetData, user_id: user.id })
          .select()
          .single();

        if (error) throw error;
        setBudget(data);
        return { data, error: null };
      }
    } catch (error) {
      console.error('Error saving budget:', error);
      return { data: null, error };
    }
  };

  return {
    budget,
    loading,
    saveBudget,
    refetch: fetchBudget,
  };
}