'use client';

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { PageBreadcrumb } from '@/components/common/page-breadcrumb';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { CalendarDays, FileText, Users, AlertTriangle } from 'lucide-react';

const CHART_COLORS = ['#a11d1d', '#c53030', '#d65a5a', '#e58e8e', '#f5c6c6'];

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

export default function DashboardPage() {
  const { data: events } = useQuery({
    queryKey: ['dashboard-events'],
    queryFn: async () => {
      const { data } = await supabase
        .from('events')
        .select('event_id, eventname, status, category, timestampstart')
        .order('created_at', { ascending: false })
        .limit(5);
      return data ?? [];
    },
  });

  const { data: stats } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const [eventsRes, reportsRes, usersRes] = await Promise.all([
        supabase.from('events').select('*', { count: 'exact', head: true }),
        supabase.from('reports').select('*', { count: 'exact', head: true }),
        supabase.from('users').select('*', { count: 'exact', head: true }),
      ]);
      return {
        events: eventsRes.count ?? 0,
        reports: reportsRes.count ?? 0,
        users: usersRes.count ?? 0,
      };
    },
  });

  const { data: categoryData } = useQuery({
    queryKey: ['dashboard-categories'],
    queryFn: async () => {
      const { data } = await supabase.from('events').select('category');
      if (!data) return [];
      const counts: Record<string, number> = {};
      data.forEach((e) => {
        counts[e.category] = (counts[e.category] ?? 0) + 1;
      });
      return Object.entries(counts).map(([name, value]) => ({ name, value }));
    },
  });

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
                key={event.event_id}
                className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3 dark:bg-white/2"
              >
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-white">
                    {event.eventname}
                  </p>
                  <p className="text-xs text-gray-500">
                    {event.timestampstart
                      ? format(new Date(event.timestampstart), 'MMM d, yyyy')
                      : '—'}
                  </p>
                </div>
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
              </div>
            ))}
            {!events?.length && <p className="text-center text-sm text-gray-400">No events yet</p>}
          </div>
        </div>

        {/* Events by Category chart */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-white/5 dark:bg-white/3">
          <h3 className="mb-4 text-base font-semibold text-gray-800 dark:text-white">
            Events by Category
          </h3>
          {categoryData?.length ? (
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {categoryData.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
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
      </div>
    </div>
  );
}
