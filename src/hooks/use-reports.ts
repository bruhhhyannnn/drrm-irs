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
      `cluster.ilike.%${query}%,office.ilike.%${query}%,encoder_position.ilike.%${query}%`
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
        .order('created_at', { ascending: true });
      if (error) throw error;
      return data as Report[];
    },
    enabled: !!eventId,
  });
}

export function useTotalAffected(report: Report): number {
  return (
    (report.facultymembers ?? 0) +
    (report.adminmembers ?? 0) +
    (report.repsmembers ?? 0) +
    (report.ramembers ?? 0) +
    (report.students ?? 0) +
    (report.philcarestaff ?? 0) +
    (report.securitypersonnel ?? 0) +
    (report.constructionworkers ?? 0) +
    (report.tenants ?? 0) +
    (report.healthworkers ?? 0) +
    (report.nonacademicstaff ?? 0) +
    (report.guests ?? 0)
  );
}
