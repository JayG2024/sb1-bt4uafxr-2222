'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  MessageSquare, 
  Phone, 
  Mail, 
  Calendar,
  FileText,
  UserPlus
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const activities = [
  {
    id: 1,
    type: 'note',
    title: 'Project kickoff meeting scheduled',
    description: 'E-commerce Platform project with TechCorp',
    user: {
      name: 'Sarah Wilson',
      avatar: '',
      initials: 'SW',
    },
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    icon: Calendar,
    color: 'bg-blue-500',
  },
  {
    id: 2,
    type: 'call',
    title: 'Discovery call completed',
    description: 'Initial call with StartupXYZ for MVP development',
    user: {
      name: 'Mike Johnson',
      avatar: '',
      initials: 'MJ',
    },
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    icon: Phone,
    color: 'bg-green-500',
  },
  {
    id: 3,
    type: 'email',
    title: 'Proposal sent',
    description: 'Sent project proposal to Enterprise Solutions',
    user: {
      name: 'Emily Davis',
      avatar: '',
      initials: 'ED',
    },
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    icon: Mail,
    color: 'bg-purple-500',
  },
  {
    id: 4,
    type: 'task',
    title: 'Database schema completed',
    description: 'API Development task completed by John',
    user: {
      name: 'John Smith',
      avatar: '',
      initials: 'JS',
    },
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
    icon: FileText,
    color: 'bg-orange-500',
  },
  {
    id: 5,
    type: 'contact',
    title: 'New contact added',
    description: 'Added Alice Brown from Innovation Labs',
    user: {
      name: 'Sarah Wilson',
      avatar: '',
      initials: 'SW',
    },
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
    icon: UserPlus,
    color: 'bg-teal-500',
  },
];

export function RecentActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-4">
              <div className={`p-2 rounded-lg ${activity.color}`}>
                <activity.icon className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {activity.title}
                  </p>
                  <Badge variant="secondary" className="text-xs">
                    {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {activity.description}
                </p>
                <div className="flex items-center space-x-2 mt-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={activity.user.avatar} alt={activity.user.name} />
                    <AvatarFallback className="text-xs">
                      {activity.user.initials}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-xs text-gray-500">{activity.user.name}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}