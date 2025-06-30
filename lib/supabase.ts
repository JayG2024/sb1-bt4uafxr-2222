import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Validate environment variables
if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Supabase configuration error:');
  console.error('Missing environment variables. Please check your .env.local file.');
  console.error('Required environment variables:');
  console.error('- NEXT_PUBLIC_SUPABASE_URL');
  console.error('- NEXT_PUBLIC_SUPABASE_ANON_KEY');
  
  // Create a dummy client to prevent the app from crashing
  throw new Error('Supabase not configured. Please check your environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          avatar_url: string | null;
          role: 'admin' | 'manager' | 'member';
          department: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          full_name: string;
          avatar_url?: string | null;
          role?: 'admin' | 'manager' | 'member';
          department?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string;
          avatar_url?: string | null;
          role?: 'admin' | 'manager' | 'member';
          department?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      projects: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          status: 'planning' | 'active' | 'on_hold' | 'completed' | 'cancelled';
          priority: 'low' | 'medium' | 'high' | 'urgent';
          start_date: string | null;
          due_date: string | null;
          budget: number | null;
          client_id: string | null;
          manager_id: string | null;
          progress: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          status?: 'planning' | 'active' | 'on_hold' | 'completed' | 'cancelled';
          priority?: 'low' | 'medium' | 'high' | 'urgent';
          start_date?: string | null;
          due_date?: string | null;
          budget?: number | null;
          client_id?: string | null;
          manager_id?: string | null;
          progress?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          status?: 'planning' | 'active' | 'on_hold' | 'completed' | 'cancelled';
          priority?: 'low' | 'medium' | 'high' | 'urgent';
          start_date?: string | null;
          due_date?: string | null;
          budget?: number | null;
          client_id?: string | null;
          manager_id?: string | null;
          progress?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      contacts: {
        Row: {
          id: string;
          type: 'prospect' | 'client' | 'partner';
          company_name: string | null;
          first_name: string;
          last_name: string;
          email: string | null;
          phone: string | null;
          position: string | null;
          industry: string | null;
          address: string | null;
          city: string | null;
          country: string | null;
          website: string | null;
          notes: string | null;
          assigned_to: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          type?: 'prospect' | 'client' | 'partner';
          company_name?: string | null;
          first_name: string;
          last_name: string;
          email?: string | null;
          phone?: string | null;
          position?: string | null;
          industry?: string | null;
          address?: string | null;
          city?: string | null;
          country?: string | null;
          website?: string | null;
          notes?: string | null;
          assigned_to?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          type?: 'prospect' | 'client' | 'partner';
          company_name?: string | null;
          first_name?: string;
          last_name?: string;
          email?: string | null;
          phone?: string | null;
          position?: string | null;
          industry?: string | null;
          address?: string | null;
          city?: string | null;
          country?: string | null;
          website?: string | null;
          notes?: string | null;
          assigned_to?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      tasks: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          status: 'todo' | 'in_progress' | 'review' | 'done';
          priority: 'low' | 'medium' | 'high' | 'urgent';
          project_id: string | null;
          assigned_to: string | null;
          created_by: string | null;
          due_date: string | null;
          estimated_hours: number | null;
          actual_hours: number | null;
          tags: string[] | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          status?: 'todo' | 'in_progress' | 'review' | 'done';
          priority?: 'low' | 'medium' | 'high' | 'urgent';
          project_id?: string | null;
          assigned_to?: string | null;
          created_by?: string | null;
          due_date?: string | null;
          estimated_hours?: number | null;
          actual_hours?: number | null;
          tags?: string[] | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          status?: 'todo' | 'in_progress' | 'review' | 'done';
          priority?: 'low' | 'medium' | 'high' | 'urgent';
          project_id?: string | null;
          assigned_to?: string | null;
          created_by?: string | null;
          due_date?: string | null;
          estimated_hours?: number | null;
          actual_hours?: number | null;
          tags?: string[] | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      deals: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          value: number;
          stage: 'lead' | 'qualified' | 'proposal' | 'negotiation' | 'closed_won' | 'closed_lost';
          probability: number;
          contact_id: string | null;
          assigned_to: string | null;
          expected_close_date: string | null;
          actual_close_date: string | null;
          source: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          value: number;
          stage?: 'lead' | 'qualified' | 'proposal' | 'negotiation' | 'closed_won' | 'closed_lost';
          probability?: number;
          contact_id?: string | null;
          assigned_to?: string | null;
          expected_close_date?: string | null;
          actual_close_date?: string | null;
          source?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          value?: number;
          stage?: 'lead' | 'qualified' | 'proposal' | 'negotiation' | 'closed_won' | 'closed_lost';
          probability?: number;
          contact_id?: string | null;
          assigned_to?: string | null;
          expected_close_date?: string | null;
          actual_close_date?: string | null;
          source?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      activities: {
        Row: {
          id: string;
          type: 'note' | 'email' | 'call' | 'meeting' | 'task' | 'deal_update' | 'project_update';
          title: string;
          content: string | null;
          entity_type: 'project' | 'task' | 'contact' | 'deal' | null;
          entity_id: string | null;
          user_id: string | null;
          metadata: any | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          type: 'note' | 'email' | 'call' | 'meeting' | 'task' | 'deal_update' | 'project_update';
          title: string;
          content?: string | null;
          entity_type?: 'project' | 'task' | 'contact' | 'deal' | null;
          entity_id?: string | null;
          user_id?: string | null;
          metadata?: any | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          type?: 'note' | 'email' | 'call' | 'meeting' | 'task' | 'deal_update' | 'project_update';
          title?: string;
          content?: string | null;
          entity_type?: 'project' | 'task' | 'contact' | 'deal' | null;
          entity_id?: string | null;
          user_id?: string | null;
          metadata?: any | null;
          created_at?: string;
        };
      };
    };
  };
};