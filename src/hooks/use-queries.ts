import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { User, ActivityLog, News } from '@/types/database';

const PER_PAGE = 10;

/* ─── Users ──────────────────────────────────────────────── */
async function fetchUsers(query?: string): Promise<User[]> {
  let builder = supabase
    .from('users')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(500);

  if (query) {
    const q = query.trim();
    builder = builder.or(
      `firstname.ilike.%${q}%,lastname.ilike.%${q}%,email.ilike.%${q}%,username.ilike.%${q}%`
    );
  }

  const { data, error } = await builder;
  if (error) throw error;
  return data ?? [];
}

export function useUsers(query?: string) {
  return useQuery({
    queryKey: ['users', query],
    queryFn: () => fetchUsers(query),
  });
}

export function useUser(id?: string) {
  return useQuery({
    queryKey: ['user', id],
    queryFn: async () => {
      const { data, error } = await supabase.from('users').select('*').eq('id', id).single();
      if (error) throw error;
      return data as User;
    },
    enabled: !!id,
  });
}

/* ─── Activity Logs ──────────────────────────────────────── */
interface ActivityLogsResult {
  data: ActivityLog[];
  total: number;
}

async function fetchActivityLogs(page: number, query?: string): Promise<ActivityLogsResult> {
  let builder = supabase.from('activity_logs').select('*', { count: 'exact' });

  if (query) {
    builder = builder.or(
      `module.ilike.%${query}%,action.ilike.%${query}%,doc_name.ilike.%${query}%`
    );
  }

  const from = (page - 1) * PER_PAGE;
  builder = builder.order('created_at', { ascending: false }).range(from, from + PER_PAGE - 1);

  const { data, error, count } = await builder;
  if (error) throw error;
  return { data: data ?? [], total: count ?? 0 };
}

export function useActivityLogs(page: number, query?: string) {
  return useQuery({
    queryKey: ['activity-logs', page, query],
    queryFn: () => fetchActivityLogs(page, query),
  });
}

/* ─── News ───────────────────────────────────────────────── */
interface NewsResult {
  data: News[];
  total: number;
}

async function fetchNews(page: number, query?: string): Promise<NewsResult> {
  let builder = supabase.from('news').select('*', { count: 'exact' });

  if (query) {
    builder = builder.or(
      `title.ilike.%${query}%,author.ilike.%${query}%,category.ilike.%${query}%`
    );
  }

  const from = (page - 1) * PER_PAGE;
  builder = builder.order('created_at', { ascending: false }).range(from, from + PER_PAGE - 1);

  const { data, error, count } = await builder;
  if (error) throw error;
  return { data: data ?? [], total: count ?? 0 };
}

export function useNews(page: number, query?: string) {
  return useQuery({
    queryKey: ['news', page, query],
    queryFn: () => fetchNews(page, query),
  });
}

export function useNewsItem(id?: string) {
  return useQuery({
    queryKey: ['news-item', id],
    queryFn: async () => {
      const { data, error } = await supabase.from('news').select('*').eq('id', id).single();
      if (error) throw error;
      return data as News;
    },
    enabled: !!id,
  });
}
