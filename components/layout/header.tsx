'use client';

import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { Bell, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const pageTitle = {
  '/dashboard': 'Dashboard',
  '/projects': 'Projects',
  '/tasks': 'Tasks',
  '/contacts': 'Contacts',
  '/deals': 'Deals',
  '/settings': 'Settings',
};

export function Header() {
  const pathname = usePathname();
  const title = pageTitle[pathname as keyof typeof pageTitle] || 'DevCRM';

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {title}
          </h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Quick Add
          </Button>
          
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <Badge className="absolute -top-1 -right-1 h-5 w-5 text-xs bg-red-500 text-white">
              3
            </Badge>
          </Button>
          
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}