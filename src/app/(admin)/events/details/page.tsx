'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { format } from 'date-fns';
import { useEvent, useEventReports } from '@/hooks';
import { PageBreadcrumb } from '@/components/common';
import { Badge, Spinner } from '@/components/ui';
import { CLUSTERS, HEADCOUNT_FIELDS } from '@/types';
import {
  Users,
  MapPin,
  Calendar,
  Clock,
  AlertTriangle,
  UserX,
  FileText,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useState } from 'react';
import type { getReportsByEvent } from '@/actions/reports';

type EventReport = Awaited<ReturnType<typeof getReportsByEvent>>[number];

// ─── Main content ─────────────────────────────────────────
function EventDetailsContent() {
  const searchParams = useSearchParams();
  const eventId = searchParams.get('id') ?? undefined;

  const { data: event, isPending: loadingEvent } = useEvent(eventId);
  const { data: reports = [], isPending: loadingReports } = useEventReports(eventId);

  if (loadingEvent)
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Spinner />
      </div>
    );

  if (!event) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <p className="text-gray-400">Event not found</p>
      </div>
    );
  }

  // Group reports by cluster, respecting CLUSTERS order
  const reportsByCluster = CLUSTERS.reduce(
    (acc, cluster) => {
      acc[cluster] = reports.filter((r) => r.cluster.name === cluster);
      return acc;
    },
    {} as Record<string, EventReport[]>
  );

  // Clusters that actually have reports
  const activeClusters = CLUSTERS.filter((c) => reportsByCluster[c].length > 0);

  // Clusters that have zero reports (pending)
  const pendingClusters = CLUSTERS.filter((c) => reportsByCluster[c].length === 0);

  const totalCasualties = reports.reduce((s, r) => s + (r.casualties_count ?? 0), 0);
  const totalMissing = reports.reduce((s, r) => s + (r.missing_count ?? 0), 0);
  const totalReports = reports.length;
  const totalAffected = reports.reduce(
    (s, r) => s + HEADCOUNT_FIELDS.reduce((sum, { key }) => sum + ((r as any)[key] ?? 0), 0),
    0
  );

  return (
    <div className="space-y-6">
      <PageBreadcrumb pageTitle="Event Details" />

      {/* Event header card */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-white/5 dark:bg-white/3">
        <div className="mt-2 flex flex-wrap gap-2">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{event.name}</h1>
          <div>
            {event.status.name && (
              <Badge
                color={
                  event.status.name === 'ongoing'
                    ? 'success'
                    : event.status.name === 'completed'
                      ? 'primary'
                      : 'warning'
                }
                size="sm"
              >
                {event.status.name}
              </Badge>
            )}
          </div>
        </div>

        {/* Meta info row */}
        <div className="mt-5 flex flex-wrap gap-4 text-sm text-gray-500">
          {event.location && (
            <div className="flex items-center gap-1.5">
              <MapPin size={14} />
              {event.location.name}
            </div>
          )}
          {event.started_at && (
            <div className="flex items-center gap-1.5">
              <Calendar size={14} />
              {format(new Date(event.started_at), 'MMM d, yyyy')}
            </div>
          )}
          {event.started_at && (
            <div className="flex items-center gap-1.5">
              <Clock size={14} />
              {format(new Date(event.started_at), 'h:mm a')}
              {event.ended_at && ` — ${format(new Date(event.ended_at), 'h:mm a')}`}
            </div>
          )}
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard
          label="Total Affected"
          value={totalAffected.toLocaleString()}
          icon={<Users size={16} />}
        />
        <StatCard label="Reports Submitted" value={totalReports} icon={<FileText size={16} />} />
        <StatCard
          label="Total Casualties"
          value={totalCasualties}
          icon={<AlertTriangle size={16} />}
          accent={totalCasualties > 0}
        />
        <StatCard
          label="Missing Persons"
          value={totalMissing}
          icon={<UserX size={16} />}
          accent={totalMissing > 0}
        />
      </div>

      {loadingReports ? (
        <div className="flex h-40 items-center justify-center">
          <Spinner size="md" />
        </div>
      ) : reports.length === 0 ? (
        <div className="flex h-40 items-center justify-center rounded-xl border border-gray-200 bg-white dark:border-white/5 dark:bg-white/3">
          <p className="text-sm text-gray-400">No reports submitted yet</p>
        </div>
      ) : (
        <>
          {/* Per-cluster board — Monday.com style */}
          <div>
            <h2 className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
              Reports by Cluster
            </h2>
            <div className="space-y-4">
              {activeClusters.map((cluster) => (
                <ClusterCard key={cluster} cluster={cluster} reports={reportsByCluster[cluster]} />
              ))}
            </div>
          </div>

          {/* University grand total */}
          <div>
            <h2 className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
              University Total
            </h2>
            <GrandTotalCard reports={reports} />
          </div>

          {/* Pending clusters — clusters with no reports */}
          {pendingClusters.length > 0 && (
            <div>
              <h2 className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
                Pending ({pendingClusters.length})
              </h2>
              <div className="flex flex-wrap gap-2">
                {pendingClusters.map((cluster) => (
                  <div
                    key={cluster}
                    className="flex items-center gap-2 rounded-lg border border-dashed border-gray-200 px-4 py-2.5 text-sm text-gray-400 dark:border-white/10"
                  >
                    <div className="h-1.5 w-1.5 rounded-full bg-gray-300 dark:bg-gray-600" />
                    {cluster}
                    <span className="text-xs text-gray-300 dark:text-gray-600">no reports</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ─── Stat card ────────────────────────────────────────────
function StatCard({
  label,
  value,
  icon,
  accent = false,
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border p-4 ${
        accent
          ? 'border-error-200 bg-error-50 dark:border-error-500/20 dark:bg-error-500/10'
          : 'border-gray-200 bg-white dark:border-white/5 dark:bg-white/3'
      }`}
    >
      <div className="flex items-center justify-between">
        <p
          className={`text-xs font-medium ${accent ? 'text-error-600 dark:text-error-400' : 'text-gray-500 dark:text-gray-400'}`}
        >
          {label}
        </p>
        <span className={accent ? 'text-error-500' : 'text-gray-400'}>{icon}</span>
      </div>
      <p
        className={`mt-2 text-2xl font-bold ${accent ? 'dark:text-error-100' : 'text-gray-900 dark:text-white'}`}
      >
        {value}
      </p>
    </div>
  );
}

// ─── Headcount breakdown row ──────────────────────────────
function HeadcountRow({ label, value }: { label: string; value: number }) {
  if (value === 0) return null;
  return (
    <div className="flex items-center justify-between py-1.5 text-sm">
      <span className="text-gray-500 dark:text-gray-400">{label}</span>
      <span className="font-medium text-gray-900 tabular-nums dark:text-white">
        {value.toLocaleString()}
      </span>
    </div>
  );
}

// ─── Cluster board card ───────────────────────────────────
function ClusterCard({ cluster, reports }: { cluster: string; reports: EventReport[] }) {
  const [expanded, setExpanded] = useState(false);

  const totals = reports.reduce(
    (acc, r) => {
      HEADCOUNT_FIELDS.forEach(({ key }) => {
        acc[key] = (acc[key] ?? 0) + ((r as any)[key] ?? 0);
      });
      acc.missing_count = (acc.missing_count ?? 0) + (r.missing_count ?? 0);
      acc.casualties_count = (acc.casualties_count ?? 0) + (r.casualties_count ?? 0);
      return acc;
    },
    {} as Record<string, number>
  );

  const totalAffected = HEADCOUNT_FIELDS.reduce((sum, { key }) => sum + (totals[key] ?? 0), 0);
  const hasCasualties = totals.casualties_count > 0;
  const hasMissing = totals.missing_count > 0;

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/5 dark:bg-white/3">
      {/* Cluster header */}
      <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50 px-5 py-4 dark:border-white/5 dark:bg-white/2">
        <div className="flex items-center gap-3">
          <div className="bg-brand-500 flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold text-white">
            {cluster.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">{cluster}</p>
            <p className="text-xs text-gray-400">
              {reports.length} report{reports.length !== 1 ? 's' : ''} submitted
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {hasCasualties && (
            <Badge color="error" size="sm">
              {totals.casualties_count} {totals.casualties_count === 1 ? 'casualty' : 'casualties'}
            </Badge>
          )}
          {hasMissing && (
            <Badge color="warning" size="sm">
              {totals.missing_count} missing
            </Badge>
          )}
          <div className="text-right">
            <p className="text-lg font-bold text-gray-900 tabular-nums dark:text-white">
              {totalAffected.toLocaleString()}
            </p>
            <p className="text-xs text-gray-400">total affected</p>
          </div>
        </div>
      </div>

      {/* Headcount summary */}
      <div className="px-5 py-4">
        <div className="grid grid-cols-2 gap-x-8 divide-y divide-gray-100 sm:grid-cols-3 dark:divide-white/5">
          {HEADCOUNT_FIELDS.map(({ key, label }) => (
            <HeadcountRow key={key} label={label} value={totals[key] ?? 0} />
          ))}
        </div>
      </div>

      {/* Expandable individual reports */}
      {reports.length > 0 && (
        <>
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex w-full items-center justify-between border-t border-gray-100 px-5 py-3 text-xs font-medium text-gray-500 hover:bg-gray-50 dark:border-white/5 dark:hover:bg-white/2"
          >
            <span>Individual reports ({reports.length})</span>
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>

          {expanded && (
            <div className="border-t border-gray-100 dark:border-white/5">
              {reports.map((r, i) => (
                <div
                  key={r.id}
                  className={`px-5 py-4 ${i !== reports.length - 1 ? 'border-b border-gray-100 dark:border-white/5' : ''}`}
                >
                  <div className="mb-3 flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {r.user ? `${r.user.first_name} ${r.user.last_name}` : '—'}
                      </p>
                      <p className="text-xs text-gray-400">
                        {r.unit?.name || '—'} · {r.user?.position?.name || '—'}
                      </p>
                    </div>
                    <div className="flex gap-1.5">
                      {(r.casualties_count ?? 0) > 0 && (
                        <Badge color="error" size="sm">
                          {r.casualties_count} casualties
                        </Badge>
                      )}
                      {(r.missing_count ?? 0) > 0 && (
                        <Badge color="warning" size="sm">
                          {r.missing_count} missing
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Mini headcount grid */}
                  <div className="mb-3 grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-6">
                    {HEADCOUNT_FIELDS.filter(({ key }) => (r as any)[key] > 0).map(
                      ({ key, label }) => (
                        <div
                          key={key}
                          className="rounded-lg bg-gray-50 px-2 py-1.5 dark:bg-white/3"
                        >
                          <p className="text-xs text-gray-400">{label}</p>
                          <p className="text-sm font-semibold text-gray-900 tabular-nums dark:text-white">
                            {(r as any)[key]}
                          </p>
                        </div>
                      )
                    )}
                  </div>

                  {/* Incident details */}
                  {(r.missing_persons.length > 0 ||
                    r.casualties.length > 0 ||
                    r.damages.length > 0) && (
                    <div className="mt-3 space-y-2 rounded-lg border border-gray-100 bg-gray-50 p-3 text-xs dark:border-white/5 dark:bg-white/2">
                      {r.missing_persons.length > 0 && (
                        <div>
                          <span className="text-warning-600 dark:text-warning-400 font-medium">
                            Missing:{' '}
                          </span>
                          <span className="text-gray-600 dark:text-gray-300">
                            {r.missing_persons.map((p) => p.name).join(', ')}
                          </span>
                        </div>
                      )}
                      {r.casualties.length > 0 && (
                        <div>
                          <span className="text-error-600 dark:text-error-400 font-medium">
                            Casualties:{' '}
                          </span>
                          <span className="text-gray-600 dark:text-gray-300">
                            {r.casualties.map((c) => `${c.condition.name} (${c.count})`).join(', ')}
                          </span>
                        </div>
                      )}
                      {r.damages.length > 0 && (
                        <div>
                          <span className="font-medium text-gray-600 dark:text-gray-300">
                            Damage:{' '}
                          </span>
                          <span className="text-gray-600 dark:text-gray-300">
                            {r.damages.map((d) => d.damage_report.name).join(', ')}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {r.location?.name && (
                    <div className="mt-2 flex items-center gap-1.5 text-xs text-gray-400">
                      <MapPin size={11} />
                      {r.location.name}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ─── Grand total row ──────────────────────────────────────
function GrandTotalCard({ reports }: { reports: EventReport[] }) {
  const grandTotals = reports.reduce(
    (acc, r) => {
      HEADCOUNT_FIELDS.forEach(({ key }) => {
        acc[key] = (acc[key] ?? 0) + ((r as any)[key] ?? 0);
      });
      acc.missing_count = (acc.missing_count ?? 0) + (r.missing_count ?? 0);
      acc.casualties_count = (acc.casualties_count ?? 0) + (r.casualties_count ?? 0);
      return acc;
    },
    {} as Record<string, number>
  );

  const totalAffected = HEADCOUNT_FIELDS.reduce((sum, { key }) => sum + (grandTotals[key] ?? 0), 0);

  return (
    <div className="rounded-xl border border-gray-200 bg-white dark:border-white/5 dark:bg-white/3">
      <div className="border-b border-gray-100 bg-gray-50 px-5 py-4 dark:border-white/5 dark:bg-white/2">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-gray-900 dark:text-white">University Total</p>
          <p className="text-2xl font-bold text-gray-900 tabular-nums dark:text-white">
            {totalAffected.toLocaleString()}
            <span className="ml-1.5 text-sm font-normal text-gray-400">total affected</span>
          </p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-x-8 px-5 py-4 sm:grid-cols-3 lg:grid-cols-4">
        {HEADCOUNT_FIELDS.map(({ key, label }) => (
          <div
            key={key}
            className="flex items-center justify-between border-b border-gray-100 py-1.5 text-sm dark:border-white/5"
          >
            <span className="text-gray-500 dark:text-gray-400">{label}</span>
            <span className="font-semibold text-gray-900 tabular-nums dark:text-white">
              {(grandTotals[key] ?? 0).toLocaleString()}
            </span>
          </div>
        ))}
      </div>
      {(grandTotals.casualties_count > 0 || grandTotals.missing_count > 0) && (
        <div className="flex gap-3 border-t border-gray-100 px-5 py-3 dark:border-white/5">
          {grandTotals.casualties_count > 0 && (
            <div className="flex items-center gap-1.5 text-sm">
              <AlertTriangle size={14} className="text-error-500" />
              <span className="text-error-600 dark:text-error-400 font-semibold">
                {grandTotals.casualties_count} total casualties
              </span>
            </div>
          )}
          {grandTotals.missing_count > 0 && (
            <div className="flex items-center gap-1.5 text-sm">
              <UserX size={14} className="text-warning-500" />
              <span className="text-warning-600 dark:text-warning-400 font-semibold">
                {grandTotals.missing_count} total missing
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function EventDetailsPage() {
  return (
    <Suspense fallback={<Spinner />}>
      <EventDetailsContent />
    </Suspense>
  );
}
