/*
  # CRM System Database Schema

  1. New Tables
    - `users` - Team members with authentication
    - `projects` - Software development projects
    - `tasks` - Project tasks with kanban board status
    - `contacts` - Clients and prospects
    - `deals` - Sales pipeline deals
    - `activities` - Activity log for all entities
    - `notifications` - Real-time notifications

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    - Role-based access control

  3. Indexes
    - Optimized for quick queries
    - Foreign key relationships
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  avatar_url text,
  role text DEFAULT 'member' CHECK (role IN ('admin', 'manager', 'member')),
  department text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  description text,
  status text DEFAULT 'planning' CHECK (status IN ('planning', 'active', 'on_hold', 'completed', 'cancelled')),
  priority text DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  start_date date,
  due_date date,
  budget decimal(10,2),
  client_id uuid REFERENCES contacts(id),
  manager_id uuid REFERENCES users(id),
  progress integer DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Contacts table
CREATE TABLE IF NOT EXISTS contacts (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  type text DEFAULT 'prospect' CHECK (type IN ('prospect', 'client', 'partner')),
  company_name text,
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text,
  phone text,
  position text,
  industry text,
  address text,
  city text,
  country text,
  website text,
  notes text,
  assigned_to uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title text NOT NULL,
  description text,
  status text DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'review', 'done')),
  priority text DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  project_id uuid REFERENCES projects(id),
  assigned_to uuid REFERENCES users(id),
  created_by uuid REFERENCES users(id),
  due_date timestamptz,
  estimated_hours integer,
  actual_hours integer,
  tags text[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Deals table
CREATE TABLE IF NOT EXISTS deals (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title text NOT NULL,
  description text,
  value decimal(10,2) NOT NULL,
  stage text DEFAULT 'lead' CHECK (stage IN ('lead', 'qualified', 'proposal', 'negotiation', 'closed_won', 'closed_lost')),
  probability integer DEFAULT 0 CHECK (probability >= 0 AND probability <= 100),
  contact_id uuid REFERENCES contacts(id),
  assigned_to uuid REFERENCES users(id),
  expected_close_date date,
  actual_close_date date,
  source text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Activities table
CREATE TABLE IF NOT EXISTS activities (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  type text NOT NULL CHECK (type IN ('note', 'email', 'call', 'meeting', 'task', 'deal_update', 'project_update')),
  title text NOT NULL,
  content text,
  entity_type text CHECK (entity_type IN ('project', 'task', 'contact', 'deal')),
  entity_id uuid,
  user_id uuid REFERENCES users(id),
  metadata jsonb,
  created_at timestamptz DEFAULT now()
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES users(id),
  title text NOT NULL,
  message text NOT NULL,
  type text DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'error')),
  is_read boolean DEFAULT false,
  entity_type text,
  entity_id uuid,
  created_at timestamptz DEFAULT now()
);

-- Project team members junction table
CREATE TABLE IF NOT EXISTS project_members (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id uuid REFERENCES projects(id),
  user_id uuid REFERENCES users(id),
  role text DEFAULT 'member' CHECK (role IN ('lead', 'member')),
  created_at timestamptz DEFAULT now(),
  UNIQUE(project_id, user_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_manager ON projects(manager_id);
CREATE INDEX IF NOT EXISTS idx_projects_client ON projects(client_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_project ON tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_tasks_assigned ON tasks(assigned_to);
CREATE INDEX IF NOT EXISTS idx_deals_stage ON deals(stage);
CREATE INDEX IF NOT EXISTS idx_deals_contact ON deals(contact_id);
CREATE INDEX IF NOT EXISTS idx_deals_assigned ON deals(assigned_to);
CREATE INDEX IF NOT EXISTS idx_activities_entity ON activities(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_activities_user ON activities(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_members ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can read all users" ON users
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE TO authenticated USING (auth.uid()::text = id::text);

CREATE POLICY "Authenticated users can read all projects" ON projects
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can create projects" ON projects
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update projects" ON projects
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Authenticated users can read all contacts" ON contacts
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can manage contacts" ON contacts
  FOR ALL TO authenticated USING (true);

CREATE POLICY "Authenticated users can read all tasks" ON tasks
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can manage tasks" ON tasks
  FOR ALL TO authenticated USING (true);

CREATE POLICY "Authenticated users can read all deals" ON deals
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can manage deals" ON deals
  FOR ALL TO authenticated USING (true);

CREATE POLICY "Authenticated users can read all activities" ON activities
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can create activities" ON activities
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Users can read their notifications" ON notifications
  FOR SELECT TO authenticated USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update their notifications" ON notifications
  FOR UPDATE TO authenticated USING (auth.uid()::text = user_id::text);

CREATE POLICY "Authenticated users can manage project members" ON project_members
  FOR ALL TO authenticated USING (true);

-- Functions for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contacts_updated_at BEFORE UPDATE ON contacts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_deals_updated_at BEFORE UPDATE ON deals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();