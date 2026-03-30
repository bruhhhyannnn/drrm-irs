'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { Search } from 'lucide-react';
import { useReports } from '@/hooks';
import { PageBreadcrumb } from '@/components/common';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Badge,
  Input,
  Pagination,
  Spinner,
  PageError,
} from '@/components/ui';
import type { Report } from '@/types/database';

const PER_PAGE = 10;

export default function ReportsPage() {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const { data, isLoading, error } = useReports(page, query);

  const totalAffected = (r: Report) =>
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

  if (isLoading) return <Spinner center />;
  if (error) return <PageError message={error.message} />;

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
            <TableHead>Building</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Encoder Position</TableHead>
            <TableHead>Event Type</TableHead>
            <TableHead>Hazard Type</TableHead>
            <TableHead>Faculty</TableHead>
            <TableHead>Admin</TableHead>
            <TableHead>Reps</TableHead>
            <TableHead>RA</TableHead>
            <TableHead>Students</TableHead>
            <TableHead>PhilCare</TableHead>
            <TableHead>Security</TableHead>
            <TableHead>Construction</TableHead>
            <TableHead>Tenants</TableHead>
            <TableHead>Health</TableHead>
            <TableHead>Non-Academic</TableHead>
            <TableHead>Guests</TableHead>
            <TableHead>Total Affected</TableHead>
            <TableHead>Casualties</TableHead>
            <TableHead>Missing</TableHead>
            <TableHead>Missing Names</TableHead>
            <TableHead>Casualty Details</TableHead>
            <TableHead>Damage Assessment</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Last Modified</TableHead>
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
              <TableCell>{report.bldg_name}</TableCell>
              <TableCell className="max-w-50 truncate">
                {report.exactlocation}
              </TableCell>
              <TableCell>{report.encoder_position}</TableCell>
              <TableCell>{report.event_type}</TableCell>
              <TableCell>{report.hazard_type}</TableCell>
              <TableCell>{report.facultymembers ?? 0}</TableCell>
              <TableCell>{report.adminmembers ?? 0}</TableCell>
              <TableCell>{report.repsmembers ?? 0}</TableCell>
              <TableCell>{report.ramembers ?? 0}</TableCell>
              <TableCell>{report.students ?? 0}</TableCell>
              <TableCell>{report.philcarestaff ?? 0}</TableCell>
              <TableCell>{report.securitypersonnel ?? 0}</TableCell>
              <TableCell>{report.constructionworkers ?? 0}</TableCell>
              <TableCell>{report.tenants ?? 0}</TableCell>
              <TableCell>{report.healthworkers ?? 0}</TableCell>
              <TableCell>{report.nonacademicstaff ?? 0}</TableCell>
              <TableCell>{report.guests ?? 0}</TableCell>
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
              <TableCell className="max-w-50 truncate">{report.namesofmissingpersons}</TableCell>
              <TableCell className="max-w-50 truncate">{report.identityandconditionofcasualties}</TableCell>
              <TableCell className="max-w-50 truncate">{report.damageassessment}</TableCell>
              <TableCell>
                {report.created_at ? format(new Date(report.created_at), 'MMM d, yyyy') : '—'}
              </TableCell>
              <TableCell>
                {report.last_modified ? format(new Date(report.last_modified), 'MMM d, yyyy') : '—'}
              </TableCell>
            </TableRow>
          ))}
          {!data?.data.length && (
            <TableRow>
              <TableCell className="py-10 text-center text-gray-400" colSpan={28}>
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
