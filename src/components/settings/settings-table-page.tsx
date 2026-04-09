'use client';

import { useState } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import { useSettingsTable, useDeleteSetting } from '@/hooks';
import { PageBreadcrumb } from '@/components/common';
import type { SettingsTable } from '@/actions';
import { toSettingsPath } from '@/lib';
import type { ColumnDef } from '@tanstack/react-table';
import { DataTable, Badge, Button, Input } from '@/components/ui';

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
  const { data: items, isLoading } = useSettingsTable(table);
  const deleteMutation = useDeleteSetting(table);

  const basePath = toSettingsPath(title);

  const handleDelete = (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    deleteMutation.mutate(id);
  };

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
        <div className="flex items-center gap-3">
          <Link href={`${basePath}/edit/${item.id}`}>
            <button className="hover:text-brand-500 text-gray-400">
              <Pencil size={15} />
            </button>
          </Link>
          <button
            onClick={() => handleDelete(item.id, item.name)}
            className="hover:text-error-500 text-gray-400"
            disabled={deleteMutation.isPending}
          >
            <Trash2 size={15} />
          </button>
        </div>
      ),
      enableSorting: false,
    },
  ];

  return (
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
        globalFilter={query}
        loading={isLoading}
        emptyMessage={`No ${title.toLowerCase()} found`}
      />
    </div>
  );
}
