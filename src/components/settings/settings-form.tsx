'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreateSetting, useUpdateSetting, useSettingsTable } from '@/hooks';
import { PageBreadcrumb } from '@/components/common';
import { Input, Label, Button } from '@/components/ui';
import type { SettingsTable } from '@/actions';
import { toSettingsPath } from '@/lib';

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  isActive: z.boolean().default(true),
});

type FormData = z.infer<typeof schema>;

interface SettingsFormProps {
  title: string;
  table: SettingsTable;
  editId?: string;
}

export function SettingsForm({ title, table, editId }: SettingsFormProps) {
  const router = useRouter();
  const isEdit = !!editId;
  const basePath = toSettingsPath(title);

  const { data: items } = useSettingsTable(table);
  const createMutation = useCreateSetting(table);
  const updateMutation = useUpdateSetting(table);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  useEffect(() => {
    if (isEdit && items) {
      const item = items.find((i: Record<string, unknown>) => i.id === editId);
      if (item) reset({ name: String(item.name ?? ''), isActive: Boolean(item.is_active) });
    }
  }, [isEdit, items, editId, reset]);

  const onSubmit = async (data: FormData) => {
    const payload = { name: data.name, isActive: data.isActive };
    if (isEdit) {
      await updateMutation.mutateAsync({ id: editId!, data: payload });
    } else {
      await createMutation.mutateAsync(payload);
    }
    router.push(basePath);
  };

  return (
    <div className="space-y-6">
      <PageBreadcrumb pageTitle={`${isEdit ? 'Edit' : 'Add'} ${title.replace(/s$/, '')}`} />

      <div className="max-w-lg rounded-xl border border-gray-200 bg-white p-6 dark:border-white/5 dark:bg-white/3">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <Label required>Name</Label>
            <Input
              placeholder={`Enter ${title.replace(/s$/, '').toLowerCase()} name`}
              error={!!errors.name}
              hint={errors.name?.message}
              {...register('name')}
            />
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isActive"
              {...register('isActive')}
              className="h-4 w-4 rounded border-gray-300"
            />
            <Label htmlFor="isActive" className="mb-0">
              Active
            </Label>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <Button
              type="submit"
              isLoading={isSubmitting || createMutation.isPending || updateMutation.isPending}
              loadingText="Saving..."
            >
              {isEdit ? 'Update' : 'Create'}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.push(basePath)}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
