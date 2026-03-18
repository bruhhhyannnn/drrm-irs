import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { Event } from '@/types/database';

async function fetchEvents(query?: string): Promise<Event[]> {
  let builder = supabase.from('events').select('*').order('created_at', { ascending: false }).limit(100);

  if (query) {
    builder = builder.ilike('eventname', `%${query}%`);
  }

  const { data, error } = await builder;
  if (error) throw error;
  return data ?? [];
}

export function useEvents(query?: string) {
  return useQuery({
    queryKey: ['events', query],
    queryFn: () => fetchEvents(query),
  });
}
