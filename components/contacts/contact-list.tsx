'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ContactForm } from './contact-form';
import { 
  Mail, 
  Phone, 
  Building,
  MapPin,
  Globe,
  MoreHorizontal,
  Edit,
  Trash2,
  Users,
  DollarSign
} from 'lucide-react';
import { useDeleteContact } from '@/hooks/use-query';
import { Contact } from '@/lib/queries/contacts';

interface ContactListProps {
  contacts: Contact[];
}

const typeColors = {
  prospect: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  client: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  partner: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
};

export function ContactList({ contacts }: ContactListProps) {
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const deleteContact = useDeleteContact();

  const handleDelete = async (contactId: string) => {
    if (confirm('Are you sure you want to delete this contact?')) {
      await deleteContact.mutateAsync(contactId);
    }
  };

  if (contacts.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="text-gray-500 dark:text-gray-400">
            <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-semibold mb-2">No contacts yet</h3>
            <p>Create your first contact to get started with relationship management.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {contacts.map((contact) => (
          <Card key={contact.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={''} />
                    <AvatarFallback className="text-lg">
                      {contact.first_name[0]}{contact.last_name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">
                      {contact.first_name} {contact.last_name}
                    </CardTitle>
                    {contact.position && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {contact.position}
                      </p>
                    )}
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setEditingContact(contact)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => handleDelete(contact.id)}
                      className="text-red-600 dark:text-red-400"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <Badge className={typeColors[contact.type as keyof typeof typeColors]}>
                {contact.type}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {contact.company_name && (
                  <div className="flex items-center space-x-2 text-sm">
                    <Building className="h-4 w-4 text-gray-400" />
                    <span>{contact.company_name}</span>
                  </div>
                )}
                
                {contact.email && (
                  <div className="flex items-center space-x-2 text-sm">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <a 
                      href={`mailto:${contact.email}`}
                      className="text-blue-600 hover:underline"
                    >
                      {contact.email}
                    </a>
                  </div>
                )}
                
                {contact.phone && (
                  <div className="flex items-center space-x-2 text-sm">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <a 
                      href={`tel:${contact.phone}`}
                      className="text-blue-600 hover:underline"
                    >
                      {contact.phone}
                    </a>
                  </div>
                )}
                
                {(contact.city || contact.country) && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                    <MapPin className="h-4 w-4" />
                    <span>
                      {[contact.city, contact.country].filter(Boolean).join(', ')}
                    </span>
                  </div>
                )}
                
                {contact.website && (
                  <div className="flex items-center space-x-2 text-sm">
                    <Globe className="h-4 w-4 text-gray-400" />
                    <a 
                      href={contact.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {contact.website}
                    </a>
                  </div>
                )}

                {contact.deals && contact.deals.length > 0 && (
                  <div className="pt-3 border-t">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        {contact.deals.length} deal{contact.deals.length > 1 ? 's' : ''}
                      </span>
                      <div className="flex items-center space-x-1 text-green-600">
                        <DollarSign className="h-4 w-4" />
                        <span>
                          {contact.deals.reduce((sum, deal) => sum + deal.value, 0).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={!!editingContact} onOpenChange={() => setEditingContact(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Contact</DialogTitle>
          </DialogHeader>
          {editingContact && (
            <ContactForm 
              contact={editingContact}
              onSuccess={() => setEditingContact(null)} 
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}