'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  FolderOpen, 
  CheckSquare, 
  Users, 
  DollarSign,
  TrendingUp,
  TrendingDown,
  Activity
} from 'lucide-react';

const stats = [
  {
    title: 'Active Projects',
    value: '12',
    change: '+2 from last month',
    trend: 'up',
    icon: FolderOpen,
    color: 'bg-blue-500',
  },
  {
    title: 'Pending Tasks',
    value: '48',
    change: '-5 from last week',
    trend: 'down',
    icon: CheckSquare,
    color: 'bg-green-500',
  },
  {
    title: 'Total Contacts',
    value: '284',
    change: '+12 from last month',
    trend: 'up',
    icon: Users,
    color: 'bg-purple-500',
  },
  {
    title: 'Revenue Pipeline',
    value: '$324K',
    change: '+8% from last quarter',
    trend: 'up',
    icon: DollarSign,
    color: 'bg-orange-500',
  },
];

export function StatsCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat) => (
        <Card key={stat.title} className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {stat.title}
            </CardTitle>
            <div className={`p-2 rounded-lg ${stat.color}`}>
              <stat.icon className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {stat.value}
            </div>
            <div className="flex items-center space-x-2 mt-2">
              {stat.trend === 'up' ? (
                <TrendingUp className="h-4 w-4 text-green-500" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500" />
              )}
              <span className={`text-sm ${
                stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.change}
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}