// Mock authentication for demo purposes
export interface User {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  role: 'admin' | 'manager' | 'member';
  department?: string;
}

// Mock user data
const mockUser: User = {
  id: '00000000-0000-0000-0000-000000000001',
  email: 'demo@company.com',
  full_name: 'Demo User',
  avatar_url: null,
  role: 'admin',
  department: 'Development',
};

export async function signIn(email: string, password: string) {
  // Mock sign in - always succeeds
  return { user: mockUser, profile: mockUser };
}

export async function signUp(email: string, password: string, fullName: string, role: 'admin' | 'manager' | 'member' = 'member') {
  // Mock sign up - always succeeds
  return { user: mockUser };
}

export async function signOut() {
  // Mock sign out - always succeeds
  return;
}

export async function getCurrentUser() {
  // Always return the mock user
  return mockUser;
}