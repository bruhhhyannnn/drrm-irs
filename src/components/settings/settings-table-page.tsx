'use client';

import { useState } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import { useSettingsTable, useDeleteSetting } from '@/hooks';
import { PageBreadcrumb } from '@/components/common';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Badge,
  Button,
  Input,
  Spinner,
} from '@/components/ui';

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

interface SettingsPageProps {
  title: string;
  table: SettingsTable;
  module: string;
  nameKey: string;
  basePath: string;
}

export function SettingsTablePage({ title, table, module, nameKey, basePath }: SettingsPageProps) {
  const [query, setQuery] = useState('');
  const { data: items, isLoading } = useSettingsTable(table);
  const deleteMutation = useDeleteSetting(table, module);

  const filtered = items?.filter((item: Record<string, unknown>) =>
    String(item[nameKey] ?? '')
      .toLowerCase()
      .includes(query.toLowerCase())
  );

  const handleDelete = (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    deleteMutation.mutate(id);
  };

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

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell className="py-10 text-center" colSpan={4}>
                <Spinner center />
              </TableCell>
            </TableRow>
          ) : (
            filtered?.map((item: Record<string, unknown>) => (
              <TableRow key={String(item.id)}>
                <TableCell className="font-medium text-gray-900 dark:text-white">
                  {String(item[nameKey] ?? '—')}
                </TableCell>
                <TableCell>
                  <Badge color={item.isActive ? 'success' : 'error'} size="sm">
                    {item.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </TableCell>
                <TableCell>
                  {item.created_at ? format(new Date(String(item.created_at)), 'MMM d, yyyy') : '—'}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Link href={`${basePath}/edit/${String(item.id)}`}>
                      <button className="hover:text-brand-500 text-gray-400">
                        <Pencil size={15} />
                      </button>
                    </Link>
                    <button
                      onClick={() => handleDelete(String(item.id), String(item[nameKey] ?? ''))}
                      className="hover:text-error-500 text-gray-400"
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
          {!isLoading && !filtered?.length && (
            <TableRow>
              <TableCell className="py-10 text-center text-gray-400" colSpan={4}>
                No {title.toLowerCase()} found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
