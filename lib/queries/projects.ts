import { supabase } from '@/lib/supabase';
import { Database } from '@/lib/supabase';

export type Project = Database['public']['Tables']['projects']['Row'] & {
  client?: Database['public']['Tables']['contacts']['Row'];
  manager?: Database['public']['Tables']['users']['Row'];
  tasks?: Database['public']['Tables']['tasks']['Row'][];
  members?: Database['public']['Tables']['users']['Row'][];
};

export async function getProjects(): Promise<Project[]> {
  const { data, error } = await supabase
    .from('projects')
    .select(`
      *,
      client:contacts(id, company_name, first_name, last_name),
      manager:users!projects_manager_id_fkey(id, full_name, avatar_url),
      tasks(id, title, status),
      members:project_members(
        user:users(id, full_name, avatar_url)
      )
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching projects:', error);
    throw error;
  }

  return data || [];
}

export async function getProject(id: string): Promise<Project | null> {
  const { data, error } = await supabase
    .from('projects')
    .select(`
      *,
      client:contacts(id, company_name, first_name, last_name, email, phone),
      manager:users!projects_manager_id_fkey(id, full_name, avatar_url, email),
      tasks(id, title, status, priority, assigned_to, due_date),
      members:project_members(
        user:users(id, full_name, avatar_url, email)
      )
    `)
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching project:', error);
    throw error;
  }

  return data;
}

export async function createProject(project: Omit<Database['public']['Tables']['projects']['Insert'], 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('projects')
    .insert([project])
    .select()
    .single();

  if (error) {
    console.error('Error creating project:', error);
    throw error;
  }

  return data;
}

export async function updateProject(id: string, updates: Partial<Database['public']['Tables']['projects']['Update']>) {
  const { data, error } = await supabase
    .from('projects')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating project:', error);
    throw error;
  }

  return data;
}

export async function deleteProject(id: string) {
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting project:', error);
    throw error;
  }
}