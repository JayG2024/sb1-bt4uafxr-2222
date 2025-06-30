'use client';

import { useState, useEffect, createContext, useContext } from 'react';

// Mock user for direct access
const mockUser = {
  id: '00000000-0000-0000-0000-000000000001',
  email: 'demo@company.com',
  full_name: 'Demo User',
  avatar_url: null,
  role: 'admin' as const,
  department: 'Development',
  is_active: true,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

interface AuthContextType {
  user: typeof mockUser | null;
  loading: boolean;
  refetch: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<typeof mockUser | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    // Simulate loading time
    await new Promise(resolve => setTimeout(resolve, 500));
    setUser(mockUser);
    setLoading(false);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const refetch = async () => {
    setLoading(true);
    await fetchUser();
  };

  return (
    <AuthContext.Provider value={{ user, loading, refetch }}>
      {children}
    </AuthContext.Provider>
  );
}