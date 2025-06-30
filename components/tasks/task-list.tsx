'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { TaskForm } from './task-form';
import { 
  Calendar, 
  Clock, 
  MoreHorizontal,
  Edit,
  Trash2,
  CheckSquare
} from 'lucide-react';
import { format } from 'date-fns';
import { useDeleteTask } from '@/hooks/use-query';
import { Task } from '@/lib/queries/tasks';

interface TaskListProps {
  tasks: Task[];
}

const statusColors = {
  todo: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
  in_progress: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  review: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  done: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
};

const priorityColors = {
  low: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
  medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  high: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
  urgent: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
};

export function TaskList({ tasks }: TaskListProps) {
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const deleteTask = useDeleteTask();

  const handleDelete = async (taskId: string) => {
    if (confirm('Are you sure you want to delete this task?')) {
      await deleteTask.mutateAsync(taskId);
    }
  };

  if (tasks.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="text-gray-500 dark:text-gray-400">
            <CheckSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-semibold mb-2">No tasks yet</h3>
            <p>Create your first task to get started with task management.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {tasks.map((task) => (
          <Card key={task.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="font-semibold text-lg">{task.title}</h3>
                    <Badge className={statusColors[task.status as keyof typeof statusColors]}>
                      {task.status.replace('_', ' ')}
                    </Badge>
                    <Badge variant="outline" className={priorityColors[task.priority as keyof typeof priorityColors]}>
                      {task.priority}
                    </Badge>
                  </div>
                  
                  {task.description && (
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      {task.description}
                    </p>
                  )}
                  
                  <div className="flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
                    {task.project && (
                      <span className="font-medium">
                        {task.project.name}
                      </span>
                    )}
                    {task.due_date && (
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{format(new Date(task.due_date), 'MMM dd, yyyy')}</span>
                      </div>
                    )}
                    {task.estimated_hours && (
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{task.estimated_hours}h estimated</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  {task.assigned_user && (
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={task.assigned_user.avatar_url || ''} />
                        <AvatarFallback className="text-xs">
                          {task.assigned_user.full_name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {task.assigned_user.full_name}
                      </span>
                    </div>
                  )}
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setEditingTask(task)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleDelete(task.id)}
                        className="text-red-600 dark:text-red-400"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={!!editingTask} onOpenChange={() => setEditingTask(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
          </DialogHeader>
          {editingTask && (
            <TaskForm 
              task={editingTask}
              onSuccess={() => setEditingTask(null)} 
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}