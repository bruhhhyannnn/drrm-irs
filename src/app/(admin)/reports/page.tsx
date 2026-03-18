'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { Search } from 'lucide-react';
import { useReports } from '@/hooks/use-reports';
import { PageBreadcrumb } from '@/components/common/page-breadcrumb';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Pagination } from '@/components/ui/pagination';

const PER_PAGE = 10;

export default function ReportsPage() {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const { data, isLoading, error } = useReports(page, query);

  const totalAffected = (r: (typeof data)['data'][0]) =>
    (r.students ?? 0) +
    (r.facultymembers ?? 0) +
    (r.adminmembers ?? 0) +
    (r.repsmembers ?? 0) +
    (r.ramembers ?? 0) +
    (r.philcarestaff ?? 0) +
    (r.securitypersonnel ?? 0) +
    (r.constructionworkers ?? 0) +
    (r.tenants ?? 0) +
    (r.healthworkers ?? 0) +
    (r.nonacademicstaff ?? 0) +
    (r.guests ?? 0);

  if (isLoading) return <Spinner />;
  if (error) return <Err message={error.message} />;

  const totalPages = Math.ceil((data?.total ?? 0) / PER_PAGE);

  return (
    <div className="space-y-6">
      <PageBreadcrumb pageTitle="Reports" />

      <div className="flex items-center gap-3">
        <div className="relative max-w-sm flex-1">
          <Search size={16} className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
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

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Event Name</TableHead>
            <TableHead>Cluster</TableHead>
            <TableHead>Office</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Total Affected</TableHead>
            <TableHead>Casualties</TableHead>
            <TableHead>Missing</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.data.map((report) => (
            <TableRow key={report.id}>
              <TableCell className="font-medium text-gray-900 dark:text-white">
                {report.eventname}
              </TableCell>
              <TableCell>
                <Badge color="primary" size="sm">
                  {report.cluster}
                </Badge>
              </TableCell>
              <TableCell>{report.office}</TableCell>
              <TableCell className="max-w-50 truncate">
                {report.exactlocation || report.bldg_name}
              </TableCell>
              <TableCell className="font-medium">{totalAffected(report)}</TableCell>
              <TableCell>
                {report.numcasualties > 0 ? (
                  <Badge color="error" size="sm">
                    {report.numcasualties}
                  </Badge>
                ) : (
                  <span className="text-gray-400">0</span>
                )}
              </TableCell>
              <TableCell>
                {report.nummissingpersons > 0 ? (
                  <Badge color="warning" size="sm">
                    {report.nummissingpersons}
                  </Badge>
                ) : (
                  <span className="text-gray-400">0</span>
                )}
              </TableCell>
              <TableCell>
                {report.created_at ? format(new Date(report.created_at), 'MMM d, yyyy') : '—'}
              </TableCell>
            </TableRow>
          ))}
          {!data?.data.length && (
            <TableRow>
              <TableCell className="py-10 text-center text-gray-400" colSpan={8}>
                No reports found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}

function Spinner() {
  return (
    <div className="flex h-[50vh] items-center justify-center">
      <div className="border-brand-500 h-10 w-10 animate-spin rounded-full border-4 border-t-transparent" />
    </div>
  );
}

function Err({ message }: { message: string }) {
  return (
    <div className="flex h-[50vh] items-center justify-center">
      <p className="text-error-500">{message}</p>
    </div>
  );
}
