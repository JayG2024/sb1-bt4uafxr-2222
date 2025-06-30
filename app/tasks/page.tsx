'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useTasks } from '@/hooks/use-query';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { TaskBoard } from '@/components/tasks/task-board';
import { TaskForm } from '@/components/tasks/task-form';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Plus, Kanban, List } from 'lucide-react';
import { TaskList } from '@/components/tasks/task-list';

export default function Tasks() {
  const { user, loading } = useAuth();
  const { data: tasks, isLoading, error } = useTasks();
  const [showForm, setShowForm] = useState(false);

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Sidebar />
        <div className="md:pl-64">
          <Header />
          <main className="p-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-8 text-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                Error Loading Tasks
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Unable to load tasks. Please try again later.
              </p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <div className="md:pl-64">
        <Header />
        <main className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                Tasks
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Manage your team's tasks and track progress
              </p>
            </div>
            <Dialog open={showForm} onOpenChange={setShowForm}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  New Task
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create New Task</DialogTitle>
                </DialogHeader>
                <TaskForm onSuccess={() => setShowForm(false)} />
              </DialogContent>
            </Dialog>
          </div>

          <Tabs defaultValue="board" className="space-y-6">
            <TabsList className="grid w-fit grid-cols-2">
              <TabsTrigger value="board" className="flex items-center space-x-2">
                <Kanban className="h-4 w-4" />
                <span>Board</span>
              </TabsTrigger>
              <TabsTrigger value="list" className="flex items-center space-x-2">
                <List className="h-4 w-4" />
                <span>List</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="board" className="space-y-6">
              <TaskBoard tasks={tasks || []} />
            </TabsContent>

            <TabsContent value="list" className="space-y-6">
              <TaskList tasks={tasks || []} />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}