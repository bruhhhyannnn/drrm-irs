'use client';

import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Search } from 'lucide-react';
import { useReports } from '@/hooks';
import { PageBreadcrumb } from '@/components/common';
import type { getReports } from '@/actions/reports';
import type { ColumnDef } from '@tanstack/react-table';
import { DataTable, Badge, Input, Pagination, PageError } from '@/components/ui';

type ReportRow = Awaited<ReturnType<typeof getReports>>['data'][number];

const PER_PAGE = 10;

function totalAffected(r: ReportRow) {
  return (
    (r.students ?? 0) +
    (r.faculty_members ?? 0) +
    (r.admin_members ?? 0) +
    (r.reps_members ?? 0) +
    (r.ra_members ?? 0) +
    (r.philcare_staff ?? 0) +
    (r.security_personnel ?? 0) +
    (r.construction_workers ?? 0) +
    (r.tenants ?? 0) +
    (r.health_workers ?? 0) +
    (r.non_academic_staff ?? 0) +
    (r.guests ?? 0)
  );
}

const columns: ColumnDef<ReportRow, unknown>[] = [
  {
    id: 'cluster',
    header: 'Cluster',
    accessorFn: (r) => r.cluster.name,
    cell: ({ row: { original: r } }) => (
      <Badge color="primary" size="sm">
        {r.cluster.name}
      </Badge>
    ),
  },
  {
    id: 'unit',
    header: 'Unit',
    accessorFn: (r) => r.unit?.name ?? '',
    cell: ({ row: { original: r } }) => r.unit?.name ?? '—',
  },
  {
    id: 'location',
    header: 'Location',
    accessorFn: (r) => r.location?.name ?? '',
    cell: ({ row: { original: r } }) => (
      <span className="max-w-50 truncate">{r.location?.name ?? '—'}</span>
    ),
  },
  {
    id: 'submitted_by',
    header: 'Submitted By',
    accessorFn: (r) => (r.user ? `${r.user.first_name} ${r.user.last_name}` : ''),
    cell: ({ row: { original: r } }) => (r.user ? `${r.user.first_name} ${r.user.last_name}` : '—'),
  },
  {
    id: 'total_affected',
    header: 'Total Affected',
    accessorFn: (r) => totalAffected(r),
    cell: ({ row: { original: r } }) => <span className="font-medium">{totalAffected(r)}</span>,
  },
  {
    id: 'casualties',
    header: 'Casualties',
    accessorFn: (r) => r.casualties_count ?? 0,
    cell: ({ row: { original: r } }) =>
      (r.casualties_count ?? 0) > 0 ? (
        <Badge color="error" size="sm">
          {r.casualties_count}
        </Badge>
      ) : (
        <span className="text-gray-400">0</span>
      ),
  },
  {
    id: 'missing',
    header: 'Missing',
    accessorFn: (r) => r.missing_count ?? 0,
    cell: ({ row: { original: r } }) =>
      (r.missing_count ?? 0) > 0 ? (
        <Badge color="warning" size="sm">
          {r.missing_count}
        </Badge>
      ) : (
        <span className="text-gray-400">0</span>
      ),
  },
  {
    id: 'date',
    header: 'Date',
    accessorFn: (r) => r.created_at ?? '',
    cell: ({ row: { original: r } }) =>
      r.created_at ? format(new Date(r.created_at), 'MMM d, yyyy') : '—',
  },
];

export default function ReportsPage() {
  const [query, setQuery] = useState('');
  const [debounceQuery, setDebounceQuery] = useState('');
  const [page, setPage] = useState(1);
  const { data, isPending, isFetching, error } = useReports(page, debounceQuery);

  if (error) return <PageError message={error.message} />;

  const totalPages = Math.ceil((data?.total ?? 0) / PER_PAGE);

  useEffect(() => {
    const timer = setTimeout(() => setDebounceQuery(query), 400);
    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="space-y-6">
      <PageBreadcrumb pageTitle="Reports" />

      <div className="flex items-center gap-3">
        <div className="relative max-w-sm flex-1">
          <Search
            size={16}
            // TODO: icon on dark mode not showing
            className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400 dark:text-gray-600"
          />
          <Input
            placeholder="Search reports..."
            className="pl-9"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
          />
        </div>
        <p className="text-sm text-gray-500">{data?.total ?? 0} total</p>
      </div>

      <DataTable
        columns={columns}
        data={data?.data ?? []}
        loading={isPending || isFetching}
        emptyMessage="No reports found"
      />

      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}
