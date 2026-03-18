'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreateSetting, useUpdateSetting, useSettingsTable } from '@/hooks/use-settings';
import { PageBreadcrumb } from '@/components/common/page-breadcrumb';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/form';
import { Button } from '@/components/ui/button';

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  isActive: z.boolean().default(true),
});

type FormData = z.infer<typeof schema>;

type SettingsTable =
  | 'event-scenarios'
  | 'event-actions'
  | 'locations'
  | 'user-types'
  | 'colleges-units'
  | 'buildings-zones'
  | 'observee-areas'
  | 'observee-roles'
  | 'remarks';

interface SettingsFormProps {
  title: string;
  table: SettingsTable;
  module: string;
  nameKey: string;
  basePath: string;
  editId?: string;
}

export function SettingsForm({
  title,
  table,
  module,
  nameKey,
  basePath,
  editId,
}: SettingsFormProps) {
  const router = useRouter();
  const isEdit = !!editId;

  const { data: items } = useSettingsTable(table);
  const createMutation = useCreateSetting(table, module);
  const updateMutation = useUpdateSetting(table, module);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  useEffect(() => {
    if (isEdit && items) {
      const item = items.find((i: Record<string, unknown>) => i.id === editId);
      if (item) reset({ name: String(item[nameKey] ?? ''), isActive: Boolean(item.isActive) });
    }
  }, [isEdit, items, editId, nameKey, reset]);

  const onSubmit = async (data: FormData) => {
    const payload = { [nameKey]: data.name, isActive: data.isActive };
    if (isEdit) {
      await updateMutation.mutateAsync({ id: editId!, values: payload });
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
            <Button type="submit" isLoading={isSubmitting} loadingText="Saving...">
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
