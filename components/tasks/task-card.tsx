'use client';

import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent } from '@/components/ui/card';
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
  User
} from 'lucide-react';
import { format } from 'date-fns';
import { useDeleteTask } from '@/hooks/use-query';
import { Task } from '@/lib/queries/tasks';

interface TaskCardProps {
  task: Task;
  isDragging?: boolean;
}

const priorityColors = {
  low: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
  medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  high: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
  urgent: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
};

export function TaskCard({ task, isDragging }: TaskCardProps) {
  const [editingTask, setEditingTask] = useState(false);
  const deleteTask = useDeleteTask();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this task?')) {
      await deleteTask.mutateAsync(task.id);
    }
  };

  return (
    <>
      <Card
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className={`cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow ${
          isDragging ? 'opacity-50' : ''
        }`}
      >
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-medium text-sm line-clamp-2">{task.title}</h3>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <MoreHorizontal className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setEditingTask(true)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={handleDelete}
                  className="text-red-600 dark:text-red-400"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {task.description && (
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
              {task.description}
            </p>
          )}

          <div className="flex items-center justify-between mb-3">
            <Badge className={priorityColors[task.priority as keyof typeof priorityColors]} variant="secondary">
              {task.priority}
            </Badge>
            {task.project && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {task.project.name}
              </span>
            )}
          </div>

          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center space-x-2">
              {task.due_date && (
                <div className="flex items-center space-x-1">
                  <Calendar className="h-3 w-3" />
                  <span>{format(new Date(task.due_date), 'MMM dd')}</span>
                </div>
              )}
              {task.estimated_hours && (
                <div className="flex items-center space-x-1">
                  <Clock className="h-3 w-3" />
                  <span>{task.estimated_hours}h</span>
                </div>
              )}
            </div>
            {task.assigned_user && (
              <Avatar className="h-5 w-5">
                <AvatarImage src={task.assigned_user.avatar_url || ''} />
                <AvatarFallback className="text-xs">
                  {task.assigned_user.full_name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={editingTask} onOpenChange={setEditingTask}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
          </DialogHeader>
          <TaskForm 
            task={task}
            onSuccess={() => setEditingTask(false)} 
          />
        </DialogContent>
      </Dialog>
    </>
  );
}