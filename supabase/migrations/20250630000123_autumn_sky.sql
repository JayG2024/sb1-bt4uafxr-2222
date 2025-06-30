/*
  # Seed Sample Data for CRM System

  1. Sample Users
  2. Sample Contacts
  3. Sample Projects
  4. Sample Tasks
  5. Sample Deals
  6. Sample Activities
*/

-- Insert sample users
INSERT INTO users (id, email, full_name, role, department) VALUES
  ('00000000-0000-0000-0000-000000000001', 'admin@company.com', 'Admin User', 'admin', 'Management'),
  ('00000000-0000-0000-0000-000000000002', 'manager@company.com', 'Project Manager', 'manager', 'Development'),
  ('00000000-0000-0000-0000-000000000003', 'developer@company.com', 'Senior Developer', 'member', 'Development'),
  ('00000000-0000-0000-0000-000000000004', 'designer@company.com', 'UI/UX Designer', 'member', 'Design'),
  ('00000000-0000-0000-0000-000000000005', 'sales@company.com', 'Sales Representative', 'member', 'Sales')
ON CONFLICT (id) DO NOTHING;

-- Insert sample contacts
INSERT INTO contacts (id, type, company_name, first_name, last_name, email, phone, position, industry, assigned_to) VALUES
  ('10000000-0000-0000-0000-000000000001', 'client', 'TechCorp Inc', 'John', 'Smith', 'john@techcorp.com', '+1-555-0101', 'CTO', 'Technology', '00000000-0000-0000-0000-000000000005'),
  ('10000000-0000-0000-0000-000000000002', 'prospect', 'StartupXYZ', 'Jane', 'Doe', 'jane@startupxyz.com', '+1-555-0102', 'Founder', 'Startup', '00000000-0000-0000-0000-000000000005'),
  ('10000000-0000-0000-0000-000000000003', 'client', 'Enterprise Solutions', 'Bob', 'Johnson', 'bob@enterprise.com', '+1-555-0103', 'IT Director', 'Enterprise', '00000000-0000-0000-0000-000000000005'),
  ('10000000-0000-0000-0000-000000000004', 'prospect', 'Innovation Labs', 'Alice', 'Brown', 'alice@innovationlabs.com', '+1-555-0104', 'Product Manager', 'R&D', '00000000-0000-0000-0000-000000000005')
ON CONFLICT (id) DO NOTHING;

-- Insert sample projects
INSERT INTO projects (id, name, description, status, priority, start_date, due_date, budget, client_id, manager_id, progress) VALUES
  ('20000000-0000-0000-0000-000000000001', 'E-commerce Platform', 'Custom e-commerce solution with AI recommendations', 'active', 'high', '2024-01-15', '2024-06-30', 50000.00, '10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 65),
  ('20000000-0000-0000-0000-000000000002', 'Mobile App Development', 'Cross-platform mobile application', 'active', 'medium', '2024-02-01', '2024-08-15', 35000.00, '10000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000002', 40),
  ('20000000-0000-0000-0000-000000000003', 'Data Analytics Dashboard', 'Real-time analytics and reporting system', 'planning', 'medium', '2024-03-01', '2024-09-30', 25000.00, '10000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000002', 15),
  ('20000000-0000-0000-0000-000000000004', 'AI Chatbot Integration', 'Intelligent customer service chatbot', 'completed', 'low', '2023-10-01', '2024-01-31', 20000.00, '10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 100)
ON CONFLICT (id) DO NOTHING;

-- Insert sample tasks
INSERT INTO tasks (id, title, description, status, priority, project_id, assigned_to, created_by, due_date, estimated_hours) VALUES
  ('30000000-0000-0000-0000-000000000001', 'Database Schema Design', 'Design and implement database schema for e-commerce platform', 'done', 'high', '20000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000002', '2024-02-15 10:00:00', 16),
  ('30000000-0000-0000-0000-000000000002', 'API Development', 'Develop RESTful APIs for product catalog', 'in_progress', 'high', '20000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000002', '2024-03-01 17:00:00', 24),
  ('30000000-0000-0000-0000-000000000003', 'UI/UX Design', 'Create wireframes and mockups for mobile app', 'review', 'medium', '20000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000002', '2024-02-28 12:00:00', 20),
  ('30000000-0000-0000-0000-000000000004', 'Testing Framework Setup', 'Set up automated testing framework', 'todo', 'medium', '20000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000002', '2024-03-15 14:00:00', 12)
ON CONFLICT (id) DO NOTHING;

-- Insert sample deals
INSERT INTO deals (id, title, description, value, stage, probability, contact_id, assigned_to, expected_close_date) VALUES
  ('40000000-0000-0000-0000-000000000001', 'TechCorp Phase 2', 'Expansion of existing e-commerce platform', 75000.00, 'proposal', 70, '10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000005', '2024-04-30'),
  ('40000000-0000-0000-0000-000000000002', 'StartupXYZ MVP', 'Minimum viable product development', 30000.00, 'negotiation', 85, '10000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000005', '2024-03-15'),
  ('40000000-0000-0000-0000-000000000003', 'Enterprise Migration', 'Legacy system migration to cloud', 120000.00, 'qualified', 50, '10000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000005', '2024-07-31'),
  ('40000000-0000-0000-0000-000000000004', 'Innovation Labs Prototype', 'AI-powered prototype development', 45000.00, 'lead', 25, '10000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000005', '2024-05-15')
ON CONFLICT (id) DO NOTHING;

-- Insert sample activities
INSERT INTO activities (id, type, title, content, entity_type, entity_id, user_id) VALUES
  ('50000000-0000-0000-0000-000000000001', 'note', 'Project Kickoff Meeting', 'Initial project meeting with client to discuss requirements and timeline', 'project', '20000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002'),
  ('50000000-0000-0000-0000-000000000002', 'email', 'Follow-up Email Sent', 'Sent follow-up email regarding proposal details', 'deal', '40000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000005'),
  ('50000000-0000-0000-0000-000000000003', 'call', 'Discovery Call', 'Initial discovery call to understand client needs', 'contact', '10000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000005'),
  ('50000000-0000-0000-0000-000000000004', 'task', 'Task Completed', 'Database schema design completed successfully', 'task', '30000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000003')
ON CONFLICT (id) DO NOTHING;

-- Insert project members
INSERT INTO project_members (project_id, user_id, role) VALUES
  ('20000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'lead'),
  ('20000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000003', 'member'),
  ('20000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000004', 'member'),
  ('20000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000002', 'lead'),
  ('20000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000004', 'member'),
  ('20000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000002', 'lead'),
  ('20000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000003', 'member')
ON CONFLICT (project_id, user_id) DO NOTHING;