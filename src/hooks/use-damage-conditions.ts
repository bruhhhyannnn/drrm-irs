import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getDamageConditions,
  // getDamageCondition,
  createDamageCondition,
  updateDamageCondition,
  deleteDamageCondition,
} from '@/actions';

export function useDamageConditions() {
  return useQuery({
    queryKey: ['damage_reports'],
    queryFn: getDamageConditions,
  });
}

// export function useDamageCondition(id?: string) {
//   return useQuery({
//     queryKey: ['damage_report', id],
//     queryFn: () => getDamageCondition(id!),
//     enabled: !!id,
//   });
// }

export function useCreateDamageCondition() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { name: string; is_active?: boolean }) => createDamageCondition(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['damage_reports'] }),
  });
}

export function useUpdateDamageCondition() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: { name?: string; is_active?: boolean } }) =>
      updateDamageCondition(id, data),
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['damage_reports'] });
      queryClient.invalidateQueries({ queryKey: ['damage_report', id] });
    },
  });
}

export function useDeleteDamageCondition() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteDamageCondition(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['damage_reports'] }),
  });
}
