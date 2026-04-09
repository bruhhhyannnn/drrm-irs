import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getPositions,
  getPosition,
  createPosition,
  updatePosition,
  deletePosition,
} from '@/actions';

export function usePositions() {
  return useQuery({
    queryKey: ['positions'],
    queryFn: getPositions,
  });
}

export function usePosition(id?: string) {
  return useQuery({
    queryKey: ['position', id],
    queryFn: () => getPosition(id!),
    enabled: !!id,
  });
}

export function useCreatePosition() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { name: string; is_active?: boolean }) => createPosition(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['positions'] }),
  });
}

export function useUpdatePosition() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: { name?: string; is_active?: boolean } }) =>
      updatePosition(id, data),
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['positions'] });
      queryClient.invalidateQueries({ queryKey: ['position', id] });
    },
  });
}

export function useDeletePosition() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deletePosition(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['positions'] }),
  });
}
