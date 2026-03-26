import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { logActivity } from '@/lib/activity-logger';
import toast from 'react-hot-toast';

export type SettingsTable =
  | 'event_scenarios'
  | 'event_actions'
  | 'locations'
  | 'user_types'
  | 'college_units'
  | 'observee_areas'
  | 'observee_roles'
  | 'remarks';

// Maps each table to its display name column
export const NAME_KEY_MAP: Record<SettingsTable, string> = {
  event_scenarios: 'scenario_name',
  event_actions: 'action_name',
  locations: 'location_name',
  user_types: 'type_name',
  college_units: 'name',
  observee_areas: 'area_name',
  observee_roles: 'role_name',
  remarks: 'remark_name',
};

/* ─── Fetch all rows from a settings table ──────────────── */
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

/* ─── Fetch college_units filtered by cluster ───────────── */
export function useCollegeUnits(cluster?: string) {
  return useQuery({
    queryKey: ['college_units', cluster],
    queryFn: async () => {
      let builder = supabase.from('college_units').select('*').eq('is_active', true).order('name');

      if (cluster) {
        builder = builder.eq('cluster', cluster);
      }

      const { data, error } = await builder;
      if (error) throw error;
      return data ?? [];
    },
  });
}

/* ─── Create ─────────────────────────────────────────────── */
export function useCreateSetting(table: SettingsTable, module: string) {
  const queryClient = useQueryClient();
  const nameKey = NAME_KEY_MAP[table];

  return useMutation({
    mutationFn: async (values: Record<string, unknown>) => {
      const { data, error } = await supabase.from(table).insert(values).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [table] });
      logActivity({
        action: 'create',
        docId: data.id,
        docName: String(data[nameKey] ?? data.id),
        module,
      });
      toast.success('Created successfully');
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

/* ─── Update ─────────────────────────────────────────────── */
export function useUpdateSetting(table: SettingsTable, module: string) {
  const queryClient = useQueryClient();
  const nameKey = NAME_KEY_MAP[table];

  return useMutation({
    mutationFn: async ({ id, values }: { id: string; values: Record<string, unknown> }) => {
      const { data, error } = await supabase
        .from(table)
        .update(values)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [table] });
      logActivity({
        action: 'update',
        docId: data.id,
        docName: String(data[nameKey] ?? data.id),
        module,
      });
      toast.success('Updated successfully');
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

/* ─── Delete ─────────────────────────────────────────────── */
export function useDeleteSetting(table: SettingsTable, module: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from(table).delete().eq('id', id);
      if (error) throw error;
      return id;
    },
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: [table] });
      logActivity({
        action: 'delete',
        docId: id,
        docName: id,
        module,
      });
      toast.success('Deleted successfully');
    },
    onError: (err: Error) => toast.error(err.message),
  });
}
