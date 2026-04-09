import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getClusters, getCluster, createCluster, updateCluster, deleteCluster } from '@/actions';

export function useClusters() {
  return useQuery({
    queryKey: ['clusters'],
    queryFn: getClusters,
  });
}

export function useCluster(id?: string) {
  return useQuery({
    queryKey: ['cluster', id],
    queryFn: () => getCluster(id!),
    enabled: !!id,
  });
}

export function useCreateCluster() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { name: string; is_active?: boolean }) => createCluster(data.name),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['clusters'] }),
  });
}

export function useUpdateCluster() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: { name?: string; is_active?: boolean } }) =>
      updateCluster(id, data),
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['clusters'] });
      queryClient.invalidateQueries({ queryKey: ['cluster', id] });
    },
  });
}

export function useDeleteCluster() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteCluster(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['clusters'] }),
  });
}
