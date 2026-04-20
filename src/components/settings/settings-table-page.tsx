'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import { useSettingsTable, useDeleteSetting } from '@/hooks';
import { PageBreadcrumb } from '@/components/common';
import type { SettingsTable } from '@/actions';
import { toSettingsPath } from '@/lib';
import type { ColumnDef } from '@tanstack/react-table';
import { DataTable, Badge, Button, Input, PageError, ConfirmDialog } from '@/components/ui';

interface SettingsPageProps {
  title: string;
  table: SettingsTable;
}

type SettingItem = {
  id: string;
  name: string;
  is_active: boolean;
  created_at: string;
};

export function SettingsTablePage({ title, table }: SettingsPageProps) {
  const [query, setQuery] = useState('');
  const [debounceQuery, setDebounceQuery] = useState('');
  const { data: items, isPending, isFetching, error } = useSettingsTable(table);
  const deleteMutation = useDeleteSetting(table);
  const [deleteId, setDeleteId] = useState('');

  const basePath = toSettingsPath(title);

  const columns: ColumnDef<SettingItem, unknown>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ getValue }) => (
        <span className="font-medium text-gray-900 dark:text-white">
          {String(getValue() ?? '—')}
        </span>
      ),
    },
    {
      accessorKey: 'is_active',
      header: 'Status',
      cell: ({ row: { original: item } }) => (
        <Badge color={item.is_active ? 'success' : 'error'} size="sm">
          {item.is_active ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
    {
      accessorKey: 'created_at',
      header: 'Created',
      cell: ({ row: { original: item } }) =>
        item.created_at ? format(new Date(item.created_at), 'MMM d, yyyy') : '—',
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row: { original: item } }) => (
        <div className="flex flex-row items-center gap-3">
          {/* TODO: use modals here */}
          <Link href={`${basePath}/edit/${item.id}`}>
            <button className="hover:text-brand-500 text-gray-400">
              <Pencil size={15} />
            </button>
          </Link>
          <button
            className="hover:text-error-500 text-gray-400 transition-all duration-100"
            disabled={deleteMutation.isPending}
            onClick={() => setDeleteId(item.id)}
          >
            <Trash2 size={15} />
          </button>
        </div>
      ),
      enableSorting: false,
    },
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounceQuery(query);
    }, 400);
    return () => clearTimeout(timer);
  }, [query]);

  if (error) return <PageError message={error.message} />;

  return (
    <>
      <div className="space-y-6">
        <PageBreadcrumb pageTitle={title} />

        <div className="flex items-center justify-between gap-3">
          <div className="relative max-w-sm flex-1">
            <Search size={16} className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder={`Search ${title.toLowerCase()}...`}
              className="pl-9"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <Link href={`${basePath}/create`}>
            <Button startIcon={<Plus size={16} />}>Add {title.replace(/s$/, '')}</Button>
          </Link>
        </div>

        <DataTable
          columns={columns}
          data={(items ?? []) as SettingItem[]}
          globalFilter={debounceQuery}
          loading={isPending || isFetching}
          emptyMessage={`No ${title.toLowerCase()} found`}
        />
      </div>

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId('')}
        onConfirm={() => deleteMutation.mutate(deleteId, { onSuccess: () => setDeleteId('') })}
        title="Delete report"
        message="This report will be permanently deleted. This cannot be undone."
        confirmLabel="Delete"
        isLoading={deleteMutation.isPending}
      />
    </>
  );
}
