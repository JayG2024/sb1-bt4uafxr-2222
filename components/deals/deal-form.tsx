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
import { useCreateDeal, useUpdateDeal, useContacts, useUsers } from '@/hooks/use-query';
import { Deal } from '@/lib/queries/deals';

const dealSchema = z.object({
  title: z.string().min(1, 'Deal title is required'),
  description: z.string().optional(),
  value: z.number().min(0, 'Value must be positive'),
  stage: z.enum(['lead', 'qualified', 'proposal', 'negotiation', 'closed_won', 'closed_lost']),
  probability: z.number().min(0).max(100),
  contact_id: z.string().optional(),
  assigned_to: z.string().optional(),
  expected_close_date: z.date().optional(),
  source: z.string().optional(),
  notes: z.string().optional(),
});

type DealFormData = z.infer<typeof dealSchema>;

interface DealFormProps {
  deal?: Deal;
  onSuccess: () => void;
}

export function DealForm({ deal, onSuccess }: DealFormProps) {
  const { data: contacts } = useContacts();
  const { data: users } = useUsers();
  const createDeal = useCreateDeal();
  const updateDeal = useUpdateDeal();

  const isEditing = !!deal;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<DealFormData>({
    resolver: zodResolver(dealSchema),
    defaultValues: {
      title: deal?.title || '',
      description: deal?.description || '',
      value: deal?.value || 0,
      stage: deal?.stage || 'lead',
      probability: deal?.probability || 0,
      contact_id: deal?.contact_id || undefined,
      assigned_to: deal?.assigned_to || undefined,
      expected_close_date: deal?.expected_close_date ? new Date(deal.expected_close_date) : undefined,
      source: deal?.source || '',
      notes: deal?.notes || '',
    },
  });

  const watchedCloseDate = watch('expected_close_date');

  const onSubmit = async (data: DealFormData) => {
    try {
      const formData = {
        ...data,
        expected_close_date: data.expected_close_date ? data.expected_close_date.toISOString().split('T')[0] : null,
        contact_id: data.contact_id || null,
        assigned_to: data.assigned_to || null,
        source: data.source || null,
        notes: data.notes || null,
      };

      if (isEditing) {
        await updateDeal.mutateAsync({ id: deal.id, updates: formData });
      } else {
        await createDeal.mutateAsync(formData);
      }
      
      onSuccess();
    } catch (error) {
      console.error('Error saving deal:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Deal Title</Label>
        <Input
          id="title"
          {...register('title')}
          placeholder="Enter deal title"
        />
        {errors.title && (
          <p className="text-sm text-red-600">{errors.title.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          {...register('description')}
          placeholder="Enter deal description"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="value">Value</Label>
          <Input
            id="value"
            type="number"
            step="0.01"
            {...register('value', { valueAsNumber: true })}
            placeholder="0.00"
          />
          {errors.value && (
            <p className="text-sm text-red-600">{errors.value.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="probability">Probability (%)</Label>
          <Input
            id="probability"
            type="number"
            min={0}
            max={100}
            {...register('probability', { valueAsNumber: true })}
            placeholder="0"
          />
          {errors.probability && (
            <p className="text-sm text-red-600">{errors.probability.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="stage">Stage</Label>
          <Select onValueChange={(value) => setValue('stage', value as any)} defaultValue={deal?.stage || 'lead'}>
            <SelectTrigger>
              <SelectValue placeholder="Select stage" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="lead">Lead</SelectItem>
              <SelectItem value="qualified">Qualified</SelectItem>
              <SelectItem value="proposal">Proposal</SelectItem>
              <SelectItem value="negotiation">Negotiation</SelectItem>
              <SelectItem value="closed_won">Closed Won</SelectItem>
              <SelectItem value="closed_lost">Closed Lost</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="source">Source</Label>
          <Input
            id="source"
            {...register('source')}
            placeholder="e.g., Website, Referral, Cold Call"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="contact_id">Contact</Label>
          <Select onValueChange={(value) => setValue('contact_id', value)} defaultValue={deal?.contact_id || undefined}>
            <SelectTrigger>
              <SelectValue placeholder="Select contact" />
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

        <div className="space-y-2">
          <Label htmlFor="assigned_to">Assigned To</Label>
          <Select onValueChange={(value) => setValue('assigned_to', value)} defaultValue={deal?.assigned_to || undefined}>
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
        <Label>Expected Close Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                'w-full justify-start text-left font-normal',
                !watchedCloseDate && 'text-muted-foreground'
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {watchedCloseDate ? format(watchedCloseDate, 'PPP') : 'Pick a date'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={watchedCloseDate}
              onSelect={(date) => setValue('expected_close_date', date)}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          {...register('notes')}
          placeholder="Add any additional notes about this deal"
          rows={3}
        />
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onSuccess}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isEditing ? 'Update Deal' : 'Create Deal'}
        </Button>
      </div>
    </form>
  );
}