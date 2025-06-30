'use client';

import { useAuth } from '@/hooks/use-auth';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { Loader2 } from 'lucide-react';

export default function Settings() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <div className="md:pl-64">
        <Header />
        <main className="p-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Settings
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Application settings and configuration options coming soon...
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}