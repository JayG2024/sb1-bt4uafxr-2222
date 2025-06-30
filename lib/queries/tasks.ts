import { supabase } from '@/lib/supabase';
import { Database } from '@/lib/supabase';

export type Task = Database['public']['Tables']['tasks']['Row'] & {
  project?: Database['public']['Tables']['projects']['Row'];
  assigned_user?: Database['public']['Tables']['users']['Row'];
  created_user?: Database['public']['Tables']['users']['Row'];
};

export async function getTasks(): Promise<Task[]> {
  const { data, error } = await supabase
    .from('tasks')
    .select(`
      *,
      project:projects(id, name),
      assigned_user:users!tasks_assigned_to_fkey(id, full_name, avatar_url),
      created_user:users!tasks_created_by_fkey(id, full_name, avatar_url)
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching tasks:', error);
    throw error;
  }

  return data || [];
}

export async function getTasksByProject(projectId: string): Promise<Task[]> {
  const { data, error } = await supabase
    .from('tasks')
    .select(`
      *,
      project:projects(id, name),
      assigned_user:users!tasks_assigned_to_fkey(id, full_name, avatar_url),
      created_user:users!tasks_created_by_fkey(id, full_name, avatar_url)
    `)
    .eq('project_id', projectId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching project tasks:', error);
    throw error;
  }

  return data || [];
}

export async function createTask(task: Omit<Database['public']['Tables']['tasks']['Insert'], 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('tasks')
    .insert([task])
    .select()
    .single();

  if (error) {
    console.error('Error creating task:', error);
    throw error;
  }

  return data;
}

export async function updateTask(id: string, updates: Partial<Database['public']['Tables']['tasks']['Update']>) {
  const { data, error } = await supabase
    .from('tasks')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating task:', error);
    throw error;
  }

  return data;
}

export async function deleteTask(id: string) {
  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting task:', error);
    throw error;
  }
}