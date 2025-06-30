'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, Users, DollarSign } from 'lucide-react';
import { format } from 'date-fns';

const projects = [
  {
    id: 1,
    name: 'E-commerce Platform',
    status: 'active',
    priority: 'high',
    progress: 65,
    dueDate: new Date('2024-06-30'),
    budget: 50000,
    manager: {
      name: 'Sarah Wilson',
      avatar: '',
      initials: 'SW',
    },
    team: [
      { name: 'John Smith', initials: 'JS' },
      { name: 'Emily Davis', initials: 'ED' },
      { name: 'Mike Johnson', initials: 'MJ' },
    ],
  },
  {
    id: 2,
    name: 'Mobile App Development',
    status: 'active',
    priority: 'medium',
    progress: 40,
    dueDate: new Date('2024-08-15'),
    budget: 35000,
    manager: {
      name: 'Mike Johnson',
      avatar: '',
      initials: 'MJ',
    },
    team: [
      { name: 'Sarah Wilson', initials: 'SW' },
      { name: 'John Smith', initials: 'JS' },
    ],
  },
  {
    id: 3,
    name: 'Data Analytics Dashboard',
    status: 'planning',
    priority: 'medium',
    progress: 15,
    dueDate: new Date('2024-09-30'),
    budget: 25000,
    manager: {
      name: 'Emily Davis',
      avatar: '',
      initials: 'ED',
    },
    team: [
      { name: 'Mike Johnson', initials: 'MJ' },
      { name: 'Sarah Wilson', initials: 'SW' },
    ],
  },
];

const statusColors = {
  active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  planning: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
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

export function ProjectOverview() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Active Projects</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {projects.map((project) => (
            <div key={project.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                    {project.name}
                  </h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge className={statusColors[project.status as keyof typeof statusColors]}>
                      {project.status.replace('_', ' ')}
                    </Badge>
                    <Badge variant="outline" className={priorityColors[project.priority as keyof typeof priorityColors]}>
                      {project.priority}
                    </Badge>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-400">
                    <DollarSign className="h-4 w-4" />
                    <span>${project.budget.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="mb-3">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-600 dark:text-gray-400">Progress</span>
                  <span className="font-medium">{project.progress}%</span>
                </div>
                <Progress value={project.progress} className="h-2" />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-400">
                    <Calendar className="h-4 w-4" />
                    <span>{format(project.dueDate, 'MMM dd, yyyy')}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-400">
                    <Users className="h-4 w-4" />
                    <span>{project.team.length + 1} members</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={project.manager.avatar} alt={project.manager.name} />
                    <AvatarFallback className="text-xs">
                      {project.manager.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex -space-x-2">
                    {project.team.slice(0, 3).map((member, index) => (
                      <Avatar key={index} className="h-6 w-6 border-2 border-white dark:border-gray-900">
                        <AvatarFallback className="text-xs">
                          {member.initials}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                    {project.team.length > 3 && (
                      <div className="h-6 w-6 rounded-full bg-gray-100 dark:bg-gray-800 border-2 border-white dark:border-gray-900 flex items-center justify-center">
                        <span className="text-xs text-gray-600 dark:text-gray-400">
                          +{project.team.length - 3}
                        </span>
                      </div>
                    )}
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