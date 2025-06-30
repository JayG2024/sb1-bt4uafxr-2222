'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { useCreateContact, useUpdateContact, useUsers } from '@/hooks/use-query';
import { Contact } from '@/lib/queries/contacts';

const contactSchema = z.object({
  type: z.enum(['prospect', 'client', 'partner']),
  company_name: z.string().optional(),
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  phone: z.string().optional(),
  position: z.string().optional(),
  industry: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  website: z.string().url('Invalid website URL').optional().or(z.literal('')),
  notes: z.string().optional(),
  assigned_to: z.string().optional(),
});

type ContactFormData = z.infer<typeof contactSchema>;

interface ContactFormProps {
  contact?: Contact;
  onSuccess: () => void;
}

export function ContactForm({ contact, onSuccess }: ContactFormProps) {
  const { data: users } = useUsers();
  const createContact = useCreateContact();
  const updateContact = useUpdateContact();

  const isEditing = !!contact;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      type: contact?.type || 'prospect',
      company_name: contact?.company_name || '',
      first_name: contact?.first_name || '',
      last_name: contact?.last_name || '',
      email: contact?.email || '',
      phone: contact?.phone || '',
      position: contact?.position || '',
      industry: contact?.industry || '',
      address: contact?.address || '',
      city: contact?.city || '',
      country: contact?.country || '',
      website: contact?.website || '',
      notes: contact?.notes || '',
      assigned_to: contact?.assigned_to || undefined,
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    try {
      const formData = {
        ...data,
        company_name: data.company_name || null,
        email: data.email || null,
        phone: data.phone || null,
        position: data.position || null,
        industry: data.industry || null,
        address: data.address || null,
        city: data.city || null,
        country: data.country || null,
        website: data.website || null,
        notes: data.notes || null,
        assigned_to: data.assigned_to || null,
      };

      if (isEditing) {
        await updateContact.mutateAsync({ id: contact.id, updates: formData });
      } else {
        await createContact.mutateAsync(formData);
      }
      
      onSuccess();
    } catch (error) {
      console.error('Error saving contact:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="type">Type</Label>
          <Select onValueChange={(value) => setValue('type', value as any)} defaultValue={contact?.type || 'prospect'}>
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="prospect">Prospect</SelectItem>
              <SelectItem value="client">Client</SelectItem>
              <SelectItem value="partner">Partner</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="company_name">Company Name</Label>
          <Input
            id="company_name"
            {...register('company_name')}
            placeholder="Enter company name"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="first_name">First Name</Label>
          <Input
            id="first_name"
            {...register('first_name')}
            placeholder="Enter first name"
          />
          {errors.first_name && (
            <p className="text-sm text-red-600">{errors.first_name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="last_name">Last Name</Label>
          <Input
            id="last_name"
            {...register('last_name')}
            placeholder="Enter last name"
          />
          {errors.last_name && (
            <p className="text-sm text-red-600">{errors.last_name.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            {...register('email')}
            placeholder="Enter email address"
          />
          {errors.email && (
            <p className="text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            {...register('phone')}
            placeholder="Enter phone number"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="position">Position</Label>
          <Input
            id="position"
            {...register('position')}
            placeholder="Enter job title"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="industry">Industry</Label>
          <Input
            id="industry"
            {...register('industry')}
            placeholder="Enter industry"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <Input
          id="address"
          {...register('address')}
          placeholder="Enter address"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            {...register('city')}
            placeholder="Enter city"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="country">Country</Label>
          <Input
            id="country"
            {...register('country')}
            placeholder="Enter country"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="website">Website</Label>
          <Input
            id="website"
            {...register('website')}
            placeholder="https://example.com"
          />
          {errors.website && (
            <p className="text-sm text-red-600">{errors.website.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="assigned_to">Assigned To</Label>
          <Select onValueChange={(value) => setValue('assigned_to', value)} defaultValue={contact?.assigned_to || undefined}>
            <SelectTrigger>
              <SelectValue placeholder="Select team member" />
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

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          {...register('notes')}
          placeholder="Add any additional notes about this contact"
          rows={3}
        />
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onSuccess}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isEditing ? 'Update Contact' : 'Create Contact'}
        </Button>
      </div>
    </form>
  );
}