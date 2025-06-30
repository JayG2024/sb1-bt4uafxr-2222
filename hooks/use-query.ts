'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

// Projects
import { getProjects, getProject, createProject, updateProject, deleteProject } from '@/lib/queries/projects';
import { getTasks, getTasksByProject, createTask, updateTask, deleteTask } from '@/lib/queries/tasks';
import { getContacts, getContact, createContact, updateContact, deleteContact } from '@/lib/queries/contacts';
import { getDeals, getDeal, createDeal, updateDeal, deleteDeal } from '@/lib/queries/deals';
import { getUsers } from '@/lib/queries/users';

// Projects hooks
export function useProjects() {
  return useQuery({
    queryKey: ['projects'],
    queryFn: getProjects,
  });
}

export function useProject(id: string) {
  return useQuery({
    queryKey: ['project', id],
    queryFn: () => getProject(id),
    enabled: !!id,
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success('Project created successfully');
    },
    onError: (error) => {
      toast.error('Failed to create project');
      console.error(error);
    },
  });
}

export function useUpdateProject() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: any }) => updateProject(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success('Project updated successfully');
    },
    onError: (error) => {
      toast.error('Failed to update project');
      console.error(error);
    },
  });
}

export function useDeleteProject() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success('Project deleted successfully');
    },
    onError: (error) => {
      toast.error('Failed to delete project');
      console.error(error);
    },
  });
}

// Tasks hooks
export function useTasks() {
  return useQuery({
    queryKey: ['tasks'],
    queryFn: getTasks,
  });
}

export function useProjectTasks(projectId: string) {
  return useQuery({
    queryKey: ['tasks', 'project', projectId],
    queryFn: () => getTasksByProject(projectId),
    enabled: !!projectId,
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('Task created successfully');
    },
    onError: (error) => {
      toast.error('Failed to create task');
      console.error(error);
    },
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: any }) => updateTask(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('Task updated successfully');
    },
    onError: (error) => {
      toast.error('Failed to update task');
      console.error(error);
    },
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('Task deleted successfully');
    },
    onError: (error) => {
      toast.error('Failed to delete task');
      console.error(error);
    },
  });
}

// Contacts hooks
export function useContacts() {
  return useQuery({
    queryKey: ['contacts'],
    queryFn: getContacts,
  });
}

export function useContact(id: string) {
  return useQuery({
    queryKey: ['contact', id],
    queryFn: () => getContact(id),
    enabled: !!id,
  });
}

export function useCreateContact() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createContact,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      toast.success('Contact created successfully');
    },
    onError: (error) => {
      toast.error('Failed to create contact');
      console.error(error);
    },
  });
}

export function useUpdateContact() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: any }) => updateContact(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      toast.success('Contact updated successfully');
    },
    onError: (error) => {
      toast.error('Failed to update contact');
      console.error(error);
    },
  });
}

export function useDeleteContact() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteContact,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      toast.success('Contact deleted successfully');
    },
    onError: (error) => {
      toast.error('Failed to delete contact');
      console.error(error);
    },
  });
}

// Deals hooks
export function useDeals() {
  return useQuery({
    queryKey: ['deals'],
    queryFn: getDeals,
  });
}

export function useDeal(id: string) {
  return useQuery({
    queryKey: ['deal', id],
    queryFn: () => getDeal(id),
    enabled: !!id,
  });
}

export function useCreateDeal() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createDeal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deals'] });
      toast.success('Deal created successfully');
    },
    onError: (error) => {
      toast.error('Failed to create deal');
      console.error(error);
    },
  });
}

export function useUpdateDeal() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: any }) => updateDeal(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deals'] });
      toast.success('Deal updated successfully');
    },
    onError: (error) => {
      toast.error('Failed to update deal');
      console.error(error);
    },
  });
}

export function useDeleteDeal() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteDeal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deals'] });
      toast.success('Deal deleted successfully');
    },
    onError: (error) => {
      toast.error('Failed to delete deal');
      console.error(error);
    },
  });
}

// Users hooks
export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
  });
}