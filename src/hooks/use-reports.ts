import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { Report } from '@/types/database';

const PER_PAGE = 10;

interface ReportsResult {
  data: Report[];
  total: number;
}

async function fetchReports(page: number, query?: string): Promise<ReportsResult> {
  let builder = supabase.from('reports').select('*', { count: 'exact' });

  if (query) {
    builder = builder.or(
      `cluster.ilike.%${query}%,college_unit.ilike.%${query}%,encoder_name.ilike.%${query}%`
    );
  }

  const from = (page - 1) * PER_PAGE;
  builder = builder.order('created_at', { ascending: false }).range(from, from + PER_PAGE - 1);

  const { data, error, count } = await builder;
  if (error) throw error;
  return { data: data ?? [], total: count ?? 0 };
}

export function useReports(page: number, query?: string) {
  return useQuery({
    queryKey: ['reports', page, query],
    queryFn: () => fetchReports(page, query),
  });
}

export function useEventReports(eventId?: string) {
  return useQuery({
    queryKey: ['event-reports', eventId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .eq('event_id', eventId)
        .order('submitted_at', { ascending: true });
      if (error) throw error;
      return data as Report[];
    },
    enabled: !!eventId,
  });
}

export function useTotalAffected(report: Report): number {
  return (
    (report.faculty_members ?? 0) +
    (report.admin_members ?? 0) +
    (report.reps_members ?? 0) +
    (report.ra_members ?? 0) +
    (report.students ?? 0) +
    (report.philcare_staff ?? 0) +
    (report.security_personnel ?? 0) +
    (report.construction_workers ?? 0) +
    (report.tenants ?? 0) +
    (report.health_workers ?? 0) +
    (report.non_academic_staff ?? 0) +
    (report.guests ?? 0)
  );
}
