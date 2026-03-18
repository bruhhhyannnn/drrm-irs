import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { logActivity } from '@/lib/activity-logger';
import toast from 'react-hot-toast';

type SettingsTable =
  | 'event-scenarios'
  | 'event-actions'
  | 'locations'
  | 'user-types'
  | 'colleges-units'
  | 'buildings-zones'
  | 'observee-areas'
  | 'observee-roles'
  | 'remarks';

type ModuleName = string;

/* ─── Generic fetch for any settings table ─── */
async function fetchSettingsTable(table: SettingsTable) {
  const { data, error } = await supabase
    .from(table)
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export function useSettingsTable(table: SettingsTable) {
  return useQuery({
    queryKey: [table],
    queryFn: () => fetchSettingsTable(table),
  });
}

/* ─── Generic create mutation ─── */
export function useCreateSetting(table: SettingsTable, module: ModuleName) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: Record<string, unknown>) => {
      const { data, error } = await supabase.from(table).insert(values).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [table] });
      logActivity({ action: 'create', docID: data.id, docName: data.name ?? data.id, module });
      toast.success('Created successfully');
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

/* ─── Generic update mutation ─── */
export function useUpdateSetting(table: SettingsTable, module: ModuleName) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, values }: { id: string; values: Record<string, unknown> }) => {
      const { data, error } = await supabase.from(table).update(values).eq('id', id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [table] });
      logActivity({ action: 'update', docID: data.id, docName: data.name ?? data.id, module });
      toast.success('Updated successfully');
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

/* ─── Generic delete mutation ─── */
export function useDeleteSetting(table: SettingsTable, module: ModuleName) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from(table).delete().eq('id', id);
      if (error) throw error;
      return id;
    },
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: [table] });
      logActivity({ action: 'delete', docID: id, docName: id, module });
      toast.success('Deleted successfully');
    },
    onError: (err: Error) => toast.error(err.message),
  });
}
