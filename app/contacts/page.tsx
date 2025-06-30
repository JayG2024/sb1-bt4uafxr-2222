'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { useContacts } from '@/hooks/use-query';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { ContactList } from '@/components/contacts/contact-list';
import { ContactForm } from '@/components/contacts/contact-form';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Loader2, Plus } from 'lucide-react';

export default function Contacts() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { data: contacts, isLoading, error } = useContacts();
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Sidebar />
        <div className="md:pl-64">
          <Header />
          <main className="p-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-8 text-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                Error Loading Contacts
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Unable to load contacts. Please try again later.
              </p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <div className="md:pl-64">
        <Header />
        <main className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                Contacts
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Manage your clients, prospects, and business contacts
              </p>
            </div>
            <Dialog open={showForm} onOpenChange={setShowForm}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  New Contact
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create New Contact</DialogTitle>
                </DialogHeader>
                <ContactForm onSuccess={() => setShowForm(false)} />
              </DialogContent>
            </Dialog>
          </div>
          
          <ContactList contacts={contacts || []} />
        </main>
      </div>
    </div>
  );
}