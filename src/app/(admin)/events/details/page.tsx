'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { format } from 'date-fns';
import { PageBreadcrumb } from '@/components/common/page-breadcrumb';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';

function EventDetailsContent() {
  const searchParams = useSearchParams();
  const eventId = searchParams.get('id');

  const { data: event, isLoading: loadingEvent } = useQuery({
    queryKey: ['event-detail', eventId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('event_id', eventId)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!eventId,
  });

  const { data: reports, isLoading: loadingReports } = useQuery({
    queryKey: ['event-reports', eventId],
    queryFn: async () => {
      const { data, error } = await supabase.from('reports').select('*').eq('event_id', eventId);
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!eventId,
  });

  const { data: checklist } = useQuery({
    queryKey: ['event-checklist', eventId],
    queryFn: async () => {
      const { data } = await supabase.from('checklists').select('*').eq('event_id', eventId);
      return data ?? [];
    },
    enabled: !!eventId,
  });

  if (loadingEvent) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="border-brand-500 h-10 w-10 animate-spin rounded-full border-4 border-t-transparent" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <p className="text-gray-400">Event not found</p>
      </div>
    );
  }

  const totalAffected = reports?.reduce((sum, r) => {
    return (
      sum +
      (r.students ?? 0) +
      (r.facultymembers ?? 0) +
      (r.adminmembers ?? 0) +
      (r.guests ?? 0) +
      (r.healthworkers ?? 0) +
      (r.securitypersonnel ?? 0)
    );
  }, 0);

  return (
    <div className="space-y-6">
      <PageBreadcrumb pageTitle="Event Details" />

      {/* Event header */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-white/5 dark:bg-white/3">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{event.eventname}</h1>
            <p className="mt-1 text-sm text-gray-500">{event.eventdescription}</p>
          </div>
          <Badge
            color={
              event.status === 'active'
                ? 'success'
                : event.status === 'completed'
                  ? 'primary'
                  : 'warning'
            }
          >
            {event.status}
          </Badge>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {[
            { label: 'Category', value: event.category },
            { label: 'Location', value: event.location },
            {
              label: 'Started',
              value: event.timestampstart
                ? format(new Date(event.timestampstart), 'MMM d, yyyy h:mm a')
                : '—',
            },
            {
              label: 'Ended',
              value: event.timestampend
                ? format(new Date(event.timestampend), 'MMM d, yyyy h:mm a')
                : 'Ongoing',
            },
            { label: 'Incident Commander', value: event.incidentcommander },
            { label: 'Safety Officer', value: event.safetysecurityofficer },
            { label: 'Public Info Officer', value: event.publicinformationofficer },
            { label: 'Total Affected', value: totalAffected ?? '—' },
          ].map(({ label, value }) => (
            <div key={label} className="rounded-lg bg-gray-50 p-3 dark:bg-white/3">
              <p className="text-xs text-gray-500">{label}</p>
              <p className="mt-0.5 text-sm font-medium text-gray-900 dark:text-white">{value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Reports table */}
      <div>
        <h2 className="mb-3 text-base font-semibold text-gray-800 dark:text-white">
          Reports ({reports?.length ?? 0})
        </h2>
        {loadingReports ? (
          <div className="flex h-20 items-center justify-center">
            <div className="border-brand-500 h-8 w-8 animate-spin rounded-full border-4 border-t-transparent" />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cluster</TableHead>
                <TableHead>Office</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Students</TableHead>
                <TableHead>Faculty</TableHead>
                <TableHead>Casualties</TableHead>
                <TableHead>Missing</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports?.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>{r.cluster}</TableCell>
                  <TableCell>{r.office}</TableCell>
                  <TableCell>{r.exactlocation ?? r.bldg_name}</TableCell>
                  <TableCell>{r.students ?? 0}</TableCell>
                  <TableCell>{r.facultymembers ?? 0}</TableCell>
                  <TableCell>
                    {r.numcasualties > 0 ? (
                      <Badge color="error" size="sm">
                        {r.numcasualties}
                      </Badge>
                    ) : (
                      0
                    )}
                  </TableCell>
                  <TableCell>
                    {r.nummissingpersons > 0 ? (
                      <Badge color="warning" size="sm">
                        {r.nummissingpersons}
                      </Badge>
                    ) : (
                      0
                    )}
                  </TableCell>
                  <TableCell>
                    {r.created_at ? format(new Date(r.created_at), 'MMM d, yyyy') : '—'}
                  </TableCell>
                </TableRow>
              ))}
              {!reports?.length && (
                <TableRow>
                  <TableCell className="py-8 text-center text-gray-400" colSpan={8}>
                    No reports submitted yet
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Checklist */}
      {checklist && checklist.length > 0 && (
        <div>
          <h2 className="mb-3 text-base font-semibold text-gray-800 dark:text-white">
            Checklist ({checklist.length})
          </h2>
          <div className="space-y-2">
            {checklist.map((item: Record<string, unknown>) => (
              <div
                key={String(item.id)}
                className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3 dark:border-white/5 dark:bg-white/3"
              >
                <div
                  className={`h-4 w-4 rounded-full ${item.isDone ? 'bg-success-500' : 'bg-gray-300 dark:bg-gray-600'}`}
                />
                <span
                  className={`text-sm ${item.isDone ? 'text-gray-400 line-through' : 'text-gray-800 dark:text-white'}`}
                >
                  {String(item.action ?? item.name ?? '')}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function EventDetailsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-[50vh] items-center justify-center">
          <div className="border-brand-500 h-10 w-10 animate-spin rounded-full border-4 border-t-transparent" />
        </div>
      }
    >
      <EventDetailsContent />
    </Suspense>
  );
}
