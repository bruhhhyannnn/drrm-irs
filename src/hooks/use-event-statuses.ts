import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getEventStatuses,
  // getEventStatus,
  createEventStatus,
  updateEventStatus,
  deleteEventStatus,
} from '@/actions';

export function useEventStatuses() {
  return useQuery({
    queryKey: ['event_statuses'],
    queryFn: getEventStatuses,
  });
}

// export function useEventStatus(id?: string) {
//   return useQuery({
//     queryKey: ['event_status', id],
//     queryFn: () => getEventStatus(id!),
//     enabled: !!id,
//   });
// }

export function useCreateEventStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { name: string; is_active?: boolean }) => createEventStatus(data.name),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['event_statuses'] }),
  });
}

export function useUpdateEventStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: { name?: string; is_active?: boolean } }) =>
      updateEventStatus(id, data),
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['event_statuses'] });
      queryClient.invalidateQueries({ queryKey: ['event_status', id] });
    },
  });
}

export function useDeleteEventStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteEventStatus(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['event_statuses'] }),
  });
}
