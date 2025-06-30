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
import { useCreateProject, useUpdateProject, useContacts, useUsers } from '@/hooks/use-query';
import { Project } from '@/lib/queries/projects';

const projectSchema = z.object({
  name: z.string().min(1, 'Project name is required'),
  description: z.string().optional(),
  status: z.enum(['planning', 'active', 'on_hold', 'completed', 'cancelled']),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
  start_date: z.date().optional(),
  due_date: z.date().optional(),
  budget: z.number().optional(),
  client_id: z.string().optional(),
  manager_id: z.string().optional(),
  progress: z.number().min(0).max(100),
});

type ProjectFormData = z.infer<typeof projectSchema>;

interface ProjectFormProps {
  project?: Project;
  onSuccess: () => void;
}

export function ProjectForm({ project, onSuccess }: ProjectFormProps) {
  const { data: contacts } = useContacts();
  const { data: users } = useUsers();
  const createProject = useCreateProject();
  const updateProject = useUpdateProject();

  const isEditing = !!project;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: project?.name || '',
      description: project?.description || '',
      status: project?.status || 'planning',
      priority: project?.priority || 'medium',
      start_date: project?.start_date ? new Date(project.start_date) : undefined,
      due_date: project?.due_date ? new Date(project.due_date) : undefined,
      budget: project?.budget || undefined,
      client_id: project?.client_id || undefined,
      manager_id: project?.manager_id || undefined,
      progress: project?.progress || 0,
    },
  });

  const watchedStartDate = watch('start_date');
  const watchedDueDate = watch('due_date');

  const onSubmit = async (data: ProjectFormData) => {
    try {
      const formData = {
        ...data,
        start_date: data.start_date ? data.start_date.toISOString().split('T')[0] : null,
        due_date: data.due_date ? data.due_date.toISOString().split('T')[0] : null,
        budget: data.budget || null,
        client_id: data.client_id || null,
        manager_id: data.manager_id || null,
      };

      if (isEditing) {
        await updateProject.mutateAsync({ id: project.id, updates: formData });
      } else {
        await createProject.mutateAsync(formData);
      }
      
      onSuccess();
    } catch (error) {
      console.error('Error saving project:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Project Name</Label>
          <Input
            id="name"
            {...register('name')}
            placeholder="Enter project name"
          />
          {errors.name && (
            <p className="text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select onValueChange={(value) => setValue('status', value as any)} defaultValue={project?.status || 'planning'}>
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="planning">Planning</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="on_hold">On Hold</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          {...register('description')}
          placeholder="Enter project description"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="priority">Priority</Label>
          <Select onValueChange={(value) => setValue('priority', value as any)} defaultValue={project?.priority || 'medium'}>
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

        <div className="space-y-2">
          <Label htmlFor="progress">Progress (%)</Label>
          <Input
            id="progress"
            type="number"
            min={0}
            max={100}
            {...register('progress', { valueAsNumber: true })}
            placeholder="0"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Start Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'w-full justify-start text-left font-normal',
                  !watchedStartDate && 'text-muted-foreground'
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {watchedStartDate ? format(watchedStartDate, 'PPP') : 'Pick a date'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={watchedStartDate}
                onSelect={(date) => setValue('start_date', date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

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
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="budget">Budget</Label>
          <Input
            id="budget"
            type="number"
            step="0.01"
            {...register('budget', { valueAsNumber: true })}
            placeholder="0.00"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="client_id">Client</Label>
          <Select onValueChange={(value) => setValue('client_id', value)} defaultValue={project?.client_id || undefined}>
            <SelectTrigger>
              <SelectValue placeholder="Select client" />
            </SelectTrigger>
            <SelectContent>
              {contacts?.map((contact) => (
                <SelectItem key={contact.id} value={contact.id}>
                  {contact.company_name || `${contact.first_name} ${contact.last_name}`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="manager_id">Project Manager</Label>
        <Select onValueChange={(value) => setValue('manager_id', value)} defaultValue={project?.manager_id || undefined}>
          <SelectTrigger>
            <SelectValue placeholder="Select project manager" />
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

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onSuccess}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isEditing ? 'Update Project' : 'Create Project'}
        </Button>
      </div>
    </form>
  );
}