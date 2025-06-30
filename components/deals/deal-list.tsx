'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DealForm } from './deal-form';
import { 
  DollarSign, 
  Calendar, 
  User,
  MoreHorizontal,
  Edit,
  Trash2,
  TrendingUp
} from 'lucide-react';
import { format } from 'date-fns';
import { useDeleteDeal } from '@/hooks/use-query';
import { Deal } from '@/lib/queries/deals';

interface DealListProps {
  deals: Deal[];
}

const stageColors = {
  lead: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
  qualified: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  proposal: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  negotiation: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
  closed_won: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  closed_lost: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
};

export function DealList({ deals }: DealListProps) {
  const [editingDeal, setEditingDeal] = useState<Deal | null>(null);
  const deleteDeal = useDeleteDeal();

  const handleDelete = async (dealId: string) => {
    if (confirm('Are you sure you want to delete this deal?')) {
      await deleteDeal.mutateAsync(dealId);
    }
  };

  if (deals.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="text-gray-500 dark:text-gray-400">
            <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-semibold mb-2">No deals yet</h3>
            <p>Create your first deal to start tracking your sales pipeline.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const totalValue = deals.reduce((sum, deal) => sum + deal.value, 0);
  const weightedValue = deals.reduce((sum, deal) => sum + (deal.value * deal.probability / 100), 0);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Total Pipeline Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              ${totalValue.toLocaleString()}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Weighted Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ${weightedValue.toLocaleString()}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Active Deals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {deals.filter(d => !['closed_won', 'closed_lost'].includes(d.stage)).length}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {deals.map((deal) => (
          <Card key={deal.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg mb-2">{deal.title}</CardTitle>
                  <Badge className={stageColors[deal.stage as keyof typeof stageColors]}>
                    {deal.stage.replace('_', ' ')}
                  </Badge>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-1 font-bold text-green-600">
                    <DollarSign className="h-5 w-5" />
                    <span className="text-xl">{deal.value.toLocaleString()}</span>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="mt-1">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setEditingDeal(deal)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleDelete(deal.id)}
                        className="text-red-600 dark:text-red-400"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {deal.description && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  {deal.description}
                </p>
              )}
              
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Probability</span>
                  <span className="font-medium">{deal.probability}%</span>
                </div>
                <Progress value={deal.probability} className="h-2" />
                
                <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                  {deal.expected_close_date && (
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>
                        Expected close: {format(new Date(deal.expected_close_date), 'MMM dd, yyyy')}
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="text-sm">
                    {deal.contact && (
                      <span className="text-gray-600 dark:text-gray-400">
                        {deal.contact.company_name || 
                         `${deal.contact.first_name} ${deal.contact.last_name}`}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    {deal.assigned_user && (
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={deal.assigned_user.avatar_url || ''} />
                          <AvatarFallback className="text-xs">
                            {deal.assigned_user.full_name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {deal.assigned_user.full_name}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={!!editingDeal} onOpenChange={() => setEditingDeal(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Deal</DialogTitle>
          </DialogHeader>
          {editingDeal && (
            <DealForm 
              deal={editingDeal}
              onSuccess={() => setEditingDeal(null)} 
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}