import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getSettingsItems,
  createSettingsItem,
  updateSettingsItem,
  deleteSettingsItem,
  SettingsTable,
} from '@/actions';

export function useSettingsTable(table: SettingsTable) {
  return useQuery({
    queryKey: [table],
    queryFn: () => getSettingsItems(table),
  });
}

export function useCreateSetting(table: SettingsTable) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => createSettingsItem(table, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [table] }),
  });
}

export function useUpdateSetting(table: SettingsTable) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) =>
      updateSettingsItem(table, id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [table] }),
  });
}

export function useDeleteSetting(table: SettingsTable) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteSettingsItem(table, id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [table] }),
  });
}
