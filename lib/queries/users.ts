import { supabase } from '@/lib/supabase';
import { Database } from '@/lib/supabase';

export type User = Database['public']['Tables']['users']['Row'];

export async function getUsers(): Promise<User[]> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('is_active', true)
    .order('full_name', { ascending: true });

  if (error) {
    console.error('Error fetching users:', error);
    throw error;
  }

  return data || [];
}

export async function getUser(id: string): Promise<User | null> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching user:', error);
    throw error;
  }

  return data;
}

export async function updateUser(id: string, updates: Partial<Database['public']['Tables']['users']['Update']>) {
  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating user:', error);
    throw error;
  }

  return data;
}