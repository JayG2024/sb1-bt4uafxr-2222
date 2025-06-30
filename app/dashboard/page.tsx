'use client';

import { useAuth } from '@/hooks/use-auth';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { StatsCards } from '@/components/dashboard/stats-cards';
import { ProjectOverview } from '@/components/dashboard/project-overview';
import { SalesPipeline } from '@/components/dashboard/sales-pipeline';
import { RecentActivity } from '@/components/dashboard/recent-activity';
import { Loader2 } from 'lucide-react';

export default function Dashboard() {
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
          <StatsCards />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <ProjectOverview />
            <SalesPipeline />
          </div>
          <RecentActivity />
        </main>
      </div>
    </div>
  );
}