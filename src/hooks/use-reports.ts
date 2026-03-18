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
    builder = builder.ilike('eventname', `%${query}%`);
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
