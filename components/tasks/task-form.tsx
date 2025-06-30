'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useCreateTask, useUpdateTask, useProjects, useUsers } from '@/hooks/use-query';
import { useAuth } from '@/hooks/use-auth';
import { Task } from '@/lib/queries/tasks';

const taskSchema = z.object({
  title: z.string().min(1, 'Task title is required'),
  description: z.string().optional(),
  status: z.enum(['todo', 'in_progress', 'review', 'done']),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
  project_id: z.string().optional(),
  assigned_to: z.string().optional(),
  due_date: z.date().optional(),
  estimated_hours: z.number().optional(),
  tags: z.array(z.string()).optional(),
});

type TaskFormData = z.infer<typeof taskSchema>;

interface TaskFormProps {
  task?: Task;
  onSuccess: () => void;
}

export function TaskForm({ task, onSuccess }: TaskFormProps) {
  const { user } = useAuth();
  const { data: projects } = useProjects();
  const { data: users } = useUsers();
  const createTask = useCreateTask();
  const updateTask = useUpdateTask();

  const isEditing = !!task;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: task?.title || '',
      description: task?.description || '',
      status: task?.status || 'todo',
      priority: task?.priority || 'medium',
      project_id: task?.project_id || undefined,
      assigned_to: task?.assigned_to || undefined,
      due_date: task?.due_date ? new Date(task.due_date) : undefined,
      estimated_hours: task?.estimated_hours || undefined,
      tags: task?.tags || [],
    },
  });

  const watchedDueDate = watch('due_date');

  const onSubmit = async (data: TaskFormData) => {
    try {
      const formData = {
        ...data,
        due_date: data.due_date ? data.due_date.toISOString() : null,
        project_id: data.project_id || null,
        assigned_to: data.assigned_to || null,
        created_by: user?.id || null,
        estimated_hours: data.estimated_hours || null,
        tags: data.tags || null,
      };

      if (isEditing) {
        await updateTask.mutateAsync({ id: task.id, updates: formData });
      } else {
        await createTask.mutateAsync(formData);
      }
      
      onSuccess();
    } catch (error) {
      console.error('Error saving task:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Task Title</Label>
        <Input
          id="title"
          {...register('title')}
          placeholder="Enter task title"
        />
        {errors.title && (
          <p className="text-sm text-red-600">{errors.title.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          {...register('description')}
          placeholder="Enter task description"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select onValueChange={(value) => setValue('status', value as any)} defaultValue={task?.status || 'todo'}>
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todo">To Do</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="review">Review</SelectItem>
              <SelectItem value="done">Done</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="priority">Priority</Label>
          <Select onValueChange={(value) => setValue('priority', value as any)} defaultValue={task?.priority || 'medium'}>
            <SelectTrigger>
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="urgent">Urgent</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="project_id">Project</Label>
          <Select onValueChange={(value) => setValue('project_id', value)} defaultValue={task?.project_id || undefined}>
            <SelectTrigger>
              <SelectValue placeholder="Select project" />
            </SelectTrigger>
            <SelectContent>
              {projects?.map((project) => (
                <SelectItem key={project.id} value={project.id}>
                  {project.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="assigned_to">Assignee</Label>
          <Select onValueChange={(value) => setValue('assigned_to', value)} defaultValue={task?.assigned_to || undefined}>
            <SelectTrigger>
              <SelectValue placeholder="Select assignee" />
            </SelectTrigger>
            <SelectContent>
              {users?.map((user) => (
                <SelectItem key={user.id} value={user.id}>
                  {user.full_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Due Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'w-full justify-start text-left font-normal',
                  !watchedDueDate && 'text-muted-foreground'
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {watchedDueDate ? format(watchedDueDate, 'PPP') : 'Pick a date'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={watchedDueDate}
                onSelect={(date) => setValue('due_date', date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label htmlFor="estimated_hours">Estimated Hours</Label>
          <Input
            id="estimated_hours"
            type="number"
            min={0}
            step={0.5}
            {...register('estimated_hours', { valueAsNumber: true })}
            placeholder="0"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onSuccess}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isEditing ? 'Update Task' : 'Create Task'}
        </Button>
      </div>
    </form>
  );
}