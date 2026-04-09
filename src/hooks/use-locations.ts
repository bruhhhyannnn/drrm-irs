import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getLocations,
  getLocation,
  createLocation,
  updateLocation,
  deleteLocation,
} from '@/actions';

export function useLocations(clusterId?: string) {
  return useQuery({
    queryKey: ['locations', clusterId],
    queryFn: () => getLocations(clusterId),
  });
}

export function useLocation(id?: string) {
  return useQuery({
    queryKey: ['location', id],
    queryFn: () => getLocation(id!),
    enabled: !!id,
  });
}

export function useCreateLocation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { name: string; cluster_id: string; is_active?: boolean }) =>
      createLocation(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['locations'] }),
  });
}

export function useUpdateLocation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: { name?: string; cluster_id?: string; is_active?: boolean };
    }) => updateLocation(id, data),
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['locations'] });
      queryClient.invalidateQueries({ queryKey: ['location', id] });
    },
  });
}

export function useDeleteLocation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteLocation(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['locations'] }),
  });
}
