import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { leadsApi } from '../../api/leads.api';
import type { ILead } from '../../types';
import { LeadStatus, LeadSource } from '../../types';
import { Input, Select, Textarea } from '../ui/FormFields';
import { Button } from '../ui/Button';
import { getErrorMessage } from '../../utils/helpers';

const schema = z.object({
  name:   z.string().min(2, 'Min 2 chars').max(100),
  email:  z.string().email('Invalid email'),
  status: z.string().optional(),
  source: z.string().min(1, 'Source is required'),
  notes:  z.string().max(1000).optional(),
});

type FormData = z.infer<typeof schema>;

interface LeadFormProps {
  lead?: ILead;
  onSuccess: () => void;
}

const STATUS_OPTIONS = Object.values(LeadStatus).map((v) => ({ value: v, label: v }));
const SOURCE_OPTIONS = Object.values(LeadSource).map((v) => ({ value: v, label: v }));

export const LeadForm: React.FC<LeadFormProps> = ({ lead, onSuccess }) => {
  const qc = useQueryClient();
  const isEdit = !!lead;

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name:   lead?.name   ?? '',
      email:  lead?.email  ?? '',
      status: lead?.status ?? LeadStatus.NEW,
      source: lead?.source ?? '',
      notes:  lead?.notes  ?? '',
    },
  });

  const mutation = useMutation({
    mutationFn: (data: FormData) =>
      isEdit
        ? leadsApi.updateLead(lead!._id, { ...data, source: data.source as typeof LeadSource[keyof typeof LeadSource], status: data.status as typeof LeadStatus[keyof typeof LeadStatus] })
        : leadsApi.createLead({ ...data, source: data.source as typeof LeadSource[keyof typeof LeadSource], status: data.status as typeof LeadStatus[keyof typeof LeadStatus] }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['leads'] });
      qc.invalidateQueries({ queryKey: ['stats'] });
      toast.success(isEdit ? 'Lead updated!' : 'Lead created!');
      onSuccess();
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });

  return (
    <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Input label="Name" placeholder="John Doe" error={errors.name?.message} {...register('name')} />
        <Input label="Email" type="email" placeholder="rahul@example.com" error={errors.email?.message} {...register('email')} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Select label="Status" options={STATUS_OPTIONS} error={errors.status?.message} {...register('status')} />
        <Select label="Source" placeholder="Select source" options={SOURCE_OPTIONS} error={errors.source?.message} {...register('source')} />
      </div>
      <Textarea label="Notes" placeholder="Add notes..." error={errors.notes?.message} {...register('notes')} />
      <div className="flex justify-end gap-3 pt-2">
        <Button type="submit" loading={mutation.isPending}>
          {isEdit ? 'Update Lead' : 'Create Lead'}
        </Button>
      </div>
    </form>
  );
};
