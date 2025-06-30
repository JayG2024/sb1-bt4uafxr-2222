import { supabase } from '@/lib/supabase';
import { Database } from '@/lib/supabase';

export type Deal = Database['public']['Tables']['deals']['Row'] & {
  contact?: Database['public']['Tables']['contacts']['Row'];
  assigned_user?: Database['public']['Tables']['users']['Row'];
};

export async function getDeals(): Promise<Deal[]> {
  const { data, error } = await supabase
    .from('deals')
    .select(`
      *,
      contact:contacts(id, company_name, first_name, last_name),
      assigned_user:users!deals_assigned_to_fkey(id, full_name, avatar_url)
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching deals:', error);
    throw error;
  }

  return data || [];
}

export async function getDeal(id: string): Promise<Deal | null> {
  const { data, error } = await supabase
    .from('deals')
    .select(`
      *,
      contact:contacts(id, company_name, first_name, last_name, email, phone),
      assigned_user:users!deals_assigned_to_fkey(id, full_name, avatar_url, email)
    `)
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching deal:', error);
    throw error;
  }

  return data;
}

export async function createDeal(deal: Omit<Database['public']['Tables']['deals']['Insert'], 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('deals')
    .insert([deal])
    .select()
    .single();

  if (error) {
    console.error('Error creating deal:', error);
    throw error;
  }

  return data;
}

export async function updateDeal(id: string, updates: Partial<Database['public']['Tables']['deals']['Update']>) {
  const { data, error } = await supabase
    .from('deals')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating deal:', error);
    throw error;
  }

  return data;
}

export async function deleteDeal(id: string) {
  const { error } = await supabase
    .from('deals')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting deal:', error);
    throw error;
  }
}