import { supabase } from '@/lib/supabase';
import { Database } from '@/lib/supabase';

export type Contact = Database['public']['Tables']['contacts']['Row'] & {
  assigned_user?: Database['public']['Tables']['users']['Row'];
  deals?: Database['public']['Tables']['deals']['Row'][];
};

export async function getContacts(): Promise<Contact[]> {
  const { data, error } = await supabase
    .from('contacts')
    .select(`
      *,
      assigned_user:users!contacts_assigned_to_fkey(id, full_name, avatar_url),
      deals(id, title, value, stage)
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching contacts:', error);
    throw error;
  }

  return data || [];
}

export async function getContact(id: string): Promise<Contact | null> {
  const { data, error } = await supabase
    .from('contacts')
    .select(`
      *,
      assigned_user:users!contacts_assigned_to_fkey(id, full_name, avatar_url, email),
      deals(id, title, value, stage, probability, expected_close_date)
    `)
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching contact:', error);
    throw error;
  }

  return data;
}

export async function createContact(contact: Omit<Database['public']['Tables']['contacts']['Insert'], 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('contacts')
    .insert([contact])
    .select()
    .single();

  if (error) {
    console.error('Error creating contact:', error);
    throw error;
  }

  return data;
}

export async function updateContact(id: string, updates: Partial<Database['public']['Tables']['contacts']['Update']>) {
  const { data, error } = await supabase
    .from('contacts')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating contact:', error);
    throw error;
  }

  return data;
}

export async function deleteContact(id: string) {
  const { error } = await supabase
    .from('contacts')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting contact:', error);
    throw error;
  }
}