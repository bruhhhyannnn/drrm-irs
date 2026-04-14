'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { Search, Eye } from 'lucide-react';
import { useEvents } from '@/hooks';
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
  Spinner,
  PageError,
} from '@/components/ui';

export default function EventsPage() {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const { data: events, isPending, isFetching, error } = useEvents(debouncedQuery);

  if (error) return <PageError message={error.message} />;

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 400);
    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="space-y-6">
      <PageBreadcrumb pageTitle="Events" />

      <div className="flex items-center gap-3">
        <div className="relative max-w-sm flex-1">
          <Search size={16} className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search events..."
            className="pl-9"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date & Time</TableHead>
            <TableHead>Event Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {events?.map((event) => (
            <TableRow key={event.id}>
              <TableCell>
                {event.started_at ? format(new Date(event.started_at), 'MMM d, yyyy h:mm a') : '—'}
              </TableCell>
              <TableCell className="font-medium text-gray-900 dark:text-white">
                {event.name}
              </TableCell>
              <TableCell>
                <Badge
                  color={
                    event.status.name === 'active'
                      ? 'success'
                      : event.status.name === 'completed'
                        ? 'primary'
                        : 'warning'
                  }
                  size="sm"
                >
                  {event.status.name}
                </Badge>
              </TableCell>
              <TableCell>
                <Link
                  href={`/events/details?id=${event.id}`}
                  className="text-brand-500 hover:text-brand-600 inline-flex items-center gap-1.5 text-sm"
                >
                  <Eye size={14} />
                  View
                </Link>
              </TableCell>
            </TableRow>
          ))}
          {(isPending || isFetching) && (
            <TableRow>
              <TableCell className="py-10" colSpan={5}>
                <Spinner center />
              </TableCell>
            </TableRow>
          )}
          {!events?.length && !isPending && !isFetching && (
            <TableRow>
              <TableCell className="py-10 text-center text-gray-400" colSpan={5}>
                No events found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
