'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase, logActivity, userSchema, type UserFormData } from '@/lib';
import { PageBreadcrumb } from '@/components/common';
import { Input, Label, Select, Button } from '@/components/ui';
import toast from 'react-hot-toast';

const USER_TYPE_OPTIONS = [
  { value: '1', label: 'Admin' },
  { value: '2', label: 'Encoder' },
  { value: '3', label: 'Viewer' },
];

interface UserFormProps {
  editId?: string;
}

export function UserForm({ editId }: UserFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const isEdit = !!editId;

  const { data: existingUser } = useQuery({
    queryKey: ['user', editId],
    queryFn: async () => {
      const { data, error } = await supabase.from('users').select('*').eq('encoder_id', editId).single();
      if (error) throw error;
      return data;
    },
    enabled: isEdit,
  });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: { usertype: 2 },
  });

  useEffect(() => {
    if (existingUser) {
      reset({
        firstname: existingUser.firstname ?? '',
        middlename: existingUser.middlename ?? '',
        lastname: existingUser.lastname ?? '',
        suffix: existingUser.suffix ?? '',
        username: existingUser.username ?? '',
        email: existingUser.email ?? '',
        cluster: existingUser.cluster ?? '',
        office: existingUser.office ?? '',
        bldgname: existingUser.bldgname ?? '',
        encoder_position: existingUser.encoder_position ?? '',
        usertype: existingUser.usertype ?? 2,
        zone: existingUser.zone ?? '',
      });
    }
  }, [existingUser, reset]);

  const mutation = useMutation({
    mutationFn: async (data: UserFormData) => {
      if (isEdit) {
        const { error } = await supabase.from('users').update(data).eq('encoder_id', editId);
        if (error) throw error;
        await logActivity({
          action: 'update',
          docId: editId!,
          docName: data.lastname,
          module: 'Users',
          data,
        });
      } else {
        const { data: created, error } = await supabase
          .from('users')
          .insert(data)
          .select()
          .single();
        if (error) throw error;
        await logActivity({
          action: 'create',
          docId: created.encoder_id,
          docName: data.lastname,
          module: 'Users',
          data,
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success(isEdit ? 'User updated' : 'User created');
      router.push('/users');
    },
    onError: (err: Error) => toast.error(err.message),
  });

  return (
    <div className="space-y-6">
      <PageBreadcrumb pageTitle={isEdit ? 'Edit User' : 'Add User'} />

      <div className="max-w-2xl rounded-xl border border-gray-200 bg-white p-6 dark:border-white/5 dark:bg-white/3">
        <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="space-y-5">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <Label required>First Name</Label>
              <Input
                error={!!errors.firstname}
                hint={errors.firstname?.message}
                {...register('firstname')}
              />
            </div>
            <div>
              <Label>Middle Name</Label>
              <Input {...register('middlename')} />
            </div>
            <div>
              <Label required>Last Name</Label>
              <Input
                error={!!errors.lastname}
                hint={errors.lastname?.message}
                {...register('lastname')}
              />
            </div>
            <div>
              <Label>Suffix</Label>
              <Input placeholder="Jr., Sr., III" {...register('suffix')} />
            </div>
            <div>
              <Label required>Username</Label>
              <Input
                error={!!errors.username}
                hint={errors.username?.message}
                {...register('username')}
              />
            </div>
            <div>
              <Label required>Email</Label>
              <Input
                type="email"
                error={!!errors.email}
                hint={errors.email?.message}
                {...register('email')}
              />
            </div>
            <div>
              <Label required>Cluster</Label>
              <Input
                error={!!errors.cluster}
                hint={errors.cluster?.message}
                {...register('cluster')}
              />
            </div>
            <div>
              <Label required>Office</Label>
              <Input
                error={!!errors.office}
                hint={errors.office?.message}
                {...register('office')}
              />
            </div>
            <div>
              <Label required>Building</Label>
              <Input
                error={!!errors.bldgname}
                hint={errors.bldgname?.message}
                {...register('bldgname')}
              />
            </div>
            <div>
              <Label required>Position</Label>
              <Input
                error={!!errors.encoder_position}
                hint={errors.encoder_position?.message}
                {...register('encoder_position')}
              />
            </div>
            <div>
              <Label required>User Type</Label>
              <Select
                options={USER_TYPE_OPTIONS}
                value={String(watch('usertype'))}
                onChange={(v) => setValue('usertype', Number(v))}
                error={!!errors.usertype}
              />
            </div>
            <div>
              <Label>Zone</Label>
              <Input {...register('zone')} />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <Button
              type="submit"
              isLoading={isSubmitting || mutation.isPending}
              loadingText="Saving..."
            >
              {isEdit ? 'Update User' : 'Create User'}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.push('/users')}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
