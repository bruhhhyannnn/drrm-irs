import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUnits, getUnit, createUnit, updateUnit, deleteUnit } from '@/actions';

export function useUnits(clusterId?: string) {
  return useQuery({
    queryKey: ['units', clusterId],
    queryFn: () => getUnits(clusterId),
  });
}

export function useUnit(id?: string) {
  return useQuery({
    queryKey: ['unit', id],
    queryFn: () => getUnit(id!),
    enabled: !!id,
  });
}

export function useCreateUnit() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { name: string; cluster_id: string; is_active?: boolean }) =>
      createUnit(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['units'] }),
  });
}

export function useUpdateUnit() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: { name?: string; cluster_id?: string; is_active?: boolean };
    }) => updateUnit(id, data),
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['units'] });
      queryClient.invalidateQueries({ queryKey: ['unit', id] });
    },
  });
}

export function useDeleteUnit() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteUnit(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['units'] }),
  });
}
