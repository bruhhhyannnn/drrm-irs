'use client';

import { PageBreadcrumb } from '@/components/common';
import { Badge } from '@/components/ui';
import { format } from 'date-fns';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts';
import { CalendarDays, FileText, Users, AlertTriangle } from 'lucide-react';
import { useEvents, useReports, useUsers, useReportClusterSummary } from '@/hooks';

const CLUSTER_COLOR = '#a11d1d';

const STATUS_COLORS: Record<string, string> = {
  upcoming: '#f59e0b',
  ongoing: '#22c55e',
  completed: CLUSTER_COLOR,
  Unknown: '#9ca3af',
};

export default function DashboardPage() {
  const { data: events } = useEvents();
  const { data: reportsData } = useReports(1);
  const { data: users = [] } = useUsers();
  const { data: clusterSummary = [] } = useReportClusterSummary();

  const stats = {
    events: events?.length,
    reports: reportsData?.total ?? 0,
    users: users.length,
  };

  const statusData = Object.entries(
    (events ?? []).reduce(
      (acc, e) => {
        const key = e.status?.name ?? 'Unknown';
        acc[key] = (acc[key] ?? 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    )
  ).map(([name, value]) => ({ name, value }));

  return (
    <div className="space-y-6">
      <PageBreadcrumb pageTitle="Dashboard" />

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Events"
          value={stats?.events ?? '—'}
          icon={<CalendarDays size={20} />}
          color="brand"
        />
        <StatCard
          title="Total Reports"
          value={stats?.reports ?? '—'}
          icon={<FileText size={20} />}
          color="success"
        />
        <StatCard
          title="Total Users"
          value={stats?.users ?? '—'}
          icon={<Users size={20} />}
          color="warning"
        />
        <StatCard
          title="Active Incidents"
          value="—"
          icon={<AlertTriangle size={20} />}
          color="error"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* Recent Events */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-white/5 dark:bg-white/3">
          <h3 className="mb-4 text-base font-semibold text-gray-800 dark:text-white">
            Recent Events
          </h3>
          <div className="space-y-3">
            {events?.map((event) => (
              <div
                key={event.id}
                className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3 dark:bg-white/2"
              >
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-white">{event.name}</p>
                  <p className="text-xs text-gray-500">
                    {event.started_at ? format(new Date(event.started_at), 'MMM d, yyyy') : '—'}
                  </p>
                </div>
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
              </div>
            ))}
            {!events?.length && (
              <div className="flex h-60 items-center justify-center">
                <p className="text-sm text-gray-400">No events yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Events by Status chart */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-white/5 dark:bg-white/3">
          <h3 className="mb-4 text-base font-semibold text-gray-800 dark:text-white">
            Events by Status
          </h3>
          {statusData.length ? (
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {statusData.map((entry) => (
                    <Cell
                      key={entry.name}
                      fill={STATUS_COLORS[entry.name] ?? STATUS_COLORS.Unknown}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-60 items-center justify-center">
              <p className="text-sm text-gray-400">No data yet</p>
            </div>
          )}
        </div>

        {/* Reports by Cluster chart */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 xl:col-span-2 dark:border-white/5 dark:bg-white/3">
          <h3 className="mb-4 text-base font-semibold text-gray-800 dark:text-white">
            Reports by Cluster
          </h3>
          {clusterSummary.length ? (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={clusterSummary} margin={{ top: 0, right: 16, left: -16, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(156,163,175,0.2)" />
                <XAxis
                  dataKey="cluster"
                  tick={{ fontSize: 12, fill: '#9ca3af' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 12, fill: '#9ca3af' }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    background: 'rgba(17,24,39,0.9)',
                    border: 'none',
                    borderRadius: 8,
                    color: '#f9fafb',
                    fontSize: 13,
                  }}
                />
                <Legend />
                <Bar dataKey="reports" name="Reports" fill={CLUSTER_COLOR} radius={[4, 4, 0, 0]} />
                <Bar dataKey="casualties" name="Casualties" fill="#ef4444" radius={[4, 4, 0, 0]} />
                <Bar dataKey="missing" name="Missing" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-60 items-center justify-center">
              <p className="text-sm text-gray-400">No reports submitted yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
  color = 'brand',
}: {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color?: 'brand' | 'success' | 'warning' | 'error';
}) {
  const bg = {
    brand: 'bg-brand-50 dark:bg-brand-900/20',
    success: 'bg-success-50 dark:bg-success-500/10',
    warning: 'bg-warning-50 dark:bg-warning-500/10',
    error: 'bg-error-50 dark:bg-error-500/10',
  };
  const text = {
    brand: 'text-brand-500 dark:text-brand-400',
    success: 'text-success-600 dark:text-success-500',
    warning: 'text-warning-600 dark:text-warning-500',
    error: 'text-error-600 dark:text-error-500',
  };

  return (
    <div className="shadow-theme-sm relative overflow-hidden rounded-xl bg-white p-6 ring-1 ring-gray-900/5 dark:bg-gray-800 dark:ring-white/10">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className={`text-sm font-medium ${text[color]}`}>{title}</p>
          {value === undefined || value === null ? (
            <div className="h-8 w-24 animate-pulse rounded-md bg-gray-200 dark:bg-gray-700" />
          ) : (
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
          )}
        </div>
        <div className={`rounded-lg p-3 ${bg[color]} ${text[color]}`}>
          <div className="flex h-6 w-6 items-center justify-center">{icon}</div>
        </div>
      </div>
      <div
        className={`absolute -right-6 -bottom-6 h-24 w-24 rounded-full ${bg[color]} opacity-20`}
      />
    </div>
  );
}
