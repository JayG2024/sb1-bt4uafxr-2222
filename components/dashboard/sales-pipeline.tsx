'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { DollarSign, TrendingUp } from 'lucide-react';

const deals = [
  {
    id: 1,
    title: 'TechCorp Phase 2',
    value: 75000,
    stage: 'proposal',
    probability: 70,
    company: 'TechCorp Inc',
    closeDate: '2024-04-30',
  },
  {
    id: 2,
    title: 'StartupXYZ MVP',
    value: 30000,
    stage: 'negotiation',
    probability: 85,
    company: 'StartupXYZ',
    closeDate: '2024-03-15',
  },
  {
    id: 3,
    title: 'Enterprise Migration',
    value: 120000,
    stage: 'qualified',
    probability: 50,
    company: 'Enterprise Solutions',
    closeDate: '2024-07-31',
  },
  {
    id: 4,
    title: 'Innovation Labs Prototype',
    value: 45000,
    stage: 'lead',
    probability: 25,
    company: 'Innovation Labs',
    closeDate: '2024-05-15',
  },
];

const stageColors = {
  lead: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
  qualified: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  proposal: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  negotiation: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
  closed_won: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  closed_lost: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
};

export function SalesPipeline() {
  const totalValue = deals.reduce((sum, deal) => sum + deal.value, 0);
  const weightedValue = deals.reduce((sum, deal) => sum + (deal.value * deal.probability / 100), 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Sales Pipeline</span>
          <div className="flex items-center space-x-2 text-sm">
            <TrendingUp className="h-4 w-4 text-green-500" />
            <span className="text-green-600">${weightedValue.toLocaleString()} weighted</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Total Pipeline Value</span>
            <span className="text-lg font-bold">${totalValue.toLocaleString()}</span>
          </div>
          <Progress value={Math.round((weightedValue / totalValue) * 100)} className="h-2" />
        </div>

        <div className="space-y-4">
          {deals.map((deal) => (
            <div key={deal.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                    {deal.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {deal.company}
                  </p>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-1 font-bold text-green-600">
                    <DollarSign className="h-4 w-4" />
                    <span>{deal.value.toLocaleString()}</span>
                  </div>
                  <p className="text-xs text-gray-500">
                    Close: {new Date(deal.closeDate).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Badge className={stageColors[deal.stage as keyof typeof stageColors]}>
                  {deal.stage.replace('_', ' ')}
                </Badge>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {deal.probability}%
                  </span>
                  <div className="w-16">
                    <Progress value={deal.probability} className="h-1" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}