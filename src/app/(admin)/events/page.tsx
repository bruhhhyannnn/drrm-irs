'use client';

import { useState } from 'react';
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
  const { data: events, isLoading, error } = useEvents(query);

  if (isLoading) return <Spinner center />;
  if (error) return <PageError message={error.message} />;

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
            <TableHead>Category</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {events?.map((event) => (
            <TableRow key={event.event_id}>
              <TableCell>
                {event.timestampstart
                  ? format(new Date(event.timestampstart), 'MMM d, yyyy h:mm a')
                  : '—'}
              </TableCell>
              <TableCell className="font-medium text-gray-900 dark:text-white">
                {event.eventname}
              </TableCell>
              <TableCell>{event.category}</TableCell>
              <TableCell>{event.location}</TableCell>
              <TableCell>
                <Badge
                  color={
                    event.status === 'active'
                      ? 'success'
                      : event.status === 'completed'
                        ? 'primary'
                        : 'warning'
                  }
                  size="sm"
                >
                  {event.status}
                </Badge>
              </TableCell>
              <TableCell>
                <Link
                  href={`/events/details?id=${event.event_id}`}
                  className="text-brand-500 hover:text-brand-600 inline-flex items-center gap-1.5 text-sm"
                >
                  <Eye size={14} />
                  View
                </Link>
              </TableCell>
            </TableRow>
          ))}
          {!events?.length && (
            <TableRow>
              <TableCell className="py-10 text-center text-gray-400" colSpan={6}>
                No events found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
