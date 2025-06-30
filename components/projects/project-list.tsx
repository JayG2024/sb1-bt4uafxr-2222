'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ProjectForm } from './project-form';
import { 
  Calendar, 
  DollarSign, 
  Users, 
  MoreHorizontal,
  Edit,
  Trash2,
  Eye
} from 'lucide-react';
import { format } from 'date-fns';
import { useDeleteProject } from '@/hooks/use-query';
import { Project } from '@/lib/queries/projects';

interface ProjectListProps {
  projects: Project[];
}

const statusColors = {
  planning: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  on_hold: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  completed: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
};

const priorityColors = {
  low: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
  medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  high: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
  urgent: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
};

export function ProjectList({ projects }: ProjectListProps) {
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const deleteProject = useDeleteProject();

  const handleDelete = async (projectId: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      await deleteProject.mutateAsync(projectId);
    }
  };

  if (projects.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="text-gray-500 dark:text-gray-400">
            <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-semibold mb-2">No projects yet</h3>
            <p>Create your first project to get started with project management.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Card key={project.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg mb-2">{project.name}</CardTitle>
                  <div className="flex items-center space-x-2">
                    <Badge className={statusColors[project.status as keyof typeof statusColors]}>
                      {project.status.replace('_', ' ')}
                    </Badge>
                    <Badge variant="outline" className={priorityColors[project.priority as keyof typeof priorityColors]}>
                      {project.priority}
                    </Badge>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setEditingProject(project)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => handleDelete(project.id)}
                      className="text-red-600 dark:text-red-400"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent>
              {project.description && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  {project.description}
                </p>
              )}
              
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Progress</span>
                  <span className="font-medium">{project.progress}%</span>
                </div>
                <Progress value={project.progress} className="h-2" />
                
                <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {project.due_date 
                        ? format(new Date(project.due_date), 'MMM dd, yyyy')
                        : 'No due date'
                      }
                    </span>
                  </div>
                  {project.budget && (
                    <div className="flex items-center space-x-1">
                      <DollarSign className="h-4 w-4" />
                      <span>${project.budget.toLocaleString()}</span>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {project.client && (
                      <span>
                        {project.client.company_name || 
                         `${project.client.first_name} ${project.client.last_name}`}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    {project.manager && (
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={project.manager.avatar_url || ''} />
                        <AvatarFallback className="text-xs">
                          {project.manager.full_name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                    )}
                    {project.members && project.members.length > 0 && (
                      <div className="flex -space-x-2">
                        {project.members.slice(0, 3).map((member, index) => (
                          <Avatar key={index} className="h-6 w-6 border-2 border-white dark:border-gray-900">
                            <AvatarImage src={member.user?.avatar_url || ''} />
                            <AvatarFallback className="text-xs">
                              {member.user?.full_name.split(' ').map(n => n[0]).join('') || 'U'}
                            </AvatarFallback>
                          </Avatar>
                        ))}
                        {project.members.length > 3 && (
                          <div className="h-6 w-6 rounded-full bg-gray-100 dark:bg-gray-800 border-2 border-white dark:border-gray-900 flex items-center justify-center">
                            <span className="text-xs text-gray-600 dark:text-gray-400">
                              +{project.members.length - 3}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={!!editingProject} onOpenChange={() => setEditingProject(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
          </DialogHeader>
          {editingProject && (
            <ProjectForm 
              project={editingProject}
              onSuccess={() => setEditingProject(null)} 
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}