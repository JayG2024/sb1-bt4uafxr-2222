'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { 
  LayoutDashboard, 
  FolderOpen, 
  CheckSquare, 
  Users, 
  DollarSign, 
  Settings,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Projects', href: '/projects', icon: FolderOpen },
  { name: 'Tasks', href: '/tasks', icon: CheckSquare },
  { name: 'Contacts', href: '/contacts', icon: Users },
  { name: 'Deals', href: '/deals', icon: DollarSign },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { user } = useAuth();

  const handleSignOut = async () => {
    // For demo mode, just redirect to home
    window.location.href = '/';
  };

  const sidebarContent = (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-6 border-b">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-8 h-8 bg-blue-600 rounded-lg">
            <span className="text-white font-bold text-sm">CRM</span>
          </div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">DevCRM</h1>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setIsOpen(false)}
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-100'
                  : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
              )}
              onClick={() => setIsOpen(false)}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-full justify-start space-x-3 px-4 py-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.avatar_url} alt={user?.full_name} />
                <AvatarFallback>
                  {user?.full_name?.split(' ').map(n => n[0]).join('').toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start">
                <span className="text-sm font-medium">{user?.full_name}</span>
                <span className="text-xs text-gray-500 capitalize">{user?.role}</span>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuItem onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden fixed top-4 left-4 z-50"
        onClick={() => setIsOpen(true)}
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Mobile sidebar */}
      <div className={cn(
        'fixed inset-0 z-40 md:hidden',
        isOpen ? 'block' : 'hidden'
      )}>
        <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setIsOpen(false)} />
        <div className="fixed left-0 top-0 h-full w-64 bg-white dark:bg-gray-900 shadow-lg">
          {sidebarContent}
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden md:flex md:flex-col md:fixed md:inset-y-0 md:w-64 md:bg-white md:dark:bg-gray-900 md:border-r md:border-gray-200 md:dark:border-gray-800">
        {sidebarContent}
      </div>
    </>
  );
}