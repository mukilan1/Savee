import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Database } from '../types/database';
import { useAuth } from './useAuth';

type Goal = Database['public']['Tables']['financial_goals']['Row'];
type GoalInsert = Database['public']['Tables']['financial_goals']['Insert'];
type GoalUpdate = Database['public']['Tables']['financial_goals']['Update'];

export function useGoals() {
  const { user } = useAuth();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchGoals();
    } else {
      setGoals([]);
      setLoading(false);
    }
  }, [user]);

  const fetchGoals = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('financial_goals')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setGoals(data || []);
    } catch (error) {
      console.error('Error fetching goals:', error);
    } finally {
      setLoading(false);
    }
  };

  const addGoal = async (goal: Omit<GoalInsert, 'user_id'>) => {
    if (!user) throw new Error('No user found');

    try {
      const { data, error } = await supabase
        .from('financial_goals')
        .insert({ ...goal, user_id: user.id })
        .select()
        .single();

      if (error) throw error;

      setGoals(prev => [data, ...prev]);
      return { data, error: null };
    } catch (error) {
      console.error('Error adding goal:', error);
      return { data: null, error };
    }
  };

  const updateGoal = async (id: string, updates: Omit<GoalUpdate, 'user_id'>) => {
    try {
      const { data, error } = await supabase
        .from('financial_goals')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setGoals(prev => prev.map(g => g.id === id ? data : g));
      return { data, error: null };
    } catch (error) {
      console.error('Error updating goal:', error);
      return { data: null, error };
    }
  };

  const deleteGoal = async (id: string) => {
    try {
      const { error } = await supabase
        .from('financial_goals')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setGoals(prev => prev.filter(g => g.id !== id));
      return { error: null };
    } catch (error) {
      console.error('Error deleting goal:', error);
      return { error };
    }
  };

  return {
    goals,
    loading,
    addGoal,
    updateGoal,
    deleteGoal,
    refetch: fetchGoals,
  };
}