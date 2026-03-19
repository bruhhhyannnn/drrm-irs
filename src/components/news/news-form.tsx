'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase, logActivity, newsSchema, type NewsFormData } from '@/lib';
import { PageBreadcrumb } from '@/components/common';
import { Input, Label, Select, Textarea, Button } from '@/components/ui';
import { Controller } from 'react-hook-form';
import toast from 'react-hot-toast';

const CATEGORY_OPTIONS = [
  { value: 'announcement', label: 'Announcement' },
  { value: 'alert', label: 'Alert' },
  { value: 'advisory', label: 'Advisory' },
  { value: 'news', label: 'News' },
];

interface NewsFormProps {
  editId?: string;
}

export function NewsForm({ editId }: NewsFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const isEdit = !!editId;

  const { data: existing } = useQuery({
    queryKey: ['news-item', editId],
    queryFn: async () => {
      const { data, error } = await supabase.from('news').select('*').eq('id', editId).single();
      if (error) throw error;
      return data;
    },
    enabled: isEdit,
  });

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<NewsFormData>({
    resolver: zodResolver(newsSchema),
    defaultValues: { is_active: true },
  });

  useEffect(() => {
    if (existing) {
      reset({
        title: existing.title ?? '',
        content: existing.content ?? '',
        author: existing.author ?? '',
        category: existing.category ?? '',
        is_active: existing.is_active ?? true,
        image_url: existing.image_url ?? '',
        source_url: existing.source_url ?? '',
      });
    }
  }, [existing, reset]);

  const mutation = useMutation({
    mutationFn: async (data: NewsFormData) => {
      const payload = { ...data, updated_at: new Date().toISOString() };
      if (isEdit) {
        const { error } = await supabase.from('news').update(payload).eq('id', editId);
        if (error) throw error;
        await logActivity({
          action: 'update',
          docID: editId!,
          docName: data.title,
          module: 'News',
        });
      } else {
        const { data: created, error } = await supabase
          .from('news')
          .insert({ ...payload, published_at: new Date().toISOString() })
          .select()
          .single();
        if (error) throw error;
        await logActivity({
          action: 'create',
          docID: created.id,
          docName: data.title,
          module: 'News',
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['news'] });
      toast.success(isEdit ? 'News updated' : 'News created');
      router.push('/news');
    },
    onError: (err: Error) => toast.error(err.message),
  });

  return (
    <div className="space-y-6">
      <PageBreadcrumb pageTitle={isEdit ? 'Edit News' : 'Add News'} />

      <div className="max-w-2xl rounded-xl border border-gray-200 bg-white p-6 dark:border-white/5 dark:bg-white/3">
        <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="space-y-5">
          <div>
            <Label required>Title</Label>
            <Input error={!!errors.title} hint={errors.title?.message} {...register('title')} />
          </div>

          <div>
            <Label required>Content</Label>
            <Textarea
              rows={6}
              error={!!errors.content}
              hint={errors.content?.message}
              {...register('content')}
            />
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <Label required>Author</Label>
              <Input
                error={!!errors.author}
                hint={errors.author?.message}
                {...register('author')}
              />
            </div>
            <div>
              <Label required>Category</Label>
              <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <Select
                    options={CATEGORY_OPTIONS}
                    value={field.value}
                    onChange={field.onChange}
                    error={!!errors.category}
                    hint={errors.category?.message}
                  />
                )}
              />
            </div>
            <div>
              <Label>Image URL</Label>
              <Input
                type="url"
                placeholder="https://..."
                error={!!errors.image_url}
                hint={errors.image_url?.message}
                {...register('image_url')}
              />
            </div>
            <div>
              <Label>Source URL</Label>
              <Input
                type="url"
                placeholder="https://..."
                error={!!errors.source_url}
                hint={errors.source_url?.message}
                {...register('source_url')}
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="is_active"
              {...register('is_active')}
              className="h-4 w-4 rounded border-gray-300"
            />
            <Label htmlFor="is_active" className="mb-0">
              Published
            </Label>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <Button
              type="submit"
              isLoading={isSubmitting || mutation.isPending}
              loadingText="Saving..."
            >
              {isEdit ? 'Update' : 'Publish'}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.push('/news')}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
