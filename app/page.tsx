'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Loader2 } from 'lucide-react';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Loading DevCRM...</p>
        </div>
      </div>
    );
  }

  // Redirect to dashboard immediately
  if (user) {
    router.push('/dashboard');
    return null;
  }

  // Fallback - should not reach here with mock auth
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to DevCRM</h1>
        <p className="text-gray-600 text-lg">Redirecting to dashboard...</p>
      </div>
    </div>
  );
}